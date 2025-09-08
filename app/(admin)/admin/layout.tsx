import type { Metadata } from "next";
import AuthProvider from "@/components/admin/auth/AuthProvider";
import Sidebar from "@/components/admin/layout/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import "@/app/globals.css";
import { cookies } from "next/headers";
import AuthGuard from "@/components/admin/auth/google-oauth/AuthGuard";
import UserInfo from "@/components/admin/layout/UserInfo";
import { geistSans, geistMono } from "@/app/ui/fonts";
import SidebarMobile from "@/components/admin/layout/SidebarMobile";

export const metadata: Metadata = {
  title: "Organizational Management System",
  description: "Comprehensive platform for organization administration",
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
  const cookieStore = cookies();
  const accessToken = cookieStore.get("google_access_token")?.value || "";

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />

            <div className="flex-1 overflow-auto">
              <header className="bg-white shadow-sm">
                <SidebarMobile />

                <div className="px-6 py-4 flex justify-between items-center">
                  <h1 className="text-2xl font-semibold text-gray-800">
                    Organizational Dashboard
                  </h1>
                  <div className="flex items-center space-x-4">
                    <UserInfo />
                  </div>
                </div>
              </header>
              <AuthGuard accessToken={accessToken}>
                <main className="p-6 bg-white">{children}</main>
              </AuthGuard>
            </div>
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
