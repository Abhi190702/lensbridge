const DEVICE_ID_KEY = "lensbridge.phone.deviceId.v1";

export interface PhoneDeviceIdentity {
  deviceId: string;
  deviceName: string;
  platform: string;
  userAgent: string;
}

export function getPhoneDeviceIdentity(): PhoneDeviceIdentity {
  const deviceId = getOrCreateDeviceId();
  const userAgent = navigator.userAgent;
  const userAgentData = navigator as Navigator & { userAgentData?: { platform?: string } };
  const platform = userAgentData.userAgentData?.platform ?? navigator.platform ?? "Unknown phone";

  return {
    deviceId,
    deviceName: friendlyDeviceName(platform),
    platform,
    userAgent
  };
}

function getOrCreateDeviceId() {
  const existing = localStorage.getItem(DEVICE_ID_KEY);
  if (existing) return existing;

  const next = crypto.randomUUID();
  localStorage.setItem(DEVICE_ID_KEY, next);
  return next;
}

function friendlyDeviceName(platform: string) {
  const trimmed = platform.trim();
  return trimmed ? `Phone (${trimmed})` : "Phone";
}
