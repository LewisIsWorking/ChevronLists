import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered } from './patterns';
import { COLOUR_LABELS, setColourLabel, removeColourLabel } from './colourLabelParser';

/** Command: sets a colour label on the item at the cursor via quick pick */
export async function onSetItemColour(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }

    const { prefix } = getConfig();
    const doc        = editor.document;
    const lineIndex  = editor.selection.active.line;
    const text       = doc.lineAt(lineIndex).text;
    const bullet     = parseBullet(text, prefix);
    const numbered   = parseNumbered(text);
    if (!bullet && !numbered) {
        vscode.window.showInformationMessage('CL: Place cursor on a chevron item to colour it');
        return;
    }

    const chevrons = bullet?.chevrons ?? numbered!.chevrons;
    const content  = bullet?.content  ?? numbered!.content;
    const num      = numbered?.num ?? null;

    const iconMap: Record<string, string> = {
        red: '$(circle-filled)', green: '$(pass-filled)',
        blue: '$(info)', yellow: '$(warning)',
        orange: '$(flame)', purple: '$(star-full)',
    };

    const pick = await vscode.window.showQuickPick([
        ...COLOUR_LABELS.map(l => ({ label: `${iconMap[l]} ${l}`, colour: l as typeof COLOUR_LABELS[number] })),
        { label: '$(close) Remove colour', colour: null as any },
    ], { placeHolder: 'Select a colour label...' });

    if (!pick) { return; }

    const newContent = pick.colour ? setColourLabel(content, pick.colour) : removeColourLabel(content);
    const newLine    = num !== null
        ? `${chevrons} ${num}. ${newContent}`
        : `${chevrons} ${prefix} ${newContent}`;
    await editor.edit(eb => eb.replace(doc.lineAt(lineIndex).range, newLine));
}
