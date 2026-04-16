#!/bin/bash
# PostToolUse hook: lint after Write/Edit on .ts/.tsx files.
# Exit 2 feeds lint errors back to Claude so it can self-correct.

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only run for TypeScript files
if [[ "$FILE_PATH" != *.ts && "$FILE_PATH" != *.tsx ]]; then
  exit 0
fi

OUTPUT=$(npx eslint --no-warn-ignored "$FILE_PATH" 2>&1)
if [ $? -ne 0 ]; then
  echo "$OUTPUT" | head -30 >&2
  exit 2
fi
