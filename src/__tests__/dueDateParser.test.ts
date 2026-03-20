import { describe, it, expect } from 'bun:test';
import { extractDate, isOverdue, collectDueDates } from '../dueDateParser';
import type { LineReader } from '../types';

function makeDoc(lines: string[]): LineReader {
    return { lineCount: lines.length, lineAt: (i: number) => ({ text: lines[i] }) };
}

describe('extractDate', () => {
    it('extracts a date from item content', () => {
        const r = extractDate('Deploy server @2026-04-01');
        expect(r?.dateStr).toBe('2026-04-01');
        expect(r?.contentWithout).toBe('Deploy server');
    });
    it('returns null for content with no date', () => {
        expect(extractDate('no date here')).toBeNull();
    });
    it('collapses extra spaces after removing date', () => {
        const r = extractDate('task @2026-01-01 more');
        expect(r?.contentWithout).toBe('task more');
    });
});

describe('isOverdue', () => {
    it('returns true for a date in the past', () => {
        const today = new Date(2026, 2, 20); // March 20 2026
        expect(isOverdue('2026-03-19', today)).toBe(true);
    });
    it('returns false for today', () => {
        const today = new Date(2026, 2, 20);
        expect(isOverdue('2026-03-20', today)).toBe(false);
    });
    it('returns false for a future date', () => {
        const today = new Date(2026, 2, 20);
        expect(isOverdue('2026-04-01', today)).toBe(false);
    });
});

describe('collectDueDates', () => {
    it('returns empty array for a file with no dates', () => {
        const doc = makeDoc(['> H', '>> - plain item']);
        expect(collectDueDates(doc, '-')).toHaveLength(0);
    });
    it('collects items with dates', () => {
        const doc = makeDoc(['> Header', '>> - task @2026-12-01']);
        const items = collectDueDates(doc, '-');
        expect(items).toHaveLength(1);
        expect(items[0].dateStr).toBe('2026-12-01');
        expect(items[0].content).toBe('task');
        expect(items[0].section).toBe('Header');
    });
    it('marks overdue items correctly', () => {
        const today = new Date(2026, 2, 20);
        const doc   = makeDoc(['> H', '>> - old task @2026-01-01']);
        const items = collectDueDates(doc, '-', today);
        expect(items[0].overdue).toBe(true);
    });
    it('does not mark future items as overdue', () => {
        const today = new Date(2026, 2, 20);
        const doc   = makeDoc(['> H', '>> - future task @2027-01-01']);
        expect(collectDueDates(doc, '-', today)[0].overdue).toBe(false);
    });
    it('sorts items chronologically', () => {
        const doc = makeDoc(['> H', '>> - b @2026-06-01', '>> - a @2026-03-01']);
        const items = collectDueDates(doc, '-');
        expect(items[0].dateStr).toBe('2026-03-01');
        expect(items[1].dateStr).toBe('2026-06-01');
    });
    it('works on numbered items', () => {
        const doc = makeDoc(['> H', '>> 1. task @2026-05-01']);
        expect(collectDueDates(doc, '-')).toHaveLength(1);
    });
});
