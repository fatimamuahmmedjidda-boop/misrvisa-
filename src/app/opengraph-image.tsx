import { ImageResponse } from "next/og";

export const alt = "MISR VISA — Egypt visa on arrival USD 36 · OK-to-Board in 24–48 hours";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", padding: 72, background: "linear-gradient(135deg,#004d43 0%,#04140f 55%,#020b09 100%)", color: "#faf7f1" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div style={{ display: "flex", fontSize: 30, letterSpacing: 10, color: "#ebc487" }}>MISR VISA · CAIRO</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 66, lineHeight: 1.1, whiteSpace: "nowrap" }}>Egypt Visa on Arrival</div>
            <div style={{ display: "flex", fontSize: 66, lineHeight: 1.1, whiteSpace: "nowrap", color: "#ebc487" }}>OK-to-Board in 24–48h</div>
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "rgba(250,247,241,0.7)" }}>Fly EgyptAir or Ethiopian Airlines · misrvisa.com</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: 300 }}>
          <div style={{ display: "flex", width: 260, height: 260, borderRadius: 999, border: "6px solid #ebc487", boxShadow: "0 0 0 14px #04140f, 0 0 0 17px #ebc487", alignItems: "center", justifyContent: "center", flexDirection: "column", transform: "rotate(-12deg)" }}>
            <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, color: "#ebc487" }}>QR VISA</div>
            <div style={{ display: "flex", fontSize: 110, color: "#ebc487", lineHeight: 1 }}>$36</div>
            <div style={{ display: "flex", fontSize: 20, letterSpacing: 4, color: "#ebc487" }}>CAIRO AIRPORT</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
