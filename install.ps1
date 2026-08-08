$ErrorActionPreference = "Stop"

$Repository = "Jacksonnn911/BetterStatus"
$PluginName = "betterStatus"
$PluginUrl = "https://github.com/$Repository/releases/download/latest/better-status.zip"
$VencordUrl = "https://github.com/Vendicated/Vencord/archive/refs/heads/main.zip"
$NodeIndex = "https://nodejs.org/dist/latest-v24.x"
$DataDir = Join-Path $env:LOCALAPPDATA "StatusHotkeys"
$RuntimeDir = Join-Path $DataDir "runtime\node"
$ToolsDir = Join-Path $DataDir "tools"

function Write-Step([string]$Message) {
    Write-Host "==> $Message" -ForegroundColor Cyan
}

function Write-Success([string]$Message) {
    Write-Host "OK  $Message" -ForegroundColor Green
}

function Confirm-Step([string]$Message) {
    $Answer = Read-Host "$Message [Y/n]"
    return (-not $Answer -or $Answer -match '^(y|yes)$')
}

function Test-VencordSource([string]$Path) {
    if (-not ((Test-Path "$Path\package.json") -and (Test-Path "$Path\src\plugins"))) {
        return $false
    }
    return (Get-Content "$Path\package.json" -Raw) -match '"name"\s*:\s*"vencord"'
}

function Find-VencordSource {
    $Candidates = @(
        $PWD.Path,
        "$HOME\Vencord",
        "$HOME\vencord",
        "$HOME\Documents\Vencord",
        "$HOME\Desktop\Vencord",
        "$HOME\Downloads\Vencord",
        (Join-Path $DataDir "Vencord")
    )
    foreach ($Candidate in $Candidates) {
        if (Test-VencordSource $Candidate) {
            return $Candidate
        }
    }

    foreach ($SearchRoot in @("$HOME\Desktop", "$HOME\Documents", "$HOME\Projects", "$HOME\Developer", "$HOME\dev", "$HOME\code", "$HOME\repos")) {
        if (-not (Test-Path $SearchRoot)) { continue }
        $PackageFiles = Get-ChildItem -Path $SearchRoot -Filter package.json -File -Recurse -Depth 2 -ErrorAction SilentlyContinue
        foreach ($PackageFile in $PackageFiles) {
            if (Test-VencordSource $PackageFile.DirectoryName) {
                return $PackageFile.DirectoryName
            }
        }
    }
    return $null
}

Write-Host "`nBetterStatus easy installer" -ForegroundColor Cyan
Write-Host "This installs everything into your user account; administrator access is not needed.`n"

New-Item -ItemType Directory -Force -Path $DataDir, $RuntimeDir, $ToolsDir | Out-Null
if (Test-Path "$RuntimeDir\node.exe") {
    $env:Path = "$RuntimeDir;$env:Path"
}
if (Test-Path "$ToolsDir\pnpm.cmd") {
    $env:Path = "$ToolsDir;$env:Path"
}

$CompatibleNode = $false
if (Get-Command node -ErrorAction SilentlyContinue) {
    $NodeVersion = (node --version).Trim()
    $NodeMajor = [int]($NodeVersion.TrimStart("v").Split(".")[0])
    if ($NodeMajor -ge 22) {
        $CompatibleNode = $true
        Write-Success "Found compatible Node.js $NodeVersion"
    } else {
        Write-Step "Found Node.js $NodeVersion, but Vencord requires version 22 or newer."
    }
} else {
    Write-Step "Node.js was not found."
}

if (Get-Command bun -ErrorAction SilentlyContinue) {
    Write-Success "Found Bun $(bun --version)"
    Write-Step "Bun cannot replace Node.js here because Vencord uses Node- and pnpm-specific build tools."
}
if (Get-Command yarn -ErrorAction SilentlyContinue) {
    Write-Success "Found Yarn $(yarn --version)"
}
if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    Write-Success "Found pnpm $(pnpm --version)"
}

$TemporaryDir = Join-Path ([System.IO.Path]::GetTempPath()) ("status-hotkeys-" + [guid]::NewGuid())
New-Item -ItemType Directory -Path $TemporaryDir | Out-Null

