// lib/auth/clearAuthCookies.ts
import { NextResponse } from "next/server";
import { isProduction } from "@/lib/config/config";

export function clearAuthCookies(response?: NextResponse) {
  const res = response || NextResponse.next();

  // Hapus semua cookie yang terkait dengan autentikasi
  res.cookies.delete("google_access_token");
  res.cookies.delete("next-auth.session-token");
  res.cookies.delete("auth-token");

  // Opsional: Tambakan metode penghapusan dengan opsi yang sama saat dibuat
  const cookieOptions = {
    path: "/",
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
  };

  res.cookies.set({
    name: "google_access_token",
    value: "",
    maxAge: -1,
    ...cookieOptions,
  });

  res.cookies.set({
    name: "next-auth.session-token",
    value: "",
    maxAge: -1,
    ...cookieOptions,
  });

  res.cookies.set({
    name: "auth-token",
    value: "",
    maxAge: -1,
    ...cookieOptions,
  });

  return res;
}
