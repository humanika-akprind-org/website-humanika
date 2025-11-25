import { prisma } from "@/lib/prisma";
import type { Status } from "@/types/enums";
import { StatusApproval } from "@prisma/client";

export async function updateEntityStatus(
  approval: {
    entityType: string;
    entityId: string;
    workProgram?: { id: string } | null;
    event?: { id: string } | null;
    finance?: { id: string } | null;
    document?: { id: string } | null;
    letter?: { id: string } | null;
  },
  approvalStatus: StatusApproval
) {
  const { entityType, entityId } = approval;

  switch (entityType) {
    case "WORK_PROGRAM":
      if (approval.workProgram) {
        let newStatus: string;
        switch (approvalStatus) {
          case StatusApproval.APPROVED:
            newStatus = "PUBLISH";
            break;
          case StatusApproval.REJECTED:
            newStatus = "DRAFT";
            break;
          case StatusApproval.CANCELLED:
            newStatus = "DRAFT";
            break;
          default:
            newStatus = "DRAFT";
        }
        await prisma.workProgram.update({
          where: { id: entityId },
          data: { status: newStatus as Status },
        });
      }
      break;

    case "EVENT":
      if (approval.event) {
        let newStatus: string;
        switch (approvalStatus) {
          case StatusApproval.APPROVED:
            newStatus = "PUBLISH";
            break;
          case StatusApproval.REJECTED:
            newStatus = "DRAFT";
            break;
          case StatusApproval.CANCELLED:
            newStatus = "DRAFT";
            break;
          default:
            newStatus = "DRAFT";
        }
        await prisma.event.update({
          where: { id: entityId },
          data: { status: newStatus as Status },
        });
      }
      break;

    case "FINANCE":
      if (approval.finance) {
        let newStatus: string;
        switch (approvalStatus) {
          case StatusApproval.APPROVED:
            newStatus = "PUBLISH";
            break;
          case StatusApproval.REJECTED:
            newStatus = "DRAFT";
            break;
          case StatusApproval.CANCELLED:
            newStatus = "DRAFT";
            break;
          default:
            newStatus = "DRAFT";
        }
        await prisma.finance.update({
          where: { id: entityId },
          data: { status: newStatus as Status },
        });
      }
      break;

    case "DOCUMENT":
      if (approval.document) {
        let newStatus: string;
        switch (approvalStatus) {
          case StatusApproval.APPROVED:
            newStatus = "PUBLISH";
            break;
          case StatusApproval.REJECTED:
            newStatus = "DRAFT";
            break;
          case StatusApproval.CANCELLED:
            newStatus = "DRAFT";
            break;
          default:
            newStatus = "DRAFT";
        }
        await prisma.document.update({
          where: { id: entityId },
          data: { status: newStatus as Status },
        });
      }
      break;

    case "LETTER":
      if (approval.letter) {
        let newStatus: string;
        switch (approvalStatus) {
          case StatusApproval.APPROVED:
            newStatus = "PUBLISH";
            break;
          case StatusApproval.REJECTED:
            newStatus = "DRAFT";
            break;
          case StatusApproval.CANCELLED:
            newStatus = "DRAFT";
            break;
          default:
            newStatus = "DRAFT";
        }
        await prisma.letter.update({
          where: { id: entityId },
          data: { status: newStatus as Status },
        });
      }
      break;

    default:
      console.log(`No status update logic for entity type: ${entityType}`);
  }
}
