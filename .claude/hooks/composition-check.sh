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

# Match opening tags: <h1..h6, <p, <legend with a space or >.
# <label> is exempt — it's almost always a structural wrapper for a form
# control, not a typographic element.
MATCHES=$(grep -nE '<(h[1-6]|p|legend)[[:space:]>]' "$FILE_PATH" \
  | grep -vE '//.*<(h[1-6]|p|legend)' || true)

if [ -n "$MATCHES" ]; then
  {
    echo "Composition rule violation in $FILE_PATH:"
    echo "$MATCHES"
    echo ""
    echo "Typographic tags (h1-h6, p, legend) must render through the Text primitive."
    echo "Replace with: <Text as=\"h3\" size=\"...\" weight=\"...\">…</Text>"
    echo "See design/architecture.md → Composition-first rule."
  } >&2
  exit 2
fi

# Styled-span heuristic: flag <span> with BEM classes that carry typography
# (title, label, name, value, text, desc, description, subtitle, unit,
#  number, actor, action, target). These should route through <Text as="span">.
SPAN_MATCHES=$(grep -nE '<span[^>]*className="[^"]*ui-[^"]*__(title|label|name|value|text|desc|description|subtitle|unit|number|actor|action|target)' "$FILE_PATH" || true)

if [ -n "$SPAN_MATCHES" ]; then
  {
    echo "Composition rule violation in $FILE_PATH:"
    echo "$SPAN_MATCHES"
    echo ""
    echo "Styled <span> elements carrying typography classes must render through the Text primitive."
    echo "Replace with: <Text as=\"span\" size=\"...\" weight=\"...\" color=\"...\">…</Text>"
    echo "Keep the BEM className only if it still carries non-typographic layout (ellipsis, flex-shrink, etc.)."
    echo "See design/architecture.md → Composition-first rule."
  } >&2
  exit 2
fi

exit 0
