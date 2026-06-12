#!/usr/bin/env bash
set -euo pipefail

pnpm clean
rm -rf node_modules apps/*/node_modules packages/*/node_modules
