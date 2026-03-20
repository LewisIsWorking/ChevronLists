import * as vscode from 'vscode';

const PINNED_KEY = 'chevron-lists.pinnedSections';

/** Reads the set of pinned section names for the active workspace */
export function getPinnedSections(context: vscode.ExtensionContext): Set<string> {
    const stored = context.workspaceState.get<string[]>(PINNED_KEY, []);
    return new Set(stored.map(s => s.toLowerCase()));
}

/** Saves the pinned sections back to workspace state */
async function savePinnedSections(
    context: vscode.ExtensionContext,
    pins: Set<string>
): Promise<void> {
    await context.workspaceState.update(PINNED_KEY, [...pins]);
}

/** Toggles the pin state of a section name */
export async function togglePin(
    context: vscode.ExtensionContext,
    name: string
): Promise<boolean> {
    const pins = getPinnedSections(context);
    const key  = name.toLowerCase();
    if (pins.has(key)) { pins.delete(key); } else { pins.add(key); }
    await savePinnedSections(context, pins);
    return pins.has(key); // true = now pinned
}

/** Returns true if a section name is pinned */
export function isPinned(context: vscode.ExtensionContext, name: string): boolean {
    return getPinnedSections(context).has(name.toLowerCase());
}
