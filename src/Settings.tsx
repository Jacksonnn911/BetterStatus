/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./styles.css";

import { showNotification } from "@api/Notifications";
import { definePluginSettings, migratePluginSettings } from "@api/Settings";
import { FormSwitch } from "@components/FormSwitch";
import { Link } from "@components/Link";
import { relaunch } from "@utils/native";
import { OptionType, PluginNative } from "@utils/types";
import type { RenderModalProps } from "@vencord/discord-types";
import {
  Button,
  ConfirmModal,
  Forms,
  openModal,
  React,
  Select,
  TextInput,
} from "@webpack/common";

import {
  normalizeSavedStatuses,
  rememberStatusInLibrary,
} from "./savedStatuses";
import { StatusSwitcher } from "./StatusSwitcher";
import type {
  PresenceStatus,
  PresetType,
  SavedStatus,
  ScheduleEndBehavior,
  ScheduleRepeat,
  ScheduleStartBehavior,
  StatusPreset,
  StatusSchedule,
  SyncDocument,
  SyncProvider,
  UpdateChannel,
  UpdateCheckFrequency,
} from "./types";

const Native = VencordNative.pluginHelpers.BetterStatus as PluginNative<
  typeof import("./native")
>;

interface BetterStatusRuntime {
  changeCloudEncryptionPassword(password?: string): Promise<void>;
  configureCloudSync(): Promise<void>;
  configureSchedules(): void;
  configureUpdateChecks(checkNow?: boolean, retryAt?: number): void;
  unlockCloudSyncPassword(password: string): Promise<void>;
}

function pluginRuntime() {
  return Vencord.Plugins.plugins.BetterStatus as unknown as BetterStatusRuntime;
}

let syncPasswordPromptOpen = false;

const AUTO_RESTART_WINDOW_MS = 5 * 60_000;
const AUTO_RESTART_COOLDOWN_MS = 60 * 60_000;
let autoRestartScheduledThisProcess = false;

export interface AutoRestartGuardState {
  newlyPaused: boolean;
  pausedUntil?: number;
}

export function initializeAutoRestartGuard(now = Date.now()): AutoRestartGuardState {
  const existingPause = settings.store.autoRestartPausedUntil;
  if (typeof existingPause === "number" && existingPause > now)
    return { newlyPaused: false, pausedUntil: existingPause };

  if (existingPause !== undefined)
    settings.store.autoRestartPausedUntil = undefined;

  const history = (settings.store.autoRestartHistory ?? [])
    .filter(timestamp =>
      Number.isFinite(timestamp) &&
      timestamp <= now &&
      timestamp >= now - AUTO_RESTART_WINDOW_MS,
    )
    .sort((left, right) => left - right)
    .slice(-2);

  settings.store.autoRestartHistory = history;
  if (history.length < 2)
    return { newlyPaused: false };

  const pausedUntil = history[history.length - 1] + AUTO_RESTART_COOLDOWN_MS;
  if (pausedUntil <= now) {
    settings.store.autoRestartHistory = [];
    return { newlyPaused: false };
  }

  settings.store.autoRestartPausedUntil = pausedUntil;
  return { newlyPaused: true, pausedUntil };
}

/** Reserve one updater-triggered relaunch and reject it when loop protection is active. */
export function prepareAutoRestart(now = Date.now()) {
  if (!settings.store.autoRestart || autoRestartScheduledThisProcess)
    return false;

  const guard = initializeAutoRestartGuard(now);
  if (guard.pausedUntil !== undefined)
    return false;

  settings.store.autoRestartHistory = [
    ...(settings.store.autoRestartHistory ?? []),
    now,
  ]
    .filter(timestamp => timestamp >= now - AUTO_RESTART_WINDOW_MS)
    .slice(-2);
  autoRestartScheduledThisProcess = true;
  return true;
}

