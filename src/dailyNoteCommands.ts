import * as vscode from 'vscode';
import * as path from 'path';
import { getConfig } from './config';
import { formatDate } from './patterns';

/** Command: opens or creates a daily note for today */
export async function onOpenDailyNote(): Promise<void> {
    const { dailyNotesFolder, prefix } = getConfig();
    const today    = formatDate(new Date());
    const fileName = `${today}.md`;

    // Resolve folder — use workspace root if not configured
    const roots = vscode.workspace.workspaceFolders;
    const base  = dailyNotesFolder
        ? (path.isAbsolute(dailyNotesFolder)
            ? dailyNotesFolder
            : roots ? path.join(roots[0].uri.fsPath, dailyNotesFolder) : dailyNotesFolder)
        : (roots ? roots[0].uri.fsPath : undefined);

    if (!base) {
        vscode.window.showInformationMessage('CL: Open a workspace folder first, or set chevron-lists.dailyNotesFolder');
        return;
    }

    const filePath = path.join(base, fileName);
    const fileUri  = vscode.Uri.file(filePath);

    // Create file if it doesn't exist
    try {
        await vscode.workspace.fs.stat(fileUri);
    } catch {
        const template = [
            `> ${today}`,
            `>> ${prefix} `,
            '',
        ].join('\n');
        await vscode.workspace.fs.writeFile(fileUri, Buffer.from(template, 'utf-8'));
    }

    const doc    = await vscode.workspace.openTextDocument(fileUri);
    const editor = await vscode.window.showTextDocument(doc);

    // Place cursor on the first blank item
    for (let i = 0; i < doc.lineCount; i++) {
        if (doc.lineAt(i).text.endsWith(`${prefix} `)) {
            const pos = new vscode.Position(i, doc.lineAt(i).text.length);
            editor.selection = new vscode.Selection(pos, pos);
            break;
        }
    }
}
