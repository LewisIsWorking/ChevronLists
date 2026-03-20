import * as vscode from 'vscode';
import { collectDependencies } from './dependencyParser';

interface DepPickItem extends vscode.QuickPickItem { lineIndex: number; }

/** Command: shows all dependency relationships in the file */
export async function onShowDependencies(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }

    const deps = collectDependencies(editor.document);

    if (deps.length === 0) {
        vscode.window.showInformationMessage('CL: No dependencies found (use >>depends:SectionName in a section)');
        return;
    }

    const pick = vscode.window.createQuickPick<DepPickItem>();
    pick.items = deps.map(d => ({
        label:       `$(arrow-right) ${d.from}`,
        description: `depends on → ${d.to}`,
        lineIndex:   d.line,
    }));
    pick.placeholder = `${deps.length} dependency relationship${deps.length === 1 ? '' : 's'}`;

    const originalPos = editor.selection.active;
    pick.onDidChangeActive(active => {
        if (!active[0]) { return; }
        const pos = new vscode.Position(active[0].lineIndex, 0);
        editor.selection = new vscode.Selection(pos, pos);
        editor.revealRange(new vscode.Range(pos, pos), vscode.TextEditorRevealType.InCenterIfOutsideViewport);
    });
    pick.onDidAccept(() => { pick.hide(); });
    pick.onDidHide(() => {
        if (!pick.activeItems[0]) {
            const pos = new vscode.Position(originalPos.line, originalPos.character);
            editor.selection = new vscode.Selection(pos, pos);
        }
        pick.dispose();
    });
    pick.show();
}
