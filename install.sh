#!/usr/bin/env bash

set -euo pipefail

REPOSITORY="Jacksonnn911/StatusHotkeys"
PLUGIN_NAME="statusHotkeys"
PLUGIN_URL="https://github.com/${REPOSITORY}/releases/latest/download/status-hotkeys.tar.gz"
VENCORD_URL="https://github.com/Vendicated/Vencord/archive/refs/heads/main.tar.gz"
NODE_INDEX="https://nodejs.org/dist/latest-v24.x"
DATA_DIR="${XDG_DATA_HOME:-${HOME}/.local/share}/status-hotkeys"
RUNTIME_DIR="$DATA_DIR/runtime"
TOOLS_DIR="$DATA_DIR/tools"

info() { printf '\033[1;34m==>\033[0m %s\n' "$1"; }
success() { printf '\033[1;32m✓\033[0m %s\n' "$1"; }
fail() { printf '\033[1;31mError:\033[0m %s\n' "$1" >&2; exit 1; }

ask() {
    local prompt="$1" answer
    if [ ! -r /dev/tty ]; then
        fail "This step needs an interactive terminal. Download install.sh and run: bash install.sh"
    fi
    printf '%s [Y/n] ' "$prompt" >/dev/tty
    read -r answer </dev/tty || true
    case "${answer:-y}" in y|Y|yes|YES|Yes) return 0 ;; *) return 1 ;; esac
}

download() {
    local url="$1" destination="$2"
    if command -v curl >/dev/null 2>&1; then
        curl --fail --location --silent --show-error "$url" -o "$destination"
    elif command -v wget >/dev/null 2>&1; then
        wget --quiet "$url" -O "$destination"
    else
        fail "No download tool was found. Install curl or wget and run this installer again."
    fi
}

is_vencord_source() {
    [ -f "$1/package.json" ] &&
        [ -d "$1/src/plugins" ] &&
        grep -q '"name"[[:space:]]*:[[:space:]]*"vencord"' "$1/package.json" 2>/dev/null
}

find_vencord_source() {
    local search_root candidate
    for candidate in \
        "$PWD" \
        "${HOME}/Vencord" \
        "${HOME}/vencord" \
        "${HOME}/Documents/Vencord" \
        "${HOME}/Desktop/Vencord" \
        "${HOME}/Downloads/Vencord" \
        "$DATA_DIR/Vencord"; do
        if is_vencord_source "$candidate"; then
            printf '%s\n' "$candidate"
            return 0
        fi
    done

    for search_root in \
        "${HOME}/Desktop" \
        "${HOME}/Documents" \
        "${HOME}/Projects" \
        "${HOME}/Developer" \
        "${HOME}/dev" \
        "${HOME}/code" \
        "${HOME}/repos"; do
        [ -d "$search_root" ] || continue
        for candidate in "$search_root"/* "$search_root"/*/*; do
            if is_vencord_source "$candidate"; then
                printf '%s\n' "$candidate"
                return 0
            fi
        done
    done
    return 1
}

printf '\nStatusHotkeys easy installer\n'
printf 'This installs everything into your user account; administrator access is not needed.\n\n'

temporary_dir="$(mktemp -d)"
trap 'rm -rf "$temporary_dir"' EXIT
mkdir -p "$DATA_DIR" "$RUNTIME_DIR" "$TOOLS_DIR"

system_node=""
if [ -x "$RUNTIME_DIR/node/bin/node" ]; then
    export PATH="$RUNTIME_DIR/node/bin:$PATH"
fi
if [ -x "$TOOLS_DIR/bin/pnpm" ]; then
    export PATH="$TOOLS_DIR/bin:$PATH"
fi
if command -v node >/dev/null 2>&1; then
    node_major="$(node --version | sed 's/^v//' | cut -d. -f1)"
    if [ "$node_major" -ge 22 ]; then
        system_node="$(command -v node)"
        success "Found compatible Node.js $(node --version)"
    else
        info "Found Node.js $(node --version), but Vencord requires version 22 or newer."
    fi
else
    info "Node.js was not found."
fi

if command -v bun >/dev/null 2>&1; then
    success "Found Bun $(bun --version)"
    info "Bun cannot replace Node.js here because Vencord uses Node- and pnpm-specific build tools."
fi
if command -v yarn >/dev/null 2>&1; then
    success "Found Yarn $(yarn --version)"
fi
if command -v pnpm >/dev/null 2>&1; then
    success "Found pnpm $(pnpm --version)"
fi

