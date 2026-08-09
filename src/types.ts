/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export type PresenceStatus = "online" | "idle" | "dnd" | "invisible";
export type PresetType = "fixed" | "memory";
export type UpdateChannel = "prod" | "dev";
export type UpdateCheckFrequency = 0 | 15 | 30 | 60 | 180 | 360 | 720 | 1440;
export type ScheduleRepeat = "once" | "daily" | "weekly";
export type ScheduleEndBehavior = "keep" | "restore" | "preset" | "custom";
export type SyncProvider = "betterstatus" | "custom";

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

export interface SavedStatus {
    id: string;
    text: string;
    favorite: boolean;
    createdAt: number;
    lastUsedAt: number;
    useCount: number;
}

export interface StatusSchedule {
    id: string;
    name: string;
    presetId: string;
    startsAt: number;
    endsAt?: number;
    repeat: ScheduleRepeat;
    endBehavior: ScheduleEndBehavior;
    endPresetId?: string;
    endText?: string;
    endPresence?: PresenceStatus;
    enabled: boolean;
}

export interface SyncDocument {
    version: 1;
    modifiedAt: number;
    presets: StatusPreset[];
    savedStatuses: SavedStatus[];
    schedules: StatusSchedule[];
    activePresetId?: string;
    autoUpdate: boolean;
    autoRestart: boolean;
    updateCheckFrequency: UpdateCheckFrequency;
    updateChannel: UpdateChannel;
}

export interface EncryptedSyncDocument {
    format: "betterstatus-encrypted-sync";
    version: 1;
    kdf: "scrypt";
    cipher: "aes-256-gcm";
    salt: string;
    iv: string;
    authTag: string;
    ciphertext: string;
}
