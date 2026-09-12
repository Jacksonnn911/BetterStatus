const G = globalThis as any;

type HotkeyPreset = {
  id: string;
  hotkey: string;
  enabled: boolean;
};

type ParsedHotkey = {
  modifiers: number;
  vk: number;
};

let helperProcess: any;
let helperConfigPath: string | undefined;
let helperScriptPath: string | undefined;

const MOD_ALT = 0x0001;
const MOD_CONTROL = 0x0002;
const MOD_SHIFT = 0x0004;
const MOD_WIN = 0x0008;
const MOD_NOREPEAT = 0x4000;

function isWindows() {
  const platform = G.process?.platform || G.window?.process?.platform;
  if (platform) return platform === "win32";
  const browserPlatform = String(G.navigator?.userAgentData?.platform || G.navigator?.platform || G.navigator?.userAgent || "").toLowerCase();
  return browserPlatform.includes("win");
}

function windowsVirtualKey(rawKey: string) {
  const key = rawKey.trim();
  const upper = key.toUpperCase();

  if (/^[A-Z]$/.test(upper)) return upper.charCodeAt(0);
  if (/^[0-9]$/.test(upper)) return upper.charCodeAt(0);

  const functionKey = upper.match(/^F(\d{1,2})$/);
  if (functionKey) {
    const number = Number(functionKey[1]);
    if (number >= 1 && number <= 24) return 0x70 + number - 1;
  }

  const numpad = upper.match(/^(?:NUMPAD|NUM)([0-9])$/);
  if (numpad) return 0x60 + Number(numpad[1]);

  const named: Record<string, number> = {
    BACKSPACE: 0x08,
    TAB: 0x09,
    ENTER: 0x0D,
    RETURN: 0x0D,
    PAUSE: 0x13,
    CAPSLOCK: 0x14,
    ESCAPE: 0x1B,
    ESC: 0x1B,
    SPACE: 0x20,
    PAGEUP: 0x21,
    PAGEDOWN: 0x22,
    END: 0x23,
    HOME: 0x24,
    LEFT: 0x25,
    ARROWLEFT: 0x25,
    UP: 0x26,
    ARROWUP: 0x26,
    RIGHT: 0x27,
    ARROWRIGHT: 0x27,
    DOWN: 0x28,
    ARROWDOWN: 0x28,
    PRINTSCREEN: 0x2C,
    INSERT: 0x2D,
    DELETE: 0x2E,
    MULTIPLY: 0x6A,
    ADD: 0x6B,
    SUBTRACT: 0x6D,
    DECIMAL: 0x6E,
    DIVIDE: 0x6F,
    NUMLOCK: 0x90,
    SCROLLLOCK: 0x91,
    PLUS: 0xBB,
    "+": 0xBB,
    "=": 0xBB,
    "-": 0xBD,
    "_": 0xBD,
    ",": 0xBC,
    "<": 0xBC,
    ".": 0xBE,
    ">": 0xBE,
    "/": 0xBF,
    "?": 0xBF,
    "`": 0xC0,
    "~": 0xC0,
    "[": 0xDB,
    "{": 0xDB,
    "\\": 0xDC,
    "|": 0xDC,
    "]": 0xDD,
    "}": 0xDD,
    ";": 0xBA,
    ":": 0xBA,
    "'": 0xDE,
    "\"": 0xDE,
    "!": 0x31,
    "@": 0x32,
    "#": 0x33,
    "$": 0x34,
    "%": 0x35,
    "^": 0x36,
    "&": 0x37,
    "*": 0x38,
    "(": 0x39,
    ")": 0x30
  };

  return named[upper] ?? named[key];
}

function parseWindowsHotkey(value: string): ParsedHotkey | undefined {
  const rawParts = String(value).split("+");
  const usesPlusKey = rawParts.length > 1 && rawParts[rawParts.length - 1] === "";
  const parts = rawParts.map(part => part.trim()).filter(Boolean);
  if (usesPlusKey) parts.push("Plus");

  let modifiers = MOD_NOREPEAT;
  let key: string | undefined;

  for (const part of parts) {
    const normalized = part.toLowerCase().replace(/[\s_-]/g, "");
    if (["control", "ctrl", "commandorcontrol", "cmdorctrl", "commandorctrl"].includes(normalized)) {
      modifiers |= MOD_CONTROL;
      continue;
    }
    if (["shift"].includes(normalized)) {
      modifiers |= MOD_SHIFT;
      continue;
    }
    if (["alt", "option"].includes(normalized)) {
      modifiers |= MOD_ALT;
      continue;
    }
    if (["command", "cmd", "meta", "super", "win", "windows"].includes(normalized)) {
      modifiers |= MOD_WIN;
      continue;
    }
    if (key !== undefined) return undefined;
    key = part;
  }

  if (!key) return undefined;
  const vk = windowsVirtualKey(key);
  return typeof vk === "number" ? { modifiers, vk } : undefined;
}

