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
        return (
            <div className="bs-command-hero">
                <div className="bs-command-topline">
                    <div className="bs-command-brand">
                        <span className="bs-command-mark"><i /><i /><i /></span>
                        <span>BETTERSTATUS</span>
                    </div>
                    <span className="bs-command-version"><i /> VENCORD USER PLUGIN</span>
                </div>

                <div className="bs-command-body">
                    <div className="bs-command-message">
                        <span className="bs-command-kicker">YOUR PRESENCE, ON YOUR TERMS</span>
                        <h2>Switch context.<br /><em>Stay in flow.</em></h2>
                        <Paragraph>
                            Purpose-built presets and global shortcuts for the way you actually use Discord.
                        </Paragraph>
                    </div>

                    <div className="bs-command-console" aria-hidden="true">
                        <div className="bs-console-header">
                            <span><i /> GLOBAL SHORTCUT</span>
                            <strong>LISTENING</strong>
                        </div>
                        <div className="bs-console-keys">
                            <kbd>⌘</kbd><span>+</span><kbd>⇧</kbd><span>+</span><kbd>S</kbd>
                        </div>
                        <div className="bs-console-route">
                            <div><span>01</span><strong>CAPTURE</strong><small>Shortcut</small></div>
                            <i />
                            <div><span>02</span><strong>RECALL</strong><small>Preset</small></div>
                            <i />
                            <div><span>03</span><strong>SWITCH</strong><small>Presence</small></div>
                        </div>
                        <div className="bs-console-result"><i /> STATUS APPLIED <strong>INSTANTLY</strong></div>
                    </div>
                </div>

                <div className="bs-command-footer">
                    <div className="bs-command-meta">
                        <span>GLOBAL HOTKEYS</span><span>MEMORY PRESETS</span><span>SAFE UPDATES</span>
                    </div>
                    <div className="bs-command-credit">
                        Crafted by <strong>nik_jandaaa27829</strong> &amp; <strong>misaliba</strong>
                    </div>
                    <div className="bs-command-links">
                        <Link href="https://github.com/Jacksonnn911/BetterStatus">Source</Link>
                        <Link href="https://github.com/Jacksonnn911/BetterStatus#usage">Docs</Link>
                        <Link href="https://github.com/Jacksonnn911/BetterStatus/issues/new">Support</Link>
                    </div>
                </div>
            </div>
        );
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
