#!/usr/bin/env bash
set -euo pipefail

DEVICE_NAME="LensBridge Cam"

if [[ "$(uname -s)" != "Linux" ]]; then
  echo "This setup script is only for Linux."
  exit 1
fi

if ! command -v modprobe >/dev/null 2>&1; then
  echo "modprobe is required. Install your distribution's kmod package."
  exit 1
fi

if ! lsmod | grep -q '^v4l2loopback'; then
  if ! modinfo v4l2loopback >/dev/null 2>&1; then
    echo "v4l2loopback is not installed."
    echo "Ubuntu/Debian: sudo apt install v4l2loopback-dkms v4l2loopback-utils"
    echo "Fedora: sudo dnf install akmod-v4l2loopback"
    echo "Arch: sudo pacman -S v4l2loopback-dkms"
    exit 1
  fi

  echo "Loading v4l2loopback as '${DEVICE_NAME}'..."
  sudo modprobe v4l2loopback exclusive_caps=1 card_label="${DEVICE_NAME}"
else
  echo "v4l2loopback is already loaded."
fi

echo "Virtual camera device list:"
v4l2-ctl --list-devices || true
echo
echo "V1 does not pipe frames into this device yet. FFmpeg/GStreamer output is the V2 target."
