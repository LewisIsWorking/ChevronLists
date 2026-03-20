import * as vscode from 'vscode';
import { getConfig } from './config';
import { isHeader, parseBullet, parseNumbered } from './patterns';
import { getSectionRange } from './documentUtils';

/**
 * Provides document symbols so chevron sections appear in VS Code's
 * Outline panel and breadcrumb navigation.
 */
export class ChevronOutlineProvider
    implements vscode.DocumentSymbolProvider {

    provideDocumentSymbols(
        document: vscode.TextDocument
    ): vscode.DocumentSymbol[] {
        const symbols: vscode.DocumentSymbol[] = [];
        const { prefix } = getConfig();

        for (let i = 0; i < document.lineCount; i++) {
            const text = document.lineAt(i).text;
            if (!isHeader(text)) { continue; }

            const headerName     = text.replace(/^> /, '');
            const [start, end]   = getSectionRange(document, i);
            const sectionRange   = new vscode.Range(start, 0, end, document.lineAt(end).text.length);
            const selectionRange = document.lineAt(i).range;

            // Count items for the detail label
            let itemCount = 0;
            for (let j = start + 1; j <= end; j++) {
                const line = document.lineAt(j).text;
                if (parseBullet(line, prefix) || parseNumbered(line)) { itemCount++; }
            }

            const symbol = new vscode.DocumentSymbol(
                headerName,
                itemCount === 1 ? '1 item' : `${itemCount} items`,
                vscode.SymbolKind.Module,
                sectionRange,
                selectionRange
            );

            // Add child symbols for each item in the section
            for (let j = start + 1; j <= end; j++) {
                const line    = document.lineAt(j).text;
                const bullet  = parseBullet(line, prefix);
                const numbered = parseNumbered(line);

                if (bullet && bullet.content) {
                    symbol.children.push(new vscode.DocumentSymbol(
                        bullet.content,
                        '',
                        vscode.SymbolKind.String,
                        document.lineAt(j).range,
                        document.lineAt(j).range
                    ));
                } else if (numbered && numbered.content) {
                    symbol.children.push(new vscode.DocumentSymbol(
                        `${numbered.num}. ${numbered.content}`,
                        '',
                        vscode.SymbolKind.Number,
                        document.lineAt(j).range,
                        document.lineAt(j).range
                    ));
                }
            }

            symbols.push(symbol);
        }

        return symbols;
    }
}
