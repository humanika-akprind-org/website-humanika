import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToGoogleDrive } from "@/lib/google-drive";

interface GalleryData {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: Date;
}

interface PostResponse {
  id?: string;
  title?: string;
  imageUrl?: string;
  message?: string;
}

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/gif"];

export async function GET(): Promise<
  NextResponse<GalleryData[] | { message: string }>
> {
  try {
    const galleries = await prisma.gallery.findMany({
      select: {
        id: true,
        title: true,
        imageUrl: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(galleries);
  } catch (error) {
    console.error("Error fetching galleries:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request
): Promise<NextResponse<PostResponse>> {
  try {
    const formData = await request.formData();
    const title = formData.get("title")?.toString();
    const file = formData.get("file") as File | null;
    const userId = formData.get("userId")?.toString();

    // Validate required fields
    if (!file || !title || !userId) {
      return NextResponse.json(
        {
          message:
            "Missing required fields: file, title, and userId are all required",
        },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { message: "Invalid file type. Only JPEG, PNG, and GIF are allowed." },
        { status: 400 }
      );
    }

    // Process file upload
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await uploadToGoogleDrive({
      originalname: file.name,
      buffer,
      mimetype: file.type,
    });

    if (!uploadResult?.webViewLink || !uploadResult?.fileId) {
      throw new Error(
        "Failed to upload file to Google Drive - no URL or file ID returned"
      );
    }

    // Save to database
    const gallery = await prisma.gallery.create({
      data: {
        title,
        imageUrl: uploadResult.webViewLink,
        googleDriveFileId: uploadResult.fileId,
        userId,
      },
      select: {
        id: true,
        title: true,
        imageUrl: true,
      },
    });

    return NextResponse.json(gallery, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Internal server error during gallery creation",
      },
      { status: 500 }
    );
  }
}
