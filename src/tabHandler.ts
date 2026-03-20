import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered } from './patterns';
import { prevNumberAtDepth } from './documentUtils';

type EditBuilder = vscode.TextEditorEdit;

/** Applies a single Tab indent to one selection's line */
function applyIndent(
    eb: EditBuilder,
    doc: vscode.TextDocument,
    sel: vscode.Selection,
    prefix: string
): void {
    const lineText  = doc.lineAt(sel.active.line).text;
    const lineRange = doc.lineAt(sel.active.line).range;
    const numbered  = parseNumbered(lineText);
    if (numbered) {
        const newChevrons = `>${numbered.chevrons}`;
        const prevNum     = prevNumberAtDepth(doc, sel.active.line, newChevrons);
        eb.replace(lineRange, `${newChevrons} ${prevNum + 1}. ${numbered.content}`);
        return;
    }
    const bullet = parseBullet(lineText, prefix);
    if (bullet) {
        eb.replace(lineRange, `>${bullet.chevrons} ${prefix} ${bullet.content}`);
    }
}

/** Applies a single Shift+Tab dedent to one selection's line */
function applyDedent(
    eb: EditBuilder,
    doc: vscode.TextDocument,
    sel: vscode.Selection,
    prefix: string
): void {
    const lineText  = doc.lineAt(sel.active.line).text;
    const lineRange = doc.lineAt(sel.active.line).range;
    const numbered  = parseNumbered(lineText);
    if (numbered) {
        if (numbered.chevrons.length <= 2) { return; }
        const newChevrons = numbered.chevrons.slice(1);
        const prevNum     = prevNumberAtDepth(doc, sel.active.line, newChevrons);
        eb.replace(lineRange, `${newChevrons} ${prevNum + 1}. ${numbered.content}`);
        return;
    }
    const bullet = parseBullet(lineText, prefix);
    if (bullet && bullet.chevrons.length > 2) {
        eb.replace(lineRange, `${bullet.chevrons.slice(1)} ${prefix} ${bullet.content}`);
    }
}

/** Handles Tab — promotes chevron items, falls through for non-chevron lines */
export async function onTab(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const { prefix } = getConfig();
    const chevronSelections = editor.selections.filter(s => {
        const text = editor.document.lineAt(s.active.line).text;
        return parseBullet(text, prefix) !== null || parseNumbered(text) !== null;
    });
    if (chevronSelections.length === 0) { await vscode.commands.executeCommand('tab'); return; }
    await editor.edit((eb: EditBuilder) => {
        for (const sel of chevronSelections) { applyIndent(eb, editor.document, sel, prefix); }
    });
}

/** Handles Shift+Tab — demotes chevron items, falls through for non-chevron lines */
export async function onShiftTab(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const { prefix } = getConfig();
    const chevronSelections = editor.selections.filter(s => {
        const text = editor.document.lineAt(s.active.line).text;
        return parseBullet(text, prefix) !== null || parseNumbered(text) !== null;
    });
    if (chevronSelections.length === 0) { await vscode.commands.executeCommand('outdent'); return; }
    await editor.edit((eb: EditBuilder) => {
        for (const sel of chevronSelections) { applyDedent(eb, editor.document, sel, prefix); }
    });
}
