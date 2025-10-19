import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("google_access_token")?.value || "";

    return NextResponse.json({
      accessToken,
    });
  } catch (error) {
    console.error("Error getting token:", error);
    return NextResponse.json(
      { error: "Failed to get token" },
      { status: 500 }
    );
  }
}
