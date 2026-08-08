/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { SavedStatus } from "./types";

export const MAX_SAVED_STATUSES = 1000;

function createSavedStatusId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function normalizeSavedStatuses(value: unknown): SavedStatus[] {
    if (!Array.isArray(value))
        return [];

    const byText = new Map<string, SavedStatus>();

    for (const item of value) {
        if (!item || typeof item !== "object")
            continue;

        const candidate = item as Partial<SavedStatus>;
        const text = typeof candidate.text === "string" ? candidate.text.trim() : "";

        if (!text)
            continue;

        const now = Date.now();
        const normalized: SavedStatus = {
            id: typeof candidate.id === "string" && candidate.id ? candidate.id : createSavedStatusId(),
            text,
            favorite: candidate.favorite === true,
            createdAt: Number.isFinite(candidate.createdAt) ? candidate.createdAt! : now,
            lastUsedAt: Number.isFinite(candidate.lastUsedAt) ? candidate.lastUsedAt! : now,
            useCount: Number.isFinite(candidate.useCount) && candidate.useCount! > 0 ? candidate.useCount! : 1
        };
        const existing = byText.get(text);

        if (!existing || normalized.lastUsedAt > existing.lastUsedAt) {
            byText.set(text, {
                ...normalized,
                favorite: normalized.favorite || existing?.favorite === true,
                useCount: Math.max(normalized.useCount, existing?.useCount ?? 1)
            });
        } else if (normalized.favorite) {
            byText.set(text, { ...existing, favorite: true });
        }
    }

    return [...byText.values()]
        .sort((a, b) => Number(b.favorite) - Number(a.favorite) || b.lastUsedAt - a.lastUsedAt)
        .slice(0, MAX_SAVED_STATUSES);
}

export function rememberStatusInLibrary(statuses: SavedStatus[], value: string, now = Date.now()): SavedStatus[] {
    const text = value.trim();

    if (!text)
        return statuses;

    const existing = statuses.find(status => status.text === text);

    if (existing) {
        return statuses.map(status => status.id === existing.id
            ? { ...status, lastUsedAt: now, useCount: status.useCount + 1 }
            : status);
    }

    const nextStatus: SavedStatus = {
        id: createSavedStatusId(),
        text,
        favorite: false,
        createdAt: now,
        lastUsedAt: now,
        useCount: 1
    };

    if (statuses.length < MAX_SAVED_STATUSES)
        return [...statuses, nextStatus];

    const oldestNonFavorite = statuses
        .filter(status => !status.favorite)
        .sort((a, b) => a.lastUsedAt - b.lastUsedAt)[0];

    if (!oldestNonFavorite)
        return statuses;

    return [...statuses.filter(status => status.id !== oldestNonFavorite.id), nextStatus];
}
