#!/usr/bin/env bash

set -euo pipefail

REPOSITORY="Jacksonnn911/BetterStatus"
PLUGIN_NAME="betterStatus"
PLUGIN_URL="https://github.com/${REPOSITORY}/releases/download/latest/better-status.tar.gz"
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

printf '\nBetterStatus easy installer\n'
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
    ask "Download a private Node.js 24 runtime for BetterStatus?" ||
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

info "Downloading the latest BetterStatus release"
download "$PLUGIN_URL" "$temporary_dir/better-status.tar.gz"
mkdir "$temporary_dir/plugin"
tar -xzf "$temporary_dir/better-status.tar.gz" -C "$temporary_dir/plugin"

plugin_dir="$vencord_dir/src/userplugins/$PLUGIN_NAME"
mkdir -p "$plugin_dir"
for plugin_file in index.tsx Settings.tsx StatusSwitcher.tsx savedStatuses.ts native.ts types.ts README.md; do
    cp "$temporary_dir/plugin/$plugin_file" "$plugin_dir/$plugin_file"
done
rm -f "$plugin_dir/styles.css"
if [ -f "$temporary_dir/plugin/styles.css" ]; then
    cp "$temporary_dir/plugin/styles.css" "$plugin_dir/styles.css"
fi
rm -f "$plugin_dir/VERSION"
if [ -f "$temporary_dir/plugin/VERSION" ]; then
    cp "$temporary_dir/plugin/VERSION" "$plugin_dir/VERSION"
else
    info "This release predates version markers; Auto Update will initialize it on its first check"
fi
legacy_plugin_dir="$vencord_dir/src/userplugins/statusHotkeys"
if [ -d "$legacy_plugin_dir" ]; then
    rm -rf "$legacy_plugin_dir"
    info "Removed the old StatusHotkeys plugin folder after migration"
fi
success "Installed BetterStatus source files"

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
success "BetterStatus and Vencord built successfully"

printf '\nWhich Discord client do you use?\n  1) Discord Desktop\n  2) Vesktop\n  3) Finish without configuring a client\nChoice [1]: ' >/dev/tty
read -r client_choice </dev/tty || true
case "${client_choice:-1}" in
    1)
        installer_script="$vencord_dir/scripts/runInstaller.mjs"
        [ -f "$installer_script" ] || fail "Vencord's installer script was not found."
        discord_was_running=false
        discord_launch_path=""
        if [ "$(uname -s)" = "Darwin" ]; then
            discord_app="/Applications/Discord.app"
            [ -d "$discord_app" ] ||
                fail "Discord was not found at $discord_app. Install Discord in Applications and rerun this installer."
            if pgrep -x Discord >/dev/null 2>&1; then
                discord_was_running=true
                info "Closing Discord before patching"
                pkill -TERM -x Discord 2>/dev/null || true
                for _ in 1 2 3 4 5; do
                    pgrep -x Discord >/dev/null 2>&1 || break
                    sleep 1
                done
                pkill -KILL -x Discord 2>/dev/null || true
            fi
            current_user="$(id -un)"
            case "$(uname -m)" in
                x86_64|amd64) cli_arch="x64" ;;
                arm64|aarch64) cli_arch="arm64" ;;
                *) fail "Unsupported macOS CPU architecture: $(uname -m)" ;;
            esac
            cli_name="vencord-installer-cli-macos-$cli_arch"
            cli_path="$temporary_dir/$cli_name"
            info "Downloading the headless Vencord installer"
            download "https://github.com/${REPOSITORY}/releases/download/latest/$cli_name" "$cli_path"
            download "https://github.com/${REPOSITORY}/releases/download/latest/SHA256SUMS.txt" "$temporary_dir/SHA256SUMS.txt"
            expected_cli_hash="$(awk -v file="$cli_name" '$2 == file { print $1 }' "$temporary_dir/SHA256SUMS.txt")"
            actual_cli_hash="$(shasum -a 256 "$cli_path" | awk '{print $1}')"
            [ -n "$expected_cli_hash" ] && [ "$actual_cli_hash" = "$expected_cli_hash" ] ||
                fail "The headless Vencord installer checksum did not match."
            chmod +x "$cli_path"

            info "Correcting ownership of $discord_app (macOS will ask for your password)"
            if ! sudo chown -R "$current_user:wheel" "$discord_app" 2>"$temporary_dir/chown-error.log"; then
                printf '\n\033[1;33mmacOS blocked access to Discord.app.\033[0m\n' >&2
                printf 'Your terminal needs Full Disk Access before it can patch Discord.\n\n' >&2
                printf '1. Open System Settings > Privacy & Security > Full Disk Access.\n' >&2
                printf '2. Enable the terminal application you are currently using.\n' >&2
                printf '3. Fully quit and reopen that terminal application.\n' >&2
                printf '4. Run the BetterStatus installation command again.\n\n' >&2
                if ask "Open the Full Disk Access settings now?"; then
                    open "x-apple.systempreferences:com.apple.preference.security?Privacy_AllFiles" || true
                fi
                if [ "$discord_was_running" = true ]; then
                    info "Relaunching Discord because patching did not start"
                    open -a "$discord_app" || true
                fi
                fail "Full Disk Access is required to change permissions inside $discord_app."
            fi
            info "Installing the custom Vencord build into Discord without opening a GUI"
            VENCORD_USER_DATA_DIR="$vencord_dir" VENCORD_DEV_INSTALL=1 \
                "$cli_path" --install --location "$discord_app"
        else
            discord_process_name="Discord"
            discord_pid="$(pgrep -x "$discord_process_name" 2>/dev/null | head -n 1 || true)"
            if [ -z "$discord_pid" ]; then
                discord_process_name="discord"
                discord_pid="$(pgrep -x "$discord_process_name" 2>/dev/null | head -n 1 || true)"
            fi
            if [ -n "$discord_pid" ]; then
                discord_was_running=true
                if [ -e "/proc/$discord_pid/exe" ]; then
                    discord_launch_path="$(readlink "/proc/$discord_pid/exe" 2>/dev/null || true)"
                fi
                info "Closing Discord before patching"
                pkill -TERM -x "$discord_process_name" 2>/dev/null || true
                for _ in 1 2 3 4 5; do
                    pgrep -x "$discord_process_name" >/dev/null 2>&1 || break
                    sleep 1
                done
                pkill -KILL -x "$discord_process_name" 2>/dev/null || true
            fi
            info "Installing the custom Vencord build into Discord without opening the installer GUI"
            node "$installer_script" -- --install --branch auto
        fi
        if [ "$discord_was_running" = true ]; then
            info "Relaunching Discord"
            if [ "$(uname -s)" = "Darwin" ]; then
                open -a "$discord_app"
            elif [ -n "$discord_launch_path" ]; then
                nohup "$discord_launch_path" >/dev/null 2>&1 &
            elif command -v discord >/dev/null 2>&1; then
                nohup discord >/dev/null 2>&1 &
            else
                info "Discord was patched, but its launch command could not be found. Please open it normally."
            fi
        fi
        printf '\nEnable BetterStatus under Vencord > Plugins, and you are done.\n'
        ;;
    2)
        printf '\nIn Vesktop, open Settings, find "Vencord Location", and select:\n%s/dist\nThen restart Vesktop and enable BetterStatus under Vencord > Plugins.\n' "$vencord_dir"
        ;;
    *)
        printf '\nBuild complete. Vencord is located at: %s\n' "$vencord_dir"
        ;;
esac
