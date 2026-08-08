/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { React, TextInput } from "@webpack/common";

import type { PresenceStatus, SavedStatus } from "./types";

interface PresenceDefinition {
    value: PresenceStatus;
    label: string;
    description?: string;
}

const PRESENCES: PresenceDefinition[] = [
    { value: "online", label: "Online" },
    { value: "idle", label: "Idle", description: "You may be away" },
    { value: "dnd", label: "Do Not Disturb", description: "You will not receive desktop notifications" },
    { value: "invisible", label: "Invisible", description: "You will appear offline" }
];

interface StatusSwitcherProps {
    presence: PresenceStatus;
    statusText: string;
    savedStatuses: SavedStatus[];
    onPresenceChange(presence: PresenceStatus): void;
    onSelectSavedStatus(status: SavedStatus): void;
    onSaveCurrentStatus(): void;
    onToggleFavorite(id: string): void;
    onDeleteSavedStatus(id: string): void;
}

function PresenceIcon({ presence }: { presence: PresenceStatus; }) {
    return <span aria-hidden="true" className={`bs-status-indicator bs-status-indicator-${presence}`} />;
}

function ChevronIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M8.3 4.7a1 1 0 0 1 1.4 0l6.6 6.6a1 1 0 0 1 0 1.4l-6.6 6.6a1 1 0 1 1-1.4-1.4l5.9-5.9-5.9-5.9a1 1 0 0 1 0-1.4Z" />
        </svg>
    );
}

function BookmarkIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22">
            <path fill="currentColor" d="M6 3a2 2 0 0 0-2 2v16a1 1 0 0 0 1.55.83L12 17l6.45 4.83A1 1 0 0 0 20 21V5a2 2 0 0 0-2-2H6Zm0 2h12v14l-5.4-4.05a1 1 0 0 0-1.2 0L6 19V5Z" />
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

