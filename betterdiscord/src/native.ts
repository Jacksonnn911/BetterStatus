import { scrypt } from "scrypt-js";

const G = globalThis as any;
const Bd = G.BdApi;
const api = new Bd("BetterStatus");
const REPOSITORY = "Jacksonnn911/BetterStatus";
const COMMIT = typeof __BETTERSTATUS_COMMIT__ !== "undefined" ? __BETTERSTATUS_COMMIT__ : "development";
const BUILD_CHANNEL = typeof __BETTERSTATUS_CHANNEL__ !== "undefined" ? __BETTERSTATUS_CHANNEL__ : "betterdiscord-port";
const AAD = new TextEncoder().encode("BetterStatus encrypted sync document v1");
const VAULT_AAD = new TextEncoder().encode("BetterStatus BetterDiscord secure sessions v1");
const pendingAuth = new Map<string, { server: string; verifier: string; expiresAt: number; authorizeUrl: string; state: string }>();
const sockets = new Map<string, WebSocket>();
const shortcutIds = new Map<number, string>();
let runtime: any;
let pendingRestartVersion: string | undefined;
let updatePromise: Promise<any> | undefined;

function bytesToBase64url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64urlToBytes(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  const binary = atob(normalized);
  return Uint8Array.from(binary, char => char.charCodeAt(0));
}

function randomBytes(length: number) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

function randomId() {
  return bytesToBase64url(randomBytes(9));
}

async function sha256(bytes: Uint8Array) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
}

function normalizeServerURL(value: string) {
  const url = new URL(value.trim());
  if (url.protocol !== "https:" && !(url.protocol === "http:" && ["localhost", "127.0.0.1", "::1"].includes(url.hostname)))
    throw new Error("Sync servers must use HTTPS (HTTP is allowed only for localhost). ");
  return url.origin;
}

