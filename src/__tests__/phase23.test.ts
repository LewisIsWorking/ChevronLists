import { describe, it, expect } from 'bun:test';
import { incrementFirstNumber } from '../patterns';

describe('incrementFirstNumber', () => {
    it('increments the first number in content', () => {
        expect(incrementFirstNumber('Draw card 1')).toBe('Draw card 2');
    });
    it('increments correctly with multi-digit numbers', () => {
        expect(incrementFirstNumber('Step 10 of combo')).toBe('Step 11 of combo');
    });
    it('only increments the first number', () => {
        expect(incrementFirstNumber('Card 1 draw 3')).toBe('Card 2 draw 3');
    });
    it('returns null when no number found', () => {
        expect(incrementFirstNumber('no numbers here')).toBeNull();
    });
    it('increments numbers at the start of content', () => {
        expect(incrementFirstNumber('1 item')).toBe('2 item');
    });
    it('handles single digit to double digit', () => {
        expect(incrementFirstNumber('Card 9')).toBe('Card 10');
    });
});
