import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { UpdateLetterInput } from "@/types/letter";
import { getCurrentUser } from "@/lib/auth";
import { ApprovalType } from "@/types/enums";
import { StatusApproval } from "@/types/approval-enums";
import type { Prisma } from "@prisma/client";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const letter = await prisma.letter.findUnique({
      where: { id: params.id },
      include: {
        period: true,
        event: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        attachments: {
          select: {
            id: true,
            name: true,
            document: true,
          },
        },
        approvals: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!letter) {
      return NextResponse.json({ error: "Letter not found" }, { status: 404 });
    }

    return NextResponse.json(letter);
  } catch (error) {
    console.error("Error fetching letter:", error);
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

    const body: UpdateLetterInput = await request.json();

    const updateData: Prisma.LetterUpdateInput = {};

    if (body.number !== undefined) updateData.number = body.number;
    if (body.regarding !== undefined) updateData.regarding = body.regarding;
    if (body.origin !== undefined) updateData.origin = body.origin;
    if (body.destination !== undefined) {
      updateData.destination = body.destination;
    }
    if (body.date !== undefined) {
      updateData.date = new Date(body.date);
    }
    if (body.type !== undefined) {
      updateData.type = body.type;
    }
    if (body.priority !== undefined) {
      updateData.priority = body.priority;
    }
    if (body.body !== undefined) updateData.body = body.body;
    if (body.letter !== undefined) updateData.letter = body.letter;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.approvedById !== undefined) {
      updateData.approvedBy = body.approvedById
        ? { connect: { id: body.approvedById } }
        : { disconnect: true };
    }
    if (body.periodId !== undefined) {
      updateData.period = body.periodId
        ? { connect: { id: body.periodId } }
        : { disconnect: true };
    }
    if (body.eventId !== undefined) {
      updateData.event = body.eventId
        ? { connect: { id: body.eventId } }
        : { disconnect: true };
    }
    if (body.status !== undefined) updateData.status = body.status;

    // Handle status change to PENDING - create approval record
    if (body.status === "PENDING") {
      // Check if approval already exists for this letter
      const existingApproval = await prisma.approval.findFirst({
        where: {
          entityType: ApprovalType.LETTER,
          entityId: params.id,
        },
      });

      if (!existingApproval) {
        // Create approval record for the letter if it doesn't exist
        await prisma.approval.create({
          data: {
            entityType: ApprovalType.LETTER,
            entityId: params.id,
            userId: user.id,
            status: StatusApproval.PENDING,
            note: "Letter submitted for approval",
          },
        });
      } else {
        // Update existing approval status to PENDING
        await prisma.approval.update({
          where: { id: existingApproval.id },
          data: {
            status: StatusApproval.PENDING,
          },
        });
      }
    }

    const letter = await prisma.letter.update({
      where: { id: params.id },
      data: updateData,
      include: {
        period: true,
        event: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        attachments: {
          select: {
            id: true,
            name: true,
            document: true,
          },
        },
        approvals: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(letter);
  } catch (error) {
    console.error("Error updating letter:", error);
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

    await prisma.letter.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Letter deleted successfully" });
  } catch (error) {
    console.error("Error deleting letter:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
