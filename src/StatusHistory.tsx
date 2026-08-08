/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { getUserSettingLazy } from "@api/UserSettings";
import { createRoot, React, TextInput } from "@webpack/common";

import { normalizeSavedStatuses } from "./savedStatuses";
import { getSavedStatuses, rememberSavedStatus, settings } from "./Settings";
import type { SavedStatus } from "./types";

interface MountedHistory {
    host: HTMLElement;
    initialText: string;
    modal: Element;
    recordedText?: string;
    root: ReturnType<typeof createRoot>;
    saveListener: (event: Event) => void;
}

interface CustomStatus {
    text?: string;
}

const CustomStatusSettings =
    getUserSettingLazy<CustomStatus>("status", "customStatus")!;

const mountedHistories = new Map<HTMLTextAreaElement, MountedHistory>();
let modalObserver: MutationObserver | undefined;

function StarIcon({ filled }: { filled: boolean; }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
            <path
                fill={filled ? "currentColor" : "none"}
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m12 2.8 2.8 5.68 6.27.91-4.54 4.43 1.07 6.25L12 17.12l-5.6 2.95 1.07-6.25-4.54-4.43 6.27-.91L12 2.8Z"
            />
        </svg>
    );
}

function TrashIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
            <path fill="currentColor" d="M9 3a1 1 0 0 0-.9.55L7.38 5H4a1 1 0 1 0 0 2h1l.72 12.08A2 2 0 0 0 7.72 21h8.56a2 2 0 0 0 2-1.92L19 7h1a1 1 0 1 0 0-2h-3.38l-.72-1.45A1 1 0 0 0 15 3H9Zm1.62 2h2.76l.5 1h-3.76l.5-1ZM8 9a1 1 0 0 1 1 1v7a1 1 0 1 1-2 0v-7a1 1 0 0 1 1-1Zm4 0a1 1 0 0 1 1 1v7a1 1 0 1 1-2 0v-7a1 1 0 0 1 1-1Zm4 0a1 1 0 0 1 1 1v7a1 1 0 1 1-2 0v-7a1 1 0 0 1 1-1Z" />
        </svg>
    );
}

function applyStatusToDiscordInput(textarea: HTMLTextAreaElement, text: string) {
    const valueSetter = Object.getOwnPropertyDescriptor(
        HTMLTextAreaElement.prototype,
        "value"
    )?.set;

    valueSetter?.call(textarea, text);
    textarea.dispatchEvent(new InputEvent("input", {
        bubbles: true,
        inputType: "insertText",
        data: text
    }));
    textarea.focus();
    textarea.setSelectionRange(text.length, text.length);
}

function updateSavedStatus(id: string, patch: Partial<SavedStatus>) {
    settings.store.savedStatuses = getSavedStatuses().map(status =>
        status.id === id ? { ...status, ...patch } : status
    );
}

function removeSavedStatus(id: string) {
    settings.store.savedStatuses = getSavedStatuses().filter(status => status.id !== id);
}

function StatusHistory({ textarea }: { textarea: HTMLTextAreaElement; }) {
    const { savedStatuses } = settings.use(["savedStatuses"]);
    const [query, setQuery] = React.useState("");
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const statuses = React.useMemo(
        () => normalizeSavedStatuses(savedStatuses),
        [savedStatuses]
    );
    const filtered = React.useMemo(
        () => normalizedQuery
            ? statuses.filter(status => status.text.toLocaleLowerCase().includes(normalizedQuery))
            : statuses,
        [normalizedQuery, statuses]
    );
    const visible = filtered.slice(0, 100);

    return (
        <div className="bs-history-card">
            <div className="bs-history-heading">
                <div>
                    <h2>Saved statuses</h2>
                    <p>{statuses.length.toLocaleString()} remembered · up to 1,000</p>
                </div>
                {statuses.length > 0 && (
                    <span className="bs-history-count" aria-label={`${filtered.length} matching statuses`}>
                        {filtered.length}
                    </span>
                )}
            </div>

            {statuses.length > 0 && (
                <div className="bs-history-search">
                    <TextInput
                        value={query}
                        placeholder="Search saved statuses"
                        aria-label="Search saved statuses"
                        onChange={setQuery}
                    />
                </div>
            )}

            {visible.length > 0 ? (
                <div className="bs-history-list" role="list">
                    {visible.map(status => (
                        <div className="bs-history-row" role="listitem" key={status.id}>
                            <button
                                type="button"
                                className="bs-history-status"
                                title={`Use ${status.text}`}
                                onClick={() => applyStatusToDiscordInput(textarea, status.text)}
                            >
                                <span>{status.text}</span>
                                <small>Used {status.useCount.toLocaleString()} {status.useCount === 1 ? "time" : "times"}</small>
                            </button>
                            <button
                                type="button"
                                className={`bs-history-icon-button${status.favorite ? " bs-history-favorite" : ""}`}
                                aria-label={`${status.favorite ? "Remove" : "Add"} ${status.text} ${status.favorite ? "from" : "to"} favorites`}
                                title={status.favorite ? "Remove from favorites" : "Add to favorites"}
                                onClick={() => updateSavedStatus(status.id, { favorite: !status.favorite })}
                            >
                                <StarIcon filled={status.favorite} />
                            </button>
                            <button
                                type="button"
                                className="bs-history-icon-button bs-history-delete"
                                aria-label={`Delete ${status.text}`}
                                title="Delete saved status"
                                onClick={() => removeSavedStatus(status.id)}
                            >
                                <TrashIcon />
                            </button>
                        </div>
                    ))}
                    {filtered.length > visible.length && (
                        <div className="bs-history-more">
                            {filtered.length - visible.length} more — refine your search to find them
                        </div>
                    )}
                </div>
            ) : (
                <div className="bs-history-empty">
                    {statuses.length === 0
                        ? "Statuses you save in this dialog will appear here."
                        : "No saved statuses match your search."}
                </div>
            )}
        </div>
    );
}

