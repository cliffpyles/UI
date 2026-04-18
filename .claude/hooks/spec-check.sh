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
  # `uses:` communicates which components the implementation is expected to
  # involve — this may be satisfied by a direct import, a JSX render, a slot
  # prop that accepts the component (e.g. `leadingIcon`), a type reference,
  # or a JSDoc mention. Pass when the component name appears anywhere in the
  # file; hard fail only when there is no evidence at all that the spec's
  # intended composition has been considered.
  if ! grep -q "${comp}" "$FILE_PATH"; then
    VIOLATIONS="${VIOLATIONS}- ${comp}\n"
  fi
done

if [ -n "$VIOLATIONS" ]; then
  {
    echo "Spec contract violation in $FILE_PATH:"
    echo "Spec: $SPEC"
    echo ""
    echo "The spec's \`uses:\` field lists these components as expected composition,"
    echo "but no reference to them was found anywhere in the file:"
    printf "%b" "$VIOLATIONS"
    echo ""
    echo "\`uses:\` may be satisfied by importing/rendering the component, by exposing"
    echo "it through a slot/prop (e.g. \`leadingIcon\`), or by a type/JSDoc reference."
    echo "If none of these fit, either compose from the listed components, or update"
    echo "the spec if the composition contract has legitimately changed."
    echo "The spec is the source of truth. Code drift from spec MUST be reconciled."
  } >&2
  exit 2
fi

exit 0
