import type { Metadata } from "next";
import type { CSSProperties } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "WasteStream AI",
  description: "AI marketplace for waste providers and recyclers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      style={{ "--font-bricolage": '"Segoe UI", "Helvetica Neue", sans-serif' } as CSSProperties}
    >
      <body>{children}</body>
    </html>
  );
}
