import { describe, it, expect } from 'bun:test';
import { parseCheck, toggleCheckLine, countChecks } from '../checkParser';
import type { LineReader } from '../types';

function makeDoc(lines: string[]): LineReader {
    return { lineCount: lines.length, lineAt: (i: number) => ({ text: lines[i] }) };
}

describe('parseCheck', () => {
    it('parses a done item', () => {
        const r = parseCheck('[x] Deploy server');
        expect(r?.state).toBe('done');
        expect(r?.contentWithout).toBe('Deploy server');
    });
    it('parses a todo item', () => {
        const r = parseCheck('[ ] Deploy server');
        expect(r?.state).toBe('todo');
        expect(r?.contentWithout).toBe('Deploy server');
    });
    it('is case-insensitive for x', () => {
        expect(parseCheck('[X] item')?.state).toBe('done');
    });
    it('returns null for content without a checkbox', () => {
        expect(parseCheck('plain item')).toBeNull();
    });
    it('returns null for partial bracket', () => {
        expect(parseCheck('[x] '.slice(0, 2) + 'item')).toBeNull();
    });
});

describe('toggleCheckLine', () => {
    it('adds [ ] to a bullet item with no checkbox', () => {
        expect(toggleCheckLine('>> - Deploy server', '-')).toBe('>> - [ ] Deploy server');
    });
    it('toggles [ ] to [x]', () => {
        expect(toggleCheckLine('>> - [ ] Deploy server', '-')).toBe('>> - [x] Deploy server');
    });
    it('toggles [x] to [ ]', () => {
        expect(toggleCheckLine('>> - [x] Deploy server', '-')).toBe('>> - [ ] Deploy server');
    });
    it('works on numbered items', () => {
        expect(toggleCheckLine('>> 1. [ ] Task one', '-')).toBe('>> 1. [x] Task one');
    });
    it('returns null for a non-item line', () => {
        expect(toggleCheckLine('plain text', '-')).toBeNull();
    });
    it('returns null for a header line', () => {
        expect(toggleCheckLine('> My Header', '-')).toBeNull();
    });
});

describe('countChecks', () => {
    it('returns zero done and total for a section with no checkboxes', () => {
        const doc = makeDoc(['> H', '>> - plain item', '>> - another']);
        expect(countChecks(doc, 0, 2, '-')).toEqual({ done: 0, total: 0 });
    });
    it('counts done and total correctly', () => {
        const doc = makeDoc(['> H', '>> - [x] done', '>> - [ ] todo', '>> - plain']);
        expect(countChecks(doc, 0, 3, '-')).toEqual({ done: 1, total: 2 });
    });
    it('counts all done when all checked', () => {
        const doc = makeDoc(['> H', '>> - [x] a', '>> - [x] b']);
        expect(countChecks(doc, 0, 2, '-')).toEqual({ done: 2, total: 2 });
    });
    it('only counts within the given line range', () => {
        const doc = makeDoc(['> H', '>> - [x] a', '> H2', '>> - [ ] b']);
        expect(countChecks(doc, 0, 1, '-')).toEqual({ done: 1, total: 1 });
    });
});
