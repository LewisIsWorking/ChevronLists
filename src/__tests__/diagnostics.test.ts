import { describe, it, expect } from 'bun:test';
import { collectIssues } from '../diagnostics';
import type { LineReader } from '../types';

function makeDoc(lines: string[]): LineReader {
    return { lineCount: lines.length, lineAt: (i: number) => ({ text: lines[i] }) };
}

describe('collectIssues — empty sections', () => {
    it('flags a header with no items', () => {
        const doc    = makeDoc(['> EmptyHeader']);
        const issues = collectIssues(doc, '-');
        expect(issues).toHaveLength(1);
        expect(issues[0].kind).toBe('empty-section');
        expect(issues[0].line).toBe(0);
    });

    it('does not flag a header with items', () => {
        const doc    = makeDoc(['> Header', '>> - item']);
        const issues = collectIssues(doc, '-');
        expect(issues).toHaveLength(0);
    });

    it('flags empty section among populated ones', () => {
        const doc = makeDoc(['> Full', '>> - item', '> Empty', '> AnotherFull', '>> - item']);
        const issues = collectIssues(doc, '-');
        expect(issues).toHaveLength(1);
        expect(issues[0].line).toBe(2);
    });
});

describe('collectIssues — duplicate headers', () => {
    it('flags a duplicate section name', () => {
        const doc    = makeDoc(['> Alpha', '>> - item', '> Alpha', '>> - item']);
        const issues = collectIssues(doc, '-');
        expect(issues.some(i => i.kind === 'duplicate-header')).toBe(true);
        expect(issues.find(i => i.kind === 'duplicate-header')?.line).toBe(2);
    });

    it('duplicate check is case-insensitive', () => {
        const doc    = makeDoc(['> Alpha', '>> - item', '> alpha', '>> - item']);
        const issues = collectIssues(doc, '-');
        expect(issues.some(i => i.kind === 'duplicate-header')).toBe(true);
    });

    it('does not flag unique headers', () => {
        const doc    = makeDoc(['> Alpha', '>> - item', '> Beta', '>> - item']);
        const issues = collectIssues(doc, '-');
        expect(issues.some(i => i.kind === 'duplicate-header')).toBe(false);
    });
});

describe('collectIssues — bad numbering', () => {
    it('flags an out-of-sequence number', () => {
        const doc    = makeDoc(['> Header', '>> 1. first', '>> 3. third']);
        const issues = collectIssues(doc, '-');
        expect(issues.some(i => i.kind === 'bad-numbering')).toBe(true);
        expect(issues.find(i => i.kind === 'bad-numbering')?.line).toBe(2);
    });

    it('does not flag correct sequence', () => {
        const doc    = makeDoc(['> Header', '>> 1. first', '>> 2. second', '>> 3. third']);
        const issues = collectIssues(doc, '-');
        expect(issues.some(i => i.kind === 'bad-numbering')).toBe(false);
    });

    it('resets counter for each new section', () => {
        const doc    = makeDoc(['> A', '>> 1. one', '>> 2. two', '> B', '>> 1. one', '>> 2. two']);
        const issues = collectIssues(doc, '-');
        expect(issues).toHaveLength(0);
    });

    it('tracks depth independently', () => {
        const doc    = makeDoc(['> Header', '>> 1. one', '>>> 1. nested', '>>> 2. nested', '>> 2. two']);
        const issues = collectIssues(doc, '-');
        expect(issues).toHaveLength(0);
    });
});