function helperSource() {
  return String.raw`param(
  [Parameter(Mandatory=$true)][string]$ConfigPath,
  [Parameter(Mandatory=$true)][int]$ParentPid
)

$ErrorActionPreference = "Stop"

Add-Type -TypeDefinition @"
using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Threading;

public static class BetterStatusHotkeys {
    [StructLayout(LayoutKind.Sequential)]
    public struct POINT {
        public int X;
        public int Y;
    }

    [StructLayout(LayoutKind.Sequential)]
    public struct MSG {
        public IntPtr hwnd;
        public uint message;
        public UIntPtr wParam;
        public IntPtr lParam;
        public uint time;
        public POINT pt;
        public uint lPrivate;
    }

    [DllImport("user32.dll", SetLastError = true)]
    public static extern bool RegisterHotKey(IntPtr hWnd, int id, uint fsModifiers, uint vk);

    [DllImport("user32.dll", SetLastError = true)]
    public static extern bool UnregisterHotKey(IntPtr hWnd, int id);

    [DllImport("user32.dll")]
    public static extern int GetMessage(out MSG lpMsg, IntPtr hWnd, uint wMsgFilterMin, uint wMsgFilterMax);

    public static void WatchParent(int pid) {
        var thread = new Thread(() => {
            try {
                var process = Process.GetProcessById(pid);
                process.WaitForExit();
            } catch { }
            Environment.Exit(0);
        });
        thread.IsBackground = true;
        thread.Start();
    }
}
"@

[BetterStatusHotkeys]::WatchParent($ParentPid)
$items = @(Get-Content -Raw -LiteralPath $ConfigPath | ConvertFrom-Json)
$registered = New-Object System.Collections.Generic.List[int]

try {
    foreach ($item in $items) {
        $id = [int]$item.id
        $ok = [BetterStatusHotkeys]::RegisterHotKey(
            [IntPtr]::Zero,
            $id,
            [uint32]$item.modifiers,
            [uint32]$item.vk
        )

        if ($ok) {
            $registered.Add($id)
            [Console]::WriteLine("REGISTERED:" + $id)
        } else {
            $errorCode = [Runtime.InteropServices.Marshal]::GetLastWin32Error()
            [Console]::WriteLine("ERROR:" + $id + ":" + $errorCode)
        }
        [Console]::Out.Flush()
    }

    [Console]::WriteLine("READY")
    [Console]::Out.Flush()

    $message = New-Object BetterStatusHotkeys+MSG
    while ([BetterStatusHotkeys]::GetMessage([ref]$message, [IntPtr]::Zero, 0, 0) -gt 0) {
        if ($message.message -eq 0x0312) {
            [Console]::WriteLine("HOTKEY:" + $message.wParam.ToUInt32())
            [Console]::Out.Flush()
        }
    }
} finally {
    foreach ($id in $registered) {
        [void][BetterStatusHotkeys]::UnregisterHotKey([IntPtr]::Zero, $id)
    }
}
`;
}

function stopHelper() {
  if (helperProcess) {
    try { helperProcess.kill(); } catch {}
    helperProcess = undefined;
  }

  const req = G.require || G.window?.require;
  if (!req) return;
  try {
    const fs = req("fs");
    if (helperConfigPath) fs.rmSync(helperConfigPath, { force: true });
  } catch {}
  helperConfigPath = undefined;
}