function openVault(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("BetterStatusSecure", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("vault");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function vaultGet<T>(key: string): Promise<T | undefined> {
  const db = await openVault();
  return await new Promise((resolve, reject) => {
    const tx = db.transaction("vault", "readonly");
    const request = tx.objectStore("vault").get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function vaultPut(key: string, value: any) {
  const db = await openVault();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction("vault", "readwrite");
    tx.objectStore("vault").put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function vaultKey() {
  let key = await vaultGet<CryptoKey>("key");
  if (!key) {
    key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
    await vaultPut("key", key);
  }
  return key;
}

async function readSessions(): Promise<Record<string, any>> {
  const saved = await vaultGet<any>("sessions");
  if (!saved) return {};
  try {
    const key = await vaultKey();
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: base64urlToBytes(saved.iv), additionalData: VAULT_AAD }, key, base64urlToBytes(saved.data));
    return JSON.parse(new TextDecoder().decode(plain));
  } catch {
    throw new Error("Secure BetterStatus session storage could not be decrypted.");
  }
}

async function writeSessions(sessions: Record<string, any>) {
  const key = await vaultKey();
  const iv = randomBytes(12);
  const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: VAULT_AAD }, key, new TextEncoder().encode(JSON.stringify(sessions))));
  await vaultPut("sessions", { iv: bytesToBase64url(iv), data: bytesToBase64url(encrypted) });
}

async function cloudSession(serverURL: string) {
  const server = normalizeServerURL(serverURL);
  const sessions = await readSessions();
  const session = sessions[server];
  if (!session || new Date(session.expiresAt).getTime() <= Date.now()) return undefined;
  if (!session.clientId) {
    session.clientId = randomId();
    await writeSessions(sessions);
  }
  return { server, session };
}

async function netFetch(input: string | URL, init?: any) {
  return await api.Net.fetch(input, init);
}

async function cloudRequest(server: string, path: string, token: string, init: any = {}) {
  const response = await netFetch(`${server}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers || {})
    }
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const error: any = new Error(body.error || `Sync server returned HTTP ${response.status}`);
    error.status = response.status;
    error.current = body.current;
    throw error;
  }
  return response;
}

async function deriveSyncKey(password: string, salt: Uint8Array) {
  const pass = new TextEncoder().encode(password.normalize("NFKC"));
  const raw = await scrypt(pass, salt, 32768, 8, 1, 32);
  return await crypto.subtle.importKey("raw", raw, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}

function isEncrypted(value: any) {
  return value?.format === "betterstatus-encrypted-sync" && value?.version === 1 && value?.kdf === "scrypt" && value?.cipher === "aes-256-gcm" &&
    [value.salt, value.iv, value.authTag, value.ciphertext].every(field => typeof field === "string");
}

async function encryptDocument(document: any, password: string) {
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const key = await deriveSyncKey(password, salt);
  const combined = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: AAD, tagLength: 128 }, key, new TextEncoder().encode(JSON.stringify(document))));
  const ciphertext = combined.slice(0, -16);
  const tag = combined.slice(-16);
  return {
    format: "betterstatus-encrypted-sync",
    version: 1,
    kdf: "scrypt",
    cipher: "aes-256-gcm",
    salt: bytesToBase64url(salt),
    iv: bytesToBase64url(iv),
    authTag: bytesToBase64url(tag),
    ciphertext: bytesToBase64url(ciphertext)
  };
}

async function decryptDocument(envelope: any, password: string) {
  try {
    const salt = base64urlToBytes(envelope.salt);
    const iv = base64urlToBytes(envelope.iv);
    const tag = base64urlToBytes(envelope.authTag);
    const ciphertext = base64urlToBytes(envelope.ciphertext);
    const key = await deriveSyncKey(password, salt);
    const combined = new Uint8Array(ciphertext.length + tag.length);
    combined.set(ciphertext);
    combined.set(tag, ciphertext.length);
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv, additionalData: AAD, tagLength: 128 }, key, combined);
    const document = JSON.parse(new TextDecoder().decode(plain));
    if (document?.version !== 1 && document?.version !== 2) throw new Error();
    return document;
  } catch {
    throw new Error("The sync password is incorrect or the encrypted data is damaged.");
  }
}

function deliverSnapshot(snapshot: any) {
  try { runtime?.receiveCloudSnapshot?.(snapshot); } catch (error) { console.error("[BetterStatus] sync snapshot failed", error); }
}

function connectSocket(server: string, session: any) {
  sockets.get(server)?.close();
  const url = new URL(server);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.pathname = "/v1/sync/ws";
  const socket = new WebSocket(url);
  sockets.set(server, socket);
  const timeout = setTimeout(() => { if (socket.readyState === WebSocket.CONNECTING) socket.close(); }, 10000);
  socket.addEventListener("open", () => socket.send(JSON.stringify({ type: "auth", token: session.token, client_id: session.clientId })));
  socket.addEventListener("message", event => {
    try {
      const payload = JSON.parse(String(event.data));
      if (payload.type === "sync" && payload.snapshot) deliverSnapshot(payload.snapshot);
    } catch (error) { console.error("[BetterStatus] invalid sync message", error); }
  });
  socket.addEventListener("close", () => {
    clearTimeout(timeout);
    if (sockets.get(server) !== socket) return;
    sockets.delete(server);
    setTimeout(async () => {
      if (sockets.has(server)) return;
      const resolved = await cloudSession(server).catch(() => undefined);
      if (resolved) connectSocket(server, resolved.session);
    }, 5000);
  });
  socket.addEventListener("error", () => socket.close());
}

function hashString(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) hash = Math.imul(hash ^ value.charCodeAt(i), 16777619);
  return (hash >>> 0) & 0x7fffffff;
}

function fallbackWindowsKey(name: string) {
  const upper = name.toUpperCase();
  if (/^[A-Z]$/.test(upper)) return upper.charCodeAt(0);
  if (/^[0-9]$/.test(upper)) return upper.charCodeAt(0);
  const map: Record<string, number> = {
    CONTROL: 0xA2, CTRL: 0xA2, SHIFT: 0xA0, ALT: 0xA4, COMMAND: 0x5B, META: 0x5B,
    SPACE: 0x20, ENTER: 0x0D, ESCAPE: 0x1B, ESC: 0x1B, TAB: 0x09,
    UP: 0x26, DOWN: 0x28, LEFT: 0x25, RIGHT: 0x27,
    "-": 0xBD, "=": 0xBB, "[": 0xDB, "]": 0xDD, ";": 0xBA, "'": 0xDE, ",": 0xBC, ".": 0xBE, "/": 0xBF, "\\": 0xDC, "`": 0xC0
  };
  if (map[upper] != null) return map[upper];
  const fn = upper.match(/^F(\d{1,2})$/);
  if (fn) return 0x70 + Number(fn[1]) - 1;
  return undefined;
}

function discordKeyMap() {
  try {
    return Bd.Webpack.getModule((value: any) => value && typeof value === "object" && typeof value.ctrl === "number" && typeof value.shift === "number" && typeof value.alt === "number", { searchExports: true });
  } catch { return undefined; }
}

function keyCode(name: string, keyMap: any) {
  const lower = name.toLowerCase();
  const aliases: Record<string, string[]> = {
    control: ["ctrl", "control", "leftControl"], ctrl: ["ctrl", "control", "leftControl"],
    command: ["meta", "command", "cmd", "super"], meta: ["meta", "command", "cmd", "super"],
    alt: ["alt"], shift: ["shift"], space: ["space"], escape: ["escape", "esc"], esc: ["escape", "esc"],
    up: ["up", "arrowUp"], down: ["down", "arrowDown"], left: ["left", "arrowLeft"], right: ["right", "arrowRight"]
  };
  for (const candidate of aliases[lower] || [lower, name]) {
    if (typeof keyMap?.[candidate] === "number") return keyMap[candidate];
  }
  if (typeof keyMap?.[lower] === "number") return keyMap[lower];
  if (typeof keyMap?.[name] === "number") return keyMap[name];
  return fallbackWindowsKey(name);
}

function discordUtils() {
  return G.DiscordNative?.nativeModules?.requireModule?.("discord_utils");
}

function unregisterAll() {
  const utils = discordUtils();
  for (const id of shortcutIds.keys()) {
    try { utils?.inputEventUnregister?.(id); } catch {}
  }
  shortcutIds.clear();
}

function registerHotkeys(presets: any[]) {
  unregisterAll();
  const utils = discordUtils();
  const keyMap = discordKeyMap();
  const results: any[] = [];
  if (!utils?.inputEventRegister) return presets.map(preset => ({ id: preset.id, registered: false, error: "Discord global keybind API is unavailable." }));

  for (const preset of presets) {
    if (!preset.enabled || !preset.hotkey) continue;
    const parts = String(preset.hotkey).split("+").filter(Boolean);
    const codes = parts.map(part => keyCode(part, keyMap));
    if (codes.some(code => typeof code !== "number")) {
      results.push({ id: preset.id, registered: false, error: `Unsupported shortcut: ${preset.hotkey}` });
      continue;
    }
    let id = hashString(`BetterStatus:${preset.id}`) || 1;
    while (shortcutIds.has(id)) id++;
    try {
      utils.inputEventRegister(id, codes.map(code => [0, code]), (isDown: boolean) => {
        if (isDown) runtime?.triggerPreset?.(preset.id);
      }, { blurred: true, focused: true, keydown: true, keyup: true });
      shortcutIds.set(id, preset.id);
      results.push({ id: preset.id, registered: true });
    } catch (error: any) {
      results.push({ id: preset.id, registered: false, error: error?.message || String(error) });
    }
  }
  return results;
}

function rawPluginURL(channel: string) {
  const branch = channel === "dev" ? "dev" : "prod";
  return `https://raw.githubusercontent.com/${REPOSITORY}/${branch}/betterdiscord/BetterStatus.plugin.js`;
}

function parseBuild(text: string) {
  return text.match(/@build\s+([0-9a-f]{7,40}|development)/i)?.[1];
}

async function fetchRemotePlugin(channel: string) {
  const response = await netFetch(rawPluginURL(channel), { cache: "no-store" });
  if (!response.ok) {
    const error: any = new Error(`BetterDiscord build is unavailable on ${channel} (HTTP ${response.status}).`);
    if (response.status === 403 || response.status === 429) {
      const retryAfter = Number(response.headers.get("retry-after"));
      const reset = Number(response.headers.get("x-ratelimit-reset"));
      error.retryAt = retryAfter > 0 ? Date.now() + retryAfter * 1000 : reset > 0 ? reset * 1000 : Date.now() + 15 * 60_000;
    }
    throw error;
  }
  const text = await response.text();
  if (!/@name\s+BetterStatus/.test(text) || !/module\.exports/.test(text)) throw new Error("Downloaded BetterDiscord build is invalid.");
  return { text, version: parseBuild(text) || "unknown" };
}

async function getUpdateInfo(requestedChannel = "prod") {
  const channel = requestedChannel === "dev" ? "dev" : "prod";
  const remote = await fetchRemotePlugin(channel);
  return {
    channel,
    installedChannel: BUILD_CHANNEL === "dev" ? "dev" : BUILD_CHANNEL === "prod" ? "prod" : undefined,
    installedVersion: COMMIT,
    latestVersion: remote.version,
    status: pendingRestartVersion ? "restartRequired" : remote.version === COMMIT ? "current" : "updateAvailable"
  };
}

function checkForUpdates(enabled: boolean, requestedChannel = "prod", force = false) {
  if (!enabled) return Promise.resolve({ status: "disabled" });
  if (updatePromise) return updatePromise;
  const channel = requestedChannel === "dev" ? "dev" : "prod";
  updatePromise = (async () => {
    try {
      const remote = await fetchRemotePlugin(channel);
      if (!force && remote.version === COMMIT) return { status: "current", version: COMMIT, channel };
      if (force && remote.version === COMMIT) return { status: "current", version: COMMIT, channel };
      const req = G.require || G.window?.require;
      if (!req) throw new Error("BetterDiscord filesystem bridge is unavailable.");
      const fs = req("fs");
      const path = req("path");
      const target = path.join(Bd.Plugins.folder, "BetterStatus.plugin.js");
      fs.writeFileSync(target, remote.text, "utf8");
      pendingRestartVersion = remote.version;
      return { status: "updated", version: remote.version, channel };
    } catch (error: any) {
      return { status: "failed", error: error?.message || String(error), retryAt: error?.retryAt };
    }
  })().finally(() => { updatePromise = undefined; });
  return updatePromise;
}

async function getCloudSyncStatus(serverURL: string) {
  const resolved = await cloudSession(serverURL);
  return resolved ? {
    connected: true,
    discordUserId: resolved.session.discordUserId,
    expiresAt: resolved.session.expiresAt,
    encryptionPasswordSet: Boolean(resolved.session.encryptionPassword)
  } : { connected: false };
}

async function beginCloudSyncAuthorization(serverURL: string) {
  const server = normalizeServerURL(serverURL);
  const verifier = bytesToBase64url(randomBytes(32));
  const challenge = bytesToBase64url(await sha256(new TextEncoder().encode(verifier)));
  const response = await netFetch(`${server}/v1/auth/requests`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ challenge })
  });
  if (!response.ok) throw new Error(`Could not start Discord authorization (HTTP ${response.status}).`);
  const request = await response.json();
  const authorize = new URL(request.authorize_url);
  const clientId = authorize.searchParams.get("client_id");
  const redirectUri = authorize.searchParams.get("redirect_uri");
  const state = authorize.searchParams.get("state");
  if (authorize.origin !== "https://discord.com" || !clientId || !redirectUri || !state) throw new Error("The sync server returned an invalid Discord authorization request.");
  const expiresAt = Math.min(new Date(request.expires_at).getTime(), Date.now() + 10 * 60_000);
  pendingAuth.set(request.request_id, { server, verifier, expiresAt, authorizeUrl: authorize.toString(), state });
  return { requestId: request.request_id, clientId, redirectUri, state };
}

