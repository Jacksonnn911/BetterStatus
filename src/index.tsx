/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { showNotification } from "@api/Notifications";
import { getUserSettingLazy } from "@api/UserSettings";
import { Link } from "@components/Link";
import { relaunch } from "@utils/native";
import definePlugin from "@utils/types";

import { applySyncDocument, buildSyncDocument, getPresets, getSchedules, getSyncServerURL, getUpdateChannel, getUpdateCheckFrequency, initializeAutoRestartGuard, prepareAutoRestart, rememberSavedStatus, requestSyncPassword, savePresets, settings, showUpdateFailureNotification } from "./Settings";
import { startStatusHistoryModalObserver, stopStatusHistoryModalObserver } from "./StatusHistory";
import type { StatusPreset, StatusSchedule, SyncDocument } from "./types";

interface CustomStatus {
    text?: string;
    emojiId?: string;
    emojiName?: string;
    expiresAtMs?: string;
    createdAtMs?: string;
}

const StatusSettings =
    getUserSettingLazy<string>("status", "status")!;

const CustomStatusSettings =
    getUserSettingLazy<CustomStatus>("status", "customStatus")!;

let updateCheckTimer: number | undefined;
let automaticUpdateCheck: Promise<void> | undefined;
let updateSchedulerActive = false;
let statusScheduleTimer: number | undefined;
let statusScheduleActive = false;
let cloudSyncTimer: number | undefined;
let cloudSyncRevision = 0;
let cloudSyncBaseDocument: SyncDocument | undefined;
let cloudSyncUserId = "";
let cloudSyncOperation = Promise.resolve();
let cloudSyncGeneration = 0;
let cloudSyncForcePush = false;
let applyingCloudSnapshot = false;
let cloudSyncLocked = false;
const SCHEDULE_GRACE_MS = 5 * 60_000;

function occurrenceAtOrAfter(startsAt: number, repeat: "once" | "daily" | "weekly", threshold: number) {
    if (repeat === "once") return startsAt >= threshold ? startsAt : undefined;

    const candidate = new Date(startsAt);
    const days = repeat === "daily" ? 1 : 7;
    while (candidate.getTime() < threshold)
        candidate.setDate(candidate.getDate() + days);
    return candidate.getTime();
}

function clearStatusSchedule() {
    if (statusScheduleTimer !== undefined) window.clearTimeout(statusScheduleTimer);
    statusScheduleTimer = undefined;
}

