import * as vscode from 'vscode';
import { BUILT_IN_TEMPLATES, type ChevronTemplate } from './templateData';

/** Returns the user-defined templates from settings, merged with built-in defaults */
export function getTemplates(): ChevronTemplate[] {
    const cfg      = vscode.workspace.getConfiguration('chevron-lists');
    const userDefs = cfg.get<ChevronTemplate[]>('templates', []);
    return [...BUILT_IN_TEMPLATES, ...userDefs];
}

interface TemplatePickItem extends vscode.QuickPickItem {
    template: ChevronTemplate;
}

/** Command: shows a quick pick of all templates and inserts the selected one */
export async function onInsertTemplate(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }

    const items: TemplatePickItem[] = getTemplates().map(t => ({
        label:       t.name,
        description: t.description,
        template:    t,
    }));

    const pick = await vscode.window.showQuickPick(items, {
        placeHolder: 'Select a template to insert',
        matchOnDescription: true,
    });

    if (!pick) { return; }
    await editor.insertSnippet(new vscode.SnippetString(pick.template.body));
}
