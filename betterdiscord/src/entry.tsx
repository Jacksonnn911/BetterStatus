import SettingsComponent from "../../src/Settings";
import BetterStatusPlugin from "../../src/index";
import { React } from "./compat";
import Native from "./native";

const G = globalThis as any;
const api = new G.BdApi("BetterStatus");

export default class BetterStatusBetterDiscord {
  meta: any;

  constructor(meta: any) {
    this.meta = meta;
  }

  start() {
    G.Vencord ??= {};
    G.Vencord.Plugins ??= {};
    G.Vencord.Plugins.plugins ??= {};
    G.Vencord.Plugins.plugins.BetterStatus = BetterStatusPlugin;
    G.VencordNative ??= {};
    G.VencordNative.pluginHelpers ??= {};
    G.VencordNative.pluginHelpers.BetterStatus = Native;
    Native.attachRuntime(BetterStatusPlugin);

    const css = G.__BETTERSTATUS_SOURCE_CSS__;
    if (css) api.DOM.addStyle(css);

    try {
      BetterStatusPlugin.start?.call(BetterStatusPlugin);
      api.Logger.info("Started the original BetterStatus runtime through the BetterDiscord compatibility layer.");
    } catch (error) {
      api.Logger.error("BetterStatus failed to start", error);
      api.UI.showToast(`BetterStatus failed to start: ${error instanceof Error ? error.message : String(error)}`, { type: "error", timeout: 10000 });
      throw error;
    }
  }

  stop() {
    try {
      BetterStatusPlugin.stop?.call(BetterStatusPlugin);
    } finally {
      Native.unregisterAll();
      api.DOM.removeStyle();
    }
  }

  getSettingsPanel() {
    return React.createElement(SettingsComponent);
  }
}