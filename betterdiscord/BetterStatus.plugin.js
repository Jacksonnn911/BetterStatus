/**
 * @name BetterStatus
 * @author Jacksonnn911 & qtmisaliba
 * @description The complete BetterStatus presence workspace for BetterDiscord.
 * @version 1.0.0-bd
 * @website https://github.com/Jacksonnn911/BetterStatus
 * @source https://github.com/Jacksonnn911/BetterStatus
 * @build 184805ee4edd25c1007f8dad333b4799dc5b46ef
 * @channel betterdiscord-port
 */
globalThis.__BETTERSTATUS_COMPAT_CSS__ = ".vc-btn-base {\n  position: relative;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  max-width: 100%;\n  border: 1px solid transparent;\n  border-radius: var(--radius-sm, 8px);\n  font-family: var(--font-primary);\n  text-align: start;\n  transition: 50ms ease-in;\n  transition-property: background-color, color, border-color, opacity;\n  background: var(--control-secondary-background-default);\n  color: var(--text-default);\n  white-space: nowrap;\n  cursor: pointer;\n}\n.vc-btn-base:hover { transition: .15s ease-out; }\n.vc-btn-base:disabled { opacity: .5; pointer-events: none; cursor: not-allowed; }\n.vc-btn-base:focus-visible { box-shadow: 0 0 0 4px var(--__adaptive-focus-ring-color, var(--border-focus, #00b0f4)); }\n.vc-btn-min,.vc-btn-xs { padding: 3px 7px; min-height: 22px; min-width: unset; font-size: 12px; font-weight: 400; line-height: 1.3333; }\n.vc-btn-xs { min-width: 60px; }\n.vc-btn-small { padding: 3px 11px; min-height: 30px; min-width: 60px; font-size: 14px; font-weight: 500; line-height: 1.2857; }\n.vc-btn-medium { padding: 7px 15px; min-height: 38px; min-width: 100px; font-size: 16px; font-weight: 500; line-height: 1.25; }\n.vc-btn-iconOnly { width: 32px; height: 32px; min-width: unset; min-height: unset; padding: 0; background-color: transparent; border-color: transparent; }\n.vc-btn-iconOnly:hover { background-color: var(--control-icon-only-background-hover); border-color: var(--control-icon-only-border-hover); }\n.vc-btn-primary { background-color: var(--control-primary-background-default); border-color: var(--control-primary-border-default); color: var(--control-primary-text-default); }\n.vc-btn-primary:hover { background-color: var(--control-primary-background-hover); border-color: var(--control-primary-border-hover); color: var(--control-primary-text-hover); }\n.vc-btn-secondary,.vc-btn-link { background-color: var(--control-secondary-background-default); border-color: var(--control-secondary-border-default); color: var(--control-secondary-text-default); }\n.vc-btn-secondary:hover,.vc-btn-link:hover { background-color: var(--control-secondary-background-hover); border-color: var(--control-secondary-border-hover); color: var(--control-secondary-text-hover); }\n.vc-btn-dangerPrimary { background-color: var(--control-critical-primary-background-default); border-color: var(--control-critical-primary-border-default); color: var(--control-critical-primary-text-default); }\n.vc-btn-dangerPrimary:hover { background-color: var(--control-critical-primary-background-hover); border-color: var(--control-critical-primary-border-hover); color: var(--control-critical-primary-text-hover); }\n.vc-btn-dangerSecondary { background-color: var(--control-critical-secondary-background-default); border-color: var(--control-critical-secondary-border-default); color: var(--control-critical-secondary-text-default); }\n.vc-btn-overlayPrimary { background-color: var(--control-overlay-primary-background-default); border-color: var(--control-overlay-primary-border-default); color: var(--control-overlay-primary-text-default); }\n.vc-btn-positive { background-color: var(--control-connected-background-default, var(--green-430)); color: var(--white); }\n.vc-btn-none { background-color: transparent; border-color: transparent; color: var(--control-icon-only-icon-default); }\n.vc-text-btn-base { display: inline-flex; justify-content: center; align-items: center; gap: var(--space-4, 4px); background: initial; color: var(--text-default); font-size: medium; font-weight: 400; margin: 0; padding: 0; text-align: start; text-decoration: none; max-width: 100%; white-space: nowrap; border: 0; cursor: pointer; }\n.vc-text-btn-base:hover { text-decoration: underline; }\n.vc-text-btn-primary { color: var(--text-brand); }\n.vc-text-btn-secondary { color: var(--text-strong, var(--text-default)); }\n.vc-text-btn-danger { color: var(--text-feedback-critical); }\n.vc-text-btn-link { color: var(--text-link); }\n\n.vc-switch-container { background: var(--primary-400); border: 1px solid transparent; border-radius: 16px; box-sizing: border-box; cursor: pointer; height: 28px; position: relative; width: 44px; }\n.vc-switch-checked { background: var(--brand-500); border-color: var(--control-primary-border-default); }\n.vc-switch-disabled { cursor: not-allowed; opacity: .3; }\n.vc-switch-focusVisible { box-shadow: 0 0 0 4px var(--__adaptive-focus-ring-color, var(--border-focus, #00b0f4)); }\n.vc-switch-slider { display: block; height: 20px; left: 0; margin: 3px; position: absolute; width: 28px; transition: 100ms transform ease-in-out; overflow: visible; }\n.vc-switch-input { border-radius: 14px; cursor: pointer; height: 100%; left: 0; margin: 0; opacity: 0; position: absolute; top: 0; width: 100%; }\n.vc-switch-input:disabled { pointer-events: none; cursor: not-allowed; }\n\n.vc-form-switch-wrapper { display: block; margin-bottom: 20px; cursor: pointer; }\n.vc-form-switch { display: flex; width: 100%; align-items: center; }\n.vc-form-switch > :last-child { margin-left: auto; }\n.vc-form-switch-disabled { opacity: .5; pointer-events: none; cursor: not-allowed; }\n.vc-form-switch-text { display: flex; flex-direction: column; justify-content: center; gap: 8px; min-width: 0; padding-right: 16px; }\n.vc-form-switch-title { color: var(--text-default); font-size: 16px; font-weight: 500; line-height: 20px; }\n.vc-form-switch-description { color: var(--text-subtle); font-size: 14px; line-height: 18px; }\n.vc-form-switch-border { margin-top: 20px; height: 1px; background: var(--border-subtle, var(--background-modifier-accent)); }\n\n.vc-form-title { margin: 0 0 8px; color: var(--header-primary, var(--text-default)); font-size: 16px; font-weight: 600; line-height: 20px; }\n.vc-form-text { color: var(--text-normal, var(--text-default)); font-size: 14px; line-height: 20px; }\n.bs-bd-text-input,.bs-bd-select { width: 100%; box-sizing: border-box; border: 1px solid var(--input-border-default, var(--border-subtle)); border-radius: var(--radius-sm, 8px); background: var(--input-background-default, var(--background-tertiary)); color: var(--text-default); padding: 8px 10px; font-family: var(--font-primary); }\n.bs-bd-fallback-modal { min-width: min(520px, 90vw); color: var(--text-default); }\n.bs-bd-modal-error { color: var(--text-feedback-critical, var(--text-danger)); margin-top: 10px; }\n.bs-bd-modal-actions { display: flex; gap: 8px; margin-top: 16px; }\n.bs-bd-settings-host { width: 100%; min-width: 0; }\n";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/scrypt-js/scrypt.js
var require_scrypt = __commonJS({
  "node_modules/scrypt-js/scrypt.js"(exports, module2) {
    "use strict";
    (function(root) {
      const MAX_VALUE = 2147483647;
      function SHA256(m) {
        const K = new Uint32Array([
          1116352408,
          1899447441,
          3049323471,
          3921009573,
          961987163,
          1508970993,
          2453635748,
          2870763221,
          3624381080,
          310598401,
          607225278,
          1426881987,
          1925078388,
          2162078206,
          2614888103,
          3248222580,
          3835390401,
          4022224774,
          264347078,
          604807628,
          770255983,
          1249150122,
          1555081692,
          1996064986,
          2554220882,
          2821834349,
          2952996808,
          3210313671,
          3336571891,
          3584528711,
          113926993,
          338241895,
          666307205,
          773529912,
          1294757372,
          1396182291,
          1695183700,
          1986661051,
          2177026350,
          2456956037,
          2730485921,
          2820302411,
          3259730800,
          3345764771,
          3516065817,
          3600352804,
          4094571909,
          275423344,
          430227734,
          506948616,
          659060556,
          883997877,
          958139571,
          1322822218,
          1537002063,
          1747873779,
          1955562222,
          2024104815,
          2227730452,
          2361852424,
          2428436474,
          2756734187,
          3204031479,
          3329325298
        ]);
        let h0 = 1779033703, h1 = 3144134277, h2 = 1013904242, h3 = 2773480762;
        let h4 = 1359893119, h5 = 2600822924, h6 = 528734635, h7 = 1541459225;
        const w = new Uint32Array(64);
        function blocks(p2) {
          let off = 0, len = p2.length;
          while (len >= 64) {
            let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7, u, i2, j, t1, t2;
            for (i2 = 0; i2 < 16; i2++) {
              j = off + i2 * 4;
              w[i2] = (p2[j] & 255) << 24 | (p2[j + 1] & 255) << 16 | (p2[j + 2] & 255) << 8 | p2[j + 3] & 255;
            }
            for (i2 = 16; i2 < 64; i2++) {
              u = w[i2 - 2];
              t1 = (u >>> 17 | u << 32 - 17) ^ (u >>> 19 | u << 32 - 19) ^ u >>> 10;
              u = w[i2 - 15];
              t2 = (u >>> 7 | u << 32 - 7) ^ (u >>> 18 | u << 32 - 18) ^ u >>> 3;
              w[i2] = (t1 + w[i2 - 7] | 0) + (t2 + w[i2 - 16] | 0) | 0;
            }
            for (i2 = 0; i2 < 64; i2++) {
              t1 = (((e >>> 6 | e << 32 - 6) ^ (e >>> 11 | e << 32 - 11) ^ (e >>> 25 | e << 32 - 25)) + (e & f ^ ~e & g) | 0) + (h + (K[i2] + w[i2] | 0) | 0) | 0;
              t2 = ((a >>> 2 | a << 32 - 2) ^ (a >>> 13 | a << 32 - 13) ^ (a >>> 22 | a << 32 - 22)) + (a & b ^ a & c ^ b & c) | 0;
              h = g;
              g = f;
              f = e;
              e = d + t1 | 0;
              d = c;
              c = b;
              b = a;
              a = t1 + t2 | 0;
            }
            h0 = h0 + a | 0;
            h1 = h1 + b | 0;
            h2 = h2 + c | 0;
            h3 = h3 + d | 0;
            h4 = h4 + e | 0;
            h5 = h5 + f | 0;
            h6 = h6 + g | 0;
            h7 = h7 + h | 0;
            off += 64;
            len -= 64;
          }
        }
        blocks(m);
        let i, bytesLeft = m.length % 64, bitLenHi = m.length / 536870912 | 0, bitLenLo = m.length << 3, numZeros = bytesLeft < 56 ? 56 : 120, p = m.slice(m.length - bytesLeft, m.length);
        p.push(128);
        for (i = bytesLeft + 1; i < numZeros; i++) {
          p.push(0);
        }
        p.push(bitLenHi >>> 24 & 255);
        p.push(bitLenHi >>> 16 & 255);
        p.push(bitLenHi >>> 8 & 255);
        p.push(bitLenHi >>> 0 & 255);
        p.push(bitLenLo >>> 24 & 255);
        p.push(bitLenLo >>> 16 & 255);
        p.push(bitLenLo >>> 8 & 255);
        p.push(bitLenLo >>> 0 & 255);
        blocks(p);
        return [
          h0 >>> 24 & 255,
          h0 >>> 16 & 255,
          h0 >>> 8 & 255,
          h0 >>> 0 & 255,
          h1 >>> 24 & 255,
          h1 >>> 16 & 255,
          h1 >>> 8 & 255,
          h1 >>> 0 & 255,
          h2 >>> 24 & 255,
          h2 >>> 16 & 255,
          h2 >>> 8 & 255,
          h2 >>> 0 & 255,
          h3 >>> 24 & 255,
          h3 >>> 16 & 255,
          h3 >>> 8 & 255,
          h3 >>> 0 & 255,
          h4 >>> 24 & 255,
          h4 >>> 16 & 255,
          h4 >>> 8 & 255,
          h4 >>> 0 & 255,
          h5 >>> 24 & 255,
          h5 >>> 16 & 255,
          h5 >>> 8 & 255,
          h5 >>> 0 & 255,
          h6 >>> 24 & 255,
          h6 >>> 16 & 255,
          h6 >>> 8 & 255,
          h6 >>> 0 & 255,
          h7 >>> 24 & 255,
          h7 >>> 16 & 255,
          h7 >>> 8 & 255,
          h7 >>> 0 & 255
        ];
      }
      function PBKDF2_HMAC_SHA256_OneIter(password, salt, dkLen) {
        password = password.length <= 64 ? password : SHA256(password);
        const innerLen = 64 + salt.length + 4;
        const inner = new Array(innerLen);
        const outerKey = new Array(64);
        let i;
        let dk = [];
        for (i = 0; i < 64; i++) {
          inner[i] = 54;
        }
        for (i = 0; i < password.length; i++) {
          inner[i] ^= password[i];
        }
        for (i = 0; i < salt.length; i++) {
          inner[64 + i] = salt[i];
        }
        for (i = innerLen - 4; i < innerLen; i++) {
          inner[i] = 0;
        }
        for (i = 0; i < 64; i++) outerKey[i] = 92;
        for (i = 0; i < password.length; i++) outerKey[i] ^= password[i];
        function incrementCounter() {
          for (let i2 = innerLen - 1; i2 >= innerLen - 4; i2--) {
            inner[i2]++;
            if (inner[i2] <= 255) return;
            inner[i2] = 0;
          }
        }
        while (dkLen >= 32) {
          incrementCounter();
          dk = dk.concat(SHA256(outerKey.concat(SHA256(inner))));
          dkLen -= 32;
        }
        if (dkLen > 0) {
          incrementCounter();
          dk = dk.concat(SHA256(outerKey.concat(SHA256(inner))).slice(0, dkLen));
        }
        return dk;
      }
      function blockmix_salsa8(BY, Yi, r, x, _X) {
        let i;
        arraycopy(BY, (2 * r - 1) * 16, _X, 0, 16);
        for (i = 0; i < 2 * r; i++) {
          blockxor(BY, i * 16, _X, 16);
          salsa20_8(_X, x);
          arraycopy(_X, 0, BY, Yi + i * 16, 16);
        }
        for (i = 0; i < r; i++) {
          arraycopy(BY, Yi + i * 2 * 16, BY, i * 16, 16);
        }
        for (i = 0; i < r; i++) {
          arraycopy(BY, Yi + (i * 2 + 1) * 16, BY, (i + r) * 16, 16);
        }
      }
      function R(a, b) {
        return a << b | a >>> 32 - b;
      }
      function salsa20_8(B, x) {
        arraycopy(B, 0, x, 0, 16);
        for (let i = 8; i > 0; i -= 2) {
          x[4] ^= R(x[0] + x[12], 7);
          x[8] ^= R(x[4] + x[0], 9);
          x[12] ^= R(x[8] + x[4], 13);
          x[0] ^= R(x[12] + x[8], 18);
          x[9] ^= R(x[5] + x[1], 7);
          x[13] ^= R(x[9] + x[5], 9);
          x[1] ^= R(x[13] + x[9], 13);
          x[5] ^= R(x[1] + x[13], 18);
          x[14] ^= R(x[10] + x[6], 7);
          x[2] ^= R(x[14] + x[10], 9);
          x[6] ^= R(x[2] + x[14], 13);
          x[10] ^= R(x[6] + x[2], 18);
          x[3] ^= R(x[15] + x[11], 7);
          x[7] ^= R(x[3] + x[15], 9);
          x[11] ^= R(x[7] + x[3], 13);
          x[15] ^= R(x[11] + x[7], 18);
          x[1] ^= R(x[0] + x[3], 7);
          x[2] ^= R(x[1] + x[0], 9);
          x[3] ^= R(x[2] + x[1], 13);
          x[0] ^= R(x[3] + x[2], 18);
          x[6] ^= R(x[5] + x[4], 7);
          x[7] ^= R(x[6] + x[5], 9);
          x[4] ^= R(x[7] + x[6], 13);
          x[5] ^= R(x[4] + x[7], 18);
          x[11] ^= R(x[10] + x[9], 7);
          x[8] ^= R(x[11] + x[10], 9);
          x[9] ^= R(x[8] + x[11], 13);
          x[10] ^= R(x[9] + x[8], 18);
          x[12] ^= R(x[15] + x[14], 7);
          x[13] ^= R(x[12] + x[15], 9);
          x[14] ^= R(x[13] + x[12], 13);
          x[15] ^= R(x[14] + x[13], 18);
        }
        for (let i = 0; i < 16; ++i) {
          B[i] += x[i];
        }
      }
      function blockxor(S, Si, D, len) {
        for (let i = 0; i < len; i++) {
          D[i] ^= S[Si + i];
        }
      }
      function arraycopy(src, srcPos, dest, destPos, length) {
        while (length--) {
          dest[destPos++] = src[srcPos++];
        }
      }
      function checkBufferish(o) {
        if (!o || typeof o.length !== "number") {
          return false;
        }
        for (let i = 0; i < o.length; i++) {
          const v = o[i];
          if (typeof v !== "number" || v % 1 || v < 0 || v >= 256) {
            return false;
          }
        }
        return true;
      }
      function ensureInteger(value, name) {
        if (typeof value !== "number" || value % 1) {
          throw new Error("invalid " + name);
        }
        return value;
      }
      function _scrypt(password, salt, N, r, p, dkLen, callback) {
        N = ensureInteger(N, "N");
        r = ensureInteger(r, "r");
        p = ensureInteger(p, "p");
        dkLen = ensureInteger(dkLen, "dkLen");
        if (N === 0 || (N & N - 1) !== 0) {
          throw new Error("N must be power of 2");
        }
        if (N > MAX_VALUE / 128 / r) {
          throw new Error("N too large");
        }
        if (r > MAX_VALUE / 128 / p) {
          throw new Error("r too large");
        }
        if (!checkBufferish(password)) {
          throw new Error("password must be an array or buffer");
        }
        password = Array.prototype.slice.call(password);
        if (!checkBufferish(salt)) {
          throw new Error("salt must be an array or buffer");
        }
        salt = Array.prototype.slice.call(salt);
        let b = PBKDF2_HMAC_SHA256_OneIter(password, salt, p * 128 * r);
        const B = new Uint32Array(p * 32 * r);
        for (let i = 0; i < B.length; i++) {
          const j = i * 4;
          B[i] = (b[j + 3] & 255) << 24 | (b[j + 2] & 255) << 16 | (b[j + 1] & 255) << 8 | (b[j + 0] & 255) << 0;
        }
        const XY = new Uint32Array(64 * r);
        const V = new Uint32Array(32 * r * N);
        const Yi = 32 * r;
        const x = new Uint32Array(16);
        const _X = new Uint32Array(16);
        const totalOps = p * N * 2;
        let currentOp = 0;
        let lastPercent10 = null;
        let stop = false;
        let state = 0;
        let i0 = 0, i1;
        let Bi;
        const limit = callback ? parseInt(1e3 / r) : 4294967295;
        const nextTick = typeof setImmediate !== "undefined" ? setImmediate : setTimeout;
        const incrementalSMix = function() {
          if (stop) {
            return callback(new Error("cancelled"), currentOp / totalOps);
          }
          let steps;
          switch (state) {
            case 0:
              Bi = i0 * 32 * r;
              arraycopy(B, Bi, XY, 0, Yi);
              state = 1;
              i1 = 0;
            // Fall through
            case 1:
              steps = N - i1;
              if (steps > limit) {
                steps = limit;
              }
              for (let i = 0; i < steps; i++) {
                arraycopy(XY, 0, V, (i1 + i) * Yi, Yi);
                blockmix_salsa8(XY, Yi, r, x, _X);
              }
              i1 += steps;
              currentOp += steps;
              if (callback) {
                const percent10 = parseInt(1e3 * currentOp / totalOps);
                if (percent10 !== lastPercent10) {
                  stop = callback(null, currentOp / totalOps);
                  if (stop) {
                    break;
                  }
                  lastPercent10 = percent10;
                }
              }
              if (i1 < N) {
                break;
              }
              i1 = 0;
              state = 2;
            // Fall through
            case 2:
              steps = N - i1;
              if (steps > limit) {
                steps = limit;
              }
              for (let i = 0; i < steps; i++) {
                const offset = (2 * r - 1) * 16;
                const j = XY[offset] & N - 1;
                blockxor(V, j * Yi, XY, Yi);
                blockmix_salsa8(XY, Yi, r, x, _X);
              }
              i1 += steps;
              currentOp += steps;
              if (callback) {
                const percent10 = parseInt(1e3 * currentOp / totalOps);
                if (percent10 !== lastPercent10) {
                  stop = callback(null, currentOp / totalOps);
                  if (stop) {
                    break;
                  }
                  lastPercent10 = percent10;
                }
              }
              if (i1 < N) {
                break;
              }
              arraycopy(XY, 0, B, Bi, Yi);
              i0++;
              if (i0 < p) {
                state = 0;
                break;
              }
              b = [];
              for (let i = 0; i < B.length; i++) {
                b.push(B[i] >> 0 & 255);
                b.push(B[i] >> 8 & 255);
                b.push(B[i] >> 16 & 255);
                b.push(B[i] >> 24 & 255);
              }
              const derivedKey = PBKDF2_HMAC_SHA256_OneIter(password, b, dkLen);
              if (callback) {
                callback(null, 1, derivedKey);
              }
              return derivedKey;
          }
          if (callback) {
            nextTick(incrementalSMix);
          }
        };
        if (!callback) {
          while (true) {
            const derivedKey = incrementalSMix();
            if (derivedKey != void 0) {
              return derivedKey;
            }
          }
        }
        incrementalSMix();
      }
      const lib = {
        scrypt: function(password, salt, N, r, p, dkLen, progressCallback) {
          return new Promise(function(resolve, reject) {
            let lastProgress = 0;
            if (progressCallback) {
              progressCallback(0);
            }
            _scrypt(password, salt, N, r, p, dkLen, function(error, progress, key) {
              if (error) {
                reject(error);
              } else if (key) {
                if (progressCallback && lastProgress !== 1) {
                  progressCallback(1);
                }
                resolve(new Uint8Array(key));
              } else if (progressCallback && progress !== lastProgress) {
                lastProgress = progress;
                return progressCallback(progress);
              }
            });
          });
        },
        syncScrypt: function(password, salt, N, r, p, dkLen) {
          return new Uint8Array(_scrypt(password, salt, N, r, p, dkLen));
        }
      };
      if (typeof exports !== "undefined") {
        module2.exports = lib;
      } else if (typeof define === "function" && define.amd) {
        define(lib);
      } else if (root) {
        if (root.scrypt) {
          root._scrypt = root.scrypt;
        }
        root.scrypt = lib;
      }
    })(exports);
  }
});

// betterdiscord/src/entry.tsx
var entry_exports = {};
__export(entry_exports, {
  default: () => BetterStatusBetterDiscord
});
module.exports = __toCommonJS(entry_exports);

