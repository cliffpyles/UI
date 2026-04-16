#!/bin/bash
# PostToolUse hook: run tests when a test file is written/edited.
# Exit 2 feeds test failures back to Claude so it can self-correct.

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only run for test files
if [[ "$FILE_PATH" != *.test.ts && "$FILE_PATH" != *.test.tsx ]]; then
  exit 0
fi

OUTPUT=$(npx vitest run "$FILE_PATH" 2>&1)
if [ $? -ne 0 ]; then
  echo "$OUTPUT" | tail -30 >&2
  exit 2
fi
