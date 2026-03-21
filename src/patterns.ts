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

/** Increments the first number found in a content string. Returns null if no number found. */
export function incrementFirstNumber(content: string): string | null {
    const match = content.match(/\d+/);
    if (!match) { return null; }
    const newNum = Number(match[0]) + 1;
    return content.slice(0, match.index!) + newNum + content.slice(match.index! + match[0].length);
}

/** Pure line-by-line diff of two string arrays. Lines prefixed with ' ', '+', or '-' */
export function diffLines(a: string[], b: string[]): string[] {
    const out: string[] = [];
    const maxLen = Math.max(a.length, b.length);
    for (let i = 0; i < maxLen; i++) {
        const lineA = a[i] ?? null;
        const lineB = b[i] ?? null;
        if (lineA === lineB)     { out.push(`  ${lineA ?? ''}`); }
        else if (lineA === null) { out.push(`+ ${lineB}`); }
        else if (lineB === null) { out.push(`- ${lineA}`); }
        else                     { out.push(`- ${lineA}`, `+ ${lineB}`); }
    }
    return out;
}

/** Formats a Date as YYYY-MM-DD */
export function formatDate(d: Date): string {
    return d.toISOString().slice(0, 10);
}

/** Returns the next occurrence of a given day of week (0=Sun, 5=Fri etc.) */
export function nextWeekday(dayOfWeek: number, from: Date = new Date()): Date {
    const d    = new Date(from);
    const diff = (dayOfWeek - d.getDay() + 7) % 7 || 7;
    d.setDate(d.getDate() + diff);
    return d;
}

/** Checks an array of {text, index} item lines for health issues */
export interface HealthIssue { line: number; message: string; kind: string; }

export function checkLinesHealth(
    lines: Array<{ text: string; index: number }>,
    prefix: string,
    stripFn: (content: string) => string,
    extractTagsFn: (content: string) => string[]
): HealthIssue[] {
    const issues: HealthIssue[] = [];
    const seen = new Map<string, number>();
    for (const { text, index } of lines) {
        const bullet   = parseBullet(text, prefix);
        const numbered = parseNumbered(text);
        if (!bullet && !numbered) { continue; }
        const content = bullet?.content ?? numbered!.content;
        const plain   = stripFn(content).trim();
        if (plain.length === 0) {
            issues.push({ line: index, message: 'Item has no content after stripping metadata', kind: 'empty-content' });
        } else if (plain.length > 200) {
            issues.push({ line: index, message: `Item is very long (${plain.length} chars) — consider splitting`, kind: 'too-long' });
        }
        if (plain.length > 0) {
            const firstSeen = seen.get(plain.toLowerCase());
            if (firstSeen !== undefined) {
                issues.push({ line: index, message: `Duplicate item content (same as line ${firstSeen + 1})`, kind: 'duplicate' });
            } else {
                seen.set(plain.toLowerCase(), index);
            }
        }
    }
    return issues;
}

/** Shifts a YYYY-MM-DD date string by N days. Returns the new date string. */
export function shiftDate(dateStr: string, days: number): string {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + days);
    return formatDate(date);
}

/**
 * Computes a composite weight score for a section based on:
 * items(×3) + prioritySum(!!!→3, !!→2, !→1) + votes + tags
 */
export function computeSectionWeight(
    itemCount: number,
    prioritySum: number,
    voteSum: number,
    tagCount: number
): number {
    return (itemCount * 3) + prioritySum + voteSum + tagCount;
}

/** Groups item lines by their primary #tag. Untagged items placed last with tag=''. */
export function groupLinesByTag(
    lines: string[],
    prefix: string,
    extractTagsFn: (content: string) => string[]
): Array<{ tag: string; lines: string[] }> {
    const groups = new Map<string, string[]>();
    const untagged: string[] = [];
    for (const line of lines) {
        const bullet   = parseBullet(line, prefix);
        const numbered = parseNumbered(line);
        const content  = bullet?.content ?? numbered?.content ?? null;
        if (!content) { untagged.push(line); continue; }
        const tags = extractTagsFn(content);
        if (tags.length === 0) { untagged.push(line); continue; }
        const key = tags[0];
        if (!groups.has(key)) { groups.set(key, []); }
        groups.get(key)!.push(line);
    }
    const result = [...groups.entries()].map(([tag, ls]) => ({ tag, lines: ls }));
    if (untagged.length > 0) { result.push({ tag: '', lines: untagged }); }
    return result;
}

const STOP_WORDS = new Set([
    'a','an','the','and','or','but','in','on','at','to','for','of','with',
    'is','it','its','this','that','be','as','by','from','was','are','have',
    'has','had','not','i','my','we','our','you','your','they','their',
]);

/** Counts word frequency in an array of strings, excluding common stop words */
export function countWordFrequency(lines: string[]): Map<string, number> {
    const freq = new Map<string, number>();
    for (const line of lines) {
        for (const word of line.toLowerCase().match(/[a-z]{3,}/g) ?? []) {
            if (STOP_WORDS.has(word)) { continue; }
            freq.set(word, (freq.get(word) ?? 0) + 1);
        }
    }
    return freq;
}

/** Levenshtein edit distance between two strings */
export function levenshtein(a: string, b: string): number {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, (_, i) =>
        Array.from({ length: n + 1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0)
    );
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            dp[i][j] = a[i-1] === b[j-1]
                ? dp[i-1][j-1]
                : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
        }
    }
    return dp[m][n];
}

/** String similarity ratio 0–1 (1 = identical) */
export function similarity(a: string, b: string): number {
    const dist = levenshtein(a.toLowerCase(), b.toLowerCase());
    return 1 - dist / Math.max(a.length, b.length, 1);
}

/** Parses natural-language date input to YYYY-MM-DD. Returns null if unrecognised. */
export function parseNaturalDate(input: string, from: Date = new Date()): string | null {
    const s     = input.trim().toLowerCase();
    const today = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    const relMatch = s.match(/^\+(\d+)$/);
    if (relMatch) { const d = new Date(today); d.setDate(d.getDate() + Number(relMatch[1])); return formatDate(d); }
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) { return s; }
    const days: Record<string, number> = {
        sun: 0, sunday: 0, mon: 1, monday: 1, tue: 2, tuesday: 2,
        wed: 3, wednesday: 3, thu: 4, thursday: 4, fri: 5, friday: 5, sat: 6, saturday: 6,
    };
    if (days[s] !== undefined) { return formatDate(nextWeekday(days[s], today)); }
    if (s === 'today')      { return formatDate(today); }
    if (s === 'tomorrow')   { const d = new Date(today); d.setDate(d.getDate() + 1); return formatDate(d); }
    if (s === 'next week')  { const d = new Date(today); d.setDate(d.getDate() + 7); return formatDate(d); }
    if (s === 'next month') { const d = new Date(today); d.setMonth(d.getMonth() + 1); return formatDate(d); }
    return null;
}

/** Regex matching [colour:X] section colour tags */
export const SECTION_COLOUR_RE = /\[colour:(red|green|blue|yellow|orange|purple)\]/i;

/** Parses the colour tag from a section header line, or returns null */
export function parseSectionColour(headerText: string): string | null {
    return headerText.match(SECTION_COLOUR_RE)?.[1]?.toLowerCase() ?? null;
}

/** Sets or clears the [colour:X] tag on a header line */
export function setSectionColour(headerText: string, colour: string | null): string {
    const stripped = headerText.replace(/\s*\[colour:[^\]]+\]/gi, '').trim();
    return colour ? `${stripped} [colour:${colour}]` : stripped;
}
