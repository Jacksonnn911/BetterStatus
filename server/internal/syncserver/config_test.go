package syncserver

import (
	"net/url"
	"strings"
	"testing"
	"time"
)

func validEnvironment(t *testing.T) {
	t.Helper()
	t.Setenv("DATABASE_URL", "postgres://example")
	t.Setenv("DISCORD_CLIENT_ID", "client")
	t.Setenv("DISCORD_CLIENT_SECRET", "secret")
	t.Setenv("PUBLIC_BASE_URL", "https://sync.example.com/")
	t.Setenv("SESSION_TTL", "")
	t.Setenv("MAX_DOCUMENT_BYTES", "")
}

func TestLoadConfigDefaults(t *testing.T) {
	validEnvironment(t)
	config, err := LoadConfig()
	if err != nil {
		t.Fatal(err)
	}
	if config.PublicBaseURL != "https://sync.example.com" {
		t.Fatalf("unexpected public URL %q", config.PublicBaseURL)
	}
	if config.SessionTTL != 180*24*time.Hour {
		t.Fatalf("unexpected session TTL %s", config.SessionTTL)
	}
}

func TestLoadConfigRequiresSecrets(t *testing.T) {
	validEnvironment(t)
	t.Setenv("DISCORD_CLIENT_SECRET", "")
	_, err := LoadConfig()
	if err == nil || !strings.Contains(err.Error(), "DISCORD_CLIENT_SECRET") {
		t.Fatalf("expected missing-secret error, got %v", err)
	}
}

func TestDatabaseURLFromSeparateFieldsEscapesPassword(t *testing.T) {
	t.Setenv("DATABASE_URL", "")
	t.Setenv("PGHOST", "postgres")
	t.Setenv("PGPORT", "5432")
	t.Setenv("PGDATABASE", "betterstatus")
	t.Setenv("PGUSER", "betterstatus")
	t.Setenv("PGPASSWORD", `colon:@slash/+question?hash#percent% dollar$`)
	t.Setenv("PGSSLMODE", "disable")

	value, err := databaseURLFromEnvironment()
	if err != nil {
		t.Fatal(err)
	}
	parsed, err := url.Parse(value)
	if err != nil {
		t.Fatal(err)
	}
	password, ok := parsed.User.Password()
	if !ok || password != `colon:@slash/+question?hash#percent% dollar$` {
		t.Fatalf("password was not preserved: %q", password)
	}
	if parsed.Host != "postgres:5432" || parsed.Path != "/betterstatus" || parsed.Query().Get("sslmode") != "disable" {
		t.Fatalf("unexpected database URL %q", value)
	}
}

func TestDatabaseURLFromSeparateFieldsRequiresCompleteConfiguration(t *testing.T) {
	t.Setenv("DATABASE_URL", "")
	t.Setenv("PGHOST", "postgres")
	t.Setenv("PGUSER", "betterstatus")
	t.Setenv("PGPASSWORD", "")
	t.Setenv("PGDATABASE", "betterstatus")
	_, err := databaseURLFromEnvironment()
	if err == nil || !strings.Contains(err.Error(), "PGPASSWORD") {
		t.Fatalf("expected incomplete PG configuration error, got %v", err)
	}
}

func TestRandomTokenIsURLSafeAndUnique(t *testing.T) {
	first := randomToken(32)
	second := randomToken(32)
	if first == second || len(first) != 43 || strings.ContainsAny(first, "+/=") {
		t.Fatalf("unexpected tokens %q and %q", first, second)
	}
}