function configureStatusSchedule() {
    clearStatusSchedule();
    if (!statusScheduleActive) return;

    const now = Date.now();
    const lastRuns = settings.store.scheduleRuns ?? {};
    const endRuns = settings.store.scheduleEndRuns ?? {};
    const schedules = getSchedules();
    const candidates: Array<{
        schedule: StatusSchedule;
        occurrence: number;
        type: "start" | "end";
        startOccurrence: number;
    }> = [];
    const missedOneTimeSchedules = new Set<string>();

    for (const schedule of schedules.filter(item => item.enabled && getPresets().some(preset => preset.id === item.presetId && preset.enabled))) {
        const lastRun = lastRuns[schedule.id] ?? 0;
        if (schedule.repeat === "once" && lastRun > 0 && !schedule.endsAt) {
            missedOneTimeSchedules.add(schedule.id);
            continue;
        }
        if (schedule.endsAt && lastRun > 0 && (endRuns[schedule.id] ?? 0) < lastRun) {
            const endOccurrence = lastRun + (schedule.endsAt - schedule.startsAt);
            if (endOccurrence >= now - SCHEDULE_GRACE_MS)
                candidates.push({ schedule, occurrence: endOccurrence, type: "end", startOccurrence: lastRun });
            else {
                settings.store.scheduleEndRuns = { ...(settings.store.scheduleEndRuns ?? {}), [schedule.id]: lastRun };
                const previousStates = { ...(settings.store.schedulePreviousStates ?? {}) };
                delete previousStates[schedule.id];
                settings.store.schedulePreviousStates = previousStates;
                if (schedule.repeat === "once") missedOneTimeSchedules.add(schedule.id);
            }
        }

        if (schedule.repeat === "once" && lastRun === 0 && schedule.startsAt < now - SCHEDULE_GRACE_MS) {
            missedOneTimeSchedules.add(schedule.id);
            continue;
        }

        const occurrence = occurrenceAtOrAfter(schedule.startsAt, schedule.repeat, Math.max(lastRun + 1, now - SCHEDULE_GRACE_MS));
        if (occurrence !== undefined)
            candidates.push({ schedule, occurrence, type: "start", startOccurrence: occurrence });
    }

    if (missedOneTimeSchedules.size)
        settings.store.schedules = schedules.map(schedule => missedOneTimeSchedules.has(schedule.id) ? { ...schedule, enabled: false } : schedule);

    const next = candidates.sort((left, right) => left.occurrence - right.occurrence)[0];
    if (!next) return;
    statusScheduleTimer = window.setTimeout(async () => {
        if (next.occurrence > Date.now() + 1_000) {
            configureStatusSchedule();
            return;
        }
        if (next.type === "start") {
            if (next.schedule.endsAt && next.schedule.endBehavior === "restore") {
                settings.store.schedulePreviousStates = {
                    ...(settings.store.schedulePreviousStates ?? {}),
                    [next.schedule.id]: {
                        occurrence: next.occurrence,
                        customStatus: CustomStatusSettings.getSetting() ?? {
                            text: "",
                            emojiId: "0",
                            emojiName: "",
                            expiresAtMs: "0",
                            createdAtMs: Date.now().toString()
                        },
                        presence: (StatusSettings.getSetting() ?? "online") as StatusPreset["presence"],
                        activePresetId: settings.store.activePresetId
                    }
                };
            }
            settings.store.scheduleRuns = { ...(settings.store.scheduleRuns ?? {}), [next.schedule.id]: next.occurrence };
            await triggerPresetById(next.schedule.presetId);
            if (next.schedule.repeat === "once" && !next.schedule.endsAt)
                settings.store.schedules = getSchedules().map(schedule => schedule.id === next.schedule.id ? { ...schedule, enabled: false } : schedule);
        } else {
            const previous = settings.store.schedulePreviousStates?.[next.schedule.id];
            if (next.schedule.endBehavior === "restore" && previous?.occurrence === next.startOccurrence) {
                await CustomStatusSettings.updateSetting(previous.customStatus);
                await StatusSettings.updateSetting(previous.presence);
                settings.store.activePresetId = previous.activePresetId && getPresets().some(preset => preset.id === previous.activePresetId && preset.enabled)
                    ? previous.activePresetId
                    : undefined;
            } else if (next.schedule.endBehavior === "preset" && next.schedule.endPresetId) {
                await triggerPresetById(next.schedule.endPresetId);
            } else if (next.schedule.endBehavior === "custom") {
                await setCustomStatusText(next.schedule.endText ?? "");
                await StatusSettings.updateSetting(next.schedule.endPresence ?? "online");
                settings.store.activePresetId = undefined;
                rememberSavedStatus(next.schedule.endText ?? "");
            }
            settings.store.scheduleEndRuns = { ...(settings.store.scheduleEndRuns ?? {}), [next.schedule.id]: next.startOccurrence };
            const previousStates = { ...(settings.store.schedulePreviousStates ?? {}) };
            delete previousStates[next.schedule.id];
            settings.store.schedulePreviousStates = previousStates;
            if (next.schedule.repeat === "once")
                settings.store.schedules = getSchedules().map(schedule => schedule.id === next.schedule.id ? { ...schedule, enabled: false } : schedule);
        }
        configureStatusSchedule();
    }, Math.min(2_147_000_000, Math.max(0, next.occurrence - now)));
}

function syncDocumentHash(document: SyncDocument) {
    return JSON.stringify({ ...document, modifiedAt: 0 });
}

function syncValuesEqual(left: unknown, right: unknown) {
    return JSON.stringify(left) === JSON.stringify(right);
}

function mergeSyncValue<T>(base: T, local: T, remote: T): T {
    if (syncValuesEqual(local, base)) return remote;
    if (syncValuesEqual(remote, base) || syncValuesEqual(local, remote)) return local;
    return local;
}

function mergeSyncRecord<T extends { id: string; }>(base: T | undefined, local: T | undefined, remote: T | undefined) {
    const selected = mergeSyncValue(base, local, remote);
    if (!base || !local || !remote || selected === undefined)
        return selected;

    return Object.fromEntries(
        [...new Set([...Object.keys(base), ...Object.keys(remote), ...Object.keys(local)])]
            .map(key => [key, mergeSyncValue(base[key as keyof T], local[key as keyof T], remote[key as keyof T])])
            .filter(([, value]) => value !== undefined)
    ) as unknown as T;
}

