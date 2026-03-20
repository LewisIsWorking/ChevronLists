import { describe, it, expect } from 'bun:test';
import { ageInDays, parseCreatedDate } from '../itemAgeParser';

// Mirror header-split logic for testing
function splitHeader(lineText: string, cursorChar: number): { before: string; after: string } {
    const before = lineText.slice(0, cursorChar).trimEnd();
    const after  = lineText.slice(cursorChar).trimStart();
    return { before, after };
}

// Mirror paste-as-section logic for testing
function pasteAsSection(clipLines: string[], prefix: string): string[] {
    const lines = clipLines.filter(Boolean);
    if (lines.length === 0) { return []; }
    return [`> ${lines[0]}`, ...lines.slice(1).map(l => `>> ${prefix} ${l}`)];
}

describe('header mid-line split', () => {
    it('splits header at cursor position', () => {
        const { before, after } = splitHeader('> My Long Header', 10);
        expect(before).toBe('> My Long');
        expect(after).toBe('Header');
    });
    it('returns empty after when cursor is at end', () => {
        const { before, after } = splitHeader('> Header', 8);
        expect(before).toBe('> Header');
        expect(after).toBe('');
    });
    it('trims whitespace correctly', () => {
        const { before, after } = splitHeader('> Hello World', 8);
        expect(before).toBe('> Hello');
        expect(after).toBe('World');
    });
});

describe('pasteAsSection', () => {
    it('uses first line as header', () => {
        const result = pasteAsSection(['My Section', 'item one', 'item two'], '-');
        expect(result[0]).toBe('> My Section');
    });
    it('converts remaining lines to bullet items', () => {
        const result = pasteAsSection(['Header', 'alpha', 'beta'], '-');
        expect(result[1]).toBe('>> - alpha');
        expect(result[2]).toBe('>> - beta');
    });
    it('works with a single-line clipboard (header only)', () => {
        const result = pasteAsSection(['Just a Header'], '-');
        expect(result).toHaveLength(1);
        expect(result[0]).toBe('> Just a Header');
    });
    it('returns empty for empty clipboard', () => {
        expect(pasteAsSection([], '-')).toHaveLength(0);
    });
});

describe('removeOldItems threshold', () => {
    it('correctly identifies items older than threshold', () => {
        const today = new Date(2026, 2, 20);
        expect(ageInDays('2026-01-01', today)).toBeGreaterThanOrEqual(30);
    });
    it('does not flag recent items', () => {
        const today = new Date(2026, 2, 20);
        expect(ageInDays('2026-03-15', today)).toBeLessThan(30);
    });
});
