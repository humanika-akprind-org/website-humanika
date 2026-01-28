/**
 * Update Letter Use Case - Complex write operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles updating letters with:
 * - Input validation
 * - Existence checking
 * - Activity logging
 */

import type { ILetterRepository } from "@/application/interface/letter.repository.interface";
import type {
  UpdateLetterInput,
  Letter,
} from "@/domain/entities/letter.entity";
import type { User } from "@/domain/entities/user.entity";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

type UserWithId = Pick<User, "id">;

export class UpdateLetterUseCase {
  constructor(private letterRepo: ILetterRepository) {}

  /**
   * Execute the use case to update a letter
   *
   * @param id - The letter ID
   * @param input - Validated letter input data
   * @param user - The user updating the letter
   * @returns The updated letter
   */
  async execute(
    id: string,
    input: UpdateLetterInput,
    user: UserWithId,
  ): Promise<Letter> {
    // 1. Check if letter exists
    const existingLetter = await this.letterRepo.findById(id);
    if (!existingLetter) {
      throw new Error("Letter not found");
    }

    // 2. Validate input
    this.validateInput(input);

    // 3. Check for duplicate number if changing
    if (input.number && input.number !== existingLetter.number) {
      await this.checkDuplicate(input.number, id);
    }

    // 4. Update the letter
    const letter = await this.letterRepo.update(id, input);

    // 5. Log activity
    await this.logUpdate(user, letter, existingLetter);

    return letter;
  }

  /**
   * Validate input fields
   */
  private validateInput(input: UpdateLetterInput): void {
    if (input.regarding !== undefined && input.regarding.trim() === "") {
      throw new Error("Regarding cannot be empty");
    }
  }

  /**
   * Check for duplicate letter numbers
   */
  private async checkDuplicate(
    number: string,
    excludeId: string,
  ): Promise<void> {
    const existingLetter = await this.letterRepo.findByNumber(number);
    if (existingLetter && existingLetter.id !== excludeId) {
      throw new Error("A letter with this number already exists");
    }
  }

  /**
   * Log the letter update activity
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
   * Log the update activity
   */
  private async logUpdate(
    user: UserWithId,
    letter: Letter,
    previousLetter: Letter,
  ): Promise<void> {
    await this.logActivity(
      user.id,
      ActivityType.UPDATE,
      "Letter",
      letter.id,
      `Updated letter: ${letter.regarding}`,
      {
        previousData: {
          regarding: previousLetter.regarding,
          number: previousLetter.number,
          status: previousLetter.status,
        },
        newData: {
          regarding: letter.regarding,
          number: letter.number,
          status: letter.status,
        },
      },
    );
  }
}
