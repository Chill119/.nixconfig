#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
DIST_DIR="$SCRIPT_DIR/dist"

mkdir -p "$DIST_DIR"
cp "$SCRIPT_DIR/index.html" "$DIST_DIR/index.html"
cp "$SCRIPT_DIR/styles.css" "$DIST_DIR/styles.css"

printf "Built UI to %s\n" "$DIST_DIR"
