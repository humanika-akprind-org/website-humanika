/**
 * Create Letter Use Case - Complex write operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles creating letters with:
 * - Input validation
 * - Duplicate checking (if needed)
 * - Approval record creation
 * - Activity logging
 *
 * Use this for complex write operations that require business logic.
 */

import type { ILetterRepository } from "@/application/interface/letter.repository.interface";
import type {
  CreateLetterInput,
  Letter,
} from "@/domain/entities/letter.entity";
import type { User } from "@/domain/entities/user.entity";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType, Status } from "@/domain/enums";

type UserWithId = Pick<User, "id">;

export class CreateLetterUseCase {
  constructor(private letterRepo: ILetterRepository) {}

  /**
   * Execute the use case to create a new letter
   *
   * @param input - Validated letter input data
   * @param user - The user creating the letter
   * @returns The created letter
   */
  async execute(input: CreateLetterInput, user: UserWithId): Promise<Letter> {
    // 1. Validate input
    this.validateInput(input);

    // 2. Check for duplicates (e.g., same number)
    await this.checkDuplicate(input);

    // 3. Create the letter
    const letter = await this.letterRepo.create(input, user.id);

    // 4. Create approval record if status is PENDING
    if (input.status === Status.PENDING) {
      await this.letterRepo.createApproval(
        letter.id,
        user.id,
        "Letter submitted for approval",
      );
    }

    // 5. Log activity
    await this.logCreation(user, letter);

    return letter;
  }

  /**
   * Validate required fields for letter creation
   */
  private validateInput(input: CreateLetterInput): void {
    const errors: string[] = [];

    if (!input.regarding || input.regarding.trim() === "") {
      errors.push("Regarding is required");
    }

    if (!input.origin || input.origin.trim() === "") {
      errors.push("Origin is required");
    }

    if (!input.destination || input.destination.trim() === "") {
      errors.push("Destination is required");
    }

    if (!input.date) {
      errors.push("Date is required");
    }

    if (!input.type) {
      errors.push("Type is required");
    }

    if (!input.priority) {
      errors.push("Priority is required");
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }
  }

  /**
   * Check for duplicate letters (same number)
   */
  private async checkDuplicate(input: CreateLetterInput): Promise<void> {
    if (input.number) {
      const existingLetter = await this.letterRepo.findByNumber(input.number);
      if (existingLetter) {
        throw new Error("A letter with this number already exists");
      }
    }
  }

  /**
   * Log the letter creation activity
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
   * Log the creation activity
   */
  private async logCreation(user: UserWithId, letter: Letter): Promise<void> {
    await this.logActivity(
      user.id,
      ActivityType.CREATE,
      "Letter",
      letter.id,
      `Created letter: ${letter.regarding}`,
      {
        newData: {
          regarding: letter.regarding,
          number: letter.number,
          origin: letter.origin,
          destination: letter.destination,
          type: letter.type,
          priority: letter.priority,
          status: letter.status,
          periodId: letter.periodId,
          eventId: letter.eventId,
        },
      },
    );
  }
}
