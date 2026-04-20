import { describe, it, expect } from 'bun:test';
import { collectAgedItems, itemToMarkdown } from '../patternsExtraB';

// ─── collectAgedItems ────────────────────────────────────────────────────────

describe('collectAgedItems (patternsExtraB)', () => {
    const TODAY = new Date('2026-04-20');

    it('returns empty array when no items have @created dates', () => {
        const lines = [
            { text: '> Header' },
            { text: '>> - Plain item with no date' },
        ];
        expect(collectAgedItems(lines, '-', TODAY)).toEqual([]);
    });

    it('collects a single stamped item', () => {
        const lines = [
            { text: '> Work' },
            { text: '>> - Fix bug @created:2026-04-10' },
        ];
        const result = collectAgedItems(lines, '-', TODAY);
        expect(result).toHaveLength(1);
        expect(result[0].section).toBe('Work');
        expect(result[0].age).toBe(10);
        expect(result[0].line).toBe(1);
    });

    it('returns the raw content including @created marker', () => {
        const lines = [{ text: '>> - Task @created:2026-04-01' }];
        const result = collectAgedItems(lines, '-', TODAY);
        expect(result[0].content).toContain('@created');
    });

    it('sorts items oldest first (highest age first)', () => {
        const lines = [
            { text: '>> - Newer @created:2026-04-18' },
            { text: '>> - Older @created:2026-04-01' },
        ];
        const result = collectAgedItems(lines, '-', TODAY);
        expect(result[0].age).toBeGreaterThan(result[1].age);
    });

    it('tracks section changes across headers', () => {
        const lines = [
            { text: '> Alpha' },
            { text: '>> - Item A @created:2026-04-10' },
            { text: '> Beta' },
            { text: '>> - Item B @created:2026-04-05' },
        ];
        const result = collectAgedItems(lines, '-', TODAY);
        const sections = result.map(r => r.section);
        expect(sections).toContain('Alpha');
        expect(sections).toContain('Beta');
    });

    it('ignores non-item lines (headers, blank lines)', () => {
        const lines = [
            { text: '> Header' },
            { text: '' },
            { text: '>> - Item @created:2026-04-15' },
        ];
        expect(collectAgedItems(lines, '-', TODAY)).toHaveLength(1);
    });

    it('works with numbered items', () => {
        const lines = [{ text: '>> 1. Task @created:2026-04-10' }];
        const result = collectAgedItems(lines, '-', TODAY);
        expect(result).toHaveLength(1);
        expect(result[0].age).toBe(10);
    });
});

// ─── itemToMarkdown ──────────────────────────────────────────────────────────

describe('itemToMarkdown', () => {
    it('converts [x] checkbox to markdown checked item', () => {
        expect(itemToMarkdown('[x] Done task')).toBe('- [x] Done task');
    });

    it('converts [X] case-insensitively', () => {
        expect(itemToMarkdown('[X] Done')).toBe('- [x] Done');
    });

    it('converts [ ] to unchecked markdown item', () => {
        expect(itemToMarkdown('[ ] Todo')).toBe('- [ ] Todo');
    });

    it('converts [] (no space) to unchecked markdown item', () => {
        expect(itemToMarkdown('[] Todo')).toBe('- [ ] Todo');
    });

    it('prefixes plain content with - ', () => {
        expect(itemToMarkdown('Plain item')).toBe('- Plain item');
    });

    it('converts !!! priority to red emoji', () => {
        expect(itemToMarkdown('!!! Urgent')).toBe('- 🔴 Urgent');
    });

    it('converts !! priority to orange emoji', () => {
        expect(itemToMarkdown('!! Medium')).toBe('- 🟠 Medium');
    });

    it('converts ! priority to yellow emoji', () => {
        expect(itemToMarkdown('! Low')).toBe('- 🟡 Low');
    });

    it('converts #tags to bold', () => {
        expect(itemToMarkdown('Task #backend')).toBe('- Task **#backend**');
    });

    it('converts multiple #tags to bold', () => {
        const result = itemToMarkdown('Task #alpha #beta');
        expect(result).toContain('**#alpha**');
        expect(result).toContain('**#beta**');
    });

    it('removes colour labels', () => {
        expect(itemToMarkdown('{red} Important')).toBe('- Important');
    });

    it('removes inline // comments', () => {
        expect(itemToMarkdown('Task // private note')).toBe('- Task');
    });

    it('removes vote counts', () => {
        expect(itemToMarkdown('Idea +5')).toBe('- Idea');
    });

    it('trims trailing whitespace from the result', () => {
        expect(itemToMarkdown('Task   ')).toBe('- Task');
    });

    it('handles empty string', () => {
        expect(itemToMarkdown('')).toBe('-');
    });
});
