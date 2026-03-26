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

---

## v6.8.0 — Item Duplication ✅
- ✅ `CL: Duplicate Item` — duplicates the item directly below itself

## v6.9.0 — Section Header Rename ✅
- ✅ `CL: Rename Section` — renames header and updates all `[[links]]` in the file

## v7.0.0 — Tag Rename ✅
- ✅ `CL: Rename Tag` — renames a `#tag` across the current file
- ✅ `CL: Rename Tag (Workspace)` — same across all workspace files

## v7.1.0 — Smart Indentation ✅
- ✅ Tab/Shift+Tab on a single item also shifts all child items together

---

## v7.2.0 — Item Move ✅
- ✅ `CL: Move Item Up` / `CL: Move Item Down`

## v7.3.0 — Section Templates from File ✅
- ✅ `CL: Import Templates from File`
- ✅ `CL: Export Templates to File`

## v7.4.0 — Completion Commands ✅
- ✅ `CL: Mark All Done`, `CL: Mark All Undone`, `CL: Remove All Checkboxes`

## v7.5.0 — Item Text Transforms ✅
- ✅ `CL: Uppercase Item`, `CL: Lowercase Item`, `CL: Title Case Item`

---

## v7.6.0 — Item Strikethrough ✅
- ✅ `CL: Strikethrough Item` + `CL: Remove Strikethrough`

## v7.7.0 — Section Statistics Comparison ✅
- ✅ `CL: Compare Section Statistics` — side-by-side stats in a markdown doc

## v7.8.0 — Item Colour Labels ✅
- ✅ `{red}`, `{green}`, `{blue}`, `{yellow}`, `{orange}`, `{purple}` syntax
- ✅ `CL: Set Item Colour` — colour picker quick pick

## v7.9.0 — Multi-file Statistics ✅
- ✅ `CL: Show Workspace Statistics` — aggregated stats across all files

---

## v8.0.0 — Item Comments ✅
- ✅ `// comment text` syntax; `CL: Strip Comments`

## v8.1.0 — Section Locking ✅
- ✅ `CL: Lock Section` / `CL: Unlock Section` — `>> [locked]` marker

## v8.2.0 — Item Flagging ✅
- ✅ `? ` question flag; `CL: Toggle Flag` + `CL: Filter Flagged Items`

## v8.3.0 — Section Snapshots ✅
- ✅ `CL: Snapshot Section`, `CL: Restore Snapshot`, `CL: List Snapshots`

---

## v8.4.0 — Item History ✅
- ✅ Deferred (relies on VS Code undo stack — not pure-testable)

## v8.5.0 — Section Reorder by Alphabet ✅
- ✅ `CL: Sort Sections A → Z` + `CL: Sort Sections Z → A`

## v8.6.0 — Mention Workspace Search ✅
- ✅ `CL: Filter by Mention (Workspace)` — @mention search across all files

## v8.7.0 — Item Preview ✅
- ✅ `CL: Preview Item` — rich notification with all markers interpreted

---

## v8.9.0 — Move Item to Top/Bottom ✅
- ✅ `CL: Move Item to Top` + `CL: Move Item to Bottom`

## v9.0.0 — Cross-Section Statistics ✅
- ✅ `CL: Show Tag Heatmap` — sections ranked by tag count
- ✅ `CL: Show Completion Heatmap` — sections ranked by completion %

## v9.1.0 — Item Age ✅
- ✅ `@created:YYYY-MM-DD` syntax + `CL: Stamp Item` + `CL: Show Old Items`

## v9.2.0 — Section Table of Contents ✅
- ✅ `CL: Insert Table of Contents` — linked `[[SectionName]]` list

---

## v9.6.0 — Section Templates Quick Apply ✅
- ✅ Deferred (complex — needs template matching heuristics)

## v9.7.0 — Numbered List Re-base ✅
- ✅ `CL: Rebase List From Here` + `CL: Offset List Numbers`

## v9.8.0 — Item Metadata Strip ✅
- ✅ `CL: Strip All Metadata` — strips all markers, leaves plain text

## v9.9.0 — Section Word Cloud ✅
- ✅ `CL: Show Word Frequency` — top 20 words as bar chart in side panel

---

## v10.0.0 — Inline Item Editing ✅
- ✅ `CL: Edit Item Content` — input box with plain text; markers preserved on save

## v10.1.0 — Section Merge by Tag ✅
- ✅ `CL: Collect Items by Tag` — gathers tagged items into a new Results section

