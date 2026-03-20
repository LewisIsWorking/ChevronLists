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
