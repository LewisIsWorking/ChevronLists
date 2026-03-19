import * as vscode from 'vscode';
type EditBuilder = vscode.TextEditorEdit;

// Matches a full >> - line, capturing everything after the prefix
const NESTED_ITEM_RE = /^>> - (.*)$/;
// Matches a > header line (single >, not >>)
const HEADER_RE = /^> [^>]/;

function isCursorAtLineEnd(editor: vscode.TextEditor): boolean {
    const cursor = editor.selection.active;
    return cursor.character === editor.document.lineAt(cursor.line).text.length;
}

export function activate(context: vscode.ExtensionContext): void {
    const cmd = vscode.commands.registerCommand('chevron-lists.onEnter', async () => {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            await vscode.commands.executeCommand('default:type', { text: '\n' });
            return;
        }

        // If cursor is mid-line, use default Enter
        if (!isCursorAtLineEnd(editor)) {
            await vscode.commands.executeCommand('default:type', { text: '\n' });
            return;
        }

        const { document, selection } = editor;
        const cursor = selection.active;
        const lineText = document.lineAt(cursor.line).text;

        const nestedMatch = lineText.match(NESTED_ITEM_RE);
        if (nestedMatch) {
            if (nestedMatch[1] === '') {
                // Empty >> - item: remove the prefix, leave an empty line (stops the list)
                await editor.edit((eb: EditBuilder) =>
                    eb.delete(new vscode.Range(cursor.with(undefined, 0), cursor))
                );
            } else {
                // Non-empty >> - item: continue the list
                await editor.edit((eb: EditBuilder) => eb.insert(cursor, '\n>> - '));
                const newPos = new vscode.Position(cursor.line + 1, 5);
                editor.selection = new vscode.Selection(newPos, newPos);
                editor.revealRange(new vscode.Range(newPos, newPos));
            }
            return;
        }

        if (HEADER_RE.test(lineText)) {
            // > Header line: start a nested list on the next line (no blank line).
            await vscode.commands.executeCommand('default:type', { text: '\n>> - ' });
            return;
        }

        // Not a chevron list line — default Enter behaviour
        await vscode.commands.executeCommand('default:type', { text: '\n' });
    });

    context.subscriptions.push(cmd);
}

export function deactivate(): void {}
