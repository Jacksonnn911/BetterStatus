import Native from "./native";

const G = globalThis as any;
const Bd = G.BdApi;
if (!Bd) throw new Error("BetterStatus requires BetterDiscord/BdApi.");

export const React = Bd.React;
export const ReactDOM = Bd.ReactDOM;
export const createRoot = Bd.ReactDOM.createRoot;
const api = new Bd("BetterStatus");

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

function clone<T>(value: T): T {
  if (value === undefined) return value;
  return JSON.parse(JSON.stringify(value));
}

const settingsListeners = new Set<() => void>();
let sharedSettingsStore: any;

export function definePluginSettings(definitions: Record<string, any>) {
  if (sharedSettingsStore) return sharedSettingsStore;

  const defaults: Record<string, any> = {};
  for (const [key, definition] of Object.entries(definitions)) {
    if (Object.prototype.hasOwnProperty.call(definition, "default")) defaults[key] = clone((definition as any).default);
  }

  let saved = api.Data.load("settings") || {};
  const legacy = api.Data.load("state");
  if ((!saved || !Object.keys(saved).length) && legacy && typeof legacy === "object") {
    saved = {
      ...saved,
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
    for (const listener of [...settingsListeners]) {
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

  const settings = {
    store,
    definitions,
    use(keys: string[]) {
      const [, rerender] = React.useReducer((value: number) => value + 1, 0);
      React.useEffect(() => {
        settingsListeners.add(rerender);
        return () => settingsListeners.delete(rerender);
      }, []);
      const result: Record<string, any> = {};
      for (const key of keys) result[key] = store[key];
      return result;
    }
  };
  sharedSettingsStore = settings;
  persist();
  return settings;
}

export function migratePluginSettings() {
  // The BetterDiscord adapter stores the exact same logical fields under BetterStatus/settings.
}

function userSettingsModules() {
  const store = Bd.Webpack.getStore("UserSettingsProtoStore");
  const actions = Bd.Webpack.getModule(
    (module: any) => module?.ProtoClass?.typeName?.endsWith?.(".PreloadedUserSettings") && typeof module.updateAsync === "function",
    { first: true, searchExports: true }
  );
  return { store, actions };
}

export function getUserSettingLazy<T>(group: string, key: string) {
  return {
    getSetting(): T | undefined {
      const { store } = userSettingsModules();
      if (group === "status" && key === "status") return store?.settings?.status?.status?.value as T;
      if (group === "status" && key === "customStatus") return store?.settings?.status?.customStatus as T;
      return store?.settings?.[group]?.[key]?.value ?? store?.settings?.[group]?.[key];
    },
    async updateSetting(value: T) {
      const { actions } = userSettingsModules();
      if (!actions?.updateAsync) throw new Error("Discord UserSettingsProtoActions is unavailable.");
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
  if (G.DiscordNative?.app?.relaunch) return G.DiscordNative.app.relaunch();
  location.reload();
}

export function Link(props: any) {
  const { href, children, ...rest } = props;
  return React.createElement("a", { ...rest, href, target: rest.target ?? "_blank", rel: "noreferrer noopener" }, children);
}

export function FormSwitch({ title, note, value, onChange, disabled }: any) {
  const Switch = Bd.Components.SwitchInput;
  return React.createElement("label", { className: "vc-form-switch-wrapper" },
    React.createElement("div", { className: "vc-form-switch-text" },
      React.createElement("div", { className: "vc-form-switch-title" }, title),
      note ? React.createElement("div", { className: "vc-form-switch-note" }, note) : null
    ),
    React.createElement(Switch, { value: Boolean(value), disabled, onChange })
  );
}

const BdButton = Bd.Components.Button;
export function Button({ variant, ...props }: any) {
  const color = variant === "danger" ? BdButton.Colors?.RED : props.color;
  return React.createElement(BdButton, { ...props, color }, props.children);
}
(Button as any).Colors = BdButton.Colors;
(Button as any).Looks = BdButton.Looks;
(Button as any).Sizes = BdButton.Sizes;

export const TextInput = Bd.Components.TextInput;

export function Select(props: any) {
  const { options = [], select, serialize, isSelected, hideBorder, ...rest } = props;
  let value = props.value;
  if (isSelected) value = options.find((option: any) => isSelected(option.value))?.value;
  if (value === undefined) value = options.find((option: any) => option.default)?.value ?? options[0]?.value;
  return React.createElement(Bd.Components.DropdownInput, {
    ...rest,
    options,
    value,
    style: hideBorder ? "transparent" : "default",
    onChange: (next: any) => select?.(serialize ? serialize(next) : next)
  });
}

export const Forms = {
  FormText({ children, className = "" }: any) {
    return React.createElement("div", { className: `vc-form-text ${className}` }, children);
  }
};

function findModalActions() {
  return Bd.Webpack.getByKeys?.("openModal", "closeModal") ||
    Bd.Webpack.getModule((module: any) => typeof module?.openModal === "function" && typeof module?.closeModal === "function");
}

export function openModal(renderer: (props: any) => any) {
  const actions = findModalActions();
  if (actions?.openModal) return actions.openModal(renderer);
  const content = renderer({ onClose() {}, transitionState: 1 });
  return api.UI.showConfirmationModal("BetterStatus", content, { confirmText: null, cancelText: "Close" });
}

let nativeConfirm: any;
function resolveConfirmModal() {
  if (nativeConfirm) return nativeConfirm;
  nativeConfirm = Bd.Webpack.getModule(
    (value: any) => typeof value === "function" && /confirmText/.test(String(value)) && /cancelText/.test(String(value)) && /onConfirm/.test(String(value)),
    { searchExports: true }
  );
  return nativeConfirm;
}

export function ConfirmModal(props: any) {
  const NativeConfirm = resolveConfirmModal();
  if (NativeConfirm) return React.createElement(NativeConfirm, props);
  const [error, setError] = React.useState("");
  const confirm = async () => {
    try {
      setError("");
      await props.onConfirm?.(setError);
      props.onClose?.();
    } catch (failure: any) {
      if (!error) setError(failure?.message || String(failure));
    }
  };
  return React.createElement("div", { className: "bs-bd-fallback-modal" },
    React.createElement("h2", null, props.title),
    props.children,
    error ? React.createElement("div", { style: { color: "var(--text-danger)", marginTop: 10 } }, error) : null,
    React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 16 } },
      React.createElement(Button, { onClick: confirm }, props.confirmText || "Confirm"),
      React.createElement(Button, { onClick: () => { props.onCancel?.(); props.onClose?.(); } }, props.cancelText || "Cancel")
    )
  );
}

let nativeOAuth: any;
function resolveOAuthModal() {
  if (nativeOAuth) return nativeOAuth;
  nativeOAuth = Bd.Webpack.getModule(
    (value: any) => typeof value === "function" && /cancelCompletesFlow/.test(String(value)) && /redirectUri/.test(String(value)) && /responseType/.test(String(value)),
    { searchExports: true }
  );
  return nativeOAuth;
}

export function OAuth2AuthorizeModal(props: any) {
  const NativeOAuth = resolveOAuthModal();
  if (NativeOAuth) return React.createElement(NativeOAuth, props);
  return React.createElement("div", { className: "bs-password-modal" },
    React.createElement(Forms.FormText, null, "Authorize BetterStatus with Discord in your browser, then return here. The sync flow will finish automatically."),
    React.createElement(Button, {
      onClick: async () => {
        try {
          await Native.openExternalAuthorization(props.state);
          await props.callback?.({ location: "betterstatus-external" });
        } catch (error: any) {
          api.UI.showToast(error?.message || String(error), { type: "error" });
        }
      }
    }, "Authorize with Discord")
  );
}

export function openPluginModal() {
  // BetterDiscord does not currently expose its internal addon-settings modal through BdApi.
  // Settings themselves remain identical; after an updater restart the user can reopen the BetterStatus cog.
}

export default React;