function mergeSyncCollection<T extends { id: string; }>(base: T[], local: T[], remote: T[]) {
    const baseById = new Map(base.map(item => [item.id, item]));
    const localById = new Map(local.map(item => [item.id, item]));
    const remoteById = new Map(remote.map(item => [item.id, item]));
    const ids = [...new Set([...remote.map(item => item.id), ...local.map(item => item.id), ...base.map(item => item.id)])];

    return ids.flatMap(id => {
        const merged = mergeSyncRecord(baseById.get(id), localById.get(id), remoteById.get(id));
        return merged === undefined ? [] : [merged];
    });
}

/** Rebase local edits onto a newer server snapshot. Local changes win only where both sides changed the same value. */
export function mergeSyncDocuments(base: SyncDocument, local: SyncDocument, remote: SyncDocument): SyncDocument {
    return {
        version: 1,
        modifiedAt: Date.now(),
        presets: mergeSyncCollection(base.presets, local.presets, remote.presets),
        savedStatuses: mergeSyncCollection(base.savedStatuses, local.savedStatuses, remote.savedStatuses),
        schedules: mergeSyncCollection(base.schedules, local.schedules, remote.schedules),
        activePresetId: mergeSyncValue(base.activePresetId, local.activePresetId, remote.activePresetId),
        autoUpdate: mergeSyncValue(base.autoUpdate, local.autoUpdate, remote.autoUpdate),
        autoRestart: mergeSyncValue(base.autoRestart, local.autoRestart, remote.autoRestart),
        updateCheckFrequency: mergeSyncValue(base.updateCheckFrequency, local.updateCheckFrequency, remote.updateCheckFrequency),
        updateChannel: mergeSyncValue(base.updateChannel, local.updateChannel, remote.updateChannel)
    };
}

function rememberCloudBaseline(revision: number, document: SyncDocument) {
    cloudSyncRevision = revision;
    cloudSyncBaseDocument = document;
    settings.store.cloudSyncState = {
        server: getSyncServerURL(),
        discordUserId: cloudSyncUserId,
        revision,
        document
    };
}

function enqueueCloudOperation<T>(operation: () => Promise<T>) {
    const generation = cloudSyncGeneration;
    const run = async () => {
        if (generation !== cloudSyncGeneration) return undefined as T;
        return await operation();
    };
    const result = cloudSyncOperation.then(run, run);
    cloudSyncOperation = result.then(() => undefined, () => undefined);
    return result;
}

function stopCloudSync() {
    if (cloudSyncTimer !== undefined) window.clearInterval(cloudSyncTimer);
    cloudSyncTimer = undefined;
    cloudSyncGeneration++;
    cloudSyncOperation = Promise.resolve();
    cloudSyncRevision = 0;
    cloudSyncBaseDocument = undefined;
    cloudSyncUserId = "";
    cloudSyncForcePush = false;
    cloudSyncLocked = false;
}

async function pushCloudChangesNow() {
    if (!settings.store.syncEnabled || applyingCloudSnapshot || cloudSyncLocked) return;
    for (let attempt = 0; attempt < 4; attempt++) {
        const document = buildSyncDocument();
        if (!cloudSyncForcePush && cloudSyncBaseDocument && syncDocumentHash(document) === syncDocumentHash(cloudSyncBaseDocument)) return;

        const result = await VencordNative.pluginHelpers.BetterStatus.pushCloudSync(
            getSyncServerURL(), cloudSyncRevision, document
        );
        if (!result.conflict) {
            cloudSyncForcePush = false;
            rememberCloudBaseline(result.revision, document);
            return;
        }

        const remote = await decodeCloudSnapshot(result);
        if (!remote) return;
        const base = cloudSyncBaseDocument ?? remote.document;
        const merged = mergeSyncDocuments(base, document, remote.document);
        applyingCloudSnapshot = true;
        try {
            await applySyncDocument(merged);
            rememberCloudBaseline(remote.revision, remote.document);
        } finally {
            applyingCloudSnapshot = false;
        }
    }
    throw new Error("Cloud sync stayed busy after four merge attempts; the local changes will be retried.");
}

function pushCloudChanges() {
    return enqueueCloudOperation(pushCloudChangesNow);
}

function reportCloudProtection(encrypted: boolean, locked: boolean) {
    window.dispatchEvent(new CustomEvent("betterstatus-sync-protection", { detail: { encrypted, locked } }));
}

