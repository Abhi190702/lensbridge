export interface SecurityState {
  sessionTokenValid: boolean;
  expiresAt: string;
  deviceTrusted: boolean;
  encryptionMode: "webrtc-dtls-srtp" | "planned-tls" | "unavailable";
  localOnly: boolean;
  remoteRelayEnabled: boolean;
}

export const defaultSecurityState: SecurityState = {
  sessionTokenValid: false,
  expiresAt: new Date(0).toISOString(),
  deviceTrusted: false,
  encryptionMode: "webrtc-dtls-srtp",
  localOnly: true,
  remoteRelayEnabled: false
};
