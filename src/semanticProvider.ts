import * as vscode from 'vscode';
import { isHeader, parseBullet, parseNumbered } from './patterns';
import { getConfig } from './config';

/**
 * Semantic token types contributed by this extension.
 * Must match the names registered in package.json contributes.semanticTokenTypes.
 */
const TOKEN_TYPES = ['chevronHeader', 'chevronPrefix', 'chevronNumber', 'chevronContent'] as const;
type TokenType = typeof TOKEN_TYPES[number];

const TOKEN_TYPE_MAP = new Map<TokenType, number>(
    TOKEN_TYPES.map((t, i) => [t, i])
);

/** Builds the SemanticTokensLegend used by both provider registration and token encoding */
export function buildLegend(): vscode.SemanticTokensLegend {
    return new vscode.SemanticTokensLegend([...TOKEN_TYPES], []);
}

/** Provides semantic tokens for all chevron lines in a markdown document */
export class ChevronSemanticTokensProvider
    implements vscode.DocumentSemanticTokensProvider {

    constructor(private readonly legend: vscode.SemanticTokensLegend) {}

    provideDocumentSemanticTokens(
        document: vscode.TextDocument
    ): vscode.SemanticTokens {
        const builder = new vscode.SemanticTokensBuilder(this.legend);
        const { prefix } = getConfig();

        for (let i = 0; i < document.lineCount; i++) {
            const text = document.lineAt(i).text;

            if (isHeader(text)) {
                // "> " prefix — chevronPrefix
                this.push(builder, i, 0, 2, 'chevronPrefix');
                // header text — chevronHeader
                this.push(builder, i, 2, text.length - 2, 'chevronHeader');
                continue;
            }

            const bullet = parseBullet(text, prefix);
            if (bullet) {
                const prefixLen = bullet.chevrons.length + 1 + prefix.length + 1; // e.g. ">> - "
                // ">> - " prefix — chevronPrefix
                this.push(builder, i, 0, prefixLen, 'chevronPrefix');
                // item content — chevronContent
                if (bullet.content.length > 0) {
                    this.push(builder, i, prefixLen, bullet.content.length, 'chevronContent');
                }
                continue;
            }

            const numbered = parseNumbered(text);
            if (numbered) {
                const chevronLen  = numbered.chevrons.length + 1; // e.g. ">> "
                const numStr      = String(numbered.num);
                const dotAndSpace = 2; // ". "
                // ">>" chevrons — chevronPrefix
                this.push(builder, i, 0, chevronLen, 'chevronPrefix');
                // number — chevronNumber
                this.push(builder, i, chevronLen, numStr.length, 'chevronNumber');
                // ". " separator — chevronPrefix
                this.push(builder, i, chevronLen + numStr.length, dotAndSpace, 'chevronPrefix');
                // item content — chevronContent
                if (numbered.content.length > 0) {
                    this.push(builder, i,
                        chevronLen + numStr.length + dotAndSpace,
                        numbered.content.length,
                        'chevronContent'
                    );
                }
            }
        }
        return builder.build();
    }

    private push(
        builder: vscode.SemanticTokensBuilder,
        line: number,
        startChar: number,
        length: number,
        type: TokenType
    ): void {
        const typeIndex = TOKEN_TYPE_MAP.get(type);
        if (typeIndex !== undefined && length > 0) {
            builder.push(line, startChar, length, typeIndex, 0);
        }
    }
}
