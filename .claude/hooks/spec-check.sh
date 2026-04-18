#!/bin/bash
# PostToolUse hook: enforces per-component spec contracts.
#
# For every component .tsx edited under src/{primitives,components,domain,layouts},
# locate the matching spec at design/components/<tier>/<Name>.md and verify:
#   - The spec exists (warning only, since specs are being authored gradually)
#   - Each component listed in the spec's `uses:` frontmatter is imported
#
# Source of truth: the spec file. Drift between code and spec MUST fail.

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
[ -z "$FILE_PATH" ] && exit 0
[ -f "$FILE_PATH" ] || exit 0

case "$FILE_PATH" in
  */src/primitives/*/[A-Z]*.tsx|*/src/components/*/[A-Z]*.tsx|*/src/domain/*/[A-Z]*.tsx|*/src/layouts/*/[A-Z]*.tsx) ;;
  *) exit 0 ;;
esac
case "$FILE_PATH" in
  *.test.tsx) exit 0 ;;
esac

# Component name = file basename without .tsx; require it to match the
# enclosing directory name (the canonical component file).
BASENAME=$(basename "$FILE_PATH" .tsx)
DIRNAME=$(basename "$(dirname "$FILE_PATH")")
[ "$BASENAME" = "$DIRNAME" ] || exit 0

PROJECT_ROOT="${CLAUDE_PROJECT_DIR:-$(pwd)}"
SPEC_DIR="$PROJECT_ROOT/design/components"

# Spec lookup: design/components/*/<Name>.md (any tier folder).
SPEC=""
for candidate in "$SPEC_DIR"/*/"$BASENAME.md"; do
  [ -f "$candidate" ] && { SPEC="$candidate"; break; }
done

if [ -z "$SPEC" ]; then
  # Warn-only mode: allow editing components that don't yet have specs.
  # Surface the gap so it gets filled, but don't block.
  {
    echo "Spec missing for $BASENAME."
    echo "Expected at: design/components/<tier>/$BASENAME.md"
    echo "Template: design/components/_template.md"
    echo "(Warning only — specs are being authored gradually. Author one when feasible.)"
  } >&2
  exit 0
fi

# Extract the `uses:` line from frontmatter. Format: uses: [A, B, C]
USES_LINE=$(awk '/^---$/{n++; next} n==1 && /^uses:/{print; exit}' "$SPEC")
USES=$(echo "$USES_LINE" | sed -E 's/^uses:[[:space:]]*\[//; s/\][[:space:]]*(#.*)?$//; s/,/ /g; s/[[:space:]]+/ /g')

VIOLATIONS=""
for comp in $USES; do
  comp=$(echo "$comp" | tr -d '[:space:]"'"'")
  [ -z "$comp" ] && continue
  # Allow either `import { Comp` or `import { ..., Comp` patterns and
  # JSX usage `<Comp` as evidence the component is being composed.
  if ! grep -qE "(\\bimport\\b[^;]*\\b${comp}\\b|<${comp}[[:space:]/>])" "$FILE_PATH"; then
    VIOLATIONS="${VIOLATIONS}- ${comp}\n"
  fi
done

if [ -n "$VIOLATIONS" ]; then
  {
    echo "Spec contract violation in $FILE_PATH:"
    echo "Spec: $SPEC"
    echo ""
    echo "The spec's \`uses:\` field declares these components as required composition,"
    echo "but they are not imported or rendered:"
    printf "%b" "$VIOLATIONS"
    echo ""
    echo "Either:"
    echo "  (a) compose from the listed components (preferred), or"
    echo "  (b) update the spec if the composition contract has legitimately changed."
    echo "The spec is the source of truth. Code drift from spec MUST be reconciled."
  } >&2
  exit 2
fi

exit 0