// src/styles.css
globalThis.__BETTERSTATUS_SOURCE_CSS__ = `.bs-settings {
  --bs-card-border: color-mix(
    in srgb,
    var(--brand-500) 18%,
    var(--background-modifier-accent)
  );

  position: relative;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 18px;
  border: 1px solid
    color-mix(in srgb, var(--brand-500) 10%, var(--background-modifier-accent));
  border-radius: 18px;
  background:
    radial-gradient(
      circle at 12% 0,
      color-mix(in srgb, var(--brand-500) 7%, transparent),
      transparent 30%
    ),
    color-mix(in srgb, var(--background-secondary) 32%, transparent);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 3%);
}

[data-mana-component="modal"]:has(.vc-settings-modal-content .bs-settings) {
  width: min(1440px, calc(100vw - 48px));
  max-width: 1440px;
}

.vc-settings-modal-content:has(.bs-settings) {
  max-width: none;
}

.bs-control-panel {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  column-gap: 15px;
  row-gap: 13px;
  padding: 16px 18px;
  border: 1px solid
    color-mix(in srgb, var(--brand-500) 24%, var(--background-modifier-accent));
  border-radius: 14px;
  background:
    radial-gradient(
      circle at 0 50%,
      color-mix(in srgb, var(--brand-500) 16%, transparent),
      transparent 24%
    ),
    linear-gradient(
      110deg,
      color-mix(in srgb, var(--brand-500) 8%, var(--background-secondary)),
      var(--background-secondary)
    );
  box-shadow:
    0 8px 24px rgb(0 0 0 / 8%),
    inset 0 1px 0 rgb(255 255 255 / 4%);
}

.bs-control-icon {
  grid-row: 1 / 3;
  display: grid;
  width: 42px;
  height: 42px;
  border: 1px solid color-mix(in srgb, var(--brand-500) 32%, transparent);
  border-radius: 13px;
  color: white;
  background: linear-gradient(145deg, var(--brand-360), var(--brand-600));
  box-shadow: 0 8px 18px color-mix(in srgb, var(--brand-500) 24%, transparent);
  font-size: 25px;
  font-weight: 500;
  place-items: center;
}

.bs-control-copy {
  min-width: 0;
  max-width: 760px;
  overflow-wrap: normal;
  word-break: normal;
}

.bs-control-copy h5 {
  margin: 0 0 3px;
}

.bs-control-copy > :last-child {
  color: var(--text-muted);
  font-size: 12px;
}

.bs-control-panel .vc-form-switch {
  gap: 8px;
  padding: 0;
}

.bs-update-actions {
  display: flex;
  align-items: center;
  min-width: 0;
  grid-column: 2;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 12px;
}

.bs-update-actions > :first-child {
    width: min(280px, 100%);
    flex: 0 1 280px;
}

.bs-update-actions > button {
    flex: 0 0 auto;
}

.bs-update-switches {
  display: flex;
  align-items: flex-start;
  flex: 0 0 auto;
  flex-direction: column;
  gap: 6px;
}

.bs-update-frequency {
  display: flex;
  width: 230px;
  flex-direction: column;
  gap: 6px;
  padding: 3px 0 7px;
}

.bs-update-frequency > span {
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 600;
}

.bs-update-actions .vc-form-switch-wrapper {
  display: flex;
  min-height: 38px;
  align-items: center;
  flex: 0 0 auto;
  margin: 0;
}

.bs-update-actions .vc-form-switch {
  width: auto;
  align-items: center;
}

.bs-update-actions .vc-form-switch > :last-child {
  margin-left: 8px;
}

.bs-update-actions .vc-form-switch-text {
  gap: 0;
  white-space: nowrap;
}

.bs-restart-guard {
  width: min(320px, 100%);
  color: var(--text-warning);
  font-size: 12px;
  line-height: 1.35;
}

.bs-update-failure-notification {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  text-align: left;
}

.bs-force-update-notification-button {
  display: inline-flex;
  min-height: 32px;
  align-items: center;
  justify-content: center;
  padding: 0 14px;
  border-radius: 6px;
  color: var(--white-500);
  background: var(--status-danger);
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

.bs-force-update-notification-button:hover,
.bs-force-update-notification-button:focus-visible {
  filter: brightness(1.1);
}

.bs-force-update-notification-button:focus-visible {
  outline: 2px solid var(--focus-primary);
  outline-offset: 2px;
}

.bs-backup-panel {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 15px;
  padding: 14px 18px;
  border: 1px solid var(--bs-card-border);
  border-radius: 14px;
  background:
    radial-gradient(circle at 100% 50%, color-mix(in srgb, #a855f7 9%, transparent), transparent 28%),
    color-mix(in srgb, var(--background-secondary) 82%, transparent);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 3%);
}

.bs-backup-mark {
  display: grid;
  width: 42px;
  height: 42px;
  border: 1px solid color-mix(in srgb, #a855f7 35%, var(--background-modifier-accent));
  border-radius: 13px;
  color: color-mix(in srgb, #c084fc 78%, white);
  background: color-mix(in srgb, #a855f7 13%, var(--background-primary));
  font-size: 22px;
  font-weight: 700;
  place-items: center;
}

.bs-backup-copy { min-width: 0; }
.bs-backup-copy h5 { margin: 0 0 3px; }
.bs-backup-copy > div { color: var(--text-muted); font-size: 12px; }

.bs-calendar-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
  border: 1px solid var(--bs-card-border);
  border-radius: 14px;
  background: color-mix(in srgb, var(--background-secondary) 92%, var(--brand-500) 8%);
}

.bs-sync-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
  border: 1px solid color-mix(in srgb, #23a559 35%, var(--background-modifier-accent));
  border-radius: 14px;
  background:
    radial-gradient(circle at 100% 0, color-mix(in srgb, #23a559 10%, transparent), transparent 32%),
    var(--background-secondary);
}

.bs-sync-controls {
  display: grid;
  grid-template-columns: minmax(220px, 0.8fr) minmax(280px, 1.2fr) auto;
  align-items: end;
  gap: 12px;
}

.bs-sync-actions {
  display: flex;
  gap: 8px;
}

.bs-danger-button {
  min-height: 38px;
  padding: 0 16px;
  border: 0;
  border-radius: 8px;
  color: var(--white-500);
  background: var(--red-400);
  cursor: pointer;
  font: inherit;
  font-weight: 650;
}

.bs-danger-button:hover:not(:disabled) { background: var(--red-430, #c9363f); }
.bs-danger-button:disabled { cursor: not-allowed; opacity: 0.55; }
.bs-danger-button:focus-visible { outline: 2px solid var(--focus-primary); outline-offset: 2px; }

.bs-sync-status {
  color: var(--text-muted);
  font-size: 13px;
}

.bs-sync-protection {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 13px 14px;
  border: 1px solid var(--background-modifier-accent);
  border-radius: 11px;
  background: color-mix(in srgb, var(--background-primary) 88%, transparent);
}

.bs-sync-protection > div:first-child {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
}

.bs-sync-protection strong { color: var(--header-primary); }
.bs-sync-protection span { color: var(--text-muted); font-size: 12px; }

.bs-sync-protection-actions {
  display: flex;
  flex: 0 0 auto;
  gap: 8px;
}

.bs-danger-text { color: var(--text-danger) !important; }

.bs-password-modal {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 6px;
}

.bs-password-input {
  box-sizing: border-box;
  width: 100%;
  min-height: 44px;
  padding: 10px 12px;
  border: 1px solid var(--input-border-default, var(--background-modifier-accent));
  border-radius: 8px;
  outline: none;
  color: var(--text-normal);
  background: var(--input-background, var(--background-secondary));
  font: inherit;
}

.bs-password-input:focus { border-color: var(--brand-500); }

.bs-section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}

.bs-section-heading h5 { margin: 0 0 4px; }
.bs-section-heading > div { min-width: 0; }

.bs-section-actions {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  gap: 8px;
}

.bs-calendar-empty {
  padding: 22px;
  border: 1px dashed var(--background-modifier-accent);
  border-radius: 12px;
  color: var(--text-muted);
  text-align: center;
}

.bs-calendar-grid {
  display: grid;
  gap: 14px;
}

.bs-schedule-card {
  position: relative;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--bs-presence-color) 28%, var(--background-modifier-accent));
  border-radius: 14px;
  background:
    linear-gradient(110deg, color-mix(in srgb, var(--bs-presence-color) 5%, transparent), transparent 32%),
    var(--background-primary);
  box-shadow: 0 10px 28px rgb(0 0 0 / 10%);
}

.bs-schedule-disabled { opacity: 0.58; }
.bs-schedule-collapsed .bs-schedule-header { border-bottom: 0; }

.bs-calendar-week {
  display: grid;
  grid-template-columns: repeat(7, minmax(72px, 1fr));
  gap: 7px;
  padding: 8px;
  border: 1px solid var(--background-modifier-accent);
  border-radius: 14px;
  background: color-mix(in srgb, var(--background-primary) 80%, transparent);
}

.bs-calendar-day {
  display: flex;
  min-height: 74px;
  align-items: center;
  flex-direction: column;
  gap: 2px;
  padding: 9px 5px;
  border-radius: 10px;
  color: var(--text-muted);
}

.bs-calendar-day > span {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.bs-calendar-day > strong { color: var(--header-primary); font-size: 20px; }
.bs-calendar-today { background: color-mix(in srgb, var(--brand-500) 14%, transparent); }
.bs-calendar-today > strong { color: var(--brand-360); }

.bs-calendar-day-events {
  display: flex;
  min-height: 9px;
  align-items: center;
  gap: 3px;
  margin-top: 3px;
}

.bs-mini-event {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--bs-presence-color);
}

.bs-calendar-day-events small { font-size: 9px; }

.bs-schedule-header {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  padding: 13px 14px;
  border-bottom: 1px solid var(--background-modifier-accent);
  background: color-mix(in srgb, var(--background-secondary) 86%, transparent);
}

.bs-schedule-date {
  display: grid;
  width: 48px;
  height: 51px;
  border: 1px solid color-mix(in srgb, var(--bs-presence-color) 42%, var(--background-modifier-accent));
  border-radius: 11px;
  overflow: hidden;
  text-align: center;
}

.bs-schedule-date span {
  align-content: center;
  color: white;
  background: var(--bs-presence-color);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.bs-schedule-date strong { align-content: center; color: var(--header-primary); font-size: 19px; }

.bs-schedule-name { display: flex; min-width: 0; flex-direction: column; gap: 3px; }
.bs-schedule-name > div { max-width: 420px; }
.bs-schedule-name > span { color: var(--text-muted); font-size: 11px; }

.bs-schedule-delete {
  display: grid;
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 9px;
  color: var(--interactive-normal);
  background: transparent;
  cursor: pointer;
  font-size: 25px;
  place-items: center;
}

.bs-schedule-delete:hover { color: white; background: var(--red-400); }

.bs-schedule-timeline { padding: 16px 18px 18px; }

.bs-timepoint {
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr);
  gap: 10px;
}

.bs-timepoint-marker { display: flex; justify-content: center; }
.bs-timepoint-marker i {
  width: 12px;
  height: 12px;
  margin-top: 5px;
  border: 3px solid color-mix(in srgb, var(--bs-presence-color) 32%, var(--background-primary));
  border-radius: 50%;
  background: var(--bs-presence-color);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--bs-presence-color) 35%, transparent);
}

.bs-timepoint-end .bs-timepoint-marker i {
  border-color: color-mix(in srgb, var(--brand-360) 40%, var(--background-primary));
  background: var(--brand-360);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--brand-360) 35%, transparent), 0 0 12px color-mix(in srgb, var(--brand-360) 28%, transparent);
}

.bs-timepoint-end .bs-timepoint-content {
  border-color: color-mix(in srgb, var(--brand-360) 24%, var(--background-modifier-accent));
  background: color-mix(in srgb, var(--background-secondary) 94%, var(--brand-500) 6%);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 4%);
}

.bs-timepoint-content {
  min-width: 0;
  padding: 13px 14px;
  border: 1px solid var(--background-modifier-accent);
  border-radius: 12px;
  background: color-mix(in srgb, var(--background-secondary) 75%, transparent);
}

.bs-timepoint-title {
  display: flex;
  min-height: 26px;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.bs-timepoint-title > span { color: var(--header-secondary); font-size: 10px; font-weight: 800; letter-spacing: 0.12em; }
.bs-timepoint-title > strong { color: var(--header-primary); font-size: 18px; }

.bs-end-time-heading {
  display: flex;
  align-items: center;
  gap: 14px;
}

.bs-end-time-heading > strong {
  color: var(--header-primary);
  font-size: 18px;
  font-weight: 700;
}

.bs-timepoint-end .vc-form-switch-text {
  color: var(--header-primary);
  font-weight: 650;
}

.bs-timeline-rail {
  display: flex;
  height: 28px;
  align-items: center;
  margin-left: 11px;
  border-left: 2px solid color-mix(in srgb, var(--bs-presence-color) 36%, var(--background-modifier-accent));
}

.bs-timeline-rail span {
  margin-left: 10px;
  padding: 2px 7px;
  border-radius: 999px;
  color: var(--text-muted);
  background: var(--background-secondary);
  font-size: 10px;
}

.bs-schedule-fields {
  display: grid;
  grid-template-columns: minmax(125px, 0.65fr) minmax(110px, 0.55fr) minmax(190px, 1fr) minmax(150px, 0.8fr);
  gap: 10px;
}

.bs-compact-field { display: flex; min-width: 0; flex-direction: column; gap: 5px; }
.bs-compact-field > span,
.bs-end-detail > span,
.bs-start-detail > span { color: var(--header-secondary); font-size: 10px; font-weight: 750; text-transform: uppercase; }

.bs-compact-field input {
  box-sizing: border-box;
  width: 100%;
  min-height: 40px;
  padding: 8px 9px;
  border: 1px solid var(--input-border-default, var(--background-modifier-accent));
  border-radius: 8px;
  outline: none;
  color: var(--text-normal);
  background: var(--input-background, var(--background-primary));
  color-scheme: dark;
  font: inherit;
}

.bs-compact-field input:focus { border-color: var(--brand-500); }
.bs-end-action-field { grid-column: span 2; }

.bs-timepoint-end .bs-compact-field input {
  border-color: color-mix(in srgb, var(--interactive-normal) 35%, var(--background-modifier-accent));
  color: var(--header-primary);
  background: var(--background-primary);
}

.bs-weekday-picker {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 12px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--background-modifier-accent);
}

.bs-weekday-picker > span {
  color: var(--text-muted);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

.bs-weekday-picker > div {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.bs-weekday-picker button {
  min-width: 42px;
  min-height: 30px;
  padding: 0 9px;
  border: 1px solid var(--background-modifier-accent);
  border-radius: 999px;
  color: var(--interactive-normal);
  background: var(--background-primary);
  cursor: pointer;
  font: inherit;
  font-size: 11px;
  font-weight: 650;
}

.bs-weekday-picker button:hover {
  color: var(--interactive-hover);
  background: var(--background-modifier-hover);
}

.bs-weekday-picker button.bs-weekday-selected {
  border-color: color-mix(in srgb, var(--brand-500) 55%, var(--background-modifier-accent));
  color: var(--white-500);
  background: var(--brand-500);
}

.bs-weekday-picker button:focus-visible {
  outline: 2px solid var(--focus-primary);
  outline-offset: 2px;
}

.bs-end-detail,
.bs-start-detail {
  display: grid;
  grid-template-columns: 110px minmax(220px, 1fr);
  align-items: center;
  gap: 10px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--background-modifier-accent);
}

.bs-custom-end-grid,
.bs-custom-start-grid {
  display: grid;
  grid-template-columns: minmax(260px, 1.25fr) minmax(220px, 1fr);
  gap: 12px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--background-modifier-accent);
}

.bs-no-end-copy { color: var(--text-muted); font-size: 12px; }

.bs-schedule-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bs-datetime-input {
  box-sizing: border-box;
  width: 100%;
  min-height: 40px;
  padding: 10px 12px;
  border: 1px solid var(--input-border-default, var(--background-modifier-accent));
  border-radius: 8px;
  outline: none;
  color: var(--text-normal);
  background: var(--input-background, var(--background-secondary));
  font: inherit;
}

.bs-datetime-input:focus {
  border-color: var(--brand-500);
}

.bs-backup-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bs-backup-status {
  margin-top: 7px;
  color: var(--brand-360) !important;
  font-weight: 600;
}

.bs-import-confirmation {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.bs-import-summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}

.bs-import-summary span {
  padding: 10px;
  border: 1px solid var(--background-modifier-accent);
  border-radius: 10px;
  color: var(--text-muted);
  background: var(--background-secondary);
  text-align: center;
}

.bs-import-summary strong {
  display: block;
  margin-bottom: 3px;
  color: var(--header-primary);
}

/* Saved statuses inside Discord's Set your status modal */
.bs-status-history {
  margin-top: 20px;
}

.bs-history-card {
  overflow: hidden;
  border: 1px solid var(--border-subtle, var(--background-modifier-accent));
  border-radius: 12px;
  background: var(--background-base-lower, var(--card-background-default));
}

.bs-history-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px 12px;
}

.bs-history-heading h2 {
  margin: 0;
  color: var(--text-strong, var(--header-primary, var(--text-default)));
  font-size: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.bs-history-heading p {
  margin: 3px 0 0;
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.35;
}

.bs-history-count {
  display: grid;
  min-width: 28px;
  height: 24px;
  padding: 0 7px;
  border-radius: 12px;
  color: var(--text-default);
  background: var(--background-mod-strong, var(--background-modifier-accent));
  font-size: 12px;
  font-weight: 600;
  place-items: center;
}

.bs-history-search {
  padding: 0 12px 12px;
}

.bs-history-search > div {
  border-radius: 8px;
  background: var(--background-base-lowest, var(--input-background));
}

.bs-history-list {
  border-top: 1px solid var(--border-subtle, var(--background-modifier-accent));
}

.bs-history-row {
  display: grid;
  min-height: 54px;
  grid-template-columns: minmax(0, 1fr) 34px 34px;
  align-items: center;
  gap: 4px;
  padding: 5px 8px 5px 12px;
  border-bottom: 1px solid var(--border-subtle, var(--background-modifier-accent));
}

.bs-history-row:last-child {
  border-bottom: 0;
}

.bs-history-row:hover {
  background: var(--interactive-background-hover, var(--background-modifier-hover));
}

.bs-history-status,
.bs-history-icon-button {
  border: 0;
  color: var(--interactive-icon-default, var(--interactive-normal, var(--text-default)));
  background: transparent;
  cursor: pointer;
  font: inherit;
}

.bs-history-status {
  display: flex;
  min-width: 0;
  align-items: flex-start;
  flex-direction: column;
  padding: 6px 4px;
  text-align: left;
}

.bs-history-status span {
  width: 100%;
  overflow: hidden;
  color: var(--text-default);
  font-size: 14px;
  font-weight: 500;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bs-history-status small {
  margin-top: 2px;
  color: var(--text-muted);
  font-size: 11px;
  line-height: 1.25;
}

.bs-history-icon-button {
  display: grid;
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 8px;
  place-items: center;
}

.bs-history-status:hover span,
.bs-history-status:focus-visible span,
.bs-history-icon-button:hover,
.bs-history-icon-button:focus-visible {
  color: var(--interactive-text-hover, var(--interactive-hover, var(--text-default)));
}

.bs-history-status:focus-visible,
.bs-history-icon-button:focus-visible {
  outline: 2px solid var(--brand-500);
  outline-offset: -2px;
}

.bs-history-icon-button:hover {
  background: var(--interactive-background-active, var(--background-modifier-active));
}

.bs-history-favorite {
  color: var(--yellow-300);
}

.bs-history-delete:hover,
.bs-history-delete:focus-visible {
  color: var(--red-400);
}

.bs-history-empty {
  color: var(--text-muted);
  font-size: 13px;
  text-align: center;
}

.bs-history-empty {
  padding: 18px 16px;
  border-top: 1px solid var(--border-subtle, var(--background-modifier-accent));
}

.bs-history-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 10px 12px;
  border-top: 1px solid var(--border-subtle, var(--background-modifier-accent));
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 600;
}

.bs-history-pagination button {
  display: grid;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  color: var(--interactive-icon-default, var(--interactive-normal, var(--text-default)));
  background: var(--background-mod-strong, var(--background-modifier-accent));
  cursor: pointer;
  font: inherit;
  font-size: 22px;
  line-height: 1;
  place-items: center;
}

.bs-history-pagination button:hover:not(:disabled),
.bs-history-pagination button:focus-visible {
  color: var(--interactive-text-hover, var(--interactive-hover, var(--text-default)));
  background: var(--interactive-background-active, var(--background-modifier-active));
}

.bs-history-pagination button:focus-visible {
  outline: 2px solid var(--brand-500);
  outline-offset: -2px;
}

.bs-history-pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.35;
}

.bs-update-status {
  margin-top: 7px;
  color: var(--brand-360);
  font-size: 11px;
  font-weight: 600;
}

.bs-version-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 7px 10px;
  margin-top: 10px;
}

.bs-version-badge {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  gap: 6px;
  padding: 5px 8px;
  border: 1px solid var(--background-modifier-accent);
  border-radius: 999px;
  color: var(--text-muted);
  background: color-mix(in srgb, var(--background-primary) 72%, transparent);
  font-size: 10px;
  font-weight: 750;
}

.bs-version-badge i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--interactive-muted);
}

.bs-version-current {
  color: var(--green-360);
  border-color: color-mix(in srgb, var(--green-360) 28%, var(--background-modifier-accent));
  background: color-mix(in srgb, var(--green-360) 8%, transparent);
}

.bs-version-current i {
  background: var(--green-360);
  box-shadow: 0 0 8px color-mix(in srgb, var(--green-360) 65%, transparent);
}

.bs-version-updateAvailable {
  color: var(--brand-360);
  border-color: color-mix(in srgb, var(--brand-360) 30%, var(--background-modifier-accent));
}

.bs-version-updateAvailable i { background: var(--brand-360); }

.bs-version-restartRequired {
  color: var(--yellow-300);
  border-color: color-mix(in srgb, var(--yellow-300) 30%, var(--background-modifier-accent));
  background: color-mix(in srgb, var(--yellow-300) 8%, transparent);
}

.bs-version-restartRequired i {
  background: var(--yellow-300);
  box-shadow: 0 0 8px color-mix(in srgb, var(--yellow-300) 60%, transparent);
}

.bs-version-restart-button {
  min-height: 28px;
  padding: 0 10px;
  border: 0;
  border-radius: 6px;
  color: var(--white-500);
  background: var(--brand-500);
  cursor: pointer;
  font: inherit;
  font-size: 11px;
  font-weight: 650;
}

.bs-version-restart-button:hover:not(:disabled) {
  background: var(--brand-560);
}

.bs-version-restart-button:focus-visible {
  outline: 2px solid var(--focus-primary);
  outline-offset: 2px;
}

.bs-version-restart-button:disabled {
  cursor: wait;
  opacity: 0.65;
}

.bs-version-commits {
  display: flex;
  align-items: center;
  min-width: 0;
  flex-wrap: wrap;
  gap: 6px;
  color: var(--text-muted);
  font-size: 10px;
}

.bs-version-commits > span,
.bs-version-commits > a {
  padding-left: 7px;
  border-left: 1px solid var(--background-modifier-accent);
}

.bs-version-commits strong { color: var(--header-secondary); }
.bs-version-commits a { color: var(--brand-360); text-decoration: none; }
.bs-version-checked { margin-left: auto; color: var(--text-muted); font-size: 9px; }

.bs-dev-channel-prompt {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.bs-dev-channel-prompt strong {
    color: var(--header-primary);
}

.bs-about {
  position: relative;
  display: grid;
  overflow: hidden;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 36%);
  gap: 30px;
  min-height: 300px;
  padding: 28px 30px;
  border: 1px solid
    color-mix(in srgb, var(--brand-500) 38%, var(--background-modifier-accent));
  border-radius: 18px;
  background:
    radial-gradient(
      circle at 100% 0,
      color-mix(in srgb, var(--brand-500) 28%, transparent),
      transparent 44%
    ),
    radial-gradient(
      circle at 0 100%,
      color-mix(in srgb, #a855f7 12%, transparent),
      transparent 38%
    ),
    linear-gradient(
      135deg,
      var(--background-secondary-alt),
      var(--background-secondary)
    );
  box-shadow:
    0 16px 40px rgb(0 0 0 / 14%),
    inset 0 1px 0 rgb(255 255 255 / 5%);
}

.bs-about::before {
  position: absolute;
  top: 0;
  right: 18%;
  left: 18%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    color-mix(in srgb, var(--brand-360) 80%, white),
    transparent
  );
  content: "";
}

.bs-about::after {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    115deg,
    transparent 52%,
    color-mix(in srgb, var(--brand-500) 5%, transparent)
  );
  content: "";
  pointer-events: none;
}

.bs-brand-lockup {
  display: flex;
  align-items: center;
  gap: 14px;
}

.bs-about-icon {
  display: grid;
  position: relative;
  width: 56px;
  height: 56px;
  flex: 0 0 auto;
  border: 1px solid rgb(255 255 255 / 18%);
  border-radius: 17px;
  color: white;
  background: linear-gradient(145deg, var(--brand-360), var(--brand-600));
  box-shadow:
    0 12px 30px color-mix(in srgb, var(--brand-500) 38%, transparent),
    inset 0 1px 0 rgb(255 255 255 / 24%);
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.04em;
  place-items: center;
}

.bs-about-eyebrow {
  margin-bottom: 3px;
  color: var(--brand-360);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.bs-about-content {
  position: relative;
  z-index: 1;
  min-width: 0;
}

.bs-about-heading {
  margin-bottom: 0;
  color: var(--header-primary);
  font-size: 20px;
  font-weight: 750;
  letter-spacing: -0.02em;
}

.bs-about-tagline {
  max-width: 620px;
  margin-top: 22px;
  margin-bottom: 7px;
  color: var(--header-primary);
  font-size: clamp(24px, 2.3vw, 34px);
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1.08;
}

.bs-about-content p {
  max-width: 650px;
  margin: 0;
  color: var(--text-normal);
}

.bs-about-preview {
  position: relative;
  z-index: 1;
  display: grid;
  align-self: stretch;
  min-height: 270px;
  place-items: center;
}

.bs-preview-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 330px;
  height: 250px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--brand-500) 17%, transparent);
  filter: blur(55px);
  opacity: 0.7;
  transform: translate(-50%, -50%);
}

.bs-signal-stage {
  position: relative;
  z-index: 2;
  width: min(100%, 330px);
  aspect-ratio: 1.2;
  border: 1px solid
    color-mix(in srgb, var(--brand-500) 22%, var(--background-modifier-accent));
  border-radius: 28px;
  background:
    linear-gradient(
      color-mix(in srgb, var(--brand-500) 6%, transparent) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      color-mix(in srgb, var(--brand-500) 6%, transparent) 1px,
      transparent 1px
    ),
    radial-gradient(
      circle at 50% 45%,
      color-mix(in srgb, var(--brand-500) 17%, transparent),
      transparent 45%
    ),
    color-mix(in srgb, var(--background-primary) 84%, transparent);
  background-size:
    26px 26px,
    26px 26px,
    auto,
    auto;
  box-shadow:
    0 22px 50px rgb(0 0 0 / 28%),
    inset 0 1px 0 rgb(255 255 255 / 5%);
}

.bs-signal-stage::before {
  position: absolute;
  inset: 10px;
  border: 1px solid color-mix(in srgb, var(--brand-360) 10%, transparent);
  border-radius: 21px;
  content: "";
}

.bs-signal-lines {
  position: absolute;
  inset: 7% 4% 10%;
  width: 92%;
  height: 83%;
  overflow: visible;
}

.bs-signal-lines path {
  fill: none;
  stroke: color-mix(in srgb, var(--brand-360) 34%, transparent);
  stroke-dasharray: 4 6;
  stroke-width: 1.2;
}

.bs-signal-core {
  position: absolute;
  top: 47%;
  left: 50%;
  display: grid;
  width: 84px;
  height: 84px;
  border: 1px solid color-mix(in srgb, var(--brand-360) 70%, white);
  border-radius: 26px;
  color: white;
  background: linear-gradient(145deg, var(--brand-360), var(--brand-700));
  box-shadow:
    0 0 0 8px color-mix(in srgb, var(--brand-500) 9%, transparent),
    0 18px 38px color-mix(in srgb, var(--brand-500) 38%, transparent),
    inset 0 1px 0 rgb(255 255 255 / 30%);
  place-content: center;
  text-align: center;
  transform: translate(-50%, -50%);
}

.bs-signal-core strong {
  font-size: 25px;
  letter-spacing: -0.06em;
  line-height: 1;
}

.bs-signal-core small {
  margin-top: 6px;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.18em;
  opacity: 0.75;
}

.bs-signal-pulse {
  position: absolute;
  inset: -12px;
  border: 1px solid color-mix(in srgb, var(--brand-360) 38%, transparent);
  border-radius: 34px;
}

.bs-signal-node {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 9px;
  border: 1px solid
    color-mix(in srgb, var(--node-color) 30%, var(--background-modifier-accent));
  border-radius: 999px;
  color: var(--header-secondary);
  background: color-mix(
    in srgb,
    var(--background-secondary-alt) 90%,
    transparent
  );
  box-shadow: 0 8px 18px rgb(0 0 0 / 18%);
  font-size: 10px;
  font-weight: 700;
}

.bs-signal-node i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--node-color);
  box-shadow: 0 0 10px var(--node-color);
}

.bs-signal-node-dnd {
  --node-color: var(--red-400);
  top: 11%;
  left: 6%;
}
.bs-signal-node-online {
  --node-color: var(--green-360);
  top: 12%;
  right: 5%;
}
.bs-signal-node-idle {
  --node-color: var(--yellow-300);
  bottom: 17%;
  left: 5%;
}
.bs-signal-node-memory {
  --node-color: #c084fc;
  right: 5%;
  bottom: 17%;
}

.bs-command-chip {
  position: absolute;
  top: 15px;
  left: 50%;
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 5px;
  border: 1px solid
    color-mix(in srgb, var(--brand-360) 30%, var(--background-modifier-accent));
  border-radius: 9px;
  color: var(--text-muted);
  background: var(--background-secondary-alt);
  box-shadow: 0 8px 20px rgb(0 0 0 / 20%);
  font-size: 8px;
  transform: translateX(-50%);
}

.bs-command-chip kbd {
  min-width: 18px;
  padding: 3px 5px;
  border: 1px solid var(--background-modifier-accent);
  border-radius: 5px;
  color: var(--header-primary);
  background: var(--background-primary);
  box-shadow: inset 0 -1px 0 rgb(255 255 255 / 7%);
  font-family: var(--font-code);
  text-align: center;
}

.bs-signal-caption {
  position: absolute;
  right: 50%;
  bottom: 9px;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 6px 9px;
  border: 1px solid
    color-mix(in srgb, var(--green-360) 22%, var(--background-modifier-accent));
  border-radius: 8px;
  background: color-mix(
    in srgb,
    var(--background-secondary-alt) 92%,
    transparent
  );
  box-shadow: 0 8px 18px rgb(0 0 0 / 20%);
  font-size: 8px;
  white-space: nowrap;
  transform: translateX(50%);
}

.bs-signal-caption span {
  color: var(--text-muted);
}
.bs-signal-caption strong {
  color: var(--green-360);
  font-size: 8px;
  text-transform: uppercase;
}

@media (prefers-reduced-motion: no-preference) {
  .bs-signal-pulse {
    animation: bs-signal-pulse 2.8s ease-out infinite;
  }
  .bs-signal-lines path {
    animation: bs-signal-flow 6s linear infinite;
  }
}

@keyframes bs-signal-pulse {
  0%,
  35% {
    opacity: 0.6;
    transform: scale(0.92);
  }
  80%,
  100% {
    opacity: 0;
    transform: scale(1.28);
  }
}

@keyframes bs-signal-flow {
  to {
    stroke-dashoffset: -40;
  }
}

.bs-about-credit {
  margin-top: 10px;
  color: var(--text-muted);
  font-size: 12px;
}

.bs-about-features {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.bs-about-features span {
  padding: 5px 9px;
  border: 1px solid
    color-mix(in srgb, var(--brand-500) 20%, var(--background-modifier-accent));
  border-radius: 999px;
  color: var(--header-secondary);
  background: color-mix(in srgb, var(--background-primary) 78%, transparent);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 3%);
  font-size: 11px;
  font-weight: 600;
}

.bs-about-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.bs-about-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 7px 11px;
  border: 1px solid var(--background-modifier-accent);
  border-radius: 8px;
  color: var(--interactive-active);
  background: color-mix(in srgb, var(--background-primary) 74%, transparent);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 3%);
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  transition:
    color 150ms ease,
    border-color 150ms ease,
    background-color 150ms ease,
    transform 150ms ease;
}

.bs-about-link:hover {
  color: white;
  border-color: var(--brand-500);
  background: color-mix(
    in srgb,
    var(--brand-500) 68%,
    var(--background-primary)
  );
  transform: translateY(-1px);
}

/* Settings masthead */
.bs-command-hero {
  position: relative;
  overflow: hidden;
  border: 1px solid
    color-mix(in srgb, var(--brand-500) 24%, var(--background-modifier-accent));
  border-radius: 20px;
  background:
    radial-gradient(
      circle at 82% 38%,
      color-mix(in srgb, var(--brand-500) 18%, transparent),
      transparent 32%
    ),
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--background-secondary-alt) 96%, #080914),
      var(--background-secondary)
    );
  box-shadow:
    0 22px 55px rgb(0 0 0 / 18%),
    inset 0 1px 0 rgb(255 255 255 / 5%);
}

.bs-command-hero::after {
  position: absolute;
  top: -110px;
  right: -85px;
  width: 290px;
  height: 290px;
  border: 1px solid color-mix(in srgb, var(--brand-360) 15%, transparent);
  border-radius: 50%;
  box-shadow:
    0 0 0 38px color-mix(in srgb, var(--brand-360) 3%, transparent),
    0 0 0 76px color-mix(in srgb, var(--brand-360) 2%, transparent);
  content: "";
  pointer-events: none;
}

.bs-command-topline,
.bs-command-footer {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 20px;
  border-color: color-mix(
    in srgb,
    var(--brand-500) 12%,
    var(--background-modifier-accent)
  );
}

.bs-command-topline {
  border-bottom: 1px solid;
}
.bs-command-footer {
  border-top: 1px solid;
}

.bs-command-brand,
.bs-command-version {
  display: flex;
  align-items: center;
  gap: 9px;
  color: var(--header-secondary);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.bs-command-brand {
  color: var(--header-primary);
}
.bs-command-version i,
.bs-console-header i,
.bs-console-result i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--green-360);
  box-shadow: 0 0 10px var(--green-360);
}

.bs-command-mark {
  display: flex;
  align-items: flex-end;
  height: 15px;
  gap: 2px;
}

.bs-command-mark i {
  width: 3px;
  border-radius: 3px;
  background: linear-gradient(var(--brand-360), var(--brand-600));
}

.bs-command-mark i:nth-child(1) {
  height: 7px;
}
.bs-command-mark i:nth-child(2) {
  height: 15px;
}
.bs-command-mark i:nth-child(3) {
  height: 11px;
}

.bs-command-body {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(360px, 1.15fr);
  align-items: center;
  gap: 32px;
  padding: 32px;
}

.bs-command-kicker {
  color: var(--brand-360);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.bs-command-message h2 {
  margin: 10px 0 12px;
  color: var(--header-primary);
  font-size: clamp(27px, 3vw, 42px);
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 1.02;
}

.bs-command-message h2 em {
  color: color-mix(in srgb, var(--brand-360) 78%, white);
  font-style: normal;
}

.bs-command-message p {
  max-width: 420px;
  margin: 0;
  color: var(--text-muted);
  line-height: 1.55;
}

.bs-command-console {
  overflow: hidden;
  border: 1px solid
    color-mix(in srgb, var(--brand-500) 30%, var(--background-modifier-accent));
  border-radius: 16px;
  background: color-mix(in srgb, var(--background-primary) 88%, transparent);
  box-shadow:
    0 18px 42px rgb(0 0 0 / 25%),
    inset 0 1px 0 rgb(255 255 255 / 4%);
}

.bs-console-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 13px;
  border-bottom: 1px solid var(--background-modifier-accent);
  color: var(--text-muted);
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.bs-console-header span {
  display: flex;
  align-items: center;
  gap: 7px;
}
.bs-console-header strong {
  color: var(--green-360);
  font-size: 8px;
}

.bs-console-keys {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 20px 14px 17px;
  color: var(--text-muted);
  font-size: 10px;
}

.bs-console-keys kbd {
  display: grid;
  min-width: 38px;
  height: 35px;
  border: 1px solid
    color-mix(in srgb, var(--brand-500) 23%, var(--background-modifier-accent));
  border-radius: 9px;
  color: var(--header-primary);
  background: linear-gradient(
    var(--background-secondary),
    var(--background-secondary-alt)
  );
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 7%),
    0 4px 0 color-mix(in srgb, var(--background-primary) 85%, black);
  font-family: var(--font-code);
  font-size: 13px;
  place-items: center;
}

.bs-console-route {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr;
  align-items: center;
  padding: 11px 14px;
  border-block: 1px solid var(--background-modifier-accent);
  background: color-mix(in srgb, var(--brand-500) 5%, transparent);
}

.bs-console-route > div {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 6px;
}
.bs-console-route span {
  grid-row: 1 / 3;
  color: var(--brand-360);
  font: 700 10px var(--font-code);
}
.bs-console-route strong {
  color: var(--header-secondary);
  font-size: 8px;
  letter-spacing: 0.08em;
}
.bs-console-route small {
  color: var(--text-muted);
  font-size: 8px;
}
.bs-console-route > i {
  width: 18px;
  height: 1px;
  margin: 0 4px;
  background: linear-gradient(90deg, var(--brand-500), transparent);
}

.bs-console-result {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 10px;
  color: var(--text-muted);
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.bs-console-result strong {
  color: var(--green-360);
  font-size: 8px;
}

.bs-command-meta,
.bs-command-links {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.bs-command-meta span {
  padding: 4px 7px;
  border: 1px solid var(--background-modifier-accent);
  border-radius: 5px;
  color: var(--header-secondary);
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.06em;
}

.bs-command-credit {
  color: var(--text-muted);
  font-size: 10px;
}
.bs-command-credit strong {
  color: var(--header-secondary);
  font-weight: 650;
}

.bs-command-links a {
  color: var(--header-secondary);
  font-size: 10px;
  font-weight: 700;
  text-decoration: none;
}

.bs-command-links a::after {
  margin-left: 3px;
  color: var(--brand-360);
  content: "\u2197";
}
.bs-command-links a:hover {
  color: var(--brand-360);
}

.bs-overview {
    overflow: hidden;
    border: 1px solid color-mix(in srgb, var(--brand-500) 18%, var(--background-modifier-accent));
    border-radius: 16px;
    background: linear-gradient(145deg, color-mix(in srgb, var(--background-secondary-alt) 94%, #111426), var(--background-secondary));
    box-shadow: 0 14px 36px rgb(0 0 0 / 15%), inset 0 1px 0 rgb(255 255 255 / 4%);
}

.bs-overview-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    padding: 16px 18px;
}

.bs-overview-brand {
    display: flex;
    align-items: center;
    min-width: 0;
    gap: 12px;
}

.bs-overview-monogram {
    display: grid;
    width: 38px;
    height: 38px;
    flex: 0 0 auto;
    border: 1px solid rgb(255 255 255 / 18%);
    border-radius: 12px;
    color: white;
    background: linear-gradient(145deg, var(--brand-360), var(--brand-600));
    box-shadow: 0 8px 20px color-mix(in srgb, var(--brand-500) 24%, transparent), inset 0 1px 0 rgb(255 255 255 / 22%);
    font-size: 18px;
    font-weight: 850;
    place-items: center;
}

.bs-overview-brand > div:last-child {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 2px;
}

.bs-overview-brand strong {
    color: var(--header-primary);
    font-size: 16px;
    letter-spacing: -.02em;
}

.bs-overview-brand span {
    overflow: hidden;
    color: var(--text-muted);
    font-size: 11px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.bs-overview-links {
    display: flex;
    gap: 4px;
}

.bs-overview-links a {
    padding: 6px 9px;
    border-radius: 7px;
    color: var(--header-secondary);
    font-size: 11px;
    font-weight: 650;
    text-decoration: none;
    transition: color 150ms ease, background-color 150ms ease;
}

.bs-overview-links a:hover {
    color: var(--header-primary);
    background: var(--background-modifier-hover);
}

.bs-now-playing {
    --bs-now-color: var(--interactive-muted);

    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 13px;
    margin: 0 10px;
    padding: 15px 16px;
    border: 1px solid color-mix(in srgb, var(--bs-now-color) 25%, var(--background-modifier-accent));
    border-radius: 12px;
    background: linear-gradient(100deg, color-mix(in srgb, var(--bs-now-color) 8%, var(--background-primary)), color-mix(in srgb, var(--background-primary) 74%, transparent));
    box-shadow: inset 0 1px 0 rgb(255 255 255 / 3%);
}

.bs-now-online { --bs-now-color: var(--green-360); }
.bs-now-idle { --bs-now-color: var(--yellow-300); }
.bs-now-dnd { --bs-now-color: var(--red-400); }
.bs-now-invisible { --bs-now-color: var(--interactive-muted); }

.bs-now-indicator {
    display: grid;
    width: 30px;
    height: 30px;
    border-radius: 10px;
    background: color-mix(in srgb, var(--bs-now-color) 12%, var(--background-secondary));
    place-items: center;
}

.bs-now-indicator i {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--bs-now-color);
    box-shadow: 0 0 12px color-mix(in srgb, var(--bs-now-color) 70%, transparent);
}

.bs-now-copy {
    display: grid;
    min-width: 0;
    grid-template-columns: auto 1fr;
    align-items: baseline;
    column-gap: 9px;
}

.bs-now-copy span {
    grid-column: 1 / -1;
    margin-bottom: 3px;
    color: var(--bs-now-color);
    font-size: 8px;
    font-weight: 800;
    letter-spacing: .12em;
}

.bs-now-copy strong {
    overflow: hidden;
    color: var(--header-primary);
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.bs-now-copy small {
    overflow: hidden;
    color: var(--text-muted);
    font-size: 11px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.bs-now-details {
    display: flex;
    align-items: center;
    gap: 8px;
}

.bs-now-details span {
    color: var(--bs-now-color);
    font-size: 9px;
    font-weight: 750;
    text-transform: capitalize;
}

.bs-now-details kbd {
    padding: 5px 7px;
    border: 1px solid var(--background-modifier-accent);
    border-radius: 6px;
    color: var(--header-secondary);
    background: var(--background-secondary-alt);
    font: 10px var(--font-code);
}

.bs-overview-footer {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 18px 13px;
    color: var(--text-muted);
    font-size: 9px;
}

.bs-overview-footer > span {
    display: flex;
    align-items: center;
    gap: 5px;
}

.bs-overview-footer i {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--green-360);
    box-shadow: 0 0 8px color-mix(in srgb, var(--green-360) 60%, transparent);
}

.bs-overview-credit { margin-left: auto; }
.bs-overview-credit strong { color: var(--header-secondary); font-weight: 650; }

.bs-atelier {
    position: relative;
    display: grid;
    overflow: hidden;
    grid-template-columns: minmax(300px, .82fr) minmax(390px, 1.18fr);
    min-height: 390px;
    border: 1px solid color-mix(in srgb, var(--brand-500) 26%, var(--background-modifier-accent));
    border-radius: 24px;
    background:
        radial-gradient(circle at 92% 8%, color-mix(in srgb, #a855f7 16%, transparent), transparent 34%),
        radial-gradient(circle at 50% 115%, color-mix(in srgb, var(--brand-500) 15%, transparent), transparent 42%),
        linear-gradient(145deg, color-mix(in srgb, var(--background-secondary-alt) 95%, #0b0c1b), color-mix(in srgb, var(--background-secondary) 93%, #171125));
    box-shadow: 0 26px 70px rgb(0 0 0 / 24%), inset 0 1px 0 rgb(255 255 255 / 6%);
}

.bs-atelier::before {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgb(255 255 255 / 12%) .6px, transparent .6px);
    background-size: 19px 19px;
    content: "";
    opacity: .18;
    pointer-events: none;
}

.bs-atelier-copy {
    position: relative;
    z-index: 3;
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 38px 0 34px 38px;
    background: linear-gradient(90deg, rgb(12 14 31 / 46%), rgb(12 14 31 / 12%) 82%, transparent);
}

.bs-atelier-brand {
    display: flex;
    align-items: center;
    gap: 9px;
    color: var(--header-primary);
    font-size: 10px;
    font-weight: 850;
    letter-spacing: .16em;
}

.bs-atelier-glyph {
    display: flex;
    align-items: center;
    height: 18px;
    gap: 2px;
}

.bs-atelier-glyph i {
    width: 3px;
    border-radius: 4px;
    background: linear-gradient(180deg, #b7c5ff, var(--brand-500));
    box-shadow: 0 0 8px color-mix(in srgb, var(--brand-360) 55%, transparent);
}

.bs-atelier-glyph i:nth-child(1) { height: 7px; }
.bs-atelier-glyph i:nth-child(2) { height: 14px; }
.bs-atelier-glyph i:nth-child(3) { height: 18px; }
.bs-atelier-glyph i:nth-child(4) { height: 10px; }

.bs-atelier-kicker {
    margin-top: 32px;
    color: #c7d0ff;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: .18em;
}

.bs-atelier h2 {
    margin: 8px 0 13px;
    color: var(--header-primary);
    font-size: clamp(35px, 4vw, 52px);
    font-weight: 800;
    letter-spacing: -.055em;
    line-height: .98;
}

.bs-atelier-copy > p {
    max-width: 380px;
    margin: 0;
    color: var(--text-normal);
    font-size: 13px;
    line-height: 1.55;
}

.bs-atelier-credit {
    margin-top: 18px;
    color: var(--header-secondary);
    font-size: 10px;
    line-height: 1.5;
}

.bs-atelier-credit strong { color: var(--header-primary); font-weight: 700; }

.bs-atelier-links {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 17px;
}

.bs-atelier-links a {
    padding: 7px 10px;
    border: 1px solid color-mix(in srgb, var(--brand-360) 34%, var(--background-modifier-accent));
    border-radius: 8px;
    color: var(--header-primary);
    background: color-mix(in srgb, var(--background-primary) 86%, transparent);
    font-size: 10px;
    font-weight: 650;
    text-decoration: none;
    transition: border-color 150ms ease, color 150ms ease, background-color 150ms ease, transform 150ms ease;
}

.bs-atelier-links a span { color: #aab7ff; }
.bs-atelier-links a:hover { border-color: var(--brand-360); color: white; background: color-mix(in srgb, var(--brand-500) 22%, transparent); transform: translateY(-1px); }

.bs-atelier-art {
    position: relative;
    z-index: 1;
    overflow: hidden;
    min-height: 390px;
    background:
        radial-gradient(ellipse at 50% 48%, rgb(150 205 255 / 13%), transparent 28%),
        linear-gradient(160deg, transparent 28%, rgb(76 238 219 / 3%) 52%, transparent 72%);
}

.bs-atelier-art::before {
    position: absolute;
    inset: 5% 2% 4% -8%;
    background:
        radial-gradient(circle at 18% 24%, rgb(255 255 255 / 55%) 0 1px, transparent 1.5px),
        radial-gradient(circle at 69% 17%, rgb(196 225 255 / 42%) 0 1px, transparent 1.4px),
        radial-gradient(circle at 86% 62%, rgb(224 203 255 / 48%) 0 1px, transparent 1.5px),
        radial-gradient(circle at 35% 78%, rgb(181 255 235 / 40%) 0 1px, transparent 1.4px);
    background-size: 79px 71px, 113px 97px, 137px 119px, 101px 131px;
    content: "";
    opacity: .65;
    pointer-events: none;
}

.bs-atelier-art::after {
    position: absolute;
    inset: 0;
    background:
        radial-gradient(ellipse at 50% 48%, transparent 0 20%, rgb(143 196 255 / 8%) 32%, transparent 55%),
        linear-gradient(90deg, color-mix(in srgb, var(--background-secondary) 70%, transparent), transparent 20% 82%, color-mix(in srgb, var(--background-secondary) 40%, transparent));
    content: "";
    pointer-events: none;
}

.bs-aurora {
    position: absolute;
    z-index: 1;
    border-radius: 48% 52% 46% 54% / 55% 42% 58% 45%;
    filter: blur(17px);
    mix-blend-mode: screen;
    opacity: .78;
    transform-origin: 50% 50%;
}

.bs-aurora::after {
    position: absolute;
    inset: 13% 4%;
    border-radius: inherit;
    background: linear-gradient(90deg, transparent, rgb(255 255 255 / 55%), transparent);
    content: "";
    filter: blur(9px);
}

.bs-aurora-one {
    top: -5%;
    left: 3%;
    width: 93%;
    height: 38%;
    background: linear-gradient(100deg, transparent 2%, #48e7d2 25%, #82a8ff 55%, #d879ff 78%, transparent 98%);
    clip-path: polygon(0 60%, 12% 32%, 28% 48%, 45% 16%, 64% 40%, 82% 20%, 100% 45%, 100% 72%, 82% 50%, 64% 70%, 45% 43%, 28% 76%, 12% 55%, 0 84%);
    transform: rotate(-8deg);
}

.bs-aurora-two {
    top: 24%;
    right: -13%;
    width: 105%;
    height: 43%;
    background: linear-gradient(98deg, transparent, #6af0ca 18%, #6c8dff 48%, #bf68ff 73%, transparent 96%);
    clip-path: polygon(0 48%, 16% 22%, 33% 42%, 52% 12%, 69% 34%, 86% 15%, 100% 38%, 100% 66%, 85% 45%, 69% 67%, 52% 42%, 33% 73%, 16% 50%, 0 78%);
    opacity: .62;
    transform: rotate(9deg);
}

.bs-aurora-three {
    right: 0;
    bottom: -4%;
    width: 92%;
    height: 42%;
    background: linear-gradient(105deg, transparent, #40e6b4 24%, #4fcddd 45%, #888aff 68%, transparent 96%);
    clip-path: polygon(0 42%, 18% 17%, 37% 38%, 55% 8%, 75% 34%, 100% 12%, 100% 48%, 75% 68%, 55% 40%, 37% 72%, 18% 48%, 0 72%);
    opacity: .48;
    transform: rotate(-7deg);
}

.bs-atelier-orb {
    position: absolute;
    z-index: 3;
    top: 47%;
    left: 53%;
    width: 150px;
    height: 150px;
    border: 1px solid rgb(218 235 255 / 32%);
    border-radius: 50%;
    background: radial-gradient(circle at 34% 26%, rgb(255 255 255 / 32%), transparent 18%), linear-gradient(145deg, rgb(155 203 255 / 48%), rgb(104 86 218 / 42%) 52%, rgb(41 209 180 / 25%));
    box-shadow: 0 0 35px rgb(126 179 255 / 34%), 0 0 80px rgb(156 93 255 / 25%), 0 24px 60px rgb(0 0 0 / 24%), inset 0 1px 0 rgb(255 255 255 / 38%);
    backdrop-filter: blur(12px);
    transform: translate(-50%, -50%);
}

.bs-orb-core {
    position: absolute;
    inset: 25px;
    display: grid;
    border: 1px solid rgb(207 214 255 / 25%);
    border-radius: 50%;
    background: radial-gradient(circle at 38% 28%, #ecf7ff, #8faaff 30%, #6768d7 62%, #42317e 100%);
    box-shadow: 0 0 32px rgb(151 200 255 / 45%), 0 14px 38px rgb(43 37 111 / 48%), inset 0 1px 0 rgb(255 255 255 / 52%);
    place-items: center;
}

.bs-orb-mark { display: flex; align-items: center; height: 37px; gap: 5px; }
.bs-orb-mark i { width: 7px; border-radius: 8px; background: white; box-shadow: 0 0 13px rgb(255 255 255 / 45%); }
.bs-orb-mark i:nth-child(1) { height: 18px; opacity: .7; }
.bs-orb-mark i:nth-child(2) { height: 37px; }
.bs-orb-mark i:nth-child(3) { height: 25px; opacity: .82; }

.bs-orbit { position: absolute; inset: -31px; border: 1px solid rgb(194 226 255 / 13%); border-radius: 50%; }
.bs-orbit-two { inset: -58px; border-color: rgb(190 246 229 / 10%); transform: rotate(62deg); }
.bs-orbit i { position: absolute; top: 21%; right: 5%; width: 7px; height: 7px; border-radius: 50%; background: #9fb0ff; box-shadow: 0 0 13px #7e94ff; }
.bs-orbit-two i { top: auto; right: auto; bottom: 13%; left: 10%; background: #c783ff; box-shadow: 0 0 13px #a855f7; }

.bs-presence-spectrum {
    position: absolute;
    z-index: 4;
    top: 46%;
    right: 7%;
    display: flex;
    flex-direction: column;
    gap: 7px;
    transform: translateY(-50%);
}

.bs-presence-spectrum span { width: 5px; height: 22px; border-radius: 5px; opacity: .85; }
.bs-spectrum-online { background: var(--green-360); box-shadow: 0 0 10px var(--green-360); }
.bs-spectrum-idle { background: var(--yellow-300); box-shadow: 0 0 10px var(--yellow-300); }
.bs-spectrum-dnd { background: var(--red-400); box-shadow: 0 0 10px var(--red-400); }
.bs-spectrum-memory { background: #c084fc; box-shadow: 0 0 10px #c084fc; }

.bs-art-caption {
    position: absolute;
    z-index: 4;
    right: 8%;
    bottom: 21px;
    left: 8%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: fit-content;
    margin-inline: auto;
    padding: 6px 10px;
    border: 1px solid rgb(190 204 255 / 18%);
    border-radius: 999px;
    color: #e1e6ff;
    background: rgb(11 13 30 / 62%);
    box-shadow: 0 5px 18px rgb(0 0 0 / 18%);
    font-size: 7px;
    font-weight: 800;
    letter-spacing: .1em;
    text-shadow: 0 1px 4px rgb(0 0 0 / 75%);
    backdrop-filter: blur(8px);
}

.bs-art-caption i { width: 3px; height: 3px; border-radius: 50%; background: #91a4ff; }

@media (prefers-reduced-motion: no-preference) {
    .bs-atelier-orb { animation: bs-orb-float 6s ease-in-out infinite; }
    .bs-orbit-one { animation: bs-orbit-spin 18s linear infinite; }
    .bs-orbit-two { animation: bs-orbit-spin 26s linear reverse infinite; }
    .bs-aurora { animation: bs-aurora-breathe 7s ease-in-out infinite alternate; }
}

@keyframes bs-orb-float { 0%, 100% { margin-top: -4px; } 50% { margin-top: 5px; } }
@keyframes bs-orbit-spin { to { transform: rotate(360deg); } }
@keyframes bs-aurora-breathe { to { opacity: .58; filter: blur(38px); } }

@media (width <= 760px) {
    .bs-atelier { grid-template-columns: 1fr; }
    .bs-atelier-copy { padding: 30px; }
    .bs-atelier-art { min-height: 300px; }
}

@media (width <= 480px) {
    .bs-atelier { min-height: auto; }
    .bs-atelier-copy { padding: 25px 20px; }
    .bs-atelier-art { display: none; }
}

@media (width <= 620px) {
    .bs-overview-header { align-items: flex-start; flex-direction: column; }
    .bs-now-playing { grid-template-columns: auto minmax(0, 1fr); }
    .bs-now-details { grid-column: 2; }
    .bs-overview-footer { align-items: flex-start; flex-direction: column; gap: 6px; }
    .bs-overview-credit { margin-left: 0; }
}

@media (width <= 760px) {
  .bs-command-body {
    grid-template-columns: 1fr;
    padding: 24px;
  }
  .bs-command-footer {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (width <= 480px) {
  .bs-command-console {
    display: none;
  }
  .bs-command-body {
    padding: 22px 18px;
  }
  .bs-command-version {
    display: none;
  }
}

.bs-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 4px 2px 14px;
  border-bottom: 1px solid
    color-mix(in srgb, var(--brand-500) 12%, var(--background-modifier-accent));
}

.bs-toolbar-actions {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  gap: 8px;
}

.bs-search {
  position: relative;
  width: 190px;
}

.bs-search > div {
  border-radius: 10px;
  background: color-mix(in srgb, var(--background-primary) 74%, transparent);
}

.bs-search > span {
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 10px;
  color: var(--text-muted);
  font-size: 18px;
  pointer-events: none;
  transform: translateY(-50%);
}

.bs-search input {
  padding-left: 32px;
}

.bs-secondary-button {
  display: inline-flex;
  align-items: center;
  height: 38px;
  gap: 6px;
  padding: 0 11px;
  border: 1px solid var(--background-modifier-accent);
  border-radius: 8px;
  color: var(--interactive-normal);
  background: var(--background-secondary);
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  transition:
    color 150ms ease,
    border-color 150ms ease,
    background-color 150ms ease,
    transform 150ms ease;
}

.bs-secondary-button:hover {
  border-color: color-mix(
    in srgb,
    var(--brand-500) 45%,
    var(--background-modifier-accent)
  );
  color: var(--interactive-hover);
  background: var(--background-modifier-hover);
  transform: translateY(-1px);
}

.bs-toolbar h2,
.bs-card-header h5 {
  margin-bottom: 4px;
}

.bs-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 7px;
}

.bs-stats span {
  padding: 4px 8px;
  border: 1px solid
    color-mix(in srgb, var(--brand-500) 10%, var(--background-modifier-accent));
  border-radius: 999px;
  color: var(--text-muted);
  background: var(--background-modifier-hover);
  font-size: 11px;
}

.bs-stats strong {
  color: var(--header-primary);
  font-weight: 700;
}

.bs-active-summary {
    display: inline-flex;
    align-items: center;
    gap: 5px;
}

.bs-active-summary i,
.bs-active-badge i {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--interactive-muted);
}

.bs-active-summary-live {
    color: var(--green-360) !important;
    border-color: color-mix(in srgb, var(--green-360) 30%, var(--background-modifier-accent)) !important;
    background: color-mix(in srgb, var(--green-360) 9%, transparent) !important;
}

.bs-active-summary-live i,
.bs-active-badge i {
    background: var(--green-360);
    box-shadow: 0 0 9px color-mix(in srgb, var(--green-360) 70%, transparent);
}

.bs-preset-grid {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
}

.bs-preset-card {
  position: relative;
  min-width: 0;
  max-width: 100%;
  flex: 1 1 430px;
  overflow: visible;
  border: 1px solid var(--bs-card-border);
  border-radius: 15px;
  background: linear-gradient(
    145deg,
    color-mix(
      in srgb,
      var(--bs-presence-color) 3%,
      var(--background-secondary)
    ),
    var(--background-secondary)
  );
  box-shadow:
    0 10px 28px rgb(0 0 0 / 12%),
    inset 0 1px 0 rgb(255 255 255 / 3%);
  transition:
    border-color 150ms ease,
    box-shadow 150ms ease,
    opacity 150ms ease,
    transform 150ms ease;
}

.bs-preset-card:focus-within {
  z-index: 20;
}

.bs-preset-card::before {
  position: absolute;
  z-index: 2;
  top: 0;
  bottom: 0;
  left: 0;
  width: 4px;
  background: linear-gradient(
    180deg,
    var(--bs-presence-color),
    color-mix(in srgb, var(--bs-presence-color) 45%, transparent)
  );
  box-shadow: 0 0 16px
    color-mix(in srgb, var(--bs-presence-color) 30%, transparent);
  content: "";
}

.bs-presence-online {
  --bs-presence-color: var(--green-360);
}
.bs-presence-idle {
  --bs-presence-color: var(--yellow-300);
}
.bs-presence-dnd {
  --bs-presence-color: var(--red-400);
}
.bs-presence-invisible {
  --bs-presence-color: var(--interactive-muted);
}

.bs-preset-card:hover {
  border-color: color-mix(
    in srgb,
    var(--bs-presence-color) 48%,
    var(--background-modifier-accent)
  );
  box-shadow:
    0 16px 38px rgb(0 0 0 / 20%),
    0 0 22px color-mix(in srgb, var(--bs-presence-color) 7%, transparent);
  transform: translateY(-2px);
}

.bs-preset-card-active {
    border-color: color-mix(in srgb, var(--green-360) 55%, var(--background-modifier-accent));
    box-shadow: 0 16px 38px rgb(0 0 0 / 18%), 0 0 0 1px color-mix(in srgb, var(--green-360) 12%, transparent), 0 0 28px color-mix(in srgb, var(--green-360) 10%, transparent);
}

.bs-preset-card-active::after {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--green-360), transparent);
    content: "";
}

.bs-preset-card-disabled {
  border-color: color-mix(
    in srgb,
    var(--interactive-muted) 55%,
    var(--background-modifier-accent)
  );
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 2%);
}

.bs-preset-card-disabled::before {
  opacity: 0.42;
}

.bs-preset-card-disabled .bs-mode-badge {
  opacity: 0.7;
}

.bs-card-header,
.bs-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 18px;
}

.bs-card-header {
  border-bottom: 1px solid var(--background-modifier-accent);
  background: linear-gradient(
    100deg,
    color-mix(
      in srgb,
      var(--bs-presence-color) 7%,
      var(--background-secondary-alt)
    ),
    var(--background-secondary-alt)
  );
}

.bs-preset-card-collapsed .bs-card-header {
  border-bottom: 0;
}

.bs-card-title {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 8px;
}

.bs-card-identity {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 11px;
}

.bs-card-identity > div {
  min-width: 0;
}

.bs-presence-dot {
  width: 11px;
  height: 11px;
  flex: 0 0 auto;
  border: 2px solid
    color-mix(
      in srgb,
      var(--bs-presence-color) 35%,
      var(--background-secondary-alt)
    );
  border-radius: 50%;
  background: var(--bs-presence-color);
  box-shadow:
    0 0 0 4px color-mix(in srgb, var(--bs-presence-color) 10%, transparent),
    0 0 14px color-mix(in srgb, var(--bs-presence-color) 58%, transparent);
}

.bs-card-summary {
  display: flex;
  align-items: center;
  overflow: hidden;
  gap: 8px;
  margin-top: 5px;
  color: var(--text-muted);
  font-size: 12px;
}

.bs-card-summary > :first-child {
  overflow: hidden;
  max-width: 300px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bs-hotkey-chip {
  flex: 0 0 auto;
  padding: 3px 7px;
  border: 1px solid var(--background-modifier-accent);
  border-radius: 6px;
  color: var(--header-secondary);
  background: var(--background-primary);
  font-family: var(--font-code);
  font-size: 10px;
}

.bs-card-title h5 {
  overflow: hidden;
  max-width: 260px;
  margin: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bs-card-actions {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  gap: 8px;
}

.bs-duplicate-button {
  height: 32px;
  padding: 0 11px;
  border: 1px solid var(--background-modifier-accent);
  border-radius: 7px;
  color: var(--header-secondary);
  background: var(--background-modifier-hover);
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  transition:
    color 150ms ease,
    border-color 150ms ease,
    background-color 150ms ease;
}

.bs-card-header .vc-form-switch-wrapper {
  display: flex;
  height: 32px;
  align-items: center;
  flex: 0 0 auto;
  margin: 0;
}

.bs-card-header .vc-form-switch {
  width: auto;
  height: 32px;
  align-items: center;
  gap: 8px;
  padding: 0;
}

.bs-card-header .vc-form-switch > :last-child {
  margin-left: 0;
}

.bs-card-header .vc-form-switch-text {
  height: 32px;
  justify-content: center;
  gap: 0;
}

.bs-collapse-button {
  display: grid;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 8px;
  color: var(--interactive-normal);
  background: transparent;
  cursor: pointer;
  place-items: center;
  transition:
    color 150ms ease,
    background-color 150ms ease;
}

.bs-collapse-button:hover {
  border-color: var(--background-modifier-accent);
  color: var(--interactive-hover);
  background: var(--background-modifier-hover);
}

.bs-collapse-button:focus-visible {
  outline: 2px solid var(--brand-500);
  outline-offset: 2px;
}

.bs-chevron {
  transform: rotate(0deg);
  transition: transform 180ms ease;
}

.bs-chevron-collapsed {
  transform: rotate(-90deg);
}

.bs-mode-badge {
  flex: 0 0 auto;
  padding: 4px 8px;
  border-radius: 999px;
  color: var(--text-muted);
  background: var(--background-modifier-accent);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  line-height: 1.2;
  text-transform: uppercase;
}

.bs-mode-memory {
  color: var(--brand-360);
  background: color-mix(in srgb, var(--brand-500) 18%, transparent);
}

.bs-active-badge {
    display: inline-flex;
    align-items: center;
    flex: 0 0 auto;
    gap: 5px;
    padding: 4px 8px;
    border: 1px solid color-mix(in srgb, var(--green-360) 32%, transparent);
    border-radius: 999px;
    color: var(--green-360);
    background: color-mix(in srgb, var(--green-360) 10%, transparent);
    font-size: 10px;
    font-weight: 800;
    letter-spacing: .04em;
    line-height: 1.2;
    text-transform: uppercase;
}

.bs-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 15px;
  padding: 18px;
  background: color-mix(in srgb, var(--background-primary) 18%, transparent);
}

.bs-field {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 7px;
  color: var(--header-secondary);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.025em;
  text-transform: uppercase;
}

.bs-field-status,
.bs-field-hotkey {
  grid-column: 1 / -1;
}

/* Discord-style presence switcher */
.bs-status-switcher {
  position: relative;
  text-align: left;
  text-transform: none;
}

.bs-status-trigger {
  display: grid;
  width: 100%;
  min-height: 54px;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 11px;
  padding: 9px 12px;
  border: 1px solid var(--input-border, var(--background-modifier-accent));
  border-radius: 8px;
  color: var(--interactive-normal);
  background: var(--input-background, var(--background-tertiary));
  cursor: pointer;
  font: inherit;
  text-align: left;
  transition:
    border-color 140ms ease,
    background-color 140ms ease;
}

.bs-status-trigger:hover,
.bs-status-trigger[aria-expanded="true"] {
  border-color: var(--interactive-muted);
  color: var(--interactive-hover);
  background: var(--background-modifier-hover);
}

.bs-status-trigger:focus-visible {
  border-color: var(--brand-500);
  outline: 2px solid color-mix(in srgb, var(--brand-500) 40%, transparent);
  outline-offset: 1px;
}

.bs-status-trigger > svg,
.bs-status-menu-item > svg {
  color: var(--interactive-normal);
}

.bs-status-trigger-copy,
.bs-status-item-copy {
  display: flex;
  overflow: hidden;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
}

.bs-status-trigger-copy strong,
.bs-status-item-copy strong {
  overflow: hidden;
  color: var(--header-primary);
  font-size: 15px;
  font-weight: 600;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bs-status-trigger-copy small,
.bs-status-item-copy small {
  overflow: hidden;
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 400;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bs-status-indicator {
  position: relative;
  width: 20px;
  height: 20px;
  box-sizing: border-box;
  flex: 0 0 auto;
  border-radius: 50%;
}

.bs-status-indicator-online {
  background: var(--green-360);
}

.bs-status-indicator-idle {
  overflow: hidden;
  background: var(--yellow-300);
}

.bs-status-indicator-idle::after {
  position: absolute;
  top: -4px;
  left: 6px;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background: var(--background-floating);
  content: "";
}

.bs-status-trigger .bs-status-indicator-idle::after {
  background: var(--input-background, var(--background-tertiary));
}

.bs-status-trigger:hover .bs-status-indicator-idle::after,
.bs-status-trigger[aria-expanded="true"] .bs-status-indicator-idle::after {
  background: var(--background-modifier-hover);
}

.bs-status-indicator-dnd {
  background: var(--red-400);
}

.bs-status-indicator-dnd::after {
  position: absolute;
  top: 8px;
  right: 4px;
  left: 4px;
  height: 4px;
  border-radius: 2px;
  background: var(--background-floating);
  content: "";
}

.bs-status-trigger .bs-status-indicator-dnd::after {
  background: var(--input-background, var(--background-tertiary));
}

.bs-status-trigger:hover .bs-status-indicator-dnd::after,
.bs-status-trigger[aria-expanded="true"] .bs-status-indicator-dnd::after {
  background: var(--background-modifier-hover);
}

.bs-status-indicator-invisible {
  border: 4px solid var(--interactive-muted);
  background: transparent;
}

.bs-status-menu {
  position: absolute;
  z-index: 1000;
  top: calc(100% + 7px);
  right: 0;
  overflow: hidden;
  width: min(390px, calc(100vw - 48px));
  padding: 8px;
  border: 1px solid var(--background-modifier-accent);
  border-radius: 12px;
  color: var(--interactive-normal);
  background-color: #111214 !important;
  background-image: none !important;
  backdrop-filter: none !important;
  isolation: isolate;
  opacity: 1 !important;
  box-shadow:
    0 16px 40px rgb(0 0 0 / 40%),
    0 0 0 1px rgb(0 0 0 / 12%);
}

.bs-status-menu-portal {
  position: fixed;
  z-index: 10000;
  overflow-x: hidden;
  overflow-y: auto;
}

.theme-light .bs-status-menu {
  background-color: #fff !important;
}

.bs-status-menu-label {
  padding: 5px 10px 7px;
  color: #f2f3f5;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.bs-status-menu-item {
  display: grid;
  width: 100%;
  min-height: 54px;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 13px;
  padding: 8px 10px;
  border: 0;
  border-radius: 7px;
  color: #f2f3f5;
  background: transparent;
  cursor: pointer;
  font: inherit;
  text-align: left;
}

.bs-status-menu .bs-status-item-copy strong {
  color: #fff;
}

.bs-status-menu .bs-status-item-copy small {
  color: rgb(255 255 255 / 78%);
}

.theme-light .bs-status-menu-label,
.theme-light .bs-status-menu-item,
.theme-light .bs-status-menu .bs-status-item-copy strong {
  color: #060607;
}

.theme-light .bs-status-menu .bs-status-item-copy small {
  color: rgb(6 6 7 / 72%);
}

.bs-status-menu-item:hover,
.bs-status-menu-item:focus-visible {
  color: var(--interactive-hover);
  background: var(--background-modifier-hover);
  outline: none;
}

.bs-status-menu-item-selected {
  background: color-mix(in srgb, var(--brand-500) 10%, transparent);
}

.bs-status-check {
  display: grid;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  color: white;
  background: var(--brand-500);
  font-size: 12px;
  font-weight: 800;
  place-items: center;
}

.bs-hotkey {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
}

.bs-hotkey-recording {
  padding: 3px;
  border-radius: 6px;
  outline: 2px solid var(--brand-500);
}

.bs-card-footer {
  min-height: 40px;
  border-top: 1px solid
    color-mix(in srgb, var(--brand-500) 8%, var(--background-modifier-accent));
  background: color-mix(
    in srgb,
    var(--background-secondary-alt) 55%,
    transparent
  );
}

.bs-card-footer > :first-child {
  color: var(--text-muted);
  font-size: 12px;
}

.bs-duplicate-button:hover {
  color: var(--interactive-active);
  border-color: var(--interactive-muted);
  background: var(--background-modifier-selected);
}

.bs-empty {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 8px;
  padding: 42px 24px;
  border: 1px dashed var(--background-modifier-accent);
  border-radius: 15px;
  background: radial-gradient(
    circle at 50% 0,
    color-mix(in srgb, var(--brand-500) 8%, transparent),
    transparent 60%
  );
  text-align: center;
}

@media (width <= 900px) {
  .bs-about {
    grid-template-columns: 1fr;
  }

  .bs-about-preview {
    display: none;
  }

  .bs-schedule-fields { grid-template-columns: 1fr 1fr; }
  .bs-end-action-field { grid-column: span 2; }
  .bs-custom-end-grid { grid-template-columns: 1fr; }
  .bs-sync-controls { grid-template-columns: 1fr 1fr; }
  .bs-sync-actions { grid-column: 1 / -1; }
  .bs-sync-protection { align-items: stretch; flex-direction: column; }
}

@media (width <= 620px) {
  .bs-about {
    padding: 14px;
  }

  .bs-about-icon {
    width: 42px;
    height: 42px;
  }

  .bs-settings {
    padding: 12px;
    border-radius: 14px;
  }

  .bs-control-panel {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .bs-control-icon {
    align-self: start;
    grid-row: 1;
  }

  .bs-update-actions {
    grid-column: 1 / -1;
    align-items: stretch;
    flex-direction: column;
  }

  .bs-update-actions > :first-child {
    width: 100%;
    flex-basis: auto;
  }

  .bs-update-actions > button {
    width: 100%;
  }

  .bs-update-switches {
    width: 100%;
  }

  .bs-update-frequency {
    width: 100%;
  }

  .bs-update-actions .vc-form-switch-wrapper {
    width: 100%;
  }

  .bs-backup-panel {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .bs-section-heading { align-items: stretch; flex-direction: column; }
  .bs-section-actions { align-items: stretch; flex-direction: column; }
  .bs-calendar-week {
    grid-template-columns: repeat(7, 72px);
    overflow-x: auto;
  }
  .bs-schedule-header { grid-template-columns: auto minmax(0, 1fr); }
  .bs-schedule-actions { grid-column: 1 / -1; justify-content: space-between; }
  .bs-schedule-fields { grid-template-columns: 1fr; }
  .bs-end-action-field { grid-column: auto; }
  .bs-end-detail { grid-template-columns: 1fr; }
  .bs-schedule-timeline { padding-inline: 10px; }
  .bs-sync-controls { grid-template-columns: 1fr; }
  .bs-sync-actions { grid-column: auto; flex-direction: column; }
  .bs-sync-protection-actions { flex-direction: column; }

  .bs-backup-actions {
    grid-column: 1 / -1;
  }

  .bs-backup-actions > * {
    flex: 1;
  }

  .bs-import-summary {
    grid-template-columns: 1fr;
  }

  .bs-fields {
    grid-template-columns: 1fr;
  }

  .bs-field-status,
  .bs-field-hotkey {
    grid-column: auto;
  }

  .bs-card-header {
    align-items: flex-start;
  }

  .bs-duplicate-button {
    display: none;
  }

  .bs-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .bs-toolbar-actions {
    width: 100%;
    flex-wrap: wrap;
  }

  .bs-search {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bs-settings *,
  .bs-about-link,
  .bs-preset-card {
    scroll-behavior: auto !important;
    transition-duration: 0s !important;
  }
}
`;

