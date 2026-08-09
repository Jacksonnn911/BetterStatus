# BetterStatus Sync Server

The sync service stores one revisioned BetterStatus configuration per Discord
account. Clients write through REST and receive accepted revisions immediately
through WebSocket. PostgreSQL `LISTEN`/`NOTIFY` distributes changes between
multiple server instances.

## Discord OAuth setup

Create an application in the Discord Developer Portal and add this exact OAuth2
redirect URI:

```text
https://betterstatus.misaliba.eu/v1/oauth/callback
```

The service requests only the `identify` scope. Discord's access token is used
once to read `/users/@me` and is not stored. After authorization, the server
issues its own random, revocable session token. Its default lifetime is 180
days, and only its SHA-256 hash is stored in PostgreSQL.

Every self-hosted deployment needs its own Discord application because its
callback hostname is different.

Discord OAuth reference: [OAuth2](https://docs.discord.com/developers/topics/oauth2)
and the [`identify` scope](https://docs.discord.com/developers/resources/user).

## Run with Docker Compose

```sh
cd server
cp .env.example .env
# Fill POSTGRES_PASSWORD, DISCORD_CLIENT_ID, and DISCORD_CLIENT_SECRET.
docker compose up -d --build
```

The service listens on `127.0.0.1:8080`; terminate TLS with Caddy, nginx, or
another reverse proxy at the public hostname. WebSocket upgrades must be passed
through for `/v1/sync/ws`. Database migrations run automatically at startup.

Required environment variables:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `DISCORD_CLIENT_ID` | Discord application ID |
| `DISCORD_CLIENT_SECRET` | Discord application secret |
| `PUBLIC_BASE_URL` | Public HTTPS origin used for the OAuth callback |

Optional variables are `LISTEN_ADDR` (default `:8080`), `SESSION_TTL` (default
`4320h`), and `MAX_DOCUMENT_BYTES` (default 2 MiB).

## Protocol

- `POST /v1/auth/requests` starts a proof-bound OAuth request.
- `POST /v1/auth/requests/{id}/exchange` exchanges its verifier for a sync session.
- `GET /v1/sync` reads the current snapshot.
- `PUT /v1/sync` writes with `base_revision`; stale writes receive HTTP 409.
- `GET /v1/sync/ws` streams accepted snapshots after an authentication message.
- `DELETE /v1/session` revokes the current session.

All endpoints except OAuth setup/callback require the BetterStatus bearer token.
Do not expose the service over plaintext HTTP outside local development.
