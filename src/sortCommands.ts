import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered } from './patterns';
import { findHeaderAbove, getSectionRange } from './documentUtils';

type EditBuilder = vscode.TextEditorEdit;

interface ItemLine { lineIndex: number; text: string; sortKey: string; }

function collectBulletItems(doc: vscode.TextDocument, start: number, end: number, prefix: string): ItemLine[] {
    const items: ItemLine[] = [];
    for (let i = start + 1; i <= end; i++) {
        const text   = doc.lineAt(i).text;
        const bullet = parseBullet(text, prefix);
        if (bullet) { items.push({ lineIndex: i, text, sortKey: bullet.content.toLowerCase() }); }
    }
    return items;
}

async function replaceItems(editor: vscode.TextEditor, original: ItemLine[], sorted: ItemLine[]): Promise<void> {
    await editor.edit((eb: EditBuilder) => {
        for (let i = 0; i < original.length; i++) {
            eb.replace(editor.document.lineAt(original[i].lineIndex).range, sorted[i].text);
        }
    });
}

/** Sorts all bullet items in the current section A → Z */
export async function onSortItemsAZ(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const { prefix } = getConfig();
    const headerLine = findHeaderAbove(editor.document, editor.selection.active.line);
    if (headerLine < 0) { return; }
    const [, end]    = getSectionRange(editor.document, headerLine);
    const items      = collectBulletItems(editor.document, headerLine, end, prefix);
    if (items.length < 2) { return; }
    await replaceItems(editor, items, [...items].sort((a, b) => a.sortKey.localeCompare(b.sortKey)));
}

/** Sorts all bullet items in the current section Z → A */
export async function onSortItemsZA(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const { prefix } = getConfig();
    const headerLine = findHeaderAbove(editor.document, editor.selection.active.line);
    if (headerLine < 0) { return; }
    const [, end]    = getSectionRange(editor.document, headerLine);
    const items      = collectBulletItems(editor.document, headerLine, end, prefix);
    if (items.length < 2) { return; }
    await replaceItems(editor, items, [...items].sort((a, b) => b.sortKey.localeCompare(a.sortKey)));
}

/** Resets numbering on all numbered items per chevron depth */
export async function onRenumberItems(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const headerLine = findHeaderAbove(editor.document, editor.selection.active.line);
    if (headerLine < 0) { return; }
    const [, end]    = getSectionRange(editor.document, headerLine);
    const counters   = new Map<string, number>();
    await editor.edit((eb: EditBuilder) => {
        for (let i = headerLine + 1; i <= end; i++) {
            const text    = editor.document.lineAt(i).text;
            const numbered = parseNumbered(text);
            if (!numbered) { continue; }
            const next = (counters.get(numbered.chevrons) ?? 0) + 1;
            counters.set(numbered.chevrons, next);
            eb.replace(editor.document.lineAt(i).range, `${numbered.chevrons} ${next}. ${numbered.content}`);
        }
    });
}

/**
 * Converts all >> - bullet items in the section to numbered items,
 * continuing from the highest existing number. Sentence order preserved.
 */
export async function onConvertBulletsToNumbered(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const { prefix } = getConfig();
    const doc        = editor.document;
    const headerLine = findHeaderAbove(doc, editor.selection.active.line);
    if (headerLine < 0) { vscode.window.showInformationMessage('CL: No section found at cursor'); return; }
    const [, end]    = getSectionRange(doc, headerLine);
    const maxNum     = new Map<string, number>();
    for (let i = headerLine + 1; i <= end; i++) {
        const n = parseNumbered(doc.lineAt(i).text);
        if (n) { maxNum.set(n.chevrons, Math.max(maxNum.get(n.chevrons) ?? 0, n.num)); }
    }
    let converted = 0;
    await editor.edit((eb: EditBuilder) => {
        for (let i = headerLine + 1; i <= end; i++) {
            const bullet = parseBullet(doc.lineAt(i).text, prefix);
            if (!bullet) { continue; }
            const next = (maxNum.get(bullet.chevrons) ?? 0) + 1;
            maxNum.set(bullet.chevrons, next);
            eb.replace(doc.lineAt(i).range, `${bullet.chevrons} ${next}. ${bullet.content}`);
            converted++;
        }
    });
    if (converted === 0) { vscode.window.showInformationMessage('CL: No bullet items found to convert'); }
}

/**
 * Converts all >> N. numbered items in the section to bullet items.
 * Sentence order is fully preserved — only the prefix changes.
 */
export async function onConvertNumberedToBullets(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const { prefix } = getConfig();
    const doc        = editor.document;
    const headerLine = findHeaderAbove(doc, editor.selection.active.line);
    if (headerLine < 0) { vscode.window.showInformationMessage('CL: No section found at cursor'); return; }
    const [, end]    = getSectionRange(doc, headerLine);
    let converted = 0;
    await editor.edit((eb: EditBuilder) => {
        for (let i = headerLine + 1; i <= end; i++) {
            const numbered = parseNumbered(doc.lineAt(i).text);
            if (!numbered) { continue; }
            eb.replace(doc.lineAt(i).range, `${numbered.chevrons} ${prefix} ${numbered.content}`);
            converted++;
        }
    });
    if (converted === 0) { vscode.window.showInformationMessage('CL: No numbered items found to convert'); }
}

/** Pure renumber function for use in tests and diagnostics */
export function renumber(lines: string[]): string[] {
    const counters = new Map<string, number>();
    return lines.map(text => {
        const numbered = parseNumbered(text);
        if (!numbered) { return text; }
        const next = (counters.get(numbered.chevrons) ?? 0) + 1;
        counters.set(numbered.chevrons, next);
        return `${numbered.chevrons} ${next}. ${numbered.content}`;
    });
}
