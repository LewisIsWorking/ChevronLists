# Changelog

All notable changes to **Chevron Lists** will be documented here.

## [6.3.0] - 2026-03-20

### Fixed
- **Enter mid-line on numbered/bullet items now works correctly** — pressing Enter anywhere on a `>> N.` or `>> -` line splits the line at the cursor, keeps text before the cursor on the current line, and starts the next numbered/bullet line with the remaining text

### Added
- `CL: Convert Bullets to Numbered` — converts all `>> -` bullet items in the current section to a numbered sequence, continuing from the last existing number (sentence order preserved)
- `[LABEL TEXT]` square bracket syntax — text inside `[...]` in item content is highlighted as a `chevronLabel` token in a distinct colour (gold/amber by default)
- All colour presets updated with a `chevronLabel` colour

## [6.3.0] - 2026-03-20

### Fixed
- **Enter mid-line on numbered/bullet items** — pressing Enter anywhere on a `>> N.` or `>> -` line now correctly splits the line at the cursor and starts the next item with the remaining text

### Added
- `CL: Convert Bullets to Numbered` — converts all `>> -` bullets in the section to numbered items, continuing from the last existing number; sentence order fully preserved
- `[LABEL TEXT]` square bracket highlighting — text in `[...]` in item content rendered as `chevronLabel` semantic token (gold/amber by default)
- All six colour presets updated with `chevronLabel` colour
- README completely rewritten to cover all commands and features through v6.3.0

## [6.2.0] - 2026-03-20

### Added
- `>>depends:SectionName` dependency syntax — marks a section as depending on another
- `CL: Show Dependencies` — quick pick of all dependency relationships in the file
- `+N` vote count syntax in items — `>> - Great idea +5`
- `CL: Sort by Votes` — sorts section items by vote count descending
- `CL: Add Vote` / `CL: Remove Vote` — increments/decrements the vote count at the cursor
- `CL: Hide Section` — marks a section with `>> [hidden]` and folds it
- `CL: Show Hidden Sections` — reveals and unfolds all hidden sections

## [5.8.0] - 2026-03-20

### Added
- `* ` star marker syntax in items — `>> - * Key task`
- `CL: Toggle Star` — toggles the star marker on the item at the cursor
- `CL: Filter Starred Items` — quick pick of all starred items with live preview
- `CL: Export Statistics as CSV` — section stats exported to CSV
- `CL: Export Statistics as JSON` — section stats exported to JSON
- `[[file:filename.md]]` linked file syntax in items
- `CL: Go to Linked File` — opens the linked file under the cursor
- Hover on `[[file:...]]` links shows a preview of the target file's first lines
- `~Nh`, `~Nm`, `~NhNm` time estimate syntax in items — `>> - Deploy server ~2h`
- `CL: Show Time Estimates` — all estimated items sorted by duration; shows total time

## [5.4.0] - 2026-03-20

### Added
- `CL: Show Section Summary` — quick notification with item/done/word/tag counts for the current section
- `CL: Count Items by Tag` — breakdown of item counts per `#tag` in the file
- `CL: Jump Back` — returns to the previous cursor position after a navigation command
- Jump history is populated automatically by `Ctrl+Alt+Down/Up` navigation
- `CL: Promote Item to Header` — converts the item at the cursor into a new section header
- `CL: Demote Header to Item` — converts the section header into a bullet in the section above
- `CL: Export File as Markdown Document` — exports as clean standard markdown (`##` headings, `-` bullets)

## [5.0.0] - 2026-03-20

### Added
- `CL: Archive Done Items` — moves all `[x]` items from the current section to an Archive section
- `CL: Archive Section` — moves the entire current section to the Archive area
- `CL: Find in Sections` — live quick pick search across all item content in the file
- `CL: Replace in Section` — find and replace within the current section's items only
- `CL: Focus on Section` — folds all other sections, reveals only the current one
- `CL: Unfocus` — restores all folded sections
- `>> [bookmark:Name]` bookmark syntax
- `CL: Add Bookmark` — inserts a named bookmark at the cursor
- `CL: Jump to Bookmark` — quick pick of all bookmarks in the file
- `CL: Remove Bookmark` — removes the bookmark on the current line

## [4.6.0] - 2026-03-20