// betterdiscord/src/native.ts
var import_scrypt_js = __toESM(require_scrypt());
var G = globalThis;
var Bd = G.BdApi;
var api = new Bd("BetterStatus");
var REPOSITORY = "Jacksonnn911/BetterStatus";
var COMMIT = true ? "184805ee4edd25c1007f8dad333b4799dc5b46ef" : "development";
var BUILD_CHANNEL = true ? "betterdiscord-port" : "betterdiscord-port";
var AAD = new TextEncoder().encode("BetterStatus encrypted sync document v1");
var VAULT_AAD = new TextEncoder().encode("BetterStatus BetterDiscord secure sessions v1");
var pendingAuth = /* @__PURE__ */ new Map();
var sockets = /* @__PURE__ */ new Map();
var shortcutIds = /* @__PURE__ */ new Map();
var runtime;
var pendingRestartVersion;
var updatePromise;
function bytesToBase64url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function base64urlToBytes(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  const binary = atob(normalized);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}
function randomBytes(length) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}
function randomId() {
  return bytesToBase64url(randomBytes(9));
}
async function sha256(bytes) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
}
function normalizeServerURL(value) {
  const url = new URL(value.trim());
  if (url.protocol !== "https:" && !(url.protocol === "http:" && ["localhost", "127.0.0.1", "::1"].includes(url.hostname)))
    throw new Error("Sync servers must use HTTPS (HTTP is allowed only for localhost). ");
  return url.origin;
}
function openVault() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("BetterStatusSecure", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("vault");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
async function vaultGet(key) {
  const db = await openVault();
  return await new Promise((resolve, reject) => {
    const tx = db.transaction("vault", "readonly");
    const request = tx.objectStore("vault").get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
async function vaultPut(key, value) {
  const db = await openVault();
  await new Promise((resolve, reject) => {
    const tx = db.transaction("vault", "readwrite");
    tx.objectStore("vault").put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
async function vaultKey() {
  let key = await vaultGet("key");
  if (!key) {
    key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
    await vaultPut("key", key);
  }
  return key;
}
async function readSessions() {
  const saved = await vaultGet("sessions");
  if (!saved) return {};
  try {
    const key = await vaultKey();
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: base64urlToBytes(saved.iv), additionalData: VAULT_AAD }, key, base64urlToBytes(saved.data));
    return JSON.parse(new TextDecoder().decode(plain));
  } catch {
    throw new Error("Secure BetterStatus session storage could not be decrypted.");
  }
}
async function writeSessions(sessions) {
  const key = await vaultKey();
  const iv = randomBytes(12);
  const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: VAULT_AAD }, key, new TextEncoder().encode(JSON.stringify(sessions))));
  await vaultPut("sessions", { iv: bytesToBase64url(iv), data: bytesToBase64url(encrypted) });
}
async function cloudSession(serverURL) {
  const server = normalizeServerURL(serverURL);
  const sessions = await readSessions();
  const session = sessions[server];
  if (!session || new Date(session.expiresAt).getTime() <= Date.now()) return void 0;
  if (!session.clientId) {
    session.clientId = randomId();
    await writeSessions(sessions);
  }
  return { server, session };
}
async function netFetch(input, init) {
  return await api.Net.fetch(input, init);
}
async function cloudRequest(server, path, token, init = {}) {
  const response = await netFetch(`${server}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init.headers || {}
    }
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const error = new Error(body.error || `Sync server returned HTTP ${response.status}`);
    error.status = response.status;
    error.current = body.current;
    throw error;
  }
  return response;
}
async function deriveSyncKey(password, salt) {
  const pass = new TextEncoder().encode(password.normalize("NFKC"));
  const raw = await (0, import_scrypt_js.scrypt)(pass, salt, 32768, 8, 1, 32);
  return await crypto.subtle.importKey("raw", raw, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}
function isEncrypted(value) {
  return value?.format === "betterstatus-encrypted-sync" && value?.version === 1 && value?.kdf === "scrypt" && value?.cipher === "aes-256-gcm" && [value.salt, value.iv, value.authTag, value.ciphertext].every((field) => typeof field === "string");
}
async function encryptDocument(document2, password) {
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const key = await deriveSyncKey(password, salt);
  const combined = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: AAD, tagLength: 128 }, key, new TextEncoder().encode(JSON.stringify(document2))));
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
async function decryptDocument(envelope, password) {
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
    const document2 = JSON.parse(new TextDecoder().decode(plain));
    if (document2?.version !== 1 && document2?.version !== 2) throw new Error();
    return document2;
  } catch {
    throw new Error("The sync password is incorrect or the encrypted data is damaged.");
  }
}
function deliverSnapshot(snapshot) {
  try {
    runtime?.receiveCloudSnapshot?.(snapshot);
  } catch (error) {
    console.error("[BetterStatus] sync snapshot failed", error);
  }
}
function connectSocket(server, session) {
  sockets.get(server)?.close();
  const url = new URL(server);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.pathname = "/v1/sync/ws";
  const socket = new WebSocket(url);
  sockets.set(server, socket);
  const timeout = setTimeout(() => {
    if (socket.readyState === WebSocket.CONNECTING) socket.close();
  }, 1e4);
  socket.addEventListener("open", () => socket.send(JSON.stringify({ type: "auth", token: session.token, client_id: session.clientId })));
  socket.addEventListener("message", (event) => {
    try {
      const payload = JSON.parse(String(event.data));
      if (payload.type === "sync" && payload.snapshot) deliverSnapshot(payload.snapshot);
    } catch (error) {
      console.error("[BetterStatus] invalid sync message", error);
    }
  });
  socket.addEventListener("close", () => {
    clearTimeout(timeout);
    if (sockets.get(server) !== socket) return;
    sockets.delete(server);
    setTimeout(async () => {
      if (sockets.has(server)) return;
      const resolved = await cloudSession(server).catch(() => void 0);
      if (resolved) connectSocket(server, resolved.session);
    }, 5e3);
  });
  socket.addEventListener("error", () => socket.close());
}
function hashString(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) hash = Math.imul(hash ^ value.charCodeAt(i), 16777619);
  return hash >>> 0 & 2147483647;
}
function fallbackWindowsKey(name) {
  const upper = name.toUpperCase();
  if (/^[A-Z]$/.test(upper)) return upper.charCodeAt(0);
  if (/^[0-9]$/.test(upper)) return upper.charCodeAt(0);
  const map = {
    CONTROL: 162,
    CTRL: 162,
    SHIFT: 160,
    ALT: 164,
    COMMAND: 91,
    META: 91,
    SPACE: 32,
    ENTER: 13,
    ESCAPE: 27,
    ESC: 27,
    TAB: 9,
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    "-": 189,
    "=": 187,
    "[": 219,
    "]": 221,
    ";": 186,
    "'": 222,
    ",": 188,
    ".": 190,
    "/": 191,
    "\\": 220,
    "`": 192
  };
  if (map[upper] != null) return map[upper];
  const fn = upper.match(/^F(\d{1,2})$/);
  if (fn) return 112 + Number(fn[1]) - 1;
  return void 0;
}
function discordKeyMap() {
  try {
    return Bd.Webpack.getModule((value) => value && typeof value === "object" && typeof value.ctrl === "number" && typeof value.shift === "number" && typeof value.alt === "number", { searchExports: true });
  } catch {
    return void 0;
  }
}
function keyCode(name, keyMap) {
  const lower = name.toLowerCase();
  const aliases = {
    control: ["ctrl", "control", "leftControl"],
    ctrl: ["ctrl", "control", "leftControl"],
    command: ["meta", "command", "cmd", "super"],
    meta: ["meta", "command", "cmd", "super"],
    alt: ["alt"],
    shift: ["shift"],
    space: ["space"],
    escape: ["escape", "esc"],
    esc: ["escape", "esc"],
    up: ["up", "arrowUp"],
    down: ["down", "arrowDown"],
    left: ["left", "arrowLeft"],
    right: ["right", "arrowRight"]
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
    try {
      utils?.inputEventUnregister?.(id);
    } catch {
    }
  }
  shortcutIds.clear();
}
function registerHotkeys(presets) {
  unregisterAll();
  const utils = discordUtils();
  const keyMap = discordKeyMap();
  const results = [];
  if (!utils?.inputEventRegister) return presets.map((preset) => ({ id: preset.id, registered: false, error: "Discord global keybind API is unavailable." }));
  for (const preset of presets) {
    if (!preset.enabled || !preset.hotkey) continue;
    const parts = String(preset.hotkey).split("+").filter(Boolean);
    const codes = parts.map((part) => keyCode(part, keyMap));
    if (codes.some((code) => typeof code !== "number")) {
      results.push({ id: preset.id, registered: false, error: `Unsupported shortcut: ${preset.hotkey}` });
      continue;
    }
    let id = hashString(`BetterStatus:${preset.id}`) || 1;
    while (shortcutIds.has(id)) id++;
    try {
      utils.inputEventRegister(id, codes.map((code) => [0, code]), (isDown) => {
        if (isDown) runtime?.triggerPreset?.(preset.id);
      }, { blurred: true, focused: true, keydown: true, keyup: true });
      shortcutIds.set(id, preset.id);
      results.push({ id: preset.id, registered: true });
    } catch (error) {
      results.push({ id: preset.id, registered: false, error: error?.message || String(error) });
    }
  }
  return results;
}
function rawPluginURL(channel) {
  const branch = channel === "dev" ? "dev" : "prod";
  return `https://raw.githubusercontent.com/${REPOSITORY}/${branch}/betterdiscord/BetterStatus.plugin.js`;
}
function parseBuild(text) {
  return text.match(/@build\s+([0-9a-f]{7,40}|development)/i)?.[1];
}
async function fetchRemotePlugin(channel) {
  const response = await netFetch(rawPluginURL(channel), { cache: "no-store" });
  if (!response.ok) {
    const error = new Error(`BetterDiscord build is unavailable on ${channel} (HTTP ${response.status}).`);
    if (response.status === 403 || response.status === 429) {
      const retryAfter = Number(response.headers.get("retry-after"));
      const reset = Number(response.headers.get("x-ratelimit-reset"));
      error.retryAt = retryAfter > 0 ? Date.now() + retryAfter * 1e3 : reset > 0 ? reset * 1e3 : Date.now() + 15 * 6e4;
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
    installedChannel: BUILD_CHANNEL === "dev" ? "dev" : BUILD_CHANNEL === "prod" ? "prod" : void 0,
    installedVersion: COMMIT,
    latestVersion: remote.version,
    status: pendingRestartVersion ? "restartRequired" : remote.version === COMMIT ? "current" : "updateAvailable"
  };
}
function checkForUpdates(enabled, requestedChannel = "prod", force = false) {
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
    } catch (error) {
      return { status: "failed", error: error?.message || String(error), retryAt: error?.retryAt };
    }
  })().finally(() => {
    updatePromise = void 0;
  });
  return updatePromise;
}
async function getCloudSyncStatus(serverURL) {
  const resolved = await cloudSession(serverURL);
  return resolved ? {
    connected: true,
    discordUserId: resolved.session.discordUserId,
    expiresAt: resolved.session.expiresAt,
    encryptionPasswordSet: Boolean(resolved.session.encryptionPassword)
  } : { connected: false };
}
async function beginCloudSyncAuthorization(serverURL) {
  const server = normalizeServerURL(serverURL);
  const verifier = bytesToBase64url(randomBytes(32));
  const challenge = bytesToBase64url(await sha256(new TextEncoder().encode(verifier)));
  const response = await netFetch(`${server}/v1/auth/requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ challenge })
  });
  if (!response.ok) throw new Error(`Could not start Discord authorization (HTTP ${response.status}).`);
  const request = await response.json();
  const authorize = new URL(request.authorize_url);
  const clientId = authorize.searchParams.get("client_id");
  const redirectUri = authorize.searchParams.get("redirect_uri");
  const state = authorize.searchParams.get("state");
  if (authorize.origin !== "https://discord.com" || !clientId || !redirectUri || !state) throw new Error("The sync server returned an invalid Discord authorization request.");
  const expiresAt = Math.min(new Date(request.expires_at).getTime(), Date.now() + 10 * 6e4);
  pendingAuth.set(request.request_id, { server, verifier, expiresAt, authorizeUrl: authorize.toString(), state });
  return { requestId: request.request_id, clientId, redirectUri, state };
}
async function openExternalAuthorization(state) {
  const pending = [...pendingAuth.values()].find((item) => item.state === state);
  if (!pending) throw new Error("Discord authorization request expired.");
  if (G.DiscordNative?.nativeModules?.requireModule) {
    try {
      const shell = G.require?.("electron")?.shell;
      if (shell?.openExternal) return await shell.openExternal(pending.authorizeUrl);
    } catch {
    }
  }
  window.open(pending.authorizeUrl, "_blank", "noopener,noreferrer");
}
async function completeCloudSyncAuthorization(serverURL, requestId, callbackLocation) {
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verifier: pending.verifier })
      });
      if (response.status === 409) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        continue;
      }
      if (!response.ok) throw new Error(`Discord authorization failed (HTTP ${response.status}).`);
      const result = await response.json();
      const sessions = await readSessions();
      sessions[server] = { token: result.token, expiresAt: result.expires_at, discordUserId: result.discord_user_id, clientId: randomId() };
      await writeSessions(sessions);
      connectSocket(server, sessions[server]);
      return { connected: true, discordUserId: result.discord_user_id, expiresAt: result.expires_at };
    }
  } finally {
    pendingAuth.delete(requestId);
  }
  throw new Error("Discord authorization expired. Please try again.");
}
async function pullCloudSync(serverURL) {
  const resolved = await cloudSession(serverURL);
  if (!resolved) throw new Error("Connect Discord before synchronizing.");
  const response = await cloudRequest(resolved.server, "/v1/sync", resolved.session.token, { headers: { "X-BetterStatus-Client": resolved.session.clientId } });
  return await response.json();
}
async function startCloudSync(serverURL) {
  const resolved = await cloudSession(serverURL);
  if (!resolved) return { connected: false };
  const response = await cloudRequest(resolved.server, "/v1/sync", resolved.session.token, { headers: { "X-BetterStatus-Client": resolved.session.clientId } });
  const snapshot = await response.json();
  connectSocket(resolved.server, resolved.session);
  return { connected: true, discordUserId: resolved.session.discordUserId, expiresAt: resolved.session.expiresAt, snapshot };
}
async function decodeCloudSyncSnapshot(serverURL, snapshot) {
  if (!isEncrypted(snapshot.document)) return { snapshot, encrypted: false, locked: false };
  const resolved = await cloudSession(serverURL);
  const password = resolved?.session.encryptionPassword;
  if (!password) return { snapshot, encrypted: true, locked: true };
  try {
    return { snapshot: { ...snapshot, document: await decryptDocument(snapshot.document, password) }, encrypted: true, locked: false };
  } catch {
    return { snapshot, encrypted: true, locked: true };
  }
}
async function unlockCloudSync(serverURL, password) {
  const resolved = await cloudSession(serverURL);
  if (!resolved) throw new Error("Connect Discord before unlocking cloud sync.");
  const response = await cloudRequest(resolved.server, "/v1/sync", resolved.session.token);
  const snapshot = await response.json();
  if (!isEncrypted(snapshot.document)) throw new Error("This sync account is not password protected.");
  const document2 = await decryptDocument(snapshot.document, password);
  const sessions = await readSessions();
  sessions[resolved.server] = { ...resolved.session, encryptionPassword: password };
  await writeSessions(sessions);
  return { snapshot: { ...snapshot, document: document2 }, encrypted: true, locked: false };
}
async function setCloudEncryptionPassword(serverURL, password) {
  if (password.length < 12) throw new Error("Use at least 12 characters.");
  const resolved = await cloudSession(serverURL);
  if (!resolved) throw new Error("Connect Discord before changing cloud protection.");
  const sessions = await readSessions();
  sessions[resolved.server] = { ...resolved.session, encryptionPassword: password };
  await writeSessions(sessions);
  return { encryptionPasswordSet: true };
}
async function clearCloudEncryptionPassword(serverURL) {
  const resolved = await cloudSession(serverURL);
  if (!resolved) throw new Error("Connect Discord before changing cloud protection.");
  const sessions = await readSessions();
  sessions[resolved.server] = { ...resolved.session };
  delete sessions[resolved.server].encryptionPassword;
  await writeSessions(sessions);
  return { encryptionPasswordSet: false };
}
async function pushCloudSync(serverURL, baseRevision, document2) {
  const resolved = await cloudSession(serverURL);
  if (!resolved) throw new Error("Connect Discord before synchronizing.");
  const outgoing = resolved.session.encryptionPassword ? await encryptDocument(document2, resolved.session.encryptionPassword) : document2;
  try {
    const maxClock = (document2.events || []).reduce((max, event) => Math.max(max, event.clock), 0);
    const response = await cloudRequest(resolved.server, "/v1/sync", resolved.session.token, {
      method: "PUT",
      headers: {
        "X-BetterStatus-Client": resolved.session.clientId,
        "X-BetterStatus-Schema": String(document2.version),
        "X-BetterStatus-Events": String(document2.events?.length || 0),
        "X-BetterStatus-Max-Clock": String(maxClock)
      },
      body: JSON.stringify({ base_revision: baseRevision, document: outgoing })
    });
    return { ...await response.json(), conflict: false };
  } catch (error) {
    if (error.status === 409 && error.current) return { ...error.current, conflict: true };
    throw error;
  }
}
async function disconnectCloudSync(serverURL) {
  const server = normalizeServerURL(serverURL);
  const sessions = await readSessions();
  const session = sessions[server];
  sockets.get(server)?.close();
  sockets.delete(server);
  if (session) {
    await cloudRequest(server, "/v1/session", session.token, { method: "DELETE" }).catch(() => void 0);
    delete sessions[server];
    await writeSessions(sessions);
  }
  return { connected: false };
}
var Native = {
  attachRuntime(value) {
    runtime = value;
  },
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
var native_default = Native;

// betterdiscord/src/compat.tsx
var G2 = globalThis;
var Bd2 = G2.BdApi;
if (!Bd2) throw new Error("BetterStatus requires BetterDiscord/BdApi.");
var React2 = Bd2.React;
var ReactDOM = Bd2.ReactDOM;
var createRoot = Bd2.ReactDOM.createRoot;
var api2 = new Bd2("BetterStatus");
G2.Vencord ??= {};
G2.Vencord.Plugins ??= {};
G2.Vencord.Plugins.plugins ??= {};
G2.VencordNative ??= {};
G2.VencordNative.pluginHelpers ??= {};
G2.VencordNative.pluginHelpers.BetterStatus = native_default;
var OptionType = Object.freeze({ CUSTOM: "CUSTOM", COMPONENT: "COMPONENT" });
function userSettingsModules() {
  const store = Bd2.Webpack.getStore("UserSettingsProtoStore");
  const actions = Bd2.Webpack.getModule(
    (module2) => module2?.ProtoClass?.typeName?.endsWith?.(".PreloadedUserSettings") && typeof module2.updateAsync === "function",
    { first: true, searchExports: true }
  );
  return { store, actions };
}
function getUserSettingLazy(group, key) {
  return {
    getSetting() {
      const { store } = userSettingsModules();
      if (group === "status" && key === "status") return store?.settings?.status?.status?.value;
      if (group === "status" && key === "customStatus") return store?.settings?.status?.customStatus;
      return store?.settings?.[group]?.[key]?.value ?? store?.settings?.[group]?.[key];
    },
    async updateSetting(value) {
      const { actions } = userSettingsModules();
      if (!actions?.updateAsync) throw new Error("Discord UserSettingsProtoActions is unavailable.");
      await actions.updateAsync(group, (draft) => {
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
function showNotification(options) {
  return api2.UI.showNotification({
    title: options?.title || "BetterStatus",
    content: options?.richBody ?? options?.body ?? "",
    type: /failed|error/i.test(options?.title || "") ? "error" : "info",
    duration: options?.noPersist ? 6e3 : 8e3
  });
}
function relaunch() {
  if (G2.DiscordNative?.app?.relaunch) return G2.DiscordNative.app.relaunch();
  location.reload();
}
function Link(props) {
  const { href, children, ...rest } = props;
  return React2.createElement("a", { ...rest, href, target: rest.target ?? "_blank", rel: "noreferrer noopener" }, children);
}
var BdButton = Bd2.Components.Button;
function Button({ variant, ...props }) {
  const color = variant === "danger" ? BdButton.Colors?.RED : props.color;
  return React2.createElement(BdButton, { ...props, color }, props.children);
}
Button.Colors = BdButton.Colors;
Button.Looks = BdButton.Looks;
Button.Sizes = BdButton.Sizes;
var TextInput = Bd2.Components.TextInput;
function openPluginModal() {
  G2.__BETTERSTATUS_OPEN_SETTINGS__?.();
}
var compat_default = React2;

// betterdiscord/src/settings.ts
var G3 = globalThis;
var Bd3 = G3.BdApi;
if (!Bd3) throw new Error("BetterStatus requires BetterDiscord/BdApi.");
var api3 = new Bd3("BetterStatus");
var React3 = Bd3.React;
var listeners = /* @__PURE__ */ new Set();
var singleton;
function clone(value) {
  if (value === void 0) return value;
  return JSON.parse(JSON.stringify(value));
}
function definePluginSettings(definitions) {
  if (singleton) return singleton;
  const defaults = {};
  for (const [key, definition] of Object.entries(definitions)) {
    if (Object.prototype.hasOwnProperty.call(definition, "default"))
      defaults[key] = clone(definition.default);
  }
  let saved = api3.Data.load("settings") || {};
  const legacy = api3.Data.load("state");
  if ((!saved || !Object.keys(saved).length) && legacy && typeof legacy === "object") {
    saved = {
      presets: legacy.presets,
      schedules: legacy.schedules,
      savedStatuses: legacy.history,
      activePresetId: legacy.activePresetId
    };
  }
  const state = { ...defaults, ...saved || {} };
  const persist = () => api3.Data.save("settings", state);
  const notify = () => {
    persist();
    for (const listener of [...listeners]) {
      try {
        listener();
      } catch {
      }
    }
  };
  const store = new Proxy(state, {
    set(target, property, value) {
      target[property] = value;
      notify();
      return true;
    },
    deleteProperty(target, property) {
      delete target[property];
      notify();
      return true;
    }
  });
  const settings2 = {
    store,
    plain: state,
    def: definitions,
    definitions,
    pluginName: "BetterStatus",
    use(keys) {
      const [, rerender] = React3.useReducer((value) => value + 1, 0);
      React3.useEffect(() => {
        listeners.add(rerender);
        return () => listeners.delete(rerender);
      }, []);
      if (!keys) return store;
      const result = {};
      for (const key of keys) result[key] = store[key];
      return result;
    },
    withPrivateSettings() {
      return this;
    }
  };
  singleton = settings2;
  persist();
  return settings2;
}
function migratePluginSettings() {
}

// betterdiscord/src/ui.tsx
var G4 = globalThis;
var Bd4 = G4.BdApi;
if (!Bd4) throw new Error("BetterStatus requires BetterDiscord/BdApi.");
var api4 = new Bd4("BetterStatus");
var React4 = Bd4.React;
var ReactDOM2 = Bd4.ReactDOM;
var createRoot2 = Bd4.ReactDOM.createRoot;
function findFunctionByCode(...needles) {
  try {
    return Bd4.Webpack.getModule(
      (value) => typeof value === "function" && needles.every((needle) => String(value).includes(needle)),
      { searchExports: true }
    );
  } catch {
    return void 0;
  }
}
function findComponentByName(name) {
  try {
    return Bd4.Webpack.getModule(
      (value) => typeof value === "function" && (value.displayName === name || value.name === name),
      { searchExports: true }
    );
  } catch {
    return void 0;
  }
}
var NativeTextInput = findFunctionByCode('setHasValue?.(""!==', '="text",') || findComponentByName("TextInput") || Bd4.Components?.TextInput;
var NativeSelect = findFunctionByCode('selectionMode:"single",onSelectionChange:', "isSelected:") || findComponentByName("Select");
var NativeOAuth2AuthorizeModal = findFunctionByCode("hasContentBackground", "nextStep", "onClose?.()") || findComponentByName("OAuth2AuthorizeModal");
var NativeConfirmModal = findComponentByName("ConfirmModal");
function cx(...values) {
  return values.filter(Boolean).join(" ");
}
var buttonColorMapping = {
  BRAND: "primary",
  PRIMARY: "secondary",
  RED: "dangerPrimary",
  TRANSPARENT: "secondary",
  CUSTOM: "none",
  GREEN: "positive",
  LINK: "link",
  WHITE: "overlayPrimary"
};
var textButtonColorMapping = {
  BRAND: "primary",
  PRIMARY: "primary",
  RED: "danger",
  TRANSPARENT: "secondary",
  CUSTOM: "secondary",
  GREEN: "primary",
  LINK: "link",
  WHITE: "secondary"
};
function normalizeButtonSize(size) {
  if (!size) return "medium";
  const value = String(size).toLowerCase();
  if (value === "none" || value === "min") return "min";
  if (value === "small") return "small";
  if (value === "xs") return "xs";
  if (value === "icononly") return "iconOnly";
  return "medium";
}
function Button2(props) {
  const {
    look,
    color = "BRAND",
    size = "medium",
    variant,
    className,
    children,
    ...rest
  } = props;
  const linkLook = look === "LINK";
  if (linkLook) {
    const textVariant = textButtonColorMapping[color] || "primary";
    return React4.createElement(
      "button",
      { ...rest, className: cx("vc-text-btn-base", `vc-text-btn-${textVariant}`, className) },
      children
    );
  }
  const resolvedVariant = variant || buttonColorMapping[color] || "primary";
  const resolvedSize = normalizeButtonSize(size);
  return React4.createElement(
    "button",
    {
      ...rest,
      "data-mana-component": "button",
      className: cx("vc-btn-base", `vc-btn-${resolvedVariant}`, `vc-btn-${resolvedSize}`, className)
    },
    children
  );
}
Button2.Looks = { FILLED: "", LINK: "LINK" };
Button2.Colors = {
  BRAND: "BRAND",
  PRIMARY: "PRIMARY",
  RED: "RED",
  TRANSPARENT: "TRANSPARENT",
  CUSTOM: "CUSTOM",
  GREEN: "GREEN",
  LINK: "LINK",
  WHITE: "WHITE"
};
Button2.Sizes = {
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "medium",
  XLARGE: "medium",
  NONE: "min",
  MIN: "min"
};
function Switch({ checked, onChange, disabled }) {
  const [focusVisible, setFocusVisible] = React4.useState(false);
  const handleFocusChange = (event) => setFocusVisible(event.currentTarget.matches(":focus-visible"));
  return React4.createElement(
    "div",
    null,
    React4.createElement(
      "div",
      {
        className: cx(
          "vc-switch-container",
          checked && "vc-switch-checked",
          disabled && "vc-switch-disabled",
          focusVisible && "vc-switch-focusVisible"
        )
      },
      React4.createElement(
        "svg",
        {
          className: "vc-switch-slider",
          viewBox: "0 0 28 20",
          preserveAspectRatio: "xMinYMid meet",
          "aria-hidden": true,
          style: { transform: checked ? "translateX(12px)" : "translateX(-3px)" }
        },
        React4.createElement("rect", { fill: "white", x: 4, y: 0, height: 20, width: 20, rx: 10 }),
        React4.createElement(
          "svg",
          { viewBox: "0 0 20 20", fill: "none" },
          checked ? React4.createElement(
            React4.Fragment,
            null,
            React4.createElement("path", { fill: "var(--brand-500)", d: "M7.89561 14.8538L6.30462 13.2629L14.3099 5.25755L15.9009 6.84854L7.89561 14.8538Z" }),
            React4.createElement("path", { fill: "var(--brand-500)", d: "M4.08643 11.0903L5.67742 9.49929L9.4485 13.2704L7.85751 14.8614L4.08643 11.0903Z" })
          ) : React4.createElement(
            React4.Fragment,
            null,
            React4.createElement("path", { fill: "var(--primary-400)", d: "M5.13231 6.72963L6.7233 5.13864L14.855 13.2704L13.264 14.8614L5.13231 6.72963Z" }),
            React4.createElement("path", { fill: "var(--primary-400)", d: "M13.2704 5.13864L14.8614 6.72963L6.72963 14.8614L5.13864 13.2704L13.2704 5.13864Z" })
          )
        )
      ),
      React4.createElement("input", {
        onFocus: handleFocusChange,
        onBlur: handleFocusChange,
        disabled,
        type: "checkbox",
        className: "vc-switch-input",
        tabIndex: 0,
        checked: Boolean(checked),
        onChange: (event) => onChange?.(event.currentTarget.checked)
      })
    )
  );
}
function FormSwitch({ title, description, note, value, onChange, disabled, className, hideBorder }) {
  const detail = description ?? note;
  return React4.createElement(
    "label",
    { className: "vc-form-switch-wrapper" },
    React4.createElement(
      "div",
      { className: cx("vc-form-switch", className, disabled && "vc-form-switch-disabled") },
      React4.createElement(
        "div",
        { className: "vc-form-switch-text" },
        React4.createElement("span", { className: "vc-form-switch-title" }, title),
        detail ? React4.createElement("span", { className: "vc-form-switch-description" }, detail) : null
      ),
      React4.createElement(Switch, { checked: Boolean(value), onChange, disabled })
    ),
    !hideBorder ? React4.createElement("div", { className: "vc-form-switch-border" }) : null
  );
}
function TextInput2(props) {
  if (NativeTextInput) return React4.createElement(NativeTextInput, props);
  const { onChange, ...rest } = props;
  return React4.createElement("input", {
    ...rest,
    className: cx("bs-bd-text-input", props.className),
    onChange: (event) => onChange?.(event.currentTarget.value)
  });
}
function Select(props) {
  if (NativeSelect) return React4.createElement(NativeSelect, props);
  const { options = [], select, serialize, isSelected, ...rest } = props;
  const selected = options.find((option) => isSelected?.(option.value))?.value ?? props.value ?? options[0]?.value;
  return React4.createElement(
    "select",
    {
      ...rest,
      className: cx("bs-bd-select", props.className),
      value: serialize ? serialize(selected) : selected,
      onChange: (event) => {
        const raw = event.currentTarget.value;
        const option = options.find((candidate) => String(serialize ? serialize(candidate.value) : candidate.value) === raw);
        select?.(option ? option.value : raw);
      }
    },
    options.map((option) => React4.createElement(
      "option",
      { key: String(serialize ? serialize(option.value) : option.value), value: String(serialize ? serialize(option.value) : option.value), disabled: option.disabled },
      option.label
    ))
  );
}
var Forms = {
  FormTitle({ children, className = "", ...rest }) {
    return React4.createElement("h5", { ...rest, className: cx("vc-form-title", className) }, children);
  },
  FormText({ children, className = "", ...rest }) {
    return React4.createElement("div", { ...rest, className: cx("vc-form-text", className) }, children);
  }
};
function findModalActions() {
  try {
    return Bd4.Webpack.getByKeys?.("openModal", "closeModal") || Bd4.Webpack.getModule((module2) => typeof module2?.openModal === "function" && typeof module2?.closeModal === "function");
  } catch {
    return void 0;
  }
}
function openModal(renderer) {
  const actions = findModalActions();
  if (actions?.openModal) return actions.openModal(renderer);
  const content = renderer({ onClose() {
  }, transitionState: 1 });
  return api4.UI.showConfirmationModal("BetterStatus", content, { confirmText: null, cancelText: "Close" });
}
function ConfirmModal(props) {
  if (NativeConfirmModal) return React4.createElement(NativeConfirmModal, props);
  const [error, setError] = React4.useState("");
  const confirm = async () => {
    try {
      setError("");
      await props.onConfirm?.(setError);
      props.onClose?.();
    } catch (failure) {
      setError((current) => current || failure?.message || String(failure));
    }
  };
  return React4.createElement(
    "div",
    { className: "bs-bd-fallback-modal" },
    React4.createElement("h2", null, props.title),
    props.children,
    error ? React4.createElement("div", { className: "bs-bd-modal-error" }, error) : null,
    React4.createElement(
      "div",
      { className: "bs-bd-modal-actions" },
      React4.createElement(Button2, { onClick: confirm }, props.confirmText || "Confirm"),
      React4.createElement(Button2, { color: Button2.Colors.PRIMARY, onClick: () => {
        props.onCancel?.();
        props.onClose?.();
      } }, props.cancelText || "Cancel")
    )
  );
}
function OAuth2AuthorizeModal(props) {
  if (NativeOAuth2AuthorizeModal) return React4.createElement(NativeOAuth2AuthorizeModal, props);
  return React4.createElement(
    "div",
    { className: "bs-password-modal" },
    React4.createElement(Forms.FormText, null, "Authorize BetterStatus with Discord in your browser, then return here."),
    React4.createElement(Button2, {
      onClick: async () => {
        try {
          await native_default.openExternalAuthorization(props.state);
          await props.callback?.({ location: "betterstatus-external" });
        } catch (error) {
          api4.UI.showToast(error?.message || String(error), { type: "error" });
        }
      }
    }, "Authorize with Discord")
  );
}

// src/savedStatuses.ts
var MAX_SAVED_STATUSES = 1e3;
function createSavedStatusId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function normalizeSavedStatuses(value) {
  if (!Array.isArray(value))
    return [];
  const byText = /* @__PURE__ */ new Map();
  for (const item of value) {
    if (!item || typeof item !== "object")
      continue;
    const candidate = item;
    const text = typeof candidate.text === "string" ? candidate.text.trim() : "";
    if (!text)
      continue;
    const now = Date.now();
    const normalized = {
      id: typeof candidate.id === "string" && candidate.id ? candidate.id : createSavedStatusId(),
      text,
      favorite: candidate.favorite === true,
      createdAt: Number.isFinite(candidate.createdAt) ? candidate.createdAt : now,
      lastUsedAt: Number.isFinite(candidate.lastUsedAt) ? candidate.lastUsedAt : now,
      useCount: Number.isFinite(candidate.useCount) && candidate.useCount > 0 ? candidate.useCount : 1
    };
    const existing = byText.get(text);
    if (!existing || normalized.lastUsedAt > existing.lastUsedAt) {
      byText.set(text, {
        ...normalized,
        favorite: normalized.favorite || existing?.favorite === true,
        useCount: Math.max(normalized.useCount, existing?.useCount ?? 1)
      });
    } else if (normalized.favorite) {
      byText.set(text, { ...existing, favorite: true });
    }
  }
  return [...byText.values()].sort((a, b) => Number(b.favorite) - Number(a.favorite) || b.lastUsedAt - a.lastUsedAt).slice(0, MAX_SAVED_STATUSES);
}
function rememberStatusInLibrary(statuses, value, now = Date.now()) {
  const text = value.trim();
  if (!text)
    return statuses;
  const existing = statuses.find((status) => status.text === text);
  if (existing) {
    return statuses.map((status) => status.id === existing.id ? { ...status, lastUsedAt: now, useCount: status.useCount + 1 } : status);
  }
  const nextStatus = {
    id: createSavedStatusId(),
    text,
    favorite: false,
    createdAt: now,
    lastUsedAt: now,
    useCount: 1
  };
  if (statuses.length < MAX_SAVED_STATUSES)
    return [...statuses, nextStatus];
  const oldestNonFavorite = statuses.filter((status) => !status.favorite).sort((a, b) => a.lastUsedAt - b.lastUsedAt)[0];
  if (!oldestNonFavorite)
    return statuses;
  return [...statuses.filter((status) => status.id !== oldestNonFavorite.id), nextStatus];
}

// src/StatusSwitcher.tsx
var PRESENCES = [
  { value: "online", label: "Online" },
  { value: "idle", label: "Idle", description: "You may be away" },
  {
    value: "dnd",
    label: "Do Not Disturb",
    description: "You will not receive desktop notifications"
  },
  {
    value: "invisible",
    label: "Invisible",
    description: "You will appear offline"
  }
];
function PresenceIcon({ presence }) {
  return /* @__PURE__ */ React4.createElement(
    "span",
    {
      "aria-hidden": "true",
      className: `bs-status-indicator bs-status-indicator-${presence}`
    }
  );
}
function ChevronIcon() {
  return /* @__PURE__ */ React4.createElement("svg", { "aria-hidden": "true", viewBox: "0 0 24 24", width: "20", height: "20" }, /* @__PURE__ */ React4.createElement(
    "path",
    {
      fill: "currentColor",
      d: "M8.3 4.7a1 1 0 0 1 1.4 0l6.6 6.6a1 1 0 0 1 0 1.4l-6.6 6.6a1 1 0 1 1-1.4-1.4l5.9-5.9-5.9-5.9a1 1 0 0 1 0-1.4Z"
    }
  ));
}
function StatusSwitcher({
  presence,
  onPresenceChange
}) {
  const rootRef = React4.useRef(null);
  const menuRef = React4.useRef(null);
  const [open, setOpen] = React4.useState(false);
  const [menuStyle, setMenuStyle] = React4.useState({});
  const updateMenuPosition = React4.useCallback(() => {
    const trigger = rootRef.current?.getBoundingClientRect();
    if (!trigger) return;
    const viewportPadding = 16;
    const gap = 7;
    const width = Math.min(390, window.innerWidth - viewportPadding * 2);
    const estimatedHeight = 318;
    const spaceBelow = window.innerHeight - trigger.bottom - viewportPadding;
    const spaceAbove = trigger.top - viewportPadding;
    const placeBelow = spaceBelow >= estimatedHeight || spaceBelow >= spaceAbove;
    const availableHeight = Math.max(180, (placeBelow ? spaceBelow : spaceAbove) - gap);
    setMenuStyle({
      top: placeBelow ? trigger.bottom + gap : Math.max(viewportPadding, trigger.top - gap - Math.min(estimatedHeight, availableHeight)),
      left: Math.min(
        window.innerWidth - viewportPadding - width,
        Math.max(viewportPadding, trigger.right - width)
      ),
      right: "auto",
      width,
      maxHeight: availableHeight
    });
  }, []);
  React4.useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event) => {
      const target = event.target;
      if (!rootRef.current?.contains(target) && !menuRef.current?.contains(target))
        setOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);
    updateMenuPosition();
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [open, updateMenuPosition]);
  const currentPresence = PRESENCES.find(
    (option) => option.value === presence
  );
  return /* @__PURE__ */ React4.createElement("div", { className: "bs-status-switcher", ref: rootRef }, /* @__PURE__ */ React4.createElement(
    "button",
    {
      type: "button",
      className: "bs-status-trigger",
      "aria-expanded": open,
      "aria-haspopup": "menu",
      onClick: () => setOpen((current) => !current)
    },
    /* @__PURE__ */ React4.createElement(PresenceIcon, { presence }),
    /* @__PURE__ */ React4.createElement("span", { className: "bs-status-trigger-copy" }, /* @__PURE__ */ React4.createElement("strong", null, currentPresence.label), /* @__PURE__ */ React4.createElement("small", null, currentPresence.description ?? "Available and receiving notifications")),
    /* @__PURE__ */ React4.createElement(ChevronIcon, null)
  ), open && ReactDOM2.createPortal(
    /* @__PURE__ */ React4.createElement(
      "div",
      {
        className: "bs-status-menu bs-status-menu-portal",
        role: "menu",
        ref: menuRef,
        style: menuStyle
      },
      /* @__PURE__ */ React4.createElement("div", { className: "bs-status-menu-label" }, "Set presence"),
      PRESENCES.map((option) => /* @__PURE__ */ React4.createElement(
        "button",
        {
          type: "button",
          role: "menuitemradio",
          "aria-checked": option.value === presence,
          className: `bs-status-menu-item${option.value === presence ? " bs-status-menu-item-selected" : ""}`,
          key: option.value,
          onClick: () => {
            onPresenceChange(option.value);
            setOpen(false);
          }
        },
        /* @__PURE__ */ React4.createElement(PresenceIcon, { presence: option.value }),
        /* @__PURE__ */ React4.createElement("span", { className: "bs-status-item-copy" }, /* @__PURE__ */ React4.createElement("strong", null, option.label), option.description && /* @__PURE__ */ React4.createElement("small", null, option.description)),
        option.value === presence && /* @__PURE__ */ React4.createElement("span", { className: "bs-status-check" }, "\u2713")
      ))
    ),
    document.body
  ));
}

// src/Settings.tsx
var Native2 = VencordNative.pluginHelpers.BetterStatus;
function recordCloudSyncChanges() {
  const runtime2 = Vencord.Plugins.plugins.BetterStatus;
  runtime2?.recordCloudSyncChanges?.();
}
function pluginRuntime() {
  return Vencord.Plugins.plugins.BetterStatus;
}
var syncPasswordPromptOpen = false;
var AUTO_RESTART_WINDOW_MS = 5 * 6e4;
var AUTO_RESTART_COOLDOWN_MS = 60 * 6e4;
var autoRestartScheduledThisProcess = false;
function initializeAutoRestartGuard(now = Date.now()) {
  const existingPause = settings.store.autoRestartPausedUntil;
  if (typeof existingPause === "number" && existingPause > now)
    return { newlyPaused: false, pausedUntil: existingPause };
  if (existingPause !== void 0)
    settings.store.autoRestartPausedUntil = void 0;
  const history = (settings.store.autoRestartHistory ?? []).filter(
    (timestamp) => Number.isFinite(timestamp) && timestamp <= now && timestamp >= now - AUTO_RESTART_WINDOW_MS
  ).sort((left, right) => left - right).slice(-2);
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
function prepareAutoRestart(now = Date.now()) {
  if (!settings.store.autoRestart || autoRestartScheduledThisProcess)
    return false;
  const guard = initializeAutoRestartGuard(now);
  if (guard.pausedUntil !== void 0)
    return false;
  settings.store.autoRestartHistory = [
    ...settings.store.autoRestartHistory ?? [],
    now
  ].filter((timestamp) => timestamp >= now - AUTO_RESTART_WINDOW_MS).slice(-2);
  autoRestartScheduledThisProcess = true;
  return true;
}
function formatAutoRestartPause(pausedUntil) {
  return new Date(pausedUntil).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}
function SyncPasswordModal({
  modalProps,
  onUnlock
}) {
  const [password, setPassword] = React4.useState("");
  return /* @__PURE__ */ React4.createElement(
    ConfirmModal,
    {
      ...modalProps,
      title: "Unlock BetterStatus sync",
      confirmText: "Unlock",
      cancelText: "Not now",
      variant: "primary",
      onCancel: () => syncPasswordPromptOpen = false,
      onConfirm: async (setError) => {
        try {
          await onUnlock(password);
          syncPasswordPromptOpen = false;
        } catch (error) {
          setError(error instanceof Error ? error.message : String(error));
          throw error;
        }
      }
    },
    /* @__PURE__ */ React4.createElement("div", { className: "bs-password-modal" }, /* @__PURE__ */ React4.createElement(Forms.FormText, null, "This account contains client-side encrypted configuration. Enter its sync password to decrypt it on this device. The password is never sent to the sync server."), /* @__PURE__ */ React4.createElement(
      "input",
      {
        autoFocus: true,
        className: "bs-password-input",
        type: "password",
        value: password,
        placeholder: "Sync password",
        onChange: (event) => setPassword(event.currentTarget.value)
      }
    ))
  );
}
function requestSyncPassword(onUnlock) {
  if (syncPasswordPromptOpen) return;
  syncPasswordPromptOpen = true;
  openModal((modalProps) => /* @__PURE__ */ React4.createElement(SyncPasswordModal, { modalProps, onUnlock }));
}
function CloudProtectionModal({
  modalProps,
  changing,
  onSave
}) {
  const [password, setPassword] = React4.useState("");
  const [confirmation, setConfirmation] = React4.useState("");
  return /* @__PURE__ */ React4.createElement(
    ConfirmModal,
    {
      ...modalProps,
      title: changing ? "Change sync password" : "Protect cloud sync",
      confirmText: changing ? "Change password" : "Encrypt sync",
      cancelText: "Cancel",
      variant: "primary",
      onConfirm: async (setError) => {
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
      }
    },
    /* @__PURE__ */ React4.createElement("div", { className: "bs-password-modal" }, /* @__PURE__ */ React4.createElement(Forms.FormText, null, "BetterStatus will encrypt the complete configuration on this device before uploading it. Other clients must enter the same password. Forgotten passwords cannot be recovered by the server."), /* @__PURE__ */ React4.createElement(
      "input",
      {
        autoFocus: true,
        className: "bs-password-input",
        type: "password",
        value: password,
        placeholder: "New password \xB7 at least 12 characters",
        onChange: (event) => setPassword(event.currentTarget.value)
      }
    ), /* @__PURE__ */ React4.createElement(
      "input",
      {
        className: "bs-password-input",
        type: "password",
        value: confirmation,
        placeholder: "Confirm password",
        onChange: (event) => setConfirmation(event.currentTarget.value)
      }
    ))
  );
}
var lastRateLimitNotificationRetryAt = 0;
var forcedUpdateInProgress = false;
async function forceUpdateFromNotification(channel) {
  if (forcedUpdateInProgress) return;
  forcedUpdateInProgress = true;
  try {
    const result = await Native2.checkForUpdates(true, channel, true);
    if (result.status === "updated") {
      const willRestart = prepareAutoRestart();
      showNotification({
        title: "BetterStatus force update installed",
        body: willRestart ? "Discord will restart automatically." : settings.store.autoRestart ? "Automatic restart is temporarily paused. Restart Discord manually." : "Restart Discord to use the reinstalled version."
      });
      if (willRestart) window.setTimeout(relaunch, 1500);
      return;
    }
    if (result.status === "current") {
      showNotification({
        title: "BetterStatus force update completed",
        body: "The selected channel files were verified. No restart is required."
      });
      return;
    }
    showUpdateFailureNotification(result, channel);
  } catch (error) {
    showUpdateFailureNotification({
      error: error instanceof Error ? error.message : String(error)
    }, channel);
  } finally {
    forcedUpdateInProgress = false;
  }
}
function showUpdateFailureNotification(failure, channel = getUpdateChannel()) {
  const isRateLimited = failure.retryAt !== void 0;
  if (isRateLimited && failure.retryAt === lastRateLimitNotificationRetryAt)
    return;
  if (isRateLimited)
    lastRateLimitNotificationRetryAt = failure.retryAt;
  showNotification({
    title: isRateLimited ? "BetterStatus update checks paused" : "BetterStatus update failed",
    body: failure.error ?? "Run the BetterStatus installer to update manually.",
    richBody: /* @__PURE__ */ React4.createElement("div", { className: "bs-update-failure-notification" }, /* @__PURE__ */ React4.createElement("div", null, failure.error ?? "Run the BetterStatus installer to update manually."), /* @__PURE__ */ React4.createElement(
      "span",
      {
        className: "bs-force-update-notification-button",
        role: "button",
        tabIndex: 0,
        onClick: (event) => {
          event.preventDefault();
          event.stopPropagation();
          void forceUpdateFromNotification(channel);
        },
        onKeyDown: (event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          event.stopPropagation();
          void forceUpdateFromNotification(channel);
        }
      },
      "Force update"
    )),
    dismissOnClick: false,
    noPersist: isRateLimited
  });
}
var MAX_BACKUP_BYTES = 2 * 1024 * 1024;
var PRESENCE_VALUES = /* @__PURE__ */ new Set(["online", "idle", "dnd", "invisible"]);
function currentPlatform() {
  const platform = navigator.platform.toLowerCase();
  if (platform.includes("mac")) return "macos";
  if (platform.includes("win")) return "windows";
  if (platform.includes("linux")) return "linux";
  return "unknown";
}
function validateBackup(value) {
  if (!value || typeof value !== "object")
    throw new Error("This file does not contain a BetterStatus backup.");
  const backup = value;
  if (backup.format !== "betterstatus-backup" || backup.version !== 1)
    throw new Error("This BetterStatus backup format is not supported.");
  if (!backup.settings || typeof backup.settings !== "object")
    throw new Error("The backup does not contain settings.");
  const source = backup.settings;
  if (!Array.isArray(source.presets) || !Array.isArray(source.savedStatuses))
    throw new Error("The backup is missing presets or saved statuses.");
  if (source.presets.length > 1e4)
    throw new Error("The backup contains too many presets.");
  const ids = /* @__PURE__ */ new Set();
  const presets = source.presets.map((value2, index) => {
    if (!value2 || typeof value2 !== "object")
      throw new Error(`Preset ${index + 1} is invalid.`);
    const preset = value2;
    if (typeof preset.id !== "string" || !preset.id || preset.id.length > 200 || ids.has(preset.id))
      throw new Error(`Preset ${index + 1} has an invalid or duplicate ID.`);
    if (typeof preset.name !== "string" || typeof preset.text !== "string" || typeof preset.hotkey !== "string")
      throw new Error(`Preset ${index + 1} contains invalid text fields.`);
    if (preset.name.length > 500 || preset.text.length > 1e4 || preset.hotkey.length > 200)
      throw new Error(`Preset ${index + 1} contains an oversized field.`);
    if (preset.type !== "fixed" && preset.type !== "memory")
      throw new Error(`Preset ${index + 1} has an invalid behavior.`);
    if (!PRESENCE_VALUES.has(preset.presence ?? ""))
      throw new Error(`Preset ${index + 1} has an invalid presence.`);
    if (typeof preset.enabled !== "boolean")
      throw new Error(`Preset ${index + 1} has an invalid enabled state.`);
    if (preset.rememberedText !== void 0 && typeof preset.rememberedText !== "string")
      throw new Error(`Preset ${index + 1} has invalid Memory text.`);
    ids.add(preset.id);
    return {
      id: preset.id,
      name: preset.name,
      text: preset.text,
      type: preset.type,
      rememberedText: preset.rememberedText,
      presence: preset.presence,
      hotkey: preset.hotkey,
      enabled: preset.enabled
    };
  });
  const savedStatuses = normalizeSavedStatuses(source.savedStatuses);
  const schedules = validateSchedules(source.schedules ?? [], ids);
  const updateChannel = source.updateChannel === "dev" ? "dev" : "prod";
  const updateCheckFrequency = normalizeUpdateCheckFrequency(source.updateCheckFrequency);
  const activePresetId = typeof source.activePresetId === "string" && ids.has(source.activePresetId) ? source.activePresetId : void 0;
  return {
    format: "betterstatus-backup",
    version: 1,
    exportedAt: typeof backup.exportedAt === "string" ? backup.exportedAt : (/* @__PURE__ */ new Date(0)).toISOString(),
    platform: ["macos", "windows", "linux"].includes(backup.platform ?? "") ? backup.platform : "unknown",
    settings: {
      presets,
      savedStatuses,
      schedules,
      activePresetId,
      autoUpdate: source.autoUpdate !== false,
      autoRestart: source.autoRestart === true,
      updateCheckFrequency,
      updateChannel
    }
  };
}
var DEFAULT_PRESETS = [
  {
    id: "sleeping",
    name: "Sleeping",
    text: "I'm sleeping \u{1F445}",
    type: "fixed",
    presence: "dnd",
    hotkey: "Command+-",
    enabled: true
  },
  {
    id: "normal",
    name: "Normal",
    text: "Every end has a new beginning...",
    type: "fixed",
    presence: "online",
    hotkey: "Command+=",
    enabled: true
  }
];
var TYPE_OPTIONS = [
  {
    label: "Fixed",
    value: "fixed"
  },
  {
    label: "Memory",
    value: "memory"
  }
];
var UPDATE_CHANNEL_OPTIONS = [
  {
    label: "Production (recommended)",
    value: "prod"
  },
  {
    label: "Development",
    value: "dev"
  }
];
var UPDATE_FREQUENCY_OPTIONS = [
  { label: "Every 1 minute", value: 1 },
  { label: "Every 5 minutes", value: 5 },
  { label: "Every 15 minutes", value: 15 },
  { label: "Every 30 minutes", value: 30 },
  { label: "Every hour", value: 60 },
  { label: "Every 3 hours", value: 180 },
  { label: "Every 6 hours (recommended)", value: 360 },
  { label: "Every 12 hours", value: 720 },
  { label: "Every day", value: 1440 },
  { label: "On startup only", value: 0 }
];
var SCHEDULE_REPEAT_OPTIONS = [
  { label: "Once", value: "once" },
  { label: "Every day", value: "daily" },
  { label: "Weekdays", value: "weekdays" },
  { label: "Weekends", value: "weekends" },
  { label: "Every week", value: "weekly" },
  { label: "Specific days", value: "custom" }
];
var WEEKDAY_OPTIONS = [
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
  { label: "Sun", value: 0 }
];
var SCHEDULE_REPEAT_VALUES = /* @__PURE__ */ new Set([
  "once",
  "daily",
  "weekdays",
  "weekends",
  "weekly",
  "custom"
]);
var SCHEDULE_END_OPTIONS = [
  { label: "Keep scheduled status", value: "keep" },
  { label: "Restore previous status", value: "restore" },
  { label: "Activate another preset", value: "preset" },
  { label: "Set a custom status", value: "custom" }
];
var SCHEDULE_START_OPTIONS = [
  { label: "Activate a preset", value: "preset" },
  { label: "Set a custom status", value: "custom" }
];
var SYNC_PROVIDER_OPTIONS = [
  { label: "BetterStatus Cloud", value: "betterstatus" },
  { label: "Self-hosted server", value: "custom" }
];
function getSyncServerURL() {
  return settings.store.syncProvider === "custom" ? settings.store.syncServerUrl.trim() : "https://betterstatus.misaliba.eu";
}
function validateSchedules(value, presetIds) {
  if (!Array.isArray(value) || value.length > 1e3)
    throw new Error("The backup contains invalid schedules.");
  const ids = /* @__PURE__ */ new Set();
  return value.map((entry, index) => {
    const schedule = entry;
    if (!schedule || typeof schedule !== "object" || typeof schedule.id !== "string" || !schedule.id || ids.has(schedule.id))
      throw new Error(`Schedule ${index + 1} has an invalid or duplicate ID.`);
    if (typeof schedule.name !== "string" || schedule.name.length > 500)
      throw new Error(`Schedule ${index + 1} has an invalid name.`);
    const startBehavior = schedule.startBehavior === "custom" ? "custom" : "preset";
    if (startBehavior === "preset" && (typeof schedule.presetId !== "string" || !presetIds.has(schedule.presetId)))
      throw new Error(`Schedule ${index + 1} references a missing preset.`);
    if (typeof schedule.startsAt !== "number" || !Number.isFinite(schedule.startsAt))
      throw new Error(`Schedule ${index + 1} has an invalid start time.`);
    if (!SCHEDULE_REPEAT_VALUES.has(schedule.repeat))
      throw new Error(`Schedule ${index + 1} has an invalid recurrence.`);
    const repeatDays = [...new Set((schedule.repeatDays ?? []).filter((day) => Number.isInteger(day) && day >= 0 && day <= 6))].sort((left, right) => left - right);
    if (schedule.repeat === "custom" && repeatDays.length === 0)
      repeatDays.push(new Date(schedule.startsAt).getDay());
    const endBehavior = ["keep", "restore", "preset", "custom"].includes(schedule.endBehavior ?? "") ? schedule.endBehavior : "keep";
    const endsAt = typeof schedule.endsAt === "number" && Number.isFinite(schedule.endsAt) && schedule.endsAt > schedule.startsAt ? schedule.endsAt : void 0;
    if (endBehavior === "preset" && schedule.endPresetId && !presetIds.has(schedule.endPresetId))
      throw new Error(`Schedule ${index + 1} references a missing end preset.`);
    if (schedule.endPresence !== void 0 && !PRESENCE_VALUES.has(schedule.endPresence))
      throw new Error(`Schedule ${index + 1} has an invalid end presence.`);
    if (schedule.startPresence !== void 0 && !PRESENCE_VALUES.has(schedule.startPresence))
      throw new Error(`Schedule ${index + 1} has an invalid start presence.`);
    ids.add(schedule.id);
    return {
      id: schedule.id,
      name: schedule.name,
      startBehavior,
      presetId: schedule.presetId,
      startText: typeof schedule.startText === "string" ? schedule.startText.slice(0, 1e4) : "",
      startPresence: schedule.startPresence && PRESENCE_VALUES.has(schedule.startPresence) ? schedule.startPresence : "online",
      startsAt: schedule.startsAt,
      endsAt,
      repeat: schedule.repeat,
      repeatDays,
      endBehavior,
      endPresetId: schedule.endPresetId,
      endText: typeof schedule.endText === "string" ? schedule.endText.slice(0, 1e4) : "",
      endPresence: schedule.endPresence && PRESENCE_VALUES.has(schedule.endPresence) ? schedule.endPresence : "online",
      enabled: schedule.enabled !== false
    };
  });
}
function toLocalDateTime(value) {
  const date = new Date(value - new Date(value).getTimezoneOffset() * 6e4);
  return date.toISOString().slice(0, 16);
}
function dateInputValue(value) {
  return toLocalDateTime(value).slice(0, 10);
}
function timeInputValue(value) {
  return toLocalDateTime(value).slice(11, 16);
}
function updateLocalDateTime(current, date, time) {
  const currentDate = new Date(current);
  const nextDate = date ?? dateInputValue(current);
  const nextTime = time ?? timeInputValue(current);
  const next = /* @__PURE__ */ new Date(`${nextDate}T${nextTime}`);
  return Number.isFinite(next.getTime()) ? next.getTime() : currentDate.getTime();
}
function scheduleOccursOnDay(schedule, day) {
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
function scheduleRepeatLabel(schedule) {
  if (schedule.repeat === "once") return "One time";
  if (schedule.repeat === "daily") return "Repeats every day";
  if (schedule.repeat === "weekdays") return "Repeats on weekdays";
  if (schedule.repeat === "weekends") return "Repeats on weekends";
  if (schedule.repeat === "weekly") return `Repeats every ${new Date(schedule.startsAt).toLocaleDateString([], { weekday: "long" })}`;
  const selected = WEEKDAY_OPTIONS.filter((day) => (schedule.repeatDays ?? []).includes(day.value));
  return `Repeats ${selected.map((day) => day.label).join(", ") || "on selected days"}`;
}
function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function eventToAccelerator(event) {
  const ignored = ["Meta", "Control", "Alt", "Shift"];
  if (ignored.includes(event.key)) {
    return null;
  }
  const parts = [];
  if (event.metaKey) parts.push("Command");
  if (event.ctrlKey) parts.push("Control");
  if (event.altKey) parts.push("Alt");
  if (event.shiftKey) parts.push("Shift");
  let { key } = event;
  const aliases = {
    " ": "Space",
    ArrowUp: "Up",
    ArrowDown: "Down",
    ArrowLeft: "Left",
    ArrowRight: "Right",
    Escape: "Escape",
    Enter: "Enter",
    Backspace: "Backspace",
    Delete: "Delete",
    Tab: "Tab"
  };
  key = aliases[key] ?? key;
  if (key.length === 1) {
    key = key.toUpperCase();
  }
  parts.push(key);
  return parts.join("+");
}
function ChevronIcon2({ collapsed }) {
  return /* @__PURE__ */ React4.createElement(
    "svg",
    {
      "aria-hidden": "true",
      className: `bs-chevron${collapsed ? " bs-chevron-collapsed" : ""}`,
      viewBox: "0 0 24 24",
      width: "20",
      height: "20"
    },
    /* @__PURE__ */ React4.createElement(
      "path",
      {
        fill: "currentColor",
        d: "M6.7 8.3a1 1 0 0 1 1.4 0l3.9 3.9 3.9-3.9a1 1 0 1 1 1.4 1.4l-4.6 4.6a1 1 0 0 1-1.4 0L6.7 9.7a1 1 0 0 1 0-1.4Z"
      }
    )
  );
}
function DevelopmentChannelPrompt({
  modalProps,
  onAccept
}) {
  const [accepted, setAccepted] = React4.useState(false);
  return /* @__PURE__ */ React4.createElement(
    ConfirmModal,
    {
      ...modalProps,
      title: "Switch to Development updates?",
      confirmText: "Use Development",
      cancelText: "Stay on Production",
      variant: "primary",
      checkboxProps: {
        label: "I understand and accept the development-build terms",
        checked: accepted,
        onChange: setAccepted
      },
      onConfirm: (setError) => {
        if (!accepted) {
          setError("Accept the development-build terms before continuing.");
          throw new Error("Development terms were not accepted.");
        }
        onAccept();
      }
    },
    /* @__PURE__ */ React4.createElement("div", { className: "bs-dev-channel-prompt" }, /* @__PURE__ */ React4.createElement(Forms.FormText, null, "Development builds contain changes that have not reached the stable Production channel. They may break, change behavior, or require a manual reinstall."), /* @__PURE__ */ React4.createElement(Forms.FormText, null, "Based on the MIT license disclaimer, development builds are provided", /* @__PURE__ */ React4.createElement("strong", null, " \u201Cas is\u201D"), ", without warranty of any kind. You accept responsibility for using and testing them. Read the", " ", /* @__PURE__ */ React4.createElement(Link, { href: "https://opensource.org/license/mit" }, "MIT license terms"), "."), /* @__PURE__ */ React4.createElement(Forms.FormText, null, "You can return to Production at any time without another prompt."))
  );
}
function SettingsComponent() {
  const {
    autoUpdate,
    autoRestart,
    updateCheckFrequency,
    updateChannel,
    autoRestartPausedUntil,
    activePresetId,
    syncEnabled,
    syncProvider,
    syncServerUrl
  } = settings.use([
    "autoUpdate",
    "autoRestart",
    "updateCheckFrequency",
    "updateChannel",
    "autoRestartPausedUntil",
    "activePresetId",
    "syncEnabled",
    "syncProvider",
    "syncServerUrl"
  ]);
  const [recordingId, setRecordingId] = React4.useState(null);
  const [presets, setPresets] = React4.useState(() => [
    ...getPresets()
  ]);
  const [schedules, setSchedules] = React4.useState(() => [
    ...getSchedules()
  ]);
  const [collapsedScheduleIds, setCollapsedScheduleIds] = React4.useState(
    () => new Set(schedules.map((schedule) => schedule.id))
  );
  const [collapsedIds, setCollapsedIds] = React4.useState(
    () => new Set(presets.map((preset) => preset.id))
  );
  const [searchQuery, setSearchQuery] = React4.useState("");
  const [checkingForUpdates, setCheckingForUpdates] = React4.useState(false);
  const [restartingDiscord, setRestartingDiscord] = React4.useState(false);
  const [lastUpdateFailed, setLastUpdateFailed] = React4.useState(false);
  const [updateStatus, setUpdateStatus] = React4.useState(null);
  const [updateInfo, setUpdateInfo] = React4.useState(null);
  const [updateInfoError, setUpdateInfoError] = React4.useState(
    null
  );
  const [lastCheckedAt, setLastCheckedAt] = React4.useState(null);
  const [backupStatus, setBackupStatus] = React4.useState(null);
  const [syncStatus, setSyncStatus] = React4.useState("Not connected");
  const [syncConnected, setSyncConnected] = React4.useState(false);
  const [syncBusy, setSyncBusy] = React4.useState(false);
  const [syncEncrypted, setSyncEncrypted] = React4.useState(false);
  const [syncLocked, setSyncLocked] = React4.useState(false);
  const selectedUpdateChannel = updateChannel === "dev" ? "dev" : "prod";
  const selectedUpdateFrequency = normalizeUpdateCheckFrequency(updateCheckFrequency);
  async function refreshUpdateInfo(channel) {
    try {
      const info = await Native2.getUpdateInfo(channel);
      setUpdateInfo(info);
      setUpdateInfoError(null);
      setLastCheckedAt(/* @__PURE__ */ new Date());
    } catch (error) {
      setUpdateInfo(null);
      setUpdateInfoError(
        error instanceof Error ? error.message : String(error)
      );
      setLastCheckedAt(/* @__PURE__ */ new Date());
    }
  }
  function restartDiscordNow() {
    if (restartingDiscord) return;
    setRestartingDiscord(true);
    setUpdateStatus("Restarting Discord to apply the BetterStatus update\u2026");
    window.setTimeout(relaunch, 250);
  }
  React4.useEffect(() => {
    void refreshUpdateInfo(selectedUpdateChannel);
  }, [selectedUpdateChannel]);
  React4.useEffect(() => {
    Native2.getCloudSyncStatus(getSyncServerURL()).then(async (status) => {
      setSyncConnected(status.connected);
      setSyncEncrypted(Boolean(status.encryptionPasswordSet));
      setSyncLocked(false);
      setSyncStatus(status.connected ? `Connected as Discord user ${status.discordUserId} \xB7 expires ${new Date(status.expiresAt).toLocaleDateString()}` : "Not connected");
      if (status.connected) {
        settings.store.syncEnabled = true;
        await pluginRuntime().configureCloudSync();
        setSyncStatus(`Connected as Discord user ${status.discordUserId} \xB7 synchronized and listening`);
      }
    }).catch((error) => setSyncStatus(error instanceof Error ? error.message : String(error)));
  }, [syncProvider, syncServerUrl]);
  React4.useEffect(() => {
    const updateProtection = (event) => {
      const { detail } = event;
      setSyncEncrypted(detail.encrypted);
      setSyncLocked(detail.locked);
      if (detail.locked) setSyncStatus("Encrypted configuration is locked on this device.");
    };
    window.addEventListener("betterstatus-sync-protection", updateProtection);
    return () => window.removeEventListener("betterstatus-sync-protection", updateProtection);
  }, []);
  function changeSyncPassword() {
    openModal((modalProps) => /* @__PURE__ */ React4.createElement(
      CloudProtectionModal,
      {
        modalProps,
        changing: syncEncrypted,
        onSave: async (password) => {
          await pluginRuntime().changeCloudEncryptionPassword(password);
          setSyncEncrypted(true);
          setSyncLocked(false);
          setSyncStatus("Configuration encrypted client-side. Password updated on the server ciphertext.");
        }
      }
    ));
  }
  function removeSyncPassword() {
    openModal((modalProps) => /* @__PURE__ */ React4.createElement(
      ConfirmModal,
      {
        ...modalProps,
        title: "Remove sync password?",
        confirmText: "Remove protection",
        cancelText: "Cancel",
        variant: "danger",
        onConfirm: async () => {
          await pluginRuntime().changeCloudEncryptionPassword();
          setSyncEncrypted(false);
          setSyncLocked(false);
          setSyncStatus("Client-side password protection removed.");
        }
      },
      /* @__PURE__ */ React4.createElement(Forms.FormText, null, "The next sync revision will contain readable JSON on the server. Your Discord-authorized connection will still use HTTPS and authenticated sessions.")
    ));
  }
  React4.useEffect(() => {
    const refresh = () => {
      setPresets([...getPresets()]);
      setSchedules([...getSchedules()]);
    };
    window.addEventListener("betterstatus-sync-applied", refresh);
    return () => window.removeEventListener("betterstatus-sync-applied", refresh);
  }, []);
  async function connectSync() {
    setSyncBusy(true);
    setSyncStatus("Waiting for Discord authorization in your browser\u2026");
    try {
      const request = await Native2.beginCloudSyncAuthorization(getSyncServerURL());
      const status = await new Promise((resolve, reject) => {
        openModal((modalProps) => /* @__PURE__ */ React4.createElement(
          OAuth2AuthorizeModal,
          {
            ...modalProps,
            scopes: ["identify"],
            responseType: "code",
            redirectUri: request.redirectUri,
            state: request.state,
            permissions: 0n,
            clientId: request.clientId,
            cancelCompletesFlow: false,
            callback: async ({ location: location2 }) => {
              if (!location2) {
                reject(new Error("Discord authorization was cancelled."));
                return;
              }
              try {
                resolve(await Native2.completeCloudSyncAuthorization(
                  getSyncServerURL(),
                  request.requestId,
                  location2
                ));
              } catch (error) {
                reject(error);
              }
            }
          }
        ));
      });
      settings.store.syncEnabled = true;
      settings.store.cloudSyncPullOnConnect = true;
      setSyncConnected(true);
      setSyncStatus(`Connected as Discord user ${status.discordUserId} \xB7 expires ${new Date(status.expiresAt).toLocaleDateString()}`);
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
      await Native2.disconnectCloudSync(getSyncServerURL());
      settings.store.syncEnabled = false;
      setSyncConnected(false);
      setSyncStatus("Not connected");
      await pluginRuntime().configureCloudSync();
    } finally {
      setSyncBusy(false);
    }
  }
  async function resyncFromServer() {
    setSyncBusy(true);
    setSyncStatus("Reconciling local and server changes\u2026");
    try {
      await pluginRuntime().resyncCloudSync();
      setSyncStatus("Synchronized with server \xB7 listening for live updates");
    } catch (error) {
      setSyncStatus(error instanceof Error ? error.message : String(error));
    } finally {
      setSyncBusy(false);
    }
  }
  async function switchUpdateChannel(channel) {
    if (checkingForUpdates || channel === selectedUpdateChannel) return;
    setCheckingForUpdates(true);
    setLastUpdateFailed(false);
    setUpdateStatus(`Downloading the latest ${channel === "dev" ? "development" : "production"} branch build\u2026`);
    try {
      const result = await Native2.checkForUpdates(true, channel, true);
      if (result.status !== "updated" && result.status !== "current") {
        const message = result.error ?? "The selected branch could not be installed.";
        setUpdateStatus(`Branch switch failed: ${message}`);
        setLastUpdateFailed(true);
        showUpdateFailureNotification(result, channel);
        return;
      }
      settings.store.updateChannel = channel;
      settings.store.openSettingsAfterRestart = true;
      setUpdateStatus(`${channel === "dev" ? "Development" : "Production"} installed \u2014 restarting Discord\u2026`);
      showNotification({
        title: "BetterStatus branch switched",
        body: `The latest ${channel === "dev" ? "development" : "production"} build was installed. Discord will restart and reopen BetterStatus settings.`
      });
      window.setTimeout(relaunch, 750);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setUpdateStatus(`Branch switch failed: ${message}`);
      setLastUpdateFailed(true);
      showUpdateFailureNotification({ error: message }, channel);
    } finally {
      setCheckingForUpdates(false);
    }
  }
  async function checkForUpdates3(force = false) {
    if (checkingForUpdates) return;
    let retryAt;
    setCheckingForUpdates(true);
    setLastUpdateFailed(false);
    setUpdateStatus(
      `${force ? "Force updating from" : "Checking"} the ${selectedUpdateChannel === "dev" ? "development" : "production"} channel\u2026`
    );
    try {
      const result = await Native2.checkForUpdates(true, selectedUpdateChannel, force);
      if (result.status === "updated") {
        const willRestart = prepareAutoRestart();
        const restartPaused = autoRestart && !willRestart;
        setUpdateStatus(
          willRestart ? "Update installed \u2014 restarting Discord\u2026" : restartPaused ? "Update installed \u2014 automatic restart is temporarily paused. Restart Discord manually." : "Update installed \u2014 restart Discord to apply it."
        );
        showNotification({
          title: "BetterStatus updated",
          body: willRestart ? "Discord will restart automatically." : restartPaused ? "Restart loop protection is active. Restart Discord manually." : "Restart Discord to use the new version."
        });
        if (willRestart) window.setTimeout(relaunch, 1500);
      } else if (result.status === "current") {
        setUpdateStatus("You already have the latest channel build.");
        showNotification({
          title: "BetterStatus is up to date",
          body: `No newer ${selectedUpdateChannel === "dev" ? "development" : "production"} build is available.`
        });
      } else {
        const message = result.error ?? "The update could not be completed.";
        retryAt = result.retryAt;
        if (retryAt !== void 0)
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
      if (retryAt === void 0)
        await refreshUpdateInfo(selectedUpdateChannel);
      setCheckingForUpdates(false);
    }
  }
  async function commit(next) {
    setPresets(next);
    await savePresets(next);
  }
  function exportSettings() {
    const backup = {
      format: "betterstatus-backup",
      version: 1,
      exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
      platform: currentPlatform(),
      settings: {
        presets: getPresets(),
        savedStatuses: getSavedStatuses(),
        schedules: getSchedules(),
        activePresetId: settings.store.activePresetId,
        autoUpdate: settings.store.autoUpdate,
        autoRestart: settings.store.autoRestart,
        updateCheckFrequency: getUpdateCheckFrequency(),
        updateChannel: getUpdateChannel()
      }
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const date = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    anchor.href = url;
    anchor.download = `betterstatus-backup-${date}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setBackupStatus(`Exported ${backup.settings.presets.length} presets, ${backup.settings.schedules.length} schedules, and ${backup.settings.savedStatuses.length} saved statuses.`);
  }
  async function applyBackup(backup) {
    const convertMacHotkeys = backup.platform === "macos" && currentPlatform() === "windows";
    const importedPresets = backup.settings.presets.map((preset) => ({
      ...preset,
      hotkey: convertMacHotkeys ? preset.hotkey.replace(/(^|\+)Command(?=\+|$)/g, "$1Control") : preset.hotkey
    }));
    settings.store.savedStatuses = backup.settings.savedStatuses;
    settings.store.schedules = backup.settings.schedules;
    settings.store.autoUpdate = backup.settings.autoUpdate;
    settings.store.autoRestart = backup.settings.autoRestart;
    settings.store.updateCheckFrequency = backup.settings.updateCheckFrequency;
    settings.store.updateChannel = backup.settings.updateChannel;
    settings.store.activePresetId = importedPresets.some(
      (preset) => preset.id === backup.settings.activePresetId && preset.enabled
    ) ? backup.settings.activePresetId : void 0;
    await commit(importedPresets);
    setSchedules(backup.settings.schedules);
    pluginRuntime().configureSchedules();
    setCollapsedIds(new Set(importedPresets.map((preset) => preset.id)));
    setSearchQuery("");
    setRecordingId(null);
    pluginRuntime().configureUpdateChecks(false);
    const message = `Imported ${importedPresets.length} presets, ${backup.settings.schedules.length} schedules, and ${backup.settings.savedStatuses.length} saved statuses${convertMacHotkeys ? "; Command shortcuts were converted to Control" : ""}.`;
    setBackupStatus(message);
    showNotification({ title: "BetterStatus backup imported", body: message });
  }
  function confirmBackupImport(backup) {
    const convertsHotkeys = backup.platform === "macos" && currentPlatform() === "windows";
    openModal((modalProps) => /* @__PURE__ */ React4.createElement(
      ConfirmModal,
      {
        ...modalProps,
        title: "Replace all BetterStatus settings?",
        confirmText: "Import backup",
        cancelText: "Cancel",
        variant: "danger",
        onConfirm: () => void applyBackup(backup)
      },
      /* @__PURE__ */ React4.createElement("div", { className: "bs-import-confirmation" }, /* @__PURE__ */ React4.createElement(Forms.FormText, null, "This replaces every BetterStatus preset, saved status, active preset, and update preference currently stored on this computer."), /* @__PURE__ */ React4.createElement("div", { className: "bs-import-summary" }, /* @__PURE__ */ React4.createElement("span", null, /* @__PURE__ */ React4.createElement("strong", null, backup.settings.presets.length), " presets"), /* @__PURE__ */ React4.createElement("span", null, /* @__PURE__ */ React4.createElement("strong", null, backup.settings.schedules.length), " schedules"), /* @__PURE__ */ React4.createElement("span", null, /* @__PURE__ */ React4.createElement("strong", null, backup.settings.savedStatuses.length), " saved statuses"), /* @__PURE__ */ React4.createElement("span", null, /* @__PURE__ */ React4.createElement("strong", null, backup.settings.updateChannel === "dev" ? "Development" : "Production"), " updates")), convertsHotkeys && /* @__PURE__ */ React4.createElement(Forms.FormText, null, "macOS ", /* @__PURE__ */ React4.createElement("strong", null, "Command"), " shortcuts will be converted to Windows ", /* @__PURE__ */ React4.createElement("strong", null, "Control"), " shortcuts."), /* @__PURE__ */ React4.createElement(Forms.FormText, null, "Your current setup will not be recoverable unless you export it first."))
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
  function updatePreset(id, patch) {
    const next = presets.map(
      (preset) => preset.id === id ? {
        ...preset,
        ...patch
      } : preset
    );
    if (id === activePresetId && patch.enabled === false) {
      settings.store.activePresetId = void 0;
    }
    void commit(next);
  }
  function addPreset() {
    const next = [
      ...presets,
      {
        id: createId(),
        name: `Status ${presets.length + 1}`,
        text: "",
        type: "fixed",
        presence: "online",
        hotkey: "",
        enabled: true
      }
    ];
    void commit(next);
  }
  function duplicatePreset(preset) {
    void commit([
      ...presets,
      {
        ...preset,
        id: createId(),
        name: `${preset.name || "Untitled preset"} copy`,
        hotkey: "",
        enabled: false
      }
    ]);
  }
  function deletePreset(id) {
    if (id === activePresetId) settings.store.activePresetId = void 0;
    const nextSchedules = schedules.filter((schedule) => !(schedule.startBehavior !== "custom" && schedule.presetId === id)).map((schedule) => schedule.startBehavior === "custom" && schedule.presetId === id ? { ...schedule, presetId: void 0 } : schedule).map((schedule) => schedule.endPresetId === id ? { ...schedule, endBehavior: "restore", endPresetId: void 0 } : schedule);
    setSchedules(nextSchedules);
    settings.store.schedules = nextSchedules;
    void commit(presets.filter((preset) => preset.id !== id));
    pluginRuntime().configureSchedules();
  }
  function commitSchedules(next) {
    setSchedules(next);
    settings.store.schedules = next;
    pluginRuntime().configureSchedules();
  }
  function addSchedule() {
    const preset = presets.find((candidate) => candidate.enabled) ?? presets[0];
    const startsAt = /* @__PURE__ */ new Date();
    startsAt.setMinutes(startsAt.getMinutes() + 5, 0, 0);
    const endsAt = new Date(startsAt);
    endsAt.setHours(endsAt.getHours() + 1);
    const schedule = {
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
      enabled: true
    };
    commitSchedules([...schedules, schedule]);
    setCollapsedScheduleIds((current) => {
      const next = new Set(current);
      next.delete(schedule.id);
      return next;
    });
  }
  function updateSchedule(id, patch) {
    commitSchedules(schedules.map((schedule) => schedule.id === id ? { ...schedule, ...patch } : schedule));
  }
  function toggleScheduleDay(schedule, day) {
    const selected = new Set(schedule.repeatDays ?? []);
    if (selected.has(day)) {
      if (selected.size === 1) return;
      selected.delete(day);
    } else {
      selected.add(day);
    }
    updateSchedule(schedule.id, { repeatDays: [...selected].sort((left, right) => left - right) });
  }
  function toggleScheduleCollapsed(id) {
    setCollapsedScheduleIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function toggleAllSchedulesCollapsed() {
    const allSchedulesCollapsed2 = schedules.length > 0 && schedules.every((schedule) => collapsedScheduleIds.has(schedule.id));
    setCollapsedScheduleIds(allSchedulesCollapsed2 ? /* @__PURE__ */ new Set() : new Set(schedules.map((schedule) => schedule.id)));
  }
  function toggleCollapsed(id) {
    setCollapsedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    if (recordingId === id) setRecordingId(null);
  }
  function toggleAllCollapsed() {
    const allCollapsed2 = presets.length > 0 && presets.every((preset) => collapsedIds.has(preset.id));
    setCollapsedIds(
      allCollapsed2 ? /* @__PURE__ */ new Set() : new Set(presets.map((preset) => preset.id))
    );
    setRecordingId(null);
  }
  React4.useEffect(() => {
    if (!recordingId) return;
    const handler = (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (event.key === "Escape") {
        setRecordingId(null);
        return;
      }
      const accelerator = eventToAccelerator(event);
      if (!accelerator) return;
      updatePreset(recordingId, {
        hotkey: accelerator
      });
      setRecordingId(null);
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [recordingId, presets]);
  React4.useEffect(() => {
    if (activePresetId && !presets.some((preset) => preset.id === activePresetId && preset.enabled)) {
      settings.store.activePresetId = void 0;
    }
  }, [activePresetId, presets]);
  const enabledCount = presets.filter((preset) => preset.enabled).length;
  const memoryCount = presets.filter(
    (preset) => preset.type === "memory"
  ).length;
  const allCollapsed = presets.length > 0 && presets.every((preset) => collapsedIds.has(preset.id));
  const allSchedulesCollapsed = schedules.length > 0 && schedules.every((schedule) => collapsedScheduleIds.has(schedule.id));
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const visiblePresets = normalizedQuery ? presets.filter(
    (preset) => [
      preset.name,
      preset.text,
      preset.hotkey,
      preset.presence,
      preset.type
    ].some((value) => value.toLowerCase().includes(normalizedQuery))
  ) : presets;
  const activePreset = presets.find(
    (preset) => preset.id === activePresetId && preset.enabled
  );
  const calendarDays = Array.from({ length: 7 }, (_, offset) => {
    const day = /* @__PURE__ */ new Date();
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() + offset);
    return {
      day,
      schedules: schedules.filter((schedule) => schedule.enabled && scheduleOccursOnDay(schedule, day))
    };
  });
  return /* @__PURE__ */ React4.createElement("div", { className: "bs-settings" }, /* @__PURE__ */ React4.createElement("div", { className: "bs-control-panel" }, /* @__PURE__ */ React4.createElement("div", { className: "bs-control-icon" }, "\u21BB"), /* @__PURE__ */ React4.createElement("div", { className: "bs-control-copy" }, /* @__PURE__ */ React4.createElement(Forms.FormTitle, null, "Automatic updates"), /* @__PURE__ */ React4.createElement(Forms.FormText, null, "Follow the stable production branch by default, or opt into development builds. Updates build safely and apply after restart."), /* @__PURE__ */ React4.createElement("div", { className: "bs-version-info" }, /* @__PURE__ */ React4.createElement(
    "span",
    {
      className: `bs-version-badge bs-version-${updateInfo?.status ?? "loading"}`
    },
    /* @__PURE__ */ React4.createElement("i", null),
    updateInfo?.status === "current" ? "Up to date" : updateInfo?.status === "restartRequired" ? "Restart required" : updateInfo?.status === "updateAvailable" ? "Update available" : updateInfoError ? "Version unavailable" : "Checking version"
  ), updateInfo?.status === "restartRequired" && /* @__PURE__ */ React4.createElement(
    "button",
    {
      type: "button",
      className: "bs-version-restart-button",
      disabled: restartingDiscord,
      onClick: restartDiscordNow
    },
    restartingDiscord ? "Restarting\u2026" : "Restart Discord"
  ), updateInfo && /* @__PURE__ */ React4.createElement("span", { className: "bs-version-commits" }, /* @__PURE__ */ React4.createElement("span", null, "Installed:", " ", updateInfo.installedVersion?.slice(0, 7) ?? "unknown", updateInfo.installedChannel && updateInfo.installedChannel !== updateInfo.channel ? ` (${updateInfo.installedChannel})` : ""), /* @__PURE__ */ React4.createElement("span", null, "Latest: ", updateInfo.latestVersion.slice(0, 7)), /* @__PURE__ */ React4.createElement(
    Link,
    {
      href: `https://github.com/Jacksonnn911/BetterStatus/commit/${updateInfo.latestVersion}`
    },
    "View commit \u2197"
  )), lastCheckedAt && /* @__PURE__ */ React4.createElement("span", { className: "bs-version-checked" }, "Checked", " ", lastCheckedAt.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  }))), updateInfoError && /* @__PURE__ */ React4.createElement("div", { className: "bs-update-status", role: "status" }, "Version check failed: ", updateInfoError), updateStatus && /* @__PURE__ */ React4.createElement("div", { className: "bs-update-status", role: "status" }, updateStatus)), /* @__PURE__ */ React4.createElement("div", { className: "bs-update-actions" }, /* @__PURE__ */ React4.createElement("div", { className: "bs-update-channel" }, /* @__PURE__ */ React4.createElement(
    Select,
    {
      options: UPDATE_CHANNEL_OPTIONS,
      select: (channel) => {
        if (channel !== "dev") {
          void switchUpdateChannel("prod");
          return;
        }
        openModal((modalProps) => /* @__PURE__ */ React4.createElement(
          DevelopmentChannelPrompt,
          {
            modalProps,
            onAccept: () => {
              void switchUpdateChannel("dev");
            }
          }
        ));
      },
      serialize: (value) => value,
      isSelected: (value) => value === selectedUpdateChannel,
      isDisabled: checkingForUpdates,
      closeOnSelect: true
    }
  )), /* @__PURE__ */ React4.createElement(Button2, { disabled: checkingForUpdates, onClick: () => checkForUpdates3(false) }, checkingForUpdates ? "Checking\u2026" : "Check for updates"), lastUpdateFailed && /* @__PURE__ */ React4.createElement(
    Button2,
    {
      color: Button2.Colors.RED,
      disabled: checkingForUpdates,
      onClick: () => checkForUpdates3(true)
    },
    "Force update"
  ), /* @__PURE__ */ React4.createElement("div", { className: "bs-update-switches" }, /* @__PURE__ */ React4.createElement(
    FormSwitch,
    {
      title: "Auto update",
      value: autoUpdate,
      onChange: (value) => {
        settings.store.autoUpdate = value;
        pluginRuntime().configureUpdateChecks(
          value
        );
      },
      hideBorder: true
    }
  ), /* @__PURE__ */ React4.createElement("div", { className: "bs-update-frequency" }, /* @__PURE__ */ React4.createElement("span", null, "Check frequency"), /* @__PURE__ */ React4.createElement(
    Select,
    {
      options: UPDATE_FREQUENCY_OPTIONS,
      select: (frequency) => {
        settings.store.updateCheckFrequency = normalizeUpdateCheckFrequency(frequency);
        pluginRuntime().configureUpdateChecks(
          false
        );
      },
      serialize: (value) => String(value),
      isSelected: (value) => value === selectedUpdateFrequency,
      isDisabled: !autoUpdate,
      closeOnSelect: true
    }
  )), /* @__PURE__ */ React4.createElement(
    FormSwitch,
    {
      title: autoRestartPausedUntil && autoRestartPausedUntil > Date.now() ? `Auto restart Discord (paused until ${formatAutoRestartPause(autoRestartPausedUntil)})` : "Auto restart Discord",
      value: autoRestart,
      onChange: (value) => settings.store.autoRestart = value,
      hideBorder: true
    }
  ), autoRestartPausedUntil && autoRestartPausedUntil > Date.now() && /* @__PURE__ */ React4.createElement("div", { className: "bs-restart-guard", role: "status" }, "Restart loop protection is active. Updates still install, but Discord must be restarted manually.")))), /* @__PURE__ */ React4.createElement("section", { className: "bs-backup-panel" }, /* @__PURE__ */ React4.createElement("div", { className: "bs-backup-mark", "aria-hidden": "true" }, "\u21C5"), /* @__PURE__ */ React4.createElement("div", { className: "bs-backup-copy" }, /* @__PURE__ */ React4.createElement(Forms.FormTitle, null, "Backup & sharing"), /* @__PURE__ */ React4.createElement(Forms.FormText, null, "Move your complete BetterStatus setup between computers or keep a personal backup. Presets, schedules, Memory values, saved statuses, favorites, and update preferences are all included."), backupStatus && /* @__PURE__ */ React4.createElement("div", { className: "bs-backup-status", role: "status" }, backupStatus)), /* @__PURE__ */ React4.createElement("div", { className: "bs-backup-actions" }, /* @__PURE__ */ React4.createElement("button", { type: "button", className: "bs-secondary-button", onClick: importSettings }, "Import backup"), /* @__PURE__ */ React4.createElement(Button2, { onClick: exportSettings }, "Export everything"))), /* @__PURE__ */ React4.createElement("section", { className: "bs-sync-panel" }, /* @__PURE__ */ React4.createElement("div", { className: "bs-section-heading" }, /* @__PURE__ */ React4.createElement("div", null, /* @__PURE__ */ React4.createElement(Forms.FormTitle, { tag: "h2" }, "Cloud sync"), /* @__PURE__ */ React4.createElement(Forms.FormText, null, "Keep presets, saved statuses, schedules, and preferences current on every client through secure Discord-authorized sync."))), /* @__PURE__ */ React4.createElement("div", { className: "bs-sync-controls" }, /* @__PURE__ */ React4.createElement("div", { className: "bs-field" }, /* @__PURE__ */ React4.createElement("span", null, "Sync provider"), /* @__PURE__ */ React4.createElement(
    Select,
    {
      options: SYNC_PROVIDER_OPTIONS,
      select: (provider) => {
        settings.store.syncProvider = provider;
        settings.store.syncEnabled = false;
        setSyncConnected(false);
        void pluginRuntime().configureCloudSync();
      },
      serialize: (value) => value,
      isSelected: (value) => value === syncProvider,
      closeOnSelect: true
    }
  )), syncProvider === "custom" && /* @__PURE__ */ React4.createElement("label", { className: "bs-field" }, /* @__PURE__ */ React4.createElement("span", null, "Server URL"), /* @__PURE__ */ React4.createElement(
    TextInput2,
    {
      value: syncServerUrl,
      placeholder: "https://sync.example.com",
      onChange: (value) => {
        settings.store.syncServerUrl = value;
        settings.store.syncEnabled = false;
        setSyncConnected(false);
      }
    }
  )), /* @__PURE__ */ React4.createElement("div", { className: "bs-sync-actions" }, syncConnected ? /* @__PURE__ */ React4.createElement(React4.Fragment, null, /* @__PURE__ */ React4.createElement("button", { type: "button", className: "bs-secondary-button", disabled: syncBusy, onClick: resyncFromServer }, syncBusy ? "Synchronizing\u2026" : "Resync now"), /* @__PURE__ */ React4.createElement("button", { type: "button", className: "bs-danger-button", disabled: syncBusy, onClick: disconnectSync }, "Disconnect")) : /* @__PURE__ */ React4.createElement(Button2, { disabled: syncBusy, onClick: connectSync }, syncBusy ? "Connecting\u2026" : "Connect Discord"))), /* @__PURE__ */ React4.createElement("div", { className: "bs-sync-status", role: "status" }, syncStatus), /* @__PURE__ */ React4.createElement("div", { className: "bs-sync-protection" }, /* @__PURE__ */ React4.createElement("div", null, /* @__PURE__ */ React4.createElement("strong", null, syncEncrypted ? syncLocked ? "Password required" : "Client-side encrypted" : "Password protection off"), /* @__PURE__ */ React4.createElement("span", null, syncEncrypted ? "The server stores only authenticated ciphertext." : "Optionally encrypt all synchronized configuration before upload.")), /* @__PURE__ */ React4.createElement("div", { className: "bs-sync-protection-actions" }, /* @__PURE__ */ React4.createElement(
    "button",
    {
      type: "button",
      className: "bs-secondary-button",
      disabled: !syncEnabled || syncBusy,
      onClick: () => syncLocked ? requestSyncPassword((password) => pluginRuntime().unlockCloudSyncPassword(password)) : changeSyncPassword()
    },
    syncLocked ? "Unlock" : syncEncrypted ? "Change password" : "Add password"
  ), syncEncrypted && !syncLocked && /* @__PURE__ */ React4.createElement("button", { type: "button", className: "bs-secondary-button bs-danger-text", disabled: syncBusy, onClick: removeSyncPassword }, "Remove password"))), syncProvider === "custom" && /* @__PURE__ */ React4.createElement(Forms.FormText, null, "Your self-hosted server needs its own Discord OAuth application and callback URL.")), /* @__PURE__ */ React4.createElement("section", { className: "bs-calendar-panel" }, /* @__PURE__ */ React4.createElement("div", { className: "bs-section-heading" }, /* @__PURE__ */ React4.createElement("div", null, /* @__PURE__ */ React4.createElement(Forms.FormTitle, { tag: "h2" }, "Status calendar"), /* @__PURE__ */ React4.createElement(Forms.FormText, null, "Plan when a preset or custom status starts, how long it lasts, and what Discord should show when it ends. Times use this computer's local time.")), /* @__PURE__ */ React4.createElement("div", { className: "bs-section-actions" }, !!schedules.length && /* @__PURE__ */ React4.createElement("button", { type: "button", className: "bs-secondary-button", onClick: toggleAllSchedulesCollapsed }, /* @__PURE__ */ React4.createElement(ChevronIcon2, { collapsed: !allSchedulesCollapsed }), allSchedulesCollapsed ? "Expand all" : "Collapse all"), /* @__PURE__ */ React4.createElement(Button2, { onClick: addSchedule }, "+ Schedule status"))), /* @__PURE__ */ React4.createElement("div", { className: "bs-calendar-week", "aria-label": "Upcoming seven days" }, calendarDays.map(({ day, schedules: daySchedules }, index) => /* @__PURE__ */ React4.createElement("div", { className: `bs-calendar-day${index === 0 ? " bs-calendar-today" : ""}`, key: day.toISOString() }, /* @__PURE__ */ React4.createElement("span", null, day.toLocaleDateString([], { weekday: "short" })), /* @__PURE__ */ React4.createElement("strong", null, day.getDate()), /* @__PURE__ */ React4.createElement("div", { className: "bs-calendar-day-events" }, daySchedules.slice(0, 4).map((schedule) => {
    const preset = presets.find((item) => item.id === schedule.presetId);
    const presence = schedule.startBehavior === "custom" ? schedule.startPresence : preset?.presence;
    return /* @__PURE__ */ React4.createElement("i", { className: `bs-mini-event bs-presence-${presence ?? "online"}`, key: schedule.id });
  }), daySchedules.length > 4 && /* @__PURE__ */ React4.createElement("small", null, "+", daySchedules.length - 4))))), !schedules.length ? /* @__PURE__ */ React4.createElement("div", { className: "bs-calendar-empty" }, "No scheduled statuses yet. Create one from a preset or enter a custom status.") : /* @__PURE__ */ React4.createElement("div", { className: "bs-calendar-grid" }, schedules.map((schedule) => {
    const startPreset = presets.find((preset) => preset.id === schedule.presetId);
    const startPresence = schedule.startBehavior === "custom" ? schedule.startPresence : startPreset?.presence;
    const endTime = schedule.endsAt ?? schedule.startsAt + 60 * 6e4;
    const collapsed = collapsedScheduleIds.has(schedule.id);
    const contentId = `bs-schedule-${schedule.id}`;
    return /* @__PURE__ */ React4.createElement("article", { className: `bs-schedule-card bs-presence-${startPresence ?? "online"}${schedule.enabled ? "" : " bs-schedule-disabled"}${collapsed ? " bs-schedule-collapsed" : ""}`, key: schedule.id }, /* @__PURE__ */ React4.createElement("header", { className: "bs-schedule-header" }, /* @__PURE__ */ React4.createElement("div", { className: "bs-schedule-date", "aria-hidden": "true" }, /* @__PURE__ */ React4.createElement("span", null, new Date(schedule.startsAt).toLocaleDateString([], { month: "short" })), /* @__PURE__ */ React4.createElement("strong", null, new Date(schedule.startsAt).getDate())), /* @__PURE__ */ React4.createElement("label", { className: "bs-schedule-name" }, /* @__PURE__ */ React4.createElement(TextInput2, { value: schedule.name, placeholder: "Schedule name", onChange: (name) => updateSchedule(schedule.id, { name }) }), /* @__PURE__ */ React4.createElement("span", null, scheduleRepeatLabel(schedule))), /* @__PURE__ */ React4.createElement("div", { className: "bs-schedule-actions" }, /* @__PURE__ */ React4.createElement(FormSwitch, { title: "Enabled", value: schedule.enabled, onChange: (enabled) => updateSchedule(schedule.id, { enabled }), hideBorder: true }), /* @__PURE__ */ React4.createElement("button", { type: "button", className: "bs-schedule-delete", "aria-label": `Delete ${schedule.name}`, onClick: () => commitSchedules(schedules.filter((item) => item.id !== schedule.id)) }, "\xD7"), /* @__PURE__ */ React4.createElement(
      "button",
      {
        type: "button",
        className: "bs-collapse-button",
        "aria-controls": contentId,
        "aria-expanded": !collapsed,
        "aria-label": `${collapsed ? "Expand" : "Collapse"} ${schedule.name || "calendar event"}`,
        title: collapsed ? "Expand calendar event" : "Collapse calendar event",
        onClick: () => toggleScheduleCollapsed(schedule.id)
      },
      /* @__PURE__ */ React4.createElement(ChevronIcon2, { collapsed })
    ))), !collapsed && /* @__PURE__ */ React4.createElement("div", { id: contentId, className: "bs-schedule-timeline" }, /* @__PURE__ */ React4.createElement("section", { className: "bs-timepoint bs-timepoint-start" }, /* @__PURE__ */ React4.createElement("div", { className: "bs-timepoint-marker" }, /* @__PURE__ */ React4.createElement("i", null)), /* @__PURE__ */ React4.createElement("div", { className: "bs-timepoint-content" }, /* @__PURE__ */ React4.createElement("div", { className: "bs-timepoint-title" }, /* @__PURE__ */ React4.createElement("span", null, "START"), /* @__PURE__ */ React4.createElement("strong", null, timeInputValue(schedule.startsAt))), /* @__PURE__ */ React4.createElement("div", { className: "bs-schedule-fields" }, /* @__PURE__ */ React4.createElement("label", { className: "bs-compact-field" }, /* @__PURE__ */ React4.createElement("span", null, "Date"), /* @__PURE__ */ React4.createElement("input", { type: "date", value: dateInputValue(schedule.startsAt), onChange: (event) => {
      const startsAt = updateLocalDateTime(schedule.startsAt, event.currentTarget.value);
      const duration = schedule.endsAt ? schedule.endsAt - schedule.startsAt : void 0;
      updateSchedule(schedule.id, { startsAt, endsAt: duration ? startsAt + duration : void 0 });
    } })), /* @__PURE__ */ React4.createElement("label", { className: "bs-compact-field" }, /* @__PURE__ */ React4.createElement("span", null, "Time"), /* @__PURE__ */ React4.createElement("input", { type: "time", value: timeInputValue(schedule.startsAt), onChange: (event) => {
      const startsAt = updateLocalDateTime(schedule.startsAt, void 0, event.currentTarget.value);
      const duration = schedule.endsAt ? schedule.endsAt - schedule.startsAt : void 0;
      updateSchedule(schedule.id, { startsAt, endsAt: duration ? startsAt + duration : void 0 });
    } })), /* @__PURE__ */ React4.createElement("div", { className: "bs-compact-field bs-compact-select" }, /* @__PURE__ */ React4.createElement("span", null, "When it starts"), /* @__PURE__ */ React4.createElement(
      Select,
      {
        options: SCHEDULE_START_OPTIONS.filter((option) => option.value !== "preset" || presets.length > 0),
        select: (startBehavior) => updateSchedule(schedule.id, {
          startBehavior,
          presetId: startBehavior === "preset" ? schedule.presetId ?? presets.find((preset) => preset.enabled)?.id ?? presets[0]?.id : schedule.presetId
        }),
        serialize: (value) => value,
        isSelected: (value) => value === (schedule.startBehavior ?? "preset"),
        closeOnSelect: true
      }
    )), /* @__PURE__ */ React4.createElement("div", { className: "bs-compact-field bs-compact-select" }, /* @__PURE__ */ React4.createElement("span", null, "Repeat"), /* @__PURE__ */ React4.createElement(Select, { options: SCHEDULE_REPEAT_OPTIONS, select: (repeat) => {
      const nextRepeat = repeat;
      updateSchedule(schedule.id, {
        repeat: nextRepeat,
        repeatDays: nextRepeat === "custom" && !schedule.repeatDays?.length ? [new Date(schedule.startsAt).getDay()] : schedule.repeatDays
      });
    }, serialize: (value) => value, isSelected: (value) => value === schedule.repeat, closeOnSelect: true }))), (schedule.startBehavior ?? "preset") === "preset" ? /* @__PURE__ */ React4.createElement("div", { className: "bs-start-detail" }, /* @__PURE__ */ React4.createElement("span", null, "Activate preset"), /* @__PURE__ */ React4.createElement(Select, { options: presets.map((preset) => ({ label: preset.name || "Untitled preset", value: preset.id })), select: (presetId) => updateSchedule(schedule.id, { presetId }), serialize: (value) => value, isSelected: (value) => value === schedule.presetId, closeOnSelect: true })) : /* @__PURE__ */ React4.createElement("div", { className: "bs-custom-start-grid" }, /* @__PURE__ */ React4.createElement("label", { className: "bs-field" }, /* @__PURE__ */ React4.createElement("span", null, "Custom status when it starts"), /* @__PURE__ */ React4.createElement(TextInput2, { value: schedule.startText ?? "", placeholder: "What should Discord show?", onChange: (startText) => updateSchedule(schedule.id, { startText }) })), /* @__PURE__ */ React4.createElement("div", { className: "bs-field" }, /* @__PURE__ */ React4.createElement("span", null, "Presence when it starts"), /* @__PURE__ */ React4.createElement(StatusSwitcher, { presence: schedule.startPresence ?? "online", onPresenceChange: (startPresence2) => updateSchedule(schedule.id, { startPresence: startPresence2 }) }))), schedule.repeat === "custom" && /* @__PURE__ */ React4.createElement("div", { className: "bs-weekday-picker", "aria-label": "Repeat on specific days" }, /* @__PURE__ */ React4.createElement("span", null, "Repeat on"), /* @__PURE__ */ React4.createElement("div", null, WEEKDAY_OPTIONS.map((day) => {
      const selected = (schedule.repeatDays ?? []).includes(day.value);
      return /* @__PURE__ */ React4.createElement(
        "button",
        {
          type: "button",
          className: selected ? "bs-weekday-selected" : "",
          "aria-pressed": selected,
          key: day.value,
          onClick: () => toggleScheduleDay(schedule, day.value)
        },
        day.label
      );
    }))))), /* @__PURE__ */ React4.createElement("div", { className: "bs-timeline-rail" }, /* @__PURE__ */ React4.createElement("span", null, schedule.endsAt ? `${Math.max(1, Math.round((schedule.endsAt - schedule.startsAt) / 6e4))} min` : "no end")), /* @__PURE__ */ React4.createElement("section", { className: "bs-timepoint bs-timepoint-end" }, /* @__PURE__ */ React4.createElement("div", { className: "bs-timepoint-marker" }, /* @__PURE__ */ React4.createElement("i", null)), /* @__PURE__ */ React4.createElement("div", { className: "bs-timepoint-content" }, /* @__PURE__ */ React4.createElement("div", { className: "bs-timepoint-title" }, /* @__PURE__ */ React4.createElement("span", null, "END"), /* @__PURE__ */ React4.createElement("div", { className: "bs-end-time-heading" }, schedule.endsAt && /* @__PURE__ */ React4.createElement("strong", null, "Ends at ", timeInputValue(schedule.endsAt)), /* @__PURE__ */ React4.createElement(FormSwitch, { title: "Use end time", value: Boolean(schedule.endsAt), onChange: (enabled) => updateSchedule(schedule.id, enabled ? { endsAt: endTime, endBehavior: schedule.endBehavior === "keep" ? "restore" : schedule.endBehavior } : { endsAt: void 0, endBehavior: "keep" }), hideBorder: true }))), schedule.endsAt ? /* @__PURE__ */ React4.createElement(React4.Fragment, null, /* @__PURE__ */ React4.createElement("div", { className: "bs-schedule-fields" }, /* @__PURE__ */ React4.createElement("label", { className: "bs-compact-field" }, /* @__PURE__ */ React4.createElement("span", null, "Date"), /* @__PURE__ */ React4.createElement("input", { type: "date", value: dateInputValue(schedule.endsAt), min: dateInputValue(schedule.startsAt), onChange: (event) => updateSchedule(schedule.id, { endsAt: Math.max(schedule.startsAt + 6e4, updateLocalDateTime(schedule.endsAt, event.currentTarget.value)) }) })), /* @__PURE__ */ React4.createElement("label", { className: "bs-compact-field" }, /* @__PURE__ */ React4.createElement("span", null, "Time"), /* @__PURE__ */ React4.createElement("input", { type: "time", value: timeInputValue(schedule.endsAt), onChange: (event) => updateSchedule(schedule.id, { endsAt: Math.max(schedule.startsAt + 6e4, updateLocalDateTime(schedule.endsAt, void 0, event.currentTarget.value)) }) })), /* @__PURE__ */ React4.createElement("div", { className: "bs-compact-field bs-compact-select bs-end-action-field" }, /* @__PURE__ */ React4.createElement("span", null, "When it ends"), /* @__PURE__ */ React4.createElement(Select, { options: SCHEDULE_END_OPTIONS, select: (endBehavior) => updateSchedule(schedule.id, { endBehavior }), serialize: (value) => value, isSelected: (value) => value === schedule.endBehavior, closeOnSelect: true }))), schedule.endBehavior === "preset" && /* @__PURE__ */ React4.createElement("div", { className: "bs-end-detail" }, /* @__PURE__ */ React4.createElement("span", null, "Then activate"), /* @__PURE__ */ React4.createElement(Select, { options: presets.filter((preset) => preset.id !== schedule.presetId).map((preset) => ({ label: preset.name || "Untitled preset", value: preset.id })), select: (endPresetId) => updateSchedule(schedule.id, { endPresetId }), serialize: (value) => value, isSelected: (value) => value === schedule.endPresetId, closeOnSelect: true })), schedule.endBehavior === "custom" && /* @__PURE__ */ React4.createElement("div", { className: "bs-custom-end-grid" }, /* @__PURE__ */ React4.createElement("label", { className: "bs-field" }, /* @__PURE__ */ React4.createElement("span", null, "Custom status after end"), /* @__PURE__ */ React4.createElement(TextInput2, { value: schedule.endText ?? "", placeholder: "What should Discord show?", onChange: (endText) => updateSchedule(schedule.id, { endText }) })), /* @__PURE__ */ React4.createElement("div", { className: "bs-field" }, /* @__PURE__ */ React4.createElement("span", null, "Presence after end"), /* @__PURE__ */ React4.createElement(StatusSwitcher, { presence: schedule.endPresence ?? "online", onPresenceChange: (endPresence) => updateSchedule(schedule.id, { endPresence }) })))) : /* @__PURE__ */ React4.createElement("div", { className: "bs-no-end-copy" }, "The scheduled preset stays active until something else changes it.")))));
  }))), /* @__PURE__ */ React4.createElement("div", { className: "bs-toolbar" }, /* @__PURE__ */ React4.createElement("div", null, /* @__PURE__ */ React4.createElement(Forms.FormTitle, { tag: "h2" }, "Status presets"), /* @__PURE__ */ React4.createElement("div", { className: "bs-stats" }, /* @__PURE__ */ React4.createElement("span", null, /* @__PURE__ */ React4.createElement("strong", null, presets.length), " total"), /* @__PURE__ */ React4.createElement("span", null, /* @__PURE__ */ React4.createElement("strong", null, enabledCount), " active"), /* @__PURE__ */ React4.createElement("span", null, /* @__PURE__ */ React4.createElement("strong", null, memoryCount), " memory"), /* @__PURE__ */ React4.createElement(
    "span",
    {
      className: `bs-active-summary${activePreset ? " bs-active-summary-live" : ""}`
    },
    /* @__PURE__ */ React4.createElement("i", null),
    activePreset ? /* @__PURE__ */ React4.createElement(React4.Fragment, null, "Current:", " ", /* @__PURE__ */ React4.createElement("strong", null, activePreset.name || "Untitled preset")) : "No active preset"
  ))), /* @__PURE__ */ React4.createElement("div", { className: "bs-toolbar-actions" }, /* @__PURE__ */ React4.createElement("div", { className: "bs-search" }, /* @__PURE__ */ React4.createElement("span", { "aria-hidden": "true" }, "\u2315"), /* @__PURE__ */ React4.createElement(
    TextInput2,
    {
      value: searchQuery,
      placeholder: "Search presets",
      onChange: setSearchQuery
    }
  )), !!presets.length && /* @__PURE__ */ React4.createElement(
    "button",
    {
      type: "button",
      className: "bs-secondary-button",
      onClick: toggleAllCollapsed
    },
    /* @__PURE__ */ React4.createElement(ChevronIcon2, { collapsed: !allCollapsed }),
    allCollapsed ? "Expand all" : "Collapse all"
  ), /* @__PURE__ */ React4.createElement(Button2, { onClick: addPreset }, "+ Add preset"))), presets.length === 0 ? /* @__PURE__ */ React4.createElement("div", { className: "bs-empty" }, /* @__PURE__ */ React4.createElement(Forms.FormTitle, null, "No presets yet"), /* @__PURE__ */ React4.createElement(Forms.FormText, null, "Create your first status preset to get started."), /* @__PURE__ */ React4.createElement(Button2, { onClick: addPreset }, "Create preset")) : visiblePresets.length === 0 ? /* @__PURE__ */ React4.createElement("div", { className: "bs-empty" }, /* @__PURE__ */ React4.createElement(Forms.FormTitle, null, "No matching presets"), /* @__PURE__ */ React4.createElement(Forms.FormText, null, "Try a different name, status, presence, mode, or hotkey."), /* @__PURE__ */ React4.createElement(
    "button",
    {
      type: "button",
      className: "bs-secondary-button",
      onClick: () => setSearchQuery("")
    },
    "Clear search"
  )) : /* @__PURE__ */ React4.createElement("div", { className: "bs-preset-grid" }, visiblePresets.map((preset) => {
    const collapsed = collapsedIds.has(preset.id);
    const contentId = `bs-preset-${preset.id}`;
    return /* @__PURE__ */ React4.createElement(
      "section",
      {
        className: `bs-preset-card bs-presence-${preset.presence}${preset.enabled ? "" : " bs-preset-card-disabled"}${collapsed ? " bs-preset-card-collapsed" : ""}${preset.id === activePreset?.id ? " bs-preset-card-active" : ""}`,
        key: preset.id
      },
      /* @__PURE__ */ React4.createElement("header", { className: "bs-card-header" }, /* @__PURE__ */ React4.createElement("div", { className: "bs-card-identity" }, /* @__PURE__ */ React4.createElement("span", { className: "bs-presence-dot" }), /* @__PURE__ */ React4.createElement("div", null, /* @__PURE__ */ React4.createElement("div", { className: "bs-card-title" }, /* @__PURE__ */ React4.createElement(Forms.FormTitle, null, preset.name || "Untitled preset"), /* @__PURE__ */ React4.createElement(
        "span",
        {
          className: `bs-mode-badge bs-mode-${preset.type}`
        },
        preset.type === "memory" ? "Memory" : "Fixed"
      ), preset.id === activePreset?.id && /* @__PURE__ */ React4.createElement("span", { className: "bs-active-badge" }, /* @__PURE__ */ React4.createElement("i", null), " Active")), collapsed && /* @__PURE__ */ React4.createElement("div", { className: "bs-card-summary" }, /* @__PURE__ */ React4.createElement("span", null, preset.type === "memory" ? preset.rememberedText ?? preset.text : preset.text || "No custom status"), /* @__PURE__ */ React4.createElement("span", { className: "bs-hotkey-chip" }, preset.hotkey || "No hotkey")))), /* @__PURE__ */ React4.createElement("div", { className: "bs-card-actions" }, /* @__PURE__ */ React4.createElement(
        "button",
        {
          type: "button",
          className: "bs-duplicate-button",
          title: "Create a disabled copy without a hotkey",
          onClick: () => duplicatePreset(preset)
        },
        "Duplicate"
      ), /* @__PURE__ */ React4.createElement(
        FormSwitch,
        {
          title: "Enabled",
          value: preset.enabled,
          onChange: (enabled) => updatePreset(preset.id, { enabled }),
          hideBorder: true
        }
      ), /* @__PURE__ */ React4.createElement(
        "button",
        {
          type: "button",
          className: "bs-collapse-button",
          "aria-controls": contentId,
          "aria-expanded": !collapsed,
          "aria-label": `${collapsed ? "Expand" : "Collapse"} ${preset.name || "preset"}`,
          title: collapsed ? "Expand preset" : "Collapse preset",
          onClick: () => toggleCollapsed(preset.id)
        },
        /* @__PURE__ */ React4.createElement(ChevronIcon2, { collapsed })
      ))),
      !collapsed && /* @__PURE__ */ React4.createElement("div", { id: contentId, className: "bs-card-content" }, /* @__PURE__ */ React4.createElement("div", { className: "bs-fields" }, /* @__PURE__ */ React4.createElement("label", { className: "bs-field" }, /* @__PURE__ */ React4.createElement("span", null, "Preset name"), /* @__PURE__ */ React4.createElement(
        TextInput2,
        {
          value: preset.name,
          placeholder: "Work, gaming, sleeping\u2026",
          onChange: (name) => updatePreset(preset.id, { name })
        }
      )), /* @__PURE__ */ React4.createElement("div", { className: "bs-field" }, /* @__PURE__ */ React4.createElement("span", null, "Presence"), /* @__PURE__ */ React4.createElement(
        StatusSwitcher,
        {
          presence: preset.presence,
          onPresenceChange: (presence) => updatePreset(preset.id, { presence })
        }
      )), /* @__PURE__ */ React4.createElement("div", { className: "bs-field" }, /* @__PURE__ */ React4.createElement("span", null, "Behavior"), /* @__PURE__ */ React4.createElement(
        Select,
        {
          options: TYPE_OPTIONS,
          select: (type) => updatePreset(preset.id, {
            type
          }),
          serialize: (value) => value,
          isSelected: (value) => value === preset.type,
          closeOnSelect: true
        }
      )), /* @__PURE__ */ React4.createElement("label", { className: "bs-field bs-field-status" }, /* @__PURE__ */ React4.createElement("span", null, preset.type === "memory" ? "Remembered status" : "Custom status"), /* @__PURE__ */ React4.createElement(
        TextInput2,
        {
          value: preset.type === "memory" ? preset.rememberedText ?? preset.text : preset.text,
          placeholder: "What are you doing?",
          onChange: (text) => updatePreset(
            preset.id,
            preset.type === "memory" ? { text, rememberedText: text } : { text }
          )
        }
      )), /* @__PURE__ */ React4.createElement("div", { className: "bs-field bs-field-hotkey" }, /* @__PURE__ */ React4.createElement("span", null, "Global hotkey"), /* @__PURE__ */ React4.createElement(
        "div",
        {
          className: `bs-hotkey${recordingId === preset.id ? " bs-hotkey-recording" : ""}`
        },
        /* @__PURE__ */ React4.createElement(
          TextInput2,
          {
            value: recordingId === preset.id ? "Press a shortcut\u2026" : preset.hotkey || "Not assigned",
            editable: false
          }
        ),
        /* @__PURE__ */ React4.createElement(
          Button2,
          {
            onClick: () => setRecordingId(
              recordingId === preset.id ? null : preset.id
            )
          },
          recordingId === preset.id ? "Cancel" : "Record"
        )
      ))), /* @__PURE__ */ React4.createElement("div", { className: "bs-card-footer" }, /* @__PURE__ */ React4.createElement(Forms.FormText, null, preset.type === "memory" ? "Remembers the last status used while active." : "Always applies the status saved above."), /* @__PURE__ */ React4.createElement(
        Button2,
        {
          color: Button2.Colors.RED,
          onClick: () => deletePreset(preset.id)
        },
        "Delete"
      )))
    );
  })));
}
migratePluginSettings("BetterStatus", "StatusHotkeys");
var settings = definePluginSettings({
  autoUpdate: {
    type: OptionType.CUSTOM,
    default: true,
    onChange: recordCloudSyncChanges
  },
  autoRestart: {
    type: OptionType.CUSTOM,
    default: false,
    onChange: recordCloudSyncChanges
  },
  updateCheckFrequency: {
    type: OptionType.CUSTOM,
    default: 360,
    onChange: recordCloudSyncChanges
  },
  updateChannel: {
    type: OptionType.CUSTOM,
    default: "prod",
    onChange: recordCloudSyncChanges
  },
  presets: {
    type: OptionType.CUSTOM,
    default: DEFAULT_PRESETS,
    onChange: recordCloudSyncChanges
  },
  savedStatuses: {
    type: OptionType.CUSTOM,
    default: [],
    onChange: recordCloudSyncChanges
  },
  schedules: {
    type: OptionType.CUSTOM,
    default: [],
    onChange: recordCloudSyncChanges
  },
  syncEnabled: {
    type: OptionType.CUSTOM,
    default: false
  },
  syncProvider: {
    type: OptionType.CUSTOM,
    default: "betterstatus"
  },
  syncServerUrl: {
    type: OptionType.CUSTOM,
    default: "https://betterstatus.misaliba.eu"
  },
  presetEditor: {
    type: OptionType.COMPONENT,
    component: SettingsComponent
  }
}).withPrivateSettings();
function getPresets() {
  const normalized = settings.store.presets.map((preset) => ({
    ...preset,
    type: preset.type === "memory" ? "memory" : "fixed"
  }));
  if (normalized.some(
    (preset, index) => preset.type !== settings.store.presets[index].type
  ))
    settings.store.presets = normalized;
  return normalized;
}
function getSavedStatuses() {
  const normalized = normalizeSavedStatuses(settings.store.savedStatuses);
  if (JSON.stringify(normalized) !== JSON.stringify(settings.store.savedStatuses))
    settings.store.savedStatuses = normalized;
  return normalized;
}
function getSchedules() {
  const normalized = settings.store.schedules.filter(
    (schedule) => schedule && typeof schedule.id === "string" && typeof schedule.startsAt === "number" && SCHEDULE_REPEAT_VALUES.has(schedule.repeat) && (schedule.startBehavior === "custom" || typeof schedule.presetId === "string")
  ).map((schedule) => ({
    ...schedule,
    startBehavior: schedule.startBehavior === "custom" ? "custom" : "preset",
    startText: schedule.startText ?? "",
    startPresence: schedule.startPresence ?? "online",
    repeat: SCHEDULE_REPEAT_VALUES.has(schedule.repeat) ? schedule.repeat : "once",
    repeatDays: [...new Set((schedule.repeatDays ?? []).filter((day) => Number.isInteger(day) && day >= 0 && day <= 6))].sort((left, right) => left - right),
    endBehavior: ["keep", "restore", "preset", "custom"].includes(schedule.endBehavior) ? schedule.endBehavior : "keep",
    endText: schedule.endText ?? "",
    endPresence: schedule.endPresence ?? "online"
  }));
  if (JSON.stringify(normalized) !== JSON.stringify(settings.store.schedules))
    settings.store.schedules = normalized;
  return normalized;
}
function buildSyncDocument() {
  return {
    version: 2,
    modifiedAt: Date.now(),
    presets: getPresets(),
    savedStatuses: getSavedStatuses(),
    schedules: getSchedules(),
    events: settings.store.cloudSyncEvents ?? [],
    activePresetId: settings.store.activePresetId,
    autoUpdate: settings.store.autoUpdate,
    autoRestart: settings.store.autoRestart,
    updateCheckFrequency: getUpdateCheckFrequency(),
    updateChannel: getUpdateChannel()
  };
}
async function applySyncDocument(document2) {
  if (!document2 || document2.version !== 2) throw new Error("Unsupported sync document.");
  const presetIds = new Set(document2.presets.map((preset) => preset.id));
  settings.store.presets = document2.presets;
  settings.store.savedStatuses = normalizeSavedStatuses(document2.savedStatuses);
  settings.store.schedules = validateSchedules(document2.schedules, presetIds);
  settings.store.cloudSyncEvents = Array.isArray(document2.events) ? document2.events : [];
  settings.store.activePresetId = document2.activePresetId && presetIds.has(document2.activePresetId) ? document2.activePresetId : void 0;
  settings.store.autoUpdate = document2.autoUpdate !== false;
  settings.store.autoRestart = document2.autoRestart === true;
  settings.store.updateCheckFrequency = normalizeUpdateCheckFrequency(document2.updateCheckFrequency);
  settings.store.updateChannel = document2.updateChannel === "dev" ? "dev" : "prod";
  await savePresets(document2.presets);
  window.dispatchEvent(new CustomEvent("betterstatus-sync-applied"));
}
function rememberSavedStatus(text) {
  const next = rememberStatusInLibrary(getSavedStatuses(), text);
  settings.store.savedStatuses = next;
}
function getUpdateChannel() {
  const channel = settings.store.updateChannel === "dev" ? "dev" : "prod";
  if (settings.store.updateChannel !== channel)
    settings.store.updateChannel = channel;
  return channel;
}
function normalizeUpdateCheckFrequency(value) {
  const frequency = Number(value);
  const validFrequencies = [
    0,
    1,
    5,
    15,
    30,
    60,
    180,
    360,
    720,
    1440
  ];
  return validFrequencies.includes(frequency) ? frequency : 360;
}
function getUpdateCheckFrequency() {
  const frequency = normalizeUpdateCheckFrequency(
    settings.store.updateCheckFrequency
  );
  if (settings.store.updateCheckFrequency !== frequency)
    settings.store.updateCheckFrequency = frequency;
  return frequency;
}
async function savePresets(presets) {
  settings.store.presets = presets;
  await Native2.registerHotkeys(
    presets.map(({ id, hotkey, enabled }) => ({
      id,
      hotkey,
      enabled
    }))
  );
}

// src/StatusHistory.tsx
var CustomStatusSettings = getUserSettingLazy("status", "customStatus");
var mountedHistories = /* @__PURE__ */ new Map();
var modalObserver;
var STATUSES_PER_PAGE = 10;
function StarIcon({ filled }) {
  return /* @__PURE__ */ React4.createElement("svg", { "aria-hidden": "true", viewBox: "0 0 24 24", width: "18", height: "18" }, /* @__PURE__ */ React4.createElement(
    "path",
    {
      fill: filled ? "currentColor" : "none",
      stroke: "currentColor",
      strokeLinejoin: "round",
      strokeWidth: "2",
      d: "m12 2.8 2.8 5.68 6.27.91-4.54 4.43 1.07 6.25L12 17.12l-5.6 2.95 1.07-6.25-4.54-4.43 6.27-.91L12 2.8Z"
    }
  ));
}
function TrashIcon() {
  return /* @__PURE__ */ React4.createElement("svg", { "aria-hidden": "true", viewBox: "0 0 24 24", width: "18", height: "18" }, /* @__PURE__ */ React4.createElement("path", { fill: "currentColor", d: "M9 3a1 1 0 0 0-.9.55L7.38 5H4a1 1 0 1 0 0 2h1l.72 12.08A2 2 0 0 0 7.72 21h8.56a2 2 0 0 0 2-1.92L19 7h1a1 1 0 1 0 0-2h-3.38l-.72-1.45A1 1 0 0 0 15 3H9Zm1.62 2h2.76l.5 1h-3.76l.5-1ZM8 9a1 1 0 0 1 1 1v7a1 1 0 1 1-2 0v-7a1 1 0 0 1 1-1Zm4 0a1 1 0 0 1 1 1v7a1 1 0 1 1-2 0v-7a1 1 0 0 1 1-1Zm4 0a1 1 0 0 1 1 1v7a1 1 0 1 1-2 0v-7a1 1 0 0 1 1-1Z" }));
}
function applyStatusToDiscordInput(textarea, text) {
  const valueSetter = Object.getOwnPropertyDescriptor(
    HTMLTextAreaElement.prototype,
    "value"
  )?.set;
  valueSetter?.call(textarea, text);
  textarea.dispatchEvent(new InputEvent("input", {
    bubbles: true,
    inputType: "insertText",
    data: text
  }));
  textarea.focus();
  textarea.setSelectionRange(text.length, text.length);
}
function updateSavedStatus(id, patch) {
  settings.store.savedStatuses = getSavedStatuses().map(
    (status) => status.id === id ? { ...status, ...patch } : status
  );
}
function removeSavedStatus(id) {
  settings.store.savedStatuses = getSavedStatuses().filter((status) => status.id !== id);
}
function StatusHistory({ textarea }) {
  const { savedStatuses } = settings.use(["savedStatuses"]);
  const [query, setQuery] = React4.useState("");
  const [page, setPage] = React4.useState(0);
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const statuses = React4.useMemo(
    () => normalizeSavedStatuses(savedStatuses),
    [savedStatuses]
  );
  const filtered = React4.useMemo(
    () => normalizedQuery ? statuses.filter((status) => status.text.toLocaleLowerCase().includes(normalizedQuery)) : statuses,
    [normalizedQuery, statuses]
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / STATUSES_PER_PAGE));
  const currentPage = Math.min(page, pageCount - 1);
  const visible = filtered.slice(
    currentPage * STATUSES_PER_PAGE,
    (currentPage + 1) * STATUSES_PER_PAGE
  );
  React4.useEffect(() => {
    setPage(0);
  }, [normalizedQuery]);
  React4.useEffect(() => {
    if (page >= pageCount)
      setPage(pageCount - 1);
  }, [page, pageCount]);
  return /* @__PURE__ */ React4.createElement("div", { className: "bs-history-card" }, /* @__PURE__ */ React4.createElement("div", { className: "bs-history-heading" }, /* @__PURE__ */ React4.createElement("div", null, /* @__PURE__ */ React4.createElement("h2", null, "Saved statuses"), /* @__PURE__ */ React4.createElement("p", null, statuses.length.toLocaleString(), " remembered \xB7 up to 1,000")), statuses.length > 0 && /* @__PURE__ */ React4.createElement("span", { className: "bs-history-count", "aria-label": `${filtered.length} matching statuses` }, filtered.length)), statuses.length > 0 && /* @__PURE__ */ React4.createElement("div", { className: "bs-history-search" }, /* @__PURE__ */ React4.createElement(
    TextInput2,
    {
      value: query,
      placeholder: "Search saved statuses",
      "aria-label": "Search saved statuses",
      onChange: setQuery
    }
  )), visible.length > 0 ? /* @__PURE__ */ React4.createElement("div", { className: "bs-history-list", role: "list" }, visible.map((status) => /* @__PURE__ */ React4.createElement("div", { className: "bs-history-row", role: "listitem", key: status.id }, /* @__PURE__ */ React4.createElement(
    "button",
    {
      type: "button",
      className: "bs-history-status",
      title: `Use ${status.text}`,
      onClick: () => applyStatusToDiscordInput(textarea, status.text)
    },
    /* @__PURE__ */ React4.createElement("span", null, status.text),
    /* @__PURE__ */ React4.createElement("small", null, "Used ", status.useCount.toLocaleString(), " ", status.useCount === 1 ? "time" : "times")
  ), /* @__PURE__ */ React4.createElement(
    "button",
    {
      type: "button",
      className: `bs-history-icon-button${status.favorite ? " bs-history-favorite" : ""}`,
      "aria-label": `${status.favorite ? "Remove" : "Add"} ${status.text} ${status.favorite ? "from" : "to"} favorites`,
      title: status.favorite ? "Remove from favorites" : "Add to favorites",
      onClick: () => updateSavedStatus(status.id, { favorite: !status.favorite })
    },
    /* @__PURE__ */ React4.createElement(StarIcon, { filled: status.favorite })
  ), /* @__PURE__ */ React4.createElement(
    "button",
    {
      type: "button",
      className: "bs-history-icon-button bs-history-delete",
      "aria-label": `Delete ${status.text}`,
      title: "Delete saved status",
      onClick: () => removeSavedStatus(status.id)
    },
    /* @__PURE__ */ React4.createElement(TrashIcon, null)
  )))) : /* @__PURE__ */ React4.createElement("div", { className: "bs-history-empty" }, statuses.length === 0 ? "Statuses you save in this dialog will appear here." : "No saved statuses match your search."), filtered.length > STATUSES_PER_PAGE && /* @__PURE__ */ React4.createElement("nav", { className: "bs-history-pagination", "aria-label": "Saved status pages" }, /* @__PURE__ */ React4.createElement(
    "button",
    {
      type: "button",
      disabled: currentPage === 0,
      "aria-label": "Previous saved statuses page",
      onClick: () => setPage(currentPage - 1)
    },
    "\u2039"
  ), /* @__PURE__ */ React4.createElement("span", null, "Page ", currentPage + 1, " of ", pageCount), /* @__PURE__ */ React4.createElement(
    "button",
    {
      type: "button",
      disabled: currentPage === pageCount - 1,
      "aria-label": "Next saved statuses page",
      onClick: () => setPage(currentPage + 1)
    },
    "\u203A"
  )));
}
function findModalSection(textarea) {
  const main = textarea.closest("main");
  if (!main)
    return void 0;
  let section = textarea;
  while (section?.parentElement && section.parentElement !== main)
    section = section.parentElement;
  return section?.parentElement === main ? section : void 0;
}
function cleanupRemovedHistories() {
  for (const [textarea, mounted] of mountedHistories) {
    if (textarea.isConnected && mounted.host.isConnected && mounted.modal.isConnected)
      continue;
    const draft = textarea.value.trim();
    if (draft && draft !== mounted.initialText && draft !== mounted.recordedText) {
      window.setTimeout(() => {
        if (CustomStatusSettings.getSetting()?.text?.trim() === draft)
          rememberSavedStatus(draft);
      }, 300);
    }
    mounted.modal.removeEventListener("click", mounted.saveListener, true);
    mounted.root.unmount();
    mountedHistories.delete(textarea);
  }
}
function mountHistory(textarea) {
  if (mountedHistories.has(textarea))
    return;
  const section = findModalSection(textarea);
  const modal = textarea.closest('[data-mana-component="modal"]');
  if (!section || !modal)
    return;
  let initialText = textarea.value.trim();
  let recordedText;
  for (const [oldTextarea, mounted2] of mountedHistories) {
    if (mounted2.modal !== modal)
      continue;
    initialText = mounted2.initialText;
    recordedText = mounted2.recordedText;
    mounted2.modal.removeEventListener("click", mounted2.saveListener, true);
    mounted2.root.unmount();
    mounted2.host.remove();
    mountedHistories.delete(oldTextarea);
  }
  const host = document.createElement("section");
  host.className = "bs-status-history";
  host.setAttribute("aria-label", "Saved statuses");
  section.insertAdjacentElement("afterend", host);
  const saveListener = (event) => {
    const { target } = event;
    if (!(target instanceof Element))
      return;
    const button = target.closest("button");
    if (button?.closest("footer")) {
      const text = textarea.value.trim();
      const mounted2 = mountedHistories.get(textarea);
      if (mounted2) {
        if (text && text !== mounted2.initialText && text !== mounted2.recordedText)
          rememberSavedStatus(text);
        mounted2.recordedText = text;
      }
    }
  };
  modal.addEventListener("click", saveListener, true);
  const root = createRoot2(host);
  const mounted = {
    host,
    initialText,
    modal,
    recordedText,
    root,
    saveListener
  };
  mountedHistories.set(textarea, mounted);
  root.render(/* @__PURE__ */ React4.createElement(StatusHistory, { textarea }));
}
function scanForStatusModal(root) {
  if (root instanceof HTMLTextAreaElement && root.id === "custom-status-input")
    mountHistory(root);
  root.querySelectorAll("textarea#custom-status-input").forEach(mountHistory);
}
function startStatusHistoryModalObserver() {
  stopStatusHistoryModalObserver();
  scanForStatusModal(document);
  modalObserver = new MutationObserver((records) => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node instanceof Element)
          scanForStatusModal(node);
      }
    }
    queueMicrotask(cleanupRemovedHistories);
  });
  modalObserver.observe(document.body, { childList: true, subtree: true });
}
function stopStatusHistoryModalObserver() {
  modalObserver?.disconnect();
  modalObserver = void 0;
  for (const mounted of mountedHistories.values()) {
    mounted.modal.removeEventListener("click", mounted.saveListener, true);
    mounted.root.unmount();
    mounted.host.remove();
  }
  mountedHistories.clear();
}

