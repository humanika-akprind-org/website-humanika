import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const accessToken = req.nextUrl.searchParams.get("accessToken");

  if (!accessToken) {
    return NextResponse.json(
      { success: false, message: "Access token is required" },
      { status: 400 }
    );
  }

  const drive = google.drive({
    version: "v3",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  try {
    const { data } = await drive.files.list({
      q: "trashed=false",
      fields: "files(id, name, size, mimeType, createdTime, webViewLink)",
      orderBy: "createdTime desc",
      pageSize: 1000,
    });

    return NextResponse.json({
      success: true,
      files: data.files || [],
    });
  } catch (error: unknown) {
    console.error("Error fetching files:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch files";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
