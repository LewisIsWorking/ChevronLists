import { describe, it, expect } from 'bun:test';
import { parseNumbered } from '../patterns';

// Mirror the defaultN logic from listStartCommands
function inferDefault(lineText: string): number {
    const existing = parseNumbered(lineText);
    return existing ? existing.num : 1;
}

// Mirror rebase logic for testing
function rebaseFrom(lines: string[], fromIndex: number, startNum: number): string[] {
    const counters = new Map<string, number>();
    const firstChevrons = parseNumbered(lines[fromIndex])?.chevrons ?? '>>';
    counters.set(firstChevrons, startNum - 1);
    return lines.map((line, i) => {
        if (i < fromIndex) { return line; }
        const n = parseNumbered(line);
        if (!n) { return line; }
        const prev = counters.get(n.chevrons) ?? startNum - 1;
        const next = prev + 1;
        counters.set(n.chevrons, next);
        return `${n.chevrons} ${next}. ${n.content}`;
    });
}

describe('inferDefault for set list start number', () => {
    it('suggests 1 for a non-numbered line', () => {
        expect(inferDefault('>> - bullet')).toBe(1);
    });
    it('suggests current number (not +1) for a numbered line', () => {
        // In rebase mode we default to the current number so user can change it
        expect(inferDefault('>> 2. Test')).toBe(2);
    });
    it('suggests 1 for a header line', () => {
        expect(inferDefault('> Header')).toBe(1);
    });
    it('handles multi-digit numbers', () => {
        expect(inferDefault('>> 69. Test')).toBe(69);
    });
});

describe('rebaseFrom', () => {
    it('renumbers from cursor item with new start', () => {
        const lines  = ['>> 1. first', '>> 2. second', '>> 3. third'];
        const result = rebaseFrom(lines, 1, 69);
        expect(result[0]).toBe('>> 1. first');   // untouched
        expect(result[1]).toBe('>> 69. second'); // new start
        expect(result[2]).toBe('>> 70. third');  // continues from 69
    });
    it('rebases from the first item', () => {
        const lines  = ['>> 1. a', '>> 2. b'];
        const result = rebaseFrom(lines, 0, 10);
        expect(result[0]).toBe('>> 10. a');
        expect(result[1]).toBe('>> 11. b');
    });
    it('leaves non-numbered lines untouched', () => {
        const lines  = ['>> 1. item', '> Header', '>> 2. other'];
        const result = rebaseFrom(lines, 0, 5);
        expect(result[1]).toBe('> Header');
    });
});
