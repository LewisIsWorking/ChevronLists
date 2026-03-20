import * as vscode from 'vscode';
import { getConfig } from './config';
import { isHeader, parseBullet, parseNumbered } from './patterns';

let statusBarItem: vscode.StatusBarItem | undefined;

/** Creates and returns the status bar item (call once in activate) */
export function createStatusBar(): vscode.StatusBarItem {
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    return statusBarItem;
}

/** Updates the status bar with section and item counts for the active markdown editor */
export function updateStatusBar(editor?: vscode.TextEditor): void {
    if (!statusBarItem) { return; }
    if (!editor || editor.document.languageId !== 'markdown') {
        statusBarItem.hide();
        return;
    }
    const { prefix } = getConfig();
    let sections = 0;
    let items    = 0;
    for (let i = 0; i < editor.document.lineCount; i++) {
        const text = editor.document.lineAt(i).text;
        if (isHeader(text)) {
            sections++;
        } else if (parseBullet(text, prefix) || parseNumbered(text)) {
            items++;
        }
    }
    statusBarItem.text    = `$(list-unordered) ${sections} sections  $(symbol-enum-member) ${items} items`;
    statusBarItem.tooltip = 'Chevron Lists: sections and items in this file';
    statusBarItem.show();
}
