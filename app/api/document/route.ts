import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { CreateDocumentInput } from "@/types/document";
import type { Status, DocumentType } from "@/types/enums";
import { ApprovalType } from "@/types/enums";
import { getCurrentUser } from "@/lib/auth";
import { StatusApproval } from "@/types/approval-enums";
import type {
  Prisma,
  Status as PrismaStatus,
  DocumentType as PrismaDocumentType,
} from "@prisma/client";
import { logActivityFromRequest } from "@/lib/activity-log";
import { ActivityType } from "@/types/enums";

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
        approvals: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                department: true,
              },
            },
          },
          orderBy: { updatedAt: "desc" },
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
      status: (body.status as unknown as PrismaStatus) || "DRAFT",
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
        approvals: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                department: true,
              },
            },
          },
        },
      },
    });

    // Create initial approval request for the document if status is PENDING
    if (body.status === "PENDING") {
      await prisma.approval.create({
        data: {
          entityType: ApprovalType.DOCUMENT,
          entityId: document.id,
          userId: user.id,
          status: StatusApproval.PENDING,
          note: "Document submitted for approval",
        },
      });
    }

    // Log activity
    await logActivityFromRequest(request, {
      userId: user.id,
      activityType: ActivityType.CREATE,
      entityType: "Document",
      entityId: document.id,
      description: `Created document: ${document.name}`,
      metadata: {
        newData: {
          name: document.name,
          type: document.type,
          status: document.status,
          eventId: document.eventId,
          letterId: document.letterId,
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
