# Changelog

All notable changes to **Chevron Lists** will be documented here.

## [0.0.1] - 2026-03-19

### Added
- Smart Enter key behaviour for `>> -` nested blockquote list items in markdown
- Pressing Enter after a `> Header` line starts a `>> -` list item on the next line (no blank line)
- Pressing Enter after a `>> - Item` line continues the list with another `>> -` prefix
- Pressing Enter on an empty `>> -` line stops the list and clears the prefix
- All other Enter presses in markdown files behave normally
