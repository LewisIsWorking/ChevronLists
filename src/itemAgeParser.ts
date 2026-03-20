import type { LineReader } from './types';
import { parseBullet, parseNumbered } from './patterns';

/** Regex matching @created:YYYY-MM-DD in item content */
export const CREATED_RE = /@created:(\d{4}-\d{2}-\d{2})/;

/** Parses a creation date from item content */
export function parseCreatedDate(content: string): string | null {
    return content.match(CREATED_RE)?.[1] ?? null;
}

/** Returns the age in days of a YYYY-MM-DD date string from today */
export function ageInDays(dateStr: string, today: Date = new Date()): number {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return Math.floor((todayMidnight.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
}

export interface AgedItem {
    content:   string;
    dateStr:   string;
    ageDays:   number;
    section:   string;
    line:      number;
}

/** Collects all items with @created dates, sorted oldest first */
export function collectAgedItems(doc: LineReader, prefix: string, today: Date = new Date()): AgedItem[] {
    const results: AgedItem[] = [];
    let section = '';
    for (let i = 0; i < doc.lineCount; i++) {
        const text = doc.lineAt(i).text;
        if (text.startsWith('> ') && !text.startsWith('>> ')) { section = text.replace(/^> /, ''); continue; }
        const bullet  = parseBullet(text, prefix);
        const numbered = parseNumbered(text);
        const content  = bullet?.content ?? numbered?.content ?? null;
        if (!content) { continue; }
        const dateStr = parseCreatedDate(content);
        if (!dateStr) { continue; }
        results.push({ content: content.replace(CREATED_RE, '').trim(), dateStr, ageDays: ageInDays(dateStr, today), section, line: i });
    }
    return results.sort((a, b) => b.ageDays - a.ageDays);
}
