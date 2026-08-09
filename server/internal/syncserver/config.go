package syncserver

import (
	"fmt"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"
)

type Config struct {
	ListenAddr          string
	PublicBaseURL       string
	DatabaseURL         string
	DiscordClientID     string
	DiscordClientSecret string
	SessionTTL          time.Duration
	AuthRequestTTL      time.Duration
	MaxDocumentBytes    int64
}

func LoadConfig() (Config, error) {
	config := Config{
		ListenAddr:          envOr("LISTEN_ADDR", ":8080"),
		PublicBaseURL:       strings.TrimRight(envOr("PUBLIC_BASE_URL", "https://betterstatus.misaliba.eu"), "/"),
		DatabaseURL:         os.Getenv("DATABASE_URL"),
		DiscordClientID:     os.Getenv("DISCORD_CLIENT_ID"),
		DiscordClientSecret: os.Getenv("DISCORD_CLIENT_SECRET"),
		SessionTTL:          180 * 24 * time.Hour,
		AuthRequestTTL:      10 * time.Minute,
		MaxDocumentBytes:    2 << 20,
	}

	if value := os.Getenv("SESSION_TTL"); value != "" {
		duration, err := time.ParseDuration(value)
		if err != nil {
			return Config{}, fmt.Errorf("SESSION_TTL: %w", err)
		}
		config.SessionTTL = duration
	}
	if value := os.Getenv("MAX_DOCUMENT_BYTES"); value != "" {
		size, err := strconv.ParseInt(value, 10, 64)
		if err != nil || size < 1024 {
			return Config{}, fmt.Errorf("MAX_DOCUMENT_BYTES must be at least 1024")
		}
		config.MaxDocumentBytes = size
	}

	if config.DatabaseURL == "" || config.DiscordClientID == "" || config.DiscordClientSecret == "" {
		return Config{}, fmt.Errorf("DATABASE_URL, DISCORD_CLIENT_ID, and DISCORD_CLIENT_SECRET are required")
	}
	parsedURL, err := url.Parse(config.PublicBaseURL)
	if err != nil || parsedURL.Scheme == "" || parsedURL.Host == "" {
		return Config{}, fmt.Errorf("PUBLIC_BASE_URL must be an absolute URL")
	}
	if config.SessionTTL <= 0 || config.AuthRequestTTL <= 0 {
		return Config{}, fmt.Errorf("session and authorization lifetimes must be positive")
	}

	return config, nil
}

func envOr(name, fallback string) string {
	if value := os.Getenv(name); value != "" {
		return value
	}
	return fallback
}