// src/index.tsx
var StatusSettings = getUserSettingLazy("status", "status");
var CustomStatusSettings2 = getUserSettingLazy("status", "customStatus");
var updateCheckTimer;
var automaticUpdateCheck;
var updateSchedulerActive = false;
var statusScheduleTimer;
var statusScheduleActive = false;
var cloudSyncTimer;
var cloudSyncPullTimer;
var cloudSyncRevision = 0;
var cloudSyncBaseDocument;
var cloudSyncObservedDocument;
var cloudSyncUserId = "";
var cloudSyncServer = "";
var cloudSyncOperation = Promise.resolve();
var cloudSyncGeneration = 0;
var cloudSyncForcePush = false;
var applyingCloudSnapshot = false;
var cloudSyncLocked = false;
var capturingCloudSyncChanges = false;
var SCHEDULE_GRACE_MS = 5 * 6e4;
function reopenPluginSettingsAfterRestart() {
  if (!settings.store.openSettingsAfterRestart) return;
  let attempts = 0;
  const open = () => {
    attempts++;
    try {
      const plugin = Vencord.Plugins.plugins.BetterStatus;
      if (!plugin) throw new Error("BetterStatus has not loaded yet.");
      openPluginModal(plugin);
      settings.store.openSettingsAfterRestart = false;
    } catch (error) {
      if (attempts < 15) {
        window.setTimeout(open, 1e3);
        return;
      }
      console.error("[BetterStatus] Could not reopen plugin settings after the branch switch", error);
    }
  };
  window.setTimeout(open, 1500);
}
function scheduleRepeatDays(schedule) {
  if (schedule.repeat === "daily") return /* @__PURE__ */ new Set([0, 1, 2, 3, 4, 5, 6]);
  if (schedule.repeat === "weekdays") return /* @__PURE__ */ new Set([1, 2, 3, 4, 5]);
  if (schedule.repeat === "weekends") return /* @__PURE__ */ new Set([0, 6]);
  if (schedule.repeat === "custom" && schedule.repeatDays?.length)
    return new Set(schedule.repeatDays);
  return /* @__PURE__ */ new Set([new Date(schedule.startsAt).getDay()]);
}
function occurrenceAtOrAfter(schedule, threshold) {
  if (schedule.repeat === "once")
    return schedule.startsAt >= threshold ? schedule.startsAt : void 0;
  const candidate = new Date(schedule.startsAt);
  if (candidate.getTime() < threshold) {
    const approximateDays = Math.max(0, Math.floor((threshold - candidate.getTime()) / 864e5) - 1);
    candidate.setDate(candidate.getDate() + approximateDays);
  }
  const repeatDays = scheduleRepeatDays(schedule);
  while (candidate.getTime() < threshold || !repeatDays.has(candidate.getDay()))
    candidate.setDate(candidate.getDate() + 1);
  return candidate.getTime();
}
function clearStatusSchedule() {
  if (statusScheduleTimer !== void 0) window.clearTimeout(statusScheduleTimer);
  statusScheduleTimer = void 0;
}
function configureStatusSchedule() {
  clearStatusSchedule();
  if (!statusScheduleActive) return;
  const now = Date.now();
  const lastRuns = settings.store.scheduleRuns ?? {};
  const endRuns = settings.store.scheduleEndRuns ?? {};
  const schedules = getSchedules();
  const candidates = [];
  const missedOneTimeSchedules = /* @__PURE__ */ new Set();
  for (const schedule of schedules.filter((item) => item.enabled && (item.startBehavior === "custom" || getPresets().some((preset) => preset.id === item.presetId && preset.enabled)))) {
    const lastRun = lastRuns[schedule.id] ?? 0;
    if (schedule.repeat === "once" && lastRun > 0 && !schedule.endsAt) {
      missedOneTimeSchedules.add(schedule.id);
      continue;
    }
    if (schedule.endsAt && lastRun > 0 && (endRuns[schedule.id] ?? 0) < lastRun) {
      const endOccurrence = lastRun + (schedule.endsAt - schedule.startsAt);
      if (endOccurrence >= now - SCHEDULE_GRACE_MS)
        candidates.push({ schedule, occurrence: endOccurrence, type: "end", startOccurrence: lastRun });
      else {
        settings.store.scheduleEndRuns = { ...settings.store.scheduleEndRuns ?? {}, [schedule.id]: lastRun };
        const previousStates = { ...settings.store.schedulePreviousStates ?? {} };
        delete previousStates[schedule.id];
        settings.store.schedulePreviousStates = previousStates;
        if (schedule.repeat === "once") missedOneTimeSchedules.add(schedule.id);
      }
    }
    if (schedule.repeat === "once" && lastRun === 0 && schedule.startsAt < now - SCHEDULE_GRACE_MS) {
      missedOneTimeSchedules.add(schedule.id);
      continue;
    }
    const occurrence = occurrenceAtOrAfter(schedule, Math.max(lastRun + 1, now - SCHEDULE_GRACE_MS));
    if (occurrence !== void 0)
      candidates.push({ schedule, occurrence, type: "start", startOccurrence: occurrence });
  }
  if (missedOneTimeSchedules.size)
    settings.store.schedules = schedules.map((schedule) => missedOneTimeSchedules.has(schedule.id) ? { ...schedule, enabled: false } : schedule);
  const next = candidates.sort((left, right) => left.occurrence - right.occurrence)[0];
  if (!next) return;
  statusScheduleTimer = window.setTimeout(async () => {
    if (next.occurrence > Date.now() + 1e3) {
      configureStatusSchedule();
      return;
    }
    if (next.type === "start") {
      if (next.schedule.endsAt && next.schedule.endBehavior === "restore") {
        settings.store.schedulePreviousStates = {
          ...settings.store.schedulePreviousStates ?? {},
          [next.schedule.id]: {
            occurrence: next.occurrence,
            customStatus: CustomStatusSettings2.getSetting() ?? {
              text: "",
              emojiId: "0",
              emojiName: "",
              expiresAtMs: "0",
              createdAtMs: Date.now().toString()
            },
            presence: StatusSettings.getSetting() ?? "online",
            activePresetId: settings.store.activePresetId
          }
        };
      }
      settings.store.scheduleRuns = { ...settings.store.scheduleRuns ?? {}, [next.schedule.id]: next.occurrence };
      if (next.schedule.startBehavior === "custom") {
        await setCustomStatusText(next.schedule.startText ?? "");
        await StatusSettings.updateSetting(next.schedule.startPresence ?? "online");
        settings.store.activePresetId = void 0;
        rememberSavedStatus(next.schedule.startText ?? "");
      } else if (next.schedule.presetId) {
        await triggerPresetById(next.schedule.presetId);
      }
      if (next.schedule.repeat === "once" && !next.schedule.endsAt)
        settings.store.schedules = getSchedules().map((schedule) => schedule.id === next.schedule.id ? { ...schedule, enabled: false } : schedule);
    } else {
      const previous = settings.store.schedulePreviousStates?.[next.schedule.id];
      if (next.schedule.endBehavior === "restore" && previous?.occurrence === next.startOccurrence) {
        await CustomStatusSettings2.updateSetting(previous.customStatus);
        await StatusSettings.updateSetting(previous.presence);
        settings.store.activePresetId = previous.activePresetId && getPresets().some((preset) => preset.id === previous.activePresetId && preset.enabled) ? previous.activePresetId : void 0;
      } else if (next.schedule.endBehavior === "preset" && next.schedule.endPresetId) {
        await triggerPresetById(next.schedule.endPresetId);
      } else if (next.schedule.endBehavior === "custom") {
        await setCustomStatusText(next.schedule.endText ?? "");
        await StatusSettings.updateSetting(next.schedule.endPresence ?? "online");
        settings.store.activePresetId = void 0;
        rememberSavedStatus(next.schedule.endText ?? "");
      }
      settings.store.scheduleEndRuns = { ...settings.store.scheduleEndRuns ?? {}, [next.schedule.id]: next.startOccurrence };
      const previousStates = { ...settings.store.schedulePreviousStates ?? {} };
      delete previousStates[next.schedule.id];
      settings.store.schedulePreviousStates = previousStates;
      if (next.schedule.repeat === "once")
        settings.store.schedules = getSchedules().map((schedule) => schedule.id === next.schedule.id ? { ...schedule, enabled: false } : schedule);
    }
    configureStatusSchedule();
  }, Math.min(2147e6, Math.max(0, next.occurrence - now)));
}
function syncDocumentHash(document2) {
  return JSON.stringify({ ...document2, modifiedAt: 0 });
}
function syncValuesEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}
var SYNC_SETTING_KEYS = [
  "activePresetId",
  "autoUpdate",
  "autoRestart",
  "updateCheckFrequency",
  "updateChannel"
];
function cloneSyncValue(value) {
  return value === void 0 ? value : JSON.parse(JSON.stringify(value));
}
function normalizeSyncEvents(events) {
  if (!Array.isArray(events)) return [];
  const byId = /* @__PURE__ */ new Map();
  for (const candidate of events) {
    const event = candidate;
    if (!event || typeof event !== "object" || typeof event.id !== "string" || !event.id || typeof event.clientId !== "string" || !event.clientId || !Number.isSafeInteger(event.clock) || event.clock < 1 || typeof event.createdAt !== "number" || !Number.isFinite(event.createdAt) || !["preset", "savedStatus", "schedule", "setting"].includes(event.entity ?? "") || typeof event.key !== "string" || !event.key || !["set", "delete"].includes(event.operation ?? ""))
      continue;
    byId.set(event.id, cloneSyncValue(event));
  }
  return [...byId.values()].sort((left, right) => left.clock - right.clock || left.id.localeCompare(right.id));
}
function mergeSyncEvents(...documents) {
  return normalizeSyncEvents(documents.flatMap((document2) => document2.events ?? []));
}
function materializeSyncEvents(document2) {
  const events = normalizeSyncEvents(document2.events);
  const presets = new Map(document2.presets.map((item) => [item.id, cloneSyncValue(item)]));
  const savedStatuses = new Map(document2.savedStatuses.map((item) => [item.id, cloneSyncValue(item)]));
  const schedules = new Map(document2.schedules.map((item) => [item.id, cloneSyncValue(item)]));
  const settingsValues = {
    activePresetId: document2.activePresetId,
    autoUpdate: document2.autoUpdate,
    autoRestart: document2.autoRestart,
    updateCheckFrequency: document2.updateCheckFrequency,
    updateChannel: document2.updateChannel
  };
  for (const event of events) {
    if (event.entity === "setting") {
      if (!SYNC_SETTING_KEYS.includes(event.key)) continue;
      const key = event.key;
      if (event.operation === "delete") {
        if (key === "activePresetId") settingsValues.activePresetId = void 0;
        continue;
      }
      settingsValues[key] = cloneSyncValue(event.value);
      continue;
    }
    const collection = event.entity === "preset" ? presets : event.entity === "savedStatus" ? savedStatuses : schedules;
    if (event.operation === "delete") {
      collection.delete(event.key);
      continue;
    }
    const value = event.value;
    if (value && typeof value === "object" && value.id === event.key)
      collection.set(event.key, cloneSyncValue(value));
  }
  return {
    ...document2,
    version: 2,
    ...settingsValues,
    presets: [...presets.values()],
    savedStatuses: [...savedStatuses.values()],
    schedules: [...schedules.values()],
    events
  };
}
function getCloudSyncClientId() {
  if (!settings.store.cloudSyncClientId)
    settings.store.cloudSyncClientId = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return settings.store.cloudSyncClientId;
}
function createSyncEvent(events, entity, key, operation, value) {
  const clientId = getCloudSyncClientId();
  const clock = events.reduce((maximum, event2) => Math.max(maximum, event2.clock), 0) + 1;
  const event = {
    id: `${clientId}:${clock}:${Math.random().toString(36).slice(2)}`,
    clientId,
    clock,
    createdAt: Date.now(),
    entity,
    key,
    operation
  };
  if (operation === "set") event.value = cloneSyncValue(value);
  events.push(event);
}
function captureCollectionEvents(events, entity, previous, current) {
  const previousById = new Map(previous.map((item) => [item.id, item]));
  const currentById = new Map(current.map((item) => [item.id, item]));
  for (const id of /* @__PURE__ */ new Set([...previousById.keys(), ...currentById.keys()])) {
    const before = previousById.get(id);
    const after = currentById.get(id);
    if (syncValuesEqual(before, after)) continue;
    createSyncEvent(events, entity, id, after === void 0 ? "delete" : "set", after);
  }
}
function captureLocalSyncEventsNow() {
  const current = buildSyncDocument();
  const previous = cloudSyncObservedDocument;
  if (!previous) {
    cloudSyncObservedDocument = cloneSyncValue(current);
    return current;
  }
  const events = mergeSyncEvents(previous, current);
  captureCollectionEvents(events, "preset", previous.presets, current.presets);
  captureCollectionEvents(events, "savedStatus", previous.savedStatuses, current.savedStatuses);
  captureCollectionEvents(events, "schedule", previous.schedules, current.schedules);
  for (const key of SYNC_SETTING_KEYS) {
    if (syncValuesEqual(previous[key], current[key])) continue;
    const value = current[key];
    createSyncEvent(events, "setting", key, value === void 0 ? "delete" : "set", value);
  }
  settings.store.cloudSyncEvents = events;
  const observed = materializeSyncEvents({ ...current, events });
  cloudSyncObservedDocument = cloneSyncValue(observed);
  return observed;
}
function captureLocalSyncEvents() {
  if (capturingCloudSyncChanges)
    return cloudSyncObservedDocument ?? buildSyncDocument();
  capturingCloudSyncChanges = true;
  try {
    return captureLocalSyncEventsNow();
  } finally {
    capturingCloudSyncChanges = false;
  }
}
function mergeSyncValue(base, local, remote) {
  if (syncValuesEqual(local, base)) return remote;
  if (syncValuesEqual(remote, base) || syncValuesEqual(local, remote)) return local;
  return local;
}
function mergeSyncRecord(base, local, remote) {
  const selected = mergeSyncValue(base, local, remote);
  if (!base || !local || !remote || selected === void 0)
    return selected;
  return Object.fromEntries(
    [.../* @__PURE__ */ new Set([...Object.keys(base), ...Object.keys(remote), ...Object.keys(local)])].map((key) => [key, mergeSyncValue(base[key], local[key], remote[key])]).filter(([, value]) => value !== void 0)
  );
}
function mergeSyncCollection(base, local, remote) {
  const baseById = new Map(base.map((item) => [item.id, item]));
  const localById = new Map(local.map((item) => [item.id, item]));
  const remoteById = new Map(remote.map((item) => [item.id, item]));
  const ids = [.../* @__PURE__ */ new Set([...remote.map((item) => item.id), ...local.map((item) => item.id), ...base.map((item) => item.id)])];
  return ids.flatMap((id) => {
    const merged = mergeSyncRecord(baseById.get(id), localById.get(id), remoteById.get(id));
    return merged === void 0 ? [] : [merged];
  });
}
function mergeSyncDocuments(base, local, remote) {
  return materializeSyncEvents({
    version: 2,
    modifiedAt: Date.now(),
    presets: mergeSyncCollection(base.presets, local.presets, remote.presets),
    savedStatuses: mergeSyncCollection(base.savedStatuses, local.savedStatuses, remote.savedStatuses),
    schedules: mergeSyncCollection(base.schedules, local.schedules, remote.schedules),
    events: mergeSyncEvents(base, local, remote),
    activePresetId: mergeSyncValue(base.activePresetId, local.activePresetId, remote.activePresetId),
    autoUpdate: mergeSyncValue(base.autoUpdate, local.autoUpdate, remote.autoUpdate),
    autoRestart: mergeSyncValue(base.autoRestart, local.autoRestart, remote.autoRestart),
    updateCheckFrequency: mergeSyncValue(base.updateCheckFrequency, local.updateCheckFrequency, remote.updateCheckFrequency),
    updateChannel: mergeSyncValue(base.updateChannel, local.updateChannel, remote.updateChannel)
  });
}
function rememberCloudBaseline(revision, document2) {
  cloudSyncRevision = revision;
  cloudSyncBaseDocument = document2;
  settings.store.cloudSyncState = {
    server: getSyncServerURL(),
    discordUserId: cloudSyncUserId,
    revision,
    document: document2
  };
}
function enqueueCloudOperation(operation) {
  const generation = cloudSyncGeneration;
  const run = async () => {
    if (generation !== cloudSyncGeneration) return void 0;
    return await operation();
  };
  const result = cloudSyncOperation.then(run, run);
  cloudSyncOperation = result.then(() => void 0, () => void 0);
  return result;
}
function stopCloudSync() {
  if (cloudSyncTimer !== void 0) window.clearInterval(cloudSyncTimer);
  if (cloudSyncPullTimer !== void 0) window.clearInterval(cloudSyncPullTimer);
  cloudSyncTimer = void 0;
  cloudSyncPullTimer = void 0;
  cloudSyncGeneration++;
  cloudSyncOperation = Promise.resolve();
  cloudSyncRevision = 0;
  cloudSyncBaseDocument = void 0;
  cloudSyncObservedDocument = void 0;
  cloudSyncUserId = "";
  cloudSyncServer = "";
  cloudSyncForcePush = false;
  cloudSyncLocked = false;
}
async function pushCloudChangesNow() {
  if (!settings.store.syncEnabled || applyingCloudSnapshot || cloudSyncLocked) return;
  for (let attempt = 0; attempt < 4; attempt++) {
    const document2 = captureLocalSyncEvents();
    if (!cloudSyncForcePush && cloudSyncBaseDocument && syncDocumentHash(document2) === syncDocumentHash(cloudSyncBaseDocument)) return;
    const result = await VencordNative.pluginHelpers.BetterStatus.pushCloudSync(
      getSyncServerURL(),
      cloudSyncRevision,
      document2
    );
    if (!result.conflict) {
      cloudSyncForcePush = false;
      rememberCloudBaseline(result.revision, document2);
      cloudSyncObservedDocument = cloneSyncValue(document2);
      return;
    }
    const remote = await decodeCloudSnapshot(result);
    if (!remote) return;
    const base = cloudSyncBaseDocument ?? remote.document;
    const merged = mergeSyncDocuments(base, document2, remote.document);
    applyingCloudSnapshot = true;
    try {
      await applySyncDocument(merged);
      cloudSyncObservedDocument = cloneSyncValue(merged);
      rememberCloudBaseline(remote.revision, remote.document);
    } finally {
      applyingCloudSnapshot = false;
    }
  }
  throw new Error("Cloud sync stayed busy after four merge attempts; the local changes will be retried.");
}
function pushCloudChanges() {
  return enqueueCloudOperation(pushCloudChangesNow);
}
function reportCloudProtection(encrypted, locked) {
  window.dispatchEvent(new CustomEvent("betterstatus-sync-protection", { detail: { encrypted, locked } }));
}
async function decodeCloudSnapshot(snapshot) {
  const decoded = await VencordNative.pluginHelpers.BetterStatus.decodeCloudSyncSnapshot(getSyncServerURL(), snapshot);
  if (decoded.locked) {
    cloudSyncLocked = true;
    reportCloudProtection(true, true);
    requestSyncPassword(unlockCloudSyncPassword);
    return void 0;
  }
  const document2 = decoded.snapshot.document;
  if (document2?.version !== 1 && document2?.version !== 2) return void 0;
  reportCloudProtection(decoded.encrypted, false);
  cloudSyncLocked = false;
  return { revision: snapshot.revision, document: materializeSyncEvents(document2) };
}
async function reconcileCloudSnapshot(snapshot, preferRemote = false, initial = false) {
  if (!settings.store.syncEnabled || !initial && snapshot.revision <= cloudSyncRevision) return;
  const remote = await decodeCloudSnapshot(snapshot);
  if (!remote) return;
  const local = captureLocalSyncEvents();
  const base = cloudSyncBaseDocument;
  const baseEventIds = new Set(base?.events?.map((event) => event.id) ?? []);
  const hasLocalChanges = local.events?.some((event) => !baseEventIds.has(event.id)) === true;
  const next = preferRemote ? remote.document : hasLocalChanges ? mergeSyncDocuments(base ?? remote.document, local, remote.document) : remote.document;
  applyingCloudSnapshot = true;
  try {
    if (syncDocumentHash(local) !== syncDocumentHash(next))
      await applySyncDocument(next);
    cloudSyncObservedDocument = cloneSyncValue(next);
    rememberCloudBaseline(remote.revision, remote.document);
    configureStatusSchedule();
  } finally {
    applyingCloudSnapshot = false;
  }
  if (syncDocumentHash(next) !== syncDocumentHash(remote.document))
    await pushCloudChangesNow();
}
async function unlockCloudSyncPassword(password) {
  const decoded = await VencordNative.pluginHelpers.BetterStatus.unlockCloudSync(getSyncServerURL(), password);
  cloudSyncLocked = false;
  reportCloudProtection(true, false);
  await enqueueCloudOperation(() => reconcileCloudSnapshot(decoded.snapshot, false, true));
}
async function receiveCloudSnapshot(snapshot) {
  await enqueueCloudOperation(() => reconcileCloudSnapshot(snapshot));
}
async function pullCloudChanges(forceReconcile = false) {
  await enqueueCloudOperation(async () => {
    const snapshot = await VencordNative.pluginHelpers.BetterStatus.pullCloudSync(getSyncServerURL());
    await reconcileCloudSnapshot(snapshot, false, forceReconcile);
  });
}
async function configureCloudSync() {
  const requestedServer = getSyncServerURL();
  if (settings.store.syncEnabled && cloudSyncUserId && cloudSyncServer === requestedServer && cloudSyncTimer !== void 0)
    return;
  stopCloudSync();
  if (!settings.store.syncEnabled) return;
  try {
    const server = requestedServer;
    const savedState = settings.store.cloudSyncState;
    const preferRemote = settings.store.cloudSyncPullOnConnect === true;
    settings.store.cloudSyncPullOnConnect = false;
    const result = await VencordNative.pluginHelpers.BetterStatus.startCloudSync(getSyncServerURL());
    if (!result.connected) {
      settings.store.syncEnabled = false;
      return;
    }
    cloudSyncUserId = result.discordUserId;
    cloudSyncServer = server;
    if (savedState?.server === server && savedState.discordUserId === result.discordUserId) {
      cloudSyncRevision = savedState.revision;
      cloudSyncBaseDocument = savedState.document;
    }
    cloudSyncObservedDocument = cloneSyncValue(buildSyncDocument());
    if (result.snapshot?.revision > 0)
      await enqueueCloudOperation(() => reconcileCloudSnapshot(result.snapshot, preferRemote, true));
    else {
      cloudSyncRevision = result.snapshot?.revision ?? 0;
      await pushCloudChanges();
    }
    cloudSyncTimer = window.setInterval(() => void pushCloudChanges().catch(
      (error) => console.error("[BetterStatus] Cloud sync failed", error)
    ), 500);
    cloudSyncPullTimer = window.setInterval(() => void pullCloudChanges().catch(
      (error) => console.error("[BetterStatus] Cloud sync revision pull failed", error)
    ), 1e4);
  } catch (error) {
    console.error("[BetterStatus] Could not start cloud sync", error);
  }
}
function clearScheduledUpdateCheck() {
  if (updateCheckTimer !== void 0)
    window.clearTimeout(updateCheckTimer);
  updateCheckTimer = void 0;
}
function scheduleNextUpdateCheck(retryAt) {
  clearScheduledUpdateCheck();
  const frequency = getUpdateCheckFrequency();
  if (!updateSchedulerActive || !settings.store.autoUpdate || frequency === 0 && retryAt === void 0)
    return;
  const delay = retryAt === void 0 ? frequency * 6e4 : Math.max(1e3, retryAt - Date.now());
  updateCheckTimer = window.setTimeout(runAutomaticUpdateCheck, delay);
}
function runAutomaticUpdateCheck() {
  if (!updateSchedulerActive || !settings.store.autoUpdate)
    return;
  clearScheduledUpdateCheck();
  if (automaticUpdateCheck)
    return;
  let retryAt;
  automaticUpdateCheck = VencordNative.pluginHelpers.BetterStatus.checkForUpdates(
    true,
    getUpdateChannel()
  ).then((result) => {
    if (result.status === "updated") {
      const willRestart = prepareAutoRestart();
      showNotification({
        title: "BetterStatus updated",
        body: willRestart ? "Discord will restart automatically." : settings.store.autoRestart ? "Restart loop protection is active. Restart Discord manually." : "Restart Discord to use the new version."
      });
      if (willRestart)
        window.setTimeout(relaunch, 1500);
    } else if (result.status === "failed") {
      retryAt = result.retryAt;
      showUpdateFailureNotification(result, getUpdateChannel());
    }
  }).finally(() => {
    automaticUpdateCheck = void 0;
    scheduleNextUpdateCheck(retryAt);
  });
}
async function setCustomStatusText(text) {
  await CustomStatusSettings2.updateSetting({
    text,
    emojiId: "0",
    emojiName: "",
    expiresAtMs: "0",
    createdAtMs: Date.now().toString()
  });
}
async function setDiscordState(preset) {
  const text = preset.type === "memory" ? preset.rememberedText ?? preset.text : preset.text;
  const previousText = CustomStatusSettings2.getSetting()?.text?.trim() ?? "";
  const previousPresence = StatusSettings.getSetting();
  await setCustomStatusText(text);
  await StatusSettings.updateSetting(preset.presence);
  if (text.trim() !== previousText || preset.presence !== previousPresence)
    rememberSavedStatus(text);
}
async function rememberActivePreset() {
  const { activePresetId } = settings.store;
  if (!activePresetId)
    return;
  const presets = getPresets();
  const activePreset = presets.find((preset) => preset.id === activePresetId);
  if (!activePreset || activePreset.type !== "memory")
    return;
  const currentStatus = CustomStatusSettings2.getSetting();
  const rememberedText = currentStatus?.text ?? "";
  await savePresets(presets.map(
    (preset) => preset.id === activePresetId ? { ...preset, rememberedText } : preset
  ));
}
async function restoreActivePreset() {
  const { activePresetId } = settings.store;
  if (!activePresetId)
    return void 0;
  let activePreset = getPresets().find(
    (preset) => preset.id === activePresetId && preset.enabled
  );
  if (!activePreset) {
    settings.store.activePresetId = void 0;
    return void 0;
  }
  if (activePreset.type === "memory") {
    await rememberActivePreset();
    activePreset = getPresets().find((preset) => preset.id === activePresetId);
  }
  if (!activePreset)
    return void 0;
  await setDiscordState(activePreset);
  return activePreset;
}
async function triggerPresetById(id) {
  const preset = getPresets().find((candidate) => candidate.id === id);
  if (!preset || !preset.enabled) return;
  try {
    await rememberActivePreset();
    await setDiscordState(preset);
    settings.store.activePresetId = preset.id;
    console.log(`[BetterStatus] Activated "${preset.name}"`);
  } catch (error) {
    console.error(`[BetterStatus] Failed to activate "${preset.name}"`, error);
  }
}
function BetterStatusOverview() {
  return /* @__PURE__ */ React.createElement("div", { className: "bs-atelier" }, /* @__PURE__ */ React.createElement("div", { className: "bs-atelier-copy" }, /* @__PURE__ */ React.createElement("div", { className: "bs-atelier-brand" }, /* @__PURE__ */ React.createElement("span", { className: "bs-atelier-glyph" }, /* @__PURE__ */ React.createElement("i", null), /* @__PURE__ */ React.createElement("i", null), /* @__PURE__ */ React.createElement("i", null), /* @__PURE__ */ React.createElement("i", null)), /* @__PURE__ */ React.createElement("span", null, "BETTERSTATUS")), /* @__PURE__ */ React.createElement("div", { className: "bs-atelier-kicker" }, "PRESENCE, REIMAGINED"), /* @__PURE__ */ React.createElement("h2", null, "Be exactly", /* @__PURE__ */ React.createElement("br", null), "where you are."), /* @__PURE__ */ React.createElement("p", null, "Shape your Discord presence with focused presets and shortcuts that move as fast as you do."), /* @__PURE__ */ React.createElement("div", { className: "bs-atelier-credit" }, "An open-source Vencord plugin by", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("strong", null, "nik_jandaaa27829"), " & ", /* @__PURE__ */ React.createElement("strong", null, "misaliba")), /* @__PURE__ */ React.createElement("div", { className: "bs-atelier-links" }, /* @__PURE__ */ React.createElement(Link, { href: "https://github.com/Jacksonnn911/BetterStatus" }, "Explore GitHub ", /* @__PURE__ */ React.createElement("span", null, "\u2197")), /* @__PURE__ */ React.createElement(Link, { href: "https://github.com/Jacksonnn911/BetterStatus#usage" }, "Read the docs ", /* @__PURE__ */ React.createElement("span", null, "\u2197")), /* @__PURE__ */ React.createElement(Link, { href: "https://github.com/Jacksonnn911/BetterStatus/issues/new" }, "Get support ", /* @__PURE__ */ React.createElement("span", null, "\u2197")))), /* @__PURE__ */ React.createElement("div", { className: "bs-atelier-art", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("div", { className: "bs-aurora bs-aurora-one" }), /* @__PURE__ */ React.createElement("div", { className: "bs-aurora bs-aurora-two" }), /* @__PURE__ */ React.createElement("div", { className: "bs-aurora bs-aurora-three" }), /* @__PURE__ */ React.createElement("div", { className: "bs-atelier-orb" }, /* @__PURE__ */ React.createElement("div", { className: "bs-orb-core" }, /* @__PURE__ */ React.createElement("span", { className: "bs-orb-mark" }, /* @__PURE__ */ React.createElement("i", null), /* @__PURE__ */ React.createElement("i", null), /* @__PURE__ */ React.createElement("i", null))), /* @__PURE__ */ React.createElement("span", { className: "bs-orbit bs-orbit-one" }, /* @__PURE__ */ React.createElement("i", null)), /* @__PURE__ */ React.createElement("span", { className: "bs-orbit bs-orbit-two" }, /* @__PURE__ */ React.createElement("i", null))), /* @__PURE__ */ React.createElement("div", { className: "bs-presence-spectrum" }, /* @__PURE__ */ React.createElement("span", { className: "bs-spectrum-online" }), /* @__PURE__ */ React.createElement("span", { className: "bs-spectrum-idle" }), /* @__PURE__ */ React.createElement("span", { className: "bs-spectrum-dnd" }), /* @__PURE__ */ React.createElement("span", { className: "bs-spectrum-memory" })), /* @__PURE__ */ React.createElement("div", { className: "bs-art-caption" }, /* @__PURE__ */ React.createElement("span", null, "GLOBAL HOTKEYS"), /* @__PURE__ */ React.createElement("i", null), /* @__PURE__ */ React.createElement("span", null, "MEMORY PRESETS"), /* @__PURE__ */ React.createElement("i", null), /* @__PURE__ */ React.createElement("span", null, "SEAMLESS UPDATES"))));
}
var src_default = compat_default({
  name: "BetterStatus",
  description: "Create unlimited custom Discord statuses and activate them using global hotkeys.",
  tags: ["Shortcuts", "Utility"],
  authors: [
    {
      name: "nik_jandaaa27829",
      id: 523075512579522562n
    },
    {
      name: "misaliba",
      id: 686582690597568520n
    }
  ],
  dependencies: ["UserSettingsAPI"],
  settings,
  settingsAboutComponent() {
    return /* @__PURE__ */ React.createElement(BetterStatusOverview, null);
  },
  async triggerPreset(id) {
    await triggerPresetById(id);
  },
  async start() {
    updateSchedulerActive = true;
    statusScheduleActive = true;
    const restartGuard = initializeAutoRestartGuard();
    if (restartGuard.newlyPaused && restartGuard.pausedUntil !== void 0) {
      const resumeTime = new Date(restartGuard.pausedUntil).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });
      showNotification({
        title: "BetterStatus auto restart paused",
        body: `Discord restarted twice within five minutes. Automatic restart is disabled until ${resumeTime}; updates will still install.`
      });
    }
    const presets = getPresets();
    await savePresets(presets);
    startStatusHistoryModalObserver();
    try {
      const restoredPreset = await restoreActivePreset();
      if (restoredPreset)
        console.log(`[BetterStatus] Restored last active preset "${restoredPreset.name}"`);
    } catch (error) {
      console.error("[BetterStatus] Failed to restore the last active preset", error);
    }
    runAutomaticUpdateCheck();
    configureStatusSchedule();
    await configureCloudSync();
    reopenPluginSettingsAfterRestart();
    console.log(
      `[BetterStatus] Registered ${presets.length} presets`
    );
  },
  configureUpdateChecks(checkNow = false, retryAt) {
    clearScheduledUpdateCheck();
    if (!updateSchedulerActive || !settings.store.autoUpdate)
      return;
    if (retryAt !== void 0)
      scheduleNextUpdateCheck(retryAt);
    else if (checkNow)
      runAutomaticUpdateCheck();
    else
      scheduleNextUpdateCheck();
  },
  configureSchedules() {
    configureStatusSchedule();
  },
  configureCloudSync,
  async resyncCloudSync() {
    settings.store.syncEnabled = true;
    if (!cloudSyncUserId) {
      await configureCloudSync();
      return;
    }
    await pullCloudChanges(true);
  },
  recordCloudSyncChanges() {
    if (applyingCloudSnapshot) return;
    captureLocalSyncEvents();
    if (settings.store.syncEnabled && cloudSyncUserId)
      void pushCloudChanges().catch((error) => console.error("[BetterStatus] Immediate cloud sync failed", error));
  },
  async changeCloudEncryptionPassword(password) {
    if (cloudSyncRevision === 0) throw new Error("Connect and finish the first sync before adding a password.");
    if (cloudSyncLocked) throw new Error("Unlock the current encrypted configuration before changing its password.");
    if (password)
      await VencordNative.pluginHelpers.BetterStatus.setCloudEncryptionPassword(getSyncServerURL(), password);
    else
      await VencordNative.pluginHelpers.BetterStatus.clearCloudEncryptionPassword(getSyncServerURL());
    cloudSyncForcePush = true;
    await pushCloudChanges();
    reportCloudProtection(Boolean(password), false);
  },
  unlockCloudSyncPassword,
  receiveCloudSnapshot,
  stop() {
    updateSchedulerActive = false;
    statusScheduleActive = false;
    clearScheduledUpdateCheck();
    clearStatusSchedule();
    stopCloudSync();
    stopStatusHistoryModalObserver();
    VencordNative.pluginHelpers.BetterStatus.unregisterAll();
  }
});

