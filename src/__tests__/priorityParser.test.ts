import { describe, it, expect } from 'bun:test';
import { parsePriority, collectPriorityItems, PRIORITY_LABELS } from '../priorityParser';
import type { LineReader } from '../types';

function makeDoc(lines: string[]): LineReader {
    return { lineCount: lines.length, lineAt: (i: number) => ({ text: lines[i] }) };
}

describe('parsePriority', () => {
    it('parses ! as level 1', () => {
        expect(parsePriority('! low priority item')?.level).toBe(1);
    });
    it('parses !! as level 2', () => {
        expect(parsePriority('!! medium priority')?.level).toBe(2);
    });
    it('parses !!! as level 3', () => {
        expect(parsePriority('!!! critical task')?.level).toBe(3);
    });
    it('strips the priority marker from contentWithout', () => {
        expect(parsePriority('!! do this')?.contentWithout).toBe('do this');
    });
    it('returns null for content with no priority marker', () => {
        expect(parsePriority('plain item')).toBeNull();
    });
    it('returns null if ! is not followed by a space', () => {
        expect(parsePriority('!nospace')).toBeNull();
    });
    it('returns null for four or more ! (not a valid marker)', () => {
        expect(parsePriority('!!!! item')).toBeNull();
    });
});

describe('PRIORITY_LABELS', () => {
    it('has labels for levels 1, 2 and 3', () => {
        expect(PRIORITY_LABELS[1]).toBeDefined();
        expect(PRIORITY_LABELS[2]).toBeDefined();
        expect(PRIORITY_LABELS[3]).toBeDefined();
    });
});

describe('collectPriorityItems', () => {
    it('returns empty array for a file with no priority items', () => {
        const doc = makeDoc(['> H', '>> - plain item']);
        expect(collectPriorityItems(doc, '-')).toHaveLength(0);
    });
    it('collects priority items with correct level and section', () => {
        const doc = makeDoc(['> Header', '>> - !!! critical task']);
        const items = collectPriorityItems(doc, '-');
        expect(items).toHaveLength(1);
        expect(items[0].level).toBe(3);
        expect(items[0].section).toBe('Header');
        expect(items[0].line).toBe(1);
    });
    it('collects multiple priorities from different sections', () => {
        const doc = makeDoc(['> A', '>> - ! low', '> B', '>> - !! medium']);
        const items = collectPriorityItems(doc, '-');
        expect(items).toHaveLength(2);
        expect(items[0].section).toBe('A');
        expect(items[1].section).toBe('B');
    });
    it('works on numbered items too', () => {
        const doc = makeDoc(['> H', '>> 1. !!! urgent numbered']);
        expect(collectPriorityItems(doc, '-')).toHaveLength(1);
    });
});
