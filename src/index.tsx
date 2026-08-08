import { Settings } from "@api/Settings";
import { getUserSettingLazy } from "@api/UserSettings";
import definePlugin from "@utils/types";
import type { PluginNative } from "@utils/types";

import SettingsComponent from "./Settings";
import type { StatusPreset } from "./types";

const Native = VencordNative.pluginHelpers.BetterStatus as PluginNative<typeof import("./native")>;

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
        type: "fixed",
        presence: "dnd",
        hotkey: "Command+-",
        enabled: true
    },
    {
        id: "normal",
        name: "Normal",
        text: "Every end has a new beginning...",
        type: "fixed",
        presence: "online",
        hotkey: "Command+=",
        enabled: true
    }
];


function getPluginSettings(): any {
    const current = Settings.plugins.BetterStatus ??= {};
    const legacy = Settings.plugins.StatusHotkeys;

    if (legacy) {
        if (!Array.isArray(current.presets) && Array.isArray(legacy.presets)) {
            current.presets = legacy.presets;
        }
        if (!current.activePresetId && legacy.activePresetId) {
            current.activePresetId = legacy.activePresetId;
        }
    }

    return current;
}


export function getPresets(): StatusPreset[] {
    const pluginSettings = getPluginSettings();

    if (!Array.isArray(pluginSettings.presets)) {
        pluginSettings.presets = DEFAULT_PRESETS;
    }

    // Presets created before modes existed keep their original behaviour.
    pluginSettings.presets = pluginSettings.presets.map((preset: StatusPreset) => ({
        ...preset,
        type: preset.type === "memory" ? "memory" : "fixed"
    }));

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
    const pluginSettings = getPluginSettings();
    const activePresetId = pluginSettings.activePresetId as string | undefined;

    if (!activePresetId)
        return;

    const presets = getPresets();
    const activePreset = presets.find(preset => preset.id === activePresetId);

    if (!activePreset || activePreset.type !== "memory")
        return;

    const currentStatus = CustomStatusSettings.getSetting();
    const rememberedText = currentStatus?.text ?? "";

    pluginSettings.presets = presets.map(preset =>
        preset.id === activePresetId
            ? { ...preset, rememberedText }
            : preset
    );
}


export default definePlugin({
    name: "BetterStatus",

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
            await rememberActivePreset();
            await setDiscordState(preset);
            getPluginSettings().activePresetId = preset.id;

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

        await Native.registerHotkeys(
            presets.map(preset => ({
                id: preset.id,
                hotkey: preset.hotkey,
                enabled: preset.enabled
            }))
        );

        console.log(
            `[BetterStatus] Registered ${presets.length} presets`
        );
    },


    stop() {
        Native.unregisterAll();
    }
});
