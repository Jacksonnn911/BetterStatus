/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { execFile } from "child_process";
import { createCipheriv, createDecipheriv, createHash, randomBytes, scrypt as deriveScrypt } from "crypto";
import { app, globalShortcut, IpcMainInvokeEvent, safeStorage, shell } from "electron";
import { access, copyFile, mkdir, readFile, rename, rm, writeFile } from "fs/promises";
import { homedir } from "os";
import { dirname, join } from "path";
import { promisify } from "util";

import type { EncryptedSyncDocument, SyncDocument, UpdateChannel } from "./types";

const registeredShortcuts = new Map<string, string>();
const executeFile = promisify(execFile);

const REPOSITORY = "Jacksonnn911/BetterStatus";
const OBSOLETE_FILES = ["SavedStatusesProfile.tsx"];
const VENCORD_SOURCE_DIR = join(__dirname, "..");
const PLUGIN_SOURCE_DIR = join(VENCORD_SOURCE_DIR, "src", "userplugins", "betterStatus");
const VERSION_FILE = join(PLUGIN_SOURCE_DIR, "VERSION");
const MANIFEST_STATE_FILE = join(PLUGIN_SOURCE_DIR, ".files.json");
const SYNC_SESSION_FILE = join(app.getPath("userData"), "betterstatus-sync-sessions.bin");

interface CloudSession {
    token: string;
    expiresAt: string;
    discordUserId: string;
    encryptionPassword?: string;
}

interface SyncSnapshot {
    revision: number;
    document: unknown;
    updated_at: string;
}

const syncSockets = new Map<string, WebSocket>();
const SYNC_ENCRYPTION_AAD = Buffer.from("BetterStatus encrypted sync document v1", "utf8");

function isEncryptedSyncDocument(value: unknown): value is EncryptedSyncDocument {
    if (!value || typeof value !== "object") return false;
    const envelope = value as Partial<EncryptedSyncDocument>;
    return envelope.format === "betterstatus-encrypted-sync" && envelope.version === 1 &&
        envelope.kdf === "scrypt" && envelope.cipher === "aes-256-gcm" &&
        [envelope.salt, envelope.iv, envelope.authTag, envelope.ciphertext].every(field => typeof field === "string");
}

async function encryptionKey(password: string, salt: Buffer) {
    return await new Promise<Buffer>((resolve, reject) => {
        deriveScrypt(password.normalize("NFKC"), salt, 32, {
            N: 32_768,
            r: 8,
            p: 1,
            maxmem: 64 * 1024 * 1024
        }, (error, key) => error ? reject(error) : resolve(key));
    });
}

async function encryptSyncDocument(document: SyncDocument, password: string): Promise<EncryptedSyncDocument> {
    const salt = randomBytes(16);
    const iv = randomBytes(12);
    const key = await encryptionKey(password, salt);
    const cipher = createCipheriv("aes-256-gcm", key, iv);
    cipher.setAAD(SYNC_ENCRYPTION_AAD);
    const ciphertext = Buffer.concat([cipher.update(JSON.stringify(document), "utf8"), cipher.final()]);
    return {
        format: "betterstatus-encrypted-sync",
        version: 1,
        kdf: "scrypt",
        cipher: "aes-256-gcm",
        salt: salt.toString("base64url"),
        iv: iv.toString("base64url"),
        authTag: cipher.getAuthTag().toString("base64url"),
        ciphertext: ciphertext.toString("base64url")
    };
}

async function decryptSyncDocument(envelope: EncryptedSyncDocument, password: string): Promise<SyncDocument> {
    try {
        const salt = Buffer.from(envelope.salt, "base64url");
        const iv = Buffer.from(envelope.iv, "base64url");
        const tag = Buffer.from(envelope.authTag, "base64url");
        const ciphertext = Buffer.from(envelope.ciphertext, "base64url");
        if (salt.length !== 16 || iv.length !== 12 || tag.length !== 16 || ciphertext.length > 2 * 1024 * 1024)
            throw new Error("Invalid encrypted sync document.");
        const key = await encryptionKey(password, salt);
        const decipher = createDecipheriv("aes-256-gcm", key, iv);
        decipher.setAAD(SYNC_ENCRYPTION_AAD);
        decipher.setAuthTag(tag);
        const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
        const document = JSON.parse(plaintext.toString("utf8")) as SyncDocument;
        if (document?.version !== 1) throw new Error("Unsupported decrypted sync document.");
        return document;
    } catch {
        throw new Error("The sync password is incorrect or the encrypted data is damaged.");
    }
}

