import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "devault — your link vault",
  description: "Save, search, and organize your bookmarks. Built with taste.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
