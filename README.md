# Chevron Lists

A VS Code extension that adds smart keyboard behaviour, rich organisation tools, and AI assistance for nested blockquote list syntax in markdown.

## Syntax

```markdown
> This is a section header
>> - First item
>> - Second item
>> - Third item
```

Numbered lists, deep nesting, checkboxes, tags, priorities, due dates and linked sections are all supported:

```markdown
> Quest Log
>> - [x] Speak to the innkeeper #urgent
>> - [ ] !!! Find the missing amulet @2026-04-15
>> - See [[Dungeon Map]] for directions
>> 1. Enter the cave
>> 2. Defeat the guardian
```

---

## Features

### Smart Enter
- **Enter** after `> Header` → starts a `>> -` item
- **Enter** after `>> - Item` → continues the list
- **Enter** on an empty `>> -` → stops the list
- **Enter** after `>> 1. Item` → auto-increments to `>> 2.`
- All other Enter presses behave normally

### Tab / Shift+Tab — Nesting
- **Tab** on a `>> -` line → promotes to `>>> -`
- **Shift+Tab** → demotes back one level
- Works at arbitrary depth, on both bullet and numbered items
- Multi-cursor aware (Shift+click to select a range)
- Tab is suppressed when a Copilot suggestion is visible

### Item Enrichment
Items support inline markers that integrate with commands throughout the extension:

| Marker | Example | Feature |
|--------|---------|---------|
| `[x]` / `[ ]` | `>> - [x] Done task` | Checkboxes — toggle with `CL: Toggle Item Done` |
| `#tag` | `>> - Deploy server #urgent` | Tags — filter with `CL: Filter by Tag` |
| `!` / `!!` / `!!!` | `>> - !!! Critical bug` | Priority — filter with `CL: Filter by Priority` |
| `@YYYY-MM-DD` | `>> - Ship feature @2026-04-01` | Due dates — view with `CL: Show Upcoming` |
| `[[SectionName]]` | `>> - See [[Act Two]]` | Links — navigate with F12 or hover for preview |

### Section Groups
Use `>> -- Group Name` as a divider to organise sections into named groups:

```markdown
>> -- Act One
> The Arrival
>> - item

>> -- Act Two
> The Confrontation
>> - item
```

Manage groups with `CL: Group Sections` and `CL: Filter Groups`.

---

## Commands

Type `CL:` in the command palette (`Ctrl+Shift+P`) to see all commands.

### Navigation
| Command / Key | Description |
|---------------|-------------|
| `Ctrl+Alt+Down` | Jump to next `> Header` |
| `Ctrl+Alt+Up` | Jump to previous `> Header` |
| `CL: Filter Sections` | Live quick pick of all headers in the file |
| `CL: Filter Sections (Workspace)` | Jump to any section across the whole workspace |
| `CL: Filter Pinned Sections` | Jump to a pinned section |
| `CL: Filter Groups` | Jump to a named section group |

### Search
| Command | Description |
|---------|-------------|
| `CL: Search Items` | Live quick pick of all items in the file with preview |
| `CL: Search Items (Workspace)` | Search items across every markdown file in the workspace |
| `CL: Filter by Tag` | Two-step picker: choose a `#tag`, then jump to matching items |
| `CL: Filter by Priority` | Filter items by `!` / `!!` / `!!!` priority level |
| `CL: Show Upcoming` | All `@date` items sorted chronologically; overdue highlighted |

### Section Actions
| Command | Description |
|---------|-------------|
| `CL: Select Section Items` | Selects all items under the nearest header |
| `CL: Delete Section` | Deletes header + all items |
| `CL: Duplicate Section` | Copies the section below itself |
| `CL: Move Section Up / Down` | Swaps the section with its neighbour |
| `CL: Toggle Pin` | Pins/unpins the section at the cursor (persists per workspace) |
| `CL: Group Sections` | Inserts a `>> -- Name` group divider above the cursor section |

