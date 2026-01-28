/**
 * Get Letter By ID Use Case - Single read operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles fetching a single letter by ID.
 */

import type { ILetterRepository } from "@/application/interface/letter.repository.interface";
import type { Letter } from "@/domain/entities/letter.entity";

export class GetLetterByIdUseCase {
  constructor(private letterRepo: ILetterRepository) {}

  /**
   * Execute the use case to get a letter by ID
   *
   * @param id - The letter ID
   * @returns The letter or null if not found
   */
  async execute(id: string): Promise<Letter | null> {
    const letter = await this.letterRepo.findById(id);

    if (!letter) {
      throw new Error("Letter not found");
    }

    return letter;
  }
}
