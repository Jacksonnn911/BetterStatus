$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

function Write-Step([string]$Message) {
    Write-Host "[BetterStatus] $Message" -ForegroundColor Cyan
}

function Write-Success([string]$Message) {
    Write-Host "[BetterStatus] $Message" -ForegroundColor Green
}

function Write-Warn([string]$Message) {
    Write-Host "[BetterStatus] $Message" -ForegroundColor Yellow
}

$Repository = "Jacksonnn911/BetterStatus"
$Channel = if ($env:BETTERSTATUS_CHANNEL) { $env:BETTERSTATUS_CHANNEL.Trim().ToLowerInvariant() } else { "prod" }
if ($Channel -notin @("prod", "dev")) {
    throw "BETTERSTATUS_CHANNEL must be 'prod' or 'dev'."
}

if (-not $env:APPDATA) {
    throw "APPDATA is unavailable. This installer is intended for Windows."
}

$BetterDiscordRoot = Join-Path $env:APPDATA "BetterDiscord"
$PluginsDirectory = Join-Path $BetterDiscordRoot "plugins"
$Target = Join-Path $PluginsDirectory "BetterStatus.plugin.js"
$Backup = "$Target.bak"
$Temporary = Join-Path $env:TEMP ("BetterStatus-" + [Guid]::NewGuid().ToString("N") + ".plugin.js")
$PluginUrl = "https://raw.githubusercontent.com/$Repository/$Channel/betterdiscord/BetterStatus.plugin.js"

Write-Host ""
Write-Host "BetterStatus for BetterDiscord" -ForegroundColor Magenta
Write-Host "Channel: $Channel"
Write-Host ""

if (-not (Test-Path $BetterDiscordRoot)) {
    Write-Warn "BetterDiscord's data folder was not found yet. I will create the plugins folder anyway."
    Write-Warn "If BetterDiscord is not installed, install it first and then run this command again."
}

New-Item -ItemType Directory -Force -Path $PluginsDirectory | Out-Null

try {
    Write-Step "Downloading the latest BetterDiscord build..."
    Invoke-WebRequest -UseBasicParsing -Uri $PluginUrl -OutFile $Temporary -Headers @{ "Cache-Control" = "no-cache" } -UserAgent "BetterStatus-BetterDiscord-Installer"

    $Downloaded = Get-Content -Raw -LiteralPath $Temporary
    if ($Downloaded.Length -lt 10000) {
        throw "Downloaded file is unexpectedly small."
    }
    if ($Downloaded -notmatch "@name BetterStatus") {
        throw "Downloaded file is not a BetterStatus plugin."
    }
    if ($Downloaded -notmatch ("@channel\s+" + [Regex]::Escape($Channel))) {
        throw "Downloaded BetterStatus build does not match the requested '$Channel' channel."
    }

    if (Test-Path $Backup) {
        Remove-Item -Force $Backup
    }
    if (Test-Path $Target) {
        Write-Step "Replacing the existing BetterStatus installation..."
        Move-Item -Force $Target $Backup
    } else {
        Write-Step "Installing BetterStatus..."
    }

    Move-Item -Force $Temporary $Target

    $Installed = Get-Content -Raw -LiteralPath $Target
    if ($Installed -notmatch "@name BetterStatus") {
        throw "Installed file failed validation."
    }

    if (Test-Path $Backup) {
        Remove-Item -Force $Backup
    }

    Write-Host ""
    Write-Success "BetterStatus was installed successfully."
    Write-Host "Installed to: $Target"
    Write-Host ""
    Write-Host "Open Discord -> User Settings -> BetterDiscord -> Plugins and enable BetterStatus." -ForegroundColor White
    Write-Host "If Discord is already open and the plugin does not appear immediately, press Ctrl+R once." -ForegroundColor DarkGray
    Write-Host ""
} catch {
    if (Test-Path $Temporary) {
        Remove-Item -Force $Temporary -ErrorAction SilentlyContinue
    }
    if (Test-Path $Backup) {
        if (Test-Path $Target) {
            Remove-Item -Force $Target -ErrorAction SilentlyContinue
        }
        Move-Item -Force $Backup $Target -ErrorAction SilentlyContinue
    }
    throw "BetterStatus installation failed: $($_.Exception.Message)"
}