### Added
- `CL: Clone Item` — duplicates the item at the cursor to the end of the same section
- `CL: Clone Item to Section` — duplicates the item to a chosen section via quick pick
- `CL: Merge Section Below` — combines the current section with the one below
- `CL: Split Section Here` — splits the current section at the cursor line into two named sections
- `CL: Enter Reading Mode` — opens the file as a live-updating HTML webview beside the editor
- `CL: Compare Section to Clipboard` — shows a diff of the current section vs clipboard content

## [4.2.0] - 2026-03-20

### Added
- Word count goal status bar integration — shows `words/goal` when cursor is in a section with `==N`
- Word count goal diagnostics — sections below target flagged as Information in the Problems panel
- `CL: Set Word Count Goal` — sets or updates the `==N` marker on the current section header
- `@Name` mention syntax in items — `>> - Discuss with @Lewis`
- `CL: Filter by Mention` — two-step picker: choose a person, jump to their items
- `CL: Bulk Tag Items` — add a `#tag` to all items in the current section
- `CL: Bulk Set Priority` — set priority level on all items in the current section
- `CL: Bulk Set Due Date` — set a due date on all items in the current section
- Cleaned up `extension.ts` — all 60+ commands organised into logical groups

## [3.8.0] - 2026-03-20

### Added
- `CL: Export File as JSON` — full structured export with tags, priority, dates, checkboxes per item
- `CL: Export File as CSV` — flat CSV with one row per item and all metadata columns
- `>> > Note text` inline note syntax on items
- `CL: Toggle Note` — adds/removes a note line on the item at the cursor
- `@daily`, `@weekly`, `@monthly` recurrence markers in items
- `CL: Show Recurring` — quick pick of all recurring items
- `CL: Generate Next Occurrence` — clones a recurring item with the next due date
- `==N` word count goal syntax in section headers — `> My Section ==500`

## [3.4.0] - 2026-03-20

### Added
- `CL: Filter by Tag (Workspace)` — two-step picker: choose a tag, then jump to matching items across every markdown file in the workspace
- Status bar now shows `done/total` count when any section has checkboxes
- Hover tooltip on section headers now shows completion progress (`done/total`)
- `CL: Quick Capture` — two-step floating input: pick a target section (pinned sections first), type an item, it appends immediately
- `CL: Save Section as Template` — saves the section at the cursor as a reusable user template with Tab stops

## [3.0.0] - 2026-03-20

### Added
- `>> -- Group Name` divider syntax — groups related sections together
- `CL: Group Sections` — inserts a group divider above the section at the cursor
- `CL: Filter Groups` — quick pick navigation across all named groups
- `CL: Suggest Items (AI)` — calls Claude to suggest 3-5 new items for the current section
- `CL: Summarise Section (AI)` — generates a one-line summary and inserts it as an item
- `CL: Expand Item (AI)` — expands the item at the cursor into nested sub-items
- `chevron-lists.anthropicApiKey` setting — provide your API key to enable AI commands
- 14 new unit tests covering group parsing, divider detection and collection

## [2.8.0] - 2026-03-20

### Added
- `!`, `!!`, `!!!` priority markers in items — `>> - !!! Critical task`
- `CL: Filter by Priority` — two-step quick pick: choose level then jump to matching items with live preview
- `@YYYY-MM-DD` due date syntax in items — `>> - Deploy server @2026-04-01`
- `CL: Show Upcoming` — all dated items sorted chronologically with overdue indicators
- Overdue items flagged in the Problems panel (Warning severity)
- 22 new unit tests covering priority parsing, date extraction, overdue detection and collection

## [2.6.0] - 2026-03-20

### Added
- `CL: Toggle Pin` — pins/unpins the section header at the cursor; persists across sessions via workspace state
- `CL: Filter Pinned Sections` — quick pick showing only pinned sections, with live preview navigation
- `CL: Export File as HTML` — exports the entire file as a styled standalone HTML document
  - Sections as collapsible `<details>` elements
  - `#tags` rendered as coloured badges
  - `[[links]]` become anchor links within the page
  - `[x]`/`[ ]` checkboxes rendered with strikethrough styling
  - Dark-mode design using VS Code-inspired colours
- 18 new unit tests covering HTML escaping, slugification, content rendering and document building

## [2.4.0] - 2026-03-20

