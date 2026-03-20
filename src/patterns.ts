import type { BulletMatch, NumberedMatch } from './types';

/** Matches a >> 1. numbered item at any depth — captures chevrons, number, content */
export const NUMBERED_ITEM_RE = /^(>{2,}) (\d+)\. (.*)$/;

/** Matches a > header line (single >, not >>) */
export const HEADER_RE = /^> [^>]/;

/** Escapes special regex characters in a string */
export function escapeRegex(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Builds the bullet item regex for the configured prefix e.g. ">> - content" */
export function bulletRE(prefix: string): RegExp {
    return new RegExp(`^(>{2,}) ${escapeRegex(prefix)} (.*)$`);
}

/** Parses a bullet item line, returning null if it does not match */
export function parseBullet(line: string, prefix: string): BulletMatch | null {
    const match = line.match(bulletRE(prefix));
    if (!match) { return null; }
    return { chevrons: match[1], content: match[2] };
}

/** Parses a numbered item line, returning null if it does not match */
export function parseNumbered(line: string): NumberedMatch | null {
    const match = line.match(NUMBERED_ITEM_RE);
    if (!match) { return null; }
    return { chevrons: match[1], num: parseInt(match[2], 10), content: match[3] };
}

/** Returns true if the line is a chevron header (single >) */
export function isHeader(line: string): boolean {
    return HEADER_RE.test(line);
}

/** Regex matching [LABEL] spans in item content */
export const LABEL_RE = /\[([^\]]*)\]/g;

/** Returns all [label] spans in a content string with their positions */
export function extractLabels(content: string): Array<{ text: string; start: number; end: number }> {
    const results: Array<{ text: string; start: number; end: number }> = [];
    for (const match of content.matchAll(LABEL_RE)) {
        results.push({ text: match[0], start: match.index!, end: match.index! + match[0].length });
    }
    return results;
}

/** Title-cases a string — first letter of each word capitalised */
export function toTitleCase(s: string): string {
    return s.replace(/\b\w/g, c => c.toUpperCase());
}

/** Toggles ~~strikethrough~~ on a content string */
export function toggleStrikethrough(content: string): string {
    if (content.startsWith('~~') && content.endsWith('~~') && content.length > 4) {
        return content.slice(2, -2);
    }
    return `~~${content}~~`;
}

/** Replaces @YYYY-MM-DD in item content with a new date string */
export function replaceDate(content: string, newDate: string): string {
    return content.replace(/@\d{4}-\d{2}-\d{2}/, `@${newDate}`);
}

/** Strips @YYYY-MM-DD from item content */
export function stripDate(content: string): string {
    return content.replace(/\s*@\d{4}-\d{2}-\d{2}/, '').trim();
}

/** Adds [x] done marker to item content if not already present */
export function markDone(content: string): string {
    if (content.startsWith('[ ]')) { return content.replace('[ ]', '[x]'); }
    if (content.startsWith('[x]')) { return content; }
    return `[x] ${content}`;
}

/** Applies a numeric offset to a numbered item line; returns null if result < 1 */
export function offsetNumberedLine(text: string, offset: number): string | null {
    const m = text.match(/^(>{2,}) (\d+)\. (.*)$/);
    if (!m) { return null; }
    const newNum = Number(m[2]) + offset;
    if (newNum < 1) { return null; }
    return `${m[1]} ${newNum}. ${m[3]}`;
}

/** Converts a list of content rows to a markdown table string */
export function toMarkdownTable(rows: Array<{ num: number; content: string }>): string {
    return [
        '| # | Content |',
        '|---|---------|',
        ...rows.map(r => `| ${r.num} | ${r.content.replace(/\|/g, '\\|')} |`),
    ].join('\n');
}
