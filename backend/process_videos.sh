#!/bin/bash
set -euo pipefail

# Formatting options.
GREEN_BOLD="\033[1;32m"
BLUE_BOLD="\033[1;34m"
RESET="\033[0m"

# Directories.
VIDEO_DIR="videos"
OUTPUT_DIR="results"
mkdir -p "$OUTPUT_DIR"

for video in "$VIDEO_DIR"/*.[mM][pP]4; do
  if [ -f "$video" ]; then
    base=$(basename "$video")
    stem="${base%.*}"
    outpath="$OUTPUT_DIR/$stem-result.json"
    echo -e "\033[1;34mProcessing $video -> $outpath\033[0m"    
    python3.11 video_processor/main.py "$video" > "$outpath"

    summary=$(jq -r '.evaluation.summary' "$outpath")
    payout=$(jq -r '.payout.payout' "$outpath")
    violations=$(jq -c '.compliance.violations' "$outpath")
    
    echo   "    📋 Summary:   $summary"
    printf "    💰 Payout:    \$%.2f per 1k views.\n" "$payout"
    echo   "    ⚠️ Violations: $violations"
    echo -e "${GREEN_BOLD}✅ Video processed. Get full report at: $OUTPUT_DIR/$base.json${RESET}\n"
    fi
done