function formatAutoRestartPause(pausedUntil: number) {
  return new Date(pausedUntil).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function SyncPasswordModal({
  modalProps,
  onUnlock,
}: {
  modalProps: RenderModalProps;
  onUnlock(password: string): Promise<void>;
}) {
  const [password, setPassword] = React.useState("");

  return (
    <ConfirmModal
      {...modalProps}
      title="Unlock BetterStatus sync"
      confirmText="Unlock"
      cancelText="Not now"
      variant="primary"
      onCancel={() => (syncPasswordPromptOpen = false)}
      onConfirm={async setError => {
        try {
          await onUnlock(password);
          syncPasswordPromptOpen = false;
        } catch (error) {
          setError(error instanceof Error ? error.message : String(error));
          throw error;
        }
      }}
    >
      <div className="bs-password-modal">
        <Forms.FormText>
          This account contains client-side encrypted configuration. Enter its
          sync password to decrypt it on this device. The password is never sent
          to the sync server.
        </Forms.FormText>
        <input
          autoFocus
          className="bs-password-input"
          type="password"
          value={password}
          placeholder="Sync password"
          onChange={event => setPassword(event.currentTarget.value)}
        />
      </div>
    </ConfirmModal>
  );
}

export function requestSyncPassword(onUnlock: (password: string) => Promise<void>) {
  if (syncPasswordPromptOpen) return;
  syncPasswordPromptOpen = true;
  openModal(modalProps => <SyncPasswordModal modalProps={modalProps} onUnlock={onUnlock} />);
}

function CloudProtectionModal({
  modalProps,
  changing,
  onSave,
}: {
  modalProps: RenderModalProps;
  changing: boolean;
  onSave(password: string): Promise<void>;
}) {
  const [password, setPassword] = React.useState("");
  const [confirmation, setConfirmation] = React.useState("");

  return (
    <ConfirmModal
      {...modalProps}
      title={changing ? "Change sync password" : "Protect cloud sync"}
      confirmText={changing ? "Change password" : "Encrypt sync"}
      cancelText="Cancel"
      variant="primary"
      onConfirm={async setError => {
        if (password.length < 12) {
          setError("Use at least 12 characters.");
          throw new Error("Sync password is too short.");
        }
        if (password !== confirmation) {
          setError("The passwords do not match.");
          throw new Error("Sync passwords do not match.");
        }
        try {
          await onSave(password);
        } catch (error) {
          setError(error instanceof Error ? error.message : String(error));
          throw error;
        }
      }}
    >
      <div className="bs-password-modal">
        <Forms.FormText>
          BetterStatus will encrypt the complete configuration on this device
          before uploading it. Other clients must enter the same password.
          Forgotten passwords cannot be recovered by the server.
        </Forms.FormText>
        <input
          autoFocus
          className="bs-password-input"
          type="password"
          value={password}
          placeholder="New password · at least 12 characters"
          onChange={event => setPassword(event.currentTarget.value)}
        />
        <input
          className="bs-password-input"
          type="password"
          value={confirmation}
          placeholder="Confirm password"
          onChange={event => setConfirmation(event.currentTarget.value)}
        />
      </div>
    </ConfirmModal>
  );
}

interface UpdateInfo {
  channel: UpdateChannel;
  installedChannel?: UpdateChannel;
  installedVersion?: string;
  latestVersion: string;
  status: "current" | "updateAvailable" | "restartRequired";
}

interface UpdateFailure {
  error?: string;
  retryAt?: number;
}

let lastRateLimitNotificationRetryAt = 0;
let forcedUpdateInProgress = false;

async function forceUpdateFromNotification(channel: UpdateChannel) {
  if (forcedUpdateInProgress) return;
  forcedUpdateInProgress = true;

  try {
    const result = await Native.checkForUpdates(true, channel, true);
    if (result.status === "updated") {
      const willRestart = prepareAutoRestart();
      showNotification({
        title: "BetterStatus force update installed",
        body: willRestart
          ? "Discord will restart automatically."
          : settings.store.autoRestart
            ? "Automatic restart is temporarily paused. Restart Discord manually."
            : "Restart Discord to use the reinstalled version.",
      });
      if (willRestart) window.setTimeout(relaunch, 1_500);
      return;
    }

    if (result.status === "current") {
      showNotification({
        title: "BetterStatus force update completed",
        body: "The selected channel files were verified. No restart is required.",
      });
      return;
    }

    showUpdateFailureNotification(result, channel);
  } catch (error) {
    showUpdateFailureNotification({
      error: error instanceof Error ? error.message : String(error),
    }, channel);
  } finally {
    forcedUpdateInProgress = false;
  }
}

export function showUpdateFailureNotification(
  failure: UpdateFailure,
  channel: UpdateChannel = getUpdateChannel(),
) {
  const isRateLimited = failure.retryAt !== undefined;
  if (isRateLimited && failure.retryAt === lastRateLimitNotificationRetryAt)
    return;

  if (isRateLimited)
    lastRateLimitNotificationRetryAt = failure.retryAt!;

  showNotification({
    title: isRateLimited
      ? "BetterStatus update checks paused"
      : "BetterStatus update failed",
    body: failure.error ?? "Run the BetterStatus installer to update manually.",
    richBody: (
      <div className="bs-update-failure-notification">
        <div>{failure.error ?? "Run the BetterStatus installer to update manually."}</div>
        <span
          className="bs-force-update-notification-button"
          role="button"
          tabIndex={0}
          onClick={event => {
            event.preventDefault();
            event.stopPropagation();
            void forceUpdateFromNotification(channel);
          }}
          onKeyDown={event => {
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            event.stopPropagation();
            void forceUpdateFromNotification(channel);
          }}
        >
          Force update
        </span>
      </div>
    ),
    dismissOnClick: false,
    noPersist: isRateLimited,
  });
}

type BackupPlatform = "macos" | "windows" | "linux" | "unknown";

interface BetterStatusBackup {
  format: "betterstatus-backup";
  version: 1;
  exportedAt: string;
  platform: BackupPlatform;
  settings: {
    presets: StatusPreset[];
    savedStatuses: SavedStatus[];
    schedules: StatusSchedule[];
    activePresetId?: string;
    autoUpdate: boolean;
    autoRestart: boolean;
    updateCheckFrequency: UpdateCheckFrequency;
    updateChannel: UpdateChannel;
  };
}

const MAX_BACKUP_BYTES = 2 * 1024 * 1024;
const PRESENCE_VALUES = new Set(["online", "idle", "dnd", "invisible"]);

function currentPlatform(): BackupPlatform {
  const platform = navigator.platform.toLowerCase();

  if (platform.includes("mac")) return "macos";
  if (platform.includes("win")) return "windows";
  if (platform.includes("linux")) return "linux";

  return "unknown";
}

function validateBackup(value: unknown): BetterStatusBackup {
  if (!value || typeof value !== "object")
    throw new Error("This file does not contain a BetterStatus backup.");

  const backup = value as Partial<BetterStatusBackup>;
  if (backup.format !== "betterstatus-backup" || backup.version !== 1)
    throw new Error("This BetterStatus backup format is not supported.");
  if (!backup.settings || typeof backup.settings !== "object")
    throw new Error("The backup does not contain settings.");

  const source = backup.settings as Partial<BetterStatusBackup["settings"]>;
  if (!Array.isArray(source.presets) || !Array.isArray(source.savedStatuses))
    throw new Error("The backup is missing presets or saved statuses.");
  if (source.presets.length > 10_000)
    throw new Error("The backup contains too many presets.");

  const ids = new Set<string>();
  const presets = source.presets.map((value, index): StatusPreset => {
    if (!value || typeof value !== "object")
      throw new Error(`Preset ${index + 1} is invalid.`);

    const preset = value as Partial<StatusPreset>;
    if (typeof preset.id !== "string" || !preset.id || preset.id.length > 200 || ids.has(preset.id))
      throw new Error(`Preset ${index + 1} has an invalid or duplicate ID.`);
    if (typeof preset.name !== "string" || typeof preset.text !== "string" || typeof preset.hotkey !== "string")
      throw new Error(`Preset ${index + 1} contains invalid text fields.`);
    if (preset.name.length > 500 || preset.text.length > 10_000 || preset.hotkey.length > 200)
      throw new Error(`Preset ${index + 1} contains an oversized field.`);
    if (preset.type !== "fixed" && preset.type !== "memory")
      throw new Error(`Preset ${index + 1} has an invalid behavior.`);
    if (!PRESENCE_VALUES.has(preset.presence ?? ""))
      throw new Error(`Preset ${index + 1} has an invalid presence.`);
    if (typeof preset.enabled !== "boolean")
      throw new Error(`Preset ${index + 1} has an invalid enabled state.`);
    if (preset.rememberedText !== undefined && typeof preset.rememberedText !== "string")
      throw new Error(`Preset ${index + 1} has invalid Memory text.`);

    ids.add(preset.id);
    return {
      id: preset.id,
      name: preset.name,
      text: preset.text,
      type: preset.type,
      rememberedText: preset.rememberedText,
      presence: preset.presence as StatusPreset["presence"],
      hotkey: preset.hotkey,
      enabled: preset.enabled,
    };
  });

  const savedStatuses = normalizeSavedStatuses(source.savedStatuses);
  const schedules = validateSchedules(source.schedules ?? [], ids);
  const updateChannel: UpdateChannel = source.updateChannel === "dev" ? "dev" : "prod";
  const updateCheckFrequency = normalizeUpdateCheckFrequency(source.updateCheckFrequency);
  const activePresetId = typeof source.activePresetId === "string" && ids.has(source.activePresetId)
    ? source.activePresetId
    : undefined;

  return {
    format: "betterstatus-backup",
    version: 1,
    exportedAt: typeof backup.exportedAt === "string" ? backup.exportedAt : new Date(0).toISOString(),
    platform: ["macos", "windows", "linux"].includes(backup.platform ?? "")
      ? backup.platform as BackupPlatform
      : "unknown",
    settings: {
      presets,
      savedStatuses,
      schedules,
      activePresetId,
      autoUpdate: source.autoUpdate !== false,
      autoRestart: source.autoRestart === true,
      updateCheckFrequency,
      updateChannel,
    },
  };
}

const DEFAULT_PRESETS: StatusPreset[] = [
  {
    id: "sleeping",
    name: "Sleeping",
    text: "I'm sleeping 👅",
    type: "fixed",
    presence: "dnd",
    hotkey: "Command+-",
    enabled: true,
  },
  {
    id: "normal",
    name: "Normal",
    text: "Every end has a new beginning...",
    type: "fixed",
    presence: "online",
    hotkey: "Command+=",
    enabled: true,
  },
];

const TYPE_OPTIONS = [
  {
    label: "Fixed",
    value: "fixed",
  },
  {
    label: "Memory",
    value: "memory",
  },
];

const UPDATE_CHANNEL_OPTIONS = [
  {
    label: "Production (recommended)",
    value: "prod",
  },
  {
    label: "Development",
    value: "dev",
  },
];

const UPDATE_FREQUENCY_OPTIONS: Array<{
  label: string;
  value: UpdateCheckFrequency;
}> = [
  { label: "Every 15 minutes", value: 15 },
  { label: "Every 30 minutes", value: 30 },
  { label: "Every hour", value: 60 },
  { label: "Every 3 hours", value: 180 },
  { label: "Every 6 hours (recommended)", value: 360 },
  { label: "Every 12 hours", value: 720 },
  { label: "Every day", value: 1440 },
  { label: "On startup only", value: 0 },
];

const SCHEDULE_REPEAT_OPTIONS = [
  { label: "Once", value: "once" },
  { label: "Every day", value: "daily" },
  { label: "Weekdays", value: "weekdays" },
  { label: "Weekends", value: "weekends" },
  { label: "Every week", value: "weekly" },
  { label: "Specific days", value: "custom" },
];

const WEEKDAY_OPTIONS = [
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
  { label: "Sun", value: 0 },
];

const SCHEDULE_REPEAT_VALUES = new Set<ScheduleRepeat>([
  "once", "daily", "weekdays", "weekends", "weekly", "custom",
]);

const SCHEDULE_END_OPTIONS = [
  { label: "Keep scheduled status", value: "keep" },
  { label: "Restore previous status", value: "restore" },
  { label: "Activate another preset", value: "preset" },
  { label: "Set a custom status", value: "custom" },
];

const SCHEDULE_START_OPTIONS = [
  { label: "Activate a preset", value: "preset" },
  { label: "Set a custom status", value: "custom" },
];

const SYNC_PROVIDER_OPTIONS = [
  { label: "BetterStatus Cloud", value: "betterstatus" },
  { label: "Self-hosted server", value: "custom" },
];

export function getSyncServerURL() {
  return settings.store.syncProvider === "custom"
    ? settings.store.syncServerUrl.trim()
    : "https://betterstatus.misaliba.eu";
}

function validateSchedules(value: unknown, presetIds: Set<string>): StatusSchedule[] {
  if (!Array.isArray(value) || value.length > 1_000)
    throw new Error("The backup contains invalid schedules.");

  const ids = new Set<string>();
  return value.map((entry, index) => {
    const schedule = entry as Partial<StatusSchedule>;
    if (!schedule || typeof schedule !== "object" || typeof schedule.id !== "string" || !schedule.id || ids.has(schedule.id))
      throw new Error(`Schedule ${index + 1} has an invalid or duplicate ID.`);
    if (typeof schedule.name !== "string" || schedule.name.length > 500)
      throw new Error(`Schedule ${index + 1} has an invalid name.`);
    const startBehavior: ScheduleStartBehavior = schedule.startBehavior === "custom" ? "custom" : "preset";
    if (startBehavior === "preset" && (typeof schedule.presetId !== "string" || !presetIds.has(schedule.presetId)))
      throw new Error(`Schedule ${index + 1} references a missing preset.`);
    if (typeof schedule.startsAt !== "number" || !Number.isFinite(schedule.startsAt))
      throw new Error(`Schedule ${index + 1} has an invalid start time.`);
    if (!SCHEDULE_REPEAT_VALUES.has(schedule.repeat as ScheduleRepeat))
      throw new Error(`Schedule ${index + 1} has an invalid recurrence.`);

    const repeatDays = [...new Set((schedule.repeatDays ?? [])
      .filter(day => Number.isInteger(day) && day >= 0 && day <= 6))]
      .sort((left, right) => left - right);
    if (schedule.repeat === "custom" && repeatDays.length === 0)
      repeatDays.push(new Date(schedule.startsAt).getDay());

    const endBehavior: ScheduleEndBehavior = ["keep", "restore", "preset", "custom"].includes(schedule.endBehavior ?? "")
      ? schedule.endBehavior as ScheduleEndBehavior
      : "keep";
    const endsAt = typeof schedule.endsAt === "number" && Number.isFinite(schedule.endsAt) && schedule.endsAt > schedule.startsAt
      ? schedule.endsAt
      : undefined;
    if (endBehavior === "preset" && schedule.endPresetId && !presetIds.has(schedule.endPresetId))
      throw new Error(`Schedule ${index + 1} references a missing end preset.`);
    if (schedule.endPresence !== undefined && !PRESENCE_VALUES.has(schedule.endPresence))
      throw new Error(`Schedule ${index + 1} has an invalid end presence.`);
    if (schedule.startPresence !== undefined && !PRESENCE_VALUES.has(schedule.startPresence))
      throw new Error(`Schedule ${index + 1} has an invalid start presence.`);

    ids.add(schedule.id);
    return {
      id: schedule.id,
      name: schedule.name,
      startBehavior,
      presetId: schedule.presetId,
      startText: typeof schedule.startText === "string" ? schedule.startText.slice(0, 10_000) : "",
      startPresence: schedule.startPresence && PRESENCE_VALUES.has(schedule.startPresence)
        ? schedule.startPresence
        : "online",
      startsAt: schedule.startsAt,
      endsAt,
      repeat: schedule.repeat as ScheduleRepeat,
      repeatDays,
      endBehavior,
      endPresetId: schedule.endPresetId,
      endText: typeof schedule.endText === "string" ? schedule.endText.slice(0, 10_000) : "",
      endPresence: schedule.endPresence && PRESENCE_VALUES.has(schedule.endPresence)
        ? schedule.endPresence
        : "online",
      enabled: schedule.enabled !== false,
    };
  });
}

function toLocalDateTime(value: number) {
  const date = new Date(value - new Date(value).getTimezoneOffset() * 60_000);
  return date.toISOString().slice(0, 16);
}

function dateInputValue(value: number) {
  return toLocalDateTime(value).slice(0, 10);
}

function timeInputValue(value: number) {
  return toLocalDateTime(value).slice(11, 16);
}

function updateLocalDateTime(current: number, date?: string, time?: string) {
  const currentDate = new Date(current);
  const nextDate = date ?? dateInputValue(current);
  const nextTime = time ?? timeInputValue(current);
  const next = new Date(`${nextDate}T${nextTime}`);
  return Number.isFinite(next.getTime()) ? next.getTime() : currentDate.getTime();
}

function scheduleOccursOnDay(schedule: StatusSchedule, day: Date) {
  const start = new Date(schedule.startsAt);
  const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime();
  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  if (dayStart < startDay) return false;
  if (schedule.repeat === "daily") return true;
  if (schedule.repeat === "weekdays") return day.getDay() >= 1 && day.getDay() <= 5;
  if (schedule.repeat === "weekends") return day.getDay() === 0 || day.getDay() === 6;
  if (schedule.repeat === "weekly") return day.getDay() === start.getDay();
  if (schedule.repeat === "custom") return (schedule.repeatDays ?? []).includes(day.getDay());
  return dayStart === startDay;
}

function scheduleRepeatLabel(schedule: StatusSchedule) {
  if (schedule.repeat === "once") return "One time";
  if (schedule.repeat === "daily") return "Repeats every day";
  if (schedule.repeat === "weekdays") return "Repeats on weekdays";
  if (schedule.repeat === "weekends") return "Repeats on weekends";
  if (schedule.repeat === "weekly") return `Repeats every ${new Date(schedule.startsAt).toLocaleDateString([], { weekday: "long" })}`;
  const selected = WEEKDAY_OPTIONS.filter(day => (schedule.repeatDays ?? []).includes(day.value));
  return `Repeats ${selected.map(day => day.label).join(", ") || "on selected days"}`;
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function eventToAccelerator(event: KeyboardEvent): string | null {
  const ignored = ["Meta", "Control", "Alt", "Shift"];

  if (ignored.includes(event.key)) {
    return null;
  }

  const parts: string[] = [];

  if (event.metaKey) parts.push("Command");

  if (event.ctrlKey) parts.push("Control");

  if (event.altKey) parts.push("Alt");

  if (event.shiftKey) parts.push("Shift");

  let { key } = event;

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
    Tab: "Tab",
  };

  key = aliases[key] ?? key;

  if (key.length === 1) {
    key = key.toUpperCase();
  }

  parts.push(key);

  return parts.join("+");
}

function ChevronIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={`bs-chevron${collapsed ? " bs-chevron-collapsed" : ""}`}
      viewBox="0 0 24 24"
      width="20"
      height="20"
    >
      <path
        fill="currentColor"
        d="M6.7 8.3a1 1 0 0 1 1.4 0l3.9 3.9 3.9-3.9a1 1 0 1 1 1.4 1.4l-4.6 4.6a1 1 0 0 1-1.4 0L6.7 9.7a1 1 0 0 1 0-1.4Z"
      />
    </svg>
  );
}

