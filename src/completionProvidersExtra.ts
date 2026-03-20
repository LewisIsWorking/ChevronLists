import * as vscode from 'vscode';

// ── Estimate completion (~) ───────────────────────────────────────────────────

/** Provides common time estimate completions after ~ */
export class ChevronEstimateCompletionProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position
    ): vscode.CompletionItem[] {
        const lineText = document.lineAt(position).text;
        const prefix   = lineText.slice(0, position.character);
        if (!prefix.endsWith('~')) { return []; }
        return [
            { label: '~15m', detail: '15 minutes', sort: '1' },
            { label: '~30m', detail: '30 minutes', sort: '2' },
            { label: '~1h',  detail: '1 hour',     sort: '3' },
            { label: '~2h',  detail: '2 hours',    sort: '4' },
            { label: '~4h',  detail: 'Half day',   sort: '5' },
            { label: '~1d',  detail: 'Full day',   sort: '6' },
        ].map(e => {
            const item = new vscode.CompletionItem(e.label, vscode.CompletionItemKind.Unit);
            item.detail     = e.detail;
            item.sortText   = e.sort;
            item.insertText = e.label.slice(1);
            return item;
        });
    }
}

// ── Rating completion (★) ─────────────────────────────────────────────────────

/** Provides ★1–★5 rating completions */
export class ChevronRatingCompletionProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position
    ): vscode.CompletionItem[] {
        const lineText = document.lineAt(position).text;
        const prefix   = lineText.slice(0, position.character);
        if (!prefix.endsWith('★')) { return []; }
        return [1, 2, 3, 4, 5].map(n => {
            const item = new vscode.CompletionItem(`★${n}`, vscode.CompletionItemKind.Enum);
            item.detail     = '★'.repeat(n) + '☆'.repeat(5 - n);
            item.sortText   = String(n);
            item.insertText = String(n);
            return item;
        });
    }
}
