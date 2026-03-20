import * as vscode from 'vscode';
import { isHeader, parseBullet, parseNumbered } from './patterns';
import { getConfig } from './config';
import { getSectionRange } from './documentUtils';
import { parseCheck } from './checkParser';

/** Provides hover tooltips on chevron headers showing section stats */
export class ChevronHoverProvider implements vscode.HoverProvider {
    provideHover(
        document: vscode.TextDocument,
        position: vscode.Position
    ): vscode.Hover | undefined {
        if (!isHeader(document.lineAt(position.line).text)) { return; }

        const { prefix }    = getConfig();
        const [start, end]  = getSectionRange(document, position.line);
        let itemCount = 0, wordCount = 0, doneCount = 0, totalChecks = 0;

        for (let i = start + 1; i <= end; i++) {
            const text    = document.lineAt(i).text;
            const bullet  = parseBullet(text, prefix);
            const numbered = parseNumbered(text);
            const content  = bullet?.content ?? numbered?.content ?? null;
            if (content === null) { continue; }

            itemCount++;
            wordCount += content.trim().split(/\s+/).filter(Boolean).length;

            const check = parseCheck(content);
            if (check) {
                totalChecks++;
                if (check.state === 'done') { doneCount++; }
            }
        }

        const checkLine = totalChecks > 0
            ? `\n- Progress: ${doneCount}/${totalChecks} done`
            : '';

        const md = new vscode.MarkdownString(
            `**Chevron Section**\n\n- Items: ${itemCount}\n- Words: ${wordCount}${checkLine}`
        );
        return new vscode.Hover(md);
    }
}