### Added
- `[x]`/`[ ]` checkbox syntax in items — `>> - [x] Done` / `>> - [ ] Todo`
- `CL: Toggle Item Done` — toggles checkbox state on the item at the cursor
- 16 new unit tests covering checkbox parsing, toggling, and counting

## [2.3.0] - 2026-03-20

### Added
- `[[SectionName]]` link syntax in item content — links to another section in the same file
- `CL: Go to Linked Section` command — jumps to the section referenced by [[...]] at the cursor
- Hover over `[[...]]` shows a preview of the linked section's items
- Unresolved links show a warning in the hover tooltip
- 17 new unit tests covering link extraction, resolution and collection

## [6.3.0] - 2026-03-20

### Fixed
- **Enter mid-line on numbered/bullet items now works correctly** — pressing Enter anywhere on a `>> N.` or `>> -` line splits the line at the cursor, keeps text before the cursor on the current line, and starts the next numbered/bullet line with the remaining text

### Added
- `CL: Convert Bullets to Numbered` — converts all `>> -` bullet items in the current section to a numbered sequence, continuing from the last existing number (sentence order preserved)
- `[LABEL TEXT]` square bracket syntax — text inside `[...]` in item content is highlighted as a `chevronLabel` token in a distinct colour (gold/amber by default)
- All colour presets updated with a `chevronLabel` colour

## [6.3.0] - 2026-03-20

### Fixed
- **Enter mid-line on numbered/bullet items** — pressing Enter anywhere on a `>> N.` or `>> -` line now correctly splits the line at the cursor and starts the next item with the remaining text

### Added
- `CL: Convert Bullets to Numbered` — converts all `>> -` bullets in the section to numbered items, continuing from the last existing number; sentence order fully preserved
- `[LABEL TEXT]` square bracket highlighting — text in `[...]` in item content rendered as `chevronLabel` semantic token (gold/amber by default)
- All six colour presets updated with `chevronLabel` colour
- README completely rewritten to cover all commands and features through v6.3.0

## [6.2.0] - 2026-03-20

### Added
- `>>depends:SectionName` dependency syntax — marks a section as depending on another
- `CL: Show Dependencies` — quick pick of all dependency relationships in the file
- `+N` vote count syntax in items — `>> - Great idea +5`
- `CL: Sort by Votes` — sorts section items by vote count descending
- `CL: Add Vote` / `CL: Remove Vote` — increments/decrements the vote count at the cursor
- `CL: Hide Section` — marks a section with `>> [hidden]` and folds it
- `CL: Show Hidden Sections` — reveals and unfolds all hidden sections

## [5.8.0] - 2026-03-20

### Added
- `* ` star marker syntax in items — `>> - * Key task`
- `CL: Toggle Star` — toggles the star marker on the item at the cursor
- `CL: Filter Starred Items` — quick pick of all starred items with live preview
- `CL: Export Statistics as CSV` — section stats exported to CSV
- `CL: Export Statistics as JSON` — section stats exported to JSON
- `[[file:filename.md]]` linked file syntax in items
- `CL: Go to Linked File` — opens the linked file under the cursor
- Hover on `[[file:...]]` links shows a preview of the target file's first lines
- `~Nh`, `~Nm`, `~NhNm` time estimate syntax in items — `>> - Deploy server ~2h`
- `CL: Show Time Estimates` — all estimated items sorted by duration; shows total time

## [5.4.0] - 2026-03-20

### Added
- `CL: Show Section Summary` — quick notification with item/done/word/tag counts for the current section
- `CL: Count Items by Tag` — breakdown of item counts per `#tag` in the file
- `CL: Jump Back` — returns to the previous cursor position after a navigation command
- Jump history is populated automatically by `Ctrl+Alt+Down/Up` navigation
- `CL: Promote Item to Header` — converts the item at the cursor into a new section header
- `CL: Demote Header to Item` — converts the section header into a bullet in the section above
- `CL: Export File as Markdown Document` — exports as clean standard markdown (`##` headings, `-` bullets)

## [5.0.0] - 2026-03-20