function normalizeServerURL(value: string) {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" && !(url.protocol === "http:" && ["localhost", "127.0.0.1", "::1"].includes(url.hostname)))
        throw new Error("Sync servers must use HTTPS (HTTP is allowed only for localhost). ");
    return url.origin;
}

async function readCloudSessions(): Promise<Record<string, CloudSession>> {
    try {
        const encrypted = await readFile(SYNC_SESSION_FILE);
        if (!safeStorage.isEncryptionAvailable()) throw new Error("Secure credential storage is unavailable.");
        return JSON.parse(safeStorage.decryptString(encrypted));
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") return {};
        throw error;
    }
}

async function writeCloudSessions(sessions: Record<string, CloudSession>) {
    if (!safeStorage.isEncryptionAvailable()) throw new Error("Secure credential storage is unavailable.");
    await mkdir(dirname(SYNC_SESSION_FILE), { recursive: true });
    await writeFile(SYNC_SESSION_FILE, safeStorage.encryptString(JSON.stringify(sessions)), { mode: 0o600 });
}

async function cloudSession(serverURL: string) {
    const server = normalizeServerURL(serverURL);
    const sessions = await readCloudSessions();
    const session = sessions[server];
    if (!session || new Date(session.expiresAt).getTime() <= Date.now()) return undefined;
    return { server, session };
}

async function cloudRequest(server: string, path: string, token: string, init?: RequestInit) {
    const response = await fetch(`${server}${path}`, {
        ...init,
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            ...init?.headers
        }
    });
    if (!response.ok) {
        const body = await response.json().catch(() => ({})) as { error?: string; current?: SyncSnapshot; };
        const error = new Error(body.error ?? `Sync server returned HTTP ${response.status}`) as Error & { status?: number; current?: SyncSnapshot; };
        error.status = response.status;
        error.current = body.current;
        throw error;
    }
    return response;
}

function deliverCloudSnapshot(event: IpcMainInvokeEvent, snapshot: SyncSnapshot) {
    const encoded = JSON.stringify(snapshot);
    event.sender.executeJavaScript(`Vencord.Plugins.plugins.BetterStatus.receiveCloudSnapshot(${encoded})`).catch(console.error);
}

function connectCloudSocket(event: IpcMainInvokeEvent, server: string, session: CloudSession) {
    syncSockets.get(server)?.close();
    const url = new URL(server);
    url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
    url.pathname = "/v1/sync/ws";
    const socket = new WebSocket(url);
    syncSockets.set(server, socket);
    socket.addEventListener("open", () => socket.send(JSON.stringify({ type: "auth", token: session.token })));
    socket.addEventListener("message", message => {
        try {
            const payload = JSON.parse(String(message.data));
            if (payload.type === "sync" && payload.snapshot) deliverCloudSnapshot(event, payload.snapshot);
        } catch (error) {
            console.error("[BetterStatus] Invalid sync WebSocket message", error);
        }
    });
    socket.addEventListener("close", () => {
        if (syncSockets.get(server) !== socket) return;
        syncSockets.delete(server);
        setTimeout(async () => {
            if (event.sender.isDestroyed() || syncSockets.has(server)) return;
            const resolved = await cloudSession(server).catch(() => undefined);
            if (resolved) connectCloudSocket(event, server, resolved.session);
        }, 5_000);
    });
}

interface ManifestFile {
    source: string;
    target: string;
    sha256: string;
}

interface UpdateManifest {
    version: 1;
    commit: string;
    files: ManifestFile[];
}

interface GitHubBranchReference {
    object?: {
        sha?: unknown;
    };
}

