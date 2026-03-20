import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered } from './patterns';
import { parseRating, setRating, removeRating, collectRatedItems } from './ratingParser';

interface RatingPickItem extends vscode.QuickPickItem { lineIndex: number; }

/** Command: sets a ★N rating on the item at the cursor via quick pick */
export async function onSetItemRating(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const { prefix } = getConfig();
    const doc        = editor.document;
    const lineIndex  = editor.selection.active.line;
    const text       = doc.lineAt(lineIndex).text;
    const bullet     = parseBullet(text, prefix);
    const numbered   = parseNumbered(text);
    if (!bullet && !numbered) {
        vscode.window.showInformationMessage('CL: Place cursor on a chevron item to rate it');
        return;
    }
    const chevrons = bullet?.chevrons ?? numbered!.chevrons;
    const content  = bullet?.content  ?? numbered!.content;
    const num      = numbered?.num ?? null;
    const current  = parseRating(content);

    const pick = await vscode.window.showQuickPick(
        [1, 2, 3, 4, 5].map(n => ({
            label:       '★'.repeat(n) + '☆'.repeat(5 - n),
            description: n === current ? '← current' : undefined,
            rating:      n,
        })).concat([{ label: '$(close) Remove rating', description: undefined, rating: 0 }]),
        { placeHolder: `Rate this item (current: ${current ? '★'.repeat(current) : 'none'})` }
    );
    if (!pick) { return; }

    const newContent = pick.rating > 0 ? setRating(content, pick.rating) : removeRating(content);
    const newLine    = num !== null
        ? `${chevrons} ${num}. ${newContent}`
        : `${chevrons} ${prefix} ${newContent}`;
    await editor.edit(eb => eb.replace(doc.lineAt(lineIndex).range, newLine));
}

/** Command: shows all rated items above a threshold */
export async function onFilterByRating(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const { prefix } = getConfig();
    const all        = collectRatedItems(editor.document, prefix);
    if (all.length === 0) {
        vscode.window.showInformationMessage('CL: No rated items found (use ★N in item content)');
        return;
    }
    const threshold = await vscode.window.showQuickPick(
        [1, 2, 3, 4, 5].map(n => ({ label: `★ ${n}+ stars`, minimum: n })),
        { placeHolder: 'Show items rated at least…' }
    );
    if (!threshold) { return; }

    const matches = all.filter(i => i.rating >= threshold.minimum);
    if (matches.length === 0) {
        vscode.window.showInformationMessage(`CL: No items rated ${threshold.minimum}+ stars`);
        return;
    }
    const pick = vscode.window.createQuickPick<RatingPickItem>();
    pick.items = matches.map(i => ({
        label:       `${'★'.repeat(i.rating)} ${i.content}`,
        description: i.section,
        lineIndex:   i.line,
    }));
    pick.placeholder = `${matches.length} item${matches.length === 1 ? '' : 's'} rated ${threshold.minimum}+ stars`;
    const originalPos = editor.selection.active;
    pick.onDidChangeActive(active => {
        if (!active[0]) { return; }
        const pos = new vscode.Position(active[0].lineIndex, 0);
        editor.selection = new vscode.Selection(pos, pos);
        editor.revealRange(new vscode.Range(pos, pos), vscode.TextEditorRevealType.InCenterIfOutsideViewport);
    });
    pick.onDidAccept(() => { pick.hide(); });
    pick.onDidHide(() => {
        if (!pick.activeItems[0]) { editor.selection = new vscode.Selection(originalPos, originalPos); }
        pick.dispose();
    });
    pick.show();
}
