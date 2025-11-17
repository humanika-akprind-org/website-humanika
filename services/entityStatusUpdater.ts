import { prisma } from "@/lib/prisma";
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
