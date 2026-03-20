import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered } from './patterns';
import { prevNumberAtDepth } from './documentUtils';

type EditBuilder = vscode.TextEditorEdit;

/**
 * Expands all selections (including range selections from Shift+click) into a
 * deduplicated flat list of line numbers that contain chevron items.
 */
function getChevronLines(
    editor: vscode.TextEditor,
    prefix: string
): number[] {
    const lines = new Set<number>();
    for (const sel of editor.selections) {
        const start = Math.min(sel.anchor.line, sel.active.line);
        const end   = Math.max(sel.anchor.line, sel.active.line);
        for (let i = start; i <= end; i++) {
            const text = editor.document.lineAt(i).text;
            if (parseBullet(text, prefix) || parseNumbered(text)) {
                lines.add(i);
            }
        }
    }
    return Array.from(lines).sort((a, b) => a - b);
}

/** Applies a Tab indent to one line */
function applyIndent(
    eb: EditBuilder,
    doc: vscode.TextDocument,
    lineIndex: number,
    prefix: string
): void {
    const lineText  = doc.lineAt(lineIndex).text;
    const lineRange = doc.lineAt(lineIndex).range;
    const numbered  = parseNumbered(lineText);
    if (numbered) {
        const newChevrons = `>${numbered.chevrons}`;
        const prevNum     = prevNumberAtDepth(doc, lineIndex, newChevrons);
        eb.replace(lineRange, `${newChevrons} ${prevNum + 1}. ${numbered.content}`);
        return;
    }
    const bullet = parseBullet(lineText, prefix);
    if (bullet) {
        eb.replace(lineRange, `>${bullet.chevrons} ${prefix} ${bullet.content}`);
    }
}

/** Applies a Shift+Tab dedent to one line */
function applyDedent(
    eb: EditBuilder,
    doc: vscode.TextDocument,
    lineIndex: number,
    prefix: string
): void {
    const lineText  = doc.lineAt(lineIndex).text;
    const lineRange = doc.lineAt(lineIndex).range;
    const numbered  = parseNumbered(lineText);
    if (numbered) {
        if (numbered.chevrons.length <= 2) { return; }
        const newChevrons = numbered.chevrons.slice(1);
        const prevNum     = prevNumberAtDepth(doc, lineIndex, newChevrons);
        eb.replace(lineRange, `${newChevrons} ${prevNum + 1}. ${numbered.content}`);
        return;
    }
    const bullet = parseBullet(lineText, prefix);
    if (bullet && bullet.chevrons.length > 2) {
        eb.replace(lineRange, `${bullet.chevrons.slice(1)} ${prefix} ${bullet.content}`);
    }
}

/** Handles Tab — promotes chevron items across all cursors and range selections */
export async function onTab(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const { prefix }      = getConfig();
    const chevronLines    = getChevronLines(editor, prefix);
    if (chevronLines.length === 0) { await vscode.commands.executeCommand('tab'); return; }
    await editor.edit((eb: EditBuilder) => {
        for (const line of chevronLines) { applyIndent(eb, editor.document, line, prefix); }
    });
}

/** Handles Shift+Tab — demotes chevron items across all cursors and range selections */
export async function onShiftTab(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const { prefix }   = getConfig();
    const chevronLines = getChevronLines(editor, prefix);
    if (chevronLines.length === 0) { await vscode.commands.executeCommand('outdent'); return; }
    await editor.edit((eb: EditBuilder) => {
        for (const line of chevronLines) { applyDedent(eb, editor.document, line, prefix); }
    });
}
