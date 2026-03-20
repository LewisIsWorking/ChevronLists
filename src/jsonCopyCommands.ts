import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered } from './patterns';
import { getSectionRange, findHeaderAbove } from './documentUtils';
import { extractTags } from './tagParser';
import { parseCheck } from './checkParser';
import { parsePriority } from './priorityParser';
import { extractDate } from './dueDateParser';
import { parseEstimate } from './estimateParser';
import { parseVote } from './voteParser';
import { parseStar } from './starParser';
import { parseColourLabel } from './colourLabelParser';
import { parseFlag } from './flagParser';
import { parseComment } from './commentParser';
import { parseRating } from './ratingParser';

/** Serialises the current section's items to a JSON array and copies to clipboard */
export async function onCopySectionAsJson(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }

    const { prefix }  = getConfig();
    const doc         = editor.document;
    const headerLine  = findHeaderAbove(doc, editor.selection.active.line);
    if (headerLine < 0) { vscode.window.showInformationMessage('CL: No section found at cursor'); return; }

    const sectionName = doc.lineAt(headerLine).text.replace(/^> /, '');
    const [, end]     = getSectionRange(doc, headerLine);
    const items: object[] = [];

    for (let i = headerLine + 1; i <= end; i++) {
        const text    = doc.lineAt(i).text;
        const bullet  = parseBullet(text, prefix);
        const numbered = parseNumbered(text);
        if (!bullet && !numbered) { continue; }
        const chevrons = bullet?.chevrons ?? numbered!.chevrons;
        const content  = bullet?.content  ?? numbered!.content;
        const depth    = chevrons.length - 2;
        const check    = parseCheck(content);
        const prio     = parsePriority(content);
        const date     = extractDate(content);
        const est      = parseEstimate(content);
        const vote     = parseVote(content);
        const star     = parseStar(content);
        const colour   = parseColourLabel(content);
        const flag     = parseFlag(content);
        const comment  = parseComment(content);
        const rating   = parseRating(content);
        items.push({
            depth,
            type:      numbered ? 'numbered' : 'bullet',
            num:       numbered?.num ?? null,
            content:   content.trim(),
            done:      check?.state === 'done' || false,
            priority:  prio?.level ?? null,
            dueDate:   date?.dateStr ?? null,
            estimate:  est?.display ?? null,
            votes:     vote?.count ?? null,
            starred:   star !== null,
            colour:    colour ?? null,
            flagged:   flag !== null,
            comment:   comment?.comment ?? null,
            rating:    rating ?? null,
            tags:      extractTags(content),
        });
    }

    const json = JSON.stringify({ section: sectionName, items }, null, 2);
    await vscode.env.clipboard.writeText(json);
    vscode.window.showInformationMessage(`CL: Copied ${items.length} item${items.length === 1 ? '' : 's'} as JSON`);
}
