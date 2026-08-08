import { Button, Forms, React, Select, Switch, TextInput } from "@webpack/common";

import { getPresets, savePresets } from "./index";
import type { PresenceStatus, PresetType, StatusPreset } from "./types";


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


    let key = event.key;

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
    const [presets, setPresets] =
        React.useState<StatusPreset[]>(() =>
            [...getPresets()]
        );

    const [recordingId, setRecordingId] =
        React.useState<string | null>(null);


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
            <Forms.FormTitle tag="h2">
                Status Hotkeys
            </Forms.FormTitle>

            <Forms.FormText>
                Create Discord status presets and assign global
                keyboard shortcuts to them.
            </Forms.FormText>


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
                    <Forms.FormTitle>
                        {preset.name || "Unnamed Status"}
                    </Forms.FormTitle>


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


                    <Switch
                        value={preset.enabled}
                        onChange={value =>
                            updatePreset(
                                preset.id,
                                {
                                    enabled: value
                                }
                            )
                        }
                    >
                        Enabled
                    </Switch>


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
