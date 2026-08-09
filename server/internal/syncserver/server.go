package syncserver

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"html/template"
	"io"
	"log/slog"
	"net/http"
	"net/url"
	"strings"
	"sync"
	"sync/atomic"
	"time"

	"github.com/coder/websocket"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Server struct {
	config Config
	db     *pgxpool.Pool
	logger *slog.Logger
	hub    *hub
}

type discordToken struct {
	AccessToken string `json:"access_token"`
	TokenType   string `json:"token_type"`
}

type discordUser struct {
	ID         string  `json:"id"`
	Username   string  `json:"username"`
	GlobalName *string `json:"global_name"`
	Avatar     *string `json:"avatar"`
}

type principal struct {
	UserID string
}

type syncDocument struct {
	Revision  int64           `json:"revision"`
	Document  json.RawMessage `json:"document"`
	UpdatedAt time.Time       `json:"updated_at"`
}

var requestSequence atomic.Uint64

type syncDocumentInfo struct {
	Format       string
	Version      int
	Bytes        int
	Hash         string
	Events       int
	MaxClock     int64
	EventClients int
}

func inspectSyncDocument(document json.RawMessage) syncDocumentInfo {
	hash := sha256.Sum256(document)
	info := syncDocumentInfo{Format: "plain", Bytes: len(document), Hash: fmt.Sprintf("%x", hash[:8])}
	var payload struct {
		Format  string `json:"format"`
		Version int    `json:"version"`
		Events  []struct {
			ClientID string `json:"clientId"`
			Clock    int64  `json:"clock"`
		} `json:"events"`
	}
	if json.Unmarshal(document, &payload) != nil {
		info.Format = "invalid"
		return info
	}
	info.Version = payload.Version
	if payload.Format != "" {
		info.Format = payload.Format
	}
	clients := make(map[string]struct{})
	for _, event := range payload.Events {
		info.Events++
		info.MaxClock = max(info.MaxClock, event.Clock)
		if event.ClientID != "" {
			clients[event.ClientID] = struct{}{}
		}
	}
	info.EventClients = len(clients)
	return info
}

func syncDocumentLogValue(document json.RawMessage) slog.Value {
	info := inspectSyncDocument(document)
	return slog.GroupValue(
		slog.String("format", info.Format),
		slog.Int("version", info.Version),
		slog.Int("bytes", info.Bytes),
		slog.String("hash", info.Hash),
		slog.Int("events", info.Events),
		slog.Int64("max_clock", info.MaxClock),
		slog.Int("event_clients", info.EventClients),
	)
}

func New(ctx context.Context, config Config, logger *slog.Logger) (*Server, error) {
	db, err := pgxpool.New(ctx, config.DatabaseURL)
	if err != nil {
		return nil, err
	}
	if err := db.Ping(ctx); err != nil {
		db.Close()
		return nil, err
	}

	server := &Server{config: config, db: db, logger: logger, hub: newHub()}
	if err := server.migrate(ctx); err != nil {
		db.Close()
		return nil, err
	}
	go server.cleanup(ctx)
	go server.listenForChanges(ctx)
	return server, nil
}

func (s *Server) Close() { s.db.Close() }

func (s *Server) Handler() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, _ *http.Request) {
		writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
	})
	mux.HandleFunc("POST /v1/auth/requests", s.createAuthRequest)
	mux.HandleFunc("POST /v1/auth/requests/{id}/exchange", s.exchangeAuthRequest)
	mux.HandleFunc("GET /v1/oauth/callback", s.oauthCallback)
	mux.Handle("GET /v1/sync", s.authenticate(http.HandlerFunc(s.getSync)))
	mux.Handle("PUT /v1/sync", s.authenticate(http.HandlerFunc(s.putSync)))
	mux.HandleFunc("GET /v1/sync/ws", s.syncWebSocket)
	mux.Handle("DELETE /v1/session", s.authenticate(http.HandlerFunc(s.deleteSession)))
	return secureHeaders(requestLog(s.logger, mux))
}

