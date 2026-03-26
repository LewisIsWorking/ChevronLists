# Chevron Lists

A VS Code extension with smart keyboard behaviour, rich organisation tools, live decorations, autocomplete, and AI assistance for nested blockquote list syntax in markdown.

## Syntax

```markdown
> This is a section header
>> - First item
>> - Second item
>> 1. Numbered item
```

Deep nesting works at any level:

```markdown
> Section
>> - Top level item
>>> - Nested item
>>>> - Deeply nested item
```

### Item Markers

| Marker | Example | Feature |
|--------|---------|---------|
| `[x]` / `[ ]` / `[]` | `>> - [x] Done task` | Checkboxes (`[]` treated same as `[ ]`) |
| `#tag` | `>> - Deploy #urgent` | Tags |
| `!` / `!!` / `!!!` | `>> - !!! Critical` | Priority |
| `@YYYY-MM-DD` | `>> - Ship @2026-04-01` | Due date |
| `@daily/weekly/monthly` | `>> - Standup @daily` | Recurrence |
| `~2h` / `~30m` | `>> - Deploy ~2h` | Time estimate |
| `* ` | `>> - * Key task` | Star marker |
| `+N` | `>> - Great idea +5` | Vote count |
| `[[SectionName]]` | `>> - See [[Act Two]]` | Section link |
| `[[file:name.md]]` | `>> - See [[file:notes.md]]` | File link |
| `[[file:name.md#Section]]` | `>> - See [[file:notes.md#Act One]]` | File + section link |
| `[LABEL TEXT]` | `>> - [ACTION] do thing` | Square bracket label (gold) |
| `{red}` / `{green}` / `{blue}` etc. | `>> - {red} blocked` | Colour label |
| `~~text~~` | `>> - ~~cancelled task~~` | Strikethrough |
| `// comment` | `>> - Deploy // ask Lewis first` | Inline comment (muted) |
| `? ` | `>> - ? unclear requirement` | Question flag |
| `@created:YYYY-MM-DD` | `>> - task @created:2026-01-01` | Creation date stamp |
| `@expires:YYYY-MM-DD` | `>> - task @expires:2026-12-31` | Expiry date |
| `★N` | `>> - ★4 great idea` | Star rating (1–5) |


### Section Syntax

| Syntax | Example | Feature |
|--------|---------|---------|
| `>> -- Group Name` | `>> -- Act One` | Section group divider |
| `>> > Note text` | `>> > This is a note` | Inline note |
| `>> [bookmark:Name]` | `>> [bookmark:Key Scene]` | Named bookmark |
| `>> [hidden]` | `>> [hidden]` | Hidden section marker |
| `>> [locked]` | `>> [locked]` | Locked section (skipped by bulk ops) |
| `>>depends:Name` | `>>depends:Phase One` | Dependency marker |
| `==N` | `> My Section ==500` | Word count goal |

---

## Smart Enter & Tab

- **Enter** after `> Header` → starts a `>> -` item
- **Enter mid-line** on a `> Header` → splits into two headers at cursor
- **Enter** after `>> - Item` → continues the list
- **Enter** on an empty `>> -` → stops the list
- **Enter** after `>> 1. Item` → auto-increments to `>> 2.`
- **Enter mid-line** on any item → splits at cursor, remaining text goes to the new item
- **Tab** on a `>> -` line → promotes to `>>> -` (also shifts child items)
- **Shift+Tab** → demotes back one level (also shifts child items)
- Multi-cursor aware; Tab suppressed when Copilot suggestion is visible

---

## Autocomplete

Type a marker trigger character in any chevron item to get inline suggestions:

| Trigger | Suggestions |
|---------|-------------|
| `#` | All existing tags in the file, sorted by frequency |
| `@` | All `@PersonName` mentions used in the file |
| `[[` | All section headers in the file |
| `!` | `!` (low) · `!!` (medium) · `!!!` (high) with descriptions |
| `@` (date) | today · tomorrow · next Friday · next week · next month |
| `~` | `~15m` · `~30m` · `~1h` · `~2h` · `~4h` · `~1d` |
| `★` | `★1` through `★5` with visual star previews |

