import { describe, it, expect } from 'bun:test';
import { isHeader, parseBullet, parseNumbered, extractLabels } from '../patterns';

// ── Pure token-range logic mirrored from semanticProvider.ts ─────────────────

interface TokenRange {
    line:      number;
    startChar: number;
    length:    number;
    type:      string;
}

function tokeniseLine(lineIndex: number, text: string, prefix: string): TokenRange[] {
    const tokens: TokenRange[] = [];

    if (isHeader(text)) {
        tokens.push({ line: lineIndex, startChar: 0, length: 2, type: 'chevronPrefix' });
        if (text.length > 2) {
            tokens.push({ line: lineIndex, startChar: 2, length: text.length - 2, type: 'chevronHeader' });
        }
        return tokens;
    }

    const bullet = parseBullet(text, prefix);
    if (bullet) {
        const prefixLen = bullet.chevrons.length + 1 + prefix.length + 1;
        tokens.push({ line: lineIndex, startChar: 0, length: prefixLen, type: 'chevronPrefix' });
        if (bullet.content.length > 0) {
            tokens.push({ line: lineIndex, startChar: prefixLen, length: bullet.content.length, type: 'chevronContent' });
            for (const lbl of extractLabels(bullet.content)) {
                tokens.push({ line: lineIndex, startChar: prefixLen + lbl.start, length: lbl.text.length, type: 'chevronLabel' });
            }
        }
        return tokens;
    }

    const numbered = parseNumbered(text);
    if (numbered) {
        const chevronLen  = numbered.chevrons.length + 1;
        const numStr      = String(numbered.num);
        const dotAndSpace = 2;
        const contentStart = chevronLen + numStr.length + dotAndSpace;
        tokens.push({ line: lineIndex, startChar: 0, length: chevronLen, type: 'chevronPrefix' });
        tokens.push({ line: lineIndex, startChar: chevronLen, length: numStr.length, type: 'chevronNumber' });
        tokens.push({ line: lineIndex, startChar: chevronLen + numStr.length, length: dotAndSpace, type: 'chevronPrefix' });
        if (numbered.content.length > 0) {
            tokens.push({ line: lineIndex, startChar: contentStart, length: numbered.content.length, type: 'chevronContent' });
            for (const lbl of extractLabels(numbered.content)) {
                tokens.push({ line: lineIndex, startChar: contentStart + lbl.start, length: lbl.text.length, type: 'chevronLabel' });
            }
        }
        return tokens;
    }

    return tokens;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('tokeniseLine — header', () => {
    it('produces prefix and header tokens', () => {
        const tokens = tokeniseLine(0, '> My Header', '-');
        expect(tokens).toHaveLength(2);
        expect(tokens[0]).toMatchObject({ startChar: 0, length: 2, type: 'chevronPrefix' });
        expect(tokens[1]).toMatchObject({ startChar: 2, length: 9, type: 'chevronHeader' });
    });
    it('returns no tokens for a bare "> " with no content', () => {
        // "> " alone doesn't match HEADER_RE (requires a non-> char after "> ")
        const tokens = tokeniseLine(0, '> ', '-');
        expect(tokens).toHaveLength(0);
    });
});

describe('tokeniseLine — bullet item', () => {
    it('produces prefix and content tokens', () => {
        const tokens = tokeniseLine(1, '>> - hello', '-');
        expect(tokens).toHaveLength(2);
        expect(tokens[0]).toMatchObject({ startChar: 0, length: 5, type: 'chevronPrefix' }); // ">> - "
        expect(tokens[1]).toMatchObject({ startChar: 5, length: 5, type: 'chevronContent' }); // "hello"
    });
    it('produces only prefix token for empty bullet', () => {
        const tokens = tokeniseLine(0, '>> - ', '-');
        expect(tokens).toHaveLength(1);
        expect(tokens[0].type).toBe('chevronPrefix');
    });
    it('handles deeper nesting correctly', () => {
        const tokens = tokeniseLine(0, '>>> - deep', '-');
        expect(tokens[0].length).toBe(6); // ">>> - "
        expect(tokens[1].startChar).toBe(6);
    });
    it('works with custom prefix', () => {
        const tokens = tokeniseLine(0, '>> * item', '*');
        expect(tokens[0].length).toBe(5); // ">> * "
    });
});

describe('tokeniseLine — numbered item', () => {
    it('produces prefix, number, separator and content tokens', () => {
        const tokens = tokeniseLine(0, '>> 1. first', '-');
        expect(tokens).toHaveLength(4);
        expect(tokens[0]).toMatchObject({ startChar: 0, length: 3, type: 'chevronPrefix' }); // ">> "
        expect(tokens[1]).toMatchObject({ startChar: 3, length: 1, type: 'chevronNumber' }); // "1"
        expect(tokens[2]).toMatchObject({ startChar: 4, length: 2, type: 'chevronPrefix' }); // ". "
        expect(tokens[3]).toMatchObject({ startChar: 6, length: 5, type: 'chevronContent' }); // "first"
    });
    it('handles multi-digit numbers correctly', () => {
        const tokens = tokeniseLine(0, '>> 42. item', '-');
        expect(tokens[1]).toMatchObject({ startChar: 3, length: 2, type: 'chevronNumber' }); // "42"
        expect(tokens[2]).toMatchObject({ startChar: 5, length: 2, type: 'chevronPrefix' }); // ". "
        expect(tokens[3].startChar).toBe(7);
    });
    it('returns no content token for empty numbered item', () => {
        const tokens = tokeniseLine(0, '>> 1. ', '-');
        expect(tokens.find(t => t.type === 'chevronContent')).toBeUndefined();
    });
});

describe('tokeniseLine — non-chevron lines', () => {
    it('returns no tokens for plain text', () => {
        expect(tokeniseLine(0, 'just text', '-')).toHaveLength(0);
    });
    it('returns no tokens for an empty line', () => {
        expect(tokeniseLine(0, '', '-')).toHaveLength(0);
    });
    it('returns no tokens for a markdown heading', () => {
        expect(tokeniseLine(0, '# Heading', '-')).toHaveLength(0);
    });
});

describe('tokeniseLine — chevronLabel tokens', () => {
    it('produces a chevronLabel token for [LABEL] in a bullet item', () => {
        const tokens = tokeniseLine(0, '>> - [ACTION] do thing', '-');
        expect(tokens.some(t => t.type === 'chevronLabel')).toBe(true);
    });
    it('produces a chevronLabel token for [LABEL] in a numbered item', () => {
        const tokens = tokeniseLine(0, '>> 1. [NOTE] check this', '-');
        expect(tokens.some(t => t.type === 'chevronLabel')).toBe(true);
    });
    it('does not produce chevronLabel for items with no brackets', () => {
        const tokens = tokeniseLine(0, '>> - plain item', '-');
        expect(tokens.some(t => t.type === 'chevronLabel')).toBe(false);
    });
});
