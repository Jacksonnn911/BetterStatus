/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { showNotification } from "@api/Notifications";
import { getUserSettingLazy } from "@api/UserSettings";
import { Link } from "@components/Link";
import definePlugin from "@utils/types";
import type { User } from "@vencord/discord-types";

import { SavedStatusesProfileRow } from "./SavedStatusesProfile";
import { getPresets, rememberSavedStatus, savePresets, settings } from "./Settings";
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


async function setCustomStatusText(text: string) {
    await CustomStatusSettings.updateSetting({
        text,
        emojiId: "0",
        emojiName: "",
        expiresAtMs: "0",
        createdAtMs: Date.now().toString()
    });
}

async function applySavedStatusText(text: string) {
    await setCustomStatusText(text);
    rememberSavedStatus(text);
}

async function setDiscordState(preset: StatusPreset) {
    const text = preset.type === "memory"
        ? preset.rememberedText ?? preset.text
        : preset.text;

    await setCustomStatusText(text);
    await StatusSettings.updateSetting(preset.presence);
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

    rememberSavedStatus(rememberedText);
    await savePresets(presets.map(preset =>
        preset.id === activePresetId
            ? { ...preset, rememberedText }
            : preset
    ));
}

function BetterStatusOverview() {
    const { activePresetId, presets } = settings.use(["activePresetId", "presets"]);
    const activePreset = presets.find(preset => preset.id === activePresetId && preset.enabled);
    const activeText = activePreset
        ? activePreset.type === "memory"
            ? activePreset.rememberedText ?? activePreset.text
            : activePreset.text
        : "Activate a preset to see it here.";

    return (
        <div className="bs-overview">
            <div className="bs-overview-header">
                <div className="bs-overview-brand">
                    <div className="bs-overview-monogram">B</div>
                    <div>
                        <strong>BetterStatus</strong>
                        <span>Presence, precisely controlled.</span>
                    </div>
                </div>
                <div className="bs-overview-links">
                    <Link href="https://github.com/Jacksonnn911/BetterStatus">GitHub</Link>
                    <Link href="https://github.com/Jacksonnn911/BetterStatus#usage">Docs</Link>
                    <Link href="https://github.com/Jacksonnn911/BetterStatus/issues/new">Support</Link>
                </div>
            </div>

            <div className={`bs-now-playing bs-now-${activePreset?.presence ?? "none"}`}>
                <div className="bs-now-indicator"><i /></div>
                <div className="bs-now-copy">
                    <span>{activePreset ? "ACTIVE PRESET" : "READY WHEN YOU ARE"}</span>
                    <strong>{activePreset?.name || "No preset active"}</strong>
                    <small>{activeText || "No custom status"}</small>
                </div>
                <div className="bs-now-details">
                    {activePreset && <span>{activePreset.presence === "dnd" ? "Do Not Disturb" : activePreset.presence}</span>}
                    <kbd>{activePreset?.hotkey || "No shortcut"}</kbd>
                </div>
            </div>

            <div className="bs-overview-footer">
                <span><i /> {presets.filter(preset => preset.enabled).length} presets ready</span>
                <span>Fixed + memory behavior</span>
                <span className="bs-overview-credit">By <strong>nik_jandaaa27829</strong> &amp; <strong>misaliba</strong></span>
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

    patches: [
        {
            find: '"UserProfilePopout");',
            replacement: {
                match: /userId:\i\.id,guild:\i\}\)/,
                replace: "$&,$self.renderSavedStatusesProfile(arguments[0])"
            }
        }
    ],

    settings,
    settingsAboutComponent() {
        return <BetterStatusOverview />;
    },

    renderSavedStatusesProfile(props: { user: User; }) {
        return <SavedStatusesProfileRow user={props.user} onApply={applySavedStatusText} />;
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
        const presets = getPresets();
        await savePresets(presets);

        void VencordNative.pluginHelpers.BetterStatus.checkForUpdates(settings.store.autoUpdate)
            .then(result => {
                if (result.status === "updated") {
                    showNotification({
                        title: "BetterStatus updated",
                        body: "Restart Discord to use the new version."
                    });
                } else if (result.status === "failed") {
                    showNotification({
                        title: "BetterStatus update failed",
                        body: result.error ?? "Run the BetterStatus installer to update manually."
                    });
                }
            });

        console.log(
            `[BetterStatus] Registered ${presets.length} presets`
        );
    },


    stop() {
        VencordNative.pluginHelpers.BetterStatus.unregisterAll();
    }
});
