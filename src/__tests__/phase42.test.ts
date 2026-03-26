import { describe, it, expect } from 'bun:test';
import { scoreItemComplexity, evaluateExpression } from '../patterns';

describe('scoreItemComplexity', () => {
    it('scores zero for a plain item', () => {
        expect(scoreItemComplexity('plain item').total).toBe(0);
    });
    it('scores priority', () => {
        expect(scoreItemComplexity('!!! urgent').priority).toBe(3);
    });
    it('scores tags', () => {
        expect(scoreItemComplexity('item #a #b').tags).toBe(2);
    });
    it('scores estimate', () => {
        expect(scoreItemComplexity('item ~2h').estimate).toBe(1);
    });
    it('scores due date', () => {
        expect(scoreItemComplexity('item @2026-06-01').dueDate).toBe(1);
    });
    it('scores vote', () => {
        expect(scoreItemComplexity('idea +5').vote).toBe(1);
    });
    it('accumulates total', () => {
        const s = scoreItemComplexity('!!! item #tag ~2h +3 @2026-01-01');
        expect(s.total).toBeGreaterThan(3);
    });
});

describe('evaluateExpression', () => {
    it('evaluates simple addition', () => {
        expect(evaluateExpression('total =2+2').result).toBe(4);
    });
    it('evaluates complex expressions', () => {
        expect(evaluateExpression('result =(10*3)/2').result).toBe(15);
    });
    it('returns the original match string', () => {
        expect(evaluateExpression('val =5+5').original).toBe('=5+5');
    });
    it('returns null when no expression', () => {
        expect(evaluateExpression('plain item')).toBeNull();
    });
    it('returns null for non-math expression', () => {
        expect(evaluateExpression('item =abc')).toBeNull();
    });
    it('handles decimal results', () => {
        expect(evaluateExpression('res =10/3').result).toBeCloseTo(3.3333, 2);
    });
});
