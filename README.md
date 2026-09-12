<p align="center">
  <img src="https://raw.githubusercontent.com/Jacksonnn911/BetterStatus/prod/assets/hero.svg?v=685c6dd" alt="BetterStatus — Your Discord presence, one shortcut away" width="100%">
</p>

<p align="center">
  <a href="https://github.com/Jacksonnn911/BetterStatus/actions/workflows/release.yml"><img alt="Vencord build" src="https://img.shields.io/github/actions/workflow/status/Jacksonnn911/BetterStatus/release.yml?branch=prod&style=for-the-badge&logo=githubactions&logoColor=white&label=Vencord"></a>
  <a href="https://github.com/Jacksonnn911/BetterStatus/actions/workflows/betterdiscord-build.yml"><img alt="BetterDiscord build" src="https://img.shields.io/github/actions/workflow/status/Jacksonnn911/BetterStatus/betterdiscord-build.yml?branch=prod&style=for-the-badge&logo=githubactions&logoColor=white&label=BetterDiscord"></a>
  <img alt="Windows, macOS and Linux" src="https://img.shields.io/badge/Windows%20%7C%20macOS%20%7C%20Linux-5865F2?style=for-the-badge&logo=discord&logoColor=white">
</p>

<p align="center">
  <strong>A complete Discord presence workspace for Vencord and BetterDiscord.</strong><br>
  Global shortcuts, Fixed and Memory presets, status history, schedules, backups, cloud sync and automatic updates.<br><br>
  Made by <a href="https://github.com/Jacksonnn911"><strong>Jacksonnn911</strong></a> (<code>nik_jandaaa27829</code>) &amp; <a href="https://github.com/qtmisaliba"><strong>qtmisaliba</strong></a> (<code>qtmisaliba</code>).
</p>

---

## Choose your Discord mod

BetterStatus has two maintained editions from the same feature source. The normal plugin logic lives in `src/`; the BetterDiscord edition bundles that same workspace with a BetterDiscord runtime adapter.

| Edition | Install | Updates |
| --- | --- | --- |
| **Vencord** | Source userplugin, built into Vencord | `prod` / `dev` Vencord update channels |
| **BetterDiscord** | One `BetterStatus.plugin.js` file | `prod` / `dev` BetterDiscord builds |

> BetterStatus is a third-party plugin and is not supported by the official Vencord or BetterDiscord support teams.

## BetterDiscord installation