export function StatusSwitcher({
    presence,
    statusText,
    savedStatuses,
    onPresenceChange,
    onSelectSavedStatus,
    onSaveCurrentStatus,
    onToggleFavorite,
    onDeleteSavedStatus
}: StatusSwitcherProps) {
    const rootRef = React.useRef<HTMLDivElement>(null);
    const [open, setOpen] = React.useState(false);
    const [view, setView] = React.useState<"presence" | "saved">("presence");
    const [query, setQuery] = React.useState("");

    React.useEffect(() => {
        if (!open)
            return;

        const closeOnOutsideClick = (event: MouseEvent) => {
            if (!rootRef.current?.contains(event.target as Node))
                setOpen(false);
        };
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape")
                setOpen(false);
        };

        document.addEventListener("mousedown", closeOnOutsideClick);
        document.addEventListener("keydown", closeOnEscape);
        return () => {
            document.removeEventListener("mousedown", closeOnOutsideClick);
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, [open]);

    const currentPresence = PRESENCES.find(option => option.value === presence)!;
    const normalizedQuery = query.trim().toLowerCase();
    const visibleStatuses = [...savedStatuses]
        .sort((a, b) => Number(b.favorite) - Number(a.favorite) || b.lastUsedAt - a.lastUsedAt)
        .filter(status => !normalizedQuery || status.text.toLowerCase().includes(normalizedQuery));
    const currentIsSaved = savedStatuses.some(status => status.text === statusText.trim());
    const libraryCannotGrow = savedStatuses.length >= 1000 && savedStatuses.every(status => status.favorite);
    const canSaveCurrent = Boolean(statusText.trim()) && !currentIsSaved && !libraryCannotGrow;

    function openPresenceMenu() {
        setView("presence");
        setQuery("");
        setOpen(current => !current);
    }

    return (
        <div className="bs-status-switcher" ref={rootRef}>
            <button
                type="button"
                className="bs-status-trigger"
                aria-expanded={open}
                aria-haspopup="menu"
                onClick={openPresenceMenu}
            >
                <PresenceIcon presence={presence} />
                <span className="bs-status-trigger-copy">
                    <strong>{currentPresence.label}</strong>
                    <small>{currentPresence.description ?? "Available and receiving notifications"}</small>
                </span>
                <ChevronIcon />
            </button>

            {open && (
                <div className="bs-status-menu" role="menu">
                    {view === "presence"
                        ? (
                            <>
                                <div className="bs-status-menu-label">Set presence</div>
                                {PRESENCES.map(option => (
                                    <button
                                        type="button"
                                        role="menuitemradio"
                                        aria-checked={option.value === presence}
                                        className={`bs-status-menu-item${option.value === presence ? " bs-status-menu-item-selected" : ""}`}
                                        key={option.value}
                                        onClick={() => {
                                            onPresenceChange(option.value);
                                            setOpen(false);
                                        }}
                                    >
                                        <PresenceIcon presence={option.value} />
                                        <span className="bs-status-item-copy">
                                            <strong>{option.label}</strong>
                                            {option.description && <small>{option.description}</small>}
                                        </span>
                                        {option.value === presence && <span className="bs-status-check">✓</span>}
                                    </button>
                                ))}

                                <div className="bs-status-menu-divider" />
                                <button
                                    type="button"
                                    role="menuitem"
                                    className="bs-status-menu-item bs-saved-statuses-entry"
                                    onClick={() => setView("saved")}
                                >
                                    <span className="bs-saved-status-icon"><BookmarkIcon /></span>
                                    <span className="bs-status-item-copy">
                                        <strong>Saved statuses</strong>
                                        <small>{savedStatuses.length.toLocaleString()} remembered · up to 1,000</small>
                                    </span>
                                    <ChevronIcon />
                                </button>
                            </>
                        )
                        : (
                            <>
                                <div className="bs-saved-header">
                                    <button type="button" className="bs-saved-back" aria-label="Back to presence selection" onClick={() => setView("presence")}>
                                        <ChevronIcon />
                                    </button>
                                    <div>
                                        <strong>Saved statuses</strong>
                                        <small>{savedStatuses.length.toLocaleString()} of 1,000</small>
                                    </div>
                                </div>

                                <div className="bs-saved-current">
                                    <span title={statusText || "No custom status"}>{statusText || "No custom status to save"}</span>
                                    <button type="button" className="bs-save-current" disabled={!canSaveCurrent} onClick={onSaveCurrentStatus}>
                                        {currentIsSaved ? "Saved" : "Save current"}
                                    </button>
                                </div>

                                <div className="bs-saved-search">
                                    <TextInput value={query} placeholder="Search saved statuses" onChange={setQuery} />
                                </div>

                                <div className="bs-saved-list">
                                    {visibleStatuses.length
                                        ? visibleStatuses.map(status => (
                                            <div className="bs-saved-row" key={status.id}>
                                                <button
                                                    type="button"
                                                    className="bs-saved-select"
                                                    title={status.text}
                                                    onClick={() => {
                                                        onSelectSavedStatus(status);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    <span>{status.text}</span>
                                                    <small>Used {status.useCount.toLocaleString()} {status.useCount === 1 ? "time" : "times"}</small>
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`bs-saved-action bs-saved-favorite${status.favorite ? " bs-saved-favorite-active" : ""}`}
                                                    aria-label={`${status.favorite ? "Remove" : "Add"} favorite: ${status.text}`}
                                                    title={status.favorite ? "Remove favorite" : "Add favorite"}
                                                    onClick={() => onToggleFavorite(status.id)}
                                                >
                                                    <StarIcon filled={status.favorite} />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="bs-saved-action bs-saved-delete"
                                                    aria-label={`Delete saved status: ${status.text}`}
                                                    title="Delete saved status"
                                                    onClick={() => onDeleteSavedStatus(status.id)}
                                                >
                                                    <TrashIcon />
                                                </button>
                                            </div>
                                        ))
                                        : (
                                            <div className="bs-saved-empty">
                                                <span className="bs-saved-empty-icon"><BookmarkIcon /></span>
                                                <strong>{normalizedQuery ? "No matching statuses" : "No saved statuses yet"}</strong>
                                                <span>{normalizedQuery ? "Try another search." : "Applied statuses appear here automatically."}</span>
                                            </div>
                                        )}
                                </div>

                                {libraryCannotGrow && !currentIsSaved && (
                                    <div className="bs-saved-limit">All 1,000 saved statuses are favorites. Remove a favorite to save another.</div>
                                )}
                            </>
                        )}
                </div>
            )}
        </div>
    );
}
