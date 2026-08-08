<p align="center">
  <img src="https://raw.githubusercontent.com/Jacksonnn911/BetterStatus/prod/assets/hero.svg?v=685c6dd" alt="BetterStatus — Your Discord presence, one shortcut away" width="100%">
</p>

<p align="center">
  <a href="https://github.com/Jacksonnn911/BetterStatus/actions/workflows/release.yml"><img alt="Build" src="https://img.shields.io/github/actions/workflow/status/Jacksonnn911/BetterStatus/release.yml?branch=prod&amp;style=for-the-badge&amp;logo=githubactions&amp;logoColor=white&amp;label=Build"></a>
  <a href="https://github.com/Jacksonnn911/BetterStatus/releases/tag/latest"><img alt="Latest release" src="https://img.shields.io/github/v/release/Jacksonnn911/BetterStatus?display_name=tag&amp;style=for-the-badge&amp;logo=github&amp;label=Release"></a>
  <img alt="Node 22 and 24" src="https://img.shields.io/badge/Node-22%20%7C%2024-5FA04E?style=for-the-badge&amp;logo=nodedotjs&amp;logoColor=white">
  <img alt="macOS, Linux and Windows" src="https://img.shields.io/badge/macOS%20%7C%20Linux%20%7C%20Windows-5865F2?style=for-the-badge&amp;logo=discord&amp;logoColor=white">
</p>

<p align="center">
  <strong>A polished Vencord plugin for switching Discord custom statuses and presence from anywhere.</strong><br>
  Build unlimited presets, bind global shortcuts, remember changing statuses, and choose your update channel.<br><br>
  Made with care by <a href="https://github.com/Jacksonnn911"><strong>Jacksonnn911</strong></a> (<code>nik_jandaaa27829</code>) &amp; <a href="https://github.com/qtmisaliba"><strong>qtmisaliba</strong></a> (<code>qtmisaliba</code>).
</p>

<p align="center">
  <a href="#-install-in-one-command">Install</a> ·
  <a href="#features">Features</a> ·
  <a href="#usage">Usage</a> ·
  <a href="#troubleshooting">Troubleshooting</a> ·
  <a href="https://github.com/Jacksonnn911/BetterStatus/releases/tag/latest">Latest release</a>
</p>

---

## ✨ Install in one command

No Node.js knowledge, Git setup, or manual Vencord patching required.

### 🍎 macOS & Linux

Open **Terminal**, paste this command, and press Enter:

```bash
curl -fsSL https://raw.githubusercontent.com/Jacksonnn911/BetterStatus/prod/install.sh | bash
```

### 🪟 Windows

Open **PowerShell**, paste this command, and press Enter:

```powershell
irm https://raw.githubusercontent.com/Jacksonnn911/BetterStatus/prod/install.ps1 | iex
```

The guided installer detects your tools, reuses existing Vencord source code, builds BetterStatus, and patches Discord with simple prompts.

> [!IMPORTANT]
> BetterStatus is a third-party user plugin. Custom plugins require a source build and are not supported by the official Vencord support team.

## What makes BetterStatus different

### Switch without breaking your flow

| | Feature | Why it matters |
| --- | --- | --- |
| ⚡ | **True global shortcuts** | Change both custom status and presence from any app—without opening Discord. |
| 🧠 | **Fixed and Memory presets** | Apply exact text or remember the latest manual status used with each preset. |
| ↩️ | **Complete state restoration** | Bring back the active preset, custom text, and Online, Idle, DND, or Invisible state after restart. |

### More than a preset list

| | Feature | Why it matters |
| --- | --- | --- |
| 📚 | **Status library inside Discord** | Search, favorite, and reuse up to 1,000 statuses from Discord's own status dialog. |
| 🎛️ | **A real preset workspace** | Create unlimited presets, search instantly, see the active one, and collapse or expand editors. |
| ⇅ | **Complete portable backups** | Move presets, Memory values, status history, favorites, and preferences between computers in one file. |

### Built to take care of itself