if [ -z "$system_node" ]; then
    ask "Download a private Node.js 24 runtime for StatusHotkeys?" ||
        fail "Node.js is required, so installation was cancelled."

    case "$(uname -s)" in
        Darwin) node_platform="darwin" ;;
        Linux) node_platform="linux" ;;
        *) fail "This installer supports macOS and Linux. On Windows, use install.ps1." ;;
    esac
    case "$(uname -m)" in
        x86_64|amd64) node_arch="x64" ;;
        arm64|aarch64) node_arch="arm64" ;;
        *) fail "Unsupported CPU architecture: $(uname -m)" ;;
    esac

    info "Finding the latest Node.js 24 release"
    download "$NODE_INDEX/SHASUMS256.txt" "$temporary_dir/SHASUMS256.txt"
    node_file="$(sed -n "s/^[a-f0-9]*  \(node-v[^ ]*-${node_platform}-${node_arch}\.tar\.gz\)$/\1/p" "$temporary_dir/SHASUMS256.txt" | head -n 1)"
    [ -n "$node_file" ] || fail "Could not find a Node.js download for this computer."
    expected_hash="$(awk -v file="$node_file" '$2 == file { print $1 }' "$temporary_dir/SHASUMS256.txt")"

    info "Downloading $node_file"
    download "$NODE_INDEX/$node_file" "$temporary_dir/node.tar.gz"
    if command -v sha256sum >/dev/null 2>&1; then
        actual_hash="$(sha256sum "$temporary_dir/node.tar.gz" | awk '{print $1}')"
    else
        actual_hash="$(shasum -a 256 "$temporary_dir/node.tar.gz" | awk '{print $1}')"
    fi
    [ "$actual_hash" = "$expected_hash" ] || fail "The Node.js download checksum did not match."

    rm -rf "$RUNTIME_DIR/node"
    mkdir -p "$RUNTIME_DIR/node"
    tar -xzf "$temporary_dir/node.tar.gz" -C "$RUNTIME_DIR/node" --strip-components=1
    export PATH="$RUNTIME_DIR/node/bin:$PATH"
    success "Installed private Node.js $(node --version)"
fi

node_major="$(node --version | sed 's/^v//' | cut -d. -f1)"
[ "$node_major" -ge 22 ] || fail "Node.js 22 or newer is required."

if ! command -v pnpm >/dev/null 2>&1; then
    ask "Install the required pnpm build tool privately?" ||
        fail "pnpm is required, so installation was cancelled."
    info "Installing pnpm 11 into $TOOLS_DIR"
    npm install --global --prefix "$TOOLS_DIR" pnpm@11.9.0
    export PATH="$TOOLS_DIR/bin:$PATH"
    success "Installed pnpm $(pnpm --version)"
fi

if [ -n "${VENCORD_DIR:-}" ]; then
    vencord_dir="$VENCORD_DIR"
elif discovered_vencord="$(find_vencord_source)"; then
    vencord_dir="$discovered_vencord"
    success "Found existing Vencord source at $vencord_dir"
else
    vencord_dir="$DATA_DIR/Vencord"
fi

if ! is_vencord_source "$vencord_dir"; then
    ask "Download Vencord source code into $vencord_dir?" ||
        fail "Vencord source code is required, so installation was cancelled."
    info "Downloading Vencord (Git is not required)"
    download "$VENCORD_URL" "$temporary_dir/vencord.tar.gz"
    mkdir -p "$vencord_dir"
    tar -xzf "$temporary_dir/vencord.tar.gz" -C "$vencord_dir" --strip-components=1
    success "Downloaded Vencord"
fi

is_vencord_source "$vencord_dir" || fail "The selected Vencord directory is invalid: $vencord_dir"

info "Downloading the latest StatusHotkeys release"
download "$PLUGIN_URL" "$temporary_dir/status-hotkeys.tar.gz"
mkdir "$temporary_dir/plugin"
tar -xzf "$temporary_dir/status-hotkeys.tar.gz" -C "$temporary_dir/plugin"

plugin_dir="$vencord_dir/src/userplugins/$PLUGIN_NAME"
mkdir -p "$plugin_dir"
for plugin_file in index.tsx Settings.tsx native.ts types.ts README.md; do
    cp "$temporary_dir/plugin/$plugin_file" "$plugin_dir/$plugin_file"
done
success "Installed StatusHotkeys source files"

# GitHub source archives do not contain .git metadata. Vencord accepts these
# environment values instead of calling Git while building archive installs.
if [ ! -d "$vencord_dir/.git" ]; then
    export VENCORD_HASH="archive"
    export VENCORD_REMOTE="Vendicated/Vencord"
fi

info "Installing build dependencies (this can take a few minutes)"
pnpm --dir "$vencord_dir" install --frozen-lockfile
info "Building Vencord"
pnpm --dir "$vencord_dir" build
success "StatusHotkeys and Vencord built successfully"

printf '\nWhich Discord client do you use?\n  1) Discord Desktop\n  2) Vesktop\n  3) Finish without configuring a client\nChoice [1]: ' >/dev/tty
read -r client_choice </dev/tty || true
case "${client_choice:-1}" in
    1)
        info "Opening the Vencord installer. Select your Discord installation when asked."
        pnpm --dir "$vencord_dir" inject
        printf '\nRestart Discord, enable StatusHotkeys under Vencord > Plugins, and you are done.\n'
        ;;
    2)
        printf '\nIn Vesktop, open Settings, find "Vencord Location", and select:\n%s/dist\nThen restart Vesktop and enable StatusHotkeys under Vencord > Plugins.\n' "$vencord_dir"
        ;;
    *)
        printf '\nBuild complete. Vencord is located at: %s\n' "$vencord_dir"
        ;;
esac
