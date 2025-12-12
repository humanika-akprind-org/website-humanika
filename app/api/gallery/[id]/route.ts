import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import {
  getGallery,
  updateGallery,
  deleteGallery,
  type UpdateGalleryInput,
} from "@/services/gallery/gallery.service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const gallery = await getGallery((await params).id);

    if (!gallery) {
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
    }

    return NextResponse.json(gallery);
  } catch (error) {
    console.error("Error fetching gallery:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: UpdateGalleryInput = await request.json();

    const gallery = await updateGallery((await params).id, body, user);

    return NextResponse.json(gallery);
  } catch (error) {
    console.error("Error updating gallery:", error);
    if (error instanceof Error && error.message === "Gallery not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await deleteGallery((await params).id, user);

    return NextResponse.json({ message: "Gallery deleted successfully" });
  } catch (error) {
    console.error("Error deleting gallery:", error);
    if (error instanceof Error && error.message === "Gallery not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
