import { describe, it, expect } from 'bun:test';
import { toTitleCase } from '../patterns';

describe('toTitleCase', () => {
    it('capitalises first letter of each word', () => {
        expect(toTitleCase('hello world')).toBe('Hello World');
    });
    it('handles already-cased text', () => {
        expect(toTitleCase('UPPER lower')).toBe('UPPER Lower');
    });
    it('handles single word', () => {
        expect(toTitleCase('item')).toBe('Item');
    });
    it('handles empty string', () => {
        expect(toTitleCase('')).toBe('');
    });
    it('handles text with markers', () => {
        expect(toTitleCase('[action] do thing')).toBe('[Action] Do Thing');
    });
});
