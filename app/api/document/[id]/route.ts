import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { UpdateDocumentInput } from "@/types/document";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const document = await prisma.document.findUnique({
      where: { id: params.id },
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

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error("Error fetching document:", error);
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

    const body: UpdateDocumentInput = await request.json();

    // Check if document exists
    const existingDocument = await prisma.document.findUnique({
      where: { id: params.id },
    });

    if (!existingDocument) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.eventId !== undefined) updateData.eventId = body.eventId;
    if (body.letterId !== undefined) updateData.letterId = body.letterId;
    if (body.type) updateData.type = body.type;
    if (body.document !== undefined) updateData.document = body.document;
    if (body.status) updateData.status = body.status;

    // Handle status change to PENDING - create approval record
    if (body.status === "PENDING") {
      // Check if approval already exists for this document
      const existingApproval = await prisma.approval.findFirst({
        where: {
          entityType: "DOCUMENT",
          entityId: params.id,
        },
      });

      if (!existingApproval) {
        // Create approval record for the document if it doesn't exist
        await prisma.approval.create({
          data: {
            entityType: "DOCUMENT",
            entityId: params.id,
            userId: user.id,
            status: "PENDING",
            note: "Document submitted for approval",
          },
        });
      } else {
        // Update existing approval status to PENDING
        await prisma.approval.update({
          where: { id: existingApproval.id },
          data: {
            status: "PENDING",
          },
        });
      }
    }

    const document = await prisma.document.update({
      where: { id: params.id },
      data: updateData,
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

    return NextResponse.json(document);
  } catch (error) {
    console.error("Error updating document:", error);
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

    // Check if document exists
    const existingDocument = await prisma.document.findUnique({
      where: { id: params.id },
    });

    if (!existingDocument) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    await prisma.document.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
