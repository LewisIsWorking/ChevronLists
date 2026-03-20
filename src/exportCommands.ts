import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered } from './patterns';
import { findHeaderAbove, getSectionRange } from './documentUtils';

/** Strips chevron prefix from a bullet item returning plain text e.g. ">> - foo" → "- foo" */
function bulletToMarkdown(text: string, prefix: string): string | null {
    const bullet = parseBullet(text, prefix);
    if (!bullet) { return null; }
    const depth = bullet.chevrons.length - 2; // >> = depth 0, >>> = depth 1 etc.
    const indent = '  '.repeat(depth);
    return `${indent}- ${bullet.content}`;
}

/** Strips chevron prefix from a numbered item e.g. ">> 1. foo" → "1. foo" */
function numberedToMarkdown(text: string): string | null {
    const numbered = parseNumbered(text);
    if (!numbered) { return null; }
    const depth = numbered.chevrons.length - 2;
    const indent = '  '.repeat(depth);
    return `${indent}${numbered.num}. ${numbered.content}`;
}

/** Copies the current section as standard markdown (heading + list items) */
export async function onCopySectionAsMarkdown(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const { prefix }     = getConfig();
    const headerLine     = findHeaderAbove(editor.document, editor.selection.active.line);
    if (headerLine < 0) { return; }

    const headerText = editor.document.lineAt(headerLine).text;
    const heading    = `## ${headerText.replace(/^> /, '')}`;
    const [, end]    = getSectionRange(editor.document, headerLine);
    const lines: string[] = [heading, ''];

    for (let i = headerLine + 1; i <= end; i++) {
        const text    = editor.document.lineAt(i).text;
        const md      = bulletToMarkdown(text, prefix) ?? numberedToMarkdown(text);
        if (md !== null) { lines.push(md); }
    }

    await vscode.env.clipboard.writeText(lines.join('\n'));
    vscode.window.showInformationMessage('Chevron Lists: Section copied as Markdown');
}

/** Copies the current section as plain text (header + item text only, no prefixes) */
export async function onCopySectionAsPlainText(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const { prefix }     = getConfig();
    const headerLine     = findHeaderAbove(editor.document, editor.selection.active.line);
    if (headerLine < 0) { return; }

    const headerText = editor.document.lineAt(headerLine).text.replace(/^> /, '');
    const [, end]    = getSectionRange(editor.document, headerLine);
    const lines: string[] = [headerText, ''];

    for (let i = headerLine + 1; i <= end; i++) {
        const text     = editor.document.lineAt(i).text;
        const bullet   = parseBullet(text, prefix);
        const numbered = parseNumbered(text);
        if (bullet)   { lines.push(bullet.content); }
        else if (numbered) { lines.push(numbered.content); }
    }

    await vscode.env.clipboard.writeText(lines.join('\n'));
    vscode.window.showInformationMessage('Chevron Lists: Section copied as plain text');
}
