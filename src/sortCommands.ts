import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered } from './patterns';
import { findHeaderAbove, getSectionRange } from './documentUtils';

type EditBuilder = vscode.TextEditorEdit;

/** Represents a parsed item line for sorting */
interface ItemLine {
    lineIndex: number;
    text:      string;
    sortKey:   string;
}

/**
 * Collects all top-level bullet item lines within [start+1, end].
 * Top-level means the minimum chevron depth in the section.
 */
function collectBulletItems(
    doc: vscode.TextDocument,
    start: number,
    end: number,
    prefix: string
): ItemLine[] {
    const items: ItemLine[] = [];
    for (let i = start + 1; i <= end; i++) {
        const text   = doc.lineAt(i).text;
        const bullet = parseBullet(text, prefix);
        if (bullet) {
            items.push({ lineIndex: i, text, sortKey: bullet.content.toLowerCase() });
        }
    }
    return items;
}

/** Replaces item lines in the document with a reordered set */
async function replaceItems(
    editor: vscode.TextEditor,
    original: ItemLine[],
    sorted: ItemLine[]
): Promise<void> {
    await editor.edit((eb: EditBuilder) => {
        for (let i = 0; i < original.length; i++) {
            const lineRange = editor.document.lineAt(original[i].lineIndex).range;
            eb.replace(lineRange, sorted[i].text);
        }
    });
}

/** Sorts all bullet items in the current section A → Z */
export async function onSortItemsAZ(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const { prefix }  = getConfig();
    const headerLine  = findHeaderAbove(editor.document, editor.selection.active.line);
    if (headerLine < 0) { return; }
    const [, end]     = getSectionRange(editor.document, headerLine);
    const items       = collectBulletItems(editor.document, headerLine, end, prefix);
    if (items.length < 2) { return; }
    const sorted      = [...items].sort((a, b) => a.sortKey.localeCompare(b.sortKey));
    await replaceItems(editor, items, sorted);
}

/** Sorts all bullet items in the current section Z → A */
export async function onSortItemsZA(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const { prefix }  = getConfig();
    const headerLine  = findHeaderAbove(editor.document, editor.selection.active.line);
    if (headerLine < 0) { return; }
    const [, end]     = getSectionRange(editor.document, headerLine);
    const items       = collectBulletItems(editor.document, headerLine, end, prefix);
    if (items.length < 2) { return; }
    const sorted      = [...items].sort((a, b) => b.sortKey.localeCompare(a.sortKey));
    await replaceItems(editor, items, sorted);
}

/** Resets numbering on all numbered items in the section, per chevron depth */
export async function onRenumberItems(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const headerLine = findHeaderAbove(editor.document, editor.selection.active.line);
    if (headerLine < 0) { return; }
    const [, end]    = getSectionRange(editor.document, headerLine);

    // Track the current count per chevron depth string e.g. ">>" → 1, ">>>" → 1
    const counters = new Map<string, number>();

    await editor.edit((eb: EditBuilder) => {
        for (let i = headerLine + 1; i <= end; i++) {
            const text    = editor.document.lineAt(i).text;
            const numbered = parseNumbered(text);
            if (!numbered) { continue; }
            const prev    = counters.get(numbered.chevrons) ?? 0;
            const next    = prev + 1;
            counters.set(numbered.chevrons, next);
            const newLine = `${numbered.chevrons} ${next}. ${numbered.content}`;
            eb.replace(editor.document.lineAt(i).range, newLine);
        }
    });
}
