import { describe, it, expect } from 'bun:test';
import { parseStar, toggleStar, collectStarredItems } from '../starParser';
import { parseEstimate, collectEstimatedItems, totalEstimatedMinutes } from '../estimateParser';
import { extractFileLinks, collectFileLinks } from '../fileLinkParser';
import type { LineReader } from '../types';

function makeDoc(lines: string[]): LineReader {
    return { lineCount: lines.length, lineAt: (i: number) => ({ text: lines[i] }) };
}

describe('parseStar', () => {
    it('parses a starred item', () => expect(parseStar('* important task')?.contentWithout).toBe('important task'));
    it('returns null for non-starred content', () => expect(parseStar('plain item')).toBeNull());
});

describe('toggleStar', () => {
    it('adds a star to unstarred content', () => expect(toggleStar('item')).toBe('* item'));
    it('removes a star from starred content', () => expect(toggleStar('* item')).toBe('item'));
});

describe('collectStarredItems', () => {
    it('returns empty for no starred items', () => {
        expect(collectStarredItems(makeDoc(['> H', '>> - plain']) as any, '-')).toHaveLength(0);
    });
    it('collects starred items', () => {
        const doc = makeDoc(['> Header', '>> - * key task']);
        const items = collectStarredItems(doc as any, '-');
        expect(items).toHaveLength(1);
        expect(items[0].content).toBe('key task');
        expect(items[0].section).toBe('Header');
    });
});

describe('parseEstimate', () => {
    it('parses ~2h', () => { const r = parseEstimate('task ~2h'); expect(r?.hours).toBe(2); expect(r?.minutes).toBe(0); });
    it('parses ~30m', () => { const r = parseEstimate('task ~30m'); expect(r?.hours).toBe(0); expect(r?.minutes).toBe(30); });
    it('parses ~1h30m', () => { const r = parseEstimate('task ~1h30m'); expect(r?.totalMinutes).toBe(90); });
    it('returns null for no estimate', () => expect(parseEstimate('plain item')).toBeNull());
    it('strips the estimate from contentWithout', () => expect(parseEstimate('deploy ~2h')?.contentWithout).toBe('deploy'));
    it('returns null for ~ with no value', () => expect(parseEstimate('task ~')).toBeNull());
});

describe('collectEstimatedItems', () => {
    it('collects estimated items sorted by duration descending', () => {
        const doc = makeDoc(['> H', '>> - short ~30m', '>> - long ~3h']);
        const items = collectEstimatedItems(doc as any, '-');
        expect(items[0].estimate.display).toBe('3h');
        expect(items[1].estimate.display).toBe('30m');
    });
});

describe('totalEstimatedMinutes', () => {
    it('sums total minutes correctly', () => {
        const doc   = makeDoc(['> H', '>> - a ~1h', '>> - b ~30m']);
        const items = collectEstimatedItems(doc as any, '-');
        expect(totalEstimatedMinutes(items)).toBe(90);
    });
    it('returns 0 for empty array', () => expect(totalEstimatedMinutes([])).toBe(0));
});

describe('extractFileLinks', () => {
    it('extracts a [[file:...]] link', () => {
        const links = extractFileLinks('See [[file:notes.md]] here', 0);
        expect(links).toHaveLength(1);
        expect(links[0].filename).toBe('notes.md');
    });
    it('extracts multiple links', () => {
        expect(extractFileLinks('[[file:a.md]] and [[file:b.md]]', 0)).toHaveLength(2);
    });
    it('returns empty for no links', () => expect(extractFileLinks('plain text', 0)).toHaveLength(0));
});

describe('collectFileLinks', () => {
    it('collects links across all lines', () => {
        const doc = makeDoc(['>> - see [[file:notes.md]]', '>> - and [[file:other.md]]']);
        expect(collectFileLinks(doc)).toHaveLength(2);
    });
});