1. Install Discord from the official Discord website.
2. Install BetterDiscord.
3. Download **[`BetterStatus.plugin.js`](https://raw.githubusercontent.com/Jacksonnn911/BetterStatus/prod/betterdiscord/BetterStatus.plugin.js)**.
4. Put it in the BetterDiscord plugins folder.
5. Open **Discord Settings → BetterDiscord → Plugins** and enable **BetterStatus**.

On Windows the plugins folder is normally:

```text
%appdata%\BetterDiscord\plugins
```

The BetterDiscord build is generated automatically from the same BetterStatus source whenever `prod` or `dev` changes. Do not install the Vencord userplugin files into BetterDiscord manually; use the generated `.plugin.js` file above.

## Vencord installation

### macOS & Linux

```bash
curl -fsSL https://raw.githubusercontent.com/Jacksonnn911/BetterStatus/prod/install.sh | bash
```

### Windows

Open PowerShell and run:

```powershell
irm https://raw.githubusercontent.com/Jacksonnn911/BetterStatus/prod/install.ps1 | iex
```

The guided installer finds or downloads a Vencord source checkout, installs BetterStatus as `src/userplugins/betterStatus`, builds Vencord and applies the custom build.

Custom Vencord userplugins require a source build. If you prefer a manual install, download the rolling release from the repository's **Releases** page, extract the BetterStatus source into `Vencord/src/userplugins/betterStatus`, run `pnpm build`, then inject/apply that Vencord build normally.

## Features

BetterStatus is designed to behave the same whether the host is Vencord or BetterDiscord:

- **True global shortcuts** — switch status and presence while another app or game is focused.
- **Fixed presets** — always apply exactly the configured custom status.
- **Memory presets** — remember the latest manual text associated with the preset.
- **Presence control** — Online, Idle, Do Not Disturb and Invisible.
- **State restoration** — restore the active preset and presence after Discord restarts.
- **Saved status library** — search, favorite, reuse and remove up to 1,000 statuses inside Discord's status workflow.
- **Status calendar** — one-time, daily, weekly, weekday, weekend and selected-day schedules with optional end actions.
- **Exact restore after schedules** — restore the previous status, emoji, expiry, presence and active preset.
- **Portable backups** — export and import presets, schedules, status history and preferences.
- **Cloud sync** — synchronize BetterStatus configuration across connected clients, with optional client-side encryption.
- **Production and Development channels** — choose stability or early builds.
- **Automatic updates** — each host updates using its own build format; BetterDiscord never downloads the Vencord package and Vencord never downloads the BetterDiscord plugin.

## Using BetterStatus

Open the plugin settings from your installed mod:

- **Vencord:** `User Settings → Vencord → Plugins → BetterStatus → Settings`
- **BetterDiscord:** `User Settings → BetterDiscord → Plugins → BetterStatus → Settings`

Create a preset with **Add preset**, choose Fixed or Memory behavior, enter the custom status, choose a presence and record a shortcut. Changes are saved immediately.

The dashboard also includes preset search, enabled/Memory totals, current-preset highlighting, duplicate/delete/collapse controls, the status calendar, backup tools, cloud sync and update settings.

## Update channels

### Vencord

The Vencord edition uses the original verified file-manifest updater. It follows `prod` for Production and `dev` for Development, verifies downloaded files and rebuilds the Vencord source installation when an update is applied.

### BetterDiscord

The BetterDiscord edition follows the generated file at:

```text
prod/betterdiscord/BetterStatus.plugin.js
```

or, when Development is selected:

```text
dev/betterdiscord/BetterStatus.plugin.js
```

The updater downloads only the BetterDiscord bundle, validates that it is a BetterStatus plugin, replaces the installed `BetterStatus.plugin.js` and asks Discord to restart when required.

The two update systems are intentionally separate. This prevents the BetterDiscord client from trying to fetch Vencord source files or a Vencord client from trying to install a BetterDiscord bundle.

## Project layout

```text
src/                         Shared BetterStatus feature source / Vencord userplugin
betterdiscord/src/           BetterDiscord compatibility and native adapters
betterdiscord/build.mjs      BetterDiscord bundler
betterdiscord/BetterStatus.plugin.js
server/                      Optional BetterStatus sync server
install.sh / install.ps1     Guided Vencord installers
```

The generated BetterDiscord plugin is committed by GitHub Actions so users always have a stable raw download URL and the in-plugin updater can use the same channel files.

## Development

### Vencord

The production workflow tests the plugin against current Vencord on Node.js 22 and 24. BetterStatus remains a normal Vencord source userplugin under `src/`.

### BetterDiscord

The BetterDiscord build uses esbuild to bundle the original `src/` workspace. Platform-only behavior is provided by adapters for settings storage, Discord user settings, native global keybinds, UI components, cloud/session handling and BetterDiscord's single-file plugin lifecycle.

Build locally with:

```bash
npm install --no-save esbuild@0.25.9 scrypt-js@3.0.1
node betterdiscord/build.mjs
```

The result is `betterdiscord/BetterStatus.plugin.js`.

## Cloud sync and privacy

The default sync service is `https://betterstatus.misaliba.eu`. BetterStatus can also use a custom compatible HTTPS server. Cloud protection encrypts the synchronized configuration on the client before upload; the password is not sent to the sync service.

Self-hosting and protocol information are in [`server/README.md`](server/README.md).

## Troubleshooting

**BetterDiscord does not show the plugin:** make sure the filename ends exactly in `.plugin.js`, not `.plugin.js.txt`, and place it in the BetterDiscord plugins folder.

**BetterStatus settings fail to open:** update to the latest `prod` BetterDiscord build first. The BetterDiscord compatibility layer is shipped inside the plugin; Vencord itself is not required.

**A BetterDiscord update says the build is unavailable:** confirm you are on the latest BetterDiscord build. Production looks only at the generated `prod/betterdiscord/BetterStatus.plugin.js`; Development looks only at the equivalent `dev` path.

**Vencord installation problems:** rerun the guided installer or follow Vencord's official custom-plugin/source-build documentation.

## License

BetterStatus source files carry their applicable license headers. Vencord-derived compatibility code remains subject to Vencord's GPL licensing terms.