async function openExternalAuthorization(state: string) {
  const pending = [...pendingAuth.values()].find(item => item.state === state);
  if (!pending) throw new Error("Discord authorization request expired.");
  if (G.DiscordNative?.nativeModules?.requireModule) {
    try {
      const shell = G.require?.("electron")?.shell;
      if (shell?.openExternal) return await shell.openExternal(pending.authorizeUrl);
    } catch {}
  }
  window.open(pending.authorizeUrl, "_blank", "noopener,noreferrer");
}

async function completeCloudSyncAuthorization(serverURL: string, requestId: string, callbackLocation: string) {
  const server = normalizeServerURL(serverURL);
  const pending = pendingAuth.get(requestId);
  if (!pending || pending.server !== server || pending.expiresAt <= Date.now()) throw new Error("Discord authorization expired. Please try again.");
  if (callbackLocation !== "betterstatus-external") {
    const callback = new URL(callbackLocation);
    if (callback.origin !== server || callback.pathname !== "/v1/oauth/callback") throw new Error("Discord returned an invalid sync callback URL.");
    const response = await netFetch(callback.toString(), { headers: { Accept: "text/html" } });
    if (!response.ok) throw new Error(`Discord authorization callback failed (HTTP ${response.status}).`);
  }
  try {
    while (Date.now() < pending.expiresAt) {
      const response = await netFetch(`${server}/v1/auth/requests/${encodeURIComponent(requestId)}/exchange`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ verifier: pending.verifier })
      });
      if (response.status === 409) { await new Promise(resolve => setTimeout(resolve, 500)); continue; }
      if (!response.ok) throw new Error(`Discord authorization failed (HTTP ${response.status}).`);
      const result = await response.json();
      const sessions = await readSessions();
      sessions[server] = { token: result.token, expiresAt: result.expires_at, discordUserId: result.discord_user_id, clientId: randomId() };
      await writeSessions(sessions);
      connectSocket(server, sessions[server]);
      return { connected: true, discordUserId: result.discord_user_id, expiresAt: result.expires_at };
    }
  } finally { pendingAuth.delete(requestId); }
  throw new Error("Discord authorization expired. Please try again.");
}