| | Feature | Why it matters |
| --- | --- | --- |
| 🛡️ | **Verified incremental updates** | Download only changed files, verify SHA-256 hashes, rebuild Vencord, and roll back on failure. |
| 🚦 | **Updates on your terms** | Choose Production or Development, check manually or on a schedule, and optionally restart automatically. |
| ✨ | **One-command installation** | Find or install the required tools, build Vencord, and patch Discord on macOS, Linux, and Windows. |

That is the highlight reel—not the entire feature inventory. See [Usage](#usage) for the complete workflow and controls.

<p align="center">
  Crafted by <a href="https://github.com/Jacksonnn911"><strong>Jacksonnn911</strong></a> (<code>nik_jandaaa27829</code>) and <a href="https://github.com/qtmisaliba"><strong>qtmisaliba</strong></a> (<code>qtmisaliba</code>).
</p>

## Requirements

- Discord Desktop or [Vesktop](https://vesktop.vencord.dev/)
- An internet connection
- `curl` on macOS/Linux, or PowerShell on Windows

The easy installer handles Node.js, pnpm, Vencord source code, and the plugin for you. Existing compatible installations are reused when possible.

The plugin uses Electron's native global shortcut API, so browser and userscript builds are not supported.

## Installation details

### What the guided installer does

The guided installer is designed for non-technical users. It checks the computer, explains what it needs, and asks simple yes/no questions before downloading anything. It can:

- Detect Node.js, Bun, Yarn, and pnpm
- Download a private Node.js 24 runtime when Node.js is missing or too old
- Install pnpm privately without administrator access
- Download Vencord without requiring Git
- Download and build BetterStatus
- Patch Discord Desktop non-interactively or show the exact Vesktop folder to select

Files managed by the installer are kept inside your user data directory, not installed system-wide.

Before downloading Vencord, the installer searches the current directory and common folders such as `Desktop`, `Documents`, `Downloads`, `Projects`, `Developer`, `dev`, `code`, and `repos`. An existing Vencord source checkout is reused automatically. BetterStatus is always installed as a user plugin at `Vencord/src/userplugins/betterStatus`.

Use the [one-command installer](#-install-in-one-command), answer the prompts, and choose Discord Desktop or Vesktop at the end. No knowledge of Node.js or package managers is required.

For Discord Desktop, the installer uses Vencord's CLI with `--install` and an automatically selected location; it does not open the Vencord installer GUI. If Discord is running, the installer closes it before patching and relaunches it after a successful patch. Discord remains closed if it was already closed before installation.

Because Vencord does not publish a macOS CLI executable, each BetterStatus release builds the CLI directly from the official [`Vencord/Installer`](https://github.com/Vencord/Installer) source for Intel and Apple Silicon Macs. The downloaded binary is verified against the release's SHA-256 checksums before execution.

On macOS, Discord must be installed at `/Applications/Discord.app`. Immediately before patching, the installer runs `sudo chown -R "$USER":wheel /Applications/Discord.app` and asks for the account password. This gives the current user ownership of the Discord application bundle so it can be patched.

> [!TIP]
> If your Vencord source is in a non-standard location, set `VENCORD_DIR` for the shell that runs the installer. For example: `curl -fsSL https://raw.githubusercontent.com/Jacksonnn911/BetterStatus/prod/install.sh | VENCORD_DIR=/path/to/Vencord bash`.

> [!NOTE]
> Piping a remote script into a shell runs code from the internet. You can [inspect `install.sh`](./install.sh) or [inspect `install.ps1`](./install.ps1) before running it.

### Runtime compatibility

| Runtime/tool | Status | Notes |
| --- | --- | --- |
| Node.js 22 | Tested | Built in GitHub Actions on every release |
| Node.js 24 | Tested | Built in GitHub Actions on every release |
| Node.js 20 or older | Unsupported | Current Vencord requires Node.js 22 or newer |
| pnpm 11 | Supported | Vencord's declared package manager; used for installation and builds |
| Bun | Detected | Reported by the installer, but cannot directly build current Vencord |
| Yarn | Detected | Reported by the installer, but cannot directly build current Vencord |
| npm | Bundled helper | Used from Node.js to install pnpm privately when needed |

Bun is detected correctly, but it is not used as the build runtime because Vencord currently declares `pnpm@11.9.0`, uses a pnpm workspace with patched dependencies, and calls Node and pnpm from its own scripts. When Bun exists but Node.js does not, the installer explains this and offers to download a private Node.js runtime. It does not modify the user's Bun installation.

### Manual installation

If you prefer not to use the installer, first follow the official [Vencord source installation guide](https://docs.vencord.dev/installing/).

From your Vencord directory, create the user plugin directory and extract the latest release into it:

```sh
mkdir -p src/userplugins/betterStatus
curl -fsSL https://github.com/Jacksonnn911/BetterStatus/releases/download/latest/better-status.tar.gz \
    | tar -xz -C src/userplugins/betterStatus
```

Build Vencord:

```sh
pnpm build
```

Then apply the custom build:

- **Discord Desktop:** run `pnpm inject`, select your Discord installation, and restart Discord completely.
- **Vesktop:** open Vesktop settings, find **Vencord Location**, select the `dist` directory inside your Vencord source folder, and restart Vesktop completely.

For platform-specific details, see Vencord's [custom plugin guide](https://docs.vencord.dev/installing/custom-plugins/) and [custom build installation guide](https://docs.vencord.dev/installing/#installing-your-custom-build).

## Enabling the plugin

1. Open Discord's **User Settings**.
2. Go to **Vencord > Plugins**.
3. Search for **BetterStatus**.
4. Enable it.
5. Restart Discord if Vencord asks you to.

The plugin depends on Vencord's `UserSettingsAPI`; Vencord enables that dependency automatically.

## Usage

Open **User Settings > Vencord > Plugins**, find **BetterStatus**, and click the cog/settings button. The preset editor is rendered in Vencord's normal plugin settings section; the **Info** section contains links to this repository, documentation, and the issue tracker.

To create a preset:

1. Click **+ Add preset**.
2. Enter a preset name.
3. Select **Fixed** or **Memory** behavior.
4. Enter the initial custom status and select a presence.
5. Click **Record**, then press the desired key combination.
6. Leave **Enabled** switched on.

Changes are saved immediately. Press the shortcut from any application to activate the preset.

BetterStatus remembers the last active preset and restores its custom status and presence whenever Discord starts. For a Memory preset, the current Discord status is captured before restoration so manual changes are retained across restarts.

The settings dashboard also provides:

- Search across preset names, status text, presence, behavior, and hotkeys
- Live totals for all, enabled, and Memory presets
- A **Current** indicator and highlighted card for the active preset
- Per-preset collapse, duplicate, enable, and delete controls
- **Expand all** and **Collapse all** controls
- A Discord-style presence picker for Online, Idle, Do Not Disturb, and Invisible

### Backup, transfer, and sharing

The **Backup & sharing** panel exports everything BetterStatus stores to one readable JSON file: all presets and their Memory values, enabled states and hotkeys, the active preset, saved-status history and favorites, plus automatic-update preferences, frequency, restart behavior, and channel.

To move your setup to another computer:

1. Click **Export everything** on the original computer.
2. Move the downloaded `betterstatus-backup-YYYY-MM-DD.json` file to the new computer.
3. Install BetterStatus there and click **Import backup**.
4. Review the import summary and confirm the replacement.

Import validates the file before changing anything and refuses unsupported, malformed, or oversized backups. Existing BetterStatus data is replaced only after confirmation. When a macOS backup is imported on Windows, `Command` shortcuts are automatically converted to `Control`; all other shortcut combinations are preserved exactly. Export the current setup first if you may want to restore it later.

Discord's **Set your status** dialog also includes a searchable saved-status history. BetterStatus remembers up to 1,000 statuses, keeps favorites pinned above recent entries, and lets you reuse, favorite, or remove entries without returning to the plugin settings. Results are paginated in groups of 10 so the history never adds a nested scrollbar to Discord's modal.

BetterStatus checks for new releases automatically unless you opt out with **Auto Update** at the top of the plugin settings. It checks once at startup and then at the selected **Check frequency**, which defaults to every six hours and can be changed from 15 minutes through daily or limited to startup only. The update channel defaults to **Production**, which follows the `prod` branch. Selecting **Development** opens a required confirmation explaining that early builds may be unstable and are provided without warranty; the checkbox must be accepted before the channel changes. Returning to Production never requires confirmation.

The update panel includes a manual **Check for updates** button and reports the selected channel, installed commit, latest commit, last-check time, and a direct link to the exact GitHub commit. Its state badge distinguishes **Up to date**, **Update available**, **Restart required**, and **Version unavailable**. After a successful development build, GitHub Actions publishes a channel-neutral `files.json` manifest containing every managed file and its SHA-256 hash. BetterStatus compares those hashes with the installed files, downloads only changed or newly listed files from the manifest's immutable commit, verifies every download, and rebuilds Vencord with rollback on failure.

The currently running Discord session is not interrupted by default; enable the opt-in **Auto Restart Discord** switch if Discord should relaunch immediately after an update is installed. The production one-command installer remains the manual recovery/update method.

If GitHub responds with HTTP 403, BetterStatus reads GitHub's retry deadline, reports how long update information will remain unavailable, and pauses automatic checks until that deadline instead of repeatedly retrying.

Press `Escape` while recording to cancel. A preset can be temporarily disabled with its **Enabled** switch or permanently removed with **Delete Status**.

### Presence

The presence field uses a Discord-style switcher with the familiar Online, Idle, Do Not Disturb, and Invisible indicators and descriptions.

### Fixed and Memory presets

- **Fixed** always applies the exact custom-status text configured in the preset.
- **Memory** remembers manual changes made to your Discord custom status while that preset is active. The next time you activate another preset—or press the same preset's hotkey again—the current text is saved. Activating the Memory preset later restores that saved text.

For example, create a Memory preset with the `Do Not Disturb` presence. Activate it, manually change your Discord custom status to `Hello`, then switch presets. The next time you activate the Do Not Disturb preset, it restores `Hello`.

Presets created with an older plugin version automatically remain Fixed presets.

## Default presets

The plugin creates two example presets on first use:

| Preset | Presence | Shortcut |
| --- | --- | --- |
| Sleeping | Do Not Disturb | `Command` + `-` |
| Normal | Online | `Command` + `=` |

These defaults are designed for macOS. On Windows or Linux—or if the combinations conflict with another application—record different shortcuts in the plugin settings.

## How it works

When Vencord starts the plugin, BetterStatus loads your presets and registers every enabled shortcut through Electron's `globalShortcut` API. When a shortcut is pressed, the native process tells the Vencord renderer which preset to activate. Before switching, the plugin saves the current text for the active Memory preset. It then updates Discord's custom-status and presence settings through Vencord's `UserSettingsAPI`.

Presets are stored through Vencord's typed `definePluginSettings` API. The preset list is a custom persisted option, and the editor is an `OptionType.COMPONENT`, so it appears and updates inside Vencord's standard plugin settings modal. Old `StatusHotkeys` settings are migrated with Vencord's supported migration helper. Disabling or deleting a preset immediately rebuilds the registered shortcut list, and disabling the plugin unregisters all of its shortcuts.

Discord state is read and written through Vencord's `UserSettingsAPI`; the plugin declares that dependency so Vencord enables it automatically. The `native.ts` helper runs in Electron's main process to register system-wide shortcuts and perform verified source updates. The saved-status history is attached to Discord's existing status modal and stores normalized history through BetterStatus's typed settings. This follows Vencord's documented user-plugin layout: the plugin source files live together in `src/userplugins/betterStatus` after installation.

Vencord labels BetterStatus with the `Shortcuts` and `Utility` categories. Vencord intentionally reserves the favorite, website, and GitHub buttons in the plugin-modal header for built-in plugins, so the repository and documentation links are provided in BetterStatus's Info section instead.

## Updating

For normal updates, open BetterStatus settings and click **Check for updates**. If an update is installed, either restart Discord manually or enable **Auto Restart Discord** for future updates.

Production users receive the latest successfully tested `prod` build. Development users follow `dev` after accepting the development-build warning. The `dev` branch owns and refreshes `files.json`; production receives that tested manifest only when development is promoted, so `prod` never generates or rewrites it independently.

The same one-command installer can always be run again as a repair or recovery method. It downloads the current production release, replaces the managed plugin files, and rebuilds Vencord.

Alternatively, repeat the manual archive command above and then rebuild from your Vencord directory:

```sh
pnpm build
```

Reapply the build if required by your client, then restart Discord or Vesktop.

## Uninstalling

1. Disable **BetterStatus** in Vencord's plugin settings.
2. Delete `src/userplugins/betterStatus` from your Vencord source directory.
3. Run `pnpm build` from the Vencord directory.
4. Reapply the build if required, then restart the client.

## Troubleshooting

### The plugin does not appear

- Confirm the entry file is located at `Vencord/src/userplugins/betterStatus/index.tsx`.
- Rebuild Vencord and fully restart Discord or Vesktop.
- Check the build output for TypeScript or plugin-loading errors.

### Build says "not a git repository"

Update and rerun the installer. Current versions provide Vencord's required build metadata when the installer-managed source archive has no `.git` directory.

### A shortcut does nothing

- Make sure the preset and plugin are both enabled.
- Record a different combination. Electron cannot register a shortcut already reserved by the operating system or another application.
- Avoid single-key shortcuts and common system shortcuts.
- Restart the client after changing or updating the plugin if registration still fails.

### The status does not update

- Confirm Vencord's `UserSettingsAPI` dependency is enabled.
- Open Discord's developer console and look for messages beginning with `[BetterStatus]`.
- Discord or Vencord updates can change internal settings APIs; rebuild with an up-to-date Vencord checkout.

### Update information is unavailable

- Confirm GitHub is reachable and try **Check for updates** again.
- **Installed** comes from the local `VERSION` marker; **Latest** comes from the verified `files.json` promoted with the selected branch.
- If **Restart required** remains after an update, fully quit and reopen Discord rather than only closing the settings window.
- Run the production one-command installer if files were manually moved, partially deleted, or cannot be repaired by rollback.

### macOS permissions

If ownership changes fail with `Operation not permitted`, give your terminal application **Full Disk Access**:

1. Open **System Settings > Privacy & Security > Full Disk Access**.
2. Enable Terminal, iTerm, Warp, or whichever terminal application ran the installer.
3. Fully quit and reopen the terminal application.
4. Run the BetterStatus installation command again.

The installer detects this failure, offers to open the correct System Settings page, and stops before attempting to patch Discord.

If global shortcuts are not detected after installation, check **System Settings > Privacy & Security** and ensure Discord or Vesktop has any requested input-related permissions.

## Development

Build the current checkout for the locally installed Discord client with:

```sh
make dev
```

By default, this uses the Vencord source installed by BetterStatus at `~/.local/share/status-hotkeys/Vencord`. The command syncs the plugin sources, installs Vencord's locked dependencies, creates a development build, then automatically quits and reopens Discord so the new build is loaded.

To use another Vencord checkout, pass its path explicitly:

```sh
make dev VENCORD_DIR=/path/to/Vencord
```

That checkout must already be injected into the Discord client you want to test.

The main files are:

- `src/index.tsx` — plugin lifecycle, preset storage, and Discord setting updates
- `src/Settings.tsx` — preset editor and shortcut recorder
- `src/StatusHistory.tsx` — saved-status history inside Discord's status modal
- `src/StatusSwitcher.tsx` — Discord-style presence menu
- `src/savedStatuses.ts` — saved-history normalization, deduplication, and retention policy
- `src/native.ts` — Electron global shortcuts, manifest verification, update status, rollback, and rebuilds
- `src/types.ts` — shared preset and presence types

## Automated releases

Every push to `prod` or `dev` runs compatibility builds on Node.js 22 and 24 with pnpm 11. After successful development compatibility tests, only `dev` publishes the channel-neutral `files.json` manifest with immutable commit information and a SHA-256 hash for every managed file. Production receives the tested dev manifest during promotion and never regenerates it. Only `prod` also builds headless macOS Vencord CLI binaries from the official installer source, validates the installers, creates `.tar.gz` and `.zip` plugin packages, generates release checksums, uploads workflow artifacts, and replaces the rolling `latest` GitHub release used by the production installers. The `dev` branch remains available only to users who explicitly accept and select the Development channel.