func (s *Server) migrate(ctx context.Context) error {
	_, err := s.db.Exec(ctx, `
CREATE TABLE IF NOT EXISTS sync_users (
  discord_user_id text PRIMARY KEY,
  username text NOT NULL,
  global_name text,
  avatar text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS auth_requests (
  id text PRIMARY KEY,
  state_hash bytea NOT NULL UNIQUE,
  verifier_hash bytea NOT NULL,
  discord_user_id text REFERENCES sync_users(discord_user_id),
  expires_at timestamptz NOT NULL,
  authorized_at timestamptz
);
CREATE TABLE IF NOT EXISTS sync_sessions (
  token_hash bytea PRIMARY KEY,
  discord_user_id text NOT NULL REFERENCES sync_users(discord_user_id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);
CREATE TABLE IF NOT EXISTS sync_documents (
  discord_user_id text PRIMARY KEY REFERENCES sync_users(discord_user_id) ON DELETE CASCADE,
  revision bigint NOT NULL,
  document jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS auth_requests_expires_at_idx ON auth_requests(expires_at);
CREATE INDEX IF NOT EXISTS sync_sessions_expires_at_idx ON sync_sessions(expires_at);
`)
	return err
}

func (s *Server) createAuthRequest(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Challenge string `json:"challenge"`
	}
	if err := decodeJSON(w, r, &body, 4096); err != nil {
		return
	}
	challenge, err := base64.RawURLEncoding.DecodeString(body.Challenge)
	if err != nil || len(challenge) != sha256.Size {
		writeError(w, http.StatusBadRequest, "challenge must be a base64url SHA-256 digest")
		return
	}

	id := randomToken(24)
	state := randomToken(32)
	stateHash := sha256.Sum256([]byte(state))
	expiresAt := time.Now().Add(s.config.AuthRequestTTL)
	_, err = s.db.Exec(r.Context(), `INSERT INTO auth_requests (id, state_hash, verifier_hash, expires_at) VALUES ($1,$2,$3,$4)`, id, stateHash[:], challenge, expiresAt)
	if err != nil {
		s.logger.Error("create auth request", "error", err)
		writeError(w, http.StatusInternalServerError, "could not start authorization")
		return
	}

	query := url.Values{
		"response_type": {"code"},
		"client_id":     {s.config.DiscordClientID},
		"scope":         {"identify"},
		"state":         {state},
		"redirect_uri":  {s.config.PublicBaseURL + "/v1/oauth/callback"},
		"prompt":        {"consent"},
	}
	writeJSON(w, http.StatusCreated, map[string]any{
		"request_id":    id,
		"authorize_url": "https://discord.com/oauth2/authorize?" + query.Encode(),
		"expires_at":    expiresAt,
	})
}

func (s *Server) oauthCallback(w http.ResponseWriter, r *http.Request) {
	state := r.URL.Query().Get("state")
	code := r.URL.Query().Get("code")
	if state == "" || code == "" {
		s.renderOAuthResult(w, false, "Discord authorization was cancelled or incomplete.")
		return
	}
	stateHash := sha256.Sum256([]byte(state))
	var requestID string
	err := s.db.QueryRow(r.Context(), `SELECT id FROM auth_requests WHERE state_hash=$1 AND expires_at>now() AND authorized_at IS NULL`, stateHash[:]).Scan(&requestID)
	if err != nil {
		s.renderOAuthResult(w, false, "This authorization request is invalid or expired.")
		return
	}

	token, err := s.exchangeDiscordCode(r.Context(), code)
	if err != nil {
		s.logger.Warn("discord token exchange failed", "error", err)
		s.renderOAuthResult(w, false, "Discord authorization could not be verified.")
		return
	}
	user, err := s.fetchDiscordUser(r.Context(), token)
	if err != nil {
		s.logger.Warn("discord user fetch failed", "error", err)
		s.renderOAuthResult(w, false, "Discord identity could not be read.")
		return
	}

	tx, err := s.db.Begin(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "database unavailable")
		return
	}
	defer tx.Rollback(r.Context())
	_, err = tx.Exec(r.Context(), `INSERT INTO sync_users (discord_user_id,username,global_name,avatar) VALUES ($1,$2,$3,$4)
ON CONFLICT (discord_user_id) DO UPDATE SET username=excluded.username,global_name=excluded.global_name,avatar=excluded.avatar,updated_at=now()`, user.ID, user.Username, user.GlobalName, user.Avatar)
	if err == nil {
		_, err = tx.Exec(r.Context(), `UPDATE auth_requests SET discord_user_id=$1,authorized_at=now() WHERE id=$2 AND authorized_at IS NULL`, user.ID, requestID)
	}
	if err != nil || tx.Commit(r.Context()) != nil {
		writeError(w, http.StatusInternalServerError, "authorization could not be saved")
		return
	}
	s.renderOAuthResult(w, true, "BetterStatus sync is authorized. You can close this tab and return to Discord.")
}