async function pullCloudSync(serverURL: string) {
  const resolved = await cloudSession(serverURL);
  if (!resolved) throw new Error("Connect Discord before synchronizing.");
  const response = await cloudRequest(resolved.server, "/v1/sync", resolved.session.token, { headers: { "X-BetterStatus-Client": resolved.session.clientId } });
  return await response.json();
}

async function startCloudSync(serverURL: string) {
  const resolved = await cloudSession(serverURL);
  if (!resolved) return { connected: false };
  const response = await cloudRequest(resolved.server, "/v1/sync", resolved.session.token, { headers: { "X-BetterStatus-Client": resolved.session.clientId } });
  const snapshot = await response.json();
  connectSocket(resolved.server, resolved.session);
  return { connected: true, discordUserId: resolved.session.discordUserId, expiresAt: resolved.session.expiresAt, snapshot };
}

async function decodeCloudSyncSnapshot(serverURL: string, snapshot: any) {
  if (!isEncrypted(snapshot.document)) return { snapshot, encrypted: false, locked: false };
  const resolved = await cloudSession(serverURL);
  const password = resolved?.session.encryptionPassword;
  if (!password) return { snapshot, encrypted: true, locked: true };
  try {
    return { snapshot: { ...snapshot, document: await decryptDocument(snapshot.document, password) }, encrypted: true, locked: false };
  } catch { return { snapshot, encrypted: true, locked: true }; }
}

