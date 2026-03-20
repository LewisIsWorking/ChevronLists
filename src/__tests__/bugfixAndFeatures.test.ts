import { describe, it, expect } from 'bun:test';
import { extractLabels } from '../patterns';
import type { LineReader } from '../types';

// ── Exported pure helper for Convert Bullets to Numbered ──────────────────────
// Mirror the conversion logic for testing without VS Code
function convertBulletsToNumbered(lines: string[], prefix: string): string[] {
    const maxNum = new Map<string, number>();
    // First pass: find existing numbered items
    for (const line of lines) {
        const m = line.match(/^(>{2,}) (\d+)\. /);
        if (m) {
            const cur = maxNum.get(m[1]) ?? 0;
            maxNum.set(m[1], Math.max(cur, parseInt(m[2], 10)));
        }
    }
    // Second pass: convert bullets
    return lines.map(line => {
        const m = line.match(new RegExp(`^(>{2,}) ${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} (.*)$`));
        if (!m) { return line; }
        const chevrons = m[1];
        const content  = m[2];
        const next     = (maxNum.get(chevrons) ?? 0) + 1;
        maxNum.set(chevrons, next);
        return `${chevrons} ${next}. ${content}`;
    });
}

describe('extractLabels', () => {
    it('extracts a single label', () => {
        const r = extractLabels('[BRIDGE]');
        expect(r).toHaveLength(1);
        expect(r[0].text).toBe('[BRIDGE]');
        expect(r[0].start).toBe(0);
    });
    it('extracts multiple labels', () => {
        expect(extractLabels('[ACT ONE] and [ACT TWO]')).toHaveLength(2);
    });
    it('returns empty for no labels', () => {
        expect(extractLabels('plain item')).toHaveLength(0);
    });
    it('records correct start/end positions', () => {
        const r = extractLabels('text [LABEL] more');
        expect(r[0].start).toBe(5);
        expect(r[0].end).toBe(12);
    });
    it('handles empty brackets', () => {
        expect(extractLabels('[]')).toHaveLength(1);
    });
});

describe('convertBulletsToNumbered', () => {
    it('converts bullet items to numbered starting from 1', () => {
        const result = convertBulletsToNumbered(['>> - alpha', '>> - beta'], '-');
        expect(result[0]).toBe('>> 1. alpha');
        expect(result[1]).toBe('>> 2. beta');
    });
    it('continues from the last existing number', () => {
        const result = convertBulletsToNumbered(['>> 1. first', '>> 2. second', '>> - third'], '-');
        expect(result[2]).toBe('>> 3. third');
    });
    it('leaves non-bullet lines unchanged', () => {
        const result = convertBulletsToNumbered(['> Header', '>> - item'], '-');
        expect(result[0]).toBe('> Header');
    });
    it('preserves content exactly', () => {
        const result = convertBulletsToNumbered(['>> - Hello world!'], '-');
        expect(result[0]).toBe('>> 1. Hello world!');
    });
    it('handles depth independently', () => {
        const result = convertBulletsToNumbered(['>> - top', '>>> - nested'], '-');
        expect(result[0]).toBe('>> 1. top');
        expect(result[1]).toBe('>>> 1. nested');
    });
});