### Added
- `CL: Archive Done Items` — moves all `[x]` items from the current section to an Archive section
- `CL: Archive Section` — moves the entire current section to the Archive area
- `CL: Find in Sections` — live quick pick search across all item content in the file
- `CL: Replace in Section` — find and replace within the current section's items only
- `CL: Focus on Section` — folds all other sections, reveals only the current one
- `CL: Unfocus` — restores all folded sections
- `>> [bookmark:Name]` bookmark syntax
- `CL: Add Bookmark` — inserts a named bookmark at the cursor
- `CL: Jump to Bookmark` — quick pick of all bookmarks in the file
- `CL: Remove Bookmark` — removes the bookmark on the current line

## [4.6.0] - 2026-03-20

### Added
- `CL: Clone Item` — duplicates the item at the cursor to the end of the same section
- `CL: Clone Item to Section` — duplicates the item to a chosen section via quick pick
- `CL: Merge Section Below` — combines the current section with the one below
- `CL: Split Section Here` — splits the current section at the cursor line into two named sections
- `CL: Enter Reading Mode` — opens the file as a live-updating HTML webview beside the editor
- `CL: Compare Section to Clipboard` — shows a diff of the current section vs clipboard content

## [4.2.0] - 2026-03-20

### Added
- Word count goal status bar integration — shows `words/goal` when cursor is in a section with `==N`
- Word count goal diagnostics — sections below target flagged as Information in the Problems panel
- `CL: Set Word Count Goal` — sets or updates the `==N` marker on the current section header
- `@Name` mention syntax in items — `>> - Discuss with @Lewis`
- `CL: Filter by Mention` — two-step picker: choose a person, jump to their items
- `CL: Bulk Tag Items` — add a `#tag` to all items in the current section
- `CL: Bulk Set Priority` — set priority level on all items in the current section
- `CL: Bulk Set Due Date` — set a due date on all items in the current section
- Cleaned up `extension.ts` — all 60+ commands organised into logical groups

## [3.8.0] - 2026-03-20

### Added
- `CL: Export File as JSON` — full structured export with tags, priority, dates, checkboxes per item
- `CL: Export File as CSV` — flat CSV with one row per item and all metadata columns
- `>> > Note text` inline note syntax on items
- `CL: Toggle Note` — adds/removes a note line on the item at the cursor
- `@daily`, `@weekly`, `@monthly` recurrence markers in items
- `CL: Show Recurring` — quick pick of all recurring items
- `CL: Generate Next Occurrence` — clones a recurring item with the next due date
- `==N` word count goal syntax in section headers — `> My Section ==500`

## [3.4.0] - 2026-03-20

### Added
- `CL: Filter by Tag (Workspace)` — two-step picker: choose a tag, then jump to matching items across every markdown file in the workspace
- Status bar now shows `done/total` count when any section has checkboxes
- Hover tooltip on section headers now shows completion progress (`done/total`)
- `CL: Quick Capture` — two-step floating input: pick a target section (pinned sections first), type an item, it appends immediately
- `CL: Save Section as Template` — saves the section at the cursor as a reusable user template with Tab stops

## [3.0.0] - 2026-03-20

### Added
- `>> -- Group Name` divider syntax — groups related sections together
- `CL: Group Sections` — inserts a group divider above the section at the cursor
- `CL: Filter Groups` — quick pick navigation across all named groups
- `CL: Suggest Items (AI)` — calls Claude to suggest 3-5 new items for the current section
- `CL: Summarise Section (AI)` — generates a one-line summary and inserts it as an item
- `CL: Expand Item (AI)` — expands the item at the cursor into nested sub-items
- `chevron-lists.anthropicApiKey` setting — provide your API key to enable AI commands
- 14 new unit tests covering group parsing, divider detection and collection

## [2.8.0] - 2026-03-20

### Added
- `!`, `!!`, `!!!` priority markers in items — `>> - !!! Critical task`
- `CL: Filter by Priority` — two-step quick pick: choose level then jump to matching items with live preview
- `@YYYY-MM-DD` due date syntax in items — `>> - Deploy server @2026-04-01`
- `CL: Show Upcoming` — all dated items sorted chronologically with overdue indicators
- Overdue items flagged in the Problems panel (Warning severity)
- 22 new unit tests covering priority parsing, date extraction, overdue detection and collection

## [2.6.0] - 2026-03-20

