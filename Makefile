SHELL := /bin/bash

REPO_DIR := $(abspath $(dir $(lastword $(MAKEFILE_LIST))))
STATUS_HOTKEYS_DATA_DIR ?= $(if $(XDG_DATA_HOME),$(XDG_DATA_HOME)/status-hotkeys,$(HOME)/.local/share/status-hotkeys)
VENCORD_DIR ?= $(STATUS_HOTKEYS_DATA_DIR)/Vencord
PLUGIN_DIR := $(VENCORD_DIR)/src/userplugins/betterStatus
DEV_PATH := $(STATUS_HOTKEYS_DATA_DIR)/runtime/node/bin:$(STATUS_HOTKEYS_DATA_DIR)/tools/bin:$(PATH)
DISCORD_APP ?= Discord

PLUGIN_FILES := \
	src/index.tsx \
	src/Settings.tsx \
	src/StatusHistory.tsx \
	src/StatusSwitcher.tsx \
	src/savedStatuses.ts \
	src/native.ts \
	src/types.ts \
	src/styles.css

.PHONY: help dev check-dev sync-dev install-dev-deps build-dev restart-discord

help:
	@echo "BetterStatus development commands"
	@echo
	@echo "  make dev                         Sync, build, and restart local Discord"
	@echo "  make dev VENCORD_DIR=/path/...  Use a different Vencord checkout"

dev: build-dev
	@echo
	@echo "BetterStatus development build completed."
	@$(MAKE) --no-print-directory restart-discord

check-dev:
	@test -f "$(VENCORD_DIR)/package.json" && test -f "$(VENCORD_DIR)/scripts/build/build.mjs" || { \
		echo "Vencord source was not found at: $(VENCORD_DIR)" >&2; \
		echo "Install BetterStatus first, or run: make dev VENCORD_DIR=/path/to/Vencord" >&2; \
		exit 1; \
	}
	@PATH="$(DEV_PATH)" command -v node >/dev/null || { echo "Node.js was not found (version 22 or newer is required)." >&2; exit 1; }
	@PATH="$(DEV_PATH)" node -e 'const major = Number(process.versions.node.split(".")[0]); if (major < 22) { console.error(`Node.js 22 or newer is required; found $${process.version}.`); process.exit(1); }'
	@PATH="$(DEV_PATH)" command -v pnpm >/dev/null || { echo "pnpm was not found." >&2; exit 1; }

sync-dev: check-dev
	@mkdir -p "$(PLUGIN_DIR)"
	@rm -f "$(PLUGIN_DIR)/SavedStatusesProfile.tsx"
	@for file in $(PLUGIN_FILES); do cp "$(REPO_DIR)/$$file" "$(PLUGIN_DIR)/$${file#src/}"; done
	@cp "$(REPO_DIR)/README.md" "$(PLUGIN_DIR)/README.md"
	@printf 'dev:%s\n' "$$(git -C "$(REPO_DIR)" rev-parse HEAD)" > "$(PLUGIN_DIR)/VERSION"
	@echo "Synced BetterStatus to $(PLUGIN_DIR)"

install-dev-deps: sync-dev
	@if [[ ! -d "$(VENCORD_DIR)/.git" ]]; then \
		export VENCORD_HASH=archive VENCORD_REMOTE=Vendicated/Vencord; \
	fi; \
	PATH="$(DEV_PATH)" pnpm --dir "$(VENCORD_DIR)" install --frozen-lockfile

build-dev: install-dev-deps
	@if [[ ! -d "$(VENCORD_DIR)/.git" ]]; then \
		export VENCORD_HASH=archive VENCORD_REMOTE=Vendicated/Vencord; \
	fi; \
	PATH="$(DEV_PATH)" pnpm --dir "$(VENCORD_DIR)" build --dev

restart-discord:
	@if [[ "$$(uname -s)" != "Darwin" ]]; then \
		echo "Automatic Discord restart is currently supported on macOS only." >&2; \
		exit 1; \
	fi
	@echo "Restarting $(DISCORD_APP)..."
	@osascript -e 'tell application "$(DISCORD_APP)" to quit' >/dev/null 2>&1 || true
	@for _ in {1..20}; do \
		pgrep -x "$(DISCORD_APP)" >/dev/null || break; \
		sleep 0.25; \
	done; \
	if pgrep -x "$(DISCORD_APP)" >/dev/null; then \
		pkill -x "$(DISCORD_APP)"; \
	fi
	@open -a "$(DISCORD_APP)"
	@echo "$(DISCORD_APP) reopened with the new development build."