---

## Live Decorations

These update automatically as you type — no commands needed:

| Decoration | What it shows |
|------------|---------------|
| **Section Summary** | `(5 items · 2 done · 3 tags)` ghost text after every header |
| **Checklist Progress Bar** | `▓▓▓░░ 3/5` on headers with checkbox items (red/amber/green) |
| **Word Goal Bar** | `▓▓▓▓░░░░░░ 147/500` on headers with `==N` goals (red/amber/green) |
| **Item Count Badge** | `(N)` item count after each header |
| **Item Age Highlight** | Items with `@created:` dates 30+ days old rendered muted and italic |
| **Overdue Status Bar** | `⚠ N overdue` warning badge in the status bar — click to open Upcoming |

All decorations can be toggled individually via `CL: Toggle Section Summary`, `CL: Toggle Checklist Progress Bar`, `CL: Toggle Word Goal Bar`, `CL: Toggle Age Highlight`, or disabled all at once with `CL: Toggle All Decorations`.

---

## All Commands

Type `CL:` in the command palette (`Ctrl+Shift+P`).

### Navigation

| Command | Description |
|---------|-------------|
| `Ctrl+Alt+Down` | Jump to next header |
| `Ctrl+Alt+Up` | Jump to previous header |
| `CL: Jump Back` | Returns to the previous cursor position |
| `CL: Show Jump History` | Quick pick of all 10 stored positions — jump to any |
| `CL: Filter Sections` | Live quick pick of all headers in the file |
| `CL: Filter Sections (Workspace)` | Jump to any section across all workspace files |
| `CL: Filter Pinned Sections` | Jump to a pinned section |
| `CL: Filter Groups` | Jump to a named `>> --` section group |
| `CL: Jump to Bookmark` | Quick pick of all `[bookmark:Name]` markers |
| `CL: Focus on Section` | Folds all other sections |
| `CL: Unfocus` | Restores all folded sections |
| `CL: Fold All Sections` | Folds every section at once |
| `CL: Unfold All Sections` | Unfolds all sections at once |


### Search & Filter

| Command | Description |
|---------|-------------|
| `CL: Search Items` | Live search of all items in the file |
| `CL: Search Items (Workspace)` | Search items across every markdown file |
| `CL: Find in Sections` | Find items by content (no syntax noise) |
| `CL: Filter by Tag` | Filter items by `#tag` |
| `CL: Filter by Tag (Workspace)` | Same across all workspace files |
| `CL: Filter by Priority` | Filter by `!` / `!!` / `!!!` |
| `CL: Filter by Mention` | Filter by `@PersonName` |
| `CL: Filter by Mention (Workspace)` | Same across all workspace files |
| `CL: Filter by Colour Label` | Quick pick of all `{colour}` items, grouped by colour |
| `CL: Filter by Colour Label (Workspace)` | Same across all workspace files |
| `CL: Filter by Rating` | Shows items at or above a chosen `★N` threshold |
| `CL: Filter Starred Items` | Quick pick of all `* ` starred items |
| `CL: Filter Flagged Items` | Quick pick of all `? ` flagged items |
| `CL: Show Upcoming` | `@date` items sorted chronologically; overdue flagged |
| `CL: Show Expired Items` | All `@expires:` items past their expiry date |
| `CL: Show Old Items` | All `@created:` items older than N days |
| `CL: Show Recurring` | All `@daily/@weekly/@monthly` items |
| `CL: Show Time Estimates` | All `~time` items sorted by duration with total |
| `CL: Show Dependencies` | All `>>depends:` relationships |
| `CL: Collect Items by Tag` | Gathers all items with a chosen `#tag` into a new Results section |
| `CL: Show Completion Streak` | Sections where every checkbox item is `[x]` done |
| `CL: Section Health Check` | Flags empty-content, duplicate, and too-long items |

