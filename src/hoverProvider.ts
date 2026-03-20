import * as vscode from 'vscode';
import { isHeader, parseBullet, parseNumbered } from './patterns';
import { getConfig } from './config';
import { getSectionRange } from './documentUtils';

/** Provides hover tooltips on chevron headers showing section item/word counts */
export class ChevronHoverProvider implements vscode.HoverProvider {
    provideHover(
        document: vscode.TextDocument,
        position: vscode.Position
    ): vscode.Hover | undefined {
        if (!isHeader(document.lineAt(position.line).text)) { return; }

        const { prefix }      = getConfig();
        const [start, end]    = getSectionRange(document, position.line);
        let itemCount = 0;
        let wordCount = 0;

        for (let i = start + 1; i <= end; i++) {
            const text    = document.lineAt(i).text;
            const bullet  = parseBullet(text, prefix);
            const numbered = parseNumbered(text);

            if (bullet) {
                itemCount++;
                wordCount += bullet.content.trim().split(/\s+/).filter(Boolean).length;
            } else if (numbered) {
                itemCount++;
                wordCount += numbered.content.trim().split(/\s+/).filter(Boolean).length;
            }
        }

        const md = new vscode.MarkdownString(
            `**Chevron Section**\n\n- Items: ${itemCount}\n- Words: ${wordCount}`
        );
        return new vscode.Hover(md);
    }
}
