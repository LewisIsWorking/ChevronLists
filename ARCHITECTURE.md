# Architecture Rules

## Module Boundaries

The single most important rule in this codebase:

### Pure functions must never live in `*Commands.ts` files

Every `*Commands.ts` file imports `vscode` to call VS Code APIs. Bun's test runner has no VS Code extension host, so **any file that imports `vscode` cannot be imported by tests**, even if you only want one small helper from it.

**Rule:** If a function does not call any `vscode.*` API — i.e. it only manipulates strings, arrays, regex, or plain data — it must live in:
- `patterns.ts` — string/regex utilities shared across the codebase
- A `*Parser.ts` file — domain-specific pure parsing logic

**Never write a pure helper in a `*Commands.ts` file.** The moment you do, you will need to move it when writing tests.

### Correct file layout

| File type | What belongs there |
|---|---|
| `patterns.ts` | Shared pure string/regex utilities (`parseBullet`, `isHeader`, `extractLabels`, `toTitleCase`, `toggleStrikethrough`, etc.) |
| `*Parser.ts` | Pure domain parsing logic (e.g. `tagParser.ts`, `dueDateParser.ts`, `flagParser.ts`) |
| `*Commands.ts` | VS Code command handlers that call `vscode.*` APIs — **no pure helpers** |
| `extension.ts` | Activation wiring only — imports and registers, nothing else |

### Example

**Wrong** — `renameTagCommands.ts` contains a pure function:
```typescript
// renameTagCommands.ts ❌
import * as vscode from 'vscode';
export function renameTagInText(text: string, old: string, new_: string): string { ... }
```

**Correct** — pure function lives in `tagParser.ts`:
```typescript
// tagParser.ts ✅
export function renameTagInText(text: string, old: string, new_: string): string { ... }

// renameTagCommands.ts ✅
import { renameTagInText } from './tagParser';
```

## Testing Rules

- All pure logic (`*Parser.ts`, `patterns.ts`) must have 100% line coverage
- `*Commands.ts` files are not imported by tests — they are tested indirectly through the pure logic they call
- Never import a `vscode`-dependent file into a test file

## File Length

- Maximum 200 lines per source file
- Use OOP/extraction to split longer files — never remove comments or whitespace to hit the limit
- `package.json` is exempt (VS Code manifest cannot be split)

## SOLID / Event-Driven / MVUX

- Single Responsibility: one file = one concern
- Open/Closed: new features = new files, not modifications to existing ones where possible  
- Commands are event handlers — they read state, transform via pure functions, then write
- No shared mutable state between commands (except `pinState`, `jumpHistory`, `snapshotCommands` which use `ExtensionContext.workspaceState` deliberately)

## Module Count

As of v15.1.0: ~230 source modules, 50 test files, 587 unit tests, 240 declared commands, bundled to a single `dist/extension.js` (~185KB) via esbuild.
