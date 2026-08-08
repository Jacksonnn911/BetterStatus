/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings, migratePluginSettings } from "@api/Settings";
import { FormSwitch } from "@components/FormSwitch";
import { OptionType, PluginNative } from "@utils/types";
import { Button, Forms, React, Select, TextInput } from "@webpack/common";

import type { PresenceStatus, PresetType, StatusPreset } from "./types";

const Native = VencordNative.pluginHelpers.BetterStatus as PluginNative<typeof import("./native")>;

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


const PRESENCE_OPTIONS = [
    {
        label: "Online",
        value: "online"
    },
    {
        label: "Idle",
        value: "idle"
    },
    {
        label: "Do Not Disturb",
        value: "dnd"
    },
    {
        label: "Invisible",
        value: "invisible"
    }
];

const TYPE_OPTIONS = [
    {
        label: "Fixed",
        value: "fixed"
    },
    {
        label: "Memory",
        value: "memory"
    }
];

function createId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}


function eventToAccelerator(event: KeyboardEvent): string | null {
    const ignored = [
        "Meta",
        "Control",
        "Alt",
        "Shift"
    ];

    if (ignored.includes(event.key)) {
        return null;
    }

    const parts: string[] = [];

    if (event.metaKey)
        parts.push("Command");

    if (event.ctrlKey)
        parts.push("Control");

    if (event.altKey)
        parts.push("Alt");

    if (event.shiftKey)
        parts.push("Shift");


    let { key } = event;

    const aliases: Record<string, string> = {
        " ": "Space",
        ArrowUp: "Up",
        ArrowDown: "Down",
        ArrowLeft: "Left",
        ArrowRight: "Right",
        Escape: "Escape",
        Enter: "Enter",
        Backspace: "Backspace",
        Delete: "Delete",
        Tab: "Tab"
    };

    key = aliases[key] ?? key;


    if (key.length === 1) {
        key = key.toUpperCase();
    }


    parts.push(key);

    return parts.join("+");
}


