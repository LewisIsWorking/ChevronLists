import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered, isEscalatable } from './patterns';

/** Applies overdue escalation across the document if the setting is enabled */
export function applyOverdueEscalation(editor: vscode.TextEditor): void {
    const cfg = vscode.workspace.getConfiguration('chevron-lists');
    if (!cfg.get<boolean>('escalateOverdue', false)) { return; }

    const { prefix } = getConfig();
    const doc        = editor.document;
    const today      = new Date();
    const edits: Array<{ line: number; newText: string }> = [];

    for (let i = 0; i < doc.lineCount; i++) {
        const text    = doc.lineAt(i).text;
        const bullet  = parseBullet(text, prefix);
        const numbered = parseNumbered(text);
        const content  = bullet?.content ?? numbered?.content ?? null;
        if (!content) { continue; }
        if (content.startsWith('!!!')) { continue; } // already urgent
        if (!isEscalatable(content, today)) { continue; }
        const chevrons   = bullet?.chevrons ?? numbered!.chevrons;
        const num        = numbered?.num ?? null;
        const newContent = `!!! ${content}`;
        edits.push({
            line:    i,
            newText: num !== null
                ? `${chevrons} ${num}. ${newContent}`
                : `${chevrons} ${prefix} ${newContent}`,
        });
    }

    if (edits.length === 0) { return; }
    const we = new vscode.WorkspaceEdit();
    for (const e of edits) { we.replace(doc.uri, doc.lineAt(e.line).range, e.newText); }
    vscode.workspace.applyEdit(we);
}
