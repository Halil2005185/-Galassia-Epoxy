import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | Galassia Epoxy Design",
  robots: { index: false, follow: true },
};

// A truly unmatched URL (no [locale] segment recognized at all, e.g. a
// stray /favicon-32x32.png request or a bare typo) never enters the
// [locale] layout, so this has no parent <html>/<body> to rely on and
// must provide its own — kept minimal since we can't know which of the
// three languages the visitor intended.
export default function RootNotFound() {
  return (
    <html lang="en" dir="ltr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "5vh 8vw",
          backgroundColor: "#f7f5f0",
          color: "#171717",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <p style={{ color: "#b08d57", letterSpacing: "0.1em", fontSize: "13px" }}>404</p>
        <h1 style={{ fontSize: "2.5rem", margin: "16px 0" }}>Page Not Found</h1>
        <p style={{ maxWidth: "32rem", lineHeight: 1.6, color: "#4b4b4b" }}>
          The page you&apos;re looking for may have moved or never existed.
        </p>
        <a
          href="/tr"
          style={{
            marginTop: "24px",
            padding: "12px 24px",
            backgroundColor: "#171717",
            color: "#fff",
            textDecoration: "none",
          }}
        >
          Back to Home
        </a>
      </body>
    </html>
  );
}
