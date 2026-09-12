import Native from "./native";

const G = globalThis as any;
const Bd = G.BdApi;
if (!Bd) throw new Error("BetterStatus requires BetterDiscord/BdApi.");

const api = new Bd("BetterStatus");
export const React = Bd.React;
export const ReactDOM = Bd.ReactDOM;
export const createRoot = Bd.ReactDOM.createRoot;

G.Vencord ??= {};
G.Vencord.Plugins ??= {};
G.Vencord.Plugins.plugins ??= {};
G.VencordNative ??= {};
G.VencordNative.pluginHelpers ??= {};
G.VencordNative.pluginHelpers.BetterStatus = Native;

export const OptionType = Object.freeze({ CUSTOM: "CUSTOM", COMPONENT: "COMPONENT" });
export type PluginNative<T> = T;
export type RenderModalProps = Record<string, any>;

export function definePlugin<T>(plugin: T): T {
  return plugin;
}

// @utils/types is aliased to this module. The original BetterStatus index uses
// the default export as Vencord's definePlugin helper, so keep this default
// exactly compatible rather than exporting React or a BetterDiscord component.
export default definePlugin;

function userSettingsModules() {
  const store = Bd.Webpack.getStore("UserSettingsProtoStore");
  let actions = Bd.Webpack.getModule(
    (module: any) => module?.ProtoClass?.typeName?.endsWith?.(".PreloadedUserSettings"),
    { first: true, searchExports: true }
  );

  if (!actions?.updateAsync) {
    actions = Bd.Webpack.getModule(
      (module: any) => typeof module?.updateAsync === "function" && /UserSettings|settings/i.test(String(module.updateAsync)),
      { first: true, searchExports: true }
    );
  }

  return { store, actions };
}

export function getUserSettingLazy<T>(group: string, key: string) {
  return {
    getSetting(): T | undefined {
      const { store } = userSettingsModules();
      if (group === "status" && key === "status")
        return store?.settings?.status?.status?.value as T;
      if (group === "status" && key === "customStatus")
        return store?.settings?.status?.customStatus as T;
      return store?.settings?.[group]?.[key]?.value ?? store?.settings?.[group]?.[key];
    },

    async updateSetting(value: T) {
      const { actions } = userSettingsModules();
      if (!actions?.updateAsync)
        throw new Error("Discord UserSettingsProtoActions is unavailable.");

      await actions.updateAsync(group, (draft: any) => {
        if (group === "status" && key === "status") {
          draft.status ??= {};
          draft.status.value = value;
        } else if (group === "status" && key === "customStatus") {
          draft.customStatus = value;
        } else {
          draft[key] = value;
        }
      }, 0);
    }
  };
}

export function showNotification(options: any) {
  return api.UI.showNotification({
    title: options?.title || "BetterStatus",
    content: options?.richBody ?? options?.body ?? "",
    type: /failed|error/i.test(options?.title || "") ? "error" : "info",
    duration: options?.noPersist ? 6000 : 8000
  });
}

export function relaunch() {
  if (G.DiscordNative?.app?.relaunch)
    return G.DiscordNative.app.relaunch();
  location.reload();
}

export function Link(props: any) {
  const { href, children, ...rest } = props;
  return React.createElement(
    "a",
    {
      ...rest,
      href,
      target: rest.target ?? "_blank",
      rel: rest.rel ?? "noreferrer noopener"
    },
    children
  );
}

export function openPluginModal() {
  // BetterDiscord owns the settings navigation. The plugin settings panel is
  // exposed through getSettingsPanel(); this optional hook is populated when a
  // host-specific opener is available.
  G.__BETTERSTATUS_OPEN_SETTINGS__?.();
}
