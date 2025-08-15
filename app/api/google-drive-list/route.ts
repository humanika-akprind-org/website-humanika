import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const accessToken = searchParams.get("accessToken");

  if (!accessToken) {
    return NextResponse.json(
      { success: false, message: "Missing access token" },
      { status: 400 }
    );
  }

  const drive = google.drive({
    version: "v3",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  try {
    const result = await drive.files.list({
      pageSize: 15,
      fields: "nextPageToken, files(id, name)",
    });

    return NextResponse.json({
      success: true,
      files: result.data.files || [],
    });
  } catch (error: unknown) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