function findModalSection(textarea: HTMLTextAreaElement) {
    const main = textarea.closest("main");
    if (!main)
        return undefined;

    let section: HTMLElement | null = textarea;
    while (section?.parentElement && section.parentElement !== main)
        section = section.parentElement;

    return section?.parentElement === main ? section : undefined;
}

function cleanupRemovedHistories() {
    for (const [textarea, mounted] of mountedHistories) {
        if (mounted.host.isConnected)
            continue;

        const draft = textarea.value.trim();
        if (draft && draft !== mounted.initialText && draft !== mounted.recordedText) {
            window.setTimeout(() => {
                if (CustomStatusSettings.getSetting()?.text?.trim() === draft)
                    rememberSavedStatus(draft);
            }, 300);
        }

        mounted.modal.removeEventListener("click", mounted.saveListener, true);
        mounted.root.unmount();
        mountedHistories.delete(textarea);
    }
}

function mountHistory(textarea: HTMLTextAreaElement) {
    if (mountedHistories.has(textarea))
        return;

    const section = findModalSection(textarea);
    const modal = textarea.closest('[data-mana-component="modal"]');
    if (!section || !modal)
        return;

    const host = document.createElement("section");
    host.className = "bs-status-history";
    host.setAttribute("aria-label", "Saved statuses");
    section.insertAdjacentElement("afterend", host);

    const saveListener = (event: Event) => {
        const { target } = event;
        if (!(target instanceof Element))
            return;

        const button = target.closest("button");
        if (button?.closest("footer")) {
            const text = textarea.value.trim();
            rememberSavedStatus(text);
            const mounted = mountedHistories.get(textarea);
            if (mounted)
                mounted.recordedText = text;
        }
    };

    modal.addEventListener("click", saveListener, true);

    const root = createRoot(host);
    const mounted: MountedHistory = {
        host,
        initialText: textarea.value.trim(),
        modal,
        root,
        saveListener
    };
    mountedHistories.set(textarea, mounted);
    root.render(<StatusHistory textarea={textarea} />);
}

function scanForStatusModal(root: ParentNode) {
    if (root instanceof HTMLTextAreaElement && root.id === "custom-status-input")
        mountHistory(root);

    root.querySelectorAll<HTMLTextAreaElement>("textarea#custom-status-input").forEach(mountHistory);
}

export function startStatusHistoryModalObserver() {
    stopStatusHistoryModalObserver();
    scanForStatusModal(document);

    modalObserver = new MutationObserver(records => {
        for (const record of records) {
            for (const node of record.addedNodes) {
                if (node instanceof Element)
                    scanForStatusModal(node);
            }
        }

        queueMicrotask(cleanupRemovedHistories);
    });
    modalObserver.observe(document.body, { childList: true, subtree: true });
}

export function stopStatusHistoryModalObserver() {
    modalObserver?.disconnect();
    modalObserver = undefined;

    for (const mounted of mountedHistories.values()) {
        mounted.modal.removeEventListener("click", mounted.saveListener, true);
        mounted.root.unmount();
        mounted.host.remove();
    }
    mountedHistories.clear();
}
