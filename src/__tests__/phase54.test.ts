import { describe, it, expect } from 'bun:test';
import { buildCommandGroups }    from '../settingsPanelCommands';
import { buildCommandGroupsHtml, buildSettingsPanelHtml } from '../settingsPanelHtml';
import type { ChevronConfig }    from '../types';

const MOCK_CFG: ChevronConfig = {
    prefix: '-', blankLine: false, snippetTrigger: 'tab', autoArchive: false,
    dailyNotesFolder: '', dailyNoteTemplate: '', autoFixNumbering: true,
    defaultNewListType: 'unordered', colourPreset: 'default', anthropicApiKey: '',
};

describe('buildCommandGroups', () => {
    it('returns a non-empty array', () => {
        const groups = buildCommandGroups();
        expect(Array.isArray(groups)).toBe(true);
        expect(groups.length).toBeGreaterThan(0);
    });

    it('every group has a non-empty name', () => {
        for (const g of buildCommandGroups()) {
            expect(g.group.length).toBeGreaterThan(0);
        }
    });

    it('every group has at least one command', () => {
        for (const g of buildCommandGroups()) {
            expect(g.commands.length).toBeGreaterThan(0);
        }
    });

    it('all command ids start with chevron-lists.', () => {
        for (const g of buildCommandGroups()) {
            for (const cmd of g.commands) {
                expect(cmd.id.startsWith('chevron-lists.')).toBe(true);
            }
        }
    });

    it('all command labels are non-empty strings', () => {
        for (const g of buildCommandGroups()) {
            for (const cmd of g.commands) {
                expect(typeof cmd.label).toBe('string');
                expect(cmd.label.length).toBeGreaterThan(0);
            }
        }
    });

    it('group names are unique', () => {
        const names = buildCommandGroups().map(g => g.group);
        expect(new Set(names).size).toBe(names.length);
    });

    it('command ids are unique across all groups', () => {
        const ids = buildCommandGroups().flatMap(g => g.commands.map(c => c.id));
        expect(new Set(ids).size).toBe(ids.length);
    });
});

describe('buildCommandGroupsHtml', () => {
    it('returns empty string for empty groups', () => {
        expect(buildCommandGroupsHtml([])).toBe('');
    });

    it('wraps each group in a div.group', () => {
        const html = buildCommandGroupsHtml([{ group: 'Test', commands: [{ id: 'chevron-lists.x', label: 'X' }] }]);
        expect(html).toContain('class="group"');
    });

    it('includes the group name as h3', () => {
        const html = buildCommandGroupsHtml([{ group: 'MyGroup', commands: [{ id: 'chevron-lists.x', label: 'Y' }] }]);
        expect(html).toContain('<h3>MyGroup</h3>');
    });

    it('includes a button for each command', () => {
        const html = buildCommandGroupsHtml([{ group: 'G', commands: [{ id: 'chevron-lists.foo', label: 'Foo' }] }]);
        expect(html).toContain("run('chevron-lists.foo')");
        expect(html).toContain('Foo');
    });

    it('escapes HTML special characters in labels', () => {
        const html = buildCommandGroupsHtml([{ group: 'G', commands: [{ id: 'chevron-lists.x', label: 'A & B' }] }]);
        expect(html).toContain('A &amp; B');
    });

    it('escapes HTML special characters in group names', () => {
        const html = buildCommandGroupsHtml([{ group: 'A <> B', commands: [{ id: 'chevron-lists.x', label: 'X' }] }]);
        expect(html).toContain('A &lt;&gt; B');
    });

    it('renders multiple groups', () => {
        const groups = [
            { group: 'One', commands: [{ id: 'chevron-lists.a', label: 'A' }] },
            { group: 'Two', commands: [{ id: 'chevron-lists.b', label: 'B' }] },
        ];
        const html = buildCommandGroupsHtml(groups);
        expect(html).toContain('<h3>One</h3>');
        expect(html).toContain('<h3>Two</h3>');
    });
});

describe('buildSettingsPanelHtml', () => {
    it('returns a complete HTML document', () => {
        const html = buildSettingsPanelHtml(MOCK_CFG, []);
        expect(html).toContain('<!DOCTYPE html>');
        expect(html).toContain('</html>');
    });

    it('includes the settings tab content', () => {
        const html = buildSettingsPanelHtml(MOCK_CFG, []);
        expect(html).toContain('tab-settings');
        expect(html).toContain('tab-commands');
    });

    it('renders a toggle for autoFixNumbering as checked when true', () => {
        const html = buildSettingsPanelHtml({ ...MOCK_CFG, autoFixNumbering: true }, []);
        expect(html).toContain('data-key="autoFixNumbering" checked');
    });

    it('renders a toggle for autoFixNumbering as unchecked when false', () => {
        const html = buildSettingsPanelHtml({ ...MOCK_CFG, autoFixNumbering: false }, []);
        expect(html).toContain('data-key="autoFixNumbering"');
        expect(html).not.toContain('data-key="autoFixNumbering" checked');
    });

    it('renders a toggle for blankLineAfterHeader', () => {
        const html = buildSettingsPanelHtml({ ...MOCK_CFG, blankLine: true }, []);
        expect(html).toContain('data-key="blankLineAfterHeader" checked');
    });

    it('renders the listPrefix text input with the current value', () => {
        const html = buildSettingsPanelHtml({ ...MOCK_CFG, prefix: '*' }, []);
        expect(html).toContain('data-key="listPrefix" value="*"');
    });

    it('renders the colourPreset select with the current value selected', () => {
        const html = buildSettingsPanelHtml({ ...MOCK_CFG, colourPreset: 'ocean' }, []);
        expect(html).toContain('value="ocean" selected');
    });

    it('renders the snippetTrigger select with the current value selected', () => {
        const html = buildSettingsPanelHtml({ ...MOCK_CFG, snippetTrigger: 'ctrl+enter' }, []);
        expect(html).toContain('value="ctrl+enter" selected');
    });

    it('renders the defaultNewListType select with ordered selected', () => {
        const html = buildSettingsPanelHtml({ ...MOCK_CFG, defaultNewListType: 'ordered' }, []);
        expect(html).toContain('value="ordered" selected');
    });

    it('escapes special characters in text input values', () => {
        const html = buildSettingsPanelHtml({ ...MOCK_CFG, dailyNoteTemplate: 'a & b' }, []);
        expect(html).toContain('a &amp; b');
    });

    it('renders command group buttons in the commands tab', () => {
        const groups = [{ group: 'AI', commands: [{ id: 'chevron-lists.suggestItems', label: 'Suggest Items' }] }];
        const html = buildSettingsPanelHtml(MOCK_CFG, groups);
        expect(html).toContain("run('chevron-lists.suggestItems')");
    });

    it('includes the welcome blurb', () => {
        const html = buildSettingsPanelHtml(MOCK_CFG, []);
        expect(html).toContain('Welcome');
    });

    it('includes the vscode acquireVsCodeApi call', () => {
        const html = buildSettingsPanelHtml(MOCK_CFG, []);
        expect(html).toContain('acquireVsCodeApi');
    });
});
