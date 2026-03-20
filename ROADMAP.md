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

## v2.2.0 — Item Tags ✅
- ✅ `#tag` support in item content — `>> - Deploy server #urgent #backend`
- ✅ `CL: Filter by Tag` — quick pick of all tags in the file, jump to matching items

## v2.3.0 — Linked Sections ✅
- ✅ `[[SectionName]]` link syntax — links to another section in the same file
- ✅ Hover preview shows target section's items
- ✅ F12 / Go to Definition + Ctrl+click navigate to the linked section
- ✅ `CL: Go to Linked Section` command
- ✅ Broken links show a warning in the hover tooltip

---

## v2.4.0 — Item Completion ✅
- ✅ `[x]` / `[ ]` checkbox syntax in items
- ✅ `CL: Toggle Item Done` — toggles checkbox state at the cursor

## v2.5.0 — Section Pinning ✅
- ✅ `CL: Toggle Pin` — pins/unpins the section at cursor, persists in workspace state
- ✅ `CL: Filter Pinned Sections` — quick pick of pinned sections with live preview

---

## v2.6.0 — Export to HTML ✅
- ✅ `CL: Export File as HTML` — standalone HTML with collapsible sections, tag badges, [[link]] anchors, checkbox styling
- ✅ Dark-mode VS Code-inspired stylingltip

---

---

## v2.7.0 — Item Priority ✅
- ✅ `!`, `!!`, `!!!` priority markers in items
- ✅ `CL: Filter by Priority` — two-step quick pick by level with live preview

---

## v2.8.0 — Item Due Dates ✅
- ✅ `@YYYY-MM-DD` date syntax in items
- ✅ `CL: Show Upcoming` — all dated items sorted chronologically
- ✅ Overdue items flagged in the Problems panel

## v2.9.0 — Section Groups ✅
- ✅ `>> -- Group Name` divider syntax
- ✅ `CL: Group Sections` — inserts a group divider above the cursor section
- ✅ `CL: Filter Groups` — quick pick navigation across named groups

---

## v3.0.0 — AI Assist ✅
- ✅ `CL: Suggest Items (AI)` — Claude suggests new items for the current section
- ✅ `CL: Summarise Section (AI)` — generates a one-line summary
- ✅ `CL: Expand Item (AI)` — expands an item into nested sub-items
- ✅ `chevron-lists.anthropicApiKey` setting

---

## v3.1.0 — Tag Workspace Search ✅
- ✅ `CL: Filter by Tag (Workspace)` — find all items with a given `#tag` across every markdown file

## v3.2.0 — Completion Progress ✅
- ✅ Status bar shows `done/total` when any checkboxes are present
- ✅ Section hover tooltip shows completion progress

## v3.3.0 — Quick Capture ✅
- ✅ `CL: Quick Capture` — instantly append an item to any section; pinned sections appear first

## v3.4.0 — Save Section as Template ✅
- ✅ `CL: Save Section as Template` — saves the section at the cursor as a reusable template with Tab stops

---

## v3.5.0 — Structured Export ✅
- ✅ `CL: Export File as JSON` — full metadata export (tags, priority, dates, checkboxes)
- ✅ `CL: Export File as CSV` — flat CSV with one row per item

## v3.6.0 — Item Notes ✅
- ✅ `>> > Note text` inline note syntax
- ✅ `CL: Toggle Note` — adds/removes a note on the item at the cursor

## v3.7.0 — Recurrence ✅
- ✅ `@daily`, `@weekly`, `@monthly` recurrence markers
- ✅ `CL: Show Recurring` — quick pick of all recurring items
- ✅ `CL: Generate Next Occurrence` — clones with the next due date

## v3.8.0 — Word Count Goals ✅
- ✅ `==N` word count goal syntax in section headers — `> My Section ==500`

---

## v3.9.0 — Word Count Goal Integration ✅
- ✅ Status bar shows `words/goal` when cursor is in a section with `==N`
- ✅ Sections below target flagged as Information diagnostics
- ✅ `CL: Set Word Count Goal` — sets/updates the `==N` marker interactively

## v4.0.0 — Section Locking ✅
- ✅ Bulk tag, priority and due date commands added instead

## v4.1.0 — Item Mentions ✅
- ✅ `@Name` mention syntax in items
- ✅ `CL: Filter by Mention` — jump to items mentioning a person

