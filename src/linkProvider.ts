import * as vscode from 'vscode';
import { extractLinks, collectLinks, findHeaderLine } from './linkParser';

/** Provides hover previews for [[SectionName]] links */
export class ChevronLinkHoverProvider implements vscode.HoverProvider {
    provideHover(
        document: vscode.TextDocument,
        position: vscode.Position
    ): vscode.Hover | undefined {
        const line = document.lineAt(position.line).text;
        for (const link of extractLinks(line)) {
            if (position.character < link.startChar || position.character > link.endChar) { continue; }
            const targetLine = findHeaderLine(document, link.target);
            if (targetLine < 0) {
                return new vscode.Hover(
                    new vscode.MarkdownString(`⚠️ Section **${link.target}** not found in this file`)
                );
            }
            // Collect up to 5 lines of preview after the header
            const previewLines: string[] = [`**→ ${link.target}**`, ''];
            for (let i = targetLine + 1; i < Math.min(targetLine + 6, document.lineCount); i++) {
                const t = document.lineAt(i).text;
                if (t.startsWith('> ') && !t.startsWith('>> ')) { break; }
                if (t.trim()) { previewLines.push(`\`${t}\``); }
            }
            return new vscode.Hover(new vscode.MarkdownString(previewLines.join('\n')));
        }
        return undefined;
    }
}

/** Provides go-to-definition for [[SectionName]] links */
export class ChevronLinkDefinitionProvider implements vscode.DefinitionProvider {
    provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position
    ): vscode.Location | undefined {
        const line = document.lineAt(position.line).text;
        for (const link of extractLinks(line)) {
            if (position.character < link.startChar || position.character > link.endChar) { continue; }
            const targetLine = findHeaderLine(document, link.target);
            if (targetLine >= 0) {
                return new vscode.Location(document.uri, new vscode.Position(targetLine, 0));
            }
        }
        return undefined;
    }
}

/** Command: jumps to the section linked under the cursor */
export async function onGoToLinkedSection(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const { document, selection } = editor;
    const line = document.lineAt(selection.active.line).text;

    for (const link of extractLinks(line)) {
        if (selection.active.character < link.startChar || selection.active.character > link.endChar) { continue; }
        const targetLine = findHeaderLine(document, link.target);
        if (targetLine < 0) {
            vscode.window.showWarningMessage(`CL: Section "${link.target}" not found in this file`);
            return;
        }
        const pos = new vscode.Position(targetLine, 0);
        editor.selection = new vscode.Selection(pos, pos);
        editor.revealRange(new vscode.Range(pos, pos), vscode.TextEditorRevealType.InCenterIfOutsideViewport);
        return;
    }
    vscode.window.showInformationMessage('CL: No [[link]] found at cursor position');
}

/** Returns a DocumentLink[] for all [[links]] in the document (enables Ctrl+click) */
export class ChevronDocumentLinkProvider implements vscode.DocumentLinkProvider {
    provideDocumentLinks(document: vscode.TextDocument): vscode.DocumentLink[] {
        return collectLinks(document).map(link => {
            const range = new vscode.Range(link.line, link.startChar, link.line, link.endChar);
            const dl    = new vscode.DocumentLink(range);
            dl.tooltip  = `Go to section: ${link.target}`;
            return dl;
        });
    }

    resolveDocumentLink(link: vscode.DocumentLink): vscode.DocumentLink {
        return link;
    }
}
