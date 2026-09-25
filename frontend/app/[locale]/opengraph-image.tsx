import { ImageResponse } from "next/og";

export const alt = "Galassia Epoxy Design";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Kept locale-agnostic (no translated text) on purpose: Satori (which
// powers ImageResponse) can't yet shape Arabic script correctly — it
// throws "lookupType: 5 - substFormat: 3 is not yet supported" — so
// rendering the Arabic hero title here would break the /ar OG image.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          backgroundColor: "#171717",
          color: "#ffffff",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "72px",
              height: "72px",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #ffffff",
              fontSize: "36px",
            }}
          >
            G
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "32px", lineHeight: 1.1 }}>Galassia</span>
            <span style={{ fontSize: "18px", letterSpacing: "4px", color: "#b08d57" }}>
              EPOXY DESIGN
            </span>
          </div>
        </div>
        <div style={{ display: "flex", fontSize: "44px", lineHeight: 1.25, maxWidth: "980px" }}>
          Handcrafted Epoxy Resin & Hardwood Art
        </div>
        <div style={{ display: "flex", width: "120px", height: "4px", backgroundColor: "#b08d57", marginTop: "40px" }} />
      </div>
    ),
    { ...size }
  );
}