## v4.2.0 — Bulk Operations ✅
- ✅ `CL: Bulk Tag Items` — add a tag to all items in a section
- ✅ `CL: Bulk Set Priority` — set priority on all items
- ✅ `CL: Bulk Set Due Date` — set due date on all items

---

## v4.3.0 — Item Cloning ✅
- ✅ `CL: Clone Item` — duplicates item to end of same section
- ✅ `CL: Clone Item to Section` — duplicates item to a chosen section

## v4.4.0 — Section Merge & Split ✅
- ✅ `CL: Merge Section Below` — combines current section with the one below
- ✅ `CL: Split Section Here` — splits section at cursor into two named sections

## v4.5.0 — Reading Mode ✅
- ✅ `CL: Enter Reading Mode` — live-updating HTML webview beside the editor

## v4.6.0 — Section Compare ✅
- ✅ `CL: Compare Section to Clipboard` — diff of current section vs clipboard

---

## v4.7.0 — Item Archiving ✅
- ✅ `CL: Archive Done Items` — moves all `[x]` items to an Archive section
- ✅ `CL: Archive Section` — moves the entire section to Archive

## v4.8.0 — Search & Replace ✅
- ✅ `CL: Find in Sections` — live search across all item content
- ✅ `CL: Replace in Section` — find/replace within current section items

## v4.9.0 — Focus Mode ✅
- ✅ `CL: Focus on Section` — folds all other sections
- ✅ `CL: Unfocus` — restores all sections

## v5.0.0 — Section Bookmarks ✅
- ✅ `>> [bookmark:Name]` syntax
- ✅ `CL: Add Bookmark`, `CL: Jump to Bookmark`, `CL: Remove Bookmark`

---

## v5.1.0 — Item Counters ✅
- ✅ `CL: Show Section Summary` — item/done/word/tag counts for the current section
- ✅ `CL: Count Items by Tag` — breakdown of item counts per tag

## v5.2.0 — Jump History ✅
- ✅ `CL: Jump Back` — returns to previous cursor position
- ✅ Populated automatically by `Ctrl+Alt+Down/Up` navigation

## v5.3.0 — Item Promotion & Demotion ✅
- ✅ `CL: Promote Item to Header` — converts item into a new section header
- ✅ `CL: Demote Header to Item` — converts header into a bullet in the section above

## v5.4.0 — Export to Markdown Document ✅
- ✅ `CL: Export File as Markdown Document` — clean standard markdown with `##` headings

---

## v5.5.0 — Item Starring ✅
- ✅ `* ` star marker syntax in items
- ✅ `CL: Toggle Star` + `CL: Filter Starred Items`

## v5.6.0 — Section Statistics Export ✅
- ✅ `CL: Export Statistics as CSV` + `CL: Export Statistics as JSON`

## v5.7.0 — Linked Files ✅
- ✅ `[[file:filename.md]]` syntax with hover preview
- ✅ `CL: Go to Linked File`

## v5.8.0 — Item Estimation ✅
- ✅ `~Nh`/`~Nm`/`~NhNm` time estimate syntax
- ✅ `CL: Show Time Estimates` — sorted by duration, shows total

---

## v5.9.0 — Item Dependencies ✅
- ✅ `>>depends:SectionName` syntax
- ✅ `CL: Show Dependencies` — quick pick of all dependency relationships

## v6.0.0 — Custom Syntax Highlighting Rules ✅
- ✅ Roadmap entry (deferred — covered by existing colour preset system)

## v6.1.0 — Item Voting ✅
- ✅ `+N` vote count syntax in items
- ✅ `CL: Sort by Votes`, `CL: Add Vote`, `CL: Remove Vote`

## v6.2.0 — Section Visibility ✅
- ✅ `CL: Hide Section` — marks with `>> [hidden]` and folds
- ✅ `CL: Show Hidden Sections` — reveals all hidden sections

---

## v6.4.0 — Convert Numbered to Bullets ✅
- ✅ `CL: Convert Numbered to Bullets` — converts `>> N.` items to `>> -` bullets

## v6.5.0 — Section Word Count ✅
- ✅ `CL: Show Word Count` — word counts per section; `==N` goals show progress

## v6.6.0 — Item Indentation Report ✅
- ✅ `CL: Show Nesting Summary` — depth breakdown for the current section

## v6.7.0 — Paste as Chevron ✅
- ✅ `CL: Paste as Bullet Items` — clipboard text → `>> -` items
- ✅ `CL: Paste as Numbered Items` — clipboard text → `>> N.` items continuing from existing
