import { describe, it, expect } from 'bun:test';
import { toggleWrap, applyUnicodeUnderline, removeUnicodeUnderline, isUnicodeUnderlined } from '../patterns';

describe('toggleWrap', () => {
    it('wraps plain text in bold', () => expect(toggleWrap('hello', 'bold')).toBe('**hello**'));
    it('unwraps already-bold text', () => expect(toggleWrap('**hello**', 'bold')).toBe('hello'));
    it('wraps in italic', () => expect(toggleWrap('hello', 'italic')).toBe('_hello_'));
    it('unwraps italic', () => expect(toggleWrap('_hello_', 'italic')).toBe('hello'));
    it('wraps in mono', () => expect(toggleWrap('hello', 'mono')).toBe('`hello`'));
    it('wraps in strikethrough', () => expect(toggleWrap('hello', 'strike')).toBe('~~hello~~'));
    it('wraps the empty bold marker string', () => {
        // '**' is not treated as bold content (length 2 not > 4), so it gets wrapped
        expect(toggleWrap('**', 'bold')).toBe('******');
    });
});

describe('unicode underline', () => {
    it('applies combining underline to each character', () => {
        const result = applyUnicodeUnderline('hi');
        expect(result).toBe('h\u0332i\u0332');
    });
    it('removes combining underline', () => {
        expect(removeUnicodeUnderline('h\u0332i\u0332')).toBe('hi');
    });
    it('detects underlined text', () => {
        expect(isUnicodeUnderlined('h\u0332i')).toBe(true);
    });
    it('detects non-underlined text', () => {
        expect(isUnicodeUnderlined('hello')).toBe(false);
    });
    it('roundtrip: apply then remove returns original', () => {
        const original = 'hello world';
        expect(removeUnicodeUnderline(applyUnicodeUnderline(original))).toBe(original);
    });
});
