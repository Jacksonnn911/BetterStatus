/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./styles.css";

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


    const enabledCount = presets.filter(preset => preset.enabled).length;

    return (
        <div className="bs-settings">
            <div className="bs-toolbar">
                <div>
                    <Forms.FormTitle tag="h2">Status presets</Forms.FormTitle>
                    <Forms.FormText>
                        {presets.length} total · {enabledCount} active
                    </Forms.FormText>
                </div>
                <Button onClick={addPreset}>Add preset</Button>
            </div>

            {presets.length === 0
                ? (
                    <div className="bs-empty">
                        <Forms.FormTitle>No presets yet</Forms.FormTitle>
                        <Forms.FormText>Create your first status preset to get started.</Forms.FormText>
                        <Button onClick={addPreset}>Create preset</Button>
                    </div>
                )
                : (
                    <div className="bs-preset-grid">
                        {presets.map(preset => (
                            <section className={`bs-preset-card${preset.enabled ? "" : " bs-preset-card-disabled"}`} key={preset.id}>
                                <header className="bs-card-header">
                                    <div className="bs-card-title">
                                        <Forms.FormTitle>{preset.name || "Untitled preset"}</Forms.FormTitle>
                                        <span className={`bs-mode-badge bs-mode-${preset.type}`}>
                                            {preset.type === "memory" ? "Memory" : "Fixed"}
                                        </span>
                                    </div>
                                    <FormSwitch
                                        title="Enabled"
                                        value={preset.enabled}
                                        onChange={enabled => updatePreset(preset.id, { enabled })}
                                        hideBorder
                                    />
                                </header>

                                <div className="bs-fields">
                                    <label className="bs-field">
                                        <span>Preset name</span>
                                        <TextInput
                                            value={preset.name}
                                            placeholder="Work, gaming, sleeping…"
                                            onChange={name => updatePreset(preset.id, { name })}
                                        />
                                    </label>

                                    <label className="bs-field">
                                        <span>Presence</span>
                                        <Select
                                            options={PRESENCE_OPTIONS}
                                            select={presence => updatePreset(preset.id, { presence: presence as PresenceStatus })}
                                            serialize={value => value}
                                            isSelected={value => value === preset.presence}
                                            closeOnSelect
                                        />
                                    </label>

                                    <label className="bs-field">
                                        <span>Behavior</span>
                                        <Select
                                            options={TYPE_OPTIONS}
                                            select={type => updatePreset(preset.id, { type: type as PresetType })}
                                            serialize={value => value}
                                            isSelected={value => value === preset.type}
                                            closeOnSelect
                                        />
                                    </label>

                                    <label className="bs-field bs-field-status">
                                        <span>{preset.type === "memory" ? "Remembered status" : "Custom status"}</span>
                                        <TextInput
                                            value={preset.type === "memory" ? preset.rememberedText ?? preset.text : preset.text}
                                            placeholder="What are you doing?"
                                            onChange={text => updatePreset(preset.id, preset.type === "memory"
                                                ? { text, rememberedText: text }
                                                : { text })}
                                        />
                                    </label>

                                    <div className="bs-field bs-field-hotkey">
                                        <span>Global hotkey</span>
                                        <div className={`bs-hotkey${recordingId === preset.id ? " bs-hotkey-recording" : ""}`}>
                                            <TextInput
                                                value={recordingId === preset.id ? "Press a shortcut…" : preset.hotkey || "Not assigned"}
                                                editable={false}
                                            />
                                            <Button onClick={() => setRecordingId(recordingId === preset.id ? null : preset.id)}>
                                                {recordingId === preset.id ? "Cancel" : "Record"}
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="bs-card-footer">
                                    <Forms.FormText>
                                        {preset.type === "memory"
                                            ? "Remembers the last status used while active."
                                            : "Always applies the status saved above."}
                                    </Forms.FormText>
                                    <Button
                                        color={Button.Colors.RED}
                                        onClick={() => deletePreset(preset.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </section>
                        ))}
                    </div>
                )}
        </div>
    );
}

migratePluginSettings("BetterStatus", "StatusHotkeys");

export const settings = definePluginSettings({
    autoUpdate: {
        type: OptionType.BOOLEAN,
        description: "Automatically download the latest successful BetterStatus release and rebuild Vencord. The update is used after Discord restarts.",
        default: false
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
