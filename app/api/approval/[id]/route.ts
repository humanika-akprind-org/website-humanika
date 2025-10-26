import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatusApproval } from "@/types/approval-enums"
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { status, note } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    // Get the approval to check current status and entity type
    const existingApproval = await prisma.approval.findUnique({
      where: { id },
      include: {
        workProgram: true,
        event: true,
        finance: true,
        document: true,
        article: true,
        letter: true,
      },
    });

    if (!existingApproval) {
      return NextResponse.json(
        { error: "Approval not found" },
        { status: 404 }
      );
    }

    // Update the approval
    const updatedApproval = await prisma.approval.update({
      where: { id },
      data: {
        status: status as StatusApproval,
        note,
      },
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
        workProgram: {
          select: {
            id: true,
            name: true,
            department: true,
            status: true,
          },
        },
        event: {
          select: {
            id: true,
            name: true,
            department: true,
            status: true,
          },
        },
        finance: {
          select: {
            id: true,
            name: true,
            amount: true,
            type: true,
            status: true,
          },
        },
        document: {
          select: {
            id: true,
            name: true,
            type: true,
            status: true,
          },
        },
        article: {
          select: {
            id: true,
            title: true,
            status: true,
            isPublished: true,
          },
        },
        letter: {
          select: {
            id: true,
            regarding: true,
            type: true,
            status: true,
          },
        },
      },
    });

    // If approval is approved, update the related entity's status
    if (status === StatusApproval.APPROVED) {
      await updateEntityStatus(existingApproval, StatusApproval.APPROVED);
    } else if (status === StatusApproval.REJECTED) {
      await updateEntityStatus(existingApproval, StatusApproval.REJECTED);
    }

    return NextResponse.json(updatedApproval);
  } catch (error) {
    console.error("Error updating approval:", error);
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

    const { id } = params;

    const approval = await prisma.approval.findUnique({
      where: { id },
    });

    if (!approval) {
      return NextResponse.json(
        { error: "Approval not found" },
        { status: 404 }
      );
    }

    await prisma.approval.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Approval deleted successfully" });
  } catch (error) {
    console.error("Error deleting approval:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function updateEntityStatus(
  approval: {
    entityType: string;
    entityId: string;
    workProgram?: { id: string } | null;
    event?: { id: string } | null;
    finance?: { id: string } | null;
    document?: { id: string } | null;
    article?: { id: string } | null;
    letter?: { id: string } | null;
  },
  approvalStatus: StatusApproval
) {
  const { entityType, entityId } = approval;

  switch (entityType) {
    case "WORK_PROGRAM":
      if (approval.workProgram) {
        const newStatus =
          approvalStatus === StatusApproval.APPROVED ? "PUBLISH" : "DRAFT";
        await prisma.workProgram.update({
          where: { id: entityId },
          data: { status: newStatus },
        });
      }
      break;

    case "EVENT":
      if (approval.event) {
        const newStatus =
          approvalStatus === StatusApproval.APPROVED ? "PUBLISH" : "DRAFT";
        await prisma.event.update({
          where: { id: entityId },
          data: { status: newStatus },
        });
      }
      break;

    case "FINANCE":
      if (approval.finance) {
        const newStatus =
          approvalStatus === StatusApproval.APPROVED ? "PUBLISH" : "DRAFT";
        await prisma.finance.update({
          where: { id: entityId },
          data: { status: newStatus },
        });
      }
      break;

    case "DOCUMENT":
      if (approval.document) {
        const newStatus =
          approvalStatus === StatusApproval.APPROVED ? "PUBLISH" : "DRAFT";
        await prisma.document.update({
          where: { id: entityId },
          data: { status: newStatus },
        });
      }
      break;

    case "ARTICLE":
      if (approval.article) {
        const newStatus =
          approvalStatus === StatusApproval.APPROVED ? "PUBLISH" : "DRAFT";
        await prisma.article.update({
          where: { id: entityId },
          data: {
            status: newStatus,
            isPublished: approvalStatus === StatusApproval.APPROVED,
            publishedAt:
              approvalStatus === StatusApproval.APPROVED ? new Date() : null,
          },
        });
      }
      break;

    case "LETTER":
      if (approval.letter) {
        const newStatus =
          approvalStatus === StatusApproval.APPROVED ? "PUBLISH" : "DRAFT";
        await prisma.letter.update({
          where: { id: entityId },
          data: { status: newStatus },
        });
      }
      break;

    default:
      console.log(`No status update logic for entity type: ${entityType}`);
  }
}