async function decodeCloudSnapshot(snapshot: { revision: number; document: unknown; }) {
    const decoded = await VencordNative.pluginHelpers.BetterStatus.decodeCloudSyncSnapshot(getSyncServerURL(), snapshot);
    if (decoded.locked) {
        cloudSyncLocked = true;
        reportCloudProtection(true, true);
        requestSyncPassword(unlockCloudSyncPassword);
        return undefined;
    }
    const document = decoded.snapshot.document as SyncDocument;
    if (document?.version !== 1) return undefined;
    reportCloudProtection(decoded.encrypted, false);
    cloudSyncLocked = false;
    return { revision: snapshot.revision, document };
}

async function reconcileCloudSnapshot(
    snapshot: { revision: number; document: unknown; },
    preferRemote = false,
    initial = false
) {
    if (!settings.store.syncEnabled || (!initial && snapshot.revision <= cloudSyncRevision)) return;
    const remote = await decodeCloudSnapshot(snapshot);
    if (!remote) return;

    const local = buildSyncDocument();
    const base = cloudSyncBaseDocument;
    const hasLocalChanges = base !== undefined && syncDocumentHash(local) !== syncDocumentHash(base);
    const preserveUntrackedLocalState = initial && !base && !preferRemote;
    const next = hasLocalChanges
        ? mergeSyncDocuments(base, local, remote.document)
        : preserveUntrackedLocalState
            ? local
            : remote.document;

    applyingCloudSnapshot = true;
    try {
        if (syncDocumentHash(local) !== syncDocumentHash(next))
            await applySyncDocument(next);
        rememberCloudBaseline(remote.revision, remote.document);
        configureStatusSchedule();
    } finally {
        applyingCloudSnapshot = false;
    }

    if (syncDocumentHash(next) !== syncDocumentHash(remote.document))
        await pushCloudChangesNow();
}

async function unlockCloudSyncPassword(password: string) {
    const decoded = await VencordNative.pluginHelpers.BetterStatus.unlockCloudSync(getSyncServerURL(), password);
    cloudSyncLocked = false;
    reportCloudProtection(true, false);
    await enqueueCloudOperation(() => reconcileCloudSnapshot(decoded.snapshot, false, true));
}

async function receiveCloudSnapshot(snapshot: { revision: number; document: unknown; }) {
    await enqueueCloudOperation(() => reconcileCloudSnapshot(snapshot));
}

async function configureCloudSync() {
    stopCloudSync();
    if (!settings.store.syncEnabled) return;
    try {
        const server = getSyncServerURL();
        const savedState = settings.store.cloudSyncState;
        const preferRemote = settings.store.cloudSyncPullOnConnect === true;
        settings.store.cloudSyncPullOnConnect = false;
        const result = await VencordNative.pluginHelpers.BetterStatus.startCloudSync(getSyncServerURL());
        if (!result.connected) {
            settings.store.syncEnabled = false;
            return;
        }
        cloudSyncUserId = result.discordUserId;
        if (savedState?.server === server && savedState.discordUserId === result.discordUserId) {
            cloudSyncRevision = savedState.revision;
            cloudSyncBaseDocument = savedState.document;
        }
        if (result.snapshot?.revision > 0)
            await enqueueCloudOperation(() => reconcileCloudSnapshot(result.snapshot, preferRemote, true));
        else {
            cloudSyncRevision = result.snapshot?.revision ?? 0;
            await pushCloudChanges();
        }
        cloudSyncTimer = window.setInterval(() => void pushCloudChanges().catch(error =>
            console.error("[BetterStatus] Cloud sync failed", error)
        ), 500);
    } catch (error) {
        console.error("[BetterStatus] Could not start cloud sync", error);
    }
}

function clearScheduledUpdateCheck() {
    if (updateCheckTimer !== undefined)
        window.clearTimeout(updateCheckTimer);

    updateCheckTimer = undefined;
}

function scheduleNextUpdateCheck(retryAt?: number) {
    clearScheduledUpdateCheck();

    const frequency = getUpdateCheckFrequency();
    if (
        !updateSchedulerActive ||
        !settings.store.autoUpdate ||
        (frequency === 0 && retryAt === undefined)
    )
        return;

    const delay = retryAt === undefined
        ? frequency * 60_000
        : Math.max(1000, retryAt - Date.now());

    updateCheckTimer = window.setTimeout(runAutomaticUpdateCheck, delay);
}