### Item Actions
| Command | Description |
|---------|-------------|
| `CL: Toggle Item Done` | Toggles `[ ]` → `[x]` → `[ ]` on the item at the cursor |
| `CL: Sort Items A → Z / Z → A` | Alphabetical sort of items in the section |
| `CL: Renumber Items` | Resets numbered item sequence per depth |
| `CL: Fix Numbering` | Auto-corrects all out-of-sequence numbered items in the file |
| `CL: Go to Linked Section` | Jumps to the `[[linked section]]` under the cursor |

### Export
| Command | Description |
|---------|-------------|
| `CL: Copy Section as Markdown` | Converts section to standard `##` + list and copies to clipboard |
| `CL: Copy Section as Plain Text` | Strips all syntax, copies clean text |
| `CL: Export File as HTML` | Exports the file as a styled standalone HTML page |

### Snippets & Templates
| Command / Prefix | Description |
|------------------|-------------|
| `chl` + trigger | Inserts a bullet list block with Tab stops |
| `chn` + trigger | Inserts a numbered list block with Tab stops |
| `CL: Insert Template` | Quick pick of 5 built-in templates + your own custom ones |

### Appearance
| Command | Description |
|---------|-------------|
| `CL: Switch Colour Preset` | Choose from `default`, `ocean`, `forest`, `sunset`, `monochrome`, `custom` |

### Analytics
| Command | Description |
|---------|-------------|
| `CL: Show File Statistics` | Webview panel: section/item/word counts, avg items, most/least populated |

### AI Assist
Requires an Anthropic API key — set `chevron-lists.anthropicApiKey` in settings.

| Command | Description |
|---------|-------------|
| `CL: Suggest Items (AI)` | Claude suggests 3–5 new items for the current section; pick which to insert |
| `CL: Summarise Section (AI)` | Generates a one-line summary and inserts it as the first item |
| `CL: Expand Item (AI)` | Expands the item at the cursor into nested sub-items |

---

## Visual Features

### Outline View
Chevron sections appear in VS Code's **Outline panel** and **breadcrumb navigation**. Each section shows its name and item count. Expanding a section reveals all its items as children. Clicking any entry jumps to that line.

### Diagnostics (Problems Panel)
The Problems panel shows live warnings for:
- Duplicate section names in the same file
- Empty sections (header with no items)
- Out-of-sequence numbered items
- Overdue `@date` items

### Hover Tooltips
- Hover over `> Header` → item count and word count for that section
- Hover over `[[linked section]]` → preview of the target section's items; broken links show a warning

### Syntax Highlighting
- `> Header` lines coloured as section headings
- `>> -` and `>> 1.` prefixes styled distinctly from content
- Colours driven by your active theme (or colour preset) automatically

### Folding
Each `> Header` block folds via the standard VS Code fold gutter arrow.

### Minimap Indicators
`> Header` lines appear as coloured markers in the overview ruler.

### Status Bar
Bottom-right status bar shows total section and item counts, updating as you type.

---

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `chevron-lists.listPrefix` | `-` | Prefix for list items — change to `*` for `>> *` |
| `chevron-lists.blankLineAfterHeader` | `false` | Insert a blank line after `> Header` on Enter |
| `chevron-lists.snippetTrigger` | `tab` | Snippet trigger key: `tab`, `ctrl+enter`, or `none` |
| `chevron-lists.colourPreset` | `default` | Built-in colour preset |
| `chevron-lists.templates` | `[]` | Custom templates for `CL: Insert Template` (name, description, body) |
| `chevron-lists.anthropicApiKey` | `""` | API key for AI Assist commands — get one at [console.anthropic.com](https://console.anthropic.com) |

---

## Development

```bash
bun install        # install dependencies
bun run compile    # compile TypeScript
bun test           # run unit tests with coverage
```

265 unit tests, 100% coverage of all pure logic, 19 test files.

### Releasing a new version

```powershell
.\release.ps1 -Version 3.1.0
```

Runs tests → bumps `package.json` → compiles → packages `.vsix` → commits and pushes → opens the Marketplace upload page.

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for full version history.

## Roadmap

See [ROADMAP.md](ROADMAP.md) for planned features.

## License

CC BY-NC-ND 4.0 — © Lewis Creelman. No commercial use. No derivatives.