func (s *Server) exchangeAuthRequest(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Verifier string `json:"verifier"`
	}
	if err := decodeJSON(w, r, &body, 4096); err != nil {
		return
	}
	verifierHash := sha256.Sum256([]byte(body.Verifier))
	var expectedHash []byte
	var userID string
	err := s.db.QueryRow(r.Context(), `SELECT verifier_hash,discord_user_id FROM auth_requests WHERE id=$1 AND expires_at>now() AND authorized_at IS NOT NULL`, r.PathValue("id")).Scan(&expectedHash, &userID)
	if errors.Is(err, pgx.ErrNoRows) {
		writeError(w, http.StatusConflict, "authorization is pending or expired")
		return
	}
	if err != nil || subtle.ConstantTimeCompare(verifierHash[:], expectedHash) != 1 {
		writeError(w, http.StatusUnauthorized, "invalid authorization verifier")
		return
	}

	token := randomToken(32)
	tokenHash := sha256.Sum256([]byte(token))
	expiresAt := time.Now().Add(s.config.SessionTTL)
	tx, err := s.db.Begin(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "database unavailable")
		return
	}
	defer tx.Rollback(r.Context())
	if _, err = tx.Exec(r.Context(), `INSERT INTO sync_sessions (token_hash,discord_user_id,expires_at) VALUES ($1,$2,$3)`, tokenHash[:], userID, expiresAt); err == nil {
		_, err = tx.Exec(r.Context(), `DELETE FROM auth_requests WHERE id=$1`, r.PathValue("id"))
	}
	if err != nil || tx.Commit(r.Context()) != nil {
		writeError(w, http.StatusInternalServerError, "session could not be created")
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"token": token, "expires_at": expiresAt, "discord_user_id": userID})
}

func (s *Server) exchangeDiscordCode(ctx context.Context, code string) (string, error) {
	form := url.Values{
		"client_id": {s.config.DiscordClientID}, "client_secret": {s.config.DiscordClientSecret},
		"grant_type": {"authorization_code"}, "code": {code},
		"redirect_uri": {s.config.PublicBaseURL + "/v1/oauth/callback"},
	}
	req, _ := http.NewRequestWithContext(ctx, http.MethodPost, "https://discord.com/api/oauth2/token", strings.NewReader(form.Encode()))
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	response, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		return "", fmt.Errorf("token endpoint returned %s", response.Status)
	}
	var token discordToken
	if err := json.NewDecoder(io.LimitReader(response.Body, 1<<20)).Decode(&token); err != nil {
		return "", err
	}
	if token.AccessToken == "" {
		return "", errors.New("empty Discord access token")
	}
	return token.AccessToken, nil
}

func (s *Server) fetchDiscordUser(ctx context.Context, token string) (discordUser, error) {
	req, _ := http.NewRequestWithContext(ctx, http.MethodGet, "https://discord.com/api/v10/users/@me", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	response, err := http.DefaultClient.Do(req)
	if err != nil {
		return discordUser{}, err
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		return discordUser{}, fmt.Errorf("user endpoint returned %s", response.Status)
	}
	var user discordUser
	err = json.NewDecoder(io.LimitReader(response.Body, 1<<20)).Decode(&user)
	return user, err
}

func (s *Server) authenticate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer ")
		userID, ok := s.authenticateToken(r.Context(), token)
		if !ok {
			writeError(w, http.StatusUnauthorized, "invalid or expired session")
			return
		}
		next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), principalKey{}, principal{UserID: userID})))
	})
}

func (s *Server) authenticateToken(ctx context.Context, token string) (string, bool) {
	if token == "" {
		return "", false
	}
	hash := sha256.Sum256([]byte(token))
	var userID string
	err := s.db.QueryRow(ctx, `SELECT discord_user_id FROM sync_sessions WHERE token_hash=$1 AND expires_at>now()`, hash[:]).Scan(&userID)
	return userID, err == nil
}

type principalKey struct{}

