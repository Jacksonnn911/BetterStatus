/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { execFile } from "child_process";
import { createHash } from "crypto";
import { globalShortcut, IpcMainInvokeEvent } from "electron";
import { access, copyFile, mkdir, readFile, rename, rm, writeFile } from "fs/promises";
import { homedir } from "os";
import { dirname, join } from "path";
import { promisify } from "util";

import type { UpdateChannel } from "./types";

const registeredShortcuts = new Map<string, string>();
const executeFile = promisify(execFile);

const REPOSITORY = "Jacksonnn911/BetterStatus";
const OBSOLETE_FILES = ["SavedStatusesProfile.tsx"];
const VENCORD_SOURCE_DIR = join(__dirname, "..");
const PLUGIN_SOURCE_DIR = join(VENCORD_SOURCE_DIR, "src", "userplugins", "betterStatus");
const VERSION_FILE = join(PLUGIN_SOURCE_DIR, "VERSION");
const MANIFEST_STATE_FILE = join(PLUGIN_SOURCE_DIR, ".files.json");

interface ManifestFile {
    source: string;
    target: string;
    sha256: string;
}

interface UpdateManifest {
    version: 1;
    channel: UpdateChannel;
    commit: string;
    files: ManifestFile[];
}

interface UpdateResult {
    status: "disabled" | "current" | "updated" | "failed";
    version?: string;
    channel?: UpdateChannel;
    error?: string;
}

export interface UpdateInfo {
    channel: UpdateChannel;
    installedChannel?: UpdateChannel;
    installedVersion?: string;
    latestVersion: string;
    status: "current" | "updateAvailable" | "restartRequired";
}

let updatePromise: Promise<UpdateResult> | undefined;
let pendingRestartVersion: string | undefined;

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
        cache: "no-store",
        headers: {
            Accept: "application/vnd.github+json",
            "User-Agent": "BetterStatus-AutoUpdater"
        }
    });

    if (!response.ok)
        throw new Error(`Download failed (${response.status} ${response.statusText})`);

    return response.text();
}

function manifestUrl(channel: UpdateChannel) {
    return `https://raw.githubusercontent.com/${REPOSITORY}/${channel}/files.json?checkedAt=${Date.now()}`;
}

async function fetchBytes(url: string) {
    const response = await fetch(url, {
        headers: { "User-Agent": "BetterStatus-AutoUpdater" }
    });

    if (!response.ok)
        throw new Error(`Download failed (${response.status} ${response.statusText})`);

    return Buffer.from(await response.arrayBuffer());
}

function sha256(contents: Uint8Array) {
    return createHash("sha256").update(contents).digest("hex");
}

function isSafeRelativePath(path: unknown): path is string {
    if (typeof path !== "string" || !path || path.startsWith("/") || path.includes("\\"))
        return false;

    return path.split("/").every(part => part !== "" && part !== "." && part !== "..");
}

function parseManifest(value: unknown, expectedChannel: UpdateChannel): UpdateManifest {
    if (!value || typeof value !== "object")
        throw new Error("The update manifest is not an object.");

    const candidate = value as Partial<UpdateManifest>;
    if (candidate.version !== 1 || candidate.channel !== expectedChannel)
        throw new Error(`The update manifest does not describe the ${expectedChannel} channel.`);
    if (typeof candidate.commit !== "string" || !/^[0-9a-f]{40}$/i.test(candidate.commit))
        throw new Error("The update manifest contains an invalid commit SHA.");
    if (!Array.isArray(candidate.files) || candidate.files.length === 0)
        throw new Error("The update manifest does not contain any files.");

    const seenTargets = new Set<string>();
    const files = candidate.files.map(value => {
        if (!value || typeof value !== "object")
            throw new Error("The update manifest contains an invalid file entry.");

        const file = value as Partial<ManifestFile>;
        if (!isSafeRelativePath(file.source) || !(file.source === "README.md" || file.source.startsWith("src/")))
            throw new Error("The update manifest contains an unsafe source path.");
        if (!isSafeRelativePath(file.target) || file.target === "VERSION" || file.target === ".files.json")
            throw new Error("The update manifest contains an unsafe target path.");
        if (typeof file.sha256 !== "string" || !/^[0-9a-f]{64}$/i.test(file.sha256))
            throw new Error(`The update manifest contains an invalid SHA-256 for ${file.target}.`);
        if (seenTargets.has(file.target))
            throw new Error(`The update manifest contains the duplicate target ${file.target}.`);

        seenTargets.add(file.target);
        return {
            source: file.source,
            target: file.target,
            sha256: file.sha256.toLowerCase()
        };
    });

    return {
        version: 1,
        channel: expectedChannel,
        commit: candidate.commit.toLowerCase(),
        files
    };
}

function pluginPath(relativePath: string) {
    return join(PLUGIN_SOURCE_DIR, ...relativePath.split("/"));
}

