#!/usr/bin/env bash

set -euo pipefail

REPOSITORY="Jacksonnn911/StatusHotkeys"
PLUGIN_NAME="statusHotkeys"
ARCHIVE_URL="https://github.com/${REPOSITORY}/releases/latest/download/status-hotkeys.tar.gz"

info() {
    printf '\033[1;34m==>\033[0m %s\n' "$1"
}

fail() {
    printf '\033[1;31mError:\033[0m %s\n' "$1" >&2
    exit 1
}

for command_name in git node curl tar; do
    command -v "$command_name" >/dev/null 2>&1 ||
        fail "Missing '$command_name'. Install Git and Node.js, then run this command again."
done

node_major="$(node --version | sed 's/^v//' | cut -d. -f1)"
[ "$node_major" -ge 22 ] || fail "Vencord requires Node.js 22 or newer (found $(node --version))."

if ! command -v pnpm >/dev/null 2>&1; then
    if command -v bun >/dev/null 2>&1; then
        installer_name="Bun"
        install_command=(bun add --global pnpm@11.9.0)
    elif command -v yarn >/dev/null 2>&1; then
        installer_name="Yarn"
        install_command=(yarn global add pnpm@11.9.0)
    elif command -v corepack >/dev/null 2>&1; then
        installer_name="Corepack"
        install_command=(corepack install --global pnpm@11.9.0)
    elif command -v npm >/dev/null 2>&1; then
        installer_name="npm"
        install_command=(npm install --global pnpm@11.9.0)
    else
        fail "Vencord requires pnpm, and no Bun, Yarn, Corepack, or npm installation method was found."
    fi

    printf "pnpm is required by Vencord but is not installed. Install it with %s? [Y/n] " "$installer_name"
    if [ -r /dev/tty ]; then
        read -r answer </dev/tty
    else
        fail "Cannot ask for confirmation without a terminal. Install pnpm 11 manually and rerun the installer."
    fi

    case "${answer:-y}" in
        y|Y|yes|YES|Yes)
            info "Installing pnpm 11 with $installer_name"
            "${install_command[@]}"
            ;;
        *)
            fail "pnpm installation declined. No changes were made."
            ;;
    esac

    command -v pnpm >/dev/null 2>&1 ||
        fail "pnpm was installed but is not available on PATH. Restart your terminal and run the installer again."
fi

if [ -n "${VENCORD_DIR:-}" ]; then
    vencord_dir="$VENCORD_DIR"
elif [ -f "$PWD/package.json" ] && [ -d "$PWD/src" ]; then
    vencord_dir="$PWD"
elif [ -d "${HOME}/Vencord/src" ]; then
    vencord_dir="${HOME}/Vencord"
elif [ -d "${HOME}/Documents/Vencord/src" ]; then
    vencord_dir="${HOME}/Documents/Vencord"
else
    vencord_dir="${HOME}/Vencord"
    info "No Vencord source checkout found; cloning it to $vencord_dir"
    git clone https://github.com/Vendicated/Vencord.git "$vencord_dir"
    info "Installing Vencord dependencies"
    pnpm --dir "$vencord_dir" install --frozen-lockfile
fi

[ -f "$vencord_dir/package.json" ] && [ -d "$vencord_dir/src" ] ||
    fail "'$vencord_dir' is not a Vencord source checkout. Set VENCORD_DIR to the correct directory."

temporary_dir="$(mktemp -d)"
trap 'rm -rf "$temporary_dir"' EXIT

info "Downloading the latest StatusHotkeys release"
curl --fail --location --silent --show-error "$ARCHIVE_URL" -o "$temporary_dir/status-hotkeys.tar.gz"
mkdir "$temporary_dir/plugin"
tar -xzf "$temporary_dir/status-hotkeys.tar.gz" -C "$temporary_dir/plugin"

plugin_dir="$vencord_dir/src/userplugins/$PLUGIN_NAME"
mkdir -p "$plugin_dir"
cp "$temporary_dir/plugin/index.tsx" "$plugin_dir/index.tsx"
cp "$temporary_dir/plugin/Settings.tsx" "$plugin_dir/Settings.tsx"
cp "$temporary_dir/plugin/native.ts" "$plugin_dir/native.ts"
cp "$temporary_dir/plugin/types.ts" "$plugin_dir/types.ts"
cp "$temporary_dir/plugin/README.md" "$plugin_dir/README.md"

info "Building Vencord"
pnpm --dir "$vencord_dir" build

printf '\nStatusHotkeys is installed and Vencord was built successfully.\n'
printf 'Discord Desktop: run  cd %q && pnpm inject  and restart Discord.\n' "$vencord_dir"
printf 'Vesktop: select %s/dist as the Vencord Location, then restart Vesktop.\n' "$vencord_dir"
