import type { Metadata } from "next";
import "./auth.css";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Login or register to access the dashboard",
  icons: {
    icon: ["/favicon.ico?v=4"],
    apple: ["/apple-touch-icon.png"],
    shortcut: ["/apple-touch-icon.png"],
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
