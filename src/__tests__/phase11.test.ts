import { describe, it, expect } from 'bun:test';
import { parseDependency, collectDependencies, dependencyTargets } from '../dependencyParser';
import { parseVote, setVoteCount, collectVotedItems } from '../voteParser';
import type { LineReader } from '../types';

function makeDoc(lines: string[]): LineReader {
    return { lineCount: lines.length, lineAt: (i: number) => ({ text: lines[i] }) };
}

describe('parseDependency', () => {
    it('parses a >>depends: line', () => {
        expect(parseDependency('>>depends:Phase One')).toBe('Phase One');
    });
    it('trims whitespace from target', () => {
        expect(parseDependency('>>depends:  My Section  ')).toBe('My Section');
    });
    it('returns null for a regular item', () => {
        expect(parseDependency('>> - plain item')).toBeNull();
    });
    it('returns null for a header', () => {
        expect(parseDependency('> Header')).toBeNull();
    });
});

describe('collectDependencies', () => {
    it('returns empty for no dependencies', () => {
        expect(collectDependencies(makeDoc(['> H', '>> - item']))).toHaveLength(0);
    });
    it('collects a dependency with correct from/to', () => {
        const doc  = makeDoc(['> Phase Two', '>>depends:Phase One']);
        const deps = collectDependencies(doc);
        expect(deps).toHaveLength(1);
        expect(deps[0].from).toBe('Phase Two');
        expect(deps[0].to).toBe('Phase One');
    });
});

describe('dependencyTargets', () => {
    it('returns unique targets', () => {
        const doc = makeDoc(['> A', '>>depends:X', '> B', '>>depends:X']);
        expect(dependencyTargets(doc)).toEqual(['X']);
    });
});

describe('parseVote', () => {
    it('parses +5', () => expect(parseVote('great idea +5')?.count).toBe(5));
    it('strips vote from contentWithout', () => expect(parseVote('idea +3')?.contentWithout).toBe('idea'));
    it('returns null for no vote', () => expect(parseVote('plain item')).toBeNull());
    it('parses +0', () => expect(parseVote('item +0')?.count).toBe(0));
});

describe('setVoteCount', () => {
    it('adds a vote count', () => expect(setVoteCount('item', 3)).toBe('item +3'));
    it('updates an existing vote', () => expect(setVoteCount('item +2', 5)).toBe('item +5'));
    it('removes vote when count is 0', () => expect(setVoteCount('item +3', 0)).toBe('item'));
});

describe('collectVotedItems', () => {
    it('returns empty for no voted items', () => {
        expect(collectVotedItems(makeDoc(['> H', '>> - plain']), '-')).toHaveLength(0);
    });
    it('collects voted items sorted descending', () => {
        const doc   = makeDoc(['> H', '>> - low +1', '>> - high +5']);
        const items = collectVotedItems(doc, '-');
        expect(items[0].count).toBe(5);
        expect(items[1].count).toBe(1);
    });
});
