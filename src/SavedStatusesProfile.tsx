/*
 * BetterStatus updater compatibility bridge.
 *
 * Older BetterStatus builds download this path before replacing their updater.
 * The profile component has moved, but keeping this empty module available lets
 * those installations complete one final update. The current updater removes
 * this obsolete file after it has installed the new source set.
 */

export {};
