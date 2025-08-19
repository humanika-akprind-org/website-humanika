import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import AuthProvider from "@/components/auth/AuthProvider";
import Sidebar from "@/components/layout/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import localFont from "next/font/local";
import "./../../globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("google_access_token")?.value || "";

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <AuthProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar accessToken={accessToken} />
            <div className="flex-1 overflow-auto">
              <header className="bg-white shadow-sm">
                <div className="px-6 py-4 flex justify-between items-center">
                  <h1 className="text-2xl font-semibold text-gray-800">
                    Organizational Dashboard
                  </h1>
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                      <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
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
                      <span>Account</span>
                    </button>
                  </div>
                </div>
              </header>
              <main className="p-6">{children}</main>
            </div>
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
