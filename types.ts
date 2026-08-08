export type PresenceStatus = "online" | "idle" | "dnd" | "invisible";

export interface StatusPreset {
    id: string;
    name: string;
    text: string;
    presence: PresenceStatus;
    hotkey: string;
    enabled: boolean;
}
