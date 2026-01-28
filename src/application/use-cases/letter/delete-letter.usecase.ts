/**
 * Delete Letter Use Case - Complex write operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles deleting letters with:
 * - Existence checking
 * - Activity logging
 */

import type { ILetterRepository } from "@/application/interface/letter.repository.interface";
import type { User } from "@/domain/entities/user.entity";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

type UserWithId = Pick<User, "id">;

export class DeleteLetterUseCase {
  constructor(private letterRepo: ILetterRepository) {}

  /**
   * Execute the use case to delete a letter
   *
   * @param id - The letter ID
   * @param user - The user deleting the letter
   * @returns void
   */
  async execute(id: string, user: UserWithId): Promise<void> {
    // 1. Check if letter exists
    const existingLetter = await this.letterRepo.findById(id);
    if (!existingLetter) {
      throw new Error("Letter not found");
    }

    // 2. Store data for logging before deletion
    const letterData = {
      id: existingLetter.id,
      regarding: existingLetter.regarding,
      number: existingLetter.number,
    };

    // 3. Delete the letter
    await this.letterRepo.delete(id);

    // 4. Log activity
    await this.logDeletion(user, letterData);
  }

  /**
   * Log the letter deletion activity
   */
  private async logActivity(
    userId: string,
    activityType: ActivityType,
    entityType: string,
    entityId: string,
    description: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await logActivity({
      userId,
      activityType,
      entityType,
      entityId,
      description,
      metadata,
    });
  }

  /**
   * Log the deletion activity
   */
  private async logDeletion(
    user: UserWithId,
    letterData: { id: string; regarding: string; number?: string | null },
  ): Promise<void> {
    await this.logActivity(
      user.id,
      ActivityType.DELETE,
      "Letter",
      letterData.id,
      `Deleted letter: ${letterData.regarding}`,
      {
        deletedData: {
          id: letterData.id,
          regarding: letterData.regarding,
          number: letterData.number,
        },
      },
    );
  }
}