### Section Actions

| Command | Description |
|---------|-------------|
| `CL: New Section` | Prompts for a name, inserts header + blank item; cursor ready |
| `CL: Select Section Items` | Selects all items under the nearest header |
| `CL: Delete Section` | Deletes header and all items |
| `CL: Duplicate Section` | Copies the section directly below itself |
| `CL: Move Section Up / Down` | Swaps the section with its neighbour |
| `CL: Move Item to Top of Section` | Moves item before the first item in its section |
| `CL: Move Item to Bottom of Section` | Moves item after the last item in its section |
| `CL: Pin Section to Top` | Moves section to the very first position in the file |
| `CL: Toggle Pin` | Pins/unpins the section at the cursor |
| `CL: Group Sections` | Inserts a `>> -- Name` group divider |
| `CL: Rename Section` | Renames header and updates all `[[links]]` in the file |
| `CL: Merge Section Below` | Combines current section with the one below |
| `CL: Split Section Here` | Splits section at cursor into two named sections |
| `CL: Diff Two Sections` | Line-by-line diff of any two sections in a side panel |
| `CL: Archive Done Items` | Moves all `[x]` items to an `> Archive` section |
| `CL: Archive Section` | Moves the entire section to Archive |
| `CL: Hide Section` | Marks with `>> [hidden]` and folds |
| `CL: Show Hidden Sections` | Reveals all hidden sections |
| `CL: Lock Section` | Marks section with `>> [locked]`; skipped by bulk operations |
| `CL: Unlock Section` | Removes the lock marker |
| `CL: Snapshot Section` | Saves the section to workspace state as a named snapshot |
| `CL: Restore Snapshot` | Replaces the section with a saved snapshot |
| `CL: List Snapshots` | Shows all saved snapshots for the current file |
| `CL: Compare Section Statistics` | Side-by-side stats of any two sections |
| `CL: Sort Sections A → Z / Z → A` | Reorders all sections alphabetically |
| `CL: Insert Table of Contents` | Inserts a `[[linked]]` TOC from all section headers |


### Item Actions

| Command | Description |
|---------|-------------|
| `CL: Toggle Item Done` | Toggles `[ ]` ↔ `[x]`; auto-archives if `autoArchive` enabled |
| `CL: Toggle Star` | Toggles `* ` star marker |
| `CL: Toggle Note` | Adds/removes a `>> > Note` line |
| `CL: Toggle Flag` | Toggles `? ` question flag |
| `CL: Add Vote` / `CL: Remove Vote` | Increments/decrements `+N` vote count |
| `CL: Duplicate Item` | Duplicates item directly below itself |
| `CL: Duplicate Item and Increment` | Duplicates and increments the first number (`Draw card 1` → `Draw card 2`) |
| `CL: Clone Item` | Copies item to end of same section |
| `CL: Clone Item to Section` | Copies item to a chosen section in this file |
| `CL: Move Item Up` / `CL: Move Item Down` | Moves item one position up or down |
| `CL: Move Item to Section` | Moves item to a chosen section (removes original) |
| `CL: Move Item to File` | Moves item to a chosen section in any workspace file |
| `CL: Edit Item Content` | Opens input box with plain text (markers hidden); saves with markers preserved |
| `CL: Set Item Rating` | Sets `★N` rating (1–5) via quick pick |
| `CL: Promote Item to Header` | Converts item to a new section header |
| `CL: Demote Header to Item` | Converts section header to a bullet item |
| `CL: Go to Linked Section` | Jumps to `[[linked section]]` under cursor |
| `CL: Go to Linked File` | Opens `[[file:name.md]]` linked file |
| `CL: Insert File Section Link` | Inserts `[[file:name.md#SectionName]]` composite link |
| `CL: Quick Capture` | Pick a section, type an item (pinned sections first) |
| `CL: Add Bookmark` / `CL: Remove Bookmark` | Adds/removes `[bookmark:Name]` |
| `CL: Set Item Colour` | Sets `{colour}` label via quick pick |
| `CL: Stamp Item with Date` | Adds `@created:YYYY-MM-DD` to the item |
| `CL: Strikethrough Item` / `CL: Remove Strikethrough` | Toggles `~~strikethrough~~` |
| `CL: Preview Item` | Rich notification showing all parsed markers |

