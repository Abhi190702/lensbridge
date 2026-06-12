export function cameraErrorMessage(error: unknown): string {
  if (error instanceof DOMException) {
    if (error.name === "NotAllowedError") {
      return "Camera permission was denied. Enable camera access for this site and try again.";
    }
    if (error.name === "NotFoundError") {
      return "No camera was found on this device.";
    }
    if (error.name === "NotReadableError") {
      return "The camera is already in use by another app.";
    }
    if (error.name === "OverconstrainedError") {
      return "This device could not satisfy the selected quality profile.";
    }
  }

  return "Could not start the camera.";
}
