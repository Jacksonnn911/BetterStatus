/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { getUserSettingLazy } from "@api/UserSettings";
import { Paragraph } from "@components/Paragraph";
import definePlugin from "@utils/types";

import { getPresets, savePresets, settings } from "./Settings";
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


async function setDiscordState(preset: StatusPreset) {
    const text = preset.type === "memory"
        ? preset.rememberedText ?? preset.text
        : preset.text;

    await CustomStatusSettings.updateSetting({
        text,
        emojiId: "0",
        emojiName: "",
        expiresAtMs: "0",
        createdAtMs: Date.now().toString()
    });

    await StatusSettings.updateSetting(preset.presence);
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

export default definePlugin({
    name: "BetterStatus",

    description:
        "Create unlimited custom Discord statuses and activate them using global hotkeys.",

    tags: ["Shortcuts", "Utility"],

    authors: [
        {
            name: "nik_jandaaa27829",
            id: 0n
        }
    ],

    dependencies: ["UserSettingsAPI"],

    settings,
    settingsAboutComponent() {
        return (
            <Paragraph>
                BetterStatus is an open-source Vencord user plugin by nik_jandaaa27829 (Jacksonnn911). {" "}
                <a href="https://github.com/Jacksonnn911/BetterStatus" target="_blank" rel="noreferrer">GitHub</a>
                {" · "}
                <a href="https://github.com/Jacksonnn911/BetterStatus#usage" target="_blank" rel="noreferrer">Documentation</a>
                {" · "}
                <a href="https://github.com/Jacksonnn911/BetterStatus/issues/new" target="_blank" rel="noreferrer">Report an issue</a>
            </Paragraph>
        );
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

        console.log(
            `[BetterStatus] Registered ${presets.length} presets`
        );
    },


    stop() {
        VencordNative.pluginHelpers.BetterStatus.unregisterAll();
    }
});
