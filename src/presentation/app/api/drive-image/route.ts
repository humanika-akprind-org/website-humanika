import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get("fileId");
  const accessToken = searchParams.get("accessToken");

  if (!fileId) {
    return NextResponse.json(
      { error: "Missing fileId parameter" },
      { status: 400 }
    );
  }

  try {
    let response: Response;

    if (accessToken) {
      // For private files, use Google Drive API
      response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } else {
      // For public files, use direct download URL
      response = await fetch(
        `https://drive.google.com/uc?export=view&id=${fileId}`
      );
    }

    if (!response.ok) {
      console.error(`Google Drive API response status: ${response.status}`);
      console.error(
        `Response headers:`,
        Object.fromEntries(response.headers.entries())
      );

      // If file not found (404), return a default placeholder image
      if (response.status === 404) {
        // Return a simple SVG placeholder as a data URL
        const placeholderSvg = `
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="64" height="64" fill="#E5E7EB"/>
            <circle cx="32" cy="24" r="8" fill="#9CA3AF"/>
            <path d="M16 48c0-8.8 7.2-16 16-16s16 7.2 16 16" fill="#9CA3AF"/>
          </svg>
        `;
        const svgBuffer = Buffer.from(placeholderSvg);

        return new NextResponse(svgBuffer, {
          status: 200,
          headers: {
            "Content-Type": "image/svg+xml",
            "Cache-Control": "public, max-age=86400",
          },
        });
      }

      throw new Error(
        `Failed to fetch image: ${response.status} ${response.statusText}`
      );
    }

    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "image/jpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Drive image proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 }
    );
  }
}