### Bulk Actions

| Command | Description |
|---------|-------------|
| `CL: Bulk Tag Items` | Adds a `#tag` to every item in the section |
| `CL: Bulk Set Priority` | Sets priority on every item in the section |
| `CL: Bulk Set Due Date` | Sets a due date on every item in the section |
| `CL: Bulk Set Rating` | Sets `★N` rating on every item in the section |
| `CL: Clear All Priority` | Removes all `!`/`!!`/`!!!` markers from the section |
| `CL: Clear All Due Dates` | Removes all `@YYYY-MM-DD` markers from the section |
| `CL: Shift All Due Dates` | Shifts every `@date` in the section by ±N days |
| `CL: Replace in Section` | Find and replace within section item content |
| `CL: Mark All Done` | Marks all `[ ]` items as `[x]` |
| `CL: Mark All Undone` | Resets all `[x]` items to `[ ]` |
| `CL: Remove All Checkboxes` | Strips all `[x]`/`[ ]` markers |
| `CL: Strip Comments` | Removes all `// comment` tails from the section |
| `CL: Strip All Metadata` | Removes all marker syntax, leaving plain text only |
| `CL: Remove Old Items` | Deletes items with `@created:` dates older than N days (with confirmation) |

### Sorting & Numbering

| Command | Description |
|---------|-------------|
| `CL: Sort Items A → Z / Z → A` | Alphabetical sort of items |
| `CL: Sort by Votes` | Sorts by `+N` vote count descending |
| `CL: Renumber Items` | Resets numbered sequence per depth |
| `CL: Fix Numbering` | Auto-corrects all out-of-sequence numbered items in the file |
| `CL: Set List Start Number` | On a numbered item: rebases from here with a new start number. On a blank line: inserts a new item at that number |
| `CL: Rebase List From Here` | Renumbers from the cursor item with a new start number |
| `CL: Offset List Numbers` | Shifts all numbers in the section by ±N |
| `CL: Convert Bullets to Numbered` | Converts `>> -` items to `>> N.` |
| `CL: Convert Numbered to Bullets` | Converts `>> N.` items back to `>> -` |


### Text Transforms

| Command | Description |
|---------|-------------|
| `CL: Uppercase Item` | Converts item content to UPPERCASE |
| `CL: Lowercase Item` | Converts to lowercase |
| `CL: Title Case Item` | Converts to Title Case |

### Paste

| Command | Description |
|---------|-------------|
| `CL: Paste as Bullet Items` | Clipboard lines → `>> -` items |
| `CL: Paste as Numbered Items` | Clipboard lines → `>> N.` items continuing from existing |
| `CL: Paste Clipboard as Section` | First line → `> Header`, remaining lines → `>> -` items |

### Export & Copy

| Command | Description |
|---------|-------------|
| `CL: Copy Section As…` | Unified export: Markdown, Plain Text, JSON, CSV, or HTML |
| `CL: Copy Section as JSON` | Full structured JSON with all parsed marker data |
| `CL: Convert Section to Markdown Table` | Section items → `\| # \| Content \|` table in a side panel |
| `CL: Export File as HTML` | Styled standalone HTML with collapsible sections |
| `CL: Export File as JSON` | Full structured export with all metadata |
| `CL: Export File as CSV` | Flat CSV with one row per item |
| `CL: Export File as Markdown Document` | Clean `##` / `-` standard markdown |
| `CL: Export All Sections as JSON` | Every section in the file → single JSON file on disk |
| `CL: Export Statistics as CSV / JSON` | Section stats as CSV or JSON |
| `CL: Compare Section to Clipboard` | Line diff of current section vs clipboard |

