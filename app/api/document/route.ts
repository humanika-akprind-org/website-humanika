import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { CreateDocumentInput } from "@/types/document";
import type { Status, DocumentType } from "@/types/enums";
import { getCurrentUser } from "@/lib/auth";
import type {
  Prisma,
  Status as PrismaStatus,
  DocumentType as PrismaDocumentType,
} from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") as DocumentType;
    const status = searchParams.get("status") as unknown as Status;
    const userId = searchParams.get("userId");
    const eventId = searchParams.get("eventId");
    const letterId = searchParams.get("letterId");
    const search = searchParams.get("search");

    const where: Prisma.DocumentWhereInput = {};

    if (type) where.type = { equals: type as unknown as PrismaDocumentType };
    if (status) where.status = { equals: status as unknown as PrismaStatus };
    if (userId) where.userId = userId;
    if (eventId) where.eventId = eventId;
    if (letterId) where.letterId = letterId;
    if (search) {
      where.OR = [{ name: { contains: search, mode: "insensitive" } }];
    }

    const documents = await prisma.document.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        event: {
          select: {
            id: true,
            name: true,
          },
        },
        letter: {
          select: {
            id: true,
            number: true,
            regarding: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
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

    if (!body.name || !body.type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const documentData: Prisma.DocumentCreateInput = {
      name: body.name,
      type: body.type as unknown as PrismaDocumentType,
      document: body.document,
      user: { connect: { id: user.id } },
    };

    if (body.eventId) {
      documentData.event = { connect: { id: body.eventId } };
    }

    if (body.letterId) {
      documentData.letter = { connect: { id: body.letterId } };
    }

    const document = await prisma.document.create({
      data: documentData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        event: {
          select: {
            id: true,
            name: true,
          },
        },
        letter: {
          select: {
            id: true,
            number: true,
            regarding: true,
          },
        },
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
