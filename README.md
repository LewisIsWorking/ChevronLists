# Chevron Lists

A VS Code extension with smart keyboard behaviour, rich organisation tools, and AI assistance for nested blockquote list syntax in markdown.

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
| `[x]` / `[ ]` | `>> - [x] Done task` | Checkboxes |
| `#tag` | `>> - Deploy #urgent` | Tags |
| `!` / `!!` / `!!!` | `>> - !!! Critical` | Priority |
| `@YYYY-MM-DD` | `>> - Ship @2026-04-01` | Due date |
| `@daily/weekly/monthly` | `>> - Standup @daily` | Recurrence |
| `~2h` / `~30m` / `~1h30m` | `>> - Deploy ~2h` | Time estimate |
| `* ` | `>> - * Key task` | Star marker |
| `+N` | `>> - Great idea +5` | Vote count |
| `[[SectionName]]` | `>> - See [[Act Two]]` | Section link |
| `[[file:name.md]]` | `>> - See [[file:notes.md]]` | File link |
| `[LABEL TEXT]` | `>> - [ACTION] do thing` | Square bracket label (gold) |
| `{red}` / `{green}` / `{blue}` etc. | `>> - {red} blocked` | Colour label |
| `~~text~~` | `>> - ~~cancelled task~~` | Strikethrough |
| `// comment` | `>> - Deploy // ask Lewis first` | Inline comment (muted) |
| `? ` | `>> - ? unclear requirement` | Question flag |

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
- **Enter** after `>> - Item` → continues the list
- **Enter** on an empty `>> -` → stops the list
- **Enter** after `>> 1. Item` → auto-increments to `>> 2.`
- **Enter mid-line** on a numbered/bullet line → splits at cursor, remaining text goes to the new item
- **Tab** on a `>> -` line → promotes to `>>> -` (also shifts child items)
- **Shift+Tab** → demotes back one level (also shifts child items)
- Multi-cursor aware; Tab suppressed when Copilot suggestion is visible

---

## All Commands

Type `CL:` in the command palette (`Ctrl+Shift+P`).

### Navigation
| Command / Key | Description |
|---|---|
| `Ctrl+Alt+Down` | Jump to next header (pushes jump history) |
| `Ctrl+Alt+Up` | Jump to previous header (pushes jump history) |
| `CL: Jump Back` | Returns to the previous cursor position |
| `CL: Filter Sections` | Live quick pick of all headers |
| `CL: Filter Sections (Workspace)` | Jump to any section across all files |
| `CL: Filter Pinned Sections` | Jump to a pinned section |
| `CL: Filter Groups` | Jump to a named section group |
| `CL: Jump to Bookmark` | Quick pick of all `[bookmark:Name]` markers |
| `CL: Focus on Section` | Folds all other sections |
| `CL: Unfocus` | Restores all folded sections |

### Search
| Command | Description |
|---|---|
| `CL: Search Items` | Live search of all items in the file |
| `CL: Search Items (Workspace)` | Search items across every markdown file |
| `CL: Find in Sections` | Find items by content (no syntax) |
| `CL: Filter by Tag` | Filter items by `#tag` |
| `CL: Filter by Tag (Workspace)` | Same across all workspace files |
| `CL: Filter by Priority` | Filter by `!` / `!!` / `!!!` |
| `CL: Filter by Mention` | Filter by `@PersonName` |
| `CL: Filter by Mention (Workspace)` | Same across all workspace files |
| `CL: Filter Starred Items` | Quick pick of all `* ` starred items |
| `CL: Show Upcoming` | `@date` items sorted chronologically; overdue flagged |
| `CL: Show Recurring` | All `@daily/@weekly/@monthly` items |
| `CL: Show Time Estimates` | All `~time` items sorted by duration with total |
| `CL: Show Dependencies` | All `>>depends:` relationships |
| `CL: Count Items by Tag` | Item counts per `#tag` |
| `CL: Show Section Summary` | Item/done/word/tag counts for the cursor section |
| `CL: Show Word Count` | Word counts per section; `==N` goals show progress |
| `CL: Show Nesting Summary` | Depth breakdown for the cursor section |

### Section Actions
| Command | Description |
|---|---|
| `CL: Select Section Items` | Selects all items under the nearest header |
| `CL: Delete Section` | Deletes header + all items |
| `CL: Duplicate Section` | Copies the section below itself |
| `CL: Move Section Up / Down` | Swaps the section with its neighbour |
| `CL: Toggle Pin` | Pins/unpins the section at the cursor |
| `CL: Group Sections` | Inserts a `>> -- Name` group divider |
| `CL: Rename Section` | Renames header and updates all `[[links]]` in the file |
| `CL: Merge Section Below` | Combines current section with the one below |
| `CL: Split Section Here` | Splits section at cursor into two named sections |
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
| `CL: Sort Sections A → Z / Z → A` | Reorders all sections alphabetically by header name |

