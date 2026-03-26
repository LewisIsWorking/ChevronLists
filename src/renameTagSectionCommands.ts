import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered } from './patterns';
import { getSectionRange, findHeaderAbove } from './documentUtils';

/** Command: renames a #tag within the current section only */
export async function onRenameTagSection(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const { prefix }  = getConfig();
    const doc         = editor.document;
    const headerLine  = findHeaderAbove(doc, editor.selection.active.line);
    if (headerLine < 0) { vscode.window.showInformationMessage('CL: No section found at cursor'); return; }
    const [, end]     = getSectionRange(doc, headerLine);

    // Collect tags in section
    const tagsInSection = new Set<string>();
    for (let i = headerLine + 1; i <= end; i++) {
        const text    = doc.lineAt(i).text;
        const content = parseBullet(text, prefix)?.content ?? parseNumbered(text)?.content ?? null;
        if (!content) { continue; }
        for (const m of content.matchAll(/#(\w+)/g)) { tagsInSection.add(m[1]); }
    }

    if (tagsInSection.size === 0) {
        vscode.window.showInformationMessage('CL: No tags found in this section');
        return;
    }

    const oldTag = await vscode.window.showQuickPick(
        [...tagsInSection].sort().map(t => `#${t}`),
        { placeHolder: 'Select tag to rename…' }
    );
    if (!oldTag) { return; }

    const newName = await vscode.window.showInputBox({
        prompt:       `Rename ${oldTag} to`,
        placeHolder:  'new-tag-name (no # needed)',
        validateInput: v => /^\w+$/.test(v.trim()) ? null : 'Tag names can only contain letters, numbers and underscores',
    });
    if (!newName?.trim()) { return; }

    const re     = new RegExp(`#${oldTag.slice(1)}\\b`, 'g');
    let   changed = 0;
    await editor.edit(eb => {
        for (let i = headerLine + 1; i <= end; i++) {
            const text = doc.lineAt(i).text;
            if (!re.test(text)) { continue; }
            eb.replace(doc.lineAt(i).range, text.replace(re, `#${newName.trim()}`));
            changed++;
        }
    });
    vscode.window.showInformationMessage(
        `CL: Renamed ${oldTag} → #${newName.trim()} in ${changed} item${changed === 1 ? '' : 's'}`
    );
}