### Rename

| Command | Description |
|---------|-------------|
| `CL: Rename Section` | Renames header and updates all `[[links]]` in the file |
| `CL: Rename Tag` | Renames a `#tag` across the current file |
| `CL: Rename Tag (Workspace)` | Renames a `#tag` across all workspace files |

### Statistics & Analytics

| Command | Description |
|---------|-------------|
| `CL: Show File Statistics` | Webview: sections, items, words, done/total, tags, colours, flags, word goals |
| `CL: Show Workspace Statistics` | Aggregated stats across all workspace markdown files |
| `CL: Show Word Count` | Word counts per section with `==N` goal progress |
| `CL: Show Section Summary` | Item/done/word/tag counts for the cursor section |
| `CL: Show Nesting Summary` | Depth breakdown for items in the cursor section |
| `CL: Compare Section Statistics` | Side-by-side comparison of any two sections |
| `CL: Count Items by Tag` | Item counts per `#tag` |
| `CL: Show Tag Report (Workspace)` | All tags across workspace with per-file item counts |
| `CL: Show Word Frequency` | Most-used words in the file |
| `CL: Show Section Weights` | Sections ranked by composite score (items×3 + priority + votes + tags) |
| `CL: Show Tag / Completion Heatmap` | Visual heatmap of tag or completion density per section |

### Templates & Snippets

| Command / Prefix | Description |
|---------|-------------|
| `chl` + trigger | Inserts a bullet list block with Tab stops |
| `chn` + trigger | Inserts a numbered list block with Tab stops |
| `CL: Insert Template` | Quick pick of all built-in and user templates |
| `CL: Browse Templates` | Webview gallery with preview and one-click insert |
| `CL: Insert Item Snippet` | 10 pre-configured item templates (task, urgent, starred, flagged, timed…) |
| `CL: Save Section as Template` | Saves the cursor section as a reusable template |
| `CL: Import Templates from File` | Imports all sections from a `.md` file as templates |
| `CL: Export Templates to File` | Exports user templates to a `.md` file |
| `CL: Set Word Count Goal` | Sets/updates the `==N` goal on the current header |

### Daily Notes

| Command | Description |
|---------|-------------|
| `CL: Open Daily Note` | Opens or creates `YYYY-MM-DD.md` in `dailyNotesFolder`; cursor lands on the blank item |

Configure with `chevron-lists.dailyNotesFolder` (folder path) and `chevron-lists.dailyNoteTemplate` (supports `{{date}}`, `{{weekday}}`, `{{day}}` placeholders).

### Section Timer

| Command | Description |
|---------|-------------|
| `CL: Start Section Timer` | Starts a live elapsed-time decoration on the section header and status bar |
| `CL: Stop Section Timer` | Stops the timer and shows total elapsed time |


### Appearance

| Command | Description |
|---------|-------------|
| `CL: Switch Colour Preset` | Choose from 12 presets: `default`, `ocean`, `forest`, `sunset`, `monochrome`, `midnight`, `rose`, `autumn`, `arctic`, `neon`, `sepia`, `custom` |
| `CL: Enter Reading Mode` | Live-updating HTML webview beside the editor |
| `CL: Toggle Section Summary` | Shows/hides the `(N items · N done · N tags)` ghost text |
| `CL: Toggle Checklist Progress Bar` | Shows/hides the `▓▓▓░░ N/N` checklist bar |
| `CL: Toggle Word Goal Bar` | Shows/hides the word goal progress bar |
| `CL: Toggle Item Count Badge` | Shows/hides the `(N)` item count on headers |
| `CL: Toggle Age Highlight` | Shows/hides the 30-day-old item fade |
| `CL: Toggle All Decorations` | Master toggle for all live decorations |

