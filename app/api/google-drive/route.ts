import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";

export const dynamic = "force-dynamic"; // Required for Next.js API routes

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    // Handle file uploads
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const action = formData.get("action") as string;
      const accessToken = formData.get("accessToken") as string;
      const folderId = formData.get("folderId") as string;

      if (action !== "upload" || !file) {
        throw new Error("Invalid upload request");
      }

      const drive = google.drive({
        version: "v3",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Convert file to stream
      const buffer = Buffer.from(await file.arrayBuffer());
      const stream = Readable.from(buffer);

      // Upload to Google Drive
      const { data } = await drive.files.create({
        requestBody: {
          name: file.name,
          mimeType: file.type,
          parents: folderId && folderId !== "root" ? [folderId] : undefined,
        },
        media: {
          mimeType: file.type,
          body: stream,
        },
        fields: "id,name,webViewLink,webContentLink",
      });

      return NextResponse.json({
        success: true,
        file: {
          id: data.id,
          name: data.name,
          url: data.webViewLink,
          downloadUrl: data.webContentLink,
        },
      });
    }

    // Handle other actions (rename, delete, etc.)
    const { action, fileId, fileName, accessToken } = await request.json();

    const drive = google.drive({
      version: "v3",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    switch (action) {
      case "rename":
        if (!fileId || !fileName) {
          throw new Error("Missing file ID or new name");
        }
        await drive.files.update({
          fileId,
          requestBody: { name: fileName },
        });
        return NextResponse.json({ success: true });

      case "delete":
        if (!fileId) {
          throw new Error("Missing file ID");
        }
        await drive.files.delete({ fileId });
        return NextResponse.json({ success: true });

      case "getUrl":
        if (!fileId) {
          throw new Error("Missing file ID");
        }
        // Ensure file is shared
        await drive.permissions.create({
          fileId,
          requestBody: {
            role: "reader",
            type: "anyone",
          },
        });
        const { data } = await drive.files.get({
          fileId,
          fields: "webViewLink",
        });
        return NextResponse.json({
          success: true,
          url:
            data.webViewLink ||
            `https://drive.google.com/file/d/${fileId}/view`,
        });

      default:
        throw new Error("Invalid action");
    }
  } catch (error: unknown) {
    console.error("[DRIVE_API_ERROR]", error);
    
    let message = "Operation failed";
    let details = null;
    let statusCode = 500;
    
    if (error instanceof Error) {
      message = error.message;
    }
    
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const err = error as { response?: { status?: number; data?: unknown } };
      statusCode = err.response?.status || 500;
      details = err.response?.data || null;
    }
    
    return NextResponse.json(
      {
        success: false,
        message,
        details,
      },
      { status: statusCode }
    );
  }
}