### Item Actions
| Command | Description |
|---|---|
| `CL: Toggle Item Done` | Toggles `[ ]` → `[x]` → `[ ]` |
| `CL: Toggle Star` | Toggles `* ` star marker |
| `CL: Toggle Note` | Adds/removes a `>> > Note` line |
| `CL: Add Vote` / `CL: Remove Vote` | Increments/decrements `+N` vote count |
| `CL: Duplicate Item` | Duplicates item directly below itself |
| `CL: Clone Item` | Copies item to end of same section |
| `CL: Clone Item to Section` | Copies item to a chosen section |
| `CL: Move Item Up` / `CL: Move Item Down` | Moves item one position up or down |
| `CL: Promote Item to Header` | Converts item to a new section header |
| `CL: Demote Header to Item` | Converts section header to a bullet item |
| `CL: Go to Linked Section` | Jumps to `[[linked section]]` under cursor |
| `CL: Go to Linked File` | Opens `[[file:name.md]]` linked file |
| `CL: Quick Capture` | Pick a section, type an item (pinned sections first) |
| `CL: Add Bookmark` / `CL: Remove Bookmark` | Adds/removes `[bookmark:Name]` |
| `CL: Set Item Colour` | Sets `{colour}` label via quick pick |
| `CL: Strikethrough Item` | Toggles `~~strikethrough~~` on content |
| `CL: Remove Strikethrough` | Removes `~~` markers |
| `CL: Toggle Flag` | Toggles `? ` question flag on item content |
| `CL: Preview Item` | Rich notification showing all markers interpreted |

### Bulk Actions
| Command | Description |
|---|---|
| `CL: Bulk Tag Items` | Adds a `#tag` to every item in the section |
| `CL: Bulk Set Priority` | Sets priority on every item in the section |
| `CL: Bulk Set Due Date` | Sets a due date on every item in the section |
| `CL: Replace in Section` | Find and replace within section item content |
| `CL: Mark All Done` | Marks all `[ ]` items as `[x]` |
| `CL: Mark All Undone` | Resets all `[x]` items to `[ ]` |
| `CL: Remove All Checkboxes` | Strips all `[x]`/`[ ]` markers |
| `CL: Filter Flagged Items` | Quick pick of all `? ` flagged items |
| `CL: Strip Comments` | Removes all `// comment` tails from items in the section |

### Sorting & Numbering
| Command | Description |
|---|---|
| `CL: Sort Items A → Z / Z → A` | Alphabetical sort |
| `CL: Sort by Votes` | Sorts by `+N` vote count descending |
| `CL: Renumber Items` | Resets numbered sequence per depth |
| `CL: Fix Numbering` | Auto-corrects all out-of-sequence numbers |
| `CL: Convert Bullets to Numbered` | Converts `>> -` to `>> N.`, continuing from last number |
| `CL: Convert Numbered to Bullets` | Converts `>> N.` back to `>> -` |

### Text Transforms
| Command | Description |
|---|---|
| `CL: Uppercase Item` | Converts item content to UPPERCASE |
| `CL: Lowercase Item` | Converts to lowercase |
| `CL: Title Case Item` | Converts to Title Case |

### Paste
| Command | Description |
|---|---|
| `CL: Paste as Bullet Items` | Clipboard text (one line per item) → `>> -` items |
| `CL: Paste as Numbered Items` | Clipboard text → `>> N.` items continuing from existing |

### Rename
| Command | Description |
|---|---|
| `CL: Rename Section` | Renames header + updates all `[[links]]` in the file |
| `CL: Rename Tag` | Renames a `#tag` across the current file |
| `CL: Rename Tag (Workspace)` | Renames a `#tag` across all workspace files |

### Export
| Command | Description |
|---|---|
| `CL: Copy Section as Markdown` | `##` heading + list → clipboard |
| `CL: Copy Section as Plain Text` | Strips all syntax → clipboard |
| `CL: Export File as HTML` | Styled standalone HTML with collapsible sections |
| `CL: Export File as JSON` | Full structured export with all metadata |
| `CL: Export File as CSV` | Flat CSV with one row per item |
| `CL: Export File as Markdown Document` | Clean `##` / `-` standard markdown |
| `CL: Export Statistics as CSV / JSON` | Section stats as CSV or JSON |
| `CL: Compare Section to Clipboard` | Line diff of current section vs clipboard |

