# Chevron Lists

A VS Code extension that adds smart keyboard behaviour, rich organisation tools, and AI assistance for nested blockquote list syntax in markdown.

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

Items support inline markers that integrate with commands throughout the extension:

| Marker | Example | Feature |
|--------|---------|---------|
| `[x]` / `[ ]` | `>> - [x] Done task` | Checkboxes — toggle with `CL: Toggle Item Done` |
| `#tag` | `>> - Deploy server #urgent` | Tags — filter with `CL: Filter by Tag` |
| `!` / `!!` / `!!!` | `>> - !!! Critical bug` | Priority — filter with `CL: Filter by Priority` |
| `@YYYY-MM-DD` | `>> - Ship feature @2026-04-01` | Due dates — view with `CL: Show Upcoming` |
| `@daily/weekly/monthly` | `>> - Standup @daily` | Recurrence — view with `CL: Show Recurring` |
| `~2h` / `~30m` / `~1h30m` | `>> - Deploy ~2h` | Time estimates — view with `CL: Show Time Estimates` |
| `* ` | `>> - * Key task` | Star marker — filter with `CL: Filter Starred Items` |
| `+N` | `>> - Great idea +5` | Vote count — sort with `CL: Sort by Votes` |
| `[[SectionName]]` | `>> - See [[Act Two]]` | Section links — navigate with F12 or hover |
| `[[file:name.md]]` | `>> - See [[file:notes.md]]` | File links — open with `CL: Go to Linked File` |
| `[LABEL TEXT]` | `>> - [ACTION] do thing` | Square bracket labels — highlighted in gold |

### Section Syntax

| Syntax | Example | Feature |
|--------|---------|---------|
| `>> -- Group Name` | `>> -- Act One` | Section group divider |
| `>> > Note text` | `>> > This is a note` | Inline note on the preceding item |
| `>> [bookmark:Name]` | `>> [bookmark:Key Scene]` | Named bookmark |
| `>> [hidden]` | `>> [hidden]` | Marks section as hidden |
| `>>depends:Name` | `>>depends:Phase One` | Section dependency marker |
| `==N` | `> My Section ==500` | Word count goal |

---

## Smart Enter

- **Enter** after `> Header` → starts a `>> -` item
- **Enter** after `>> - Item` → continues the list
- **Enter** on an empty `>> -` → stops the list
- **Enter** after `>> 1. Item` → auto-increments to `>> 2.`
- **Enter mid-line** on a `>> N.` or `>> -` line → splits the line at the cursor and starts the next item with the remaining text

## Tab / Shift+Tab — Nesting

- **Tab** on a `>> -` line → promotes to `>>> -`
- **Shift+Tab** → demotes back one level
- Works at arbitrary depth, on both bullet and numbered items
- Multi-cursor aware (Shift+click to select a range)
- Tab is suppressed when a Copilot suggestion is visible

---

## All Commands

Type `CL:` in the command palette (`Ctrl+Shift+P`) to see all commands.

### Navigation
| Command / Key | Description |
|---------------|-------------|
| `Ctrl+Alt+Down` | Jump to next `> Header` (pushes jump history) |
| `Ctrl+Alt+Up` | Jump to previous `> Header` (pushes jump history) |
| `CL: Jump Back` | Returns to the previous cursor position |
| `CL: Filter Sections` | Live quick pick of all headers in the file |
| `CL: Filter Sections (Workspace)` | Jump to any section across the whole workspace |
| `CL: Filter Pinned Sections` | Jump to a pinned section |
| `CL: Filter Groups` | Jump to a named section group |
| `CL: Jump to Bookmark` | Quick pick of all `[bookmark:Name]` markers |
| `CL: Focus on Section` | Folds all other sections, reveals only the current one |
| `CL: Unfocus` | Restores all folded sections |

