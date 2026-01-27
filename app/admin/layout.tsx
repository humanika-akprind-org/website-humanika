import type { Metadata } from "next";
import AuthProvider from "@/presentation/components/admin/auth/AuthProvider";
import Sidebar from "@/presentation/components/admin/layout/Sidebar";
import { Toaster } from "@/presentation/components/ui/toaster";
import "./admin.css";
import {
  getGoogleAccessToken,
  getGoogleUserEmail,
} from "@/infrastructure/external-services/google-drive/google-oauth";
import AuthGuard from "@/presentation/components/admin/auth/google-oauth/AuthGuard";
import UserInfo from "@/presentation/components/admin/layout/UserInfo";
import { geistSans, geistMono } from "../ui/fonts";
import SidebarMobile from "@/presentation/components/admin/layout/SidebarMobile";
import RefreshHandler from "@/presentation/components/admin/ui/RefreshHandler";
import GoogleDriveStatus from "@/presentation/components/admin/google-drive/GoogleDriveStatus";

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
  const accessToken = await getGoogleAccessToken();
  const userEmail = accessToken ? await getGoogleUserEmail(accessToken) : "";

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <RefreshHandler />
          <div className="flex h-screen overflow-hidden">
            <Sidebar />

            <div className="flex-1 overflow-auto">
              <header className="bg-white shadow-sm">
                <SidebarMobile />

                <div className="px-6 py-4 flex flex-col sm:flex-row items-center">
                  <h1 className="text-2xl font-bold text-gray-800">
                    Organizational Admin
                  </h1>
                  <div className="flex items-center space-x-4 ml-auto">
                    <GoogleDriveStatus
                      accessToken={accessToken}
                      userEmail={userEmail}
                    />
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
