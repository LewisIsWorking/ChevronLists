import { describe, it, expect } from 'bun:test';

// Pure helper functions extracted for testing without VS Code dependency
function bulletToMarkdown(text: string, prefix: string): string | null {
    const re    = new RegExp(`^(>{2,}) ${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} (.*)$`);
    const match = text.match(re);
    if (!match) { return null; }
    const depth  = match[1].length - 2;
    const indent = '  '.repeat(depth);
    return `${indent}- ${match[2]}`;
}

function numberedToMarkdown(text: string): string | null {
    const match = text.match(/^(>{2,}) (\d+)\. (.*)$/);
    if (!match) { return null; }
    const depth  = match[1].length - 2;
    const indent = '  '.repeat(depth);
    return `${indent}${match[2]}. ${match[3]}`;
}

function bulletToPlain(text: string, prefix: string): string | null {
    const re    = new RegExp(`^(>{2,}) ${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} (.*)$`);
    const match = text.match(re);
    return match ? match[2] : null;
}

function numberedToPlain(text: string): string | null {
    const match = text.match(/^(>{2,}) (\d+)\. (.*)$/);
    return match ? match[3] : null;
}

describe('bulletToMarkdown', () => {
    it('converts a >> - line to a markdown bullet', () => {
        expect(bulletToMarkdown('>> - hello', '-')).toBe('- hello');
    });
    it('indents deeper nesting correctly', () => {
        expect(bulletToMarkdown('>>> - nested', '-')).toBe('  - nested');
        expect(bulletToMarkdown('>>>> - deep', '-')).toBe('    - deep');
    });
    it('returns null for non-bullet lines', () => {
        expect(bulletToMarkdown('> Header', '-')).toBeNull();
        expect(bulletToMarkdown('plain text', '-')).toBeNull();
    });
    it('works with a custom prefix', () => {
        expect(bulletToMarkdown('>> * item', '*')).toBe('- item');
    });
    it('preserves empty content', () => {
        expect(bulletToMarkdown('>> - ', '-')).toBe('- ');
    });
});

describe('numberedToMarkdown', () => {
    it('converts a >> 1. line to a markdown numbered item', () => {
        expect(numberedToMarkdown('>> 1. first')).toBe('1. first');
    });
    it('indents deeper nesting correctly', () => {
        expect(numberedToMarkdown('>>> 2. nested')).toBe('  2. nested');
    });
    it('returns null for non-numbered lines', () => {
        expect(numberedToMarkdown('>> - item')).toBeNull();
        expect(numberedToMarkdown('> header')).toBeNull();
    });
    it('preserves higher numbers', () => {
        expect(numberedToMarkdown('>> 42. item')).toBe('42. item');
    });
});

describe('bulletToPlain', () => {
    it('extracts just the content', () => {
        expect(bulletToPlain('>> - hello world', '-')).toBe('hello world');
    });
    it('returns null for non-bullet lines', () => {
        expect(bulletToPlain('> Header', '-')).toBeNull();
    });
    it('works with custom prefix', () => {
        expect(bulletToPlain('>> * item', '*')).toBe('item');
    });
});

describe('numberedToPlain', () => {
    it('extracts just the content', () => {
        expect(numberedToPlain('>> 3. hello world')).toBe('hello world');
    });
    it('returns null for non-numbered lines', () => {
        expect(numberedToPlain('>> - item')).toBeNull();
    });
    it('returns empty string for empty item', () => {
        expect(numberedToPlain('>> 1. ')).toBe('');
    });
});