func principalFrom(r *http.Request) principal { return r.Context().Value(principalKey{}).(principal) }

func (s *Server) getSync(w http.ResponseWriter, r *http.Request) {
	userID := principalFrom(r).UserID
	document, err := s.readDocument(r.Context(), userID)
	if err != nil {
		s.logger.Error("sync read failed", "user_id", userID, "client_id", r.Header.Get("X-BetterStatus-Client"), "error", err)
		writeError(w, http.StatusInternalServerError, "sync document could not be read")
		return
	}
	s.logger.Info("sync read", "user_id", userID, "client_id", r.Header.Get("X-BetterStatus-Client"), "revision", document.Revision, "updated_at", document.UpdatedAt, "document", syncDocumentLogValue(document.Document))
	writeJSON(w, http.StatusOK, document)
}

func (s *Server) putSync(w http.ResponseWriter, r *http.Request) {
	var body struct {
		BaseRevision int64           `json:"base_revision"`
		Document     json.RawMessage `json:"document"`
	}
	if err := decodeJSON(w, r, &body, s.config.MaxDocumentBytes); err != nil {
		return
	}
	if body.BaseRevision < 0 || len(body.Document) == 0 || !json.Valid(body.Document) {
		writeError(w, http.StatusBadRequest, "invalid sync document")
		return
	}
	userID := principalFrom(r).UserID
	clientID := r.Header.Get("X-BetterStatus-Client")
	s.logger.Info("sync write attempt",
		"user_id", userID,
		"client_id", clientID,
		"base_revision", body.BaseRevision,
		"client_schema", r.Header.Get("X-BetterStatus-Schema"),
		"client_events", r.Header.Get("X-BetterStatus-Events"),
		"client_max_clock", r.Header.Get("X-BetterStatus-Max-Clock"),
		"document", syncDocumentLogValue(body.Document),
	)
	var document syncDocument
	err := s.db.QueryRow(r.Context(), `
INSERT INTO sync_documents (discord_user_id,revision,document)
SELECT $1,1,$2 WHERE $3=0
ON CONFLICT (discord_user_id) DO UPDATE SET revision=sync_documents.revision+1,document=excluded.document,updated_at=now()
WHERE sync_documents.revision=$3 AND sync_documents.document IS DISTINCT FROM excluded.document
RETURNING revision,document,updated_at`, userID, body.Document, body.BaseRevision).Scan(&document.Revision, &document.Document, &document.UpdatedAt)
	if errors.Is(err, pgx.ErrNoRows) {
		current, readErr := s.readDocument(r.Context(), userID)
		if readErr != nil {
			s.logger.Error("sync conflict read failed", "user_id", userID, "client_id", clientID, "base_revision", body.BaseRevision, "error", readErr)
			writeError(w, http.StatusConflict, "sync conflict")
			return
		}
		if current.Revision == body.BaseRevision {
			// An idempotent retry is already committed. Do not create another
			// revision or WebSocket broadcast for the same JSON document.
			s.logger.Info("sync write no-op", "user_id", userID, "client_id", clientID, "base_revision", body.BaseRevision, "revision", current.Revision, "document", syncDocumentLogValue(current.Document))
			writeJSON(w, http.StatusOK, current)
			return
		}
		s.logger.Warn("sync write conflict", "user_id", userID, "client_id", clientID, "base_revision", body.BaseRevision, "current_revision", current.Revision, "incoming_document", syncDocumentLogValue(body.Document), "current_document", syncDocumentLogValue(current.Document))
		writeJSON(w, http.StatusConflict, map[string]any{"error": "sync conflict", "current": current})
		return
	}
	if err != nil {
		s.logger.Error("sync write failed", "user_id", userID, "client_id", clientID, "base_revision", body.BaseRevision, "error", err)
		writeError(w, http.StatusInternalServerError, "sync document could not be saved")
		return
	}
	s.logger.Info("sync write accepted", "user_id", userID, "client_id", clientID, "base_revision", body.BaseRevision, "revision", document.Revision, "document", syncDocumentLogValue(document.Document))
	if _, err := s.db.Exec(r.Context(), `SELECT pg_notify('betterstatus_sync', $1)`, userID); err != nil {
		s.logger.Warn("sync notification failed", "error", err)
		s.hub.broadcast(userID, document)
	}
	writeJSON(w, http.StatusOK, document)
}