### AI Assist

Requires `chevron-lists.anthropicApiKey` in settings.

| Command | Description |
|---------|-------------|
| `CL: Suggest Items (AI)` | Claude suggests 3–5 new items for the current section |
| `CL: Summarise Section (AI)` | Generates a one-line summary as the first item |
| `CL: Expand Item (AI)` | Expands the item at the cursor into sub-items |
| `CL: Rewrite Item (AI)` | Rewrites item content for clarity; all markers preserved |

---

## Visual Features

### Syntax Highlighting
- `> Header` lines coloured as section headings
- `>> -` / `>> N.` prefixes styled distinctly from content
- `[LABEL TEXT]` brackets highlighted in gold
- `{colour}` labels rendered as distinct tokens
- All colours driven by your active theme or chosen colour preset

### Outline View
Sections appear in the **Outline panel** and **breadcrumb navigation**.

### Folding
Each `> Header` block folds via the standard VS Code fold gutter arrow.

### Hover Tooltips
- Hover `> Header` → item count, word count, completion progress
- Hover `[[section]]` → preview of target section's items
- Hover `[[file:name.md]]` → preview of linked file's first lines

### Diagnostics (Problems Panel)
Quick fixes are available for all diagnostic types via the lightbulb / `Ctrl+.`.

| Diagnostic | Quick Fixes |
|------------|-------------|
| **Duplicate section names** | Rename section · Make unique (append number) |
| **Empty sections** | Add placeholder item · Delete section · Quick capture |
| **Out-of-sequence numbered items** | Fix this number · Set custom start number · Fix all in file |
| **Overdue `@date` items** | Reschedule to today · Remove due date · Mark done |
| **Below `==N` word goal** | Update goal · Remove goal · Show word count |

### Status Bar
`Sections · Items · ✓ done/total · words/goal` — updates as you type.
`⚠ N overdue` warning badge appears when any items are past their due date — click to open `CL: Show Upcoming`.

### Minimap
`> Header` lines appear as coloured markers in the overview ruler.

---

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `chevron-lists.listPrefix` | `-` | Prefix character for bullet items |
| `chevron-lists.blankLineAfterHeader` | `false` | Insert blank line after `> Header` on Enter |
| `chevron-lists.snippetTrigger` | `tab` | Snippet trigger: `tab`, `ctrl+enter`, or `none` |
| `chevron-lists.colourPreset` | `default` | Built-in colour preset |
| `chevron-lists.templates` | `[]` | Custom templates for `CL: Insert Template` |
| `chevron-lists.anthropicApiKey` | `""` | API key for AI Assist — [console.anthropic.com](https://console.anthropic.com) |
| `chevron-lists.autoArchive` | `false` | Auto-move `[x]` items to `> Archive` on toggle |
| `chevron-lists.dailyNotesFolder` | `""` | Folder for daily notes (relative to workspace root, or absolute) |
| `chevron-lists.dailyNoteTemplate` | `""` | Template for new daily notes; supports `{{date}}`, `{{weekday}}`, `{{day}}` |

---

## Development

```bash
bun install           # install dependencies
bun run compile       # type-check TypeScript (no emit)
bun run bundle        # esbuild dev build with source maps
bun run bundle:prod   # esbuild production build (minified)
bun test src/__tests__ --coverage   # run all unit tests with coverage
bunx @vscode/vsce package           # package VSIX
```

725 unit tests, 100% line coverage, 63 test files.

The extension bundles all source into a single `dist/extension.js` via esbuild, keeping the VSIX small (~78KB) and activation fast. See `ARCHITECTURE.md` for module boundary rules — pure functions always live in `patterns.ts` or `*Parser.ts`, never in `*Commands.ts`.

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for full version history.

## Roadmap

See [ROADMAP.md](ROADMAP.md) for planned features.

## License

CC BY-NC-ND 4.0 — © Lewis Creelman. No commercial use. No derivatives.
