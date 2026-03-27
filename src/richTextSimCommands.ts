import * as vscode from 'vscode';
import { toggleWrap, applyUnicodeUnderline, removeUnicodeUnderline, isUnicodeUnderlined } from './patterns';

/** Applies a rich text transform to the current selection or word at cursor */
async function applyRichText(
    style: 'bold' | 'italic' | 'mono' | 'strike' | 'underline'
): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }

    const sel  = editor.selection;
    const doc  = editor.document;
    const range = sel.isEmpty
        ? doc.getWordRangeAtPosition(sel.active) ?? sel
        : new vscode.Range(sel.start, sel.end);
    const text = doc.getText(range);
    if (!text.trim()) { return; }

    let newText: string;
    if (style === 'underline') {
        newText = isUnicodeUnderlined(text) ? removeUnicodeUnderline(text) : applyUnicodeUnderline(text);
    } else {
        newText = toggleWrap(text, style);
    }

    await editor.edit(eb => eb.replace(range, newText));
}

export const onBoldText      = () => applyRichText('bold');
export const onItalicText    = () => applyRichText('italic');
export const onUnderlineText = () => applyRichText('underline');
export const onMonoText      = () => applyRichText('mono');
export const onStrikeText    = () => applyRichText('strike');
