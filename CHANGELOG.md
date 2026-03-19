# Changelog

All notable changes to **Chevron Lists** will be documented here.

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
