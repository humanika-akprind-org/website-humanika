import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const fileId = params.id;
    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization header missing" },
        { status: 401 }
      );
    }

    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?fields=*`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch file details from Google Drive");
    }

    const fileData = await response.json();
    return NextResponse.json(fileData);
  } catch (error) {
    console.error("Error fetching file details:", error);
    return NextResponse.json(
      { error: "Failed to fetch file details" },
      { status: 500 }
    );
  }
}