export default function SettingsComponent() {
    const { presets } = settings.use(["presets"]);

    const [recordingId, setRecordingId] =
        React.useState<string | null>(null);


    async function commit(next: StatusPreset[]) {
        await savePresets(next);
    }


    function updatePreset(
        id: string,
        patch: Partial<StatusPreset>
    ) {
        const next = presets.map(preset =>
            preset.id === id
                ? {
                    ...preset,
                    ...patch
                }
                : preset
        );

        void commit(next);
    }


    function addPreset() {
        const next: StatusPreset[] = [
            ...presets,
            {
                id: createId(),
                name: `Status ${presets.length + 1}`,
                text: "",
                type: "fixed",
                presence: "online",
                hotkey: "",
                enabled: true
            }
        ];

        void commit(next);
    }


    function deletePreset(id: string) {
        void commit(
            presets.filter(preset =>
                preset.id !== id
            )
        );
    }


    React.useEffect(() => {
        if (!recordingId)
            return;


        const handler = (event: KeyboardEvent) => {
            event.preventDefault();
            event.stopPropagation();


            if (event.key === "Escape") {
                setRecordingId(null);
                return;
            }


            const accelerator =
                eventToAccelerator(event);


            if (!accelerator)
                return;


            updatePreset(
                recordingId,
                {
                    hotkey: accelerator
                }
            );

            setRecordingId(null);
        };


        window.addEventListener(
            "keydown",
            handler,
            true
        );


        return () =>
            window.removeEventListener(
                "keydown",
                handler,
                true
            );

    }, [recordingId, presets]);


    return (
        <div>
            <div
                style={{
                    padding: "20px",
                    borderRadius: "12px",
                    background: "var(--background-secondary)",
                    border: "1px solid var(--background-modifier-accent)"
                }}
            >
                <Forms.FormTitle tag="h2">
                    BetterStatus
                </Forms.FormTitle>

                <Forms.FormText>
                    Switch between Fixed and Memory status presets from anywhere
                    using global keyboard shortcuts.
                </Forms.FormText>

                <Forms.FormText style={{ marginTop: "12px" }}>
                    {presets.length} preset{presets.length === 1 ? "" : "s"} · {presets.filter(preset => preset.enabled).length} enabled
                </Forms.FormText>
            </div>

            <Forms.FormTitle tag="h3" style={{ marginTop: "24px" }}>
                Status Presets
            </Forms.FormTitle>


            {presets.map(preset => (
                <div
                    key={preset.id}
                    style={{
                        marginTop: "20px",
                        padding: "16px",
                        border: "1px solid var(--background-modifier-accent)",
                        borderRadius: "8px"
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "12px"
                        }}
                    >
                        <Forms.FormTitle>
                            {preset.name || "Unnamed Status"}
                        </Forms.FormTitle>
                        <Forms.FormText>
                            {preset.type === "memory" ? "Memory" : "Fixed"} · {preset.enabled ? "Enabled" : "Disabled"}
                        </Forms.FormText>
                    </div>


                    <Forms.FormText>
                        Preset name
                    </Forms.FormText>

                    <TextInput
                        value={preset.name}
                        onChange={value =>
                            updatePreset(
                                preset.id,
                                {
                                    name: value
                                }
                            )
                        }
                    />


                    <div style={{ height: "12px" }} />


                    <Forms.FormText>
                        Preset type
                    </Forms.FormText>

                    <Select
                        options={TYPE_OPTIONS}
                        select={value =>
                            updatePreset(
                                preset.id,
                                {
                                    type: value as PresetType
                                }
                            )
                        }
                        serialize={value => value}
                        isSelected={value =>
                            value === preset.type
                        }
                        closeOnSelect={true}
                    />

                    <Forms.FormText>
                        {preset.type === "memory"
                            ? "Memory learns manual custom-status changes while this preset is active and restores the last one next time."
                            : "Fixed always restores the custom status configured below."}
                    </Forms.FormText>


                    <div style={{ height: "12px" }} />


                    <Forms.FormText>
                        {preset.type === "memory"
                            ? "Initial / remembered custom status"
                            : "Custom status"}
                    </Forms.FormText>

                    <TextInput
                        value={preset.type === "memory"
                            ? preset.rememberedText ?? preset.text
                            : preset.text}
                        placeholder="What are you doing?"
                        onChange={value =>
                            updatePreset(
                                preset.id,
                                preset.type === "memory"
                                    ? {
                                        text: value,
                                        rememberedText: value
                                    }
                                    : {
                                        text: value
                                    }
                            )
                        }
                    />


                    <div style={{ height: "12px" }} />


                    <Forms.FormText>
                        Presence
                    </Forms.FormText>

                    <Select
                        options={PRESENCE_OPTIONS}
                        select={value =>
                            updatePreset(
                                preset.id,
                                {
                                    presence:
                                        value as PresenceStatus
                                }
                            )
                        }
                        serialize={value => value}
                        isSelected={value =>
                            value === preset.presence
                        }
                        closeOnSelect={true}
                    />


                    <div style={{ height: "16px" }} />


                    <Forms.FormText>
                        Global hotkey
                    </Forms.FormText>

                    <div
                        style={{
                            display: "flex",
                            gap: "8px",
                            alignItems: "center"
                        }}
                    >
                        <TextInput
                            value={
                                recordingId === preset.id
                                    ? "Press shortcut..."
                                    : preset.hotkey || "None"
                            }
                            editable={false}
                        />

                        <Button
                            onClick={() =>
                                setRecordingId(
                                    recordingId === preset.id
                                        ? null
                                        : preset.id
                                )
                            }
                        >
                            {recordingId === preset.id
                                ? "Cancel"
                                : "Record"}
                        </Button>
                    </div>


                    <div style={{ height: "16px" }} />


                    <FormSwitch
                        title="Enabled"
                        value={preset.enabled}
                        onChange={value =>
                            updatePreset(
                                preset.id,
                                {
                                    enabled: value
                                }
                            )
                        }
                        hideBorder
                    />


                    <div style={{ height: "16px" }} />


                    <Button
                        color={Button.Colors.RED}
                        onClick={() =>
                            deletePreset(preset.id)
                        }
                    >
                        Delete Status
                    </Button>
                </div>
            ))}


            <div style={{ marginTop: "20px" }}>
                <Button onClick={addPreset}>
                    + Add Status
                </Button>
            </div>
        </div>
    );
}

migratePluginSettings("BetterStatus", "StatusHotkeys");

export const settings = definePluginSettings({
    autoUpdate: {
        type: OptionType.BOOLEAN,
        description: "Automatically download the latest successful BetterStatus release and rebuild Vencord. The update is used after Discord restarts.",
        default: false,
        async onChange(value: boolean) {
            if (value)
                await Native.checkForUpdates(true);
        }
    },
    presets: {
        type: OptionType.CUSTOM,
        default: DEFAULT_PRESETS
    },
    presetEditor: {
        type: OptionType.COMPONENT,
        component: SettingsComponent
    }
}).withPrivateSettings<{
    activePresetId?: string;
}>();

export function getPresets(): StatusPreset[] {
    const normalized = settings.store.presets.map(preset => ({
        ...preset,
        type: preset.type === "memory" ? "memory" as const : "fixed" as const
    }));

    if (normalized.some((preset, index) => preset.type !== settings.store.presets[index].type))
        settings.store.presets = normalized;

    return normalized;
}

export async function savePresets(presets: StatusPreset[]) {
    settings.store.presets = presets;

    await Native.registerHotkeys(presets.map(({ id, hotkey, enabled }) => ({
        id,
        hotkey,
        enabled
    })));
}