### Search
| Command | Description |
|---------|-------------|
| `CL: Search Items` | Live search of all items in the file with preview |
| `CL: Search Items (Workspace)` | Search items across every markdown file |
| `CL: Find in Sections` | Find items matching a term (content-only, no syntax) |
| `CL: Filter by Tag` | Filter items by `#tag` |
| `CL: Filter by Tag (Workspace)` | Same across all workspace files |
| `CL: Filter by Priority` | Filter items by `!` / `!!` / `!!!` level |
| `CL: Filter by Mention` | Filter items by `@PersonName` mention |
| `CL: Filter Starred Items` | Quick pick of all `* ` starred items |
| `CL: Show Upcoming` | All `@date` items sorted chronologically; overdue flagged |
| `CL: Show Recurring` | All `@daily/@weekly/@monthly` recurring items |
| `CL: Show Time Estimates` | All `~time` estimated items sorted by duration, with total |
| `CL: Show Dependencies` | All `>>depends:` relationships in the file |
| `CL: Count Items by Tag` | Breakdown of item counts per `#tag` |
| `CL: Show Section Summary` | Item/done/word/tag counts for the current section |

### Section Actions
| Command | Description |
|---------|-------------|
| `CL: Select Section Items` | Selects all items under the nearest header |
| `CL: Delete Section` | Deletes header + all items |
| `CL: Duplicate Section` | Copies the section below itself |
| `CL: Move Section Up / Down` | Swaps the section with its neighbour |
| `CL: Toggle Pin` | Pins/unpins the section at the cursor |
| `CL: Group Sections` | Inserts a `>> -- Name` group divider above the cursor section |
| `CL: Merge Section Below` | Combines current section with the one below |
| `CL: Split Section Here` | Splits section at cursor into two named sections |
| `CL: Archive Done Items` | Moves all `[x]` items to an `> Archive` section |
| `CL: Archive Section` | Moves the entire section to Archive |
| `CL: Hide Section` | Marks a section with `>> [hidden]` and folds it |
| `CL: Show Hidden Sections` | Reveals and unfolds all hidden sections |

### Item Actions
| Command | Description |
|---------|-------------|
| `CL: Toggle Item Done` | Toggles `[ ]` → `[x]` → `[ ]` on the item at the cursor |
| `CL: Toggle Star` | Toggles the `* ` star marker on the item at the cursor |
| `CL: Toggle Note` | Adds/removes a `>> > Note text` line on the item at the cursor |
| `CL: Add Vote` / `CL: Remove Vote` | Increments/decrements the `+N` vote count |
| `CL: Clone Item` | Duplicates the item to the end of the same section |
| `CL: Clone Item to Section` | Duplicates the item to a chosen section |
| `CL: Promote Item to Header` | Converts the item at the cursor into a new section header |
| `CL: Demote Header to Item` | Converts the section header into a bullet in the section above |
| `CL: Go to Linked Section` | Jumps to the `[[linked section]]` under the cursor |
| `CL: Go to Linked File` | Opens the `[[file:name.md]]` linked file |
| `CL: Quick Capture` | Pick a section, type an item — pinned sections appear first |
| `CL: Add Bookmark` / `CL: Remove Bookmark` | Adds/removes a `[bookmark:Name]` at the cursor |

### Bulk Actions
| Command | Description |
|---------|-------------|
| `CL: Bulk Tag Items` | Adds a `#tag` to every item in the current section |
| `CL: Bulk Set Priority` | Sets priority level on every item in the current section |
| `CL: Bulk Set Due Date` | Sets a due date on every item in the current section |
| `CL: Replace in Section` | Find and replace within current section item content |

### Sorting & Numbering
| Command | Description |
|---------|-------------|
| `CL: Sort Items A → Z / Z → A` | Alphabetical sort of items in the section |
| `CL: Sort by Votes` | Sorts items by `+N` vote count descending |
| `CL: Renumber Items` | Resets numbered item sequence per depth |
| `CL: Fix Numbering` | Auto-corrects all out-of-sequence numbered items in the file |
| `CL: Convert Bullets to Numbered` | Converts all `>> -` bullets in the section to numbered items, continuing from the last existing number |