func (s *Server) readDocument(ctx context.Context, userID string) (syncDocument, error) {
	var document syncDocument
	err := s.db.QueryRow(ctx, `SELECT revision,document,updated_at FROM sync_documents WHERE discord_user_id=$1`, userID).Scan(&document.Revision, &document.Document, &document.UpdatedAt)
	if errors.Is(err, pgx.ErrNoRows) {
		return syncDocument{Revision: 0, Document: json.RawMessage(`{}`), UpdatedAt: time.Time{}}, nil
	}
	return document, err
}

func (s *Server) syncWebSocket(w http.ResponseWriter, r *http.Request) {
	connection, err := websocket.Accept(w, r, &websocket.AcceptOptions{OriginPatterns: []string{"*"}})
	if err != nil {
		return
	}
	defer connection.CloseNow()
	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	_, payload, err := connection.Read(ctx)
	cancel()
	if err != nil {
		return
	}
	var auth struct {
		Type     string `json:"type"`
		Token    string `json:"token"`
		ClientID string `json:"client_id"`
	}
	if json.Unmarshal(payload, &auth) != nil || auth.Type != "auth" {
		connection.Close(websocket.StatusPolicyViolation, "authentication required")
		return
	}
	userID, ok := s.authenticateToken(r.Context(), auth.Token)
	if !ok {
		connection.Close(websocket.StatusPolicyViolation, "invalid session")
		return
	}
	if len(auth.ClientID) > 128 {
		auth.ClientID = auth.ClientID[:128]
	}

	client := s.hub.add(userID)
	s.logger.Info("sync websocket connected", "user_id", userID, "client_id", auth.ClientID, "subscribers", s.hub.count(userID))
	defer func() {
		s.hub.remove(userID, client)
		s.logger.Info("sync websocket disconnected", "user_id", userID, "client_id", auth.ClientID, "subscribers", s.hub.count(userID))
	}()
	keepalive := time.NewTicker(25 * time.Second)
	defer keepalive.Stop()
	if snapshot, err := s.readDocument(r.Context(), userID); err == nil {
		s.logger.Info("sync websocket initial snapshot", "user_id", userID, "client_id", auth.ClientID, "revision", snapshot.Revision, "document", syncDocumentLogValue(snapshot.Document))
		client <- snapshot
	}

	for {
		select {
		case <-r.Context().Done():
			return
		case snapshot := <-client:
			s.logger.Info("sync websocket snapshot", "user_id", userID, "client_id", auth.ClientID, "revision", snapshot.Revision, "document", syncDocumentLogValue(snapshot.Document))
			ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
			err := connection.Write(ctx, websocket.MessageText, mustJSON(map[string]any{"type": "sync", "snapshot": snapshot}))
			cancel()
			if err != nil {
				return
			}
		case <-keepalive.C:
			ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
			err := connection.Write(ctx, websocket.MessageText, mustJSON(map[string]any{"type": "keepalive"}))
			cancel()
			if err != nil {
				return
			}
		}
	}
}

func (s *Server) deleteSession(w http.ResponseWriter, r *http.Request) {
	token := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer ")
	hash := sha256.Sum256([]byte(token))
	s.db.Exec(r.Context(), `DELETE FROM sync_sessions WHERE token_hash=$1`, hash[:])
	w.WriteHeader(http.StatusNoContent)
}

func (s *Server) cleanup(ctx context.Context) {
	ticker := time.NewTicker(time.Hour)
	defer ticker.Stop()
	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			s.db.Exec(ctx, `DELETE FROM auth_requests WHERE expires_at<=now(); DELETE FROM sync_sessions WHERE expires_at<=now()`)
		}
	}
}

func (s *Server) listenForChanges(ctx context.Context) {
	for ctx.Err() == nil {
		connection, err := s.db.Acquire(ctx)
		if err != nil {
			time.Sleep(time.Second)
			continue
		}
		if _, err = connection.Exec(ctx, `LISTEN betterstatus_sync`); err != nil {
			connection.Release()
			time.Sleep(time.Second)
			continue
		}

		for ctx.Err() == nil {
			notification, err := connection.Conn().WaitForNotification(ctx)
			if err != nil {
				break
			}
			document, err := s.readDocument(ctx, notification.Payload)
			if err == nil {
				s.logger.Info("sync database notification", "user_id", notification.Payload, "revision", document.Revision, "subscribers", s.hub.count(notification.Payload), "document", syncDocumentLogValue(document.Document))
				s.hub.broadcast(notification.Payload, document)
			} else {
				s.logger.Error("sync database notification read failed", "user_id", notification.Payload, "error", err)
			}
		}
		connection.Release()
	}
}

