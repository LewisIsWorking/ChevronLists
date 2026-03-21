import { describe, it, expect } from 'bun:test';
import { parseSectionColour, setSectionColour } from '../patterns';

describe('parseSectionColour', () => {
    it('returns colour from [colour:red]', () => {
        expect(parseSectionColour('> My Section [colour:red]')).toBe('red');
    });
    it('is case-insensitive', () => {
        expect(parseSectionColour('> My Section [colour:GREEN]')).toBe('green');
    });
    it('returns null when no colour tag', () => {
        expect(parseSectionColour('> My Section')).toBeNull();
    });
    it('returns null for malformed tags', () => {
        expect(parseSectionColour('> My Section [colour:]')).toBeNull();
    });
});

describe('setSectionColour', () => {
    it('adds colour tag to plain header', () => {
        expect(setSectionColour('> My Section', 'blue')).toBe('> My Section [colour:blue]');
    });
    it('replaces existing colour tag', () => {
        expect(setSectionColour('> My Section [colour:red]', 'green')).toBe('> My Section [colour:green]');
    });
    it('removes colour tag when null', () => {
        expect(setSectionColour('> My Section [colour:red]', null)).toBe('> My Section');
    });
    it('handles no colour with null gracefully', () => {
        expect(setSectionColour('> My Section', null)).toBe('> My Section');
    });
});
