/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export type PresenceStatus = "online" | "idle" | "dnd" | "invisible";
export type PresetType = "fixed" | "memory";
export type UpdateChannel = "production" | "dev";

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
