import { globalShortcut, IpcMainInvokeEvent } from "electron";

const registeredShortcuts = new Map<string, string>();

function triggerPreset(event: IpcMainInvokeEvent, presetId: string) {
    const encodedId = JSON.stringify(presetId);

    event.sender.executeJavaScript(
        `Vencord.Plugins.plugins.StatusHotkeys.triggerPreset(${encodedId})`
    ).catch(console.error);
}

export function unregisterAll() {
    for (const accelerator of registeredShortcuts.keys()) {
        try {
            globalShortcut.unregister(accelerator);
        } catch {}
    }

    registeredShortcuts.clear();
}

export function registerHotkeys(
    event: IpcMainInvokeEvent,
    presets: Array<{
        id: string;
        hotkey: string;
        enabled: boolean;
    }>
) {
    unregisterAll();

    const results: Record<string, boolean> = {};

    for (const preset of presets) {
        if (!preset.enabled || !preset.hotkey) {
            continue;
        }

        try {
            const success = globalShortcut.register(
                preset.hotkey,
                () => triggerPreset(event, preset.id)
            );

            results[preset.id] = success;

            if (success) {
                registeredShortcuts.set(preset.hotkey, preset.id);
            }
        } catch (error) {
            console.error(
                `[StatusHotkeys] Failed to register ${preset.hotkey}`,
                error
            );

            results[preset.id] = false;
        }
    }

    return results;
}
