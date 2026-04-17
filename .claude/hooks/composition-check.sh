#!/bin/bash
# PostToolUse hook: flags raw typographic HTML tags in component code,
# enforcing the composition-first rule (design/architecture.md).
#
# Rule: typographic content (h1-h6, p, label, legend, styled span) must
# render through the Text primitive. Layout containers should use Box.
# Exit 2 feeds a fix suggestion back to Claude.

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only scan source .tsx files in component directories
case "$FILE_PATH" in
  */src/components/*.tsx|*/src/domain/*.tsx|*/src/layouts/*.tsx|*/src/features/*.tsx) ;;
  *) exit 0 ;;
esac

# Skip tests and the Text primitive itself
case "$FILE_PATH" in
  *.test.tsx|*/primitives/Text/*) exit 0 ;;
esac

# Allowlist: files where raw HTML is semantically justified. Keep narrow.
case "$FILE_PATH" in
  */Table/Table.tsx|*/Breadcrumbs/Breadcrumbs.tsx|*/Input/Input.tsx|*/Select/Select.tsx)
    exit 0 ;;
esac

[ -f "$FILE_PATH" ] || exit 0

# Match opening tags: <h1..h6, <p, <label, <legend with a space or >
# Exclude self-closing void patterns and JSX fragments.
MATCHES=$(grep -nE '<(h[1-6]|p|label|legend)[[:space:]>]' "$FILE_PATH" \
  | grep -vE '//.*<(h[1-6]|p|label|legend)' || true)

if [ -n "$MATCHES" ]; then
  {
    echo "Composition rule violation in $FILE_PATH:"
    echo "$MATCHES"
    echo ""
    echo "Typographic tags (h1-h6, p, label, legend) must render through the Text primitive."
    echo "Replace with: <Text as=\"h3\" size=\"...\" weight=\"...\">…</Text>"
    echo "See design/architecture.md → Composition-first rule."
  } >&2
  exit 2
fi

exit 0
