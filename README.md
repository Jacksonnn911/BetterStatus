# StatusHotkeys

StatusHotkeys is a custom [Vencord](https://vencord.dev/) plugin that lets you create Discord status presets and activate them with system-wide keyboard shortcuts—even while Discord is in the background.

Created by [Jacksonnn911](https://github.com/Jacksonnn911).

Each preset can define:

- A display name
- Custom status text
- A Discord presence (`Online`, `Idle`, `Do Not Disturb`, or `Invisible`)
- A global keyboard shortcut
- Whether the preset is enabled

> [!IMPORTANT]
> This is a third-party user plugin. Custom plugins require building Vencord from source and are not supported by the official Vencord support team.

## Requirements

- Discord Desktop or [Vesktop](https://vesktop.vencord.dev/)
- An internet connection
- `curl` on macOS/Linux, or PowerShell on Windows

The easy installer handles Node.js, pnpm, Vencord source code, and the plugin for you. Existing compatible installations are reused when possible.

The plugin uses Electron's native global shortcut API, so browser and userscript builds are not supported.

## Installation

### One-command installation

The guided installer is designed for non-technical users. It checks the computer, explains what it needs, and asks simple yes/no questions before downloading anything. It can:

- Detect Node.js, Bun, Yarn, and pnpm
- Download a private Node.js 24 runtime when Node.js is missing or too old
- Install pnpm privately without administrator access
- Download Vencord without requiring Git
- Download and build StatusHotkeys
- Open the Discord Desktop injector or show the exact Vesktop folder to select

Files managed by the installer are kept inside your user data directory, not installed system-wide.

Before downloading Vencord, the installer searches the current directory and common folders such as `Desktop`, `Documents`, `Downloads`, `Projects`, `Developer`, `dev`, `code`, and `repos`. An existing Vencord source checkout is reused automatically. StatusHotkeys is always installed as a user plugin at `Vencord/src/userplugins/statusHotkeys`.

**macOS or Linux:**

```sh
curl -fsSL https://raw.githubusercontent.com/Jacksonnn911/StatusHotkeys/main/install.sh | bash
```

**Windows PowerShell:**

```powershell
irm https://raw.githubusercontent.com/Jacksonnn911/StatusHotkeys/main/install.ps1 | iex
```

Answer the prompts and choose Discord Desktop or Vesktop at the end. No knowledge of Node.js or package managers is required.

> [!TIP]
> If your Vencord source is in a non-standard location, set `VENCORD_DIR` for the shell that runs the installer. For example: `curl -fsSL https://raw.githubusercontent.com/Jacksonnn911/StatusHotkeys/main/install.sh | VENCORD_DIR=/path/to/Vencord bash`.

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

From your Vencord directory, create the user plugin directory and clone StatusHotkeys into it:

```sh
mkdir -p src/userplugins
git clone https://github.com/Jacksonnn911/StatusHotkeys.git src/userplugins/statusHotkeys
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
3. Search for **StatusHotkeys**.
4. Enable it.
5. Restart Discord if Vencord asks you to.

The plugin depends on Vencord's `UserSettingsAPI`; Vencord enables that dependency automatically.

## Usage

Open **User Settings > Vencord > Plugins**, find **StatusHotkeys**, and open its settings.

To create a preset:

1. Click **+ Add Status**.
2. Enter a preset name and the custom status text Discord should display.
3. Select a presence.
4. Click **Record**, then press the desired key combination.
5. Leave **Enabled** switched on.

Changes are saved immediately. Press the shortcut from any application to activate the preset.

Press `Escape` while recording to cancel. A preset can be temporarily disabled with its **Enabled** switch or permanently removed with **Delete Status**.

## Default presets

The plugin creates two example presets on first use:

| Preset | Presence | Shortcut |
| --- | --- | --- |
| Sleeping | Do Not Disturb | `Command` + `-` |
| Normal | Online | `Command` + `=` |

These defaults are designed for macOS. On Windows or Linux—or if the combinations conflict with another application—record different shortcuts in the plugin settings.

## How it works

When Vencord starts the plugin, StatusHotkeys loads your presets and registers every enabled shortcut through Electron's `globalShortcut` API. When a shortcut is pressed, the native process tells the Vencord renderer which preset to activate. The plugin then updates Discord's custom-status and presence settings through Vencord's `UserSettingsAPI`.

Presets are stored in Vencord's plugin settings. Disabling or deleting a preset immediately rebuilds the registered shortcut list, and disabling the plugin unregisters all of its shortcuts.

## Updating

Run the same one-command installer again. It downloads the current rolling release, replaces the plugin files, and rebuilds Vencord.

Alternatively, if you installed the repository manually, run this from the plugin directory inside your Vencord checkout:

```sh
git pull
cd ../../..
pnpm build
```

Reapply the build if required by your client, then restart Discord or Vesktop.

## Uninstalling

1. Disable **StatusHotkeys** in Vencord's plugin settings.
2. Delete `src/userplugins/statusHotkeys` from your Vencord source directory.
3. Run `pnpm build` from the Vencord directory.
4. Reapply the build if required, then restart the client.

## Troubleshooting

### The plugin does not appear

- Confirm the entry file is located at `Vencord/src/userplugins/statusHotkeys/index.tsx`.
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
- Open Discord's developer console and look for messages beginning with `[StatusHotkeys]`.
- Discord or Vencord updates can change internal settings APIs; rebuild with an up-to-date Vencord checkout.

### macOS permissions

If global shortcuts are not detected, check **System Settings > Privacy & Security** and ensure Discord or Vesktop has any requested input-related permissions.

## Development

Place the repository at `Vencord/src/userplugins/statusHotkeys`, then run a development watcher from the Vencord root:

```sh
pnpm build --dev --watch
```

The main files are:

- `index.tsx` — plugin lifecycle, preset storage, and Discord setting updates
- `Settings.tsx` — preset editor and shortcut recorder
- `native.ts` — Electron global shortcut registration
- `types.ts` — shared preset and presence types

## Automated releases

Every push to `main` runs the GitHub Actions release workflow. Before publishing, it installs the plugin into a clean Vencord checkout and builds it on Node.js 22 and 24 with pnpm 11. It then validates the installer, creates `.tar.gz` and `.zip` plugin packages, generates SHA-256 checksums, uploads workflow artifacts, and replaces the rolling `latest` GitHub release used by the installers.
