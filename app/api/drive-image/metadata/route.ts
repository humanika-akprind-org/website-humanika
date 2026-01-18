import { type NextRequest, NextResponse } from "next/server";

// Calculate size in human-readable format
const formatSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

// Get format from mimeType
const getFormat = (mimeType: string) => {
  const format = mimeType.split("/")[1]?.toUpperCase();
  return format || "JPEG";
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get("fileId");
  const accessToken = searchParams.get("accessToken");

  if (!fileId) {
    return NextResponse.json(
      { error: "Missing fileId parameter" },
      { status: 400 },
    );
  }

  try {
    // Fetch file metadata from Google Drive API v3
    const metadataUrl = new URL(
      `https://www.googleapis.com/drive/v3/files/${fileId}`,
    );
    metadataUrl.searchParams.set(
      "fields",
      "fileSize,mimeType,imageMediaMetadata",
    );

    // Check for authentication
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    let response: Response | null = null;

    // Try with API key first (for public files)
    if (apiKey) {
      metadataUrl.searchParams.set("key", apiKey);
      response = await fetch(metadataUrl.toString());
    }

    // Try with OAuth token if API key failed or not available
    if ((!response || !response.ok) && accessToken) {
      metadataUrl.searchParams.delete("key");
      response = await fetch(metadataUrl.toString(), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    // If we have a successful response, use the metadata
    if (response && response.ok) {
      const metadata = await response.json();

      const fileSize = metadata.fileSize || 0;
      const mimeType = metadata.mimeType || "image/jpeg";
      const imageMetadata = metadata.imageMediaMetadata || {};
      const width = imageMetadata.width || 0;
      const height = imageMetadata.height || 0;

      return NextResponse.json({
        resolution: width > 0 && height > 0 ? `${width} × ${height}` : null,
        format: getFormat(mimeType),
        size: fileSize > 0 ? formatSize(fileSize) : null,
      });
    }

    // Fallback: Get metadata directly from image URL headers
    const imageUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
    const headResponse = await fetch(imageUrl, { method: "HEAD" });

    if (headResponse.ok) {
      const contentLength = headResponse.headers.get("Content-Length");
      const contentType =
        headResponse.headers.get("Content-Type") || "image/jpeg";

      const fileSize = contentLength ? parseInt(contentLength, 10) : 0;

      return NextResponse.json({
        resolution: null,
        format: getFormat(contentType),
        size: fileSize > 0 ? formatSize(fileSize) : null,
      });
    }

    // If all else fails, try the direct Google Drive download URL
    const directUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
    let directResponse: Response;

    if (accessToken) {
      directResponse = await fetch(directUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } else {
      directResponse = await fetch(directUrl);
    }

    if (directResponse.ok) {
      const contentLength = directResponse.headers.get("Content-Length");
      const contentType =
        directResponse.headers.get("Content-Type") || "image/jpeg";

      const fileSize = contentLength ? parseInt(contentLength, 10) : 0;

      return NextResponse.json({
        resolution: null,
        format: getFormat(contentType),
        size: fileSize > 0 ? formatSize(fileSize) : null,
      });
    }

    // Return null values if we can't get any metadata
    return NextResponse.json({
      resolution: null,
      format: null,
      size: null,
    });
  } catch (error) {
    console.error("Drive image metadata error:", error);
    // Return null values on error - frontend should handle this
    return NextResponse.json({
      resolution: null,
      format: null,
      size: null,
    });
  }
}
