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
let cloudSyncHash = "";
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

function stopCloudSync() {
    if (cloudSyncTimer !== undefined) window.clearInterval(cloudSyncTimer);
    cloudSyncTimer = undefined;
    cloudSyncRevision = 0;
    cloudSyncHash = "";
    cloudSyncLocked = false;
}

async function pushCloudChanges() {
    if (!settings.store.syncEnabled || applyingCloudSnapshot || cloudSyncLocked) return;
    const document = buildSyncDocument();
    const hash = syncDocumentHash(document);
    if (hash === cloudSyncHash) return;
    const snapshot = await VencordNative.pluginHelpers.BetterStatus.pushCloudSync(
        getSyncServerURL(), cloudSyncRevision, document
    );
    cloudSyncHash = hash;
    await receiveCloudSnapshot(snapshot);
}

function reportCloudProtection(encrypted: boolean, locked: boolean) {
    window.dispatchEvent(new CustomEvent("betterstatus-sync-protection", { detail: { encrypted, locked } }));
}

async function applyDecodedCloudSnapshot(
    snapshot: { revision: number; document: SyncDocument; },
    encrypted: boolean
) {
    if (!settings.store.syncEnabled || snapshot.revision < cloudSyncRevision || snapshot.document?.version !== 1) return;
    const hash = syncDocumentHash(snapshot.document);
    reportCloudProtection(encrypted, false);
    cloudSyncLocked = false;
    if (snapshot.revision === cloudSyncRevision && hash === cloudSyncHash) return;
    applyingCloudSnapshot = true;
    try {
        await applySyncDocument(snapshot.document);
        cloudSyncRevision = snapshot.revision;
        cloudSyncHash = hash;
        configureStatusSchedule();
    } finally {
        applyingCloudSnapshot = false;
    }
}

async function unlockCloudSyncPassword(password: string) {
    const decoded = await VencordNative.pluginHelpers.BetterStatus.unlockCloudSync(getSyncServerURL(), password);
    await applyDecodedCloudSnapshot(decoded.snapshot as { revision: number; document: SyncDocument; }, true);
}

async function receiveCloudSnapshot(snapshot: { revision: number; document: unknown; }) {
    if (!settings.store.syncEnabled || snapshot.revision < cloudSyncRevision) return;
    const decoded = await VencordNative.pluginHelpers.BetterStatus.decodeCloudSyncSnapshot(getSyncServerURL(), snapshot);
    if (decoded.locked) {
        cloudSyncRevision = snapshot.revision;
        cloudSyncLocked = true;
        reportCloudProtection(true, true);
        requestSyncPassword(unlockCloudSyncPassword);
        return;
    }
    await applyDecodedCloudSnapshot(
        decoded.snapshot as { revision: number; document: SyncDocument; },
        decoded.encrypted
    );
}

async function configureCloudSync() {
    stopCloudSync();
    if (!settings.store.syncEnabled) return;
    try {
        const result = await VencordNative.pluginHelpers.BetterStatus.startCloudSync(getSyncServerURL());
        if (!result.connected) {
            settings.store.syncEnabled = false;
            return;
        }
        if (result.snapshot?.revision > 0)
            await receiveCloudSnapshot(result.snapshot);
        else {
            cloudSyncRevision = result.snapshot?.revision ?? 0;
            await pushCloudChanges();
        }
        cloudSyncTimer = window.setInterval(() => void pushCloudChanges().catch(error =>
            console.error("[BetterStatus] Cloud sync failed", error)
        ), 2_000);
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
        cloudSyncHash = "";
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