interface UpdateResult {
    status: "disabled" | "current" | "updated" | "failed";
    version?: string;
    channel?: UpdateChannel;
    error?: string;
    retryAt?: number;
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
let githubRetryAt = 0;

class GitHubRateLimitError extends Error {
    constructor(public readonly retryAt: number) {
        const remaining = formatRetryDuration(retryAt - Date.now());
        const deadline = new Date(retryAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

        super(`GitHub returned HTTP 403. Update checks are unavailable for ${remaining}, until ${deadline}.`);
        this.name = "GitHubRateLimitError";
    }
}

function formatRetryDuration(milliseconds: number) {
    const seconds = Math.max(1, Math.ceil(milliseconds / 1000));
    if (seconds < 60)
        return `${seconds} ${seconds === 1 ? "second" : "seconds"}`;

    const minutes = Math.ceil(seconds / 60);
    if (minutes < 60)
        return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes === 0
        ? `${hours} ${hours === 1 ? "hour" : "hours"}`
        : `${hours} ${hours === 1 ? "hour" : "hours"} ${remainingMinutes} minutes`;
}

function rateLimitDeadline(response: Response) {
    const retryAfter = Number(response.headers.get("retry-after"));
    if (Number.isFinite(retryAfter) && retryAfter > 0)
        return Date.now() + retryAfter * 1000;

    const rateLimitReset = Number(response.headers.get("x-ratelimit-reset"));
    if (Number.isFinite(rateLimitReset) && rateLimitReset > 0)
        return Math.max(Date.now() + 1000, rateLimitReset * 1000);

    return Date.now() + 15 * 60_000;
}

function throwIfGitHubRateLimited() {
    if (githubRetryAt > Date.now())
        throw new GitHubRateLimitError(githubRetryAt);
}

function handleFetchFailure(response: Response): never {
    if (response.status === 403) {
        githubRetryAt = rateLimitDeadline(response);
        throw new GitHubRateLimitError(githubRetryAt);
    }

    throw new Error(`Download failed (${response.status} ${response.statusText})`);
}

function updateFailure(error: unknown): UpdateResult {
    return {
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
        ...(error instanceof GitHubRateLimitError ? { retryAt: error.retryAt } : {})
    };
}

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
    throwIfGitHubRateLimited();
    const response = await fetch(url, {
        cache: "no-store",
        headers: {
            Accept: "application/vnd.github+json",
            "User-Agent": "BetterStatus-AutoUpdater"
        }
    });

    if (!response.ok)
        handleFetchFailure(response);

