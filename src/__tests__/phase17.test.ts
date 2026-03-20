import { describe, it, expect } from 'bun:test';
import { isHeader } from '../patterns';
import type { LineReader } from '../types';

function makeDoc(lines: string[]): LineReader {
    return { lineCount: lines.length, lineAt: (i: number) => ({ text: lines[i] }) };
}

// Mirror section sort logic for testing
interface SectionBlock { name: string; lines: string[]; }

function collectSectionBlocks(lines: string[]): SectionBlock[] {
    const blocks: SectionBlock[] = [];
    let current: SectionBlock | null = null;
    for (const line of lines) {
        if (isHeader(line)) {
            if (current) { blocks.push(current); }
            current = { name: line.replace(/^> /, '').toLowerCase(), lines: [line] };
        } else if (current) {
            current.lines.push(line);
        }
    }
    if (current) { blocks.push(current); }
    return blocks;
}

function sortSections(lines: string[], ascending: boolean): string {
    const blocks = collectSectionBlocks(lines);
    const sorted = [...blocks].sort((a, b) =>
        ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
    return sorted.map(b => b.lines.join('\n')).join('\n');
}

describe('sortSections A→Z', () => {
    it('sorts sections alphabetically', () => {
        const lines = ['> Zebra', '>> - z item', '> Apple', '>> - a item'];
        const result = sortSections(lines, true);
        expect(result.indexOf('Apple')).toBeLessThan(result.indexOf('Zebra'));
    });
    it('handles single section', () => {
        const lines = ['> Only', '>> - item'];
        expect(sortSections(lines, true)).toContain('Only');
    });
    it('preserves all items under each header', () => {
        const lines = ['> B Section', '>> - b1', '>> - b2', '> A Section', '>> - a1'];
        const result = sortSections(lines, true);
        const aIdx = result.indexOf('A Section');
        const a1Idx = result.indexOf('a1');
        const bIdx = result.indexOf('B Section');
        expect(aIdx).toBeLessThan(bIdx);
        expect(a1Idx).toBeGreaterThan(aIdx);
        expect(a1Idx).toBeLessThan(bIdx);
    });
});

describe('sortSections Z→A', () => {
    it('sorts sections reverse alphabetically', () => {
        const lines = ['> Apple', '>> - a', '> Zebra', '>> - z'];
        const result = sortSections(lines, false);
        expect(result.indexOf('Zebra')).toBeLessThan(result.indexOf('Apple'));
    });
});
