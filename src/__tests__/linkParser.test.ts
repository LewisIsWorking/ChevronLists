import { describe, it, expect } from 'bun:test';
import { extractLinks, resolveLink, collectLinks } from '../linkParser';
import type { LineReader } from '../types';

function makeDoc(lines: string[]): LineReader {
    return { lineCount: lines.length, lineAt: (i: number) => ({ text: lines[i] }) };
}

describe('extractLinks', () => {
    it('extracts a single link', () => {
        const links = extractLinks('see [[Alpha]] for details');
        expect(links).toHaveLength(1);
        expect(links[0].target).toBe('Alpha');
    });
    it('extracts multiple links from one line', () => {
        const links = extractLinks('see [[Alpha]] and [[Beta]]');
        expect(links).toHaveLength(2);
        expect(links[0].target).toBe('Alpha');
        expect(links[1].target).toBe('Beta');
    });
    it('trims whitespace from target', () => {
        expect(extractLinks('[[ My Section ]]')[0].target).toBe('My Section');
    });
    it('returns correct char positions', () => {
        const links = extractLinks('x [[Foo]] y');
        expect(links[0].charStart).toBe(2);
        expect(links[0].charEnd).toBe(9);
    });
    it('returns empty array for a line with no links', () => {
        expect(extractLinks('no links here')).toHaveLength(0);
    });
});

describe('resolveLink', () => {
    it('resolves a link to the correct line', () => {
        const doc = makeDoc(['> Alpha', '>> - item', '> Beta', '>> - item']);
        expect(resolveLink('Alpha', doc)).toBe(0);
        expect(resolveLink('Beta', doc)).toBe(2);
    });
    it('is case-insensitive', () => {
        const doc = makeDoc(['> My Section', '>> - item']);
        expect(resolveLink('my section', doc)).toBe(0);
        expect(resolveLink('MY SECTION', doc)).toBe(0);
    });
    it('returns -1 when the section does not exist', () => {
        const doc = makeDoc(['> Alpha', '>> - item']);
        expect(resolveLink('Nonexistent', doc)).toBe(-1);
    });
    it('does not match >> items as headers', () => {
        const doc = makeDoc(['>> - not a header']);
        expect(resolveLink('not a header', doc)).toBe(-1);
    });
});

describe('collectLinks', () => {
    it('returns empty array for a file with no links', () => {
        const doc = makeDoc(['> Header', '>> - plain item']);
        expect(collectLinks(doc)).toHaveLength(0);
    });
    it('collects links with correct line numbers', () => {
        const doc = makeDoc(['> Alpha', '>> - see [[Beta]]', '> Beta', '>> - item']);
        const links = collectLinks(doc);
        expect(links).toHaveLength(1);
        expect(links[0].line).toBe(1);
        expect(links[0].target).toBe('Beta');
    });
    it('resolves found targets correctly', () => {
        const doc = makeDoc(['> Alpha', '>> - see [[Alpha]]']);
        expect(collectLinks(doc)[0].resolvedLine).toBe(0);
    });
    it('marks unresolved targets as -1', () => {
        const doc = makeDoc(['> Alpha', '>> - see [[Nonexistent]]']);
        expect(collectLinks(doc)[0].resolvedLine).toBe(-1);
    });
});
