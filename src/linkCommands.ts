import * as vscode from 'vscode';
import { extractLinks, resolveLink, collectLinks } from './linkParser';
import { getConfig } from './config';
import { parseBullet, parseNumbered } from './patterns';

/** Command: jumps to the section referenced by [[...]] at or near the cursor */
export async function onGoToLinkedSection(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }

    const doc    = editor.document;
    const cursor = editor.selection.active;
    const text   = doc.lineAt(cursor.line).text;
    const links  = extractLinks(text);

    if (links.length === 0) {
        vscode.window.showInformationMessage('CL: No [[link]] found on this line');
        return;
    }

    // Find the link the cursor is inside, or use the first one
    const active = links.find(l => cursor.character >= l.charStart && cursor.character <= l.charEnd)
        ?? links[0];

    const targetLine = resolveLink(active.target, doc);
    if (targetLine < 0) {
        vscode.window.showWarningMessage(`CL: Section "${active.target}" not found in this file`);
        return;
    }

    const pos = new vscode.Position(targetLine, 0);
    editor.selection = new vscode.Selection(pos, pos);
    editor.revealRange(new vscode.Range(pos, pos), vscode.TextEditorRevealType.InCenterIfOutsideViewport);
}

/** Hover provider — shows a preview of the linked section on [[...]] hover */
export class ChevronLinkHoverProvider implements vscode.HoverProvider {
    provideHover(document: vscode.TextDocument, position: vscode.Position): vscode.Hover | null {
        const text  = document.lineAt(position.line).text;
        const links = extractLinks(text);

        const hovered = links.find(l =>
            position.character >= l.charStart && position.character <= l.charEnd
        );
        if (!hovered) { return null; }

        const targetLine = resolveLink(hovered.target, document);
        if (targetLine < 0) {
            return new vscode.Hover(
                new vscode.MarkdownString(`⚠️ Section **${hovered.target}** not found in this file`)
            );
        }

        const { prefix } = getConfig();
        const lines: string[] = [`**→ ${hovered.target}**`, ''];
        const limit = Math.min(targetLine + 8, document.lineCount);
        for (let i = targetLine + 1; i < limit; i++) {
            const line    = document.lineAt(i).text;
            const bullet  = parseBullet(line, prefix);
            const numbered = parseNumbered(line);
            if (bullet)  { lines.push(`- ${bullet.content}`); }
            else if (numbered) { lines.push(`${numbered.num}. ${numbered.content}`); }
        }
        if (targetLine + 8 < document.lineCount) { lines.push('…'); }

        return new vscode.Hover(new vscode.MarkdownString(lines.join('\n')));
    }
}

/** DocumentLinkProvider — makes [[...]] links clickable in the editor */
export class ChevronDocumentLinkProvider implements vscode.DocumentLinkProvider {
    provideDocumentLinks(document: vscode.TextDocument): vscode.DocumentLink[] {
        return collectLinks(document).filter(l => l.resolvedLine >= 0).map(l => {
            const range = new vscode.Range(l.line, l.charStart, l.line, l.charEnd);
            const link  = new vscode.DocumentLink(range);
            // Use a command URI so clicking runs our navigation command
            link.tooltip = `Go to section: ${l.target}`;
            return link;
        });
    }
}
