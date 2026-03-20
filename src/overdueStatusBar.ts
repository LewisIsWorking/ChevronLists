import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered } from './patterns';
import { collectDueDates } from './dueDateParser';

let overdueBarItem: vscode.StatusBarItem | undefined;

/** Creates and returns the overdue status bar item (call once in activate) */
export function createOverdueStatusBar(): vscode.StatusBarItem {
    overdueBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 99);
    overdueBarItem.command = 'chevron-lists.showUpcoming';
    overdueBarItem.tooltip = 'Click to show upcoming due dates';
    return overdueBarItem;
}

/** Updates the overdue badge — shows/hides based on overdue count */
export function updateOverdueStatusBar(editor?: vscode.TextEditor): void {
    if (!overdueBarItem) { return; }
    if (!editor || editor.document.languageId !== 'markdown') {
        overdueBarItem.hide();
        return;
    }
    const { prefix } = getConfig();
    const overdue    = collectDueDates(editor.document, prefix).filter(i => i.overdue).length;
    if (overdue === 0) {
        overdueBarItem.hide();
    } else {
        overdueBarItem.text           = `$(warning) ${overdue} overdue`;
        overdueBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
        overdueBarItem.show();
    }
}
