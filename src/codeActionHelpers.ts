import * as vscode from 'vscode';

/** Creates a WorkspaceEdit that replaces a range with new text */
export function makeEdit(uri: vscode.Uri, range: vscode.Range, newText: string): vscode.WorkspaceEdit {
    const edit = new vscode.WorkspaceEdit();
    edit.replace(uri, range, newText);
    return edit;
}

/** Builds a CodeAction with minimal boilerplate */
export function makeAction(
    title: string,
    kind:  vscode.CodeActionKind,
    diag:  vscode.Diagnostic,
    opts:  { edit?: vscode.WorkspaceEdit; command?: vscode.Command; preferred?: boolean }
): vscode.CodeAction {
    const a       = new vscode.CodeAction(title, kind);
    a.diagnostics = [diag];
    if (opts.edit)      { a.edit        = opts.edit; }
    if (opts.command)   { a.command     = opts.command; }
    if (opts.preferred) { a.isPreferred = true; }
    return a;
}
