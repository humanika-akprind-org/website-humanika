import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";

  // Handle multipart/form-data for upload
  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const action = formData.get("action") as string;
    const accessToken = formData.get("accessToken") as string;

    if (action === "upload" && file) {
      try {
        const drive = google.drive({
          version: "v3",
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        // Convert File to Buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Convert Buffer to Readable Stream
        const stream = Readable.from(buffer);

        await drive.files.create({
          requestBody: { name: file.name },
          media: {
            mimeType: file.type,
            body: stream, // Use stream instead of buffer
          },
        });

        return NextResponse.json({ success: true });
      } catch (error: unknown) {
        console.error(error);
        const errorMessage =
          error instanceof Error ? error.message : "An error occurred";
        return NextResponse.json({ success: false, message: errorMessage });
      }
    }
  }

  // Handle JSON actions
  const { action, fileId, fileName, accessToken } = await req.json();

  const drive = google.drive({
    version: "v3",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  try {
    if (action === "delete" && fileId) {
      await drive.files.delete({ fileId });
      return NextResponse.json({ success: true });
    }

    if (action === "rename" && fileId && fileName) {
      await drive.files.update({
        fileId,
        requestBody: { name: fileName },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: "Invalid request" });
  } catch (error: unknown) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ success: false, message: errorMessage });
  }
}