async function unlockCloudSync(serverURL: string, password: string) {
  const resolved = await cloudSession(serverURL);
  if (!resolved) throw new Error("Connect Discord before unlocking cloud sync.");
  const response = await cloudRequest(resolved.server, "/v1/sync", resolved.session.token);
  const snapshot = await response.json();
  if (!isEncrypted(snapshot.document)) throw new Error("This sync account is not password protected.");
  const document = await decryptDocument(snapshot.document, password);
  const sessions = await readSessions();
  sessions[resolved.server] = { ...resolved.session, encryptionPassword: password };
  await writeSessions(sessions);
  return { snapshot: { ...snapshot, document }, encrypted: true, locked: false };
}

async function setCloudEncryptionPassword(serverURL: string, password: string) {
  if (password.length < 12) throw new Error("Use at least 12 characters.");
  const resolved = await cloudSession(serverURL);
  if (!resolved) throw new Error("Connect Discord before changing cloud protection.");
  const sessions = await readSessions();
  sessions[resolved.server] = { ...resolved.session, encryptionPassword: password };
  await writeSessions(sessions);
  return { encryptionPasswordSet: true };
}

async function clearCloudEncryptionPassword(serverURL: string) {
  const resolved = await cloudSession(serverURL);
  if (!resolved) throw new Error("Connect Discord before changing cloud protection.");
  const sessions = await readSessions();
  sessions[resolved.server] = { ...resolved.session };
  delete sessions[resolved.server].encryptionPassword;
  await writeSessions(sessions);
  return { encryptionPasswordSet: false };
}

