import prisma from "@/presentation/lib/prisma";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { User } from "@/domain/entities/user.entity";

type UserWithId = Pick<User, "id">;

export const deleteDocument = async (id: string, user: UserWithId) => {
  // Check if document exists
  const existingDocument = await prisma.document.findUnique({
    where: { id },
  });

  if (!existingDocument) {
    throw new Error("Document not found");
  }

  await prisma.document.delete({
    where: { id },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.DELETE,
    entityType: "Document",
    entityId: id,
    description: `Deleted document: ${existingDocument.name}`,
    metadata: {
      oldData: {
        name: existingDocument.name,
        documentTypeId: existingDocument.documentTypeId,
        status: existingDocument.status,
        letterId: existingDocument.letterId,
      },
      newData: null,
    },
  });
};