    return response.text();
}

async function fetchManifest(channel: UpdateChannel) {
    const reference = JSON.parse(await fetchText(
        `https://api.github.com/repos/${REPOSITORY}/git/ref/heads/${channel}`
    )) as GitHubBranchReference;
    const head = reference.object?.sha;

    if (typeof head !== "string" || !/^[0-9a-f]{40}$/i.test(head))
        throw new Error(`GitHub returned an invalid ${channel} branch reference.`);

    return parseManifest(
        JSON.parse(await fetchText(
            `https://raw.githubusercontent.com/${REPOSITORY}/${head}/files.json`
        ))
    );
}

async function fetchBytes(url: string) {
    throwIfGitHubRateLimited();
    const response = await fetch(url, {
        headers: { "User-Agent": "BetterStatus-AutoUpdater" }
    });

    if (!response.ok)
        handleFetchFailure(response);

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

function parseManifest(value: unknown): UpdateManifest {
    if (!value || typeof value !== "object")
        throw new Error("The update manifest is not an object.");

    const candidate = value as Partial<UpdateManifest>;
    if (candidate.version !== 1)
        throw new Error("The update manifest uses an unsupported version.");
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
    const manifest = await fetchManifest(channel);
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
    const manifest = await fetchManifest(channel);
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

    const obsoleteFiles: string[] = [];
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

        return updateFailure(error);
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
        .catch(updateFailure)
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

export async function getCloudSyncStatus(_event: IpcMainInvokeEvent, serverURL: string) {
    const resolved = await cloudSession(serverURL);
    return resolved
        ? {
            connected: true,
            discordUserId: resolved.session.discordUserId,
            expiresAt: resolved.session.expiresAt,
            encryptionPasswordSet: Boolean(resolved.session.encryptionPassword)
        }
        : { connected: false };
}

export async function authorizeCloudSync(event: IpcMainInvokeEvent, serverURL: string) {
    const server = normalizeServerURL(serverURL);
    const verifier = randomBytes(32).toString("base64url");
    const challenge = createHash("sha256").update(verifier).digest("base64url");
    const requestResponse = await fetch(`${server}/v1/auth/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challenge })
    });
    if (!requestResponse.ok) throw new Error(`Could not start Discord authorization (HTTP ${requestResponse.status}).`);
    const request = await requestResponse.json() as { request_id: string; authorize_url: string; expires_at: string; };
    await shell.openExternal(request.authorize_url);

    const deadline = Math.min(new Date(request.expires_at).getTime(), Date.now() + 10 * 60_000);
    while (Date.now() < deadline) {
        await new Promise(resolve => setTimeout(resolve, 2_000));
        const response = await fetch(`${server}/v1/auth/requests/${encodeURIComponent(request.request_id)}/exchange`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ verifier })
        });
        if (response.status === 409) continue;
        if (!response.ok) throw new Error(`Discord authorization failed (HTTP ${response.status}).`);

        const result = await response.json() as { token: string; expires_at: string; discord_user_id: string; };
        const sessions = await readCloudSessions();
        sessions[server] = { token: result.token, expiresAt: result.expires_at, discordUserId: result.discord_user_id };
        await writeCloudSessions(sessions);
        connectCloudSocket(event, server, sessions[server]);
        return { connected: true, discordUserId: result.discord_user_id, expiresAt: result.expires_at };
    }
    throw new Error("Discord authorization expired. Please try again.");
}

export async function startCloudSync(event: IpcMainInvokeEvent, serverURL: string) {
    const resolved = await cloudSession(serverURL);
    if (!resolved) return { connected: false };
    const response = await cloudRequest(resolved.server, "/v1/sync", resolved.session.token);
    const snapshot = await response.json() as SyncSnapshot;
    connectCloudSocket(event, resolved.server, resolved.session);
    return {
        connected: true,
        discordUserId: resolved.session.discordUserId,
        expiresAt: resolved.session.expiresAt,
        snapshot
    };
}

export async function decodeCloudSyncSnapshot(
    _event: IpcMainInvokeEvent,
    serverURL: string,
    snapshot: SyncSnapshot
) {
    if (!isEncryptedSyncDocument(snapshot.document))
        return { snapshot, encrypted: false, locked: false };

    const resolved = await cloudSession(serverURL);
    const password = resolved?.session.encryptionPassword;
    if (!password)
        return { snapshot, encrypted: true, locked: true };

    try {
        return {
            snapshot: { ...snapshot, document: await decryptSyncDocument(snapshot.document, password) },
            encrypted: true,
            locked: false
        };
    } catch {
        return { snapshot, encrypted: true, locked: true };
    }
}

export async function unlockCloudSync(
    _event: IpcMainInvokeEvent,
    serverURL: string,
    password: string
) {
    const resolved = await cloudSession(serverURL);
    if (!resolved) throw new Error("Connect Discord before unlocking cloud sync.");
    const response = await cloudRequest(resolved.server, "/v1/sync", resolved.session.token);
    const snapshot = await response.json() as SyncSnapshot;
    if (!isEncryptedSyncDocument(snapshot.document))
        throw new Error("This sync account is not password protected.");
    const document = await decryptSyncDocument(snapshot.document, password);
    const sessions = await readCloudSessions();
    sessions[resolved.server] = { ...resolved.session, encryptionPassword: password };
    await writeCloudSessions(sessions);
    return { snapshot: { ...snapshot, document }, encrypted: true, locked: false };
}

export async function setCloudEncryptionPassword(
    _event: IpcMainInvokeEvent,
    serverURL: string,
    password: string
) {
    if (password.length < 12)
        throw new Error("Use at least 12 characters for the sync password.");
    const resolved = await cloudSession(serverURL);
    if (!resolved) throw new Error("Connect Discord before protecting cloud sync.");
    const sessions = await readCloudSessions();
    sessions[resolved.server] = { ...resolved.session, encryptionPassword: password };
    await writeCloudSessions(sessions);
    return { encryptionPasswordSet: true };
}

export async function clearCloudEncryptionPassword(_event: IpcMainInvokeEvent, serverURL: string) {
    const resolved = await cloudSession(serverURL);
    if (!resolved) throw new Error("Connect Discord before changing cloud protection.");
    const sessions = await readCloudSessions();
    sessions[resolved.server] = { ...resolved.session };
    delete sessions[resolved.server].encryptionPassword;
    await writeCloudSessions(sessions);
    return { encryptionPasswordSet: false };
}

export async function pushCloudSync(
    _event: IpcMainInvokeEvent,
    serverURL: string,
    baseRevision: number,
    document: SyncDocument
) {
    const resolved = await cloudSession(serverURL);
    if (!resolved) throw new Error("Connect Discord before enabling cloud sync.");
    const outgoingDocument = resolved.session.encryptionPassword
        ? await encryptSyncDocument(document, resolved.session.encryptionPassword)
        : document;
    try {
        const response = await cloudRequest(resolved.server, "/v1/sync", resolved.session.token, {
            method: "PUT",
            body: JSON.stringify({ base_revision: baseRevision, document: outgoingDocument })
        });
        return await response.json() as SyncSnapshot;
    } catch (error) {
        const conflict = error as Error & { status?: number; current?: SyncSnapshot; };
        if (conflict.status === 409 && conflict.current) return conflict.current;
        throw error;
    }
}

export async function disconnectCloudSync(_event: IpcMainInvokeEvent, serverURL: string) {
    const server = normalizeServerURL(serverURL);
    const sessions = await readCloudSessions();
    const session = sessions[server];
    syncSockets.get(server)?.close();
    syncSockets.delete(server);
    if (session) {
        await cloudRequest(server, "/v1/session", session.token, { method: "DELETE" }).catch(() => undefined);
        delete sessions[server];
        await writeCloudSessions(sessions);
    }
    return { connected: false };
}
