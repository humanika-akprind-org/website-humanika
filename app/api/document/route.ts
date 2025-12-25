import { type NextRequest, NextResponse } from "next/server";
import type { CreateDocumentInput } from "@/types/document";
import type { Status } from "@/types/enums";
import { getCurrentUser } from "@/lib/auth-server";
import {
  getDocuments,
  createDocument,
} from "@/services/document/document.service";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const documentTypeId = searchParams.get("documentTypeId");
    const status = searchParams.get("status") as unknown as Status;
    const userId = searchParams.get("userId");
    const letterId = searchParams.get("letterId");
    const search = searchParams.get("search");

    const documents = await getDocuments({
      documentTypeId: documentTypeId || undefined,
      status,
      userId: userId || undefined,
      letterId: letterId || undefined,
      search: search || undefined,
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
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

    const body: CreateDocumentInput = await request.json();

    if (!body.name || !body.documentTypeId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const document = await createDocument(body, user);

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
