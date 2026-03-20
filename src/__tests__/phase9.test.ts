import { describe, it, expect } from 'bun:test';
import { toMarkdownDocument } from '../markdownExporter';
import type { LineReader } from '../types';

function makeDoc(lines: string[]): LineReader {
    return { lineCount: lines.length, lineAt: (i: number) => ({ text: lines[i] }) };
}

describe('toMarkdownDocument', () => {
    it('converts a header to ## heading', () => {
        const doc = makeDoc(['> My Section', '>> - item']);
        expect(toMarkdownDocument(doc as any, '-')).toContain('## My Section');
    });
    it('converts bullet items to - list entries', () => {
        const doc = makeDoc(['> H', '>> - first item']);
        expect(toMarkdownDocument(doc as any, '-')).toContain('- first item');
    });
    it('converts numbered items correctly', () => {
        const doc = makeDoc(['> H', '>> 1. step one']);
        expect(toMarkdownDocument(doc as any, '-')).toContain('1. step one');
    });
    it('indents nested items', () => {
        const doc = makeDoc(['> H', '>>> - nested']);
        const result = toMarkdownDocument(doc as any, '-');
        expect(result).toContain('  - nested');
    });
    it('adds blank lines between sections', () => {
        const doc = makeDoc(['> A', '>> - a item', '> B', '>> - b item']);
        const lines = toMarkdownDocument(doc as any, '-').split('\n');
        const headerBIdx = lines.findIndex(l => l === '## B');
        expect(lines[headerBIdx - 1]).toBe('');
    });
    it('handles a file with no headers', () => {
        const doc = makeDoc(['plain text']);
        expect(toMarkdownDocument(doc as any, '-')).toBe('\n');
    });
});

describe('jumpHistory module', () => {
    it('toMarkdownDocument is a function', () => {
        expect(typeof toMarkdownDocument).toBe('function');
    });
});
