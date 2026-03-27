import { describe, it, expect } from 'bun:test';
import { groupLinesByMention } from '../patterns';

const item = (text: string, index: number) => ({ text, index });

describe('groupLinesByMention', () => {
    it('groups items by @Name mention', () => {
        const items = [
            item('>> - task for @Alice', 1),
            item('>> - task for @Bob', 2),
            item('>> - another for @Alice', 3),
        ];
        const groups = groupLinesByMention(items, '-');
        expect(groups.get('Alice')).toHaveLength(2);
        expect(groups.get('Bob')).toHaveLength(1);
    });
    it('puts unmentioned items into Unassigned', () => {
        const items = [item('>> - @Alice task', 1), item('>> - plain task', 2)];
        const groups = groupLinesByMention(items, '-');
        expect(groups.get('Unassigned')).toHaveLength(1);
    });
    it('ignores date-style @YYYY-MM-DD as mention', () => {
        const items = [item('>> - task @2026-06-01', 1)];
        const groups = groupLinesByMention(items, '-');
        expect(groups.get('Unassigned')).toHaveLength(1);
        expect(groups.size).toBe(1);
    });
    it('ignores lowercase @mentions', () => {
        const items = [item('>> - task @alice', 1)];
        const groups = groupLinesByMention(items, '-');
        expect(groups.get('alice')).toBeUndefined();
        expect(groups.get('Unassigned')).toHaveLength(1);
    });
    it('returns empty map for empty input', () => {
        expect(groupLinesByMention([], '-').size).toBe(0);
    });
    it('uses first mention when item has multiple', () => {
        const items = [item('>> - @Alice and @Bob task', 1)];
        const groups = groupLinesByMention(items, '-');
        expect(groups.get('Alice')).toHaveLength(1);
        expect(groups.has('Bob')).toBe(false);
    });
});
