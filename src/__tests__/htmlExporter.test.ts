import { describe, it, expect } from 'bun:test';
import { escHtml, renderContent, slugify, buildHtml } from '../htmlExporter';
import type { LineReader } from '../types';

function makeDoc(lines: string[]): LineReader {
    return { lineCount: lines.length, lineAt: (i: number) => ({ text: lines[i] }) };
}

describe('escHtml', () => {
    it('escapes &', () => expect(escHtml('a & b')).toBe('a &amp; b'));
    it('escapes <',  () => expect(escHtml('<b>')).toBe('&lt;b&gt;'));
    it('leaves plain text unchanged', () => expect(escHtml('hello')).toBe('hello'));
});

describe('slugify', () => {
    it('lowercases and replaces spaces with hyphens', () => {
        expect(slugify('My Section')).toBe('my-section');
    });
    it('strips special characters', () => {
        expect(slugify('Hello, World!')).toBe('hello-world');
    });
    it('collapses multiple hyphens', () => {
        expect(slugify('a  --  b')).toBe('a-b');
    });
});

describe('renderContent', () => {
    it('converts [[link]] to an anchor', () => {
        expect(renderContent('See [[Target]]')).toContain('<a class="cl-link"');
        expect(renderContent('See [[Target]]')).toContain('Target');
    });
    it('converts #tag to a badge span', () => {
        expect(renderContent('item #urgent')).toContain('<span class="cl-tag">');
        expect(renderContent('item #urgent')).toContain('#urgent');
    });
    it('handles both links and tags', () => {
        const r = renderContent('See [[X]] and #tag');
        expect(r).toContain('cl-link');
        expect(r).toContain('cl-tag');
    });
    it('escapes HTML in content', () => {
        expect(renderContent('a < b')).toContain('&lt;');
    });
});

describe('buildHtml', () => {
    it('returns a complete HTML document', () => {
        const doc = makeDoc(['> Header', '>> - item']);
        const html = buildHtml(doc as any, '-', 'Test');
        expect(html).toContain('<!DOCTYPE html>');
        expect(html).toContain('<title>Test</title>');
    });
    it('renders section headers as <details> elements', () => {
        const doc = makeDoc(['> My Section', '>> - item']);
        expect(buildHtml(doc as any, '-', 'f')).toContain('My Section');
    });
    it('renders [x] items with cl-done class', () => {
        const doc = makeDoc(['> H', '>> - [x] done item']);
        expect(buildHtml(doc as any, '-', 'f')).toContain('cl-done');
    });
    it('renders numbered items with cl-num span', () => {
        const doc = makeDoc(['> H', '>> 1. numbered item']);
        expect(buildHtml(doc as any, '-', 'f')).toContain('cl-num');
    });
    it('renders #tags as cl-tag badges', () => {
        const doc = makeDoc(['> H', '>> - item #urgent']);
        expect(buildHtml(doc as any, '-', 'f')).toContain('cl-tag');
    });
    it('renders [[links]] as cl-link anchors', () => {
        const doc = makeDoc(['> H', '>> - See [[Other Section]]']);
        expect(buildHtml(doc as any, '-', 'f')).toContain('cl-link');
    });
    it('returns empty sections array for a file with no headers', () => {
        const doc = makeDoc(['plain text']);
        const html = buildHtml(doc as any, '-', 'f');
        expect(html).not.toContain('<details');
    });
});
