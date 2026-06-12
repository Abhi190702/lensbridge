#!/usr/bin/env bash
set -euo pipefail

corepack enable
pnpm install
pnpm typecheck
