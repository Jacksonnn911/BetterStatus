export type PresenceStatus = "online" | "idle" | "dnd" | "invisible";
export type PresetType = "fixed" | "memory";

export interface StatusPreset {
    id: string;
    name: string;
    text: string;
    type: PresetType;
    rememberedText?: string;
    presence: PresenceStatus;
    hotkey: string;
    enabled: boolean;
}
