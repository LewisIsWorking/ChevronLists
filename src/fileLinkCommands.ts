import * as vscode from 'vscode';
import * as path from 'path';
import { extractFileLinks } from './fileLinkParser';

/** Finds the filename under the cursor from a [[file:...]] link */
function getFileLinkAtCursor(editor: vscode.TextEditor): string | null {
    const lineIndex = editor.selection.active.line;
    const col       = editor.selection.active.character;
    const links     = extractFileLinks(editor.document.lineAt(lineIndex).text, lineIndex);
    const link      = links.find(l => col >= l.start && col <= l.end);
    return link?.filename ?? null;
}

/** Resolves a filename relative to the current document */
function resolveFile(document: vscode.TextDocument, filename: string): vscode.Uri {
    const dir = path.dirname(document.fileName);
    return vscode.Uri.file(path.join(dir, filename));
}

/** Command: opens the linked file under the cursor */
export async function onGoToLinkedFile(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }

    const filename = getFileLinkAtCursor(editor);
    if (!filename) { vscode.window.showInformationMessage('CL: No [[file:...]] link found at cursor'); return; }

    const uri = resolveFile(editor.document, filename);
    try {
        await vscode.window.showTextDocument(await vscode.workspace.openTextDocument(uri));
    } catch {
        vscode.window.showErrorMessage(`CL: Could not open file "${filename}"`);
    }
}

/** Hover provider: shows first line of linked file on hover */
export class ChevronFileLinkHoverProvider implements vscode.HoverProvider {
    async provideHover(document: vscode.TextDocument, position: vscode.Position): Promise<vscode.Hover | undefined> {
        const links = extractFileLinks(document.lineAt(position.line).text, position.line);
        const link  = links.find(l => position.character >= l.start && position.character <= l.end);
        if (!link) { return; }

        const uri = resolveFile(document, link.filename);
        try {
            const linkedDoc  = await vscode.workspace.openTextDocument(uri);
            const firstLines = Array.from({ length: Math.min(5, linkedDoc.lineCount) }, (_, i) =>
                linkedDoc.lineAt(i).text
            ).filter(Boolean).join('\n');
            const md = new vscode.MarkdownString(`**${link.filename}**\n\n\`\`\`\n${firstLines}\n\`\`\``);
            return new vscode.Hover(md);
        } catch {
            return new vscode.Hover(new vscode.MarkdownString(`**${link.filename}** *(file not found)*`));
        }
    }
}
