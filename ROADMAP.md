# Chevron Lists — Roadmap

## Legend
- ✅ Done
- 🚧 In progress
- ⬜ Not started

---

## v0.0.1 — Initial Release ✅
- ✅ Smart Enter after `> Header` starts `>> -` list item (no blank line)
- ✅ Smart Enter after `>> - Item` continues the list
- ✅ Smart Enter on empty `>> -` line stops the list and clears the prefix
- ✅ All other Enter presses behave normally

---

## v0.1.0 — Tab to Indent ✅
- ✅ Tab on a `>> -` line promotes it to `>>> -`
- ✅ Shift+Tab on a `>>> -` line demotes it back to `>> -`
- ✅ Full nested list hierarchy (arbitrary depth)

---

## v0.2.0 — Auto-Numbering ✅
- ✅ Support `>> 1.` style numbered chevron lists
- ✅ Auto-increment the number on each Enter
- ✅ Tab/Shift+Tab on numbered items picks up correct number at new depth

---

## v0.3.0 — Configurable Prefix ✅
- ✅ `chevron-lists.listPrefix` setting (default `-`, e.g. change to `*`)
- ✅ `chevron-lists.blankLineAfterHeader` setting

---

## v0.4.0 — Smarter List Commands ✅
- ✅ `Chevron Lists: Select Section Items` command
- ✅ Fold/collapse chevron sections via standard VS Code fold gutter
- ⚠️ Known: VS Code's built-in blockquote folding also shows a fold arrow on the first `>> -` line

---

## v0.5.0 — Syntax Highlighting ✅
- ✅ TextMate grammar injected into markdown
- ✅ `> Header` lines coloured as section headings
- ✅ `>> -` and `>> 1.` prefixes styled distinctly from content

---

## v0.6.0 — Minimap Indicators ✅
- ✅ `> Header` lines appear as coloured markers in the overview ruler

---

## v0.6.1 — Copilot Fix ✅
- ✅ Tab no longer intercepts Copilot inline suggestions

---

## v1.0.0 — SOLID Refactor + Full Feature Set ✅
- ✅ Full SOLID refactor — 12 focused modules, all under 200 lines
- ✅ 115 unit tests, 100% coverage of all pure logic (Bun test runner)
- ✅ `Ctrl+Alt+Down` / `Ctrl+Alt+Up` — jump to next/previous `> Header`
- ✅ `Chevron Lists: Delete Section` command
- ✅ `Chevron Lists: Duplicate Section` command
- ✅ `Chevron Lists: Move Section Up` — swaps only chevron content, preserving separators
- ✅ `Chevron Lists: Move Section Down` — swaps only chevron content, preserving separators
- ✅ Hover tooltip on `> Header` showing item count and word count
- ✅ Status bar item showing total sections and items in the open file
- ✅ Multi-cursor Tab / Shift+Tab across range and multi-cursor selections

---

## v1.1.0 — Export ✅
- ✅ `Chevron Lists: Copy Section as Markdown`
- ✅ `Chevron Lists: Copy Section as Plain Text`
- ✅ Nested items indented correctly in both formats

---

## v1.2.0 — Sorting ✅
- ✅ `Chevron Lists: Sort Items A → Z`
- ✅ `Chevron Lists: Sort Items Z → A`
- ✅ `Chevron Lists: Renumber Items`

---

## v1.3.0 — Snippets ✅
- ✅ `chl` + trigger → bullet list block with Tab stops
- ✅ `chn` + trigger → numbered list block with Tab stops
- ✅ `chevron-lists.snippetTrigger` setting: `tab`, `ctrl+enter`, or `none`

---

## v1.4.0 — Search & Filter ✅
- ✅ `Chevron Lists: Search Items` — live quick pick with preview
- ✅ `Chevron Lists: Filter Sections` — live quick pick across all headers

---

## v1.5.0 — Themes ✅
- ✅ Semantic token types: `chevronHeader`, `chevronPrefix`, `chevronNumber`, `chevronContent`
- ✅ Built-in colour recommendations via `configurationDefaults`
- ✅ `semanticTokenScopes` ensures compatibility with non-semantic themes

---

## v1.6.0 — Colour Presets ✅
- ✅ `Chevron Lists: Switch Colour Preset` command — live quick pick between presets
- ✅ 5 built-in presets: `default`, `ocean`, `forest`, `sunset`, `monochrome`
- ✅ `chevron-lists.colourPreset` setting persists the chosen preset across restarts
- ✅ `custom` option hands full control back to the user

---

## v1.7.0 — Outline View ✅
- ✅ Chevron sections appear in VS Code's Outline panel and breadcrumb navigation
- ✅ Section names shown with item counts
- ✅ Items visible as children in the Outline tree
- ✅ Clicking any entry jumps to that line

---

## v1.8.0 — Statistics Panel ✅
- ✅ `CL: Show File Statistics` — webview panel with section/item/word counts, avg items, most/least populated section

---

## v1.9.0 — Templates ✅
- ✅ `CL: Insert Template` — quick pick of 5 built-in templates with Tab stops
- ✅ `chevron-lists.templates` setting — define unlimited custom templates

---

## v2.0.0 — Workspace Mode ✅
- ✅ `CL: Search Items (Workspace)` — search all chevron items across every markdown file
- ✅ `CL: Filter Sections (Workspace)` — jump to any section in any markdown file
- ✅ Results show filename and section context

---

## v2.1.0 — Diagnostics ✅
- ✅ Problems panel: duplicate section names, empty sections, out-of-sequence numbered items
- ✅ `CL: Fix Numbering` — auto-corrects all numbered item sequences in the file
- ✅ Diagnostics update live as you type

## v2.2.0 — Item Tags ⬜
- ⬜ `#tag` support in item content — `>> - Deploy server #urgent #backend`
- ⬜ `CL: Filter by Tag` — quick pick of all tags in the file, jump to matching items
- ⬜ `CL: Filter by Tag (Workspace)` — same but across all markdown files

## v2.3.0 — Linked Sections ⬜
- ⬜ `[[SectionName]]` link syntax in items — jump to another section in the same file
- ⬜ `CL: Go to Linked Section` command
- ⬜ Hover over a `[[link]]` shows a preview of the linked section

---
