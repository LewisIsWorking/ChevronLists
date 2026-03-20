import { describe, it, expect } from 'bun:test';
import { extractLinks, collectLinks, findHeaderLine } from '../linkParser';
import type { LineReader } from '../types';

function makeDoc(lines: string[]): LineReader {
    return { lineCount: lines.length, lineAt: (i: number) => ({ text: lines[i] }) };
}

describe('extractLinks', () => {
    it('extracts a single link', () => {
        const links = extractLinks('See [[My Section]] for details');
        expect(links).toHaveLength(1);
        expect(links[0].target).toBe('My Section');
    });
    it('extracts multiple links', () => {
        const links = extractLinks('See [[Alpha]] and [[Beta]]');
        expect(links).toHaveLength(2);
        expect(links[0].target).toBe('Alpha');
        expect(links[1].target).toBe('Beta');
    });
    it('returns correct character positions', () => {
        const links = extractLinks('before [[Target]] after');
        expect(links[0].startChar).toBe(7);
        expect(links[0].endChar).toBe(17);
    });
    it('trims whitespace from target name', () => {
        expect(extractLinks('[[ Trimmed ]]')[0].target).toBe('Trimmed');
    });
    it('returns empty array for text with no links', () => {
        expect(extractLinks('no links here')).toHaveLength(0);
    });
    it('does not match single brackets', () => {
        expect(extractLinks('[not a link]')).toHaveLength(0);
    });
});

describe('collectLinks', () => {
    it('collects links across all lines', () => {
        const doc   = makeDoc(['>> - See [[Alpha]]', '>> - Also [[Beta]]']);
        const links = collectLinks(doc);
        expect(links).toHaveLength(2);
        expect(links[0].line).toBe(0);
        expect(links[1].line).toBe(1);
    });
    it('returns empty array for a document with no links', () => {
        const doc = makeDoc(['> Header', '>> - plain item']);
        expect(collectLinks(doc)).toHaveLength(0);
    });
    it('collects the correct target from each line', () => {
        const doc = makeDoc(['> Header', '>> - See [[TargetSection]]']);
        expect(collectLinks(doc)[0].target).toBe('TargetSection');
    });
});

describe('findHeaderLine', () => {
    it('finds a matching header', () => {
        const doc = makeDoc(['> Alpha', '>> - item', '> Beta', '>> - item']);
        expect(findHeaderLine(doc, 'Beta')).toBe(2);
    });
    it('returns -1 when header not found', () => {
        const doc = makeDoc(['> Alpha', '>> - item']);
        expect(findHeaderLine(doc, 'Nonexistent')).toBe(-1);
    });
    it('is case-insensitive', () => {
        const doc = makeDoc(['> My Section', '>> - item']);
        expect(findHeaderLine(doc, 'my section')).toBe(0);
    });
    it('trims whitespace before comparing', () => {
        const doc = makeDoc(['> Padded ', '>> - item']);
        expect(findHeaderLine(doc, 'Padded')).toBe(0);
    });
    it('does not match >> items as headers', () => {
        const doc = makeDoc(['>> - Not a Header']);
        expect(findHeaderLine(doc, 'Not a Header')).toBe(-1);
    });
});
