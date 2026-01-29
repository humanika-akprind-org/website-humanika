/**
 * Create Letter Approval Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";

/**
 * Create an approval record for a letter
 */
export async function createLetterApproval(
  letterId: string,
  userId: string,
  note: string,
): Promise<void> {
  await prisma.approval.create({
    data: {
      entityType: "LETTER",
      entityId: letterId,
      userId,
      status: "PENDING",
      note,
    },
  });
}