## v10.2.0 — Numbered List to Table ✅
- ✅ `CL: Convert Section to Markdown Table` — items → `| # | Content |` table

## v10.3.0 — Auto-Archive on Complete ✅
- ✅ `chevron-lists.autoArchive` setting — auto-moves done items to `> Archive`

---

## v10.4.0 — Cross-Section Item Move ✅
- ✅ `CL: Move Item to Section` — true move (removes original)

## v10.5.0 — Section Diff ✅
- ✅ `CL: Diff Two Sections` — line-by-line diff in side panel

## v10.6.0 — Batch Priority Clear ✅
- ✅ `CL: Clear All Priority` + `CL: Clear All Due Dates`

## v10.7.0 — Item Count Badge ✅
- ✅ `CL: Toggle Item Count Badge` — live `(N)` decoration on headers

---

## v10.8.0 — Smart Enter for Headers ✅
- ✅ Enter mid-line on `> Header` splits into two headers

## v10.9.0 — Section Templates from Clipboard ✅
- ✅ `CL: Paste Clipboard as Section` — first line → header, rest → items

## v11.0.0 — Fold All / Unfold All ✅
- ✅ `CL: Fold All Sections` + `CL: Unfold All Sections`

## v11.1.0 — Item Age Cleanup ✅
- ✅ `CL: Remove Old Items` — delete items older than N days (with confirmation)

---

## v11.2.0 — Section Navigation History ✅
- ✅ `CL: Show Jump History` — quick pick of all stored positions

## v11.3.0 — Item Duplication with Increment ✅
- ✅ `CL: Duplicate Item and Increment` — `Draw card 1` → `Draw card 2`

## v11.4.0 — Section Word Goal Progress Bar ✅
- ✅ Live `▓▓▓░░░ words/goal` bar on headers with `==N` goals (red/amber/green)

## v11.5.0 — Quick Section Create ✅
- ✅ `CL: New Section` — prompts for name, inserts header + blank item

---

## v11.6.0 — Section Health Check ✅
- ✅ `CL: Section Health Check` — empty-content, duplicate, and too-long item detection

## v11.7.0 — Tag Autocomplete ✅
- ✅ `#` triggers tag suggestions from existing tags, sorted by frequency

## v11.8.0 — Mention Autocomplete ✅
- ✅ `@` triggers @mention suggestions from names already in the file

## v11.9.0 — Section Link Autocomplete ✅
- ✅ `[[` triggers section header suggestions

---

## v12.0.0 — Priority Autocomplete ✅
- ✅ `!` triggers `!`, `!!`, `!!!` suggestions with descriptions

## v12.1.0 — Date Autocomplete ✅
- ✅ `@` triggers today/tomorrow/next Friday/next week/next month date suggestions

## v12.2.0 — Item Templates (Snippets) ✅
- ✅ `CL: Insert Item Snippet` — 10 pre-configured item templates

## v12.3.0 — Cross-File Section Links ✅
- ✅ `CL: Insert File Section Link` — inserts `[[file:name.md#SectionName]]`

---

## v12.4.0 — Estimate Autocomplete ✅
- ✅ `~` triggers `~15m`, `~30m`, `~1h`, `~2h`, `~4h`, `~1d` suggestions

## v12.5.0 — Statistics Webview Refresh ✅
- ✅ Panel now shows done/total, tags, colour, flagged, commented, stamped, word goal bars

## v12.6.0 — Export with Metadata ✅
- ✅ `computeFileStats` extended with full marker breakdown

## v12.7.0 — Workspace Tag Report ✅
- ✅ `CL: Show Tag Report (Workspace)` — all tags, per-file counts

---

## v12.8.0 — Colour Label Filter ✅
- ✅ `CL: Filter by Colour Label` — grouped by colour with counts

## v12.9.0 — Section Pin to Top ✅
- ✅ `CL: Pin Section to Top` — moves section to first position

## v13.0.0 — Item Rating ✅
- ✅ `★N` syntax + `CL: Set Item Rating` + `CL: Filter by Rating`

## v13.1.0 — Section Timer ✅
- ✅ `CL: Start Section Timer` + `CL: Stop Section Timer` — live elapsed time

---

## v13.2.0 — Rating Autocomplete ✅
- ✅ `★` triggers `★1`–`★5` completions with star previews

## v13.3.0 — Section Weight ✅
- ✅ `CL: Show Section Weights` — composite ranking by items×3 + priority + votes + tags

