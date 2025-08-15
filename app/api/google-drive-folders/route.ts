import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Required for Next.js API routes

export async function GET(request: NextRequest) {
  try {
    // Validate access token
    const accessToken = request.nextUrl.searchParams.get("accessToken");
    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "Missing access token" },
        { status: 401 }
      );
    }

    // Initialize Google Drive API
    const drive = google.drive({
      version: "v3",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    // Retrieve folders with specific fields
    const { data } = await drive.files.list({
      q: "mimeType='application/vnd.google-apps.folder' and trashed=false",
      fields: "files(id, name, createdTime, modifiedTime)",
      orderBy: "name_natural",
      pageSize: 100,
    });

    return NextResponse.json({
      success: true,
      folders: data.files || [],
    });
  } catch (error: unknown) {
    console.error("[DRIVE_FOLDERS_ERROR]", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to retrieve folders";

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        details: null,
      },
      { status: 500 }
    );
  }
}