async function pushCloudSync(serverURL: string, baseRevision: number, document: any) {
  const resolved = await cloudSession(serverURL);
  if (!resolved) throw new Error("Connect Discord before synchronizing.");
  const outgoing = resolved.session.encryptionPassword ? await encryptDocument(document, resolved.session.encryptionPassword) : document;
  try {
    const maxClock = (document.events || []).reduce((max: number, event: any) => Math.max(max, event.clock), 0);
    const response = await cloudRequest(resolved.server, "/v1/sync", resolved.session.token, {
      method: "PUT",
      headers: {
        "X-BetterStatus-Client": resolved.session.clientId,
        "X-BetterStatus-Schema": String(document.version),
        "X-BetterStatus-Events": String(document.events?.length || 0),
        "X-BetterStatus-Max-Clock": String(maxClock)
      },
      body: JSON.stringify({ base_revision: baseRevision, document: outgoing })
    });
    return { ...(await response.json()), conflict: false };
  } catch (error: any) {
    if (error.status === 409 && error.current) return { ...error.current, conflict: true };
    throw error;
  }
}

async function disconnectCloudSync(serverURL: string) {
  const server = normalizeServerURL(serverURL);
  const sessions = await readSessions();
  const session = sessions[server];
  sockets.get(server)?.close();
  sockets.delete(server);
  if (session) {
    await cloudRequest(server, "/v1/session", session.token, { method: "DELETE" }).catch(() => undefined);
    delete sessions[server];
    await writeSessions(sessions);
  }
  return { connected: false };
}

const Native = {
  attachRuntime(value: any) { runtime = value; },
  registerHotkeys,
  unregisterAll,
  getUpdateInfo,
  checkForUpdates,
  getCloudSyncStatus,
  beginCloudSyncAuthorization,
  completeCloudSyncAuthorization,
  openExternalAuthorization,
  pullCloudSync,
  startCloudSync,
  decodeCloudSyncSnapshot,
  unlockCloudSync,
  setCloudEncryptionPassword,
  clearCloudEncryptionPassword,
  pushCloudSync,
  disconnectCloudSync
};

export default Native;