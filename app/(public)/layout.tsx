import type { Metadata } from "next";
import localFont from "next/font/local";
import ".././globals.css";
import Header from "@/components/public/layout/Header";
import Footer from "@/components/public/layout/Footer";
import AIButton from "@/components/public/AIButton";
import { getCurrentUser } from "@/lib/auth";

const geistSans = localFont({
  src: "../ui/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../ui/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "HUMANIKA",
  description: "HIMPUNAN MAHASISWA INFORMATIKA",
  icons: {
    icon: ["/favicon.ico?v=4"],
    apple: ["/apple-touch-icon.png"],
    shortcut: ["/apple-touch-icon.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Mendapatkan user saat ini dari server
  const currentUser = await getCurrentUser();

  // Cek apakah user memiliki role ANGGOTA
  const isAnggota = currentUser?.role === "ANGGOTA";

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
        {/* Tombol AI hanya muncul untuk role ANGGOTA */}
        {isAnggota && <AIButton />}
      </body>
    </html>
  );
}
