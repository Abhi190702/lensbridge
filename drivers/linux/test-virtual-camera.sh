#!/usr/bin/env bash
set -euo pipefail

if ! command -v v4l2-ctl >/dev/null 2>&1; then
  echo "v4l2-ctl is required. Install v4l-utils."
  exit 1
fi

v4l2-ctl --list-devices
