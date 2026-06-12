#!/usr/bin/env bash
set -euo pipefail

if [[ "$(uname -s)" != "Linux" ]]; then
  echo "This uninstall script is only for Linux."
  exit 1
fi

if lsmod | grep -q '^v4l2loopback'; then
  echo "Unloading v4l2loopback..."
  sudo modprobe -r v4l2loopback
else
  echo "v4l2loopback is not loaded."
fi

echo "LensBridge does not remove packages automatically. Remove v4l2loopback with your package manager if desired."
