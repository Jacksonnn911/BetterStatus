/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { RenderModalProps, User } from "@vencord/discord-types";
import { Modal, openModal, React, showToast, TextInput, Toasts, UserStore } from "@webpack/common";

import { normalizeSavedStatuses } from "./savedStatuses";
import { settings } from "./Settings";
import type { SavedStatus } from "./types";

interface SavedStatusesProfileProps {
    user: User;
    onApply(text: string): Promise<void>;
}

function BookmarkIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22">
            <path fill="currentColor" d="M6 3a2 2 0 0 0-2 2v16a1 1 0 0 0 1.55.83L12 17l6.45 4.83A1 1 0 0 0 20 21V5a2 2 0 0 0-2-2H6Zm0 2h12v14l-5.4-4.05a1 1 0 0 0-1.2 0L6 19V5Z" />
        </svg>
    );
}

function ChevronIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M8.3 4.7a1 1 0 0 1 1.4 0l6.6 6.6a1 1 0 0 1 0 1.4l-6.6 6.6a1 1 0 1 1-1.4-1.4l5.9-5.9-5.9-5.9a1 1 0 0 1 0-1.4Z" />
        </svg>
    );
}

function StarIcon({ filled }: { filled: boolean; }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
            <path
                fill={filled ? "currentColor" : "none"}
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m12 3 2.8 5.67 6.2.9-4.5 4.38 1.06 6.18L12 17.2l-5.56 2.93 1.06-6.18L3 9.57l6.2-.9L12 3Z"
            />
        </svg>
    );
}

function TrashIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
            <path fill="currentColor" d="M9 3a2 2 0 0 0-2 2v1H4a1 1 0 1 0 0 2h1l1 12a1 1 0 0 0 1 .92h10a1 1 0 0 0 1-.92L19 8h1a1 1 0 1 0 0-2h-3V5a2 2 0 0 0-2-2H9Zm0 2h6v1H9V5Zm-2 3h10l-.92 11H7.92L7 8Zm3 2a1 1 0 0 0-1 1v5a1 1 0 1 0 2 0v-5a1 1 0 0 0-1-1Zm4 0a1 1 0 0 0-1 1v5a1 1 0 1 0 2 0v-5a1 1 0 0 0-1-1Z" />
        </svg>
    );
}

function SavedStatusesModal({ modalProps, onApply }: { modalProps: RenderModalProps; onApply(text: string): Promise<void>; }) {
    const { savedStatuses } = settings.use(["savedStatuses"]);
    const [query, setQuery] = React.useState("");
    const normalizedQuery = query.trim().toLowerCase();
    const statuses = normalizeSavedStatuses(savedStatuses)
        .sort((a, b) => Number(b.favorite) - Number(a.favorite) || b.lastUsedAt - a.lastUsedAt)
        .filter(status => !normalizedQuery || status.text.toLowerCase().includes(normalizedQuery));

    function updateStatuses(next: SavedStatus[]) {
        settings.store.savedStatuses = normalizeSavedStatuses(next);
    }

    async function applyStatus(status: SavedStatus) {
        await onApply(status.text);
        showToast("Saved status applied", Toasts.Type.SUCCESS);
        modalProps.onClose();
    }

    return (
        <Modal
            {...modalProps}
            size="small"
            title="Saved statuses"
            subtitle={`${savedStatuses.length.toLocaleString()} of 1,000 remembered`}
        >
            <div className="bs-profile-saved-modal">
                <div className="bs-saved-search">
                    <TextInput value={query} placeholder="Search saved statuses" onChange={setQuery} />
                </div>

                <div className="bs-saved-list bs-profile-saved-list">
                    {statuses.length
                        ? statuses.map(status => (
                            <div className="bs-saved-row" key={status.id}>
                                <button type="button" className="bs-saved-select" title={status.text} onClick={() => void applyStatus(status)}>
                                    <span>{status.text}</span>
                                    <small>Used {status.useCount.toLocaleString()} {status.useCount === 1 ? "time" : "times"}</small>
                                </button>
                                <button
                                    type="button"
                                    className={`bs-saved-action bs-saved-favorite${status.favorite ? " bs-saved-favorite-active" : ""}`}
                                    aria-label={`${status.favorite ? "Remove" : "Add"} favorite: ${status.text}`}
                                    title={status.favorite ? "Remove favorite" : "Add favorite"}
                                    onClick={() => updateStatuses(savedStatuses.map(saved => saved.id === status.id
                                        ? { ...saved, favorite: !saved.favorite }
                                        : saved))}
                                >
                                    <StarIcon filled={status.favorite} />
                                </button>
                                <button
                                    type="button"
                                    className="bs-saved-action bs-saved-delete"
                                    aria-label={`Delete saved status: ${status.text}`}
                                    title="Delete saved status"
                                    onClick={() => updateStatuses(savedStatuses.filter(saved => saved.id !== status.id))}
                                >
                                    <TrashIcon />
                                </button>
                            </div>
                        ))
                        : (
                            <div className="bs-saved-empty">
                                <span className="bs-saved-empty-icon"><BookmarkIcon /></span>
                                <strong>{normalizedQuery ? "No matching statuses" : "No saved statuses yet"}</strong>
                                <span>{normalizedQuery ? "Try another search." : "Apply a preset to start building your history."}</span>
                            </div>
                        )}
                </div>
            </div>
        </Modal>
    );
}

export function SavedStatusesProfileRow({ user, onApply }: SavedStatusesProfileProps) {
    const { savedStatuses } = settings.use(["savedStatuses"]);

    if (user.id !== UserStore.getCurrentUser()?.id)
        return null;

    return (
        <button
            type="button"
            className="bs-profile-saved-row"
            onClick={() => openModal(modalProps => <SavedStatusesModal modalProps={modalProps} onApply={onApply} />)}
        >
            <span className="bs-profile-saved-icon"><BookmarkIcon /></span>
            <span className="bs-profile-saved-copy">
                <strong>Saved statuses</strong>
                <small>{savedStatuses.length.toLocaleString()} remembered</small>
            </span>
            <ChevronIcon />
        </button>
    );
}