// betterdiscord/src/updater.ts
var G5 = globalThis;
var Bd5 = G5.BdApi;
if (!Bd5) throw new Error("BetterStatus requires BetterDiscord/BdApi.");
var api5 = new Bd5("BetterStatus");
var REPOSITORY2 = "Jacksonnn911/BetterStatus";
var COMMIT2 = true ? "184805ee4edd25c1007f8dad333b4799dc5b46ef" : "development";
var BUILD_CHANNEL2 = true ? "betterdiscord-port" : "betterdiscord-port";
var pendingRestartVersion2;
var updatePromise2;
function normalizeChannel(value) {
  return value === "dev" ? "dev" : "prod";
}
function branchFor(channel) {
  if (BUILD_CHANNEL2 === "betterdiscord-port") return "betterdiscord-port";
  return normalizeChannel(channel);
}
function rawPluginURL2(channel) {
  const branch = branchFor(channel);
  return `https://raw.githubusercontent.com/${REPOSITORY2}/${branch}/betterdiscord/BetterStatus.plugin.js`;
}
function parseBuild2(text) {
  return text.match(/@build\s+([0-9a-f]{7,40}|development)/i)?.[1];
}
async function fetchRemotePlugin2(channel) {
  const branch = branchFor(channel);
  const response = await api5.Net.fetch(rawPluginURL2(channel), { cache: "no-store" });
  if (!response.ok) {
    const error = new Error(`BetterDiscord ${branch} build is unavailable (HTTP ${response.status}).`);
    if (response.status === 403 || response.status === 429) {
      const retryAfter = Number(response.headers.get("retry-after"));
      const reset = Number(response.headers.get("x-ratelimit-reset"));
      error.retryAt = retryAfter > 0 ? Date.now() + retryAfter * 1e3 : reset > 0 ? reset * 1e3 : Date.now() + 15 * 6e4;
    }
    throw error;
  }
  const text = await response.text();
  if (!/@name\s+BetterStatus/.test(text) || !/module\.exports/.test(text))
    throw new Error("Downloaded BetterDiscord build is invalid.");
  return { text, version: parseBuild2(text) || "unknown", branch };
}
async function getUpdateInfo2(requestedChannel = "prod") {
  const channel = normalizeChannel(requestedChannel);
  const remote = await fetchRemotePlugin2(channel);
  return {
    channel,
    installedChannel: BUILD_CHANNEL2 === "prod" || BUILD_CHANNEL2 === "dev" ? BUILD_CHANNEL2 : void 0,
    installedVersion: COMMIT2,
    latestVersion: remote.version,
    status: pendingRestartVersion2 ? "restartRequired" : remote.version === COMMIT2 ? "current" : "updateAvailable"
  };
}
function checkForUpdates2(enabled, requestedChannel = "prod", force = false) {
  if (!enabled) return Promise.resolve({ status: "disabled" });
  if (updatePromise2) return updatePromise2;
  const channel = normalizeChannel(requestedChannel);
  updatePromise2 = (async () => {
    try {
      const remote = await fetchRemotePlugin2(channel);
      if (!force && remote.version === COMMIT2)
        return { status: "current", version: COMMIT2, channel };
      const req = G5.require || G5.window?.require;
      if (!req) throw new Error("BetterDiscord filesystem bridge is unavailable.");
      const fs = req("fs");
      const path = req("path");
      const target = path.join(Bd5.Plugins.folder, "BetterStatus.plugin.js");
      fs.writeFileSync(target, remote.text, "utf8");
      pendingRestartVersion2 = remote.version;
      return { status: "updated", version: remote.version, channel };
    } catch (error) {
      return {
        status: "failed",
        error: error?.message || String(error),
        retryAt: error?.retryAt
      };
    }
  })().finally(() => {
    updatePromise2 = void 0;
  });
  return updatePromise2;
}
var updater_default = { getUpdateInfo: getUpdateInfo2, checkForUpdates: checkForUpdates2 };

