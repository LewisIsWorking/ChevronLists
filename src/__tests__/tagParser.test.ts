import { describe, it, expect } from 'bun:test';
import { extractTags, stripTags, collectTags, uniqueTags, renameTagInText } from '../tagParser';
import type { LineReader } from '../types';

function makeDoc(lines: string[]): LineReader {
    return { lineCount: lines.length, lineAt: (i: number) => ({ text: lines[i] }) };
}

describe('extractTags', () => {
    it('extracts a single tag', () => {
        expect(extractTags('deploy server #urgent')).toEqual(['urgent']);
    });
    it('extracts multiple tags', () => {
        expect(extractTags('fix #bug in #backend module')).toEqual(['bug', 'backend']);
    });
    it('deduplicates repeated tags', () => {
        expect(extractTags('#urgent and also #urgent')).toEqual(['urgent']);
    });
    it('lowercases tags', () => {
        expect(extractTags('#Urgent')).toEqual(['urgent']);
    });
    it('handles hyphenated tags', () => {
        expect(extractTags('#in-progress')).toEqual(['in-progress']);
    });
    it('returns empty array for content with no tags', () => {
        expect(extractTags('no tags here')).toEqual([]);
    });
});

describe('stripTags', () => {
    it('removes a tag from content', () => {
        expect(stripTags('deploy server #urgent')).toBe('deploy server');
    });
    it('removes multiple tags', () => {
        expect(stripTags('fix #bug in #backend')).toBe('fix in');
    });
    it('collapses multiple spaces', () => {
        expect(stripTags('item #tag1 #tag2 end')).toBe('item end');
    });
    it('returns unchanged string if no tags', () => {
        expect(stripTags('no tags here')).toBe('no tags here');
    });
});

describe('collectTags', () => {
    it('returns empty array for a file with no tags', () => {
        const doc = makeDoc(['> Header', '>> - plain item']);
        expect(collectTags(doc, '-')).toHaveLength(0);
    });
    it('collects tags from bullet items', () => {
        const doc = makeDoc(['> Header', '>> - deploy #urgent']);
        const occ = collectTags(doc, '-');
        expect(occ).toHaveLength(1);
        expect(occ[0].tag).toBe('urgent');
        expect(occ[0].section).toBe('Header');
        expect(occ[0].line).toBe(1);
    });
    it('collects tags from numbered items', () => {
        const doc = makeDoc(['> Header', '>> 1. task #todo']);
        const occ = collectTags(doc, '-');
        expect(occ[0].tag).toBe('todo');
    });
    it('collects multiple tags from one item as separate occurrences', () => {
        const doc = makeDoc(['> Header', '>> - item #a #b']);
        expect(collectTags(doc, '-')).toHaveLength(2);
    });
    it('tracks section name correctly', () => {
        const doc = makeDoc(['> SectionA', '>> - item1', '> SectionB', '>> - item #tag']);
        const occ = collectTags(doc, '-');
        expect(occ[0].section).toBe('SectionB');
    });
});

describe('uniqueTags', () => {
    it('returns sorted unique tags', () => {
        const doc = makeDoc(['> H', '>> - item #zebra', '>> - item #apple', '>> - item #zebra']);
        expect(uniqueTags(doc, '-')).toEqual(['apple', 'zebra']);
    });
    it('returns empty array for a file with no tags', () => {
        const doc = makeDoc(['> H', '>> - no tags']);
        expect(uniqueTags(doc, '-')).toEqual([]);
    });
});

describe('renameTagInText', () => {
    it('renames a tag', () => {
        expect(renameTagInText('item #wip more', 'wip', 'done')).toBe('item #done more');
    });
    it('does not match a longer tag', () => {
        expect(renameTagInText('item #urgent-fix', 'urgent', 'critical')).toBe('item #urgent-fix');
    });
    it('renames at end of string', () => {
        expect(renameTagInText('item #wip', 'wip', 'done')).toBe('item #done');
    });
    it('renames multiple occurrences', () => {
        expect(renameTagInText('#wip and #wip', 'wip', 'done')).toBe('#done and #done');
    });
    it('returns unchanged string when tag not found', () => {
        expect(renameTagInText('item #other', 'wip', 'done')).toBe('item #other');
    });
});