var oauthResult = template.Must(template.New("oauth").Parse(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>BetterStatus Sync</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#11131a;color:#f2f3f5;font:16px system-ui}.card{max-width:520px;margin:24px;padding:32px;border:1px solid #343746;border-radius:18px;background:#1e202b}h1{margin-top:0;color:{{if .OK}}#43b581{{else}}#f04747{{end}}}</style></head><body><main class="card"><h1>{{if .OK}}Connected{{else}}Authorization failed{{end}}</h1><p>{{.Message}}</p></main></body></html>`))

func (s *Server) renderOAuthResult(w http.ResponseWriter, ok bool, message string) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	oauthResult.Execute(w, map[string]any{"OK": ok, "Message": message})
}

func decodeJSON(w http.ResponseWriter, r *http.Request, destination any, limit int64) error {
	r.Body = http.MaxBytesReader(w, r.Body, limit)
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(destination); err != nil {
		writeError(w, http.StatusBadRequest, "invalid JSON body")
		return err
	}
	return nil
}

func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(value)
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, map[string]string{"error": message})
}
func mustJSON(value any) []byte { data, _ := json.Marshal(value); return data }
func randomToken(size int) string {
	data := make([]byte, size)
	if _, err := rand.Read(data); err != nil {
		panic(err)
	}
	return base64.RawURLEncoding.EncodeToString(data)
}
func secureHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("Referrer-Policy", "no-referrer")
		w.Header().Set("Cache-Control", "no-store")
		next.ServeHTTP(w, r)
	})
}

type loggingResponseWriter struct {
	http.ResponseWriter
	status int
	bytes  int
}

func (w *loggingResponseWriter) Unwrap() http.ResponseWriter { return w.ResponseWriter }
func (w *loggingResponseWriter) WriteHeader(status int) {
	if w.status != 0 {
		return
	}
	w.status = status
	w.ResponseWriter.WriteHeader(status)
}
func (w *loggingResponseWriter) Write(payload []byte) (int, error) {
	if w.status == 0 {
		w.WriteHeader(http.StatusOK)
	}
	written, err := w.ResponseWriter.Write(payload)
	w.bytes += written
	return written, err
}

func requestLog(logger *slog.Logger, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		requestID := requestSequence.Add(1)
		response := &loggingResponseWriter{ResponseWriter: w}
		next.ServeHTTP(response, r)
		status := response.status
		if status == 0 {
			status = http.StatusOK
		}
		logger.Info("request completed",
			"request_id", requestID,
			"method", r.Method,
			"path", r.URL.Path,
			"status", status,
			"response_bytes", response.bytes,
			"client_id", r.Header.Get("X-BetterStatus-Client"),
			"duration_ms", float64(time.Since(start).Microseconds())/1000,
		)
	})
}

type hub struct {
	mu      sync.Mutex
	clients map[string]map[chan syncDocument]struct{}
}

func newHub() *hub { return &hub{clients: make(map[string]map[chan syncDocument]struct{})} }
func (h *hub) add(user string) chan syncDocument {
	h.mu.Lock()
	defer h.mu.Unlock()
	ch := make(chan syncDocument, 1)
	if h.clients[user] == nil {
		h.clients[user] = make(map[chan syncDocument]struct{})
	}
	h.clients[user][ch] = struct{}{}
	return ch
}
func (h *hub) remove(user string, ch chan syncDocument) {
	h.mu.Lock()
	defer h.mu.Unlock()
	delete(h.clients[user], ch)
	if len(h.clients[user]) == 0 {
		delete(h.clients, user)
	}
}
func (h *hub) count(user string) int {
	h.mu.Lock()
	defer h.mu.Unlock()
	return len(h.clients[user])
}
func (h *hub) broadcast(user string, doc syncDocument) {
	h.mu.Lock()
	defer h.mu.Unlock()
	for ch := range h.clients[user] {
		select {
		case ch <- doc:
		default:
			<-ch
			ch <- doc
		}
	}
}
