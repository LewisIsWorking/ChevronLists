import { describe, it, expect } from 'bun:test';
import { parseCreatedDate, ageInDays, collectAgedItems } from '../itemAgeParser';
import type { LineReader } from '../types';

function makeDoc(lines: string[]): LineReader {
    return { lineCount: lines.length, lineAt: (i: number) => ({ text: lines[i] }) };
}

describe('parseCreatedDate', () => {
    it('parses @created date', () => {
        expect(parseCreatedDate('task @created:2026-01-01')).toBe('2026-01-01');
    });
    it('returns null for no date', () => {
        expect(parseCreatedDate('plain item')).toBeNull();
    });
});

describe('ageInDays', () => {
    it('returns 0 for today', () => {
        const today = new Date(2026, 2, 20);
        expect(ageInDays('2026-03-20', today)).toBe(0);
    });
    it('returns correct age for a past date', () => {
        const today = new Date(2026, 2, 20);
        expect(ageInDays('2026-03-10', today)).toBe(10);
    });
    it('returns 0 for a future date', () => {
        const today = new Date(2026, 2, 20);
        expect(ageInDays('2026-04-01', today)).toBe(-12);
    });
});

describe('collectAgedItems', () => {
    it('returns empty for items with no created date', () => {
        const doc = makeDoc(['> H', '>> - plain item']);
        expect(collectAgedItems(doc, '-')).toHaveLength(0);
    });
    it('collects items with created dates sorted oldest first', () => {
        const today = new Date(2026, 2, 20);
        const doc   = makeDoc([
            '> Header',
            '>> - newer task @created:2026-03-15',
            '>> - older task @created:2026-01-01',
        ]);
        const items = collectAgedItems(doc, '-', today);
        expect(items).toHaveLength(2);
        expect(items[0].dateStr).toBe('2026-01-01');
        expect(items[1].dateStr).toBe('2026-03-15');
    });
    it('strips the @created marker from content', () => {
        const doc = makeDoc(['> H', '>> - my task @created:2026-01-01']);
        expect(collectAgedItems(doc, '-')[0].content).toBe('my task');
    });
    it('records correct section and line', () => {
        const doc   = makeDoc(['> MySection', '>> - task @created:2026-01-01']);
        const items = collectAgedItems(doc, '-');
        expect(items[0].section).toBe('MySection');
        expect(items[0].line).toBe(1);
    });
});
