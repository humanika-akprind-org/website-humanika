import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import type { User } from "@/types/user";
import {
  getDocumentTypes,
  createDocumentType,
} from "@/services/document/document-type.service";

export async function GET(_request: NextRequest) {
  try {
    // Temporarily remove authentication check to allow public access
    // const user = await getCurrentUser();
    // if (!user) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const documentTypes = await getDocumentTypes();

    return NextResponse.json(documentTypes);
  } catch (error) {
    console.error("Error fetching document types:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const typedUser = user as User;

    const body = await request.json();

    // Validate required fields
    if (!body.name || body.name.trim() === "") {
      return NextResponse.json(
        { error: "Document type name is required" },
        { status: 400 }
      );
    }

    const documentType = await createDocumentType(body, typedUser);

    return NextResponse.json(documentType, { status: 201 });
  } catch (error) {
    console.error("Error creating document type:", error);

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