function runAutomaticUpdateCheck() {
    if (!updateSchedulerActive || !settings.store.autoUpdate)
        return;

    clearScheduledUpdateCheck();
    if (automaticUpdateCheck)
        return;

    let retryAt: number | undefined;
    automaticUpdateCheck = VencordNative.pluginHelpers.BetterStatus.checkForUpdates(
        true,
        getUpdateChannel()
    )
        .then(result => {
            if (result.status === "updated") {
                const willRestart = prepareAutoRestart();
                showNotification({
                    title: "BetterStatus updated",
                    body: willRestart
                        ? "Discord will restart automatically."
                        : settings.store.autoRestart
                            ? "Restart loop protection is active. Restart Discord manually."
                        : "Restart Discord to use the new version."
                });
                if (willRestart)
                    window.setTimeout(relaunch, 1_500);
            } else if (result.status === "failed") {
                retryAt = result.retryAt;
                showUpdateFailureNotification(result, getUpdateChannel());
            }
        })
        .finally(() => {
            automaticUpdateCheck = undefined;
            scheduleNextUpdateCheck(retryAt);
        });
}


async function setCustomStatusText(text: string) {
    await CustomStatusSettings.updateSetting({
        text,
        emojiId: "0",
        emojiName: "",
        expiresAtMs: "0",
        createdAtMs: Date.now().toString()
    });
}

async function setDiscordState(preset: StatusPreset) {
    const text = preset.type === "memory"
        ? preset.rememberedText ?? preset.text
        : preset.text;
    const previousText = CustomStatusSettings.getSetting()?.text?.trim() ?? "";
    const previousPresence = StatusSettings.getSetting();

    await setCustomStatusText(text);
    await StatusSettings.updateSetting(preset.presence);
    if (text.trim() !== previousText || preset.presence !== previousPresence)
        rememberSavedStatus(text);
}


async function rememberActivePreset() {
    const { activePresetId } = settings.store;

    if (!activePresetId)
        return;

    const presets = getPresets();
    const activePreset = presets.find(preset => preset.id === activePresetId);

    if (!activePreset || activePreset.type !== "memory")
        return;

    const currentStatus = CustomStatusSettings.getSetting();
    const rememberedText = currentStatus?.text ?? "";

    await savePresets(presets.map(preset =>
        preset.id === activePresetId
            ? { ...preset, rememberedText }
            : preset
    ));
}

async function restoreActivePreset() {
    const { activePresetId } = settings.store;

    if (!activePresetId)
        return undefined;

    let activePreset = getPresets().find(
        preset => preset.id === activePresetId && preset.enabled
    );

    if (!activePreset) {
        settings.store.activePresetId = undefined;
        return undefined;
    }

    if (activePreset.type === "memory") {
        await rememberActivePreset();
        activePreset = getPresets().find(preset => preset.id === activePresetId);
    }

    if (!activePreset)
        return undefined;

    await setDiscordState(activePreset);
    return activePreset;
}

async function triggerPresetById(id: string) {
    const preset = getPresets().find(candidate => candidate.id === id);
    if (!preset || !preset.enabled) return;

    try {
        await rememberActivePreset();
        await setDiscordState(preset);
        settings.store.activePresetId = preset.id;
        console.log(`[BetterStatus] Activated "${preset.name}"`);
    } catch (error) {
        console.error(`[BetterStatus] Failed to activate "${preset.name}"`, error);
    }
}

