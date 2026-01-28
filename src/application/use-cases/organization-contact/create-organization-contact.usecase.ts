/**
 * Create Organization Contact Use Case - Complex write operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles creating organization contacts with:
 * - Input validation
 * - Duplicate checking
 * - Activity logging
 *
 * Use this for complex write operations that require business logic.
 */

import type { IOrganizationContactRepository } from "@/application/interface/organization-contact.repository.interface";
import type {
  CreateOrganizationContactInput,
  OrganizationContact,
} from "@/domain/entities/organization-contact.entity";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

type UserWithId = Pick<{ id: string }, "id">;

export class CreateOrganizationContactUseCase {
  constructor(
    private organizationContactRepo: IOrganizationContactRepository,
  ) {}

  /**
   * Execute the use case to create a new organization contact
   *
   * @param input - Validated organization contact input data
   * @param user - The user creating the organization contact
   * @returns The created organization contact
   */
  async execute(
    input: CreateOrganizationContactInput,
    user: UserWithId,
  ): Promise<OrganizationContact> {
    // 1. Validate input
    this.validateInput(input);

    // 2. Check for duplicates (same period)
    await this.checkDuplicate(input);

    // 3. Create the organization contact
    const organizationContact = await this.organizationContactRepo.create(
      input,
      user.id,
    );

    // 4. Log activity
    await this.logCreation(user, organizationContact);

    return organizationContact;
  }

  /**
   * Validate required fields for organization contact creation
   */
  private validateInput(input: CreateOrganizationContactInput): void {
    const errors: string[] = [];

    if (!input.vision || input.vision.trim() === "") {
      errors.push("Vision is required");
    }

    if (!input.mission) {
      errors.push("Mission is required");
    }

    if (!input.email || input.email.trim() === "") {
      errors.push("Email is required");
    }

    if (!input.address || input.address.trim() === "") {
      errors.push("Address is required");
    }

    if (!input.periodId || input.periodId.trim() === "") {
      errors.push("Period ID is required");
    }

    // Validate email format
    if (input.email && !this.isValidEmail(input.email)) {
      errors.push("Invalid email format");
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }
  }

  /**
   * Simple email validation
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Check for duplicate organization contact (same period)
   */
  private async checkDuplicate(
    input: CreateOrganizationContactInput,
  ): Promise<void> {
    const existingContact = await this.organizationContactRepo.findByPeriodId(
      input.periodId,
    );
    if (existingContact) {
      throw new Error("An organization contact for this period already exists");
    }
  }

  /**
   * Log the organization contact creation activity
   */
  private async logCreation(
    user: UserWithId,
    organizationContact: OrganizationContact,
  ): Promise<void> {
    await logActivity({
      userId: user.id,
      activityType: ActivityType.CREATE,
      entityType: "OrganizationContact",
      entityId: organizationContact.id,
      description: `Created organization contact for period`,
      metadata: {
        newData: {
          vision: organizationContact.vision,
          mission: organizationContact.mission,
          email: organizationContact.email,
          address: organizationContact.address,
          periodId: organizationContact.periodId,
        },
      },
    });
  }
}
