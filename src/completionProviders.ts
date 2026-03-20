import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered, isHeader } from './patterns';
import { extractTags, uniqueTags } from './tagParser';
import { collectMentions, uniqueMentions } from './mentionParser';

// ── Tag completion (#) ────────────────────────────────────────────────────────

/** Provides #tag completions from tags already in the file, sorted by frequency */
export class ChevronTagCompletionProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position
    ): vscode.CompletionItem[] {
        const lineText = document.lineAt(position).text;
        const prefix   = lineText.slice(0, position.character);
        if (!prefix.endsWith('#')) { return []; }

        const { prefix: listPrefix } = getConfig();
        const freq = new Map<string, number>();
        for (let i = 0; i < document.lineCount; i++) {
            const t = document.lineAt(i).text;
            const bullet  = parseBullet(t, listPrefix);
            const numbered = parseNumbered(t);
            const content  = bullet?.content ?? numbered?.content ?? null;
            if (!content) { continue; }
            for (const tag of extractTags(content)) {
                freq.set(tag, (freq.get(tag) ?? 0) + 1);
            }
        }
        return [...freq.entries()]
            .sort((a, b) => b[1] - a[1])
            .map(([tag, count]) => {
                const item = new vscode.CompletionItem(tag, vscode.CompletionItemKind.Value);
                item.detail      = `#${tag} — used ${count}×`;
                item.sortText    = String(1000 - count).padStart(4, '0');
                item.insertText  = tag;
                return item;
            });
    }
}

// ── Mention completion (@) ────────────────────────────────────────────────────

/** Provides @mention completions from names already in the file */
export class ChevronMentionCompletionProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position
    ): vscode.CompletionItem[] {
        const lineText = document.lineAt(position).text;
        const prefix   = lineText.slice(0, position.character);
        // Only trigger for @ that isn't a date pattern
        if (!prefix.endsWith('@') || /\d$/.test(prefix.slice(0, -1))) { return []; }

        const { prefix: listPrefix } = getConfig();
        const names = uniqueMentions(document, listPrefix);
        return names.map(name => {
            const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.User);
            item.detail     = `@${name}`;
            item.insertText = name;
            return item;
        });
    }
}

// ── Section link completion ([[) ──────────────────────────────────────────────

/** Provides [[SectionName]] completions from headers in the file */
export class ChevronLinkCompletionProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position
    ): vscode.CompletionItem[] {
        const lineText = document.lineAt(position).text;
        const prefix   = lineText.slice(0, position.character);
        if (!prefix.endsWith('[[')) { return []; }

        const headers: string[] = [];
        for (let i = 0; i < document.lineCount; i++) {
            const t = document.lineAt(i).text;
            if (isHeader(t)) { headers.push(t.replace(/^> /, '').trim()); }
        }
        return headers.map(name => {
            const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Reference);
            item.detail     = `[[${name}]]`;
            item.insertText = new vscode.SnippetString(`${name}]]`);
            return item;
        });
    }
}
