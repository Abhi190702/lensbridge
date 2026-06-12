import QRCode from "qrcode";

export function createQrDataUrl(value: string): Promise<string> {
  return QRCode.toDataURL(value, {
    errorCorrectionLevel: "M",
    margin: 1,
    scale: 8,
    color: {
      dark: "#0c111d",
      light: "#ffffff"
    }
  });
}
