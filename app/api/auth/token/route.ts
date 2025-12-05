import { getGoogleAccessToken } from "@/lib/google-drive/google-oauth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const accessToken = await getGoogleAccessToken();

    return NextResponse.json({
      accessToken,
    });
  } catch (error) {
    console.error("Error getting token:", error);
    return NextResponse.json({ error: "Failed to get token" }, { status: 500 });
  }
}