function parseInstalledVersion(marker: string) {
    const value = marker.trim();
    const channelVersion = /^(prod|dev):([0-9a-f]{40})$/i.exec(value);

    if (channelVersion) {
        return {
            channel: channelVersion[1].toLowerCase() as UpdateChannel,
            version: channelVersion[2].toLowerCase()
        };
    }

    if (/^[0-9a-f]{40}$/i.test(value))
        return { channel: "prod" as const, version: value.toLowerCase() };

    return {};
}

export async function getUpdateInfo(
    _event: IpcMainInvokeEvent,
    requestedChannel: UpdateChannel = "prod"
): Promise<UpdateInfo> {
    const channel: UpdateChannel = requestedChannel === "dev" ? "dev" : "prod";
    const manifest = parseManifest(
        JSON.parse(await fetchText(manifestUrl(channel))),
        channel
    );
    const installed = parseInstalledVersion(await readFile(VERSION_FILE, "utf8").catch(() => ""));
    const status = pendingRestartVersion === `${channel}:${manifest.commit}`
        ? "restartRequired"
        : installed.channel === channel && installed.version === manifest.commit
            ? "current"
            : "updateAvailable";

    return {
        channel,
        installedChannel: installed.channel,
        installedVersion: installed.version,
        latestVersion: manifest.commit,
        status
    };
}

async function readPreviousTargets() {
    try {
        const value = JSON.parse(await readFile(MANIFEST_STATE_FILE, "utf8"));
        if (!Array.isArray(value?.files))
            return [];

        return value.files
            .map((file: Partial<ManifestFile>) => file?.target)
            .filter(isSafeRelativePath);
    } catch {
        return [];
    }
}

async function copyWithParents(source: string, destination: string) {
    await mkdir(dirname(destination), { recursive: true });
    await copyFile(source, destination);
}

async function performUpdate(channel: UpdateChannel): Promise<UpdateResult> {
    const manifest = parseManifest(
        JSON.parse(await fetchText(manifestUrl(channel))),
        channel
    );
    const remoteTargets = new Set(manifest.files.map(file => file.target));
    const previousTargets = await readPreviousTargets();
    const obsoleteTargets = [...new Set([
        ...OBSOLETE_FILES,
        ...previousTargets.filter(target => !remoteTargets.has(target))
    ])].filter(target => !remoteTargets.has(target));
    const changedFiles: ManifestFile[] = [];

    for (const file of manifest.files) {
        const contents = await readFile(pluginPath(file.target)).catch(() => undefined);
        if (!contents || sha256(contents) !== file.sha256)
            changedFiles.push(file);
    }

    const obsoleteFiles = [];
    for (const target of obsoleteTargets) {
        if (await exists(pluginPath(target)))
            obsoleteFiles.push(target);
    }

    if (changedFiles.length === 0 && obsoleteFiles.length === 0) {
        await writeFile(MANIFEST_STATE_FILE, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
        await writeFile(VERSION_FILE, `${channel}:${manifest.commit}\n`, "utf8");
        return { status: "current", version: manifest.commit, channel };
    }

    const stagingDir = join(VENCORD_SOURCE_DIR, `.better-status-update-${Date.now()}`);
    const backupDir = join(stagingDir, "backup");
    const originalFiles = new Set<string>();
    await mkdir(backupDir, { recursive: true });

    try {
        for (const file of changedFiles) {
            const currentFile = pluginPath(file.target);
            if (await exists(currentFile)) {
                originalFiles.add(file.target);
                await copyWithParents(currentFile, join(backupDir, file.target));
            }

            const contents = await fetchBytes(`https://raw.githubusercontent.com/${REPOSITORY}/${manifest.commit}/${file.source}`);
            if (sha256(contents) !== file.sha256)
                throw new Error(`SHA-256 verification failed for ${file.target}.`);

            const stagedFile = join(stagingDir, "files", file.target);
            await mkdir(dirname(stagedFile), { recursive: true });
            await writeFile(stagedFile, contents);
        }

        for (const target of obsoleteFiles) {
            const currentFile = pluginPath(target);
            originalFiles.add(target);
            await copyWithParents(currentFile, join(backupDir, target));
        }

        for (const file of changedFiles) {
            const destination = pluginPath(file.target);
            await mkdir(dirname(destination), { recursive: true });
            await rm(destination, { force: true });
            await rename(join(stagingDir, "files", file.target), destination);
        }
        for (const target of obsoleteFiles)
            await rm(pluginPath(target), { force: true });

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

        await writeFile(MANIFEST_STATE_FILE, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
        await writeFile(VERSION_FILE, `${channel}:${manifest.commit}\n`, "utf8");
        pendingRestartVersion = `${channel}:${manifest.commit}`;
        return { status: "updated", version: manifest.commit, channel };
    } catch (error) {
        for (const target of [...changedFiles.map(file => file.target), ...obsoleteFiles]) {
            const backup = join(backupDir, target);
            if (await exists(backup))
                await copyWithParents(backup, pluginPath(target));
            else if (!originalFiles.has(target))
                await rm(pluginPath(target), { force: true });
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
    requestedChannel: UpdateChannel = "prod"
) {
    if (!enabled)
        return Promise.resolve<UpdateResult>({ status: "disabled" });

    const channel: UpdateChannel = requestedChannel === "dev" ? "dev" : "prod";

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
