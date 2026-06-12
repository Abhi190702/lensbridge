export function platformLabel(userAgent = navigator.userAgent) {
  if (/Android/i.test(userAgent)) return "Android";
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS";
  return "Browser";
}
