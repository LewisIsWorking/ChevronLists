import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered } from './patterns';
import { findHeaderAbove, getSectionRange } from './documentUtils';

type EditBuilder = vscode.TextEditorEdit;

function getLines(doc: vscode.TextDocument, start: number, end: number): string[] {
    return Array.from({ length: end - start + 1 }, (_, i) => doc.lineAt(start + i).text);
}

/** Selects all chevron item lines under the nearest header above the cursor */
export function onSelectSectionItems(): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const { prefix } = getConfig();
    const headerLine = findHeaderAbove(editor.document, editor.selection.active.line);
    if (headerLine < 0) { return; }
    const [, end] = getSectionRange(editor.document, headerLine);
    const selections: vscode.Selection[] = [];
    for (let i = headerLine + 1; i <= end; i++) {
        const text = editor.document.lineAt(i).text;
        if (parseBullet(text, prefix) || parseNumbered(text)) {
            const line = editor.document.lineAt(i);
            selections.push(new vscode.Selection(line.range.start, line.range.end));
        }
    }
    if (selections.length > 0) { editor.selections = selections; }
}

/** Deletes the entire section (header + items) containing the cursor */
export async function onDeleteSection(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const headerLine = findHeaderAbove(editor.document, editor.selection.active.line);
    if (headerLine < 0) { return; }
    const [start, end] = getSectionRange(editor.document, headerLine);
    const deleteStart  = new vscode.Position(start, 0);
    const deleteEnd    = end + 1 < editor.document.lineCount
        ? new vscode.Position(end + 1, 0)
        : new vscode.Position(end, editor.document.lineAt(end).text.length);
    await editor.edit((eb: EditBuilder) => eb.delete(new vscode.Range(deleteStart, deleteEnd)));
}

/** Duplicates the entire section containing the cursor, inserting it below */
export async function onDuplicateSection(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const headerLine = findHeaderAbove(editor.document, editor.selection.active.line);
    if (headerLine < 0) { return; }
    const [start, end] = getSectionRange(editor.document, headerLine);
    const lines        = getLines(editor.document, start, end);
    await editor.edit((eb: EditBuilder) =>
        eb.insert(new vscode.Position(end + 1, 0), lines.join('\n') + '\n'));
}

/** Swaps the section containing the cursor with the section immediately above it */
export async function onMoveSectionUp(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const doc        = editor.document;
    const headerLine = findHeaderAbove(doc, editor.selection.active.line);
    if (headerLine <= 0) { return; }
    const prevHeader = findHeaderAbove(doc, headerLine - 1);
    if (prevHeader < 0) { return; }
    const [curStart, curEnd]   = getSectionRange(doc, headerLine);
    const [prevStart, prevEnd] = getSectionRange(doc, prevHeader);
    const curLines  = getLines(doc, curStart, curEnd);
    const prevLines = getLines(doc, prevStart, prevEnd);
    await editor.edit((eb: EditBuilder) => {
        const range = new vscode.Range(
            new vscode.Position(prevStart, 0),
            new vscode.Position(curEnd, doc.lineAt(curEnd).text.length)
        );
        eb.replace(range, [...curLines, ...prevLines].join('\n'));
    });
    // Move cursor to follow the section — it now starts at prevStart
    const newPos = new vscode.Position(prevStart, 0);
    editor.selection = new vscode.Selection(newPos, newPos);
    editor.revealRange(new vscode.Range(newPos, newPos), vscode.TextEditorRevealType.InCenterIfOutsideViewport);
}

/** Swaps the section containing the cursor with the section immediately below it */
export async function onMoveSectionDown(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const doc        = editor.document;
    const headerLine = findHeaderAbove(doc, editor.selection.active.line);
    if (headerLine < 0) { return; }
    const [curStart, curEnd] = getSectionRange(doc, headerLine);
    if (curEnd + 1 >= doc.lineCount) { return; }
    let nextHeader = -1;
    for (let i = curEnd + 1; i < doc.lineCount; i++) {
        if (doc.lineAt(i).text.match(/^> [^>]/)) { nextHeader = i; break; }
    }
    if (nextHeader < 0) { return; }
    const [nextStart, nextEnd] = getSectionRange(doc, nextHeader);
    const curLines  = getLines(doc, curStart, curEnd);
    const nextLines = getLines(doc, nextStart, nextEnd);
    await editor.edit((eb: EditBuilder) => {
        const range = new vscode.Range(
            new vscode.Position(curStart, 0),
            new vscode.Position(nextEnd, doc.lineAt(nextEnd).text.length)
        );
        eb.replace(range, [...nextLines, ...curLines].join('\n'));
    });
    // Move cursor to follow the section — it now starts after the next section
    const newLine = curStart + (nextEnd - nextStart + 1);
    const newPos  = new vscode.Position(newLine, 0);
    editor.selection = new vscode.Selection(newPos, newPos);
    editor.revealRange(new vscode.Range(newPos, newPos), vscode.TextEditorRevealType.InCenterIfOutsideViewport);
}