try {
    if (-not $CompatibleNode) {
        if (-not (Confirm-Step "Download a private Node.js 24 runtime for BetterStatus?")) {
            throw "Node.js is required, so installation was cancelled."
        }

        $Architecture = switch ([System.Runtime.InteropServices.RuntimeInformation]::OSArchitecture.ToString()) {
            "X64" { "x64" }
            "Arm64" { "arm64" }
            default { throw "Unsupported CPU architecture: $_" }
        }

        Write-Step "Finding the latest Node.js 24 release"
        $ChecksumsPath = Join-Path $TemporaryDir "SHASUMS256.txt"
        Invoke-WebRequest -UseBasicParsing -Uri "$NodeIndex/SHASUMS256.txt" -OutFile $ChecksumsPath
        $Pattern = "[a-f0-9]{64}  (node-v[^ ]+-win-$Architecture\.zip)"
        $Match = [regex]::Match((Get-Content $ChecksumsPath -Raw), $Pattern)
        if (-not $Match.Success) {
            throw "Could not find a Node.js download for this computer."
        }
        $NodeFile = $Match.Groups[1].Value
        $ExpectedHash = $Match.Value.Substring(0, 64).ToUpperInvariant()
        $NodeArchive = Join-Path $TemporaryDir "node.zip"
        Write-Step "Downloading $NodeFile"
        Invoke-WebRequest -UseBasicParsing -Uri "$NodeIndex/$NodeFile" -OutFile $NodeArchive
        $ActualHash = (Get-FileHash -Algorithm SHA256 $NodeArchive).Hash
        if ($ActualHash -ne $ExpectedHash) {
            throw "The Node.js download checksum did not match."
        }

        $ExpandedNode = Join-Path $TemporaryDir "node"
        Expand-Archive -Path $NodeArchive -DestinationPath $ExpandedNode
        $NodeRoot = Get-ChildItem -Directory $ExpandedNode | Select-Object -First 1
        Remove-Item -Recurse -Force $RuntimeDir
        New-Item -ItemType Directory -Force -Path $RuntimeDir | Out-Null
        Copy-Item -Recurse -Force "$($NodeRoot.FullName)\*" $RuntimeDir
        $env:Path = "$RuntimeDir;$env:Path"
        Write-Success "Installed private Node.js $(node --version)"
    }

    if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
        if (-not (Confirm-Step "Install the required pnpm build tool privately?")) {
            throw "pnpm is required, so installation was cancelled."
        }
        Write-Step "Installing pnpm 11 into $ToolsDir"
        npm install --global --prefix $ToolsDir pnpm@11.9.0
        $env:Path = "$ToolsDir;$env:Path"
        Write-Success "Installed pnpm $(pnpm --version)"
    }

    if ($env:VENCORD_DIR) {
        $VencordDir = $env:VENCORD_DIR
    } else {
        $VencordDir = Find-VencordSource
        if ($VencordDir) {
            Write-Success "Found existing Vencord source at $VencordDir"
        } else {
            $VencordDir = Join-Path $DataDir "Vencord"
        }
    }

    if (-not (Test-VencordSource $VencordDir)) {
        if (-not (Confirm-Step "Download Vencord source code into $VencordDir?")) {
            throw "Vencord source code is required, so installation was cancelled."
        }
        Write-Step "Downloading Vencord (Git is not required)"
        $VencordArchive = Join-Path $TemporaryDir "vencord.zip"
        Invoke-WebRequest -UseBasicParsing -Uri $VencordUrl -OutFile $VencordArchive
        $ExpandedVencord = Join-Path $TemporaryDir "vencord"
        Expand-Archive -Path $VencordArchive -DestinationPath $ExpandedVencord
        $VencordRoot = Get-ChildItem -Directory $ExpandedVencord | Select-Object -First 1
        New-Item -ItemType Directory -Force -Path $VencordDir | Out-Null
        Copy-Item -Recurse -Force "$($VencordRoot.FullName)\*" $VencordDir
        Write-Success "Downloaded Vencord"
    }

    if (-not (Test-VencordSource $VencordDir)) {
        throw "The selected Vencord directory is invalid: $VencordDir"
    }

    $PluginArchive = Join-Path $TemporaryDir "better-status.zip"
    Write-Step "Downloading the latest BetterStatus release"
    Invoke-WebRequest -UseBasicParsing -Uri $PluginUrl -OutFile $PluginArchive
    $ExpandedPlugin = Join-Path $TemporaryDir "plugin"
    Expand-Archive -Path $PluginArchive -DestinationPath $ExpandedPlugin
    $PluginDir = "$VencordDir\src\userplugins\$PluginName"
    New-Item -ItemType Directory -Force -Path $PluginDir | Out-Null
    Remove-Item -Force -ErrorAction SilentlyContinue "$PluginDir\SavedStatusesProfile.tsx"
    foreach ($File in @("index.tsx", "Settings.tsx", "StatusSwitcher.tsx", "savedStatuses.ts", "native.ts", "types.ts", "README.md")) {
        Copy-Item -Force "$ExpandedPlugin\$File" "$PluginDir\$File"
    }
    Remove-Item -Force -ErrorAction SilentlyContinue "$PluginDir\styles.css"
    if (Test-Path "$ExpandedPlugin\styles.css") {
        Copy-Item -Force "$ExpandedPlugin\styles.css" "$PluginDir\styles.css"
    }
    Remove-Item -Force -ErrorAction SilentlyContinue "$PluginDir\VERSION"
    if (Test-Path "$ExpandedPlugin\VERSION") {
        Copy-Item -Force "$ExpandedPlugin\VERSION" "$PluginDir\VERSION"
    } else {
        Write-Step "This release predates version markers; Auto Update will initialize it on its first check"
    }
    $LegacyPluginDir = "$VencordDir\src\userplugins\statusHotkeys"
    if (Test-Path $LegacyPluginDir) {
        Remove-Item -Recurse -Force $LegacyPluginDir
        Write-Step "Removed the old StatusHotkeys plugin folder after migration"
    }
    Write-Success "Installed BetterStatus source files"

    # GitHub source archives do not contain .git metadata. Vencord accepts
    # these values instead of calling Git while building archive installs.
    if (-not (Test-Path "$VencordDir\.git")) {
        $env:VENCORD_HASH = "archive"
        $env:VENCORD_REMOTE = "Vendicated/Vencord"
    }

    Write-Step "Installing build dependencies (this can take a few minutes)"
    pnpm --dir $VencordDir install --frozen-lockfile
    Write-Step "Building Vencord"
    pnpm --dir $VencordDir build
    Write-Success "BetterStatus and Vencord built successfully"

    Write-Host "`nWhich Discord client do you use?"
    Write-Host "  1) Discord Desktop"
    Write-Host "  2) Vesktop"
    Write-Host "  3) Finish without configuring a client"
    $ClientChoice = Read-Host "Choice [1]"
    switch ($ClientChoice) {
        "2" {
            Write-Host "`nIn Vesktop, open Settings, find 'Vencord Location', and select:"
            Write-Host "$VencordDir\dist" -ForegroundColor Yellow
            Write-Host "Then restart Vesktop and enable BetterStatus under Vencord > Plugins."
        }
        "3" { Write-Host "`nBuild complete. Vencord is located at: $VencordDir" }
        default {
            $InstallerScript = Join-Path $VencordDir "scripts\runInstaller.mjs"
            if (-not (Test-Path $InstallerScript)) {
                throw "Vencord's installer script was not found."
            }
            $DiscordProcesses = @(Get-Process -Name "Discord" -ErrorAction SilentlyContinue)
            $DiscordWasRunning = $DiscordProcesses.Count -gt 0
            $DiscordLaunchPath = $null
            if ($DiscordWasRunning) {
                $DiscordLaunchPath = $DiscordProcesses[0].Path
                Write-Step "Closing Discord before patching"
                $DiscordProcesses | Stop-Process -Force
                $DiscordProcesses | Wait-Process -ErrorAction SilentlyContinue
            }
            Write-Step "Installing the custom Vencord build into Discord without opening the installer GUI"
            node $InstallerScript -- --install --branch auto
            if ($DiscordWasRunning -and $DiscordLaunchPath) {
                Write-Step "Relaunching Discord"
                Start-Process -FilePath $DiscordLaunchPath
            }
            Write-Host "`nEnable BetterStatus under Vencord > Plugins, and you are done." -ForegroundColor Green
        }
    }
} finally {
    Remove-Item -Recurse -Force $TemporaryDir -ErrorAction SilentlyContinue
}
