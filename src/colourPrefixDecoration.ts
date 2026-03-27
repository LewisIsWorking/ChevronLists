import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered } from './patterns';
import { parseColourLabel } from './colourLabelParser';

/** Hex values matching ColourLabel names */
const COLOUR_HEX: Record<string, string> = {
    red:    '#E06C75',
    green:  '#98C379',
    blue:   '#61AFEF',
    yellow: '#E5C07B',
    orange: '#FF9800',
    purple: '#C792EA',
};

/** One decoration type per colour, covering only the bullet prefix character */
const decorationTypes = new Map<string, vscode.TextEditorDecorationType>();

function getDecType(colour: string): vscode.TextEditorDecorationType {
    if (!decorationTypes.has(colour)) {
        decorationTypes.set(colour, vscode.window.createTextEditorDecorationType({
            color: COLOUR_HEX[colour],
        }));
    }
    return decorationTypes.get(colour)!;
}

/** Updates bullet/number prefix colour decorations based on {colour} labels in item content */
export function updateColourPrefixDecorations(editor: vscode.TextEditor | undefined): void {
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const { prefix } = getConfig();
    const doc        = editor.document;

    const rangesByColour = new Map<string, vscode.Range[]>();

    for (let i = 0; i < doc.lineCount; i++) {
        const text    = doc.lineAt(i).text;
        const bullet  = parseBullet(text, prefix);
        const numbered = parseNumbered(text);
        const content  = bullet?.content ?? numbered?.content ?? null;
        if (!content) { continue; }

        const colour = parseColourLabel(content);
        if (!colour) { continue; }

        // Target just the prefix character (- or N.) not the chevrons
        const chevronEnd = bullet
            ? bullet.chevrons.length + 1               // after ">> "
            : numbered!.chevrons.length + 1;           // after ">> "
        const prefixLen = bullet
            ? prefix.length + 1                        // "- "
            : String(numbered!.num).length + 2;        // "1. "

        const range = new vscode.Range(i, chevronEnd, i, chevronEnd + prefixLen);
        if (!rangesByColour.has(colour)) { rangesByColour.set(colour, []); }
        rangesByColour.get(colour)!.push(range);
    }

    for (const colour of Object.keys(COLOUR_HEX)) {
        editor.setDecorations(getDecType(colour), rangesByColour.get(colour) ?? []);
    }
}
