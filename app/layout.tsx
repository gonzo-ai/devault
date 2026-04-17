import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "devault — your link vault",
  description: "Save, search, and organize your bookmarks in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
