#!/usr/bin/env bash
set -euo pipefail

repo="Jacksonnn911/BetterStatus"
channel="${BETTERSTATUS_CHANNEL:-prod}"
channel="$(printf '%s' "$channel" | tr '[:upper:]' '[:lower:]')"

case "$channel" in
  prod|dev) ;;
  *) echo "[BetterStatus] BETTERSTATUS_CHANNEL must be 'prod' or 'dev'." >&2; exit 1 ;;
esac

case "$(uname -s)" in
  Darwin)
    betterdiscord_root="$HOME/Library/Application Support/BetterDiscord"
    ;;
  Linux)
    betterdiscord_root="${XDG_CONFIG_HOME:-$HOME/.config}/BetterDiscord"
    ;;
  *)
    echo "[BetterStatus] Unsupported OS. On Windows use the PowerShell installer." >&2
    exit 1
    ;;
esac

plugins_dir="$betterdiscord_root/plugins"
target="$plugins_dir/BetterStatus.plugin.js"
backup="$target.bak"
temporary="$(mktemp "${TMPDIR:-/tmp}/BetterStatus.XXXXXX")"
plugin_url="https://raw.githubusercontent.com/$repo/$channel/betterdiscord/BetterStatus.plugin.js"

cleanup() {
  rm -f "$temporary"
}
trap cleanup EXIT

printf '\nBetterStatus for BetterDiscord\nChannel: %s\n\n' "$channel"

if [ ! -d "$betterdiscord_root" ]; then
  echo "[BetterStatus] BetterDiscord's data folder was not found yet. I will create the plugins folder anyway."
  echo "[BetterStatus] If BetterDiscord is not installed, install it first and then run this command again."
fi

mkdir -p "$plugins_dir"

if ! command -v curl >/dev/null 2>&1; then
  echo "[BetterStatus] curl is required to download BetterStatus." >&2
  exit 1
fi

echo "[BetterStatus] Downloading the latest BetterDiscord build..."
curl -fL --retry 3 --connect-timeout 15 -A "BetterStatus-BetterDiscord-Installer" "$plugin_url" -o "$temporary"

if [ "$(wc -c < "$temporary")" -lt 10000 ]; then
  echo "[BetterStatus] Downloaded file is unexpectedly small." >&2
  exit 1
fi
if ! grep -q '@name BetterStatus' "$temporary"; then
  echo "[BetterStatus] Downloaded file is not a BetterStatus plugin." >&2
  exit 1
fi
if ! grep -Eq "@channel[[:space:]]+$channel" "$temporary"; then
  echo "[BetterStatus] Downloaded BetterStatus build does not match the requested '$channel' channel." >&2
  exit 1
fi

rm -f "$backup"
if [ -f "$target" ]; then
  echo "[BetterStatus] Replacing the existing BetterStatus installation..."
  mv "$target" "$backup"
else
  echo "[BetterStatus] Installing BetterStatus..."
fi

if ! mv "$temporary" "$target"; then
  [ -f "$backup" ] && mv "$backup" "$target"
  echo "[BetterStatus] Failed to install BetterStatus; the previous plugin was restored." >&2
  exit 1
fi

if ! grep -q '@name BetterStatus' "$target"; then
  rm -f "$target"
  [ -f "$backup" ] && mv "$backup" "$target"
  echo "[BetterStatus] Installed file failed validation; the previous plugin was restored." >&2
  exit 1
fi

rm -f "$backup"
trap - EXIT
rm -f "$temporary"

printf '\n[BetterStatus] BetterStatus was installed successfully.\n'
printf 'Installed to: %s\n\n' "$target"
printf 'Open Discord -> User Settings -> BetterDiscord -> Plugins and enable BetterStatus.\n'
printf 'If Discord is already open and the plugin does not appear immediately, reload Discord once.\n\n'