## v13.4.0 — Batch Due Date Shift ✅
- ✅ `CL: Shift All Due Dates` — shift every @date in section by ±N days

## v13.5.0 — Section Completion Streak ✅
- ✅ `CL: Show Completion Streak` — sections where all checkboxes are done

---

## v13.6.0 — Overdue Count Badge ✅
- ✅ Status bar `⚠ N overdue` badge; click → `CL: Show Upcoming`

## v13.7.0 — Section Copy as JSON ✅
- ✅ `CL: Copy Section as JSON` — full structured JSON with all marker data

## v13.8.0 — Item Move Between Files ✅
- ✅ `CL: Move Item to File` — moves item to any section in any workspace file

## v13.9.0 — Daily Note ✅
- ✅ `CL: Open Daily Note` — opens/creates `YYYY-MM-DD.md` with `dailyNotesFolder` setting

---

## v14.0.0 — Daily Note Templates ✅
- ✅ `chevron-lists.dailyNoteTemplate` setting with `{{date}}`, `{{day}}`, `{{weekday}}` placeholders

## v14.1.0 — Section Export to Clipboard (Multiple Formats) ✅
- ✅ `CL: Copy Section As…` — Markdown, Plain Text, JSON, CSV, HTML in one quick pick

## v14.2.0 — Item Age Highlight ✅
- ✅ Items with `@created:` dates 30+ days old rendered muted/italic automatically

## v14.3.0 — Bulk Rating ✅
- ✅ `CL: Bulk Set Rating` — sets `★N` on every item in the section at once

---

## v14.4.0 — Section Summary Decoration ✅
- ✅ Live `(N items · N done · N tags)` ghost text after every header

## v14.5.0 — Checklist Progress Bar ✅
- ✅ Live `▓▓▓░░ N/N` bar on headers with checkbox items (red/amber/green)

## v14.6.0 — Section Export Batch ✅
- ✅ `CL: Export All Sections as JSON` — full file export to JSON on disk

## v14.7.0 — AI Rewrite Item ✅
- ✅ `CL: Rewrite Item (AI)` — Claude rewrites item content, all markers preserved

---

## v14.8.0 — Decoration Toggle Commands ✅
- ✅ Individual toggles for Summary, Checklist Bar, Word Goal Bar, Age Highlight + master toggle

## v14.9.0 — Colour Label Workspace Filter ✅
- ✅ `CL: Filter by Colour Label (Workspace)` — across all workspace files

## v15.0.0 — Item Expiry ✅
- ✅ `@expires:YYYY-MM-DD` syntax + `CL: Show Expired Items`

## v15.1.0 — Section Templates Gallery ✅
- ✅ `CL: Browse Templates` — webview gallery with preview and one-click insert

---

## v15.2.0 — Smart Tab Completion ✅
- ✅ Tab confirms autocomplete suggestion if widget is open; falls through to indent if not

## v15.3.0 — Item Copy as Formatted Text ✅
- ✅ `CL: Copy Item as Rich Text` — ✓/☐, 🔴/🟠/🟡, ⭐, ❓ symbols

## v15.4.0 — Section Dependency Graph ✅
- ✅ `CL: Show Dependency Graph` — SVG node graph of `>>depends:` relationships

## v15.5.0 — Bulk Expiry Set ✅
- ✅ `CL: Set Expiry on All Items` — sets `@expires:` on every item in the section

---

## v15.6.0 — Item Grouping by Tag ✅
- ✅ `CL: Group Items by Tag` — clusters items by primary `#tag` with divider comments

## v15.7.0 — Section Progress Report ✅
- ✅ `CL: Show Progress Report` — per-section summary in a side panel

## v15.8.0 — Item Merge ✅
- ✅ `CL: Merge Item with Next` — joins item at cursor with the one below

## v15.9.0 — Item Splitting ✅
- ✅ `CL: Split Item at Cursor` — splits item at cursor into two items

---

## v16.0.0 — Item Clone with Transform ✅
- ✅ `CL: Clone Item as Done` — clones below with `[x]` prepended
- ✅ `CL: Clone Item Stripped` — clones with all markers removed

## v16.1.0 — Section Header Autocomplete ✅
- ✅ `> ` triggers existing section name suggestions

## v16.2.0 — Recent Sections ✅
- ✅ `CL: Show Recent Sections` — last 10 visited sections from jump history

## v16.3.0 — Item Frequency Report ✅
- ✅ `CL: Show Duplicate Items (File)` — cross-section duplicate detection