### Snippets & Templates
| Command / Prefix | Description |
|---|---|
| `chl` + trigger | Inserts a bullet list block with Tab stops |
| `chn` + trigger | Inserts a numbered list block with Tab stops |
| `CL: Insert Template` | 5 built-in templates + your own |
| `CL: Save Section as Template` | Saves the cursor section as a reusable template |
| `CL: Import Templates from File` | Imports all sections from a `.md` file as templates |
| `CL: Export Templates to File` | Exports user templates to a `.md` file |
| `CL: Set Word Count Goal` | Sets/updates the `==N` goal on the current header |

### Statistics & Analytics
| Command | Description |
|---|---|
| `CL: Show File Statistics` | Webview: section/item/word counts, avg, most/least populated |
| `CL: Show Workspace Statistics` | Aggregated stats across all workspace markdown files |
| `CL: Show Word Count` | Word counts per section with `==N` goal progress |
| `CL: Show Section Summary` | Item/done/word/tag counts for the cursor section |
| `CL: Show Nesting Summary` | Depth breakdown for items in the cursor section |
| `CL: Compare Section Statistics` | Side-by-side comparison of any two sections |
| `CL: Count Items by Tag` | Item counts per `#tag` |

### Appearance
| Command | Description |
|---|---|
| `CL: Switch Colour Preset` | Choose from 12 built-in presets: `default`, `ocean`, `forest`, `sunset`, `monochrome`, `midnight`, `rose`, `autumn`, `arctic`, `neon`, `sepia`, `custom` |
| `CL: Enter Reading Mode` | Live-updating HTML webview beside the editor |

### AI Assist
Requires `chevron-lists.anthropicApiKey` set in settings.

| Command | Description |
|---|---|
| `CL: Suggest Items (AI)` | Claude suggests 3–5 new items for the section |
| `CL: Summarise Section (AI)` | Generates a one-line summary as the first item |
| `CL: Expand Item (AI)` | Expands the item at the cursor into sub-items |

---

## Visual Features

### Syntax Highlighting
- `> Header` lines coloured as section headings
- `>> -` / `>> N.` prefixes styled distinctly from content
- `[LABEL TEXT]` brackets highlighted in gold/amber
- `{colour}` labels rendered as distinct tokens
- All colours driven by your active theme or colour preset

### Outline View
Sections appear in the **Outline panel** and **breadcrumb navigation** with item counts.

### Folding
Each `> Header` block folds via the standard VS Code fold gutter arrow.

### Hover Tooltips
- Hover `> Header` → item count, word count, completion progress
- Hover `[[section]]` → preview of target section's items
- Hover `[[file:name.md]]` → preview of linked file's first lines

### Diagnostics (Problems Panel)
- Duplicate section names
- Empty sections
- Out-of-sequence numbered items
- Overdue `@date` items
- Sections below `==N` word count goal

### Status Bar
Sections · Items · `✓ done/total` · `words/goal` (updates as you type)

### Minimap
`> Header` lines appear as coloured markers in the overview ruler.

---

## Settings

| Setting | Default | Description |
|---|---|---|
| `chevron-lists.listPrefix` | `-` | Prefix for list items |
| `chevron-lists.blankLineAfterHeader` | `false` | Blank line after `> Header` on Enter |
| `chevron-lists.snippetTrigger` | `tab` | Snippet trigger: `tab`, `ctrl+enter`, or `none` |
| `chevron-lists.colourPreset` | `default` | Built-in colour preset |
| `chevron-lists.templates` | `[]` | Custom templates for `CL: Insert Template` |
| `chevron-lists.anthropicApiKey` | `""` | API key for AI Assist — [console.anthropic.com](https://console.anthropic.com) |

---

## Development

```bash
bun install          # install dependencies
bun run compile      # type-check TypeScript (no emit)
bun run bundle       # bundle with esbuild (dev, with source maps)
bun run bundle:prod  # bundle with esbuild (production, minified)
bun test             # run unit tests with coverage
```

458 unit tests, 100% coverage, 35 test files.

The extension bundles all source files into a single `dist/extension.js` using esbuild, keeping the VSIX small and activation fast. See `ARCHITECTURE.md` for module boundary rules.

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for full version history.

## Roadmap

See [ROADMAP.md](ROADMAP.md) for planned features.

## License

CC BY-NC-ND 4.0 — © Lewis Creelman. No commercial use. No derivatives.