### Export
| Command | Description |
|---------|-------------|
| `CL: Copy Section as Markdown` | Converts section to standard `##` + list and copies to clipboard |
| `CL: Copy Section as Plain Text` | Strips all syntax, copies clean text |
| `CL: Export File as HTML` | Exports as a styled standalone HTML page with collapsible sections |
| `CL: Export File as JSON` | Full structured export with all metadata per item |
| `CL: Export File as CSV` | Flat CSV with one row per item and all metadata columns |
| `CL: Export File as Markdown Document` | Clean standard markdown with `##` headings and `-` bullets |
| `CL: Export Statistics as CSV / JSON` | Section stats (items, words) as CSV or JSON |
| `CL: Compare Section to Clipboard` | Shows a line diff of the current section vs clipboard content |

### Snippets & Templates
| Command / Prefix | Description |
|------------------|-------------|
| `chl` + trigger | Inserts a bullet list block with Tab stops |
| `chn` + trigger | Inserts a numbered list block with Tab stops |
| `CL: Insert Template` | Quick pick of 5 built-in templates + your own custom ones |
| `CL: Save Section as Template` | Saves the section at the cursor as a reusable template with Tab stops |
| `CL: Word Count Goal` | Sets or updates the `==N` word count goal on the current header |

### Appearance & Analytics
| Command | Description |
|---------|-------------|
| `CL: Switch Colour Preset` | Choose from `default`, `ocean`, `forest`, `sunset`, `monochrome`, `custom` |
| `CL: Show File Statistics` | Webview panel: section/item/word counts, avg items, most/least populated |
| `CL: Enter Reading Mode` | Opens the file as a live-updating HTML webview beside the editor |

### AI Assist
Requires an Anthropic API key — set `chevron-lists.anthropicApiKey` in settings.

| Command | Description |
|---------|-------------|
| `CL: Suggest Items (AI)` | Claude suggests 3–5 new items for the current section; pick which to insert |
| `CL: Summarise Section (AI)` | Generates a one-line summary and inserts it as the first item |
| `CL: Expand Item (AI)` | Expands the item at the cursor into nested sub-items |

---

## Visual Features

### Syntax Highlighting
- `> Header` lines coloured as section headings
- `>> -` and `>> N.` prefixes styled distinctly from content
- `[LABEL TEXT]` inside items highlighted in gold/amber
- All colours driven by your active theme or colour preset

### Outline View
Chevron sections appear in VS Code's **Outline panel** and **breadcrumb navigation**. Each section shows its name and item count. Clicking any entry jumps to that line.

### Folding
Each `> Header` block folds via the standard VS Code fold gutter arrow.

### Hover Tooltips
- Hover over `> Header` → item count, word count, and completion progress (`done/total`)
- Hover over `[[section]]` links → preview of the target section's items
- Hover over `[[file:name.md]]` links → preview of the linked file's first lines

### Diagnostics (Problems Panel)
Live warnings for:
- Duplicate section names
- Empty sections
- Out-of-sequence numbered items
- Overdue `@date` items
- Sections below their `==N` word count goal

### Status Bar
Bottom-right shows: section count · item count · `✓ done/total` (when checkboxes exist) · `words/goal` (when cursor is in a section with a word goal).

### Minimap Indicators
`> Header` lines appear as coloured markers in the overview ruler.

---

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `chevron-lists.listPrefix` | `-` | Prefix for list items |
| `chevron-lists.blankLineAfterHeader` | `false` | Insert a blank line after `> Header` on Enter |
| `chevron-lists.snippetTrigger` | `tab` | Snippet trigger: `tab`, `ctrl+enter`, or `none` |
| `chevron-lists.colourPreset` | `default` | Built-in colour preset |
| `chevron-lists.templates` | `[]` | Custom templates for `CL: Insert Template` |
| `chevron-lists.anthropicApiKey` | `""` | API key for AI Assist — get one at [console.anthropic.com](https://console.anthropic.com) |

---

## Development

```bash
bun install        # install dependencies
bun run compile    # compile TypeScript
bun test           # run unit tests with coverage
```

395 unit tests, 100% coverage of all pure logic, 29 test files.

### Releasing a new version

```powershell
.\release.ps1 -Version 6.3.0
```

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for full version history.

## Roadmap

See [ROADMAP.md](ROADMAP.md) for planned features.

## License

CC BY-NC-ND 4.0 — © Lewis Creelman. No commercial use. No derivatives.
