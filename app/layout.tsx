import type { Metadata } from "next";
import "@/app/globals.css";
import { geistSans, geistMono } from "@/app/ui/fonts";

export const metadata: Metadata = {
  title: "HUMANIKA",
  description: "HIMPUNAN MAHASISWA INFORMATIKA",
  icons: {
    icon: ["/favicon.ico?v=4"],
    apple: ["/apple-touch-icon.png"],
    shortcut: ["/apple-touch-icon.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
