const G = globalThis as any;
const Bd = G.BdApi;
if (!Bd) throw new Error("BetterStatus requires BetterDiscord/BdApi.");

const api = new Bd("BetterStatus");
const React = Bd.React;
const listeners = new Set<() => void>();
let singleton: any;

function clone<T>(value: T): T {
  if (value === undefined) return value;
  return JSON.parse(JSON.stringify(value));
}

export function definePluginSettings(definitions: Record<string, any>) {
  if (singleton) return singleton;

  const defaults: Record<string, any> = {};
  for (const [key, definition] of Object.entries(definitions)) {
    if (Object.prototype.hasOwnProperty.call(definition, "default"))
      defaults[key] = clone((definition as any).default);
  }

  let saved = api.Data.load("settings") || {};
  const legacy = api.Data.load("state");
  if ((!saved || !Object.keys(saved).length) && legacy && typeof legacy === "object") {
    saved = {
      presets: legacy.presets,
      schedules: legacy.schedules,
      savedStatuses: legacy.history,
      activePresetId: legacy.activePresetId
    };
  }

  const state: Record<string, any> = { ...defaults, ...(saved || {}) };
  const persist = () => api.Data.save("settings", state);
  const notify = () => {
    persist();
    for (const listener of [...listeners]) {
      try { listener(); } catch {}
    }
  };

  const store = new Proxy(state, {
    set(target, property, value) {
      target[property as any] = value;
      notify();
      return true;
    },
    deleteProperty(target, property) {
      delete target[property as any];
      notify();
      return true;
    }
  });

  const settings: any = {
    store,
    plain: state,
    def: definitions,
    definitions,
    pluginName: "BetterStatus",
    use(keys?: string[]) {
      const [, rerender] = React.useReducer((value: number) => value + 1, 0);
      React.useEffect(() => {
        listeners.add(rerender);
        return () => listeners.delete(rerender);
      }, []);

      if (!keys) return store;
      const result: Record<string, any> = {};
      for (const key of keys) result[key] = store[key];
      return result;
    },
    withPrivateSettings<T extends object>() {
      return this;
    }
  };

  singleton = settings;
  persist();
  return settings;
}

export function migratePluginSettings() {
  // BetterDiscord owns a single BetterStatus data namespace, so there is no
  // Vencord plugin-name migration to perform here.
}
