SHELL := /bin/bash

REPO_DIR := $(abspath $(dir $(lastword $(MAKEFILE_LIST))))
STATUS_HOTKEYS_DATA_DIR ?= $(if $(XDG_DATA_HOME),$(XDG_DATA_HOME)/status-hotkeys,$(HOME)/.local/share/status-hotkeys)
VENCORD_DIR ?= $(STATUS_HOTKEYS_DATA_DIR)/Vencord
PLUGIN_DIR := $(VENCORD_DIR)/src/userplugins/betterStatus
DEV_PATH := $(STATUS_HOTKEYS_DATA_DIR)/runtime/node/bin:$(STATUS_HOTKEYS_DATA_DIR)/tools/bin:$(PATH)

PLUGIN_FILES := \
	src/index.tsx \
	src/Settings.tsx \
	src/SavedStatusesProfile.tsx \
	src/StatusSwitcher.tsx \
	src/savedStatuses.ts \
	src/native.ts \
	src/types.ts \
	src/styles.css

.PHONY: help dev check-dev sync-dev install-dev-deps build-dev

help:
	@echo "BetterStatus development commands"
	@echo
	@echo "  make dev                         Sync and build for local Discord"
	@echo "  make dev VENCORD_DIR=/path/...  Use a different Vencord checkout"

dev: build-dev
	@echo
	@echo "BetterStatus development build completed."
	@echo "Fully quit Discord (Cmd+Q) and reopen it to load the new build."

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
	@for file in $(PLUGIN_FILES); do cp "$(REPO_DIR)/$$file" "$(PLUGIN_DIR)/$${file#src/}"; done
	@cp "$(REPO_DIR)/README.md" "$(PLUGIN_DIR)/README.md"
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
