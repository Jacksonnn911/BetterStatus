/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { execFile } from "child_process";
import { globalShortcut, IpcMainInvokeEvent } from "electron";
import { access, copyFile, mkdir, readFile, rename, rm, writeFile } from "fs/promises";
import { homedir } from "os";
import { join } from "path";
import { promisify } from "util";

import type { UpdateChannel } from "./types";

const registeredShortcuts = new Map<string, string>();
const executeFile = promisify(execFile);

const REPOSITORY = "Jacksonnn911/BetterStatus";
const UPDATE_FILES = [
    { localName: "index.tsx", remotePath: "src/index.tsx" },
    { localName: "Settings.tsx", remotePath: "src/Settings.tsx" },
    { localName: "StatusSwitcher.tsx", remotePath: "src/StatusSwitcher.tsx" },
    { localName: "savedStatuses.ts", remotePath: "src/savedStatuses.ts" },
    { localName: "native.ts", remotePath: "src/native.ts" },
    { localName: "types.ts", remotePath: "src/types.ts" },
    { localName: "styles.css", remotePath: "src/styles.css" },
    { localName: "README.md", remotePath: "README.md" }
];
const OBSOLETE_FILES = ["SavedStatusesProfile.tsx"];
const VENCORD_SOURCE_DIR = join(__dirname, "..");
const PLUGIN_SOURCE_DIR = join(VENCORD_SOURCE_DIR, "src", "userplugins", "betterStatus");
const VERSION_FILE = join(PLUGIN_SOURCE_DIR, "VERSION");

interface UpdateResult {
    status: "disabled" | "current" | "updated" | "failed";
    version?: string;
    channel?: UpdateChannel;
    error?: string;
}

let updatePromise: Promise<UpdateResult> | undefined;

async function exists(path: string) {
    try {
        await access(path);
        return true;
    } catch {
        return false;
    }
}

async function findNode() {
    const candidates = [
        "node",
        join(homedir(), ".local", "share", "status-hotkeys", "runtime", "node", "bin", "node"),
        process.platform === "win32"
            ? join(process.env.LOCALAPPDATA ?? "", "StatusHotkeys", "runtime", "node", "node.exe")
            : ""
    ].filter(Boolean);

    for (const candidate of candidates) {
        try {
            await executeFile(candidate, ["--version"]);
            return candidate;
        } catch {}
    }

    throw new Error("Node.js was not found. Run the BetterStatus installer once to repair the build tools.");
}

async function fetchText(url: string) {
    const response = await fetch(url, {
        headers: {
            Accept: "application/vnd.github+json",
            "User-Agent": "BetterStatus-AutoUpdater"
        }
    });

    if (!response.ok)
        throw new Error(`Download failed (${response.status} ${response.statusText})`);

    return response.text();
}

