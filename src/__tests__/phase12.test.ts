import { describe, it, expect } from 'bun:test';
import type { LineReader } from '../types';

function makeDoc(lines: string[]): LineReader {
    return { lineCount: lines.length, lineAt: (i: number) => ({ text: lines[i] }) };
}

// Mirror convert numbered to bullets logic
function convertNumberedToBullets(lines: string[], prefix: string): string[] {
    return lines.map(line => {
        const m = line.match(/^(>{2,}) \d+\. (.*)$/);
        if (!m) { return line; }
        return `${m[1]} ${prefix} ${m[2]}`;
    });
}

// Mirror paste as bullets logic
function pasteAsBullets(clipLines: string[], prefix: string): string[] {
    return clipLines.filter(Boolean).map(l => `>> ${prefix} ${l.trim()}`);
}

// Mirror paste as numbered logic
function pasteAsNumbered(clipLines: string[], startNum: number): string[] {
    let n = startNum;
    return clipLines.filter(Boolean).map(l => `>> ${n++}. ${l.trim()}`);
}

describe('convertNumberedToBullets', () => {
    it('converts numbered items to bullets', () => {
        const r = convertNumberedToBullets(['>> 1. alpha', '>> 2. beta'], '-');
        expect(r[0]).toBe('>> - alpha');
        expect(r[1]).toBe('>> - beta');
    });
    it('leaves non-numbered lines unchanged', () => {
        expect(convertNumberedToBullets(['> Header'], '-')[0]).toBe('> Header');
    });
    it('preserves content exactly', () => {
        expect(convertNumberedToBullets(['>> 3. Hello world!'], '-')[0]).toBe('>> - Hello world!');
    });
    it('handles deeper nesting', () => {
        expect(convertNumberedToBullets(['>>> 1. nested'], '-')[0]).toBe('>>> - nested');
    });
    it('works with custom prefix', () => {
        expect(convertNumberedToBullets(['>> 1. item'], '*')[0]).toBe('>> * item');
    });
});

describe('pasteAsBullets', () => {
    it('converts plain lines to bullet items', () => {
        const r = pasteAsBullets(['first line', 'second line'], '-');
        expect(r[0]).toBe('>> - first line');
        expect(r[1]).toBe('>> - second line');
    });
    it('filters out empty lines', () => {
        expect(pasteAsBullets(['', 'item', ''], '-')).toHaveLength(1);
    });
    it('trims whitespace', () => {
        expect(pasteAsBullets(['  padded  '], '-')[0]).toBe('>> - padded');
    });
});

describe('pasteAsNumbered', () => {
    it('starts numbering from the given start', () => {
        const r = pasteAsNumbered(['alpha', 'beta'], 3);
        expect(r[0]).toBe('>> 3. alpha');
        expect(r[1]).toBe('>> 4. beta');
    });
    it('starts from 1 when no prior items', () => {
        expect(pasteAsNumbered(['item'], 1)[0]).toBe('>> 1. item');
    });
    it('filters empty lines', () => {
        expect(pasteAsNumbered(['', 'item', ''], 1)).toHaveLength(1);
    });
});
