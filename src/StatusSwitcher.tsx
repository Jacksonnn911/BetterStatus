/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { React } from "@webpack/common";

import type { PresenceStatus } from "./types";

interface PresenceDefinition {
  value: PresenceStatus;
  label: string;
  description?: string;
}

const PRESENCES: PresenceDefinition[] = [
  { value: "online", label: "Online" },
  { value: "idle", label: "Idle", description: "You may be away" },
  {
    value: "dnd",
    label: "Do Not Disturb",
    description: "You will not receive desktop notifications",
  },
  {
    value: "invisible",
    label: "Invisible",
    description: "You will appear offline",
  },
];

interface StatusSwitcherProps {
  presence: PresenceStatus;
  onPresenceChange(presence: PresenceStatus): void;
}

function PresenceIcon({ presence }: { presence: PresenceStatus }) {
  return (
    <span
      aria-hidden="true"
      className={`bs-status-indicator bs-status-indicator-${presence}`}
    />
  );
}

function ChevronIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
      <path
        fill="currentColor"
        d="M8.3 4.7a1 1 0 0 1 1.4 0l6.6 6.6a1 1 0 0 1 0 1.4l-6.6 6.6a1 1 0 1 1-1.4-1.4l5.9-5.9-5.9-5.9a1 1 0 0 1 0-1.4Z"
      />
    </svg>
  );
}

export function StatusSwitcher({
  presence,
  onPresenceChange,
}: StatusSwitcherProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const currentPresence = PRESENCES.find(
    option => option.value === presence,
  )!;

  return (
    <div className="bs-status-switcher" ref={rootRef}>
      <button
        type="button"
        className="bs-status-trigger"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen(current => !current)}
      >
        <PresenceIcon presence={presence} />
        <span className="bs-status-trigger-copy">
          <strong>{currentPresence.label}</strong>
          <small>
            {currentPresence.description ??
              "Available and receiving notifications"}
          </small>
        </span>
        <ChevronIcon />
      </button>

      {open && (
        <div className="bs-status-menu" role="menu">
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
              {option.value === presence && (
                <span className="bs-status-check">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
