import type { Metadata } from "next";
import "./public.css";
import Header from "@/components/public/layout/Header";
import Footer from "@/components/public/layout/Footer";
import AIButton from "@/components/public/ui/AIButton";
import { getCurrentUser } from "@/lib/auth";
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