// betterdiscord/src/entry.tsx
var G6 = globalThis;
var api6 = new G6.BdApi("BetterStatus");
var BetterStatusBetterDiscord = class {
  meta;
  constructor(meta) {
    this.meta = meta;
  }
  start() {
    G6.Vencord ??= {};
    G6.Vencord.Plugins ??= {};
    G6.Vencord.Plugins.plugins ??= {};
    G6.Vencord.Plugins.plugins.BetterStatus = src_default;
    G6.VencordNative ??= {};
    G6.VencordNative.pluginHelpers ??= {};
    Object.assign(native_default, updater_default);
    G6.VencordNative.pluginHelpers.BetterStatus = native_default;
    native_default.attachRuntime(src_default);
    const css = `${G6.__BETTERSTATUS_COMPAT_CSS__ || ""}
${G6.__BETTERSTATUS_SOURCE_CSS__ || ""}`;
    if (css.trim()) api6.DOM.addStyle(css);
    try {
      src_default.start?.call(src_default);
      api6.Logger.info("Started BetterStatus through the BetterDiscord compatibility layer.");
    } catch (error) {
      api6.Logger.error("BetterStatus failed to start", error);
      api6.UI.showToast(`BetterStatus failed to start: ${error instanceof Error ? error.message : String(error)}`, {
        type: "error",
        timeout: 1e4
      });
      throw error;
    }
  }
  stop() {
    try {
      src_default.stop?.call(src_default);
    } finally {
      native_default.unregisterAll();
      api6.DOM.removeStyle();
    }
  }
  getSettingsPanel() {
    return React4.createElement(
      "div",
      { className: "bs-bd-settings-host" },
      React4.createElement(SettingsComponent)
    );
  }
};
module.exports = module.exports.default || module.exports;
