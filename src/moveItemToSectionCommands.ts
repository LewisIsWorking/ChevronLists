import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered, isHeader } from './patterns';
import { findHeaderAbove, getSectionRange } from './documentUtils';

interface SectionPickItem extends vscode.QuickPickItem { headerLine: number; }

/** Command: moves the item at the cursor to a chosen section */
export async function onMoveItemToSection(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }

    const { prefix } = getConfig();
    const doc        = editor.document;
    const lineIndex  = editor.selection.active.line;
    const text       = doc.lineAt(lineIndex).text;

    if (!parseBullet(text, prefix) && !parseNumbered(text)) {
        vscode.window.showInformationMessage('CL: Place cursor on a chevron item to move it');
        return;
    }

    const srcHeader = findHeaderAbove(doc, lineIndex);

    // Build section list excluding the source section
    const sections: SectionPickItem[] = [];
    for (let i = 0; i < doc.lineCount; i++) {
        const t = doc.lineAt(i).text;
        if (isHeader(t) && i !== srcHeader) {
            sections.push({ label: t.replace(/^> /, ''), headerLine: i });
        }
    }

    if (sections.length === 0) {
        vscode.window.showInformationMessage('CL: No other sections found to move the item to');
        return;
    }

    const picked = await vscode.window.showQuickPick(sections, { placeHolder: 'Move item to section…' });
    if (!picked) { return; }

    const itemText   = text;
    const [, dstEnd] = getSectionRange(doc, picked.headerLine);
    const insertPos  = new vscode.Position(dstEnd + 1, 0);
    const srcLine    = doc.lineAt(lineIndex);

    await editor.edit(eb => {
        eb.delete(srcLine.rangeIncludingLineBreak);
        eb.insert(insertPos, itemText + '\n');
    });

    vscode.window.showInformationMessage(`CL: Moved item to "${picked.label}"`);
}
