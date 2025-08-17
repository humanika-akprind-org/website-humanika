import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out successfully" });

  // Hapus semua cookie yang terkait dengan autentikasi
  response.cookies.delete("google_access_token");
  response.cookies.delete("next-auth.session-token");
  response.cookies.delete("auth-token");

  // Alternatif: Jika ingin memastikan cookie dihapus dengan opsi path dan domain yang sama
  // dengan saat cookie dibuat
  const cookieOptions = {
    path: "/",
    // domain: ".example.com", // sesuaikan dengan domain Anda jika perlu
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
  };

  response.cookies.set({
    name: "google_access_token",
    value: "",
    maxAge: -1, // Set maxAge ke masa lalu untuk menghapus cookie
    ...cookieOptions,
  });

  response.cookies.set({
    name: "next-auth.session-token",
    value: "",
    maxAge: -1,
    ...cookieOptions,
  });

  response.cookies.set({
    name: "auth-token",
    value: "",
    maxAge: -1,
    ...cookieOptions,
  });

  return response;
}
