import { Settings } from "@api/Settings";
import { getUserSettingLazy } from "@api/UserSettings";
import definePlugin from "@utils/types";
import type { PluginNative } from "@utils/types";

import SettingsComponent from "./Settings";
import type { StatusPreset } from "./types";

const Native = VencordNative.pluginHelpers.StatusHotkeys as PluginNative<typeof import("./native")>;

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


const DEFAULT_PRESETS: StatusPreset[] = [
    {
        id: "sleeping",
        name: "Sleeping",
        text: "Spinkám 👅",
        presence: "dnd",
        hotkey: "Command+-",
        enabled: true
    },
    {
        id: "normal",
        name: "Normal",
        text: "Every end has a new beginning...",
        presence: "online",
        hotkey: "Command+=",
        enabled: true
    }
];


function getPluginSettings(): any {
    return Settings.plugins.StatusHotkeys ??= {};
}


export function getPresets(): StatusPreset[] {
    const pluginSettings = getPluginSettings();

    if (!Array.isArray(pluginSettings.presets)) {
        pluginSettings.presets = DEFAULT_PRESETS;
    }

    return pluginSettings.presets;
}


export async function savePresets(presets: StatusPreset[]) {
    getPluginSettings().presets = presets;

    await Native.registerHotkeys(
        presets.map(preset => ({
            id: preset.id,
            hotkey: preset.hotkey,
            enabled: preset.enabled
        }))
    );
}


async function setDiscordState(preset: StatusPreset) {
    await CustomStatusSettings.updateSetting({
        text: preset.text,
        emojiId: "0",
        emojiName: "",
        expiresAtMs: "0",
        createdAtMs: Date.now().toString()
    });

    await StatusSettings.updateSetting(preset.presence);
}


export default definePlugin({
    name: "StatusHotkeys",

    description:
        "Create unlimited custom Discord statuses and activate them using global hotkeys.",

    authors: [
        {
            name: "Nicolas",
            id: 0n
        }
    ],

    dependencies: ["UserSettingsAPI"],

    settingsAboutComponent: SettingsComponent,


    async triggerPreset(id: string) {
        const preset = getPresets().find(
            preset => preset.id === id
        );

        if (!preset || !preset.enabled) {
            return;
        }

        try {
            await setDiscordState(preset);

            console.log(
                `[StatusHotkeys] Activated "${preset.name}"`
            );
        } catch (error) {
            console.error(
                `[StatusHotkeys] Failed to activate "${preset.name}"`,
                error
            );
        }
    },


    async start() {
        const presets = getPresets();

        await Native.registerHotkeys(
            presets.map(preset => ({
                id: preset.id,
                hotkey: preset.hotkey,
                enabled: preset.enabled
            }))
        );

        console.log(
            `[StatusHotkeys] Registered ${presets.length} presets`
        );
    },


    stop() {
        Native.unregisterAll();
    }
});
