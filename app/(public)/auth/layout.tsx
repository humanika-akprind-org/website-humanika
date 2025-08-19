import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Login or register to access the dashboard",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
