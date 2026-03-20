import { describe, it, expect } from 'bun:test';
import { parseExpiry, isExpired, collectExpiredItems } from '../expiryParser';
import type { LineReader } from '../types';

function makeDoc(lines: string[]): LineReader {
    return { lineCount: lines.length, lineAt: (i: number) => ({ text: lines[i] }) };
}

describe('parseExpiry', () => {
    it('parses @expires:YYYY-MM-DD', () => expect(parseExpiry('task @expires:2025-01-01')).toBe('2025-01-01'));
    it('returns null when not present', () => expect(parseExpiry('plain item')).toBeNull());
    it('ignores @created dates', () => expect(parseExpiry('@created:2024-01-01')).toBeNull());
});

describe('isExpired', () => {
    const today = new Date(2026, 2, 20); // March 20 2026
    it('returns true for past date', () => expect(isExpired('2026-01-01', today)).toBe(true));
    it('returns false for today', () => expect(isExpired('2026-03-20', today)).toBe(false));
    it('returns false for future date', () => expect(isExpired('2027-01-01', today)).toBe(false));
});

describe('collectExpiredItems', () => {
    it('returns empty when no expired items', () => {
        const doc = makeDoc(['> H', '>> - task @expires:2099-01-01']);
        expect(collectExpiredItems(doc, '-')).toHaveLength(0);
    });
    it('collects expired items', () => {
        const doc   = makeDoc(['> H', '>> - old task @expires:2020-01-01']);
        const items = collectExpiredItems(doc, '-');
        expect(items).toHaveLength(1);
        expect(items[0].dateStr).toBe('2020-01-01');
    });
    it('strips @expires from returned content', () => {
        const doc   = makeDoc(['> H', '>> - old task @expires:2020-01-01']);
        expect(collectExpiredItems(doc, '-')[0].content).toBe('old task');
    });
    it('records section name', () => {
        const doc   = makeDoc(['> My Section', '>> - task @expires:2020-01-01']);
        expect(collectExpiredItems(doc, '-')[0].section).toBe('My Section');
    });
});
