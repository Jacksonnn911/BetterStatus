import * as esbuild from "esbuild";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const compat = path.join(here, "src", "compat.tsx");
const entry = path.join(here, "src", "entry.tsx");
const outfile = path.join(here, "BetterStatus.plugin.js");
const commit = process.env.GITHUB_SHA || process.env.BETTERSTATUS_COMMIT || "development";
const channel = process.env.GITHUB_REF_NAME || process.env.BETTERSTATUS_CHANNEL || "betterdiscord-port";

const aliases = {
  "@api/Notifications": compat,
  "@api/Settings": compat,
  "@api/UserSettings": compat,
  "@components/FormSwitch": compat,
  "@components/Link": compat,
  "@components/settings/tabs": compat,
  "@utils/native": compat,
  "@utils/types": compat,
  "@webpack/common": compat,
  "@vencord/discord-types": compat
};

const cssPlugin = {
  name: "betterstatus-css",
  setup(build) {
    build.onLoad({ filter: /styles\.css$/ }, async args => {
      const css = await readFile(args.path, "utf8");
      return {
        loader: "js",
        contents: `globalThis.__BETTERSTATUS_SOURCE_CSS__ = ${JSON.stringify(css)};`
      };
    });
  }
};

const banner = `/**
 * @name BetterStatus
 * @author Jacksonnn911 & qtmisaliba
 * @description The complete BetterStatus presence workspace, ported 1:1 from Vencord to BetterDiscord.
 * @version 1.0.0-bd
 * @website https://github.com/Jacksonnn911/BetterStatus
 * @source https://github.com/Jacksonnn911/BetterStatus
 * @build ${commit}
 * @channel ${channel}
 */`;

await esbuild.build({
  entryPoints: [entry],
  outfile,
  bundle: true,
  format: "cjs",
  platform: "browser",
  target: ["chrome120"],
  alias: aliases,
  plugins: [cssPlugin],
  jsx: "transform",
  jsxFactory: "React.createElement",
  jsxFragment: "React.Fragment",
  define: {
    __BETTERSTATUS_COMMIT__: JSON.stringify(commit),
    __BETTERSTATUS_CHANNEL__: JSON.stringify(channel)
  },
  banner: { js: banner },
  footer: { js: "module.exports = module.exports.default || module.exports;" },
  legalComments: "none",
  sourcemap: false,
  minify: false,
  logLevel: "info"
});

console.log(`Built ${path.relative(root, outfile)} from the original src/ workspace.`);