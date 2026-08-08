$ErrorActionPreference = "Stop"

$Repository = "Jacksonnn911/StatusHotkeys"
$PluginName = "statusHotkeys"
$ArchiveUrl = "https://github.com/$Repository/releases/latest/download/status-hotkeys.zip"

function Write-Step([string]$Message) {
    Write-Host "==> $Message" -ForegroundColor Cyan
}

foreach ($Command in @("git", "node")) {
    if (-not (Get-Command $Command -ErrorAction SilentlyContinue)) {
        throw "Missing '$Command'. Install Git and Node.js, then run this command again."
    }
}

$NodeMajor = [int]((node --version).TrimStart("v").Split(".")[0])
if ($NodeMajor -lt 22) {
    throw "Vencord requires Node.js 22 or newer (found $(node --version))."
}

if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    if (Get-Command bun -ErrorAction SilentlyContinue) {
        $InstallerName = "Bun"
        $InstallCommand = { bun add --global pnpm@11.9.0 }
    } elseif (Get-Command yarn -ErrorAction SilentlyContinue) {
        $InstallerName = "Yarn"
        $InstallCommand = { yarn global add pnpm@11.9.0 }
    } elseif (Get-Command corepack -ErrorAction SilentlyContinue) {
        $InstallerName = "Corepack"
        $InstallCommand = { corepack install --global pnpm@11.9.0 }
    } elseif (Get-Command npm -ErrorAction SilentlyContinue) {
        $InstallerName = "npm"
        $InstallCommand = { npm install --global pnpm@11.9.0 }
    } else {
        throw "Vencord requires pnpm, and no Bun, Yarn, Corepack, or npm installation method was found."
    }

    $Answer = Read-Host "pnpm is required by Vencord but is not installed. Install it with $InstallerName? [Y/n]"
    if ($Answer -and $Answer -notmatch '^(y|yes)$') {
        throw "pnpm installation declined. No changes were made."
    }

    Write-Step "Installing pnpm 11 with $InstallerName"
    & $InstallCommand

    if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
        throw "pnpm was installed but is not available on PATH. Restart PowerShell and run the installer again."
    }
}

if ($env:VENCORD_DIR) {
    $VencordDir = $env:VENCORD_DIR
} elseif ((Test-Path "$PWD\package.json") -and (Test-Path "$PWD\src")) {
    $VencordDir = $PWD.Path
} elseif (Test-Path "$HOME\Vencord\src") {
    $VencordDir = "$HOME\Vencord"
} elseif (Test-Path "$HOME\Documents\Vencord\src") {
    $VencordDir = "$HOME\Documents\Vencord"
} else {
    $VencordDir = "$HOME\Vencord"
    Write-Step "No Vencord source checkout found; cloning it to $VencordDir"
    git clone https://github.com/Vendicated/Vencord.git $VencordDir
    Write-Step "Installing Vencord dependencies"
    pnpm --dir $VencordDir install --frozen-lockfile
}

if (-not ((Test-Path "$VencordDir\package.json") -and (Test-Path "$VencordDir\src"))) {
    throw "'$VencordDir' is not a Vencord source checkout. Set VENCORD_DIR to the correct directory."
}

$TemporaryDir = Join-Path ([System.IO.Path]::GetTempPath()) ("status-hotkeys-" + [guid]::NewGuid())
New-Item -ItemType Directory -Path $TemporaryDir | Out-Null

try {
    $Archive = Join-Path $TemporaryDir "status-hotkeys.zip"
    Write-Step "Downloading the latest StatusHotkeys release"
    Invoke-WebRequest -UseBasicParsing -Uri $ArchiveUrl -OutFile $Archive
    Expand-Archive -Path $Archive -DestinationPath "$TemporaryDir\plugin"

    $PluginDir = "$VencordDir\src\userplugins\$PluginName"
    New-Item -ItemType Directory -Force -Path $PluginDir | Out-Null
    foreach ($File in @("index.tsx", "Settings.tsx", "native.ts", "types.ts", "README.md")) {
        Copy-Item -Force "$TemporaryDir\plugin\$File" "$PluginDir\$File"
    }

    Write-Step "Building Vencord"
    pnpm --dir $VencordDir build
} finally {
    Remove-Item -Recurse -Force $TemporaryDir -ErrorAction SilentlyContinue
}

Write-Host "`nStatusHotkeys is installed and Vencord was built successfully." -ForegroundColor Green
Write-Host "Discord Desktop: run  cd `"$VencordDir`"; pnpm inject  and restart Discord."
Write-Host "Vesktop: select $VencordDir\dist as the Vencord Location, then restart Vesktop."
