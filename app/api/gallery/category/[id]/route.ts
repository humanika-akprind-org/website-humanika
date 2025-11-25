import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  getGalleryCategory,
  updateGalleryCategory,
  deleteGalleryCategory,
} from "@/services/gallery/gallery-category.service";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Temporarily remove authentication check to allow public access
    // const user = await getCurrentUser();
    // if (!user) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const categoryId = params.id;

    if (!categoryId) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    const category = await getGalleryCategory(categoryId);

    if (!category) {
      return NextResponse.json(
        { error: "Gallery category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching gallery category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const categoryId = params.id;

    if (!categoryId) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.name || body.name.trim() === "") {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    const category = await updateGalleryCategory(categoryId, body, user);

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating gallery category:", error);

    if (
      error instanceof Error &&
      error.message === "Gallery category not found"
    ) {
      return NextResponse.json(
        { error: "Gallery category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const categoryId = params.id;

    if (!categoryId) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    await deleteGalleryCategory(categoryId, user);

    return NextResponse.json({
      message: "Gallery category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting gallery category:", error);

    if (
      error instanceof Error &&
      error.message === "Gallery category not found"
    ) {
      return NextResponse.json(
        { error: "Gallery category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