function DevelopmentChannelPrompt({
  modalProps,
  onAccept,
}: {
  modalProps: RenderModalProps;
  onAccept(): void;
}) {
  const [accepted, setAccepted] = React.useState(false);

  return (
    <ConfirmModal
      {...modalProps}
      title="Switch to Development updates?"
      confirmText="Use Development"
      cancelText="Stay on Production"
      variant="primary"
      checkboxProps={{
        label: "I understand and accept the development-build terms",
        checked: accepted,
        onChange: setAccepted,
      }}
      onConfirm={setError => {
        if (!accepted) {
          setError("Accept the development-build terms before continuing.");
          throw new Error("Development terms were not accepted.");
        }

        onAccept();
      }}
    >
      <div className="bs-dev-channel-prompt">
        <Forms.FormText>
          Development builds contain changes that have not reached the stable
          Production channel. They may break, change behavior, or require a
          manual reinstall.
        </Forms.FormText>
        <Forms.FormText>
          Based on the MIT license disclaimer, development builds are provided
          <strong> “as is”</strong>, without warranty of any kind. You accept
          responsibility for using and testing them. Read the{" "}
          <Link href="https://opensource.org/license/mit">
            MIT license terms
          </Link>
          .
        </Forms.FormText>
        <Forms.FormText>
          You can return to Production at any time without another prompt.
        </Forms.FormText>
      </div>
    </ConfirmModal>
  );
}

