/**
 * Get Letter By ID Repository - Read operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { LetterWithRelations } from "./get-letters.repository";

/**
 * Get a single letter by ID
 */
export async function getLetter(
  id: string,
): Promise<LetterWithRelations | null> {
  const letter = await prisma.letter.findUnique({
    where: { id },
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

  return letter;
}
