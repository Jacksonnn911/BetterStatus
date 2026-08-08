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

const registeredShortcuts = new Map<string, string>();
const executeFile = promisify(execFile);

const REPOSITORY = "Jacksonnn911/BetterStatus";
const UPDATE_FILES = ["index.tsx", "Settings.tsx", "native.ts", "types.ts", "styles.css", "README.md"];
const VENCORD_SOURCE_DIR = join(__dirname, "..");
const PLUGIN_SOURCE_DIR = join(VENCORD_SOURCE_DIR, "src", "userplugins", "betterStatus");
const VERSION_FILE = join(PLUGIN_SOURCE_DIR, "VERSION");

interface UpdateResult {
    status: "disabled" | "current" | "updated" | "failed";
    version?: string;
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

async function performUpdate(): Promise<UpdateResult> {
    const release = JSON.parse(await fetchText(`https://api.github.com/repos/${REPOSITORY}/releases/latest`));
    const version = String(release.target_commitish ?? "");

    if (!/^[0-9a-f]{40}$/i.test(version))
        throw new Error("The latest BetterStatus release does not contain a valid commit version.");

    const installedVersion = await readFile(VERSION_FILE, "utf8").catch(() => "");
    if (installedVersion.trim() === version)
        return { status: "current", version };

    const stagingDir = join(PLUGIN_SOURCE_DIR, `.update-${Date.now()}`);
    const backupDir = join(stagingDir, "backup");
    await mkdir(backupDir, { recursive: true });

    try {
        for (const file of UPDATE_FILES) {
            const currentFile = join(PLUGIN_SOURCE_DIR, file);
            if (await exists(currentFile))
                await copyFile(currentFile, join(backupDir, file));

            const contents = await fetchText(`https://raw.githubusercontent.com/${REPOSITORY}/${version}/src/${file}`);
            await writeFile(join(stagingDir, file), contents, "utf8");
        }

        for (const file of UPDATE_FILES) {
            const destination = join(PLUGIN_SOURCE_DIR, file);
            await rm(destination, { force: true });
            await rename(join(stagingDir, file), destination);
        }

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

        await writeFile(VERSION_FILE, `${version}\n`, "utf8");
        return { status: "updated", version };
    } catch (error) {
        for (const file of UPDATE_FILES) {
            const backup = join(backupDir, file);
            if (await exists(backup))
                await copyFile(backup, join(PLUGIN_SOURCE_DIR, file));
        }

        return {
            status: "failed",
            error: error instanceof Error ? error.message : String(error)
        };
    } finally {
        await rm(stagingDir, { recursive: true, force: true });
    }
}

export function checkForUpdates(_event: IpcMainInvokeEvent, enabled: boolean) {
    if (!enabled)
        return Promise.resolve<UpdateResult>({ status: "disabled" });

    return updatePromise ??= performUpdate()
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
