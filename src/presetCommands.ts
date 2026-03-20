import * as vscode from 'vscode';
import { COLOUR_PRESETS, findPreset, type ColourPreset } from './colourPresets';

interface PresetPickItem extends vscode.QuickPickItem {
    preset: ColourPreset;
}

/** Applies a colour preset to the user's semantic token colour settings */
async function applyPreset(preset: ColourPreset): Promise<void> {
    const cfg     = vscode.workspace.getConfiguration('editor');
    const current = cfg.get<Record<string, unknown>>('semanticTokenColorCustomizations') ?? {};

    // Merge preset tokens into existing rules, preserving any user-defined keys
    const existingRules = (current['rules'] as Record<string, unknown>) ?? {};
    const presetTokens  = preset.tokens as Record<string, unknown>;
    const newRules      = { ...existingRules, ...presetTokens };

    // Remove empty token entries (the 'custom' preset clears chevron keys)
    for (const [key, value] of Object.entries(newRules)) {
        if (key.startsWith('chevron') && Object.keys(value as object).length === 0) {
            delete newRules[key];
        }
    }

    // Always enable semantic tokens for markdown — many themes disable them by default
    const markdownScope = (current['[markdown]'] as Record<string, unknown>) ?? {};

    await cfg.update(
        'semanticTokenColorCustomizations',
        {
            ...current,
            '[markdown]': { ...markdownScope, enabled: true },
            rules: newRules,
        },
        vscode.ConfigurationTarget.Global
    );
}

/** Command: shows a quick pick of colour presets and applies the selected one */
export async function onSwitchColourPreset(): Promise<void> {
    const currentPresetId = vscode.workspace
        .getConfiguration('chevron-lists')
        .get<string>('colourPreset', 'default');

    const items: PresetPickItem[] = COLOUR_PRESETS.map(preset => ({
        label:       preset.label,
        description: preset.description,
        detail:      preset.id === currentPresetId ? '$(check) Currently active' : undefined,
        preset,
    }));

    const pick = await vscode.window.showQuickPick(items, {
        placeHolder: 'Select a Chevron Lists colour preset',
        matchOnDescription: true,
    });

    if (!pick) { return; }

    await applyPreset(pick.preset);
    await vscode.workspace
        .getConfiguration('chevron-lists')
        .update('colourPreset', pick.preset.id, vscode.ConfigurationTarget.Global);

    vscode.window.showInformationMessage(
        `Chevron Lists: Colour preset changed to "${pick.preset.id}"`
    );
}

/** Applies the configured colour preset on extension activation */
export async function applyConfiguredPreset(): Promise<void> {
    const presetId = vscode.workspace
        .getConfiguration('chevron-lists')
        .get<string>('colourPreset', 'default');
    const preset = findPreset(presetId);
    if (preset) { await applyPreset(preset); }
}
