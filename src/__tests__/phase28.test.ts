import { describe, it, expect } from 'bun:test';
import { shiftDate, computeSectionWeight } from '../patterns';

describe('shiftDate', () => {
    it('shifts forward by 7 days', () => {
        expect(shiftDate('2026-03-20', 7)).toBe('2026-03-27');
    });
    it('shifts backward by 3 days', () => {
        expect(shiftDate('2026-03-20', -3)).toBe('2026-03-17');
    });
    it('crosses month boundaries', () => {
        expect(shiftDate('2026-03-31', 1)).toBe('2026-04-01');
    });
    it('crosses year boundaries', () => {
        expect(shiftDate('2026-12-31', 1)).toBe('2027-01-01');
    });
    it('shifting by 0 returns the same date', () => {
        expect(shiftDate('2026-03-20', 0)).toBe('2026-03-20');
    });
});

describe('computeSectionWeight', () => {
    it('returns 0 for an empty section', () => {
        expect(computeSectionWeight(0, 0, 0, 0)).toBe(0);
    });
    it('weights items at 3× each', () => {
        expect(computeSectionWeight(4, 0, 0, 0)).toBe(12);
    });
    it('adds priority sum directly', () => {
        expect(computeSectionWeight(0, 6, 0, 0)).toBe(6);
    });
    it('adds votes directly', () => {
        expect(computeSectionWeight(0, 0, 10, 0)).toBe(10);
    });
    it('adds tags directly', () => {
        expect(computeSectionWeight(0, 0, 0, 5)).toBe(5);
    });
    it('combines all factors', () => {
        // 2 items(×3=6) + priority 3 + votes 2 + tags 1 = 12
        expect(computeSectionWeight(2, 3, 2, 1)).toBe(12);
    });
});
