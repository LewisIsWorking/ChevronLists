# Changelog

All notable changes to **Chevron Lists** will be documented here.

## [1.0.4] - 2026-03-20

### Fixed
- Move Section Up/Down now correctly swaps only the header and its chevron items — blank lines, `---` dividers, and any non-chevron content between sections stay exactly in place during a swap

## [1.0.3] - 2026-03-20

### Fixed
- Move Section Up/Down now feels like dragging — cursor follows the moved section to its new position rather than staying put, making it clear which section moved and allowing repeated moves without repositioning the cursor

## [1.0.2] - 2026-03-20

### Fixed
- Multi-cursor Tab/Shift+Tab now correctly handles range selections (Shift+click) as well as multi-cursor selections (Alt+click) — previously only the active cursor line was affected

## [1.0.1] - 2026-03-20

### Fixed
- Extension now loads correctly — stale compiled test/mock files removed from `out/` that were causing silent activation failure
- Navigation keybindings changed from `Alt+Up/Down` to `Ctrl+Alt+Up/Down` to avoid conflict with VS Code's built-in move-line commands
- `.vscodeignore` updated to explicitly exclude `out/__mocks__/` and `out/__tests__/` from VSIX
- Removed stale `paths` mapping from `tsconfig.json`

## [1.0.0] - 2026-03-20

### Added
- Full SOLID refactor — split into 12 focused modules (all under 200 lines)
- 37 unit tests with 100% coverage of all pure logic (Bun test runner)
- `Alt+Down` / `Alt+Up` keybindings to jump between chevron headers
- Jump to Next Header command (`chevron-lists.nextHeader`)
- Jump to Previous Header command (`chevron-lists.prevHeader`)
- Delete Section command (`chevron-lists.deleteSection`)
- Duplicate Section command (`chevron-lists.duplicateSection`)
- Move Section Up command (`chevron-lists.moveSectionUp`)
- Move Section Down command (`chevron-lists.moveSectionDown`)
- Hover tooltip on `> Header` lines showing item count and word count
- Status bar item showing total section and item count for the open file
- Multi-cursor support for Tab / Shift+Tab across multiple chevron lines

### Changed
- `extension.ts` is now wiring-only — all logic delegated to focused handler modules

## [0.6.1] - 2026-03-19

### Fixed
- Tab no longer intercepts Copilot inline suggestions — pressing Tab now accepts a Copilot suggestion as expected; only falls through to chevron indent behaviour when no suggestion is visible

### Tested
- All features verified locally: Enter, Tab/Shift+Tab, numbered lists, syntax highlighting, folding, minimap indicators, Select Section Items, listPrefix setting, blankLineAfterHeader setting

## [0.6.0] - 2026-03-19

### Added
- Minimap / overview ruler indicators: `> Header` lines now appear as markers in the scrollbar gutter

## [0.5.0] - 2026-03-19

### Added
- Syntax highlighting via TextMate grammar injected into markdown
- `> Header` lines coloured as section headings
- `>> -` bullet prefixes and `>> 1.` number prefixes styled distinctly
- Item content styled as a string scope (picks up theme colours automatically)

## [0.4.0] - 2026-03-19

### Added
- Fold / collapse chevron sections: each `> Header` block folds via the standard VS Code fold gutter
- `Chevron Lists: Select Section Items` command selects all `>> -` and `>> 1.` lines under the nearest `> Header`

## [0.3.0] - 2026-03-19

### Added
- `chevron-lists.listPrefix` setting: change the list prefix character (default `-`, e.g. set to `*` for `>> *`)
- `chevron-lists.blankLineAfterHeader` setting: optionally insert a blank line between `> Header` and the first list item

## [0.2.0] - 2026-03-19

### Added
- Auto-numbered chevron lists using `>> 1.` syntax
- Enter after `>> 1. Item` continues with `>> 2.` (auto-incrementing)
- Enter on an empty `>> 1.` line stops the list
- Tab promotes a numbered item to deeper depth, resetting number correctly
- Shift+Tab demotes a numbered item, picking up the correct next number at that depth

## [0.1.0] - 2026-03-19

### Added
- Tab on a `>> -` line promotes it to `>>> -` (deeper nesting)
- Shift+Tab on a `>>> -` line demotes it back one level
- Full arbitrary-depth nesting supported (`>>`, `>>>`, `>>>>`, etc.)
- Enter continues lists correctly at any depth
- Tab and Shift+Tab fall through to default behaviour on non-chevron lines

## [0.0.1] - 2026-03-19

### Added
- Smart Enter key behaviour for `>> -` nested blockquote list items in markdown
- Pressing Enter after a `> Header` line starts a `>> -` list item on the next line (no blank line)
- Pressing Enter after a `>> - Item` line continues the list with another `>> -` prefix
- Pressing Enter on an empty `>> -` line stops the list and clears the prefix
- All other Enter presses in markdown files behave normally
