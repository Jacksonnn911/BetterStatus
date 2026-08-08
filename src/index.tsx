/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { showNotification } from "@api/Notifications";
import { getUserSettingLazy } from "@api/UserSettings";
import { Link } from "@components/Link";
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
        return (
            <div className="bs-about">
                <div className="bs-about-content">
                    <div className="bs-brand-lockup">
                        <div className="bs-about-icon">BS</div>
                        <div>
                            <div className="bs-about-eyebrow">BetterStatus for Vencord</div>
                            <div className="bs-about-heading">Your presence. Your rules.</div>
                        </div>
                    </div>
                    <div className="bs-about-tagline">Status switching, without the friction.</div>
                    <Paragraph>
                        Create focused status presets, assign global shortcuts, and switch without leaving your current app.
                    </Paragraph>
                    <div className="bs-about-credit">
                        Built by nik_jandaaa27829 (Jacksonnn911) &amp; misaliba (qtmisaliba)
                    </div>
                    <div className="bs-about-features">
                        <span>Global hotkeys</span>
                        <span>Memory presets</span>
                        <span>Auto updates</span>
                    </div>
                    <div className="bs-about-links">
                        <Link className="bs-about-link" href="https://github.com/Jacksonnn911/BetterStatus">GitHub ↗</Link>
                        <Link className="bs-about-link" href="https://github.com/Jacksonnn911/BetterStatus#usage">Documentation ↗</Link>
                        <Link className="bs-about-link" href="https://github.com/Jacksonnn911/BetterStatus/issues/new">Report an issue ↗</Link>
                    </div>
                </div>
                <div className="bs-about-preview" aria-hidden="true">
                    <div className="bs-preview-glow" />
                    <div className="bs-preview-card bs-preview-dnd">
                        <span className="bs-preview-dot" />
                        <div>
                            <strong>Deep focus</strong>
                            <span className="bs-preview-status">Locked in. No distractions.</span>
                        </div>
                        <kbd>⌘ −</kbd>
                    </div>
                    <div className="bs-preview-card bs-preview-online">
                        <span className="bs-preview-dot" />
                        <div>
                            <strong>Available</strong>
                            <span className="bs-preview-status">Free to chat — say hello.</span>
                        </div>
                        <kbd>⌘ =</kbd>
                    </div>
                    <div className="bs-preview-orbit"><span /></div>
                </div>
            </div>
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