### Added
- `CL: Toggle Pin` — pins/unpins the section header at the cursor; persists across sessions via workspace state
- `CL: Filter Pinned Sections` — quick pick showing only pinned sections, with live preview navigation
- `CL: Export File as HTML` — exports the entire file as a styled standalone HTML document
  - Sections as collapsible `<details>` elements
  - `#tags` rendered as coloured badges
  - `[[links]]` become anchor links within the page
  - `[x]`/`[ ]` checkboxes rendered with strikethrough styling
  - Dark-mode design using VS Code-inspired colours
- 18 new unit tests covering HTML escaping, slugification, content rendering and document building

## [2.4.0] - 2026-03-20

### Added
- `[x]`/`[ ]` checkbox syntax in items — `>> - [x] Done` / `>> - [ ] Todo`
- `CL: Toggle Item Done` — toggles checkbox state on the item at the cursor
- 16 new unit tests covering checkbox parsing, toggling, and counting

## [2.3.0] - 2026-03-20

### Added
- `[[SectionName]]` link syntax in item content — links to another section in the same file
- Hover over a `[[link]]` shows a preview of the target section's items
- F12 / Go to Definition on a `[[link]]` jumps to the target header
- Ctrl+click on a `[[link]]` navigates to the target section
- `CL: Go to Linked Section` command — jumps to the linked section from the cursor
- Broken links (section not found) show a warning in the hover tooltip
- 17 new unit tests covering link extraction, collection and header resolution

## [2.2.0] - 2026-03-20

### Added
- `#tag` support in item content — e.g. `>> - Deploy server #urgent #backend`
- `CL: Filter by Tag` — quick pick all tags in the file, then jump to matching items with live preview
- 18 new unit tests covering tag extraction, stripping, collection and deduplication

## [2.1.0] - 2026-03-20

### Added
- Diagnostics in the Problems panel: duplicate section names, empty sections, out-of-sequence numbered items
- `CL: Fix Numbering` — auto-corrects all out-of-sequence numbered items in the file
- Diagnostics update live as you type
- README updated to cover all features through v2.0.0
- `release.ps1` now runs tests before packaging

## [2.0.0] - 2026-03-20

### Added
- `CL: Show File Statistics` — webview panel showing sections, items, words, avg items/section, most/least populated section
- `CL: Insert Template` — quick pick of 5 built-in templates plus user-defined via `chevron-lists.templates` setting
- `CL: Search Items (Workspace)` — search all chevron items across every markdown file in the workspace
- `CL: Filter Sections (Workspace)` — jump to any chevron section in any markdown file in the workspace
- `chevron-lists.templates` setting — define custom named templates with VS Code snippet syntax

## [1.7.0] - 2026-03-20

### Added
- Chevron sections now appear in VS Code's **Outline panel** and **breadcrumb navigation**
- Each section shows its name and item count in the Outline
- Expanding a section in the Outline reveals all its items as children
- Clicking any item in the Outline jumps directly to that line
- 11 new unit tests covering all outline symbol building logic

## [1.6.1] - 2026-03-20

### Changed
- All command palette titles shortened from `Chevron Lists: ...` to `CL: ...` for faster searching

## [1.6.0] - 2026-03-20

### Added
- `Chevron Lists: Switch Colour Preset` command â€” quick pick to switch between 5 built-in colour presets live
- `chevron-lists.colourPreset` setting: `default`, `ocean`, `forest`, `sunset`, `monochrome`, `custom`
- Preset colours applied automatically on activation so they survive window restarts
- `custom` option removes built-in preset rules, leaving full control to the user via `semanticTokenColorCustomizations`
- 19 unit tests covering all preset data validation

## [1.6.0] - 2026-03-20

### Added
- `Chevron Lists: Switch Colour Preset` command â€” live quick pick to switch between 6 built-in colour themes instantly
- `chevron-lists.colourPreset` setting: `default`, `ocean`, `forest`, `sunset`, `monochrome`, `custom`
- Preset is automatically applied on extension activation
- `custom` preset clears all chevron colour overrides so you can define your own via `semanticTokenColorCustomizations`
- 13 new unit tests covering preset structure and validation

## [1.5.0] - 2026-03-20

### Added
- Semantic token provider â€” chevron elements now have dedicated token types that any theme can target independently:
  - `chevronHeader` â€” section header text
  - `chevronPrefix` â€” `>`, `>> -`, `>> N.` punctuation
  - `chevronNumber` â€” the number in `>> N.` items
  - `chevronContent` â€” item text content
