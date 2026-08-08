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

import { getPresets, getUpdateChannel, getUpdateCheckFrequency, rememberSavedStatus, savePresets, settings } from "./Settings";
import { startStatusHistoryModalObserver, stopStatusHistoryModalObserver } from "./StatusHistory";
import type { StatusPreset } from "./types";

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

function clearScheduledUpdateCheck() {
    if (updateCheckTimer !== undefined)
        window.clearTimeout(updateCheckTimer);

    updateCheckTimer = undefined;
}

function scheduleNextUpdateCheck() {
    clearScheduledUpdateCheck();

    const frequency = getUpdateCheckFrequency();
    if (!updateSchedulerActive || !settings.store.autoUpdate || frequency === 0)
        return;

    updateCheckTimer = window.setTimeout(
        runAutomaticUpdateCheck,
        frequency * 60_000
    );
}

function runAutomaticUpdateCheck() {
    if (!updateSchedulerActive || !settings.store.autoUpdate)
        return;

    clearScheduledUpdateCheck();
    if (automaticUpdateCheck)
        return;

    automaticUpdateCheck = VencordNative.pluginHelpers.BetterStatus.checkForUpdates(
        true,
        getUpdateChannel()
    )
        .then(result => {
            if (result.status === "updated") {
                showNotification({
                    title: "BetterStatus updated",
                    body: settings.store.autoRestart
                        ? "Discord will restart automatically."
                        : "Restart Discord to use the new version."
                });
                if (settings.store.autoRestart)
                    window.setTimeout(relaunch, 1_500);
            } else if (result.status === "failed") {
                showNotification({
                    title: "BetterStatus update failed",
                    body: result.error ?? "Run the BetterStatus installer to update manually."
                });
            }
        })
        .finally(() => {
            automaticUpdateCheck = undefined;
            scheduleNextUpdateCheck();
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
        const preset = getPresets().find(
            preset => preset.id === id
        );

        if (!preset || !preset.enabled) {
            return;
        }

        try {
            await rememberActivePreset();
            await setDiscordState(preset);
            settings.store.activePresetId = preset.id;

            console.log(
                `[BetterStatus] Activated "${preset.name}"`
            );
        } catch (error) {
            console.error(
                `[BetterStatus] Failed to activate "${preset.name}"`,
                error
            );
        }
    },


    async start() {
        updateSchedulerActive = true;
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

        console.log(
            `[BetterStatus] Registered ${presets.length} presets`
        );
    },

    configureUpdateChecks(checkNow = false) {
        clearScheduledUpdateCheck();

        if (!updateSchedulerActive || !settings.store.autoUpdate)
            return;

        if (checkNow)
            runAutomaticUpdateCheck();
        else
            scheduleNextUpdateCheck();
    },


    stop() {
        updateSchedulerActive = false;
        clearScheduledUpdateCheck();
        stopStatusHistoryModalObserver();
        VencordNative.pluginHelpers.BetterStatus.unregisterAll();
    }
});
