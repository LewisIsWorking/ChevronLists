import { describe, it, expect } from 'bun:test';
import {
    escapeRegex,
    bulletRE,
    parseBullet,
    parseNumbered,
    isHeader,
} from '../patterns';

describe('escapeRegex', () => {
    it('escapes special regex characters', () => {
        expect(escapeRegex('*')).toBe('\\*');
        expect(escapeRegex('.')).toBe('\\.');
        expect(escapeRegex('-')).toBe('-'); // hyphen is not special outside []
    });
});

describe('bulletRE', () => {
    it('matches a standard >> - line', () => {
        expect(bulletRE('-').test('>> - item')).toBe(true);
    });
    it('matches deeper nesting', () => {
        expect(bulletRE('-').test('>>> - item')).toBe(true);
        expect(bulletRE('-').test('>>>> - item')).toBe(true);
    });
    it('does not match a single > header', () => {
        expect(bulletRE('-').test('> header')).toBe(false);
    });
    it('respects a custom prefix', () => {
        expect(bulletRE('*').test('>> * item')).toBe(true);
        expect(bulletRE('*').test('>> - item')).toBe(false);
    });
});

describe('parseBullet', () => {
    it('returns chevrons and content for a valid bullet line', () => {
        expect(parseBullet('>> - hello', '-')).toEqual({ chevrons: '>>', content: 'hello' });
    });
    it('returns null for a non-bullet line', () => {
        expect(parseBullet('> header', '-')).toBeNull();
        expect(parseBullet('normal text', '-')).toBeNull();
    });
    it('returns empty string content for an empty bullet', () => {
        expect(parseBullet('>> - ', '-')).toEqual({ chevrons: '>>', content: '' });
    });
    it('captures the correct depth', () => {
        const result = parseBullet('>>> - deep', '-');
        expect(result?.chevrons).toBe('>>>');
    });
    it('works with a custom prefix', () => {
        expect(parseBullet('>> * item', '*')).toEqual({ chevrons: '>>', content: 'item' });
    });
});

describe('parseNumbered', () => {
    it('returns chevrons, num and content for a valid numbered line', () => {
        expect(parseNumbered('>> 1. first')).toEqual({ chevrons: '>>', num: 1, content: 'first' });
    });
    it('parses higher numbers correctly', () => {
        expect(parseNumbered('>> 42. item')?.num).toBe(42);
    });
    it('returns null for a bullet line', () => {
        expect(parseNumbered('>> - item')).toBeNull();
    });
    it('returns null for a header line', () => {
        expect(parseNumbered('> header')).toBeNull();
    });
    it('returns empty content for an empty numbered item', () => {
        expect(parseNumbered('>> 3. ')?.content).toBe('');
    });
    it('captures deep nesting', () => {
        expect(parseNumbered('>>> 2. deep')?.chevrons).toBe('>>>');
    });
});

describe('isHeader', () => {
    it('returns true for a single > line', () => {
        expect(isHeader('> My header')).toBe(true);
    });
    it('returns false for a >> bullet line', () => {
        expect(isHeader('>> - item')).toBe(false);
    });
    it('returns false for a >> numbered line', () => {
        expect(isHeader('>> 1. item')).toBe(false);
    });
    it('returns false for plain text', () => {
        expect(isHeader('just text')).toBe(false);
    });
    it('returns false for an empty string', () => {
        expect(isHeader('')).toBe(false);
    });
});