function BetterStatusOverview() {
    return (
        <div className="bs-atelier">
            <div className="bs-atelier-copy">
                <div className="bs-atelier-brand">
                    <span className="bs-atelier-glyph">
                        <i /><i /><i /><i />
                    </span>
                    <span>BETTERSTATUS</span>
                </div>
                <div className="bs-atelier-kicker">PRESENCE, REIMAGINED</div>
                <h2>Be exactly<br />where you are.</h2>
                <p>Shape your Discord presence with focused presets and shortcuts that move as fast as you do.</p>
                <div className="bs-atelier-credit">
                    An open-source Vencord plugin by<br />
                    <strong>nik_jandaaa27829</strong> &amp; <strong>misaliba</strong>
                </div>
                <div className="bs-atelier-links">
                    <Link href="https://github.com/Jacksonnn911/BetterStatus">Explore GitHub <span>↗</span></Link>
                    <Link href="https://github.com/Jacksonnn911/BetterStatus#usage">Read the docs <span>↗</span></Link>
                    <Link href="https://github.com/Jacksonnn911/BetterStatus/issues/new">Get support <span>↗</span></Link>
                </div>
            </div>

            <div className="bs-atelier-art" aria-hidden="true">
                <div className="bs-aurora bs-aurora-one" />
                <div className="bs-aurora bs-aurora-two" />
                <div className="bs-aurora bs-aurora-three" />
                <div className="bs-atelier-orb">
                    <div className="bs-orb-core">
                        <span className="bs-orb-mark">
                            <i /><i /><i />
                        </span>
                    </div>
                    <span className="bs-orbit bs-orbit-one"><i /></span>
                    <span className="bs-orbit bs-orbit-two"><i /></span>
                </div>
                <div className="bs-presence-spectrum">
                    <span className="bs-spectrum-online" />
                    <span className="bs-spectrum-idle" />
                    <span className="bs-spectrum-dnd" />
                    <span className="bs-spectrum-memory" />
                </div>
                <div className="bs-art-caption">
                    <span>GLOBAL HOTKEYS</span>
                    <i />
                    <span>MEMORY PRESETS</span>
                    <i />
                    <span>SEAMLESS UPDATES</span>
                </div>
            </div>
        </div>
    );
}

export default definePlugin({
    name: "BetterStatus",

    description:
        "Create unlimited custom Discord statuses and activate them using global hotkeys.",

    tags: ["Shortcuts", "Utility"],

    authors: [
        {
            name: "nik_jandaaa27829",
            id: 523075512579522562n
        },
        {
            name: "misaliba",
            id: 686582690597568520n
        }
    ],

    dependencies: ["UserSettingsAPI"],

    settings,
    settingsAboutComponent() {
        return <BetterStatusOverview />;
    },

    async triggerPreset(id: string) {
        await triggerPresetById(id);
    },


    async start() {
        updateSchedulerActive = true;
        statusScheduleActive = true;
        const restartGuard = initializeAutoRestartGuard();
        if (restartGuard.newlyPaused && restartGuard.pausedUntil !== undefined) {
            const resumeTime = new Date(restartGuard.pausedUntil).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            });
            showNotification({
                title: "BetterStatus auto restart paused",
                body: `Discord restarted twice within five minutes. Automatic restart is disabled until ${resumeTime}; updates will still install.`
            });
        }
        const presets = getPresets();
        await savePresets(presets);
        startStatusHistoryModalObserver();

        try {
            const restoredPreset = await restoreActivePreset();
            if (restoredPreset)
                console.log(`[BetterStatus] Restored last active preset "${restoredPreset.name}"`);
        } catch (error) {
            console.error("[BetterStatus] Failed to restore the last active preset", error);
        }

        runAutomaticUpdateCheck();
        configureStatusSchedule();
        await configureCloudSync();

        console.log(
            `[BetterStatus] Registered ${presets.length} presets`
        );
    },

    configureUpdateChecks(checkNow = false, retryAt?: number) {
        clearScheduledUpdateCheck();

        if (!updateSchedulerActive || !settings.store.autoUpdate)
            return;

        if (retryAt !== undefined)
            scheduleNextUpdateCheck(retryAt);
        else if (checkNow)
            runAutomaticUpdateCheck();
        else
            scheduleNextUpdateCheck();
    },

    configureSchedules() {
        configureStatusSchedule();
    },

    configureCloudSync,

    async changeCloudEncryptionPassword(password?: string) {
        if (cloudSyncRevision === 0) throw new Error("Connect and finish the first sync before adding a password.");
        if (cloudSyncLocked) throw new Error("Unlock the current encrypted configuration before changing its password.");
        if (password)
            await VencordNative.pluginHelpers.BetterStatus.setCloudEncryptionPassword(getSyncServerURL(), password);
        else
            await VencordNative.pluginHelpers.BetterStatus.clearCloudEncryptionPassword(getSyncServerURL());
        cloudSyncForcePush = true;
        await pushCloudChanges();
        reportCloudProtection(Boolean(password), false);
    },

    unlockCloudSyncPassword,

    receiveCloudSnapshot,


    stop() {
        updateSchedulerActive = false;
        statusScheduleActive = false;
        clearScheduledUpdateCheck();
        clearStatusSchedule();
        stopCloudSync();
        stopStatusHistoryModalObserver();
        VencordNative.pluginHelpers.BetterStatus.unregisterAll();
    }
});
