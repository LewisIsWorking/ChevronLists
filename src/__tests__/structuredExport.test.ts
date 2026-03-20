import { describe, it, expect } from 'bun:test';
import { parseStructured, toCsv } from '../structuredExport';
import type { LineReader } from '../types';

function makeDoc(lines: string[]): LineReader {
    return { lineCount: lines.length, lineAt: (i: number) => ({ text: lines[i] }) };
}

describe('parseStructured', () => {
    it('returns empty array for a file with no headers', () => {
        expect(parseStructured(makeDoc(['plain text']) as any, '-')).toHaveLength(0);
    });
    it('parses a simple section with one bullet item', () => {
        const doc = makeDoc(['> Header', '>> - plain item']);
        const sections = parseStructured(doc as any, '-');
        expect(sections).toHaveLength(1);
        expect(sections[0].name).toBe('Header');
        expect(sections[0].items).toHaveLength(1);
        expect(sections[0].items[0].content).toBe('plain item');
    });
    it('extracts tags into the tags array', () => {
        const doc = makeDoc(['> H', '>> - item #urgent #backend']);
        const item = parseStructured(doc as any, '-')[0].items[0];
        expect(item.tags).toContain('urgent');
        expect(item.tags).toContain('backend');
    });
    it('extracts priority level', () => {
        const doc = makeDoc(['> H', '>> - !!! critical']);
        expect(parseStructured(doc as any, '-')[0].items[0].priority).toBe(3);
    });
    it('extracts due date', () => {
        const doc = makeDoc(['> H', '>> - task @2026-04-01']);
        expect(parseStructured(doc as any, '-')[0].items[0].dueDate).toBe('2026-04-01');
    });
    it('extracts done state from checkboxes', () => {
        const doc = makeDoc(['> H', '>> - [x] done', '>> - [ ] todo', '>> - plain']);
        const items = parseStructured(doc as any, '-')[0].items;
        expect(items[0].done).toBe(true);
        expect(items[1].done).toBe(false);
        expect(items[2].done).toBeNull();
    });
    it('calculates depth correctly', () => {
        const doc = makeDoc(['> H', '>> - top', '>>> - nested']);
        const items = parseStructured(doc as any, '-')[0].items;
        expect(items[0].depth).toBe(0);
        expect(items[1].depth).toBe(1);
    });
});

describe('toCsv', () => {
    it('produces a header row', () => {
        const csv = toCsv([]);
        expect(csv).toContain('Section,Depth');
    });
    it('produces one data row per item', () => {
        const doc = makeDoc(['> H', '>> - a', '>> - b']);
        const sections = parseStructured(doc as any, '-');
        const lines = toCsv(sections).split('\n');
        expect(lines).toHaveLength(3); // header + 2 items
    });
    it('quotes cells containing commas', () => {
        const doc = makeDoc(['> H', '>> - item, with comma']);
        const csv = toCsv(parseStructured(doc as any, '-'));
        expect(csv).toContain('"item, with comma"');
    });
});
