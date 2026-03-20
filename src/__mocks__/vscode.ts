/**
 * Minimal VS Code API mock for unit tests.
 * Only the surface area used by patterns.ts and documentUtils.ts is needed.
 */
export const workspace = {
    getConfiguration: () => ({
        get: <T>(key: string, defaultValue: T): T => defaultValue,
    }),
};

export const window = {
    activeTextEditor: undefined,
    createTextEditorDecorationType: () => ({}),
    createStatusBarItem: () => ({ show: () => {}, hide: () => {}, dispose: () => {} }),
    showInformationMessage: () => {},
};

export const languages = {
    registerFoldingRangeProvider: () => ({ dispose: () => {} }),
    registerHoverProvider:        () => ({ dispose: () => {} }),
};

export const commands = {
    registerCommand:  () => ({ dispose: () => {} }),
    executeCommand:   async () => {},
};

export class Position {
    constructor(public line: number, public character: number) {}
    with(line?: number, character?: number): Position {
        return new Position(line ?? this.line, character ?? this.character);
    }
}

export class Range {
    constructor(public start: Position, public end: Position) {}
}

export class Selection extends Range {
    constructor(public anchor: Position, public active: Position) {
        super(anchor, active);
    }
}

export class FoldingRange {
    constructor(public start: number, public end: number) {}
}

export class MarkdownString {
    constructor(public value: string) {}
}

export class Hover {
    constructor(public contents: MarkdownString) {}
}

export class ThemeColor {
    constructor(public id: string) {}
}

export const OverviewRulerLane = { Left: 1 };
export const StatusBarAlignment = { Right: 2 };
export const TextEditorRevealType = { InCenterIfOutsideViewport: 2 };
