import type { Metadata } from "next";
import AuthProvider from "@/components/admin/auth/AuthProvider";
import Sidebar from "@/components/admin/layout/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import localFont from "next/font/local";
import "./../../globals.css";
import { getCurrentUser } from "@/lib/auth";

const geistSans = localFont({
  src: "./../../ui/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./../../ui/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Organizational Management System",
  description: "Comprehensive platform for organization administration",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Mendapatkan user saat ini dari server
  const currentUser = await getCurrentUser();

  // Cek apakah user memiliki role ANGGOTA
  const isAdmin =
    currentUser?.role === "DPO" ||
    currentUser?.role === "BPH" ||
    currentUser?.role === "PENGURUS";

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <AuthProvider>
          <div className="flex h-screen overflow-hidden">
            {/* Sidebar hanya ditampilkan untuk admin */}
            {isAdmin && <Sidebar />}

            <div className="flex-1 overflow-auto">
              <header className="bg-white shadow-sm">
                <div className="px-6 py-4 flex justify-between items-center">
                  <h1 className="text-2xl font-semibold text-gray-800">
                    Organizational Dashboard
                  </h1>
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                      {/* Menampilkan nama pengguna yang benar */}
                      <div className="text-right min-w-[120px] max-w-[200px]">
                        <p className="font-medium truncate">
                          {currentUser?.name}
                        </p>
                        <p className="text-blue-200 text-xs bg-blue-600 px-2 py-1 rounded-full mt-1 inline-block">
                          {currentUser?.role}
                        </p>
                      </div>
                      <span className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
              </header>
              <main className="p-6 bg-white">{children}</main>
            </div>
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