async function performUpdate(channel: UpdateChannel): Promise<UpdateResult> {
    const branch = JSON.parse(await fetchText(`https://api.github.com/repos/${REPOSITORY}/commits/${channel}`));
    const version = String(branch.sha ?? "");

    if (!/^[0-9a-f]{40}$/i.test(version))
        throw new Error(`The BetterStatus ${channel} branch did not return a valid commit version.`);

    const installedVersion = await readFile(VERSION_FILE, "utf8").catch(() => "");
    if ([version, `${channel}:${version}`].includes(installedVersion.trim()))
        return { status: "current", version, channel };

    const stagingDir = join(PLUGIN_SOURCE_DIR, `.update-${Date.now()}`);
    const backupDir = join(stagingDir, "backup");
    const originalFiles = new Set<string>();
    await mkdir(backupDir, { recursive: true });

    try {
        for (const { localName, remotePath } of UPDATE_FILES) {
            const currentFile = join(PLUGIN_SOURCE_DIR, localName);
            if (await exists(currentFile)) {
                originalFiles.add(localName);
                await copyFile(currentFile, join(backupDir, localName));
            }

            const contents = await fetchText(`https://raw.githubusercontent.com/${REPOSITORY}/${version}/${remotePath}`);
            await writeFile(join(stagingDir, localName), contents, "utf8");
        }

        for (const localName of OBSOLETE_FILES) {
            const currentFile = join(PLUGIN_SOURCE_DIR, localName);
            if (await exists(currentFile)) {
                originalFiles.add(localName);
                await copyFile(currentFile, join(backupDir, localName));
            }
        }

        for (const { localName } of UPDATE_FILES) {
            const destination = join(PLUGIN_SOURCE_DIR, localName);
            await rm(destination, { force: true });
            await rename(join(stagingDir, localName), destination);
        }
        for (const localName of OBSOLETE_FILES)
            await rm(join(PLUGIN_SOURCE_DIR, localName), { force: true });

        const node = await findNode();
        const environment = { ...process.env };
        if (!await exists(join(VENCORD_SOURCE_DIR, ".git"))) {
            environment.VENCORD_HASH = "archive";
            environment.VENCORD_REMOTE = "Vendicated/Vencord";
        }

        await executeFile(node, ["scripts/build/build.mjs"], {
            cwd: VENCORD_SOURCE_DIR,
            env: environment,
            timeout: 10 * 60 * 1000
        });

        await writeFile(VERSION_FILE, `${channel}:${version}\n`, "utf8");
        return { status: "updated", version, channel };
    } catch (error) {
        for (const localName of [...UPDATE_FILES.map(file => file.localName), ...OBSOLETE_FILES]) {
            const backup = join(backupDir, localName);
            if (await exists(backup))
                await copyFile(backup, join(PLUGIN_SOURCE_DIR, localName));
            else if (!originalFiles.has(localName))
                await rm(join(PLUGIN_SOURCE_DIR, localName), { force: true });
        }

        return {
            status: "failed",
            error: error instanceof Error ? error.message : String(error)
        };
    } finally {
        await rm(stagingDir, { recursive: true, force: true });
    }
}

export function checkForUpdates(
    _event: IpcMainInvokeEvent,
    enabled: boolean,
    requestedChannel: UpdateChannel = "production"
) {
    if (!enabled)
        return Promise.resolve<UpdateResult>({ status: "disabled" });

    const channel: UpdateChannel = requestedChannel === "dev" ? "dev" : "production";

    return updatePromise ??= performUpdate(channel)
        .catch(error => ({
            status: "failed" as const,
            error: error instanceof Error ? error.message : String(error)
        }))
        .finally(() => {
            updatePromise = undefined;
        });
}

function triggerPreset(event: IpcMainInvokeEvent, presetId: string) {
    const encodedId = JSON.stringify(presetId);

    event.sender.executeJavaScript(
        `Vencord.Plugins.plugins.BetterStatus.triggerPreset(${encodedId})`
    ).catch(console.error);
}

export function unregisterAll() {
    for (const accelerator of registeredShortcuts.keys()) {
        try {
            globalShortcut.unregister(accelerator);
        } catch {}
    }

    registeredShortcuts.clear();
}

export function registerHotkeys(
    event: IpcMainInvokeEvent,
    presets: Array<{
        id: string;
        hotkey: string;
        enabled: boolean;
    }>
) {
    unregisterAll();

    const results: Record<string, boolean> = {};

    for (const preset of presets) {
        if (!preset.enabled || !preset.hotkey) {
            continue;
        }

        try {
            const success = globalShortcut.register(
                preset.hotkey,
                () => triggerPreset(event, preset.id)
            );

            results[preset.id] = success;

            if (success) {
                registeredShortcuts.set(preset.hotkey, preset.id);
            }
        } catch (error) {
            console.error(
                `[BetterStatus] Failed to register ${preset.hotkey}`,
                error
            );

            results[preset.id] = false;
        }
    }

    return results;
}
