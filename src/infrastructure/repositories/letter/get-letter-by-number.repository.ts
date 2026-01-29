/**
 * Get Letter By Number Repository - Read operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { LetterWithRelations } from "./get-letters.repository";

/**
 * Get a single letter by number
 */
export async function getLetterByNumber(
  number: string,
): Promise<LetterWithRelations | null> {
  const letter = await prisma.letter.findUnique({
    where: { number },
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
