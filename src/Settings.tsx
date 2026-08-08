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
  PresetType,
  SavedStatus,
  StatusPreset,
  UpdateChannel,
} from "./types";

const Native = VencordNative.pluginHelpers.BetterStatus as PluginNative<
  typeof import("./native")
>;

interface UpdateInfo {
  channel: UpdateChannel;
  installedChannel?: UpdateChannel;
  installedVersion?: string;
  latestVersion: string;
  status: "current" | "updateAvailable" | "restartRequired";
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
          <Link href="https://opensource.org/license/mit">MIT license terms</Link>.
        </Forms.FormText>
        <Forms.FormText>
          You can return to Production at any time without another prompt.
        </Forms.FormText>
      </div>
    </ConfirmModal>
  );
}

export default function SettingsComponent() {
  const { autoUpdate, autoRestart, updateChannel, activePresetId } = settings.use([
    "autoUpdate",
    "autoRestart",
    "updateChannel",
    "activePresetId",
  ]);

  const [recordingId, setRecordingId] = React.useState<string | null>(null);
  const [presets, setPresets] = React.useState<StatusPreset[]>(() => [
    ...getPresets(),
  ]);
  const [collapsedIds, setCollapsedIds] = React.useState<Set<string>>(
    () => new Set(presets.map(preset => preset.id)),
  );
  const [searchQuery, setSearchQuery] = React.useState("");
  const [checkingForUpdates, setCheckingForUpdates] = React.useState(false);
  const [updateStatus, setUpdateStatus] = React.useState<string | null>(null);
  const [updateInfo, setUpdateInfo] = React.useState<UpdateInfo | null>(null);
  const [updateInfoError, setUpdateInfoError] = React.useState<string | null>(null);
  const [lastCheckedAt, setLastCheckedAt] = React.useState<Date | null>(null);
  const selectedUpdateChannel: UpdateChannel =
    updateChannel === "dev" ? "dev" : "prod";

  async function refreshUpdateInfo(channel: UpdateChannel) {
    try {
      const info = await Native.getUpdateInfo(channel);
      setUpdateInfo(info);
      setUpdateInfoError(null);
      setLastCheckedAt(new Date());
    } catch (error) {
      setUpdateInfo(null);
      setUpdateInfoError(error instanceof Error ? error.message : String(error));
      setLastCheckedAt(new Date());
    }
  }

  React.useEffect(() => {
    void refreshUpdateInfo(selectedUpdateChannel);
  }, [selectedUpdateChannel]);

  async function checkForUpdates() {
    if (checkingForUpdates) return;

    setCheckingForUpdates(true);
    setUpdateStatus(
      `Checking the ${selectedUpdateChannel === "dev" ? "development" : "production"} channel…`,
    );

    try {
      const result = await Native.checkForUpdates(true, selectedUpdateChannel);

      if (result.status === "updated") {
        setUpdateStatus(
          autoRestart
            ? "Update installed — restarting Discord…"
            : "Update installed — restart Discord to apply it.",
        );
        showNotification({
          title: "BetterStatus updated",
          body: autoRestart
            ? "Discord will restart automatically."
            : "Restart Discord to use the new version.",
        });
        if (autoRestart)
          window.setTimeout(relaunch, 1_500);
      } else if (result.status === "current") {
        setUpdateStatus("You already have the latest channel build.");
        showNotification({
          title: "BetterStatus is up to date",
          body: `No newer ${selectedUpdateChannel === "dev" ? "development" : "production"} build is available.`,
        });
      } else {
        const message = result.error ?? "The update could not be completed.";
        setUpdateStatus(`Update failed: ${message}`);
        showNotification({
          title: "BetterStatus update failed",
          body: message,
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setUpdateStatus(`Update failed: ${message}`);
      showNotification({
        title: "BetterStatus update failed",
        body: message,
      });
    } finally {
      await refreshUpdateInfo(selectedUpdateChannel);
      setCheckingForUpdates(false);
    }
  }

  async function commit(next: StatusPreset[]) {
    setPresets(next);
    await savePresets(next);
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

    void commit(presets.filter(preset => preset.id !== id));
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
            {updateInfo && (
              <span className="bs-version-commits">
                <strong>{updateInfo.channel === "dev" ? "Development" : "Production"}</strong>
                <span>
                  Installed {updateInfo.installedVersion?.slice(0, 7) ?? "unknown"}
                  {updateInfo.installedChannel && updateInfo.installedChannel !== updateInfo.channel
                    ? ` (${updateInfo.installedChannel})`
                    : ""}
                </span>
                <span>Latest {updateInfo.latestVersion.slice(0, 7)}</span>
                <Link
                  href={`https://github.com/Jacksonnn911/BetterStatus/commit/${updateInfo.latestVersion}`}
                >
                  View commit ↗
                </Link>
              </span>
            )}
            {lastCheckedAt && (
              <span className="bs-version-checked">
                Checked {lastCheckedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
          <Button disabled={checkingForUpdates} onClick={checkForUpdates}>
            {checkingForUpdates ? "Checking…" : "Check for updates"}
          </Button>
          <div className="bs-update-switches">
            <FormSwitch
              title="Auto update"
              value={autoUpdate}
              onChange={value => (settings.store.autoUpdate = value)}
              hideBorder
            />
            <FormSwitch
              title="Auto restart Discord"
              value={autoRestart}
              onChange={value => (settings.store.autoRestart = value)}
              hideBorder
            />
          </div>
        </div>
      </div>

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
                  Current: <strong>{activePreset.name || "Untitled preset"}</strong>
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
  presetEditor: {
    type: OptionType.COMPONENT,
    component: SettingsComponent,
  },
}).withPrivateSettings<{
  activePresetId?: string;
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