export default function SettingsComponent() {
  const {
    autoUpdate,
    autoRestart,
    updateCheckFrequency,
    updateChannel,
    autoRestartPausedUntil,
    activePresetId,
    syncEnabled,
    syncProvider,
    syncServerUrl,
  } = settings.use([
    "autoUpdate",
    "autoRestart",
    "updateCheckFrequency",
    "updateChannel",
    "autoRestartPausedUntil",
    "activePresetId",
    "syncEnabled",
    "syncProvider",
    "syncServerUrl",
  ]);

  const [recordingId, setRecordingId] = React.useState<string | null>(null);
  const [presets, setPresets] = React.useState<StatusPreset[]>(() => [
    ...getPresets(),
  ]);
  const [schedules, setSchedules] = React.useState<StatusSchedule[]>(() => [
    ...getSchedules(),
  ]);
  const [collapsedScheduleIds, setCollapsedScheduleIds] = React.useState<Set<string>>(
    () => new Set(schedules.map(schedule => schedule.id)),
  );
  const [collapsedIds, setCollapsedIds] = React.useState<Set<string>>(
    () => new Set(presets.map(preset => preset.id)),
  );
  const [searchQuery, setSearchQuery] = React.useState("");
  const [checkingForUpdates, setCheckingForUpdates] = React.useState(false);
  const [restartingDiscord, setRestartingDiscord] = React.useState(false);
  const [lastUpdateFailed, setLastUpdateFailed] = React.useState(false);
  const [updateStatus, setUpdateStatus] = React.useState<string | null>(null);
  const [updateInfo, setUpdateInfo] = React.useState<UpdateInfo | null>(null);
  const [updateInfoError, setUpdateInfoError] = React.useState<string | null>(
    null,
  );
  const [lastCheckedAt, setLastCheckedAt] = React.useState<Date | null>(null);
  const [backupStatus, setBackupStatus] = React.useState<string | null>(null);
  const [syncStatus, setSyncStatus] = React.useState<string>("Not connected");
  const [syncBusy, setSyncBusy] = React.useState(false);
  const [syncEncrypted, setSyncEncrypted] = React.useState(false);
  const [syncLocked, setSyncLocked] = React.useState(false);
  const selectedUpdateChannel: UpdateChannel =
    updateChannel === "dev" ? "dev" : "prod";
  const selectedUpdateFrequency =
    normalizeUpdateCheckFrequency(updateCheckFrequency);

  async function refreshUpdateInfo(channel: UpdateChannel) {
    try {
      const info = await Native.getUpdateInfo(channel);
      setUpdateInfo(info);
      setUpdateInfoError(null);
      setLastCheckedAt(new Date());
    } catch (error) {
      setUpdateInfo(null);
      setUpdateInfoError(
        error instanceof Error ? error.message : String(error),
      );
      setLastCheckedAt(new Date());
    }
  }

  function restartDiscordNow() {
    if (restartingDiscord) return;
    setRestartingDiscord(true);
    setUpdateStatus("Restarting Discord to apply the BetterStatus update…");
    window.setTimeout(relaunch, 250);
  }

  React.useEffect(() => {
    void refreshUpdateInfo(selectedUpdateChannel);
  }, [selectedUpdateChannel]);

  React.useEffect(() => {
    Native.getCloudSyncStatus(getSyncServerURL()).then(status => {
      setSyncEncrypted(Boolean(status.encryptionPasswordSet));
      setSyncLocked(false);
      setSyncStatus(status.connected
        ? `Connected as Discord user ${status.discordUserId} · expires ${new Date(status.expiresAt!).toLocaleDateString()}`
        : "Not connected");
    }).catch(error => setSyncStatus(error instanceof Error ? error.message : String(error)));
  }, [syncProvider, syncServerUrl]);

  React.useEffect(() => {
    const updateProtection = (event: Event) => {
      const { detail } = event as CustomEvent<{ encrypted: boolean; locked: boolean; }>;
      setSyncEncrypted(detail.encrypted);
      setSyncLocked(detail.locked);
      if (detail.locked) setSyncStatus("Encrypted configuration is locked on this device.");
    };
    window.addEventListener("betterstatus-sync-protection", updateProtection);
    return () => window.removeEventListener("betterstatus-sync-protection", updateProtection);
  }, []);

  function changeSyncPassword() {
    openModal(modalProps => (
      <CloudProtectionModal
        modalProps={modalProps}
        changing={syncEncrypted}
        onSave={async password => {
          await pluginRuntime().changeCloudEncryptionPassword(password);
          setSyncEncrypted(true);
          setSyncLocked(false);
          setSyncStatus("Configuration encrypted client-side. Password updated on the server ciphertext.");
        }}
      />
    ));
  }

  function removeSyncPassword() {
    openModal(modalProps => (
      <ConfirmModal
        {...modalProps}
        title="Remove sync password?"
        confirmText="Remove protection"
        cancelText="Cancel"
        variant="danger"
        onConfirm={async () => {
          await pluginRuntime().changeCloudEncryptionPassword();
          setSyncEncrypted(false);
          setSyncLocked(false);
          setSyncStatus("Client-side password protection removed.");
        }}
      >
        <Forms.FormText>
          The next sync revision will contain readable JSON on the server. Your
          Discord-authorized connection will still use HTTPS and authenticated sessions.
        </Forms.FormText>
      </ConfirmModal>
    ));
  }

  React.useEffect(() => {
    const refresh = () => {
      setPresets([...getPresets()]);
      setSchedules([...getSchedules()]);
    };
    window.addEventListener("betterstatus-sync-applied", refresh);
    return () => window.removeEventListener("betterstatus-sync-applied", refresh);
  }, []);

  async function connectSync() {
    setSyncBusy(true);
    setSyncStatus("Waiting for Discord authorization in your browser…");
    try {
      const status = await Native.authorizeCloudSync(getSyncServerURL());
      settings.store.syncEnabled = true;
      settings.store.cloudSyncPullOnConnect = true;
      setSyncStatus(`Connected as Discord user ${status.discordUserId} · expires ${new Date(status.expiresAt).toLocaleDateString()}`);
      await pluginRuntime().configureCloudSync();
    } catch (error) {
      setSyncStatus(error instanceof Error ? error.message : String(error));
    } finally {
      setSyncBusy(false);
    }
  }

  async function disconnectSync() {
    setSyncBusy(true);
    try {
      await Native.disconnectCloudSync(getSyncServerURL());
      settings.store.syncEnabled = false;
      setSyncStatus("Not connected");
      await pluginRuntime().configureCloudSync();
    } finally {
      setSyncBusy(false);
    }
  }

  async function checkForUpdates(force = false) {
    if (checkingForUpdates) return;

    let retryAt: number | undefined;
    setCheckingForUpdates(true);
    setLastUpdateFailed(false);
    setUpdateStatus(
      `${force ? "Force updating from" : "Checking"} the ${selectedUpdateChannel === "dev" ? "development" : "production"} channel…`,
    );

    try {
      const result = await Native.checkForUpdates(true, selectedUpdateChannel, force);

      if (result.status === "updated") {
        const willRestart = prepareAutoRestart();
        const restartPaused = autoRestart && !willRestart;
        setUpdateStatus(
          willRestart
            ? "Update installed — restarting Discord…"
            : restartPaused
              ? "Update installed — automatic restart is temporarily paused. Restart Discord manually."
              : "Update installed — restart Discord to apply it.",
        );
        showNotification({
          title: "BetterStatus updated",
          body: willRestart
            ? "Discord will restart automatically."
            : restartPaused
              ? "Restart loop protection is active. Restart Discord manually."
            : "Restart Discord to use the new version.",
        });
        if (willRestart) window.setTimeout(relaunch, 1_500);
      } else if (result.status === "current") {
        setUpdateStatus("You already have the latest channel build.");
        showNotification({
          title: "BetterStatus is up to date",
          body: `No newer ${selectedUpdateChannel === "dev" ? "development" : "production"} build is available.`,
        });
      } else {
        const message = result.error ?? "The update could not be completed.";
        retryAt = result.retryAt;
        if (retryAt !== undefined)
          pluginRuntime().configureUpdateChecks(false, retryAt);
        setUpdateStatus(`Update failed: ${message}`);
        setLastUpdateFailed(true);
        showUpdateFailureNotification(result, selectedUpdateChannel);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setUpdateStatus(`Update failed: ${message}`);
      setLastUpdateFailed(true);
      showUpdateFailureNotification({ error: message }, selectedUpdateChannel);
    } finally {
      if (retryAt === undefined)
        await refreshUpdateInfo(selectedUpdateChannel);
      setCheckingForUpdates(false);
    }
  }

  async function commit(next: StatusPreset[]) {
    setPresets(next);
    await savePresets(next);
  }

  function exportSettings() {
    const backup: BetterStatusBackup = {
      format: "betterstatus-backup",
      version: 1,
      exportedAt: new Date().toISOString(),
      platform: currentPlatform(),
      settings: {
        presets: getPresets(),
        savedStatuses: getSavedStatuses(),
        schedules: getSchedules(),
        activePresetId: settings.store.activePresetId,
        autoUpdate: settings.store.autoUpdate,
        autoRestart: settings.store.autoRestart,
        updateCheckFrequency: getUpdateCheckFrequency(),
        updateChannel: getUpdateChannel(),
      },
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);

    anchor.href = url;
    anchor.download = `betterstatus-backup-${date}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setBackupStatus(`Exported ${backup.settings.presets.length} presets, ${backup.settings.schedules.length} schedules, and ${backup.settings.savedStatuses.length} saved statuses.`);
  }

  async function applyBackup(backup: BetterStatusBackup) {
    const convertMacHotkeys = backup.platform === "macos" && currentPlatform() === "windows";
    const importedPresets = backup.settings.presets.map(preset => ({
      ...preset,
      hotkey: convertMacHotkeys
        ? preset.hotkey.replace(/(^|\+)Command(?=\+|$)/g, "$1Control")
        : preset.hotkey,
    }));

    settings.store.savedStatuses = backup.settings.savedStatuses;
    settings.store.schedules = backup.settings.schedules;
    settings.store.autoUpdate = backup.settings.autoUpdate;
    settings.store.autoRestart = backup.settings.autoRestart;
    settings.store.updateCheckFrequency = backup.settings.updateCheckFrequency;
    settings.store.updateChannel = backup.settings.updateChannel;
    settings.store.activePresetId = importedPresets.some(
      preset => preset.id === backup.settings.activePresetId && preset.enabled,
    )
      ? backup.settings.activePresetId
      : undefined;

    await commit(importedPresets);
    setSchedules(backup.settings.schedules);
    pluginRuntime().configureSchedules();
    setCollapsedIds(new Set(importedPresets.map(preset => preset.id)));
    setSearchQuery("");
    setRecordingId(null);
    pluginRuntime().configureUpdateChecks(false);

    const message = `Imported ${importedPresets.length} presets, ${backup.settings.schedules.length} schedules, and ${backup.settings.savedStatuses.length} saved statuses${convertMacHotkeys ? "; Command shortcuts were converted to Control" : ""}.`;
    setBackupStatus(message);
    showNotification({ title: "BetterStatus backup imported", body: message });
  }

  function confirmBackupImport(backup: BetterStatusBackup) {
    const convertsHotkeys = backup.platform === "macos" && currentPlatform() === "windows";

    openModal(modalProps => (
      <ConfirmModal
        {...modalProps}
        title="Replace all BetterStatus settings?"
        confirmText="Import backup"
        cancelText="Cancel"
        variant="danger"
        onConfirm={() => void applyBackup(backup)}
      >
        <div className="bs-import-confirmation">
          <Forms.FormText>
            This replaces every BetterStatus preset, saved status, active preset,
            and update preference currently stored on this computer.
          </Forms.FormText>
          <div className="bs-import-summary">
            <span><strong>{backup.settings.presets.length}</strong> presets</span>
            <span><strong>{backup.settings.schedules.length}</strong> schedules</span>
            <span><strong>{backup.settings.savedStatuses.length}</strong> saved statuses</span>
            <span><strong>{backup.settings.updateChannel === "dev" ? "Development" : "Production"}</strong> updates</span>
          </div>
          {convertsHotkeys && (
            <Forms.FormText>
              macOS <strong>Command</strong> shortcuts will be converted to Windows <strong>Control</strong> shortcuts.
            </Forms.FormText>
          )}
          <Forms.FormText>Your current setup will not be recoverable unless you export it first.</Forms.FormText>
        </div>
      </ConfirmModal>
    ));
  }

  function importSettings() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        if (file.size > MAX_BACKUP_BYTES)
          throw new Error("The selected backup is larger than 2 MB.");

        const backup = validateBackup(JSON.parse(await file.text()));
        setBackupStatus(null);
        confirmBackupImport(backup);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setBackupStatus(`Import failed: ${message}`);
        showNotification({ title: "BetterStatus import failed", body: message });
      }
    };
    input.click();
  }

  function updatePreset(id: string, patch: Partial<StatusPreset>) {
    const next = presets.map(preset =>
      preset.id === id
        ? {
            ...preset,
            ...patch,
          }
        : preset,
    );

    if (id === activePresetId && patch.enabled === false) {
      settings.store.activePresetId = undefined;
    }

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
        enabled: true,
      },
    ];

    void commit(next);
  }

  function duplicatePreset(preset: StatusPreset) {
    void commit([
      ...presets,
      {
        ...preset,
        id: createId(),
        name: `${preset.name || "Untitled preset"} copy`,
        hotkey: "",
        enabled: false,
      },
    ]);
  }

  function deletePreset(id: string) {
    if (id === activePresetId) settings.store.activePresetId = undefined;

    const nextSchedules = schedules
      .filter(schedule => !(schedule.startBehavior !== "custom" && schedule.presetId === id))
      .map(schedule => schedule.startBehavior === "custom" && schedule.presetId === id
        ? { ...schedule, presetId: undefined }
        : schedule)
      .map(schedule => schedule.endPresetId === id
        ? { ...schedule, endBehavior: "restore" as const, endPresetId: undefined }
        : schedule);
    setSchedules(nextSchedules);
    settings.store.schedules = nextSchedules;
    void commit(presets.filter(preset => preset.id !== id));
    pluginRuntime().configureSchedules();
  }

  function commitSchedules(next: StatusSchedule[]) {
    setSchedules(next);
    settings.store.schedules = next;
    pluginRuntime().configureSchedules();
  }

  function addSchedule() {
    const preset = presets.find(candidate => candidate.enabled) ?? presets[0];

    const startsAt = new Date();
    startsAt.setMinutes(startsAt.getMinutes() + 5, 0, 0);
    const endsAt = new Date(startsAt);
    endsAt.setHours(endsAt.getHours() + 1);
    const schedule: StatusSchedule = {
      id: createId(),
      name: `${preset?.name || "Custom status"} schedule`,
      startBehavior: preset ? "preset" : "custom",
      presetId: preset?.id,
      startText: "",
      startPresence: preset?.presence ?? "online",
      startsAt: startsAt.getTime(),
      endsAt: endsAt.getTime(),
      repeat: "once",
      repeatDays: [],
      endBehavior: "restore",
      endText: "",
      endPresence: "online",
      enabled: true,
    };
    commitSchedules([...schedules, schedule]);
    setCollapsedScheduleIds(current => {
      const next = new Set(current);
      next.delete(schedule.id);
      return next;
    });
  }

  function updateSchedule(id: string, patch: Partial<StatusSchedule>) {
    commitSchedules(schedules.map(schedule => schedule.id === id ? { ...schedule, ...patch } : schedule));
  }

  function toggleScheduleDay(schedule: StatusSchedule, day: number) {
    const selected = new Set(schedule.repeatDays ?? []);
    if (selected.has(day)) {
      if (selected.size === 1) return;
      selected.delete(day);
    } else {
      selected.add(day);
    }
    updateSchedule(schedule.id, { repeatDays: [...selected].sort((left, right) => left - right) });
  }

  function toggleScheduleCollapsed(id: string) {
    setCollapsedScheduleIds(current => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAllSchedulesCollapsed() {
    const allSchedulesCollapsed = schedules.length > 0 &&
      schedules.every(schedule => collapsedScheduleIds.has(schedule.id));
    setCollapsedScheduleIds(allSchedulesCollapsed
      ? new Set()
      : new Set(schedules.map(schedule => schedule.id)));
  }

  function toggleCollapsed(id: string) {
    setCollapsedIds(current => {
      const next = new Set(current);

      if (next.has(id)) next.delete(id);
      else next.add(id);

      return next;
    });

    if (recordingId === id) setRecordingId(null);
  }

  function toggleAllCollapsed() {
    const allCollapsed =
      presets.length > 0 &&
      presets.every(preset => collapsedIds.has(preset.id));
    setCollapsedIds(
      allCollapsed ? new Set() : new Set(presets.map(preset => preset.id)),
    );
    setRecordingId(null);
  }

  React.useEffect(() => {
    if (!recordingId) return;

    const handler = (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (event.key === "Escape") {
        setRecordingId(null);
        return;
      }

      const accelerator = eventToAccelerator(event);

      if (!accelerator) return;

      updatePreset(recordingId, {
        hotkey: accelerator,
      });

      setRecordingId(null);
    };

    window.addEventListener("keydown", handler, true);

    return () => window.removeEventListener("keydown", handler, true);
  }, [recordingId, presets]);

  React.useEffect(() => {
    if (
      activePresetId &&
      !presets.some(preset => preset.id === activePresetId && preset.enabled)
    ) {
      settings.store.activePresetId = undefined;
    }
  }, [activePresetId, presets]);

  const enabledCount = presets.filter(preset => preset.enabled).length;
  const memoryCount = presets.filter(
    preset => preset.type === "memory",
  ).length;
  const allCollapsed =
    presets.length > 0 &&
    presets.every(preset => collapsedIds.has(preset.id));
  const allSchedulesCollapsed =
    schedules.length > 0 &&
    schedules.every(schedule => collapsedScheduleIds.has(schedule.id));
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const visiblePresets = normalizedQuery
    ? presets.filter(preset =>
        [
          preset.name,
          preset.text,
          preset.hotkey,
          preset.presence,
          preset.type,
        ].some(value => value.toLowerCase().includes(normalizedQuery)),
      )
    : presets;
  const activePreset = presets.find(
    preset => preset.id === activePresetId && preset.enabled,
  );
  const calendarDays = Array.from({ length: 7 }, (_, offset) => {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() + offset);
    return {
      day,
      schedules: schedules.filter(schedule => schedule.enabled && scheduleOccursOnDay(schedule, day)),
    };
  });

  return (
    <div className="bs-settings">
      <div className="bs-control-panel">
        <div className="bs-control-icon">↻</div>
        <div className="bs-control-copy">
          <Forms.FormTitle>Automatic updates</Forms.FormTitle>
          <Forms.FormText>
            Follow the stable production branch by default, or opt into
            development builds. Updates build safely and apply after restart.
          </Forms.FormText>
          <div className="bs-version-info">
            <span
              className={`bs-version-badge bs-version-${updateInfo?.status ?? "loading"}`}
            >
              <i />
              {updateInfo?.status === "current"
                ? "Up to date"
                : updateInfo?.status === "restartRequired"
                  ? "Restart required"
                  : updateInfo?.status === "updateAvailable"
                    ? "Update available"
                    : updateInfoError
                      ? "Version unavailable"
                      : "Checking version"}
            </span>
            {updateInfo?.status === "restartRequired" && (
              <button
                type="button"
                className="bs-version-restart-button"
                disabled={restartingDiscord}
                onClick={restartDiscordNow}
              >
                {restartingDiscord ? "Restarting…" : "Restart Discord"}
              </button>
            )}
            {updateInfo && (
              <span className="bs-version-commits">
                <span>
                  Installed:{" "}
                  {updateInfo.installedVersion?.slice(0, 7) ?? "unknown"}
                  {updateInfo.installedChannel &&
                  updateInfo.installedChannel !== updateInfo.channel
                    ? ` (${updateInfo.installedChannel})`
                    : ""}
                </span>
                <span>Latest: {updateInfo.latestVersion.slice(0, 7)}</span>
                <Link
                  href={`https://github.com/Jacksonnn911/BetterStatus/commit/${updateInfo.latestVersion}`}
                >
                  View commit ↗
                </Link>
              </span>
            )}
            {lastCheckedAt && (
              <span className="bs-version-checked">
                Checked{" "}
                {lastCheckedAt.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>
          {updateInfoError && (
            <div className="bs-update-status" role="status">
              Version check failed: {updateInfoError}
            </div>
          )}
          {updateStatus && (
            <div className="bs-update-status" role="status">
              {updateStatus}
            </div>
          )}
        </div>
        <div className="bs-update-actions">
          <div className="bs-update-channel">
            <Select
              options={UPDATE_CHANNEL_OPTIONS}
              select={channel => {
                if (channel !== "dev") {
                  settings.store.updateChannel = "prod";
                  setUpdateStatus(null);
                  return;
                }

                openModal(modalProps => (
                  <DevelopmentChannelPrompt
                    modalProps={modalProps}
                    onAccept={() => {
                      settings.store.updateChannel = "dev";
                      setUpdateStatus(null);
                    }}
                  />
                ));
              }}
              serialize={value => value}
              isSelected={value => value === selectedUpdateChannel}
              closeOnSelect
            />
          </div>
          <Button disabled={checkingForUpdates} onClick={() => checkForUpdates(false)}>
            {checkingForUpdates ? "Checking…" : "Check for updates"}
          </Button>
          {lastUpdateFailed && (
            <Button
              color={Button.Colors.RED}
              disabled={checkingForUpdates}
              onClick={() => checkForUpdates(true)}
            >
              Force update
            </Button>
          )}
          <div className="bs-update-switches">
            <FormSwitch
              title="Auto update"
              value={autoUpdate}
              onChange={value => {
                settings.store.autoUpdate = value;
                pluginRuntime().configureUpdateChecks(
                  value,
                );
              }}
              hideBorder
            />
            <div className="bs-update-frequency">
              <span>Check frequency</span>
              <Select
                options={UPDATE_FREQUENCY_OPTIONS}
                select={frequency => {
                  settings.store.updateCheckFrequency =
                    normalizeUpdateCheckFrequency(frequency);
                  pluginRuntime().configureUpdateChecks(
                    false,
                  );
                }}
                serialize={value => String(value)}
                isSelected={value => value === selectedUpdateFrequency}
                isDisabled={!autoUpdate}
                closeOnSelect
              />
            </div>
            <FormSwitch
              title={autoRestartPausedUntil && autoRestartPausedUntil > Date.now()
                ? `Auto restart Discord (paused until ${formatAutoRestartPause(autoRestartPausedUntil)})`
                : "Auto restart Discord"}
              value={autoRestart}
              onChange={value => (settings.store.autoRestart = value)}
              hideBorder
            />
            {autoRestartPausedUntil && autoRestartPausedUntil > Date.now() && (
              <div className="bs-restart-guard" role="status">
                Restart loop protection is active. Updates still install, but Discord must be restarted manually.
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="bs-backup-panel">
        <div className="bs-backup-mark" aria-hidden="true">⇅</div>
        <div className="bs-backup-copy">
          <Forms.FormTitle>Backup & sharing</Forms.FormTitle>
          <Forms.FormText>
            Move your complete BetterStatus setup between computers or keep a
            personal backup. Presets, schedules, Memory values, saved statuses,
            favorites, and update preferences are all included.
          </Forms.FormText>
          {backupStatus && <div className="bs-backup-status" role="status">{backupStatus}</div>}
        </div>
        <div className="bs-backup-actions">
          <button type="button" className="bs-secondary-button" onClick={importSettings}>
            Import backup
          </button>
          <Button onClick={exportSettings}>Export everything</Button>
        </div>
      </section>

      <section className="bs-sync-panel">
        <div className="bs-section-heading">
          <div>
            <Forms.FormTitle tag="h2">Cloud sync</Forms.FormTitle>
            <Forms.FormText>
              Keep presets, saved statuses, schedules, and preferences current on every client through secure Discord-authorized sync.
            </Forms.FormText>
          </div>
          <FormSwitch
            title="Sync enabled"
            value={syncEnabled}
            onChange={value => {
              settings.store.syncEnabled = value;
              void pluginRuntime().configureCloudSync();
            }}
            hideBorder
          />
        </div>
        <div className="bs-sync-controls">
          <div className="bs-field">
            <span>Sync provider</span>
            <Select
              options={SYNC_PROVIDER_OPTIONS}
              select={provider => {
                settings.store.syncProvider = provider as SyncProvider;
                settings.store.syncEnabled = false;
                void pluginRuntime().configureCloudSync();
              }}
              serialize={value => value}
              isSelected={value => value === syncProvider}
              closeOnSelect
            />
          </div>
          {syncProvider === "custom" && (
            <label className="bs-field">
              <span>Server URL</span>
              <TextInput
                value={syncServerUrl}
                placeholder="https://sync.example.com"
                onChange={value => {
                  settings.store.syncServerUrl = value;
                  settings.store.syncEnabled = false;
                }}
              />
            </label>
          )}
          <div className="bs-sync-actions">
            <Button disabled={syncBusy} onClick={connectSync}>{syncBusy ? "Connecting…" : "Connect Discord"}</Button>
            <button type="button" className="bs-secondary-button" disabled={syncBusy} onClick={disconnectSync}>Disconnect</button>
          </div>
        </div>
        <div className="bs-sync-status" role="status">{syncStatus}</div>
        <div className="bs-sync-protection">
          <div>
            <strong>{syncEncrypted ? (syncLocked ? "Password required" : "Client-side encrypted") : "Password protection off"}</strong>
            <span>{syncEncrypted
              ? "The server stores only authenticated ciphertext."
              : "Optionally encrypt all synchronized configuration before upload."}</span>
          </div>
        <div className="bs-sync-protection-actions">
            <button
              type="button"
              className="bs-secondary-button"
              disabled={!syncEnabled || syncBusy}
              onClick={() => syncLocked
                ? requestSyncPassword(password => pluginRuntime().unlockCloudSyncPassword(password))
                : changeSyncPassword()}
            >
              {syncLocked ? "Unlock" : syncEncrypted ? "Change password" : "Add password"}
            </button>
            {syncEncrypted && !syncLocked && (
              <button type="button" className="bs-secondary-button bs-danger-text" disabled={syncBusy} onClick={removeSyncPassword}>
                Remove password
              </button>
            )}
          </div>
        </div>
        {syncProvider === "custom" && (
          <Forms.FormText>Your self-hosted server needs its own Discord OAuth application and callback URL.</Forms.FormText>
        )}
      </section>

      <section className="bs-calendar-panel">
        <div className="bs-section-heading">
          <div>
            <Forms.FormTitle tag="h2">Status calendar</Forms.FormTitle>
            <Forms.FormText>
              Plan when a preset or custom status starts, how long it lasts, and what Discord
              should show when it ends. Times use this computer&apos;s local time.
            </Forms.FormText>
          </div>
          <div className="bs-section-actions">
            {!!schedules.length && (
              <button type="button" className="bs-secondary-button" onClick={toggleAllSchedulesCollapsed}>
                <ChevronIcon collapsed={!allSchedulesCollapsed} />
                {allSchedulesCollapsed ? "Expand all" : "Collapse all"}
              </button>
            )}
            <Button onClick={addSchedule}>+ Schedule status</Button>
          </div>
        </div>
        <div className="bs-calendar-week" aria-label="Upcoming seven days">
          {calendarDays.map(({ day, schedules: daySchedules }, index) => (
            <div className={`bs-calendar-day${index === 0 ? " bs-calendar-today" : ""}`} key={day.toISOString()}>
              <span>{day.toLocaleDateString([], { weekday: "short" })}</span>
              <strong>{day.getDate()}</strong>
              <div className="bs-calendar-day-events">
                {daySchedules.slice(0, 4).map(schedule => {
                  const preset = presets.find(item => item.id === schedule.presetId);
                  const presence = schedule.startBehavior === "custom" ? schedule.startPresence : preset?.presence;
                  return <i className={`bs-mini-event bs-presence-${presence ?? "online"}`} key={schedule.id} />;
                })}
                {daySchedules.length > 4 && <small>+{daySchedules.length - 4}</small>}
              </div>
            </div>
          ))}
        </div>
        {!schedules.length ? (
          <div className="bs-calendar-empty">
            No scheduled statuses yet. Create one from a preset or enter a custom status.
          </div>
        ) : (
          <div className="bs-calendar-grid">
            {schedules.map(schedule => {
              const startPreset = presets.find(preset => preset.id === schedule.presetId);
              const startPresence = schedule.startBehavior === "custom" ? schedule.startPresence : startPreset?.presence;
              const endTime = schedule.endsAt ?? schedule.startsAt + 60 * 60_000;
              const collapsed = collapsedScheduleIds.has(schedule.id);
              const contentId = `bs-schedule-${schedule.id}`;
              return (
                <article className={`bs-schedule-card bs-presence-${startPresence ?? "online"}${schedule.enabled ? "" : " bs-schedule-disabled"}${collapsed ? " bs-schedule-collapsed" : ""}`} key={schedule.id}>
                  <header className="bs-schedule-header">
                    <div className="bs-schedule-date" aria-hidden="true">
                      <span>{new Date(schedule.startsAt).toLocaleDateString([], { month: "short" })}</span>
                      <strong>{new Date(schedule.startsAt).getDate()}</strong>
                    </div>
                    <label className="bs-schedule-name">
                      <TextInput value={schedule.name} placeholder="Schedule name" onChange={name => updateSchedule(schedule.id, { name })} />
                      <span>{scheduleRepeatLabel(schedule)}</span>
                    </label>
                    <div className="bs-schedule-actions">
                      <FormSwitch title="Enabled" value={schedule.enabled} onChange={enabled => updateSchedule(schedule.id, { enabled })} hideBorder />
                      <button type="button" className="bs-schedule-delete" aria-label={`Delete ${schedule.name}`} onClick={() => commitSchedules(schedules.filter(item => item.id !== schedule.id))}>×</button>
                      <button
                        type="button"
                        className="bs-collapse-button"
                        aria-controls={contentId}
                        aria-expanded={!collapsed}
                        aria-label={`${collapsed ? "Expand" : "Collapse"} ${schedule.name || "calendar event"}`}
                        title={collapsed ? "Expand calendar event" : "Collapse calendar event"}
                        onClick={() => toggleScheduleCollapsed(schedule.id)}
                      >
                        <ChevronIcon collapsed={collapsed} />
                      </button>
                    </div>
                  </header>

                  {!collapsed && <div id={contentId} className="bs-schedule-timeline">
                    <section className="bs-timepoint bs-timepoint-start">
                      <div className="bs-timepoint-marker"><i /></div>
                      <div className="bs-timepoint-content">
                        <div className="bs-timepoint-title"><span>START</span><strong>{timeInputValue(schedule.startsAt)}</strong></div>
                        <div className="bs-schedule-fields">
                          <label className="bs-compact-field">
                            <span>Date</span>
                            <input type="date" value={dateInputValue(schedule.startsAt)} onChange={event => {
                              const startsAt = updateLocalDateTime(schedule.startsAt, event.currentTarget.value);
                              const duration = schedule.endsAt ? schedule.endsAt - schedule.startsAt : undefined;
                              updateSchedule(schedule.id, { startsAt, endsAt: duration ? startsAt + duration : undefined });
                            }} />
                          </label>
                          <label className="bs-compact-field">
                            <span>Time</span>
                            <input type="time" value={timeInputValue(schedule.startsAt)} onChange={event => {
                              const startsAt = updateLocalDateTime(schedule.startsAt, undefined, event.currentTarget.value);
                              const duration = schedule.endsAt ? schedule.endsAt - schedule.startsAt : undefined;
                              updateSchedule(schedule.id, { startsAt, endsAt: duration ? startsAt + duration : undefined });
                            }} />
                          </label>
                          <div className="bs-compact-field bs-compact-select">
                            <span>When it starts</span>
                            <Select
                              options={SCHEDULE_START_OPTIONS.filter(option => option.value !== "preset" || presets.length > 0)}
                              select={startBehavior => updateSchedule(schedule.id, {
                                startBehavior: startBehavior as ScheduleStartBehavior,
                                presetId: startBehavior === "preset"
                                  ? schedule.presetId ?? presets.find(preset => preset.enabled)?.id ?? presets[0]?.id
                                  : schedule.presetId,
                              })}
                              serialize={value => value}
                              isSelected={value => value === (schedule.startBehavior ?? "preset")}
                              closeOnSelect
                            />
                          </div>
                          <div className="bs-compact-field bs-compact-select">
                            <span>Repeat</span>
                            <Select options={SCHEDULE_REPEAT_OPTIONS} select={repeat => {
                              const nextRepeat = repeat as ScheduleRepeat;
                              updateSchedule(schedule.id, {
                                repeat: nextRepeat,
                                repeatDays: nextRepeat === "custom" && !(schedule.repeatDays?.length)
                                  ? [new Date(schedule.startsAt).getDay()]
                                  : schedule.repeatDays,
                              });
                            }} serialize={value => value} isSelected={value => value === schedule.repeat} closeOnSelect />
                          </div>
                        </div>
                        {(schedule.startBehavior ?? "preset") === "preset" ? (
                          <div className="bs-start-detail">
                            <span>Activate preset</span>
                            <Select options={presets.map(preset => ({ label: preset.name || "Untitled preset", value: preset.id }))} select={presetId => updateSchedule(schedule.id, { presetId })} serialize={value => value} isSelected={value => value === schedule.presetId} closeOnSelect />
                          </div>
                        ) : (
                          <div className="bs-custom-start-grid">
                            <label className="bs-field"><span>Custom status when it starts</span><TextInput value={schedule.startText ?? ""} placeholder="What should Discord show?" onChange={startText => updateSchedule(schedule.id, { startText })} /></label>
                            <div className="bs-field"><span>Presence when it starts</span><StatusSwitcher presence={schedule.startPresence ?? "online"} onPresenceChange={startPresence => updateSchedule(schedule.id, { startPresence })} /></div>
                          </div>
                        )}
                        {schedule.repeat === "custom" && (
                          <div className="bs-weekday-picker" aria-label="Repeat on specific days">
                            <span>Repeat on</span>
                            <div>
                              {WEEKDAY_OPTIONS.map(day => {
                                const selected = (schedule.repeatDays ?? []).includes(day.value);
                                return (
                                  <button
                                    type="button"
                                    className={selected ? "bs-weekday-selected" : ""}
                                    aria-pressed={selected}
                                    key={day.value}
                                    onClick={() => toggleScheduleDay(schedule, day.value)}
                                  >
                                    {day.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </section>

                    <div className="bs-timeline-rail"><span>{schedule.endsAt ? `${Math.max(1, Math.round((schedule.endsAt - schedule.startsAt) / 60_000))} min` : "no end"}</span></div>

                    <section className="bs-timepoint bs-timepoint-end">
                      <div className="bs-timepoint-marker"><i /></div>
                      <div className="bs-timepoint-content">
                        <div className="bs-timepoint-title">
                          <span>END</span>
                          <div className="bs-end-time-heading">
                            {schedule.endsAt && <strong>Ends at {timeInputValue(schedule.endsAt)}</strong>}
                            <FormSwitch title="Use end time" value={Boolean(schedule.endsAt)} onChange={enabled => updateSchedule(schedule.id, enabled
                              ? { endsAt: endTime, endBehavior: schedule.endBehavior === "keep" ? "restore" : schedule.endBehavior }
                              : { endsAt: undefined, endBehavior: "keep" })} hideBorder />
                          </div>
                        </div>
                        {schedule.endsAt ? (
                          <>
                            <div className="bs-schedule-fields">
                              <label className="bs-compact-field">
                                <span>Date</span>
                                <input type="date" value={dateInputValue(schedule.endsAt)} min={dateInputValue(schedule.startsAt)} onChange={event => updateSchedule(schedule.id, { endsAt: Math.max(schedule.startsAt + 60_000, updateLocalDateTime(schedule.endsAt!, event.currentTarget.value)) })} />
                              </label>
                              <label className="bs-compact-field">
                                <span>Time</span>
                                <input type="time" value={timeInputValue(schedule.endsAt)} onChange={event => updateSchedule(schedule.id, { endsAt: Math.max(schedule.startsAt + 60_000, updateLocalDateTime(schedule.endsAt!, undefined, event.currentTarget.value)) })} />
                              </label>
                              <div className="bs-compact-field bs-compact-select bs-end-action-field">
                                <span>When it ends</span>
                                <Select options={SCHEDULE_END_OPTIONS} select={endBehavior => updateSchedule(schedule.id, { endBehavior: endBehavior as ScheduleEndBehavior })} serialize={value => value} isSelected={value => value === schedule.endBehavior} closeOnSelect />
                              </div>
                            </div>
                            {schedule.endBehavior === "preset" && (
                              <div className="bs-end-detail">
                                <span>Then activate</span>
                                <Select options={presets.filter(preset => preset.id !== schedule.presetId).map(preset => ({ label: preset.name || "Untitled preset", value: preset.id }))} select={endPresetId => updateSchedule(schedule.id, { endPresetId })} serialize={value => value} isSelected={value => value === schedule.endPresetId} closeOnSelect />
                              </div>
                            )}
                            {schedule.endBehavior === "custom" && (
                              <div className="bs-custom-end-grid">
                                <label className="bs-field"><span>Custom status after end</span><TextInput value={schedule.endText ?? ""} placeholder="What should Discord show?" onChange={endText => updateSchedule(schedule.id, { endText })} /></label>
                                <div className="bs-field"><span>Presence after end</span><StatusSwitcher presence={schedule.endPresence ?? "online"} onPresenceChange={endPresence => updateSchedule(schedule.id, { endPresence })} /></div>
                              </div>
                            )}
                          </>
                        ) : <div className="bs-no-end-copy">The scheduled preset stays active until something else changes it.</div>}
                      </div>
                    </section>
                  </div>}
                </article>
              );
            })}
          </div>
        )}
      </section>

      <div className="bs-toolbar">
        <div>
          <Forms.FormTitle tag="h2">Status presets</Forms.FormTitle>
          <div className="bs-stats">
            <span>
              <strong>{presets.length}</strong> total
            </span>
            <span>
              <strong>{enabledCount}</strong> active
            </span>
            <span>
              <strong>{memoryCount}</strong> memory
            </span>
            <span
              className={`bs-active-summary${activePreset ? " bs-active-summary-live" : ""}`}
            >
              <i />
              {activePreset ? (
                <>
                  Current:{" "}
                  <strong>{activePreset.name || "Untitled preset"}</strong>
                </>
              ) : (
                "No active preset"
              )}
            </span>
          </div>
        </div>
        <div className="bs-toolbar-actions">
          <div className="bs-search">
            <span aria-hidden="true">⌕</span>
            <TextInput
              value={searchQuery}
              placeholder="Search presets"
              onChange={setSearchQuery}
            />
          </div>
          {!!presets.length && (
            <button
              type="button"
              className="bs-secondary-button"
              onClick={toggleAllCollapsed}
            >
              <ChevronIcon collapsed={!allCollapsed} />
              {allCollapsed ? "Expand all" : "Collapse all"}
            </button>
          )}
          <Button onClick={addPreset}>+ Add preset</Button>
        </div>
      </div>

      {presets.length === 0 ? (
        <div className="bs-empty">
          <Forms.FormTitle>No presets yet</Forms.FormTitle>
          <Forms.FormText>
            Create your first status preset to get started.
          </Forms.FormText>
          <Button onClick={addPreset}>Create preset</Button>
        </div>
      ) : visiblePresets.length === 0 ? (
        <div className="bs-empty">
          <Forms.FormTitle>No matching presets</Forms.FormTitle>
          <Forms.FormText>
            Try a different name, status, presence, mode, or hotkey.
          </Forms.FormText>
          <button
            type="button"
            className="bs-secondary-button"
            onClick={() => setSearchQuery("")}
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="bs-preset-grid">
          {visiblePresets.map(preset => {
            const collapsed = collapsedIds.has(preset.id);
            const contentId = `bs-preset-${preset.id}`;

            return (
              <section
                className={`bs-preset-card bs-presence-${preset.presence}${preset.enabled ? "" : " bs-preset-card-disabled"}${collapsed ? " bs-preset-card-collapsed" : ""}${preset.id === activePreset?.id ? " bs-preset-card-active" : ""}`}
                key={preset.id}
              >
                <header className="bs-card-header">
                  <div className="bs-card-identity">
                    <span className="bs-presence-dot" />
                    <div>
                      <div className="bs-card-title">
                        <Forms.FormTitle>
                          {preset.name || "Untitled preset"}
                        </Forms.FormTitle>
                        <span
                          className={`bs-mode-badge bs-mode-${preset.type}`}
                        >
                          {preset.type === "memory" ? "Memory" : "Fixed"}
                        </span>
                        {preset.id === activePreset?.id && (
                          <span className="bs-active-badge">
                            <i /> Active
                          </span>
                        )}
                      </div>
                      {collapsed && (
                        <div className="bs-card-summary">
                          <span>
                            {preset.type === "memory"
                              ? (preset.rememberedText ?? preset.text)
                              : preset.text || "No custom status"}
                          </span>
                          <span className="bs-hotkey-chip">
                            {preset.hotkey || "No hotkey"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="bs-card-actions">
                    <button
                      type="button"
                      className="bs-duplicate-button"
                      title="Create a disabled copy without a hotkey"
                      onClick={() => duplicatePreset(preset)}
                    >
                      Duplicate
                    </button>
                    <FormSwitch
                      title="Enabled"
                      value={preset.enabled}
                      onChange={enabled =>
                        updatePreset(preset.id, { enabled })
                      }
                      hideBorder
                    />
                    <button
                      type="button"
                      className="bs-collapse-button"
                      aria-controls={contentId}
                      aria-expanded={!collapsed}
                      aria-label={`${collapsed ? "Expand" : "Collapse"} ${preset.name || "preset"}`}
                      title={collapsed ? "Expand preset" : "Collapse preset"}
                      onClick={() => toggleCollapsed(preset.id)}
                    >
                      <ChevronIcon collapsed={collapsed} />
                    </button>
                  </div>
                </header>

                {!collapsed && (
                  <div id={contentId} className="bs-card-content">
                    <div className="bs-fields">
                      <label className="bs-field">
                        <span>Preset name</span>
                        <TextInput
                          value={preset.name}
                          placeholder="Work, gaming, sleeping…"
                          onChange={name => updatePreset(preset.id, { name })}
                        />
                      </label>

                      <div className="bs-field">
                        <span>Presence</span>
                        <StatusSwitcher
                          presence={preset.presence}
                          onPresenceChange={presence =>
                            updatePreset(preset.id, { presence })
                          }
                        />
                      </div>

                      <div className="bs-field">
                        <span>Behavior</span>
                        <Select
                          options={TYPE_OPTIONS}
                          select={type =>
                            updatePreset(preset.id, {
                              type: type as PresetType,
                            })
                          }
                          serialize={value => value}
                          isSelected={value => value === preset.type}
                          closeOnSelect
                        />
                      </div>

                      <label className="bs-field bs-field-status">
                        <span>
                          {preset.type === "memory"
                            ? "Remembered status"
                            : "Custom status"}
                        </span>
                        <TextInput
                          value={
                            preset.type === "memory"
                              ? (preset.rememberedText ?? preset.text)
                              : preset.text
                          }
                          placeholder="What are you doing?"
                          onChange={text =>
                            updatePreset(
                              preset.id,
                              preset.type === "memory"
                                ? { text, rememberedText: text }
                                : { text },
                            )
                          }
                        />
                      </label>

                      <div className="bs-field bs-field-hotkey">
                        <span>Global hotkey</span>
                        <div
                          className={`bs-hotkey${recordingId === preset.id ? " bs-hotkey-recording" : ""}`}
                        >
                          <TextInput
                            value={
                              recordingId === preset.id
                                ? "Press a shortcut…"
                                : preset.hotkey || "Not assigned"
                            }
                            editable={false}
                          />
                          <Button
                            onClick={() =>
                              setRecordingId(
                                recordingId === preset.id ? null : preset.id,
                              )
                            }
                          >
                            {recordingId === preset.id ? "Cancel" : "Record"}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="bs-card-footer">
                      <Forms.FormText>
                        {preset.type === "memory"
                          ? "Remembers the last status used while active."
                          : "Always applies the status saved above."}
                      </Forms.FormText>
                      <Button
                        color={Button.Colors.RED}
                        onClick={() => deletePreset(preset.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

migratePluginSettings("BetterStatus", "StatusHotkeys");

export const settings = definePluginSettings({
  autoUpdate: {
    type: OptionType.CUSTOM,
    default: true,
  },
  autoRestart: {
    type: OptionType.CUSTOM,
    default: false,
  },
  updateCheckFrequency: {
    type: OptionType.CUSTOM,
    default: 360 as UpdateCheckFrequency,
  },
  updateChannel: {
    type: OptionType.CUSTOM,
    default: "prod" as UpdateChannel,
  },
  presets: {
    type: OptionType.CUSTOM,
    default: DEFAULT_PRESETS,
  },
  savedStatuses: {
    type: OptionType.CUSTOM,
    default: [] as SavedStatus[],
  },
  schedules: {
    type: OptionType.CUSTOM,
    default: [] as StatusSchedule[],
  },
  syncEnabled: {
    type: OptionType.CUSTOM,
    default: false,
  },
  syncProvider: {
    type: OptionType.CUSTOM,
    default: "betterstatus" as SyncProvider,
  },
  syncServerUrl: {
    type: OptionType.CUSTOM,
    default: "https://betterstatus.misaliba.eu",
  },
  presetEditor: {
    type: OptionType.COMPONENT,
    component: SettingsComponent,
  },
}).withPrivateSettings<{
  activePresetId?: string;
  scheduleRuns?: Record<string, number>;
  scheduleEndRuns?: Record<string, number>;
  autoRestartHistory?: number[];
  autoRestartPausedUntil?: number;
  cloudSyncPullOnConnect?: boolean;
  cloudSyncState?: {
    server: string;
    discordUserId: string;
    revision: number;
    document: SyncDocument;
  };
  schedulePreviousStates?: Record<string, {
    occurrence: number;
    customStatus: {
      text?: string;
      emojiId?: string;
      emojiName?: string;
      expiresAtMs?: string;
      createdAtMs?: string;
    };
    presence: PresenceStatus;
    activePresetId?: string;
  }>;
}>();

export function getPresets(): StatusPreset[] {
  const normalized = settings.store.presets.map(preset => ({
    ...preset,
    type: preset.type === "memory" ? ("memory" as const) : ("fixed" as const),
  }));

  if (
    normalized.some(
      (preset, index) => preset.type !== settings.store.presets[index].type,
    )
  )
    settings.store.presets = normalized;

  return normalized;
}

export function getSavedStatuses(): SavedStatus[] {
  const normalized = normalizeSavedStatuses(settings.store.savedStatuses);

  if (
    JSON.stringify(normalized) !== JSON.stringify(settings.store.savedStatuses)
  )
    settings.store.savedStatuses = normalized;

  return normalized;
}

export function getSchedules(): StatusSchedule[] {
  const normalized = settings.store.schedules
    .filter(schedule =>
      schedule && typeof schedule.id === "string" &&
      typeof schedule.startsAt === "number" &&
      SCHEDULE_REPEAT_VALUES.has(schedule.repeat) &&
      (schedule.startBehavior === "custom" || typeof schedule.presetId === "string")
    )
    .map(schedule => ({
      ...schedule,
      startBehavior: schedule.startBehavior === "custom" ? "custom" as const : "preset" as const,
      startText: schedule.startText ?? "",
      startPresence: schedule.startPresence ?? "online",
      repeat: SCHEDULE_REPEAT_VALUES.has(schedule.repeat)
        ? schedule.repeat
        : "once" as const,
      repeatDays: [...new Set((schedule.repeatDays ?? [])
        .filter(day => Number.isInteger(day) && day >= 0 && day <= 6))]
        .sort((left, right) => left - right),
      endBehavior: ["keep", "restore", "preset", "custom"].includes(schedule.endBehavior)
        ? schedule.endBehavior
        : "keep" as const,
      endText: schedule.endText ?? "",
      endPresence: schedule.endPresence ?? "online",
    }));

  if (JSON.stringify(normalized) !== JSON.stringify(settings.store.schedules))
    settings.store.schedules = normalized;
  return normalized;
}

export function buildSyncDocument(): SyncDocument {
  return {
    version: 1,
    modifiedAt: Date.now(),
    presets: getPresets(),
    savedStatuses: getSavedStatuses(),
    schedules: getSchedules(),
    activePresetId: settings.store.activePresetId,
    autoUpdate: settings.store.autoUpdate,
    autoRestart: settings.store.autoRestart,
    updateCheckFrequency: getUpdateCheckFrequency(),
    updateChannel: getUpdateChannel(),
  };
}

export async function applySyncDocument(document: SyncDocument) {
  if (!document || document.version !== 1) throw new Error("Unsupported sync document.");
  const presetIds = new Set(document.presets.map(preset => preset.id));
  settings.store.presets = document.presets;
  settings.store.savedStatuses = normalizeSavedStatuses(document.savedStatuses);
  settings.store.schedules = validateSchedules(document.schedules, presetIds);
  settings.store.activePresetId = document.activePresetId && presetIds.has(document.activePresetId)
    ? document.activePresetId
    : undefined;
  settings.store.autoUpdate = document.autoUpdate !== false;
  settings.store.autoRestart = document.autoRestart === true;
  settings.store.updateCheckFrequency = normalizeUpdateCheckFrequency(document.updateCheckFrequency);
  settings.store.updateChannel = document.updateChannel === "dev" ? "dev" : "prod";
  await savePresets(document.presets);
  window.dispatchEvent(new CustomEvent("betterstatus-sync-applied"));
}

export function rememberSavedStatus(text: string) {
  const next = rememberStatusInLibrary(getSavedStatuses(), text);
  settings.store.savedStatuses = next;
}

export function getUpdateChannel(): UpdateChannel {
  const channel = settings.store.updateChannel === "dev" ? "dev" : "prod";

  if (settings.store.updateChannel !== channel)
    settings.store.updateChannel = channel;

  return channel;
}

export function normalizeUpdateCheckFrequency(
  value: unknown,
): UpdateCheckFrequency {
  const frequency = Number(value);
  const validFrequencies: UpdateCheckFrequency[] = [
    0, 15, 30, 60, 180, 360, 720, 1440,
  ];

  return validFrequencies.includes(frequency as UpdateCheckFrequency)
    ? (frequency as UpdateCheckFrequency)
    : 360;
}

export function getUpdateCheckFrequency(): UpdateCheckFrequency {
  const frequency = normalizeUpdateCheckFrequency(
    settings.store.updateCheckFrequency,
  );

  if (settings.store.updateCheckFrequency !== frequency)
    settings.store.updateCheckFrequency = frequency;

  return frequency;
}

export async function savePresets(presets: StatusPreset[]) {
  settings.store.presets = presets;

  await Native.registerHotkeys(
    presets.map(({ id, hotkey, enabled }) => ({
      id,
      hotkey,
      enabled,
    })),
  );
}
