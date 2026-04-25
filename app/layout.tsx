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
      <body>
        {children}
        <script defer src="https://umami.heyturgay.com/script.js" data-website-id="8efb473c-bb85-484c-acc7-33d412b9b335"></script>
      </body>
    </html>
  );
}