- Built-in colour recommendations via `configurationDefaults` â€” headers appear bold/amber, prefixes muted grey, numbers blue, out of the box with any theme
- `semanticTokenScopes` mapping ensures the tokens also work in themes that don't use semantic highlighting
- 16 new unit tests covering all semantic token range logic

## [1.4.0] - 2026-03-20

### Added
- `Chevron Lists: Search Items` â€” live-filtering quick pick showing every item across all sections in the file; moving through results previews the location; Escape restores original position
- `Chevron Lists: Filter Sections` â€” live-filtering quick pick showing all section headers; jump instantly to any section by name
- 11 new unit tests covering item and header collection logic

## [1.3.2] - 2026-03-20

### Added
- `chevron-lists.snippetTrigger` setting â€” choose how `chl`/`chn` snippets are triggered:
  - `tab` (default) â€” press Tab after typing the prefix
  - `ctrl+enter` â€” press Ctrl+Enter (no Copilot conflict)
  - `none` â€” disable keyboard expansion, use Insert Snippet from the command palette

## [1.3.1] - 2026-03-20

### Fixed
- `chl` and `chn` snippets now expand correctly â€” our Tab keybinding was intercepting Tab before VS Code's snippet engine could run. Snippets are now expanded directly in the Tab handler when the text before cursor matches a prefix.

## [1.3.0] - 2026-03-20

### Added
- `chl` snippet â€” type `chl` + Tab in a markdown file to insert a chevron bullet list block with Tab stops for the header and each item
- `chn` snippet â€” type `chn` + Tab to insert a chevron numbered list block with Tab stops
- 10 unit tests validating snippet structure and content

## [1.2.0] - 2026-03-20

### Added
- `Chevron Lists: Sort Items A â†’ Z` â€” sorts all bullet items in the current section alphabetically (case-insensitive)
- `Chevron Lists: Sort Items Z â†’ A` â€” reverse alphabetical sort
- `Chevron Lists: Renumber Items` â€” resets all numbered items in the section back to 1, 2, 3... per chevron depth
- 14 new unit tests covering all sorting and renumber logic

## [1.1.0] - 2026-03-20

### Added
- `Chevron Lists: Copy Section as Markdown` â€” converts the current section to a standard markdown heading + list and copies to clipboard
- `Chevron Lists: Copy Section as Plain Text` â€” strips all prefixes and copies just the header text and item content to clipboard
- Nested items are indented correctly in both export formats
- 16 new unit tests covering all export conversion logic

## [1.0.4] - 2026-03-20

### Fixed
- Move Section Up/Down now correctly swaps only the header and its chevron items â€” blank lines, `---` dividers, and any non-chevron content between sections stay exactly in place during a swap

## [1.0.3] - 2026-03-20

### Fixed
- Move Section Up/Down now feels like dragging â€” cursor follows the moved section to its new position rather than staying put, making it clear which section moved and allowing repeated moves without repositioning the cursor

## [1.0.2] - 2026-03-20

### Fixed
- Multi-cursor Tab/Shift+Tab now correctly handles range selections (Shift+click) as well as multi-cursor selections (Alt+click) â€” previously only the active cursor line was affected

## [1.0.1] - 2026-03-20

### Fixed
- Extension now loads correctly â€” stale compiled test/mock files removed from `out/` that were causing silent activation failure
- Navigation keybindings changed from `Alt+Up/Down` to `Ctrl+Alt+Up/Down` to avoid conflict with VS Code's built-in move-line commands
- `.vscodeignore` updated to explicitly exclude `out/__mocks__/` and `out/__tests__/` from VSIX
- Removed stale `paths` mapping from `tsconfig.json`

## [1.0.0] - 2026-03-20

### Added
- Full SOLID refactor â€” split into 12 focused modules (all under 200 lines)
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
- `extension.ts` is now wiring-only â€” all logic delegated to focused handler modules

## [0.6.1] - 2026-03-19

### Fixed
- Tab no longer intercepts Copilot inline suggestions â€” pressing Tab now accepts a Copilot suggestion as expected; only falls through to chevron indent behaviour when no suggestion is visible

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



