#!/bin/bash
# Stop hook: typecheck at end of turn (also safe to run PostToolUse).
# Exit 2 feeds errors back to Claude so it can self-correct.

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# When invoked from PostToolUse, skip non-TS edits. When invoked from Stop,
# there's no file_path — run unconditionally.
if [[ -n "$FILE_PATH" && "$FILE_PATH" != *.ts && "$FILE_PATH" != *.tsx ]]; then
  exit 0
fi

OUTPUT=$(npx tsc -b 2>&1)
if [ $? -ne 0 ]; then
  echo "$OUTPUT" | head -30 >&2
  exit 2
fi
