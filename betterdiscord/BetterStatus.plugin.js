/**
 * @name BetterStatus
 * @author Jacksonnn911 & qtmisaliba
 * @description BetterDiscord port of BetterStatus: presets, Memory mode, presence/custom status switching, schedules, history, backups, and focused-client hotkeys.
 * @version 0.1.0-bd
 * @website https://github.com/Jacksonnn911/BetterStatus
 * @source https://github.com/Jacksonnn911/BetterStatus/blob/betterdiscord-port/betterdiscord/BetterStatus.plugin.js
 */

"use strict";

const PLUGIN_NAME = "BetterStatus";
const DATA_KEY = "state";
const SCHEDULE_GRACE_MS = 5 * 60_000;
const HISTORY_LIMIT = 1000;
const SCHEDULE_POLL_MS = 15_000;

const DEFAULT_STATE = {
    schemaVersion: 1,
    presets: [],
    activePresetId: null,
    schedules: [],
    history: [],
    scheduleRuns: {},
    scheduleEndRuns: {},
    schedulePreviousStates: {},
    restoreOnStart: true,
    hotkeysEnabled: true,
    rememberHistory: true
};

const CSS = `
.bs-bd-root { color: var(--text-normal); padding: 8px 4px 28px; }
.bs-bd-root * { box-sizing: border-box; }
.bs-bd-header { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; margin-bottom:16px; }
.bs-bd-title { margin:0; color:var(--header-primary); font-size:24px; font-weight:700; }
.bs-bd-subtitle { margin:5px 0 0; color:var(--text-muted); line-height:1.45; max-width:760px; }
.bs-bd-badge { flex:none; border-radius:999px; padding:5px 10px; font-size:12px; font-weight:700; background:var(--background-modifier-selected); color:var(--text-normal); }
.bs-bd-warning { margin:12px 0; padding:12px 14px; border-radius:10px; background:var(--background-modifier-accent); color:var(--text-normal); line-height:1.45; }
.bs-bd-section { margin-top:18px; padding:16px; border:1px solid var(--background-modifier-accent); border-radius:12px; background:var(--background-secondary); }
.bs-bd-section h3 { margin:0 0 12px; color:var(--header-primary); font-size:17px; }
.bs-bd-toolbar { display:flex; flex-wrap:wrap; gap:8px; align-items:center; margin-bottom:12px; }
.bs-bd-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(270px,1fr)); gap:10px; }
.bs-bd-card { border:1px solid var(--background-modifier-accent); background:var(--background-primary); border-radius:10px; padding:12px; }
.bs-bd-card-active { outline:2px solid var(--brand-500); outline-offset:1px; }
.bs-bd-card-title { display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:10px; }
.bs-bd-card-title strong { color:var(--header-primary); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.bs-bd-row { display:grid; grid-template-columns:120px minmax(0,1fr); gap:10px; align-items:center; margin:8px 0; }
.bs-bd-row > label { color:var(--text-muted); font-size:13px; }
.bs-bd-input, .bs-bd-select { width:100%; min-width:0; padding:8px 9px; border:1px solid var(--background-modifier-accent); border-radius:7px; background:var(--input-background,var(--background-tertiary)); color:var(--text-normal); outline:none; }
.bs-bd-input:focus, .bs-bd-select:focus { border-color:var(--brand-500); }
.bs-bd-check { display:flex; gap:8px; align-items:center; color:var(--text-normal); }
.bs-bd-actions { display:flex; flex-wrap:wrap; gap:7px; margin-top:10px; }
.bs-bd-btn { border:0; border-radius:7px; padding:8px 10px; cursor:pointer; color:var(--white-500,#fff); background:var(--brand-500); font-weight:600; }
.bs-bd-btn:hover { filter:brightness(1.08); }
.bs-bd-btn-secondary { background:var(--background-modifier-hover); color:var(--text-normal); }
.bs-bd-btn-danger { background:var(--status-danger); }
.bs-bd-btn-small { padding:5px 8px; font-size:12px; }
.bs-bd-muted { color:var(--text-muted); font-size:12px; line-height:1.4; }
.bs-bd-empty { color:var(--text-muted); padding:6px 0; }
.bs-bd-history { display:flex; flex-direction:column; gap:6px; max-height:300px; overflow:auto; }
.bs-bd-history-item { display:flex; gap:8px; align-items:center; justify-content:space-between; border-bottom:1px solid var(--background-modifier-accent); padding:7px 0; }
.bs-bd-history-text { min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.bs-bd-stats { display:flex; flex-wrap:wrap; gap:8px; margin-top:10px; }
.bs-bd-stat { padding:6px 9px; border-radius:8px; background:var(--background-primary); color:var(--text-muted); font-size:12px; }
@media (max-width: 640px) { .bs-bd-row { grid-template-columns:1fr; gap:4px; } }
`;

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function uid(prefix = "id") {
    if (globalThis.crypto?.randomUUID) return `${prefix}-${globalThis.crypto.randomUUID()}`;
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function asPresence(value) {
    return ["online", "idle", "dnd", "invisible"].includes(value) ? value : "online";
}

function normalizePreset(raw) {
    return {
        id: typeof raw?.id === "string" ? raw.id : uid("preset"),
        name: typeof raw?.name === "string" && raw.name.trim() ? raw.name.trim() : "Preset",
        text: typeof raw?.text === "string" ? raw.text.slice(0, 128) : "",
        type: raw?.type === "memory" ? "memory" : "fixed",
        rememberedText: typeof raw?.rememberedText === "string" ? raw.rememberedText.slice(0, 128) : undefined,
        presence: asPresence(raw?.presence),
        hotkey: typeof raw?.hotkey === "string" ? raw.hotkey : "",
        enabled: raw?.enabled !== false
    };
}

function normalizeSchedule(raw) {
    const startsAt = Number(raw?.startsAt);
    const endsAt = Number(raw?.endsAt);
    const allowedRepeat = ["once", "daily", "weekdays", "weekends", "weekly", "custom"];
    const allowedStart = ["preset", "custom"];
    const allowedEnd = ["keep", "restore", "preset", "custom"];
    return {
        id: typeof raw?.id === "string" ? raw.id : uid("schedule"),
        name: typeof raw?.name === "string" && raw.name.trim() ? raw.name.trim() : "Schedule",
        startBehavior: allowedStart.includes(raw?.startBehavior) ? raw.startBehavior : "preset",
        presetId: typeof raw?.presetId === "string" ? raw.presetId : undefined,
        startText: typeof raw?.startText === "string" ? raw.startText.slice(0, 128) : "",
        startPresence: asPresence(raw?.startPresence),
        startsAt: Number.isFinite(startsAt) ? startsAt : Date.now() + 60_000,
        endsAt: Number.isFinite(endsAt) && endsAt > startsAt ? endsAt : undefined,
        repeat: allowedRepeat.includes(raw?.repeat) ? raw.repeat : "once",
        repeatDays: Array.isArray(raw?.repeatDays) ? raw.repeatDays.filter(n => Number.isInteger(n) && n >= 0 && n <= 6) : [],
        endBehavior: allowedEnd.includes(raw?.endBehavior) ? raw.endBehavior : "keep",
        endPresetId: typeof raw?.endPresetId === "string" ? raw.endPresetId : undefined,
        endText: typeof raw?.endText === "string" ? raw.endText.slice(0, 128) : "",
        endPresence: asPresence(raw?.endPresence),
        enabled: raw?.enabled !== false
    };
}

function normalizeState(raw) {
    const value = raw && typeof raw === "object" ? raw : {};
    return {
        ...clone(DEFAULT_STATE),
        ...value,
        schemaVersion: 1,
        presets: Array.isArray(value.presets) ? value.presets.map(normalizePreset) : [],
        schedules: Array.isArray(value.schedules) ? value.schedules.map(normalizeSchedule) : [],
        history: Array.isArray(value.history) ? value.history
            .filter(item => item && typeof item.text === "string")
            .map(item => ({
                id: typeof item.id === "string" ? item.id : uid("history"),
                text: item.text.slice(0, 128),
                favorite: item.favorite === true,
                createdAt: Number.isFinite(Number(item.createdAt)) ? Number(item.createdAt) : Date.now(),
                lastUsedAt: Number.isFinite(Number(item.lastUsedAt)) ? Number(item.lastUsedAt) : Date.now(),
                useCount: Math.max(1, Number(item.useCount) || 1)
            }))
            .slice(0, HISTORY_LIMIT) : [],
        scheduleRuns: value.scheduleRuns && typeof value.scheduleRuns === "object" ? value.scheduleRuns : {},
        scheduleEndRuns: value.scheduleEndRuns && typeof value.scheduleEndRuns === "object" ? value.scheduleEndRuns : {},
        schedulePreviousStates: value.schedulePreviousStates && typeof value.schedulePreviousStates === "object" ? value.schedulePreviousStates : {},
        activePresetId: typeof value.activePresetId === "string" ? value.activePresetId : null,
        restoreOnStart: value.restoreOnStart !== false,
        hotkeysEnabled: value.hotkeysEnabled !== false,
        rememberHistory: value.rememberHistory !== false
    };
}

function dtLocalValue(timestamp) {
    const d = new Date(timestamp);
    if (!Number.isFinite(d.getTime())) return "";
    const pad = n => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function parseDtLocal(value) {
    const d = new Date(value);
    return Number.isFinite(d.getTime()) ? d.getTime() : NaN;
}

function hotkeyFromEvent(event) {
    const key = event.key;
    if (["Control", "Shift", "Alt", "Meta"].includes(key)) return "";
    const parts = [];
    if (event.ctrlKey) parts.push("Ctrl");
    if (event.altKey) parts.push("Alt");
    if (event.shiftKey) parts.push("Shift");
    if (event.metaKey) parts.push("Meta");
    let pretty = key.length === 1 ? key.toUpperCase() : key;
    const aliases = { " ": "Space", Escape: "Esc", ArrowUp: "Up", ArrowDown: "Down", ArrowLeft: "Left", ArrowRight: "Right" };
    pretty = aliases[pretty] || pretty;
    parts.push(pretty);
    return parts.join("+");
}

function hotkeyMatches(event, hotkey) {
    if (!hotkey) return false;
    return hotkeyFromEvent(event).toLowerCase() === hotkey.trim().toLowerCase();
}

module.exports = class BetterStatus {
    constructor(meta) {
        this.meta = meta || { name: PLUGIN_NAME, version: "0.1.0-bd" };
        this.api = new BdApi(PLUGIN_NAME);
        this.state = normalizeState(this.api.Data.load(DATA_KEY));
        this.started = false;
        this.settingsRoot = null;
        this.schedulerTimer = null;
        this.modulesReady = false;
        this.UserSettingsProtoStore = null;
        this.UserSettingsProtoActions = null;
        this.boundKeydown = this.onKeydown.bind(this);
    }

    start() {
        this.started = true;
        this.api.DOM.addStyle(CSS);
        window.addEventListener("keydown", this.boundKeydown, true);
        this.resolveDiscordModulesWithRetry();
        this.startScheduler();
        this.api.Logger.info("BetterStatus BetterDiscord port started");
    }

    stop() {
        this.started = false;
        window.removeEventListener("keydown", this.boundKeydown, true);
        if (this.schedulerTimer) clearInterval(this.schedulerTimer);
        this.schedulerTimer = null;
        this.api.DOM.removeStyle();
        this.settingsRoot = null;
    }

    save() {
        this.api.Data.save(DATA_KEY, this.state);
    }

    async resolveDiscordModulesWithRetry() {
        for (let attempt = 0; attempt < 20 && this.started; attempt++) {
            if (this.resolveDiscordModules()) {
                if (attempt > 0) this.api.Logger.info(`Discord settings modules resolved after ${attempt + 1} attempts`);
                if (this.state.restoreOnStart) this.restoreActivePreset();
                this.renderSettingsIfOpen();
                return;
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        if (this.started) {
            this.api.UI.showToast("BetterStatus: could not find Discord's status settings module.", { type: "error", timeout: 8000 });
            this.renderSettingsIfOpen();
        }
    }

    resolveDiscordModules() {
        try {
            const Webpack = BdApi.Webpack;
            this.UserSettingsProtoStore = Webpack.getStore("UserSettingsProtoStore") || null;
            this.UserSettingsProtoActions = Webpack.getModule(
                m => m?.ProtoClass?.typeName?.endsWith?.(".PreloadedUserSettings") && typeof m.updateAsync === "function",
                { first: true, searchExports: true }
            ) || null;
            this.modulesReady = Boolean(this.UserSettingsProtoStore && this.UserSettingsProtoActions?.updateAsync);
            return this.modulesReady;
        } catch (error) {
            this.api.Logger.error("Failed to resolve Discord modules", error);
            this.modulesReady = false;
            return false;
        }
    }

    currentDiscordState() {
        const statusRoot = this.UserSettingsProtoStore?.settings?.status;
        const custom = statusRoot?.customStatus;
        return {
            presence: asPresence(statusRoot?.status?.value),
            customStatus: custom ? {
                text: typeof custom.text === "string" ? custom.text : "",
                emojiId: custom.emojiId ?? "0",
                emojiName: custom.emojiName ?? "",
                expiresAtMs: custom.expiresAtMs ?? "0",
                createdAtMs: custom.createdAtMs ?? String(Date.now())
            } : {
                text: "",
                emojiId: "0",
                emojiName: "",
                expiresAtMs: "0",
                createdAtMs: String(Date.now())
            },
            activePresetId: this.state.activePresetId
        };
    }

    async updateDiscordState({ text, presence, customStatus }) {
        if (!this.modulesReady && !this.resolveDiscordModules()) throw new Error("Discord status module is not available yet.");
        const nextPresence = asPresence(presence);
        const nextCustom = customStatus || {
            text: String(text ?? "").slice(0, 128),
            expiresAtMs: "0",
            emojiId: "0",
            emojiName: "",
            createdAtMs: String(Date.now())
        };
        await this.UserSettingsProtoActions.updateAsync("status", draft => {
            if (!draft.status) draft.status = {};
            if (!draft.status.value) draft.status.value = nextPresence;
            else draft.status.value = nextPresence;
            draft.customStatus = {
                expiresAtMs: String(nextCustom.expiresAtMs ?? "0"),
                text: String(nextCustom.text ?? "").slice(0, 128),
                emojiName: String(nextCustom.emojiName ?? ""),
                emojiId: String(nextCustom.emojiId ?? "0"),
                ...(nextCustom.createdAtMs ? { createdAtMs: String(nextCustom.createdAtMs) } : {})
            };
        }, 0);
    }

    rememberCurrentMemoryPreset() {
        const active = this.state.presets.find(p => p.id === this.state.activePresetId && p.type === "memory");
        if (!active || !this.modulesReady) return;
        active.rememberedText = this.currentDiscordState().customStatus.text;
        this.save();
    }

    rememberHistory(text) {
        if (!this.state.rememberHistory) return;
        const clean = String(text ?? "").trim().slice(0, 128);
        if (!clean) return;
        const now = Date.now();
        const found = this.state.history.find(item => item.text === clean);
        if (found) {
            found.lastUsedAt = now;
            found.useCount += 1;
        } else {
            this.state.history.unshift({ id: uid("history"), text: clean, favorite: false, createdAt: now, lastUsedAt: now, useCount: 1 });
        }
        this.state.history.sort((a, b) => Number(b.favorite) - Number(a.favorite) || b.lastUsedAt - a.lastUsedAt);
        this.state.history = this.state.history.slice(0, HISTORY_LIMIT);
    }

    async applyPreset(id, source = "manual") {
        const preset = this.state.presets.find(p => p.id === id && p.enabled);
        if (!preset) throw new Error("Preset not found or disabled.");
        this.rememberCurrentMemoryPreset();
        const text = preset.type === "memory" ? (preset.rememberedText ?? preset.text) : preset.text;
        await this.updateDiscordState({ text, presence: preset.presence });
        this.state.activePresetId = preset.id;
        this.rememberHistory(text);
        this.save();
        this.renderSettingsIfOpen();
        if (source === "hotkey") this.api.UI.showToast(`BetterStatus: ${preset.name}`, { type: "success", timeout: 1800 });
    }

    async applyCustom(text, presence, source = "manual") {
        this.rememberCurrentMemoryPreset();
        await this.updateDiscordState({ text, presence });
        this.state.activePresetId = null;
        this.rememberHistory(text);
        this.save();
        this.renderSettingsIfOpen();
        if (source === "history") this.api.UI.showToast("BetterStatus: status applied", { type: "success", timeout: 1500 });
    }

    async restoreActivePreset() {
        const preset = this.state.presets.find(p => p.id === this.state.activePresetId && p.enabled);
        if (!preset || !this.modulesReady) return;
        try {
            const text = preset.type === "memory" ? (preset.rememberedText ?? preset.text) : preset.text;
            await this.updateDiscordState({ text, presence: preset.presence });
        } catch (error) {
            this.api.Logger.error("Failed to restore active preset", error);
        }
    }

    onKeydown(event) {
        if (!this.started || !this.state.hotkeysEnabled || event.repeat) return;
        const target = event.target;
        if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
        const preset = this.state.presets.find(p => p.enabled && p.hotkey && hotkeyMatches(event, p.hotkey));
        if (!preset) return;
        event.preventDefault();
        event.stopPropagation();
        this.applyPreset(preset.id, "hotkey").catch(error => this.api.UI.showToast(`BetterStatus: ${error.message}`, { type: "error" }));
    }

    startScheduler() {
        if (this.schedulerTimer) clearInterval(this.schedulerTimer);
        this.schedulerTimer = setInterval(() => this.tickSchedules(), SCHEDULE_POLL_MS);
        setTimeout(() => this.tickSchedules(), 2500);
    }

    repeatDays(schedule) {
        if (schedule.repeat === "daily") return new Set([0, 1, 2, 3, 4, 5, 6]);
        if (schedule.repeat === "weekdays") return new Set([1, 2, 3, 4, 5]);
        if (schedule.repeat === "weekends") return new Set([0, 6]);
        if (schedule.repeat === "weekly") return new Set([new Date(schedule.startsAt).getDay()]);
        if (schedule.repeat === "custom" && schedule.repeatDays?.length) return new Set(schedule.repeatDays);
        return new Set([new Date(schedule.startsAt).getDay()]);
    }

    mostRecentOccurrence(schedule, now) {
        if (schedule.repeat === "once") return schedule.startsAt <= now ? schedule.startsAt : undefined;
        const base = new Date(schedule.startsAt);
        const days = this.repeatDays(schedule);
        for (let back = 0; back <= 8; back++) {
            const candidate = new Date(now);
            candidate.setHours(base.getHours(), base.getMinutes(), base.getSeconds(), base.getMilliseconds());
            candidate.setDate(candidate.getDate() - back);
            if (candidate.getTime() < schedule.startsAt) continue;
            if (candidate.getTime() > now) continue;
            if (days.has(candidate.getDay())) return candidate.getTime();
        }
        return undefined;
    }

    async tickSchedules() {
        if (!this.started || !this.modulesReady) return;
        const now = Date.now();
        for (const schedule of this.state.schedules.filter(s => s.enabled)) {
            try {
                const lastStart = Number(this.state.scheduleRuns[schedule.id] || 0);
                const lastEnd = Number(this.state.scheduleEndRuns[schedule.id] || 0);

                if (schedule.endsAt && lastStart > 0 && lastEnd < lastStart) {
                    const duration = schedule.endsAt - schedule.startsAt;
                    const endAt = lastStart + duration;
                    if (endAt <= now) {
                        if (endAt >= now - SCHEDULE_GRACE_MS) await this.runScheduleEnd(schedule, lastStart);
                        else {
                            this.state.scheduleEndRuns[schedule.id] = lastStart;
                            delete this.state.schedulePreviousStates[schedule.id];
                            if (schedule.repeat === "once") schedule.enabled = false;
                            this.save();
                        }
                    }
                }

                const occurrence = this.mostRecentOccurrence(schedule, now);
                if (occurrence === undefined || occurrence <= lastStart) continue;
                if (occurrence < now - SCHEDULE_GRACE_MS) {
                    this.state.scheduleRuns[schedule.id] = occurrence;
                    if (schedule.repeat === "once") schedule.enabled = false;
                    this.save();
                    continue;
                }
                await this.runScheduleStart(schedule, occurrence);
            } catch (error) {
                this.api.Logger.error(`Schedule ${schedule.name} failed`, error);
            }
        }
        this.renderSettingsIfOpen();
    }

    async runScheduleStart(schedule, occurrence) {
        if (schedule.endsAt && schedule.endBehavior === "restore") {
            this.state.schedulePreviousStates[schedule.id] = {
                occurrence,
                ...this.currentDiscordState()
            };
        }
        this.state.scheduleRuns[schedule.id] = occurrence;
        this.save();
        if (schedule.startBehavior === "custom") await this.applyCustom(schedule.startText || "", schedule.startPresence || "online", "schedule");
        else if (schedule.presetId) await this.applyPreset(schedule.presetId, "schedule");
        if (!schedule.endsAt && schedule.repeat === "once") {
            schedule.enabled = false;
            this.save();
        }
    }

    async runScheduleEnd(schedule, startOccurrence) {
        const behavior = schedule.endBehavior;
        if (behavior === "restore") {
            const previous = this.state.schedulePreviousStates[schedule.id];
            if (previous?.occurrence === startOccurrence) {
                await this.updateDiscordState({ presence: previous.presence, customStatus: previous.customStatus });
                this.state.activePresetId = previous.activePresetId || null;
            }
        } else if (behavior === "preset" && schedule.endPresetId) {
            await this.applyPreset(schedule.endPresetId, "schedule");
        } else if (behavior === "custom") {
            await this.applyCustom(schedule.endText || "", schedule.endPresence || "online", "schedule");
        }
        this.state.scheduleEndRuns[schedule.id] = startOccurrence;
        delete this.state.schedulePreviousStates[schedule.id];
        if (schedule.repeat === "once") schedule.enabled = false;
        this.save();
    }

    exportBackup() {
        const payload = {
            format: "betterstatus-betterdiscord-backup",
            version: 1,
            exportedAt: new Date().toISOString(),
            state: this.state
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `betterstatus-bd-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    async importBackup(file) {
        if (!file || file.size > 2 * 1024 * 1024) throw new Error("Backup is missing or larger than 2 MB.");
        const parsed = JSON.parse(await file.text());
        let incoming;
        if (parsed?.format === "betterstatus-betterdiscord-backup" && parsed.version === 1) incoming = parsed.state;
        else if (parsed?.format === "betterstatus-backup" && parsed.version === 1 && parsed.settings) {
            incoming = {
                ...clone(DEFAULT_STATE),
                presets: parsed.settings.presets,
                schedules: parsed.settings.schedules,
                activePresetId: parsed.settings.activePresetId,
                history: parsed.settings.savedStatuses || []
            };
        } else if (parsed?.presets || parsed?.schedules) incoming = parsed;
        else throw new Error("Unsupported BetterStatus backup format.");
        this.state = normalizeState(incoming);
        this.save();
        this.startScheduler();
        this.renderSettingsIfOpen();
    }

    renderSettingsIfOpen() {
        if (!this.settingsRoot?.isConnected) return;
        const scroll = this.settingsRoot.closest("[class*=scroller]");
        const top = scroll?.scrollTop;
        const next = this.buildSettingsPanel();
        this.settingsRoot.replaceWith(next);
        if (scroll && Number.isFinite(top)) requestAnimationFrame(() => { scroll.scrollTop = top; });
    }

    el(tag, attrs = {}, ...children) {
        const node = document.createElement(tag);
        for (const [key, value] of Object.entries(attrs)) {
            if (key === "class") node.className = value;
            else if (key === "text") node.textContent = value;
            else if (key.startsWith("on") && typeof value === "function") node.addEventListener(key.slice(2).toLowerCase(), value);
            else if (value !== undefined && value !== null) node.setAttribute(key, String(value));
        }
        for (const child of children.flat()) {
            if (child == null) continue;
            node.append(child instanceof Node ? child : document.createTextNode(String(child)));
        }
        return node;
    }

    button(text, onClick, kind = "primary", small = false) {
        const classes = ["bs-bd-btn"];
        if (kind === "secondary") classes.push("bs-bd-btn-secondary");
        if (kind === "danger") classes.push("bs-bd-btn-danger");
        if (small) classes.push("bs-bd-btn-small");
        return this.el("button", { class: classes.join(" "), type: "button", onClick }, text);
    }

    field(labelText, control) {
        return this.el("div", { class: "bs-bd-row" }, this.el("label", { text: labelText }), control);
    }

    input(value, onChange, options = {}) {
        const input = this.el("input", { class: "bs-bd-input", type: options.type || "text", value: value ?? "", placeholder: options.placeholder || "" });
        input.value = value ?? "";
        input.addEventListener(options.event || "change", () => onChange(input.value, input));
        return input;
    }

    select(value, options, onChange) {
        const select = this.el("select", { class: "bs-bd-select" });
        for (const option of options) {
            const el = this.el("option", { value: option.value }, option.label);
            if (option.value === value) el.selected = true;
            select.append(el);
        }
        select.addEventListener("change", () => onChange(select.value));
        return select;
    }

    checkbox(checked, onChange, label = "Enabled") {
        const input = this.el("input", { type: "checkbox" });
        input.checked = Boolean(checked);
        input.addEventListener("change", () => onChange(input.checked));
        return this.el("label", { class: "bs-bd-check" }, input, this.el("span", {}, label));
    }

    presenceSelect(value, onChange) {
        return this.select(value, [
            { value: "online", label: "Online" },
            { value: "idle", label: "Idle" },
            { value: "dnd", label: "Do Not Disturb" },
            { value: "invisible", label: "Invisible" }
        ], onChange);
    }

    presetSelect(value, onChange, includeNone = false) {
        const options = [];
        if (includeNone) options.push({ value: "", label: "— Select preset —" });
        for (const preset of this.state.presets) options.push({ value: preset.id, label: preset.name });
        return this.select(value || "", options.length ? options : [{ value: "", label: "No presets yet" }], onChange);
    }

    addPreset() {
        const preset = normalizePreset({
            id: uid("preset"),
            name: `Preset ${this.state.presets.length + 1}`,
            text: "",
            type: "fixed",
            presence: "online",
            hotkey: "",
            enabled: true
        });
        this.state.presets.push(preset);
        this.save();
        this.renderSettingsIfOpen();
    }

    addSchedule() {
        const start = Date.now() + 5 * 60_000;
        this.state.schedules.push(normalizeSchedule({
            id: uid("schedule"),
            name: `Schedule ${this.state.schedules.length + 1}`,
            startBehavior: "preset",
            presetId: this.state.presets[0]?.id,
            startsAt: start,
            repeat: "once",
            endBehavior: "keep",
            enabled: true
        }));
        this.save();
        this.renderSettingsIfOpen();
    }

    buildPresetCard(preset) {
        const card = this.el("div", { class: `bs-bd-card${this.state.activePresetId === preset.id ? " bs-bd-card-active" : ""}` });
        const active = this.state.activePresetId === preset.id ? "Current" : preset.enabled ? preset.type === "memory" ? "Memory" : "Fixed" : "Disabled";
        card.append(this.el("div", { class: "bs-bd-card-title" }, this.el("strong", { text: preset.name }), this.el("span", { class: "bs-bd-badge", text: active })));

        card.append(this.field("Name", this.input(preset.name, value => { preset.name = value.trim() || "Preset"; this.save(); })));
        card.append(this.field("Behavior", this.select(preset.type, [
            { value: "fixed", label: "Fixed" },
            { value: "memory", label: "Memory" }
        ], value => { preset.type = value; this.save(); this.renderSettingsIfOpen(); })));
        card.append(this.field("Status text", this.input(preset.text, value => { preset.text = value.slice(0, 128); this.save(); }, { event: "input", placeholder: "Custom status" })));
        if (preset.type === "memory") {
            card.append(this.field("Remembered", this.input(preset.rememberedText ?? "", value => { preset.rememberedText = value.slice(0, 128); this.save(); }, { event: "input", placeholder: "Last remembered text" })));
        }
        card.append(this.field("Presence", this.presenceSelect(preset.presence, value => { preset.presence = value; this.save(); })));

        const hotkey = this.input(preset.hotkey, value => { preset.hotkey = value; this.save(); }, { placeholder: "Ctrl+Alt+K" });
        hotkey.readOnly = true;
        hotkey.addEventListener("keydown", event => {
            event.preventDefault();
            event.stopPropagation();
            if (event.key === "Backspace" || event.key === "Delete" || event.key === "Escape") {
                preset.hotkey = "";
                hotkey.value = "";
            } else {
                const next = hotkeyFromEvent(event);
                if (!next) return;
                preset.hotkey = next;
                hotkey.value = next;
            }
            this.save();
        });
        card.append(this.field("Hotkey", hotkey));
        card.append(this.field("Enabled", this.checkbox(preset.enabled, checked => { preset.enabled = checked; this.save(); this.renderSettingsIfOpen(); })));

        card.append(this.el("div", { class: "bs-bd-actions" },
            this.button("Apply", () => this.applyPreset(preset.id).catch(error => this.api.UI.showToast(error.message, { type: "error" }))),
            this.button("Duplicate", () => {
                const copy = normalizePreset({ ...clone(preset), id: uid("preset"), name: `${preset.name} copy`, hotkey: "" });
                this.state.presets.push(copy);
                this.save();
                this.renderSettingsIfOpen();
            }, "secondary"),
            this.button("Delete", () => {
                if (this.state.activePresetId === preset.id) this.state.activePresetId = null;
                this.state.presets = this.state.presets.filter(p => p.id !== preset.id);
                for (const schedule of this.state.schedules) {
                    if (schedule.presetId === preset.id) schedule.presetId = undefined;
                    if (schedule.endPresetId === preset.id) schedule.endPresetId = undefined;
                }
                this.save();
                this.renderSettingsIfOpen();
            }, "danger")
        ));
        return card;
    }

    buildScheduleCard(schedule) {
        const card = this.el("div", { class: "bs-bd-card" });
        card.append(this.el("div", { class: "bs-bd-card-title" }, this.el("strong", { text: schedule.name }), this.el("span", { class: "bs-bd-badge", text: schedule.enabled ? schedule.repeat : "Disabled" })));
        card.append(this.field("Name", this.input(schedule.name, value => { schedule.name = value.trim() || "Schedule"; this.save(); })));
        card.append(this.field("Enabled", this.checkbox(schedule.enabled, checked => { schedule.enabled = checked; this.save(); this.renderSettingsIfOpen(); })));
        card.append(this.field("Starts", this.input(dtLocalValue(schedule.startsAt), value => {
            const parsed = parseDtLocal(value);
            if (Number.isFinite(parsed)) {
                const duration = schedule.endsAt ? schedule.endsAt - schedule.startsAt : undefined;
                schedule.startsAt = parsed;
                if (duration) schedule.endsAt = parsed + duration;
                delete this.state.scheduleRuns[schedule.id];
                delete this.state.scheduleEndRuns[schedule.id];
                this.save();
            }
        }, { type: "datetime-local" })));
        card.append(this.field("Repeat", this.select(schedule.repeat, [
            { value: "once", label: "Once" },
            { value: "daily", label: "Daily" },
            { value: "weekdays", label: "Weekdays" },
            { value: "weekends", label: "Weekends" },
            { value: "weekly", label: "Weekly" },
            { value: "custom", label: "Selected days" }
        ], value => { schedule.repeat = value; this.save(); this.renderSettingsIfOpen(); })));
        if (schedule.repeat === "custom") {
            const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const wrap = this.el("div", { class: "bs-bd-actions" });
            days.forEach((name, index) => wrap.append(this.checkbox(schedule.repeatDays.includes(index), checked => {
                schedule.repeatDays = checked ? [...new Set([...schedule.repeatDays, index])].sort() : schedule.repeatDays.filter(d => d !== index);
                this.save();
            }, name)));
            card.append(this.field("Days", wrap));
        }
        card.append(this.field("Start action", this.select(schedule.startBehavior, [
            { value: "preset", label: "Apply preset" },
            { value: "custom", label: "Custom status" }
        ], value => { schedule.startBehavior = value; this.save(); this.renderSettingsIfOpen(); })));
        if (schedule.startBehavior === "preset") {
            card.append(this.field("Start preset", this.presetSelect(schedule.presetId, value => { schedule.presetId = value || undefined; this.save(); }, true)));
        } else {
            card.append(this.field("Start text", this.input(schedule.startText || "", value => { schedule.startText = value.slice(0, 128); this.save(); }, { event: "input" })));
            card.append(this.field("Start presence", this.presenceSelect(schedule.startPresence || "online", value => { schedule.startPresence = value; this.save(); })));
        }

        const hasEnd = Boolean(schedule.endsAt);
        card.append(this.field("Has end", this.checkbox(hasEnd, checked => {
            schedule.endsAt = checked ? schedule.startsAt + 60 * 60_000 : undefined;
            this.save();
            this.renderSettingsIfOpen();
        }, "End this schedule")));
        if (schedule.endsAt) {
            card.append(this.field("Ends", this.input(dtLocalValue(schedule.endsAt), value => {
                const parsed = parseDtLocal(value);
                if (Number.isFinite(parsed) && parsed > schedule.startsAt) {
                    schedule.endsAt = parsed;
                    this.save();
                }
            }, { type: "datetime-local" })));
            card.append(this.field("End action", this.select(schedule.endBehavior, [
                { value: "keep", label: "Keep scheduled status" },
                { value: "restore", label: "Restore exact previous state" },
                { value: "preset", label: "Apply another preset" },
                { value: "custom", label: "Custom status" }
            ], value => { schedule.endBehavior = value; this.save(); this.renderSettingsIfOpen(); })));
            if (schedule.endBehavior === "preset") {
                card.append(this.field("End preset", this.presetSelect(schedule.endPresetId, value => { schedule.endPresetId = value || undefined; this.save(); }, true)));
            } else if (schedule.endBehavior === "custom") {
                card.append(this.field("End text", this.input(schedule.endText || "", value => { schedule.endText = value.slice(0, 128); this.save(); }, { event: "input" })));
                card.append(this.field("End presence", this.presenceSelect(schedule.endPresence || "online", value => { schedule.endPresence = value; this.save(); })));
            }
        }
        card.append(this.el("div", { class: "bs-bd-actions" },
            this.button("Run now", () => {
                const run = schedule.startBehavior === "custom"
                    ? this.applyCustom(schedule.startText || "", schedule.startPresence || "online", "schedule")
                    : schedule.presetId ? this.applyPreset(schedule.presetId, "schedule") : Promise.reject(new Error("Select a start preset first."));
                run.catch(error => this.api.UI.showToast(`BetterStatus: ${error.message}`, { type: "error" }));
            }),
            this.button("Delete", () => {
                this.state.schedules = this.state.schedules.filter(s => s.id !== schedule.id);
                delete this.state.scheduleRuns[schedule.id];
                delete this.state.scheduleEndRuns[schedule.id];
                delete this.state.schedulePreviousStates[schedule.id];
                this.save();
                this.renderSettingsIfOpen();
            }, "danger")
        ));
        return card;
    }

    buildSettingsPanel() {
        const root = this.el("div", { class: "bs-bd-root" });
        this.settingsRoot = root;

        const active = this.state.presets.find(p => p.id === this.state.activePresetId);
        root.append(this.el("div", { class: "bs-bd-header" },
            this.el("div", {},
                this.el("h2", { class: "bs-bd-title", text: "BetterStatus" }),
                this.el("p", { class: "bs-bd-subtitle", text: "BetterDiscord port — status presets, Memory mode, schedules, history and backups in a single plugin file." })
            ),
            this.el("span", { class: "bs-bd-badge", text: this.modulesReady ? "Discord API ready" : "Waiting for Discord API" })
        ));

        root.append(this.el("div", { class: "bs-bd-warning" },
            "BetterDiscord runs plugin code in Discord's renderer. Hotkeys in this port work while the Discord window is focused; true OS-wide shortcuts from the Vencord edition are intentionally not emulated with an unsafe workaround. Cloud sync is also disabled in this first port so credentials are never downgraded to plaintext storage."
        ));

        const general = this.el("div", { class: "bs-bd-section" }, this.el("h3", { text: "General" }));
        general.append(this.field("Restore on start", this.checkbox(this.state.restoreOnStart, checked => { this.state.restoreOnStart = checked; this.save(); }, "Reapply the active preset when Discord starts")));
        general.append(this.field("Hotkeys", this.checkbox(this.state.hotkeysEnabled, checked => { this.state.hotkeysEnabled = checked; this.save(); }, "Enable focused-client preset hotkeys")));
        general.append(this.field("History", this.checkbox(this.state.rememberHistory, checked => { this.state.rememberHistory = checked; this.save(); }, "Remember statuses applied by BetterStatus")));
        general.append(this.el("div", { class: "bs-bd-stats" },
            this.el("span", { class: "bs-bd-stat", text: `Presets: ${this.state.presets.length}` }),
            this.el("span", { class: "bs-bd-stat", text: `Schedules: ${this.state.schedules.length}` }),
            this.el("span", { class: "bs-bd-stat", text: `History: ${this.state.history.length}` }),
            this.el("span", { class: "bs-bd-stat", text: `Active: ${active?.name || "none"}` })
        ));
        root.append(general);

        const presets = this.el("div", { class: "bs-bd-section" }, this.el("h3", { text: "Presets" }));
        presets.append(this.el("div", { class: "bs-bd-toolbar" }, this.button("+ Add preset", () => this.addPreset())));
        if (!this.state.presets.length) presets.append(this.el("div", { class: "bs-bd-empty", text: "No presets yet. Add one to start." }));
        else presets.append(this.el("div", { class: "bs-bd-grid" }, this.state.presets.map(p => this.buildPresetCard(p))));
        root.append(presets);

        const schedules = this.el("div", { class: "bs-bd-section" }, this.el("h3", { text: "Status calendar" }));
        schedules.append(this.el("div", { class: "bs-bd-toolbar" }, this.button("+ Add schedule", () => this.addSchedule())));
        if (!this.state.schedules.length) schedules.append(this.el("div", { class: "bs-bd-empty", text: "No schedules yet." }));
        else schedules.append(this.el("div", { class: "bs-bd-grid" }, this.state.schedules.map(s => this.buildScheduleCard(s))));
        root.append(schedules);

        const history = this.el("div", { class: "bs-bd-section" }, this.el("h3", { text: "Status history" }));
        if (!this.state.history.length) history.append(this.el("div", { class: "bs-bd-empty", text: "History is empty." }));
        else {
            const list = this.el("div", { class: "bs-bd-history" });
            for (const item of this.state.history.slice(0, 50)) {
                list.append(this.el("div", { class: "bs-bd-history-item" },
                    this.el("span", { class: "bs-bd-history-text", text: item.text }),
                    this.el("div", { class: "bs-bd-actions" },
                        this.button("Apply", () => this.applyCustom(item.text, this.currentDiscordState().presence, "history").catch(error => this.api.UI.showToast(error.message, { type: "error" })), "secondary", true),
                        this.button(item.favorite ? "★" : "☆", () => { item.favorite = !item.favorite; this.state.history.sort((a, b) => Number(b.favorite) - Number(a.favorite) || b.lastUsedAt - a.lastUsedAt); this.save(); this.renderSettingsIfOpen(); }, "secondary", true),
                        this.button("×", () => { this.state.history = this.state.history.filter(h => h.id !== item.id); this.save(); this.renderSettingsIfOpen(); }, "danger", true)
                    )
                ));
            }
            history.append(list);
        }
        root.append(history);

        const backup = this.el("div", { class: "bs-bd-section" }, this.el("h3", { text: "Backup & transfer" }));
        const file = this.el("input", { type: "file", accept: ".json,application/json" });
        file.style.display = "none";
        file.addEventListener("change", async () => {
            try {
                await this.importBackup(file.files?.[0]);
                this.api.UI.showToast("BetterStatus backup imported", { type: "success" });
            } catch (error) {
                this.api.UI.showToast(`Import failed: ${error.message}`, { type: "error", timeout: 7000 });
            }
        });
        backup.append(this.el("div", { class: "bs-bd-toolbar" },
            this.button("Export JSON", () => this.exportBackup()),
            this.button("Import JSON", () => file.click(), "secondary")
        ), file, this.el("div", { class: "bs-bd-muted", text: "The importer accepts this BetterDiscord backup format and the original BetterStatus Vencord backup format." }));
        root.append(backup);

        return root;
    }

    getSettingsPanel() {
        return this.buildSettingsPanel();
    }
};