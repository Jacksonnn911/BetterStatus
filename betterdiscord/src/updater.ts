const G = globalThis as any;
const Bd = G.BdApi;
if (!Bd) throw new Error("BetterStatus requires BetterDiscord/BdApi.");

const api = new Bd("BetterStatus");
const REPOSITORY = "Jacksonnn911/BetterStatus";
const COMMIT = typeof __BETTERSTATUS_COMMIT__ !== "undefined" ? __BETTERSTATUS_COMMIT__ : "development";
const BUILD_CHANNEL = typeof __BETTERSTATUS_CHANNEL__ !== "undefined" ? __BETTERSTATUS_CHANNEL__ : "betterdiscord-port";
let pendingRestartVersion: string | undefined;
let updatePromise: Promise<any> | undefined;

function normalizeChannel(value: string) {
  return value === "dev" ? "dev" : "prod";
}

function branchFor(channel: string) {
  // Test builds update from their own branch so they never query a production
  // path that does not exist before the port is merged.
  if (BUILD_CHANNEL === "betterdiscord-port") return "betterdiscord-port";
  return normalizeChannel(channel);
}

function rawPluginURL(channel: string) {
  const branch = branchFor(channel);
  return `https://raw.githubusercontent.com/${REPOSITORY}/${branch}/betterdiscord/BetterStatus.plugin.js`;
}

function parseBuild(text: string) {
  return text.match(/@build\s+([0-9a-f]{7,40}|development)/i)?.[1];
}

async function fetchRemotePlugin(channel: string) {
  const branch = branchFor(channel);
  const response = await api.Net.fetch(rawPluginURL(channel), { cache: "no-store" });
  if (!response.ok) {
    const error: any = new Error(`BetterDiscord ${branch} build is unavailable (HTTP ${response.status}).`);
    if (response.status === 403 || response.status === 429) {
      const retryAfter = Number(response.headers.get("retry-after"));
      const reset = Number(response.headers.get("x-ratelimit-reset"));
      error.retryAt = retryAfter > 0
        ? Date.now() + retryAfter * 1000
        : reset > 0
          ? reset * 1000
          : Date.now() + 15 * 60_000;
    }
    throw error;
  }

  const text = await response.text();
  if (!/@name\s+BetterStatus/.test(text) || !/module\.exports/.test(text))
    throw new Error("Downloaded BetterDiscord build is invalid.");

  return { text, version: parseBuild(text) || "unknown", branch };
}

async function getUpdateInfo(requestedChannel = "prod") {
  const channel = normalizeChannel(requestedChannel);
  const remote = await fetchRemotePlugin(channel);
  return {
    channel,
    installedChannel: BUILD_CHANNEL === "prod" || BUILD_CHANNEL === "dev" ? BUILD_CHANNEL : undefined,
    installedVersion: COMMIT,
    latestVersion: remote.version,
    status: pendingRestartVersion
      ? "restartRequired"
      : remote.version === COMMIT
        ? "current"
        : "updateAvailable"
  };
}

function checkForUpdates(enabled: boolean, requestedChannel = "prod", force = false) {
  if (!enabled) return Promise.resolve({ status: "disabled" });
  if (updatePromise) return updatePromise;

  const channel = normalizeChannel(requestedChannel);
  updatePromise = (async () => {
    try {
      const remote = await fetchRemotePlugin(channel);
      if (!force && remote.version === COMMIT)
        return { status: "current", version: COMMIT, channel };

      const req = G.require || G.window?.require;
      if (!req) throw new Error("BetterDiscord filesystem bridge is unavailable.");

      const fs = req("fs");
      const path = req("path");
      const target = path.join(Bd.Plugins.folder, "BetterStatus.plugin.js");
      fs.writeFileSync(target, remote.text, "utf8");
      pendingRestartVersion = remote.version;
      return { status: "updated", version: remote.version, channel };
    } catch (error: any) {
      return {
        status: "failed",
        error: error?.message || String(error),
        retryAt: error?.retryAt
      };
    }
  })().finally(() => {
    updatePromise = undefined;
  });

  return updatePromise;
}

export default { getUpdateInfo, checkForUpdates };