---

## v16.4.0 — Section Word Cloud ✅
- ✅ `CL: Show Word Cloud` — proportional SVG word cloud for current section

## v16.5.0 — Inline Due Date Picker ✅
- ✅ `CL: Set Due Date` — ISO, weekday names, `+7`, `today`, `next week`

## v16.6.0 — Section Merge by Similarity ✅
- ✅ `CL: Find Similar Sections` — Levenshtein similarity ≥70% flagged

## v16.7.0 — Item Vote Leaderboard ✅
- ✅ `CL: Show Vote Leaderboard` — all `+N` items sorted by vote count

---

## v16.8.0 — Item Age Stats ✅
- ✅ `CL: Show Age Stats` — oldest, newest, average age for stamped items

## v16.9.0 — Section Colour Theme ✅
- ✅ `CL: Set Section Colour` — `[colour:X]` tag on header

## v17.0.0 — Batch Date Stamp ✅
- ✅ `CL: Stamp All Items` — adds `@created:today` to every unstamped item

## v17.1.0 — Quick Stats Bar ✅
- ✅ Status bar tooltip enriched with full stats + completion % + click to open panel

---

## v17.2.0 — Inline Note Toggle ✅
- ✅ `Ctrl+Alt+N` keybinding for `CL: Toggle Note`

## v17.3.0 — Section Export Comparison ✅
- ✅ `CL: Compare Two Sections as Table` — side-by-side Markdown table

## v17.4.0 — Item Recurrence Templates ✅
- ✅ `CL: Insert Recurring Item` — 6 pre-built recurring patterns

## v17.5.0 — Smart Section Rename ✅
- ✅ `CL: Rename Section (Workspace)` — updates `[[links]]` across all workspace files

---

## v17.6.0 — Item Priority Sort ✅
- ✅ `CL: Sort by Priority` — `!!!` → `!!` → `!` → none

## v17.7.0 — Done Item Archive Age ✅
- ✅ `CL: Archive Old Done Items` — archives `[x]` items older than N days

## v17.8.0 — Workspace Dead Link Check ✅
- ✅ `CL: Find Dead Links` — reports broken `[[section]]` and `[[file:]]` links

## v17.9.0 — Item Quick Note ✅
- ✅ `CL: Add Quick Note to Item` — prompts and appends `// comment`

---

## v18.0.0 — Housekeeping ✅
- ✅ `patterns.ts` split into `patterns.ts` + `patternsUtils.ts` (both under 200 lines)
- ✅ Built v17.6–17.9 commands that were marked ✅ but unbuilt
- ✅ Item count badge defaults to off — section summary already shows count
- ✅ README and ARCHITECTURE.md updated

## v18.1.0 — Checkbox Fix ✅
- ✅ `[]` (no space) treated as todo same as `[ ]` — affects all checkbox-aware features

## v18.2.0 — Extension Icon ✅
- ✅ 128×128 PNG icon added — dark slate background, nested chevron rows

## v18.3.0 — Auto-Fix Numbering + Quick Fix Labels ✅
- ✅ `chevron-lists.autoFixNumbering` setting (default `false`) — cascades duplicate numbers forward on edit
- ✅ `CL:` prefix on all quick-fix actions in the Problems panel lightbulb menu

## v18.4.0 — New Default Theme ✅
- ✅ Default colour theme updated to violet/lime/slate — matches the extension icon
- ✅ Previous default (amber/blue) preserved as **Classic** theme
- ✅ `CL: Switch Colour Preset` renamed to `CL: Colour Theme`

---

## v18.5.0 — Expiry Diagnostics ✅
- ✅ `@expires:` items appear in Problems panel with squiggle + extend/remove quick fixes

## v18.6.0 — Priority in Section Summary ✅
- ✅ `(N items · N done · N tags · N urgent)` ghost text

## v18.7.0 — Today View ✅
- ✅ `CL: Today View` — all due/overdue items across workspace in one quick pick

## v18.8.0 — Kanban Webview ✅
- ✅ `CL: Show Kanban` — Todo / In Progress / Done columns from current file

## v18.9.0 — Export to Obsidian ✅
- ✅ `CL: Export to Obsidian` — `##` headings, YAML frontmatter, emoji markers

## v19.0.0 — Item Timer ✅
- ✅ `CL: Start Item Timer` / `CL: Stop Item Timer` — stamps `~elapsed` on stop