async function startWindowsHelper(presets: HotkeyPreset[], runtime: any, api: any) {
  const req = G.require || G.window?.require;
  if (!req) throw new Error("BetterDiscord Node bridge is unavailable.");

  const fs = req("fs");
  const path = req("path");
  const childProcess = req("child_process");
  const processModule = req("process");

  const results: Record<string, boolean> = {};
  const idToPreset = new Map<number, string>();
  const registrations: Array<{ id: number; modifiers: number; vk: number; }> = [];

  let nextId = 0x5300;
  for (const preset of presets) {
    if (!preset.enabled || !preset.hotkey) continue;
    const parsed = parseWindowsHotkey(preset.hotkey);
    if (!parsed) {
      results[preset.id] = false;
      api.Logger.warn(`Unsupported Windows hotkey: ${preset.hotkey}`);
      continue;
    }

    const id = nextId++;
    results[preset.id] = false;
    idToPreset.set(id, preset.id);
    registrations.push({ id, ...parsed });
  }

  if (!registrations.length) return results;

  const runtimeDir = path.join(api.Plugins.folder, ".betterstatus-runtime");
  fs.mkdirSync(runtimeDir, { recursive: true });
  helperScriptPath = path.join(runtimeDir, "hotkeys.ps1");
  helperConfigPath = path.join(runtimeDir, `hotkeys-${processModule.pid}.json`);
  fs.writeFileSync(helperScriptPath, helperSource(), "utf8");
  fs.writeFileSync(helperConfigPath, JSON.stringify(registrations), "utf8");

  const systemRoot = processModule.env.SystemRoot || "C:\\Windows";
  const bundledPowerShell = path.join(systemRoot, "System32", "WindowsPowerShell", "v1.0", "powershell.exe");
  const powershell = fs.existsSync(bundledPowerShell) ? bundledPowerShell : "powershell.exe";

  const child = childProcess.spawn(powershell, [
    "-NoLogo",
    "-NoProfile",
    "-NonInteractive",
    "-ExecutionPolicy", "Bypass",
    "-File", helperScriptPath,
    "-ConfigPath", helperConfigPath,
    "-ParentPid", String(processModule.pid)
  ], {
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"]
  });

  helperProcess = child;

  return await new Promise<Record<string, boolean>>((resolve, reject) => {
    let settled = false;
    let stdoutBuffer = "";
    let stderrBuffer = "";

    const finish = (error?: Error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      if (error) reject(error);
      else resolve(results);
    };

    const processLine = (line: string) => {
      if (!line) return;
      if (line === "READY") {
        api.Logger.info(`Windows hotkey bridge ready with ${Object.values(results).filter(Boolean).length} registered shortcut(s).`);
        finish();
        return;
      }

      const registered = line.match(/^REGISTERED:(\d+)$/);
      if (registered) {
        const presetId = idToPreset.get(Number(registered[1]));
        if (presetId) results[presetId] = true;
        return;
      }

      const failed = line.match(/^ERROR:(\d+):(\d+)$/);
      if (failed) {
        const presetId = idToPreset.get(Number(failed[1]));
        if (presetId) results[presetId] = false;
        api.Logger.warn(`Windows rejected BetterStatus hotkey ${failed[1]} (Win32 error ${failed[2]}).`);
        return;
      }

      const fired = line.match(/^HOTKEY:(\d+)$/);
      if (fired) {
        const presetId = idToPreset.get(Number(fired[1]));
        if (!presetId) return;
        Promise.resolve(runtime?.triggerPreset?.(presetId)).catch((error: any) => {
          api.Logger.error(`Hotkey failed to activate preset ${presetId}`, error);
        });
      }
    };

    child.stdout?.on("data", (chunk: any) => {
      stdoutBuffer += String(chunk);
      const lines = stdoutBuffer.split(/\r?\n/);
      stdoutBuffer = lines.pop() || "";
      for (const line of lines) processLine(line.trim());
    });

    child.stderr?.on("data", (chunk: any) => {
      stderrBuffer += String(chunk);
    });

    child.once("error", (error: Error) => finish(error));
    child.once("exit", (code: number | null) => {
      if (!settled) {
        finish(new Error(stderrBuffer.trim() || `Windows hotkey helper exited with code ${code ?? "unknown"}.`));
      } else if (helperProcess === child) {
        helperProcess = undefined;
      }
    });

    const timeout = setTimeout(() => {
      finish(new Error(stderrBuffer.trim() || "Windows hotkey helper did not start in time."));
    }, 7000);
  });
}

export default function installWindowsHotkeys(Native: any, runtime: any, api: any) {
  if (!isWindows()) return;

  const nativeRegisterHotkeys = Native.registerHotkeys.bind(Native);
  const nativeUnregisterAll = Native.unregisterAll.bind(Native);

  Native.unregisterAll = () => {
    stopHelper();
    try { nativeUnregisterAll(); } catch {}
  };

  Native.registerHotkeys = async (presets: HotkeyPreset[]) => {
    stopHelper();
    try { nativeUnregisterAll(); } catch {}

    try {
      return await startWindowsHelper(presets, runtime, api);
    } catch (error) {
      api.Logger.error("Windows native hotkey bridge failed; falling back to DiscordNative.", error);
      stopHelper();
      return await nativeRegisterHotkeys(presets);
    }
  };
}
