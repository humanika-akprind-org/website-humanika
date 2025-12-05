import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import type { User } from "@/types/user";
import {
  getDocumentType,
  updateDocumentType,
  deleteDocumentType,
} from "@/services/document/document-type.service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Temporarily remove authentication check to allow public access
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const documentTypeId = (await params).id;

    if (!documentTypeId) {
      return NextResponse.json(
        { error: "Document type ID is required" },
        { status: 400 }
      );
    }

    const documentType = await getDocumentType(documentTypeId);

    if (!documentType) {
      return NextResponse.json(
        { error: "Document type not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(documentType);
  } catch (error) {
    console.error("Error fetching document type:", error);
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

    const typedUser = user as User;

    const documentTypeId = (await params).id;

    if (!documentTypeId) {
      return NextResponse.json(
        { error: "Document type ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.name || body.name.trim() === "") {
      return NextResponse.json(
        { error: "Document type name is required" },
        { status: 400 }
      );
    }

    const documentType = await updateDocumentType(
      documentTypeId,
      body,
      typedUser
    );

    return NextResponse.json(documentType);
  } catch (error) {
    console.error("Error updating document type:", error);

    if (error instanceof Error && error.message === "Document type not found") {
      return NextResponse.json(
        { error: "Document type not found" },
        { status: 404 }
      );
    }

    if (
      error instanceof Error &&
      error.message === "Document type with this name already exists"
    ) {
      return NextResponse.json(
        { error: "Document type with this name already exists" },
        { status: 409 }
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const typedUser = user as User;

    const documentTypeId = (await params).id;

    if (!documentTypeId) {
      return NextResponse.json(
        { error: "Document type ID is required" },
        { status: 400 }
      );
    }

    await deleteDocumentType(documentTypeId, typedUser);

    return NextResponse.json({
      message: "Document type deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting document type:", error);

    if (error instanceof Error && error.message === "Document type not found") {
      return NextResponse.json(
        { error: "Document type not found" },
        { status: 404 }
      );
    }

    if (
      error instanceof Error &&
      error.message ===
        "Cannot delete document type that is being used by documents"
    ) {
      return NextResponse.json(
        {
          error: "Cannot delete document type that is being used by documents",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
