import { describe, it, expect } from 'bun:test';
import { isHeader, parseBullet, parseNumbered } from '../patterns';
import { getSectionRange } from '../documentUtils';
import type { LineReader } from '../types';

// ── Pure outline-building logic mirrored from outlineProvider.ts ─────────────

interface SymbolChild  { name: string; kind: 'bullet' | 'numbered'; }
interface OutlineSymbol { name: string; detail: string; children: SymbolChild[]; startLine: number; }

function makeDoc(lines: string[]): LineReader {
    return { lineCount: lines.length, lineAt: (i: number) => ({ text: lines[i] }) };
}

function buildOutline(doc: LineReader, prefix: string): OutlineSymbol[] {
    const symbols: OutlineSymbol[] = [];
    for (let i = 0; i < doc.lineCount; i++) {
        const text = doc.lineAt(i).text;
        if (!isHeader(text)) { continue; }
        const headerName   = text.replace(/^> /, '');
        const [start, end] = getSectionRange(doc, i);
        let itemCount      = 0;
        const children: SymbolChild[] = [];
        for (let j = start + 1; j <= end; j++) {
            const line    = doc.lineAt(j).text;
            const bullet  = parseBullet(line, prefix);
            const numbered = parseNumbered(line);
            if (bullet && bullet.content) {
                itemCount++;
                children.push({ name: bullet.content, kind: 'bullet' });
            } else if (numbered && numbered.content) {
                itemCount++;
                children.push({ name: `${numbered.num}. ${numbered.content}`, kind: 'numbered' });
            }
        }
        symbols.push({
            name:      headerName,
            detail:    itemCount === 1 ? '1 item' : `${itemCount} items`,
            children,
            startLine: i,
        });
    }
    return symbols;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('buildOutline', () => {
    it('returns empty array for a file with no headers', () => {
        const doc = makeDoc(['>> - item', 'plain text']);
        expect(buildOutline(doc, '-')).toHaveLength(0);
    });

    it('creates one symbol per header', () => {
        const doc = makeDoc(['> Alpha', '>> - a', '> Beta', '>> - b']);
        const symbols = buildOutline(doc, '-');
        expect(symbols).toHaveLength(2);
        expect(symbols[0].name).toBe('Alpha');
        expect(symbols[1].name).toBe('Beta');
    });

    it('strips the > prefix from header name', () => {
        const doc = makeDoc(['> My Section']);
        expect(buildOutline(doc, '-')[0].name).toBe('My Section');
    });

    it('shows correct item count in detail', () => {
        const doc = makeDoc(['> Header', '>> - one', '>> - two', '>> - three']);
        expect(buildOutline(doc, '-')[0].detail).toBe('3 items');
    });

    it('uses singular "1 item" for a single item', () => {
        const doc = makeDoc(['> Header', '>> - only']);
        expect(buildOutline(doc, '-')[0].detail).toBe('1 item');
    });

    it('shows "0 items" for an empty section', () => {
        const doc = makeDoc(['> Header']);
        expect(buildOutline(doc, '-')[0].detail).toBe('0 items');
    });

    it('adds bullet children with correct names', () => {
        const doc = makeDoc(['> Header', '>> - Alpha', '>> - Beta']);
        const children = buildOutline(doc, '-')[0].children;
        expect(children).toHaveLength(2);
        expect(children[0]).toMatchObject({ name: 'Alpha', kind: 'bullet' });
        expect(children[1]).toMatchObject({ name: 'Beta',  kind: 'bullet' });
    });

    it('adds numbered children with number prefix', () => {
        const doc = makeDoc(['> Header', '>> 1. First', '>> 2. Second']);
        const children = buildOutline(doc, '-')[0].children;
        expect(children[0]).toMatchObject({ name: '1. First',  kind: 'numbered' });
        expect(children[1]).toMatchObject({ name: '2. Second', kind: 'numbered' });
    });

    it('records the correct start line for each section', () => {
        const doc = makeDoc(['plain', '> Header', '>> - item']);
        expect(buildOutline(doc, '-')[0].startLine).toBe(1);
    });

    it('does not include empty-content items as children', () => {
        const doc = makeDoc(['> Header', '>> - ', '>> - RealItem']);
        const children = buildOutline(doc, '-')[0].children;
        expect(children).toHaveLength(1);
        expect(children[0].name).toBe('RealItem');
    });

    it('works with custom prefix', () => {
        const doc = makeDoc(['> Header', '>> * CustomItem']);
        const children = buildOutline(doc, '*')[0].children;
        expect(children[0].name).toBe('CustomItem');
    });
});
