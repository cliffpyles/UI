#!/bin/bash
# PostToolUse hook: enforces the composition-first rule
# (design/architecture.md → Composition-first).
#
# Universal rules — apply to every component file. Per-component rules
# (uses-list checks against design/components/<tier>/<Name>.md) live in
# spec-check.sh. Exit 2 feeds a fix suggestion back to Claude.

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
[ -z "$FILE_PATH" ] && exit 0
[ -f "$FILE_PATH" ] || exit 0

# Scan source files in component directories. CSS files get hardcoded-value
# checks; .tsx files get markup checks.
case "$FILE_PATH" in
  */src/primitives/*.tsx|*/src/components/*.tsx|*/src/domain/*.tsx|*/src/layouts/*.tsx|*/src/features/*.tsx) KIND=tsx ;;
  */src/primitives/*.css|*/src/components/*.css|*/src/domain/*.css|*/src/layouts/*.css|*/src/features/*.css) KIND=css ;;
  *) exit 0 ;;
esac

case "$FILE_PATH" in
  *.test.tsx) exit 0 ;;
esac

VIOLATIONS=""

flag() {
  VIOLATIONS="${VIOLATIONS}${1}\n\n"
}

# ----- TSX checks -----
if [ "$KIND" = "tsx" ]; then

  # Typographic tags must route through Text. Text primitive itself is exempt.
  case "$FILE_PATH" in
    */primitives/Text/*) ;;
    *)
      MATCHES=$(grep -nE '<(h[1-6]|p|legend)[[:space:]>]' "$FILE_PATH" \
        | grep -vE '//.*<(h[1-6]|p|legend)' || true)
      if [ -n "$MATCHES" ]; then
        flag "Raw typographic tags (h1-h6, p, legend) found:
$MATCHES
→ Use <Text as=\"...\">. See design/architecture.md → Composition-first."
      fi
      ;;
  esac

  # Styled-span heuristic — typography-bearing className on <span>.
  case "$FILE_PATH" in
    */primitives/Text/*) ;;
    *)
      SPAN_MATCHES=$(grep -nE '<span[^>]*className="[^"]*ui-[^"]*__(title|label|name|value|text|desc|description|subtitle|unit|number|actor|action|target)' "$FILE_PATH" || true)
      if [ -n "$SPAN_MATCHES" ]; then
        flag "Styled <span> carrying typography:
$SPAN_MATCHES
→ Use <Text as=\"span\" ...>. Keep className only if it carries non-typographic layout."
      fi
      ;;
  esac

  # Raw interactive controls must route through their owner component.
  # Map: tag → owner directory (where raw tag is permitted).
  check_raw() {
    local tag="$1" owner_re="$2" owner_msg="$3"
    case "$FILE_PATH" in
      $owner_re) return 0 ;;
    esac
    local m
    m=$(grep -nE "<${tag}[[:space:]/>]" "$FILE_PATH" || true)
    if [ -n "$m" ]; then
      flag "Raw <${tag}> outside ${owner_msg}:
$m
→ Use the ${owner_msg} component."
    fi
  }
  check_raw 'button'   '*/components/Button/*'                        'Button'
  check_raw 'input'    '*/components/Input/*|*/components/Checkbox/*|*/components/Radio/*|*/components/Toggle/*' 'Input/Checkbox/Radio/Toggle'
  check_raw 'textarea' '*/components/Textarea/*'                      'Textarea'
  check_raw 'select'   '*/components/Select/*'                        'Select'
  check_raw 'dialog'   '*/components/Modal/*'                         'Modal'

  # onClick on non-interactive elements.
  CLICK_MATCHES=$(grep -nE '<(div|span)[^>]*onClick[[:space:]]*=' "$FILE_PATH" || true)
  if [ -n "$CLICK_MATCHES" ]; then
    flag "onClick on non-interactive element:
$CLICK_MATCHES
→ Use Button (variant=\"ghost\" if unstyled), or move the handler to a real interactive element. Drives focus, keyboard, and ARIA correctness."
  fi

  # Inline number formatting — should use formatNumber/MetricValue/etc.
  case "$FILE_PATH" in
    */utils/*) ;;
    *)
      FMT_MATCHES=$(grep -nE '(Intl\.NumberFormat|\.toLocaleString\()' "$FILE_PATH" || true)
      if [ -n "$FMT_MATCHES" ]; then
        flag "Inline number formatting:
$FMT_MATCHES
→ Use formatNumber/formatCurrency/formatPercent (src/utils) or MetricValue/Currency/Percentage."
      fi
      ;;
  esac

  # Inline trend glyphs — should route through TrendIndicator.
  case "$FILE_PATH" in
    */domain/TrendIndicator/*) ;;
    *)
      GLYPH_MATCHES=$(LC_ALL=en_US.UTF-8 grep -nF -e '▲' -e '▼' -e '↑' -e '↓' "$FILE_PATH" || true)
      if [ -n "$GLYPH_MATCHES" ]; then
        flag "Inline trend glyph:
$GLYPH_MATCHES
→ Use <TrendIndicator direction=\"...\" />."
      fi
      ;;
  esac
fi

# ----- CSS checks -----
if [ "$KIND" = "css" ]; then
  # Hardcoded color literals (hex, rgb, hsl) outside reset/tokens generation.
  case "$FILE_PATH" in
    */styles/reset.css|*/styles/tokens.css|*/styles/themes/*|*/styles/density/*) ;;
    *)
      COLOR_MATCHES=$(grep -nE '(#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\()' "$FILE_PATH" \
        | grep -vE '/\*' || true)
      if [ -n "$COLOR_MATCHES" ]; then
        flag "Hardcoded color literal in CSS:
$COLOR_MATCHES
→ Reference a token via var(--...). See design/foundations/tokens.md."
      fi

      # Hardcoded pixel/rem dimensions for spacing/radius/shadow.
      # Allow 0, 1px borders, 100%/100vh-style values, and var() references.
      DIM_MATCHES=$(grep -nE '(margin|padding|gap|border-radius|box-shadow|font-size|line-height)[^:]*:[^;]*[0-9]+(\.[0-9]+)?(px|rem|em)' "$FILE_PATH" \
        | grep -vE 'var\(--' \
        | grep -vE ':[[:space:]]*1px[[:space:]]+(solid|dashed|dotted)' \
        | grep -vE '/\*' || true)
      if [ -n "$DIM_MATCHES" ]; then
        flag "Hardcoded dimension in CSS:
$DIM_MATCHES
→ Use a spacing/radius/typography token via var(--...)."
      fi
      ;;
  esac
fi

if [ -n "$VIOLATIONS" ]; then
  {
    echo "Composition rule violations in $FILE_PATH:"
    echo ""
    printf "%b" "$VIOLATIONS"
    echo "Source of truth: design/architecture.md (Composition-first)"
    echo "Per-component contract: design/components/<tier>/$(basename "$(dirname "$FILE_PATH")").md"
  } >&2
  exit 2
fi

exit 0
