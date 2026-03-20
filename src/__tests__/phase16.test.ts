import { describe, it, expect } from 'bun:test';
import { parseComment, stripComment } from '../commentParser';
import { parseFlag, toggleFlag, collectFlaggedItems } from '../flagParser';
import type { LineReader } from '../types';

function makeDoc(lines: string[]): LineReader {
    return { lineCount: lines.length, lineAt: (i: number) => ({ text: lines[i] }) };
}

describe('parseComment', () => {
    it('parses a comment tail', () => {
        const r = parseComment('deploy server // ask Lewis first');
        expect(r?.body).toBe('deploy server');
        expect(r?.comment).toBe('ask Lewis first');
    });
    it('returns null when no comment', () => {
        expect(parseComment('plain item')).toBeNull();
    });
    it('handles comment with no body', () => {
        const r = parseComment('// pure comment');
        expect(r?.body).toBe('');
    });
});

describe('stripComment', () => {
    it('strips a comment', () => {
        expect(stripComment('task // note')).toBe('task');
    });
    it('returns unchanged when no comment', () => {
        expect(stripComment('plain')).toBe('plain');
    });
});

describe('parseFlag', () => {
    it('parses a ? flagged item', () => {
        expect(parseFlag('? unclear requirement')?.contentWithout).toBe('unclear requirement');
    });
    it('returns null for non-flagged content', () => {
        expect(parseFlag('plain item')).toBeNull();
    });
});

describe('toggleFlag', () => {
    it('adds ? to unflagged content', () => {
        expect(toggleFlag('item')).toBe('? item');
    });
    it('removes ? from flagged content', () => {
        expect(toggleFlag('? item')).toBe('item');
    });
});

describe('collectFlaggedItems', () => {
    it('returns empty for no flagged items', () => {
        const doc = makeDoc(['> H', '>> - plain']);
        expect(collectFlaggedItems(doc, '-')).toHaveLength(0);
    });
    it('collects flagged items with section', () => {
        const doc = makeDoc(['> Header', '>> - ? unclear requirement']);
        const items = collectFlaggedItems(doc, '-');
        expect(items).toHaveLength(1);
        expect(items[0].content).toBe('unclear requirement');
        expect(items[0].section).toBe('Header');
    });
});
