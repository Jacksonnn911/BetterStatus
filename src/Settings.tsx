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

function ChevronIcon({ collapsed }: { collapsed: boolean; }) {
    return (
        <svg
            aria-hidden="true"
            className={`bs-chevron${collapsed ? " bs-chevron-collapsed" : ""}`}
            viewBox="0 0 24 24"
            width="20"
            height="20"
        >
            <path fill="currentColor" d="M6.7 8.3a1 1 0 0 1 1.4 0l3.9 3.9 3.9-3.9a1 1 0 1 1 1.4 1.4l-4.6 4.6a1 1 0 0 1-1.4 0L6.7 9.7a1 1 0 0 1 0-1.4Z" />
        </svg>
    );
}


export default function SettingsComponent() {
    const { autoUpdate, presets: storedPresets } = settings.use(["autoUpdate", "presets"]);

    const [recordingId, setRecordingId] =
        React.useState<string | null>(null);
    const [collapsedIds, setCollapsedIds] =
        React.useState<Set<string>>(() => new Set((storedPresets ?? []).map(preset => preset.id)));
    const [searchQuery, setSearchQuery] = React.useState("");
    const [presets, setPresets] = React.useState<StatusPreset[]>(() => [...(storedPresets ?? [])]);
    const collapseStateInitialized = React.useRef(storedPresets != null);


    React.useEffect(() => {
        if (!storedPresets)
            return;

        setPresets([...storedPresets]);

        if (!collapseStateInitialized.current) {
            setCollapsedIds(new Set(storedPresets.map(preset => preset.id)));
            collapseStateInitialized.current = true;
        }
    }, [storedPresets]);


    async function commit(next: StatusPreset[]) {
        setPresets(next);
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


    function duplicatePreset(preset: StatusPreset) {
        void commit([
            ...presets,
            {
                ...preset,
                id: createId(),
                name: `${preset.name || "Untitled preset"} copy`,
                hotkey: "",
                enabled: false
            }
        ]);
    }


    function deletePreset(id: string) {
        void commit(
            presets.filter(preset =>
                preset.id !== id
            )
        );
    }


    function toggleCollapsed(id: string) {
        setCollapsedIds(current => {
            const next = new Set(current);

            if (next.has(id))
                next.delete(id);
            else
                next.add(id);

            return next;
        });

        if (recordingId === id)
            setRecordingId(null);
    }


    function toggleAllCollapsed() {
        const allCollapsed = presets.length > 0 && presets.every(preset => collapsedIds.has(preset.id));
        setCollapsedIds(allCollapsed ? new Set() : new Set(presets.map(preset => preset.id)));
        setRecordingId(null);
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
    const memoryCount = presets.filter(preset => preset.type === "memory").length;
    const allCollapsed = presets.length > 0 && presets.every(preset => collapsedIds.has(preset.id));
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const visiblePresets = normalizedQuery
        ? presets.filter(preset => [preset.name, preset.text, preset.hotkey, preset.presence, preset.type]
            .some(value => value.toLowerCase().includes(normalizedQuery)))
        : presets;

    return (
        <div className="bs-settings">
            <div className="bs-control-panel">
                <div className="bs-control-icon">↻</div>
                <div className="bs-control-copy">
                    <Forms.FormTitle>Automatic updates</Forms.FormTitle>
                    <Forms.FormText>
                        Keep BetterStatus current with verified rolling releases. Updates build safely and apply after restart.
                    </Forms.FormText>
                </div>
                <FormSwitch
                    title={autoUpdate ? "On" : "Off"}
                    value={autoUpdate}
                    onChange={value => settings.store.autoUpdate = value}
                    hideBorder
                />
            </div>

            <div className="bs-toolbar">
                <div>
                    <Forms.FormTitle tag="h2">Status presets</Forms.FormTitle>
                    <div className="bs-stats">
                        <span><strong>{presets.length}</strong> total</span>
                        <span><strong>{enabledCount}</strong> active</span>
                        <span><strong>{memoryCount}</strong> memory</span>
                    </div>
                </div>
                <div className="bs-toolbar-actions">
                    <div className="bs-search">
                        <span aria-hidden="true">⌕</span>
                        <TextInput
                            value={searchQuery}
                            placeholder="Search presets"
                            onChange={setSearchQuery}
                        />
                    </div>
                    {!!presets.length && (
                        <button type="button" className="bs-secondary-button" onClick={toggleAllCollapsed}>
                            <ChevronIcon collapsed={!allCollapsed} />
                            {allCollapsed ? "Expand all" : "Collapse all"}
                        </button>
                    )}
                    <Button onClick={addPreset}>+ Add preset</Button>
                </div>
            </div>

            {presets.length === 0
                ? (
                    <div className="bs-empty">
                        <Forms.FormTitle>No presets yet</Forms.FormTitle>
                        <Forms.FormText>Create your first status preset to get started.</Forms.FormText>
                        <Button onClick={addPreset}>Create preset</Button>
                    </div>
                )
                : visiblePresets.length === 0
                    ? (
                        <div className="bs-empty">
                            <Forms.FormTitle>No matching presets</Forms.FormTitle>
                            <Forms.FormText>Try a different name, status, presence, mode, or hotkey.</Forms.FormText>
                            <button type="button" className="bs-secondary-button" onClick={() => setSearchQuery("")}>Clear search</button>
                        </div>
                    )
                    : (
                    <div className="bs-preset-grid">
                        {visiblePresets.map(preset => {
                            const collapsed = collapsedIds.has(preset.id);
                            const contentId = `bs-preset-${preset.id}`;

                            return (
                            <section className={`bs-preset-card bs-presence-${preset.presence}${preset.enabled ? "" : " bs-preset-card-disabled"}${collapsed ? " bs-preset-card-collapsed" : ""}`} key={preset.id}>
                                <header className="bs-card-header">
                                    <div className="bs-card-identity">
                                        <span className="bs-presence-dot" />
                                        <div>
                                            <div className="bs-card-title">
                                                <Forms.FormTitle>{preset.name || "Untitled preset"}</Forms.FormTitle>
                                                <span className={`bs-mode-badge bs-mode-${preset.type}`}>
                                                    {preset.type === "memory" ? "Memory" : "Fixed"}
                                                </span>
                                            </div>
                                            {collapsed && (
                                                <div className="bs-card-summary">
                                                    <span>{preset.type === "memory" ? preset.rememberedText ?? preset.text : preset.text || "No custom status"}</span>
                                                    <span className="bs-hotkey-chip">{preset.hotkey || "No hotkey"}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="bs-card-actions">
                                        <button
                                            type="button"
                                            className="bs-duplicate-button"
                                            title="Create a disabled copy without a hotkey"
                                            onClick={() => duplicatePreset(preset)}
                                        >
                                            Duplicate
                                        </button>
                                        <FormSwitch
                                            title="Enabled"
                                            value={preset.enabled}
                                            onChange={enabled => updatePreset(preset.id, { enabled })}
                                            hideBorder
                                        />
                                        <button
                                            type="button"
                                            className="bs-collapse-button"
                                            aria-controls={contentId}
                                            aria-expanded={!collapsed}
                                            aria-label={`${collapsed ? "Expand" : "Collapse"} ${preset.name || "preset"}`}
                                            title={collapsed ? "Expand preset" : "Collapse preset"}
                                            onClick={() => toggleCollapsed(preset.id)}
                                        >
                                            <ChevronIcon collapsed={collapsed} />
                                        </button>
                                    </div>
                                </header>

                                {!collapsed && <div id={contentId} className="bs-card-content">
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
                                </div>}
                            </section>
                            );
                        })}
                    </div>
                )}
        </div>
    );
}

migratePluginSettings("BetterStatus", "StatusHotkeys");

export const settings = definePluginSettings({
    autoUpdate: {
        type: OptionType.CUSTOM,
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
