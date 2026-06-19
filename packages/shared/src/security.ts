export interface SecurityState {
  sessionTokenValid: boolean;
  expiresAt: string;
  deviceTrusted: boolean;
  encryptionMode: "webrtc-dtls-srtp" | "planned-tls" | "unavailable";
  localOnly: boolean;
  remoteRelayEnabled: boolean;
}

export interface TrustedDeviceRecord {
  deviceId: string;
  label: string;
  platform?: string;
  userAgent?: string;
  fingerprint: string;
  trustedAt: string;
  lastSeenAt?: string;
}

export interface SecurityAuditEvent {
  id: string;
  kind:
    | "pairing-requested"
    | "approved-once"
    | "trusted-device-added"
    | "trusted-device-auto-approved"
    | "trusted-device-revoked"
    | "pairing-rejected"
    | "pairing-expired";
  deviceId?: string;
  label?: string;
  message: string;
  createdAt: string;
}

export interface PairingApprovalRequest {
  sessionId: string;
  deviceId: string;
  deviceName: string;
  platform?: string;
  userAgent?: string;
  pairingCode: string;
  requestedAt: string;
  trusted: boolean;
}

export const defaultSecurityState: SecurityState = {
  sessionTokenValid: false,
  expiresAt: new Date(0).toISOString(),
  deviceTrusted: false,
  encryptionMode: "webrtc-dtls-srtp",
  localOnly: true,
  remoteRelayEnabled: false
};
