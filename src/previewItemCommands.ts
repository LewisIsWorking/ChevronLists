import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered } from './patterns';
import { parseCheck } from './checkParser';
import { extractTags } from './tagParser';
import { parsePriority, PRIORITY_LABELS } from './priorityParser';
import { extractDate, isOverdue } from './dueDateParser';
import { parseEstimate } from './estimateParser';
import { parseStar } from './starParser';
import { parseColourLabel } from './colourLabelParser';
import { parseFlag } from './flagParser';
import { parseComment } from './commentParser';
import { parseRecurrence } from './recurrenceParser';
import { parseVote } from './voteParser';

/** Command: shows a rich preview notification for the item at the cursor */
export async function onPreviewItem(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }

    const { prefix } = getConfig();
    const doc        = editor.document;
    const lineIndex  = editor.selection.active.line;
    const text       = doc.lineAt(lineIndex).text;
    const bullet     = parseBullet(text, prefix);
    const numbered   = parseNumbered(text);
    const content    = bullet?.content ?? numbered?.content;

    if (!content) {
        vscode.window.showInformationMessage('CL: Place cursor on a chevron item to preview it');
        return;
    }

    const parts: string[] = [];
    const check     = parseCheck(content);
    const priority  = parsePriority(check ? check.contentWithout : content);
    const rawText   = priority ? priority.contentWithout : (check ? check.contentWithout : content);
    const dateMatch = extractDate(rawText);
    const estimate  = parseEstimate(rawText);
    const recur     = parseRecurrence(rawText);
    const star      = parseStar(rawText);
    const colour    = parseColourLabel(rawText);
    const flag      = parseFlag(rawText);
    const comment   = parseComment(rawText);
    const vote      = parseVote(rawText);
    const tags      = extractTags(rawText);

    if (check)    { parts.push(check.state === 'done' ? '✅ Done' : '⬜ Todo'); }
    if (star)     { parts.push('⭐ Starred'); }
    if (flag)     { parts.push('❓ Flagged'); }
    if (priority) { parts.push(`${priority.level === 3 ? '🔴' : priority.level === 2 ? '🟡' : '🔵'} ${PRIORITY_LABELS[priority.level]}`); }
    if (colour)   { parts.push(`🎨 ${colour}`); }
    if (dateMatch){ parts.push(`📅 ${dateMatch.dateStr}${isOverdue(dateMatch.dateStr) ? ' ⚠️ OVERDUE' : ''}`); }
    if (estimate) { parts.push(`⏱ ~${estimate.display}`); }
    if (recur)    { parts.push(`🔁 @${recur.type}`); }
    if (vote)     { parts.push(`👍 +${vote.count}`); }
    if (tags.length > 0) { parts.push(`🏷 ${tags.map(t => `#${t}`).join(' ')}`); }
    if (comment)  { parts.push(`💬 ${comment.comment}`); }

    const depth = (bullet?.chevrons ?? numbered?.chevrons ?? '>>').length - 2;
    const type  = numbered ? `#${numbered.num}` : '•';
    const clean = comment ? comment.body : (star ? star.contentWithout : (flag ? flag.contentWithout : (colour ? rawText.replace(/\{[a-z]+\}\s*/, '') : rawText)));

    const summary = [`${type} [depth ${depth}] ${clean}`, ...parts].join('\n');
    vscode.window.showInformationMessage(summary);
}
