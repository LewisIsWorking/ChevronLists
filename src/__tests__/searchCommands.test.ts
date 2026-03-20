import { describe, it, expect } from 'bun:test';
import { isHeader, parseBullet, parseNumbered } from '../patterns';
import type { LineReader } from '../types';

// ── Pure helpers mirrored from searchCommands.ts ──────────────────────────────

interface ItemEntry { label: string; description: string; lineIndex: number; }

function makeDoc(lines: string[]): LineReader {
    return { lineCount: lines.length, lineAt: (i: number) => ({ text: lines[i] }) };
}

function collectAllItems(doc: LineReader, prefix: string): ItemEntry[] {
    const entries: ItemEntry[] = [];
    let currentHeader = '';
    for (let i = 0; i < doc.lineCount; i++) {
        const text = doc.lineAt(i).text;
        if (isHeader(text)) { currentHeader = text.replace(/^> /, ''); continue; }
        const bullet   = parseBullet(text, prefix);
        const numbered = parseNumbered(text);
        if (bullet) {
            entries.push({ label: bullet.content, description: currentHeader, lineIndex: i });
        } else if (numbered) {
            entries.push({ label: `${numbered.num}. ${numbered.content}`, description: currentHeader, lineIndex: i });
        }
    }
    return entries;
}

function collectAllHeaders(doc: LineReader): ItemEntry[] {
    const entries: ItemEntry[] = [];
    for (let i = 0; i < doc.lineCount; i++) {
        const text = doc.lineAt(i).text;
        if (isHeader(text)) {
            entries.push({ label: text.replace(/^> /, ''), description: '', lineIndex: i });
        }
    }
    return entries;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('collectAllItems', () => {
    it('returns empty array for a file with no items', () => {
        const doc = makeDoc(['# Just a markdown heading', 'some text']);
        expect(collectAllItems(doc, '-')).toEqual([]);
    });
    it('collects bullet items with correct header description', () => {
        const doc = makeDoc(['> MyHeader', '>> - FirstItem', '>> - SecondItem']);
        const items = collectAllItems(doc, '-');
        expect(items).toHaveLength(2);
        expect(items[0].label).toBe('FirstItem');
        expect(items[0].description).toBe('MyHeader');
        expect(items[0].lineIndex).toBe(1);
    });
    it('collects numbered items', () => {
        const doc = makeDoc(['> Header', '>> 1. First', '>> 2. Second']);
        const items = collectAllItems(doc, '-');
        expect(items[0].label).toBe('1. First');
        expect(items[1].label).toBe('2. Second');
    });
    it('tracks header changes across sections', () => {
        const doc = makeDoc(['> SectionA', '>> - ItemA', '> SectionB', '>> - ItemB']);
        const items = collectAllItems(doc, '-');
        expect(items[0].description).toBe('SectionA');
        expect(items[1].description).toBe('SectionB');
    });
    it('correctly reports line indices', () => {
        const doc = makeDoc(['plain', '> Header', 'plain', '>> - Item']);
        const items = collectAllItems(doc, '-');
        expect(items[0].lineIndex).toBe(3);
    });
    it('works with a custom prefix', () => {
        const doc = makeDoc(['> Header', '>> * Item']);
        const items = collectAllItems(doc, '*');
        expect(items[0].label).toBe('Item');
    });
    it('ignores non-chevron content between sections', () => {
        const doc = makeDoc(['> Header', 'plain text', '>> - Item']);
        const items = collectAllItems(doc, '-');
        expect(items).toHaveLength(1);
    });
});

describe('collectAllHeaders', () => {
    it('returns empty array for a file with no headers', () => {
        const doc = makeDoc(['>> - Item', 'plain text']);
        expect(collectAllHeaders(doc)).toEqual([]);
    });
    it('collects all headers with correct line indices', () => {
        const doc = makeDoc(['> First', '>> - item', '> Second', '>> - item']);
        const headers = collectAllHeaders(doc);
        expect(headers).toHaveLength(2);
        expect(headers[0].label).toBe('First');
        expect(headers[0].lineIndex).toBe(0);
        expect(headers[1].label).toBe('Second');
        expect(headers[1].lineIndex).toBe(2);
    });
    it('strips the > prefix from the label', () => {
        const doc = makeDoc(['> My Section Header']);
        const headers = collectAllHeaders(doc);
        expect(headers[0].label).toBe('My Section Header');
    });
    it('does not include >> - items as headers', () => {
        const doc = makeDoc(['>> - not a header']);
        expect(collectAllHeaders(doc)).toHaveLength(0);
    });
});
