/**
 * Update Organization Contact Use Case - Complex write operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles updating organization contacts with:
 * - Input validation
 * - Email format validation
 * - Activity logging
 *
 * Use this for complex write operations that require business logic.
 */

import type { IOrganizationContactRepository } from "@/application/interface/organization-contact.repository.interface";
import type {
  UpdateOrganizationContactInput,
  OrganizationContact,
} from "@/domain/entities/organization-contact.entity";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

import type { User } from "@/domain/entities/user.entity";

type UserWithId = Pick<User, "id">;

export class UpdateOrganizationContactUseCase {
  constructor(
    private organizationContactRepo: IOrganizationContactRepository,
  ) {}

  /**
   * Execute the use case to update an organization contact
   *
   * @param id - Organization contact ID
   * @param input - Validated organization contact update data
   * @param user - The user updating the organization contact
   * @returns The updated organization contact
   */
  async execute(
    id: string,
    input: UpdateOrganizationContactInput,
    user: UserWithId,
  ): Promise<OrganizationContact> {
    // 1. Validate input
    this.validateInput(input);

    // 2. Check if organization contact exists
    const existingContact = await this.organizationContactRepo.findById(id);
    if (!existingContact) {
      throw new Error("Organization contact not found");
    }

    // 3. Update the organization contact
    const organizationContact = await this.organizationContactRepo.update(
      id,
      input,
      user.id,
    );

    // 4. Log activity
    await this.logUpdate(user, existingContact, organizationContact);

    return organizationContact;
  }

  /**
   * Validate optional fields for organization contact update
   */
  private validateInput(input: UpdateOrganizationContactInput): void {
    const errors: string[] = [];

    // Validate email format if provided
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
   * Log the organization contact update activity
   */
  private async logUpdate(
    user: UserWithId,
    oldContact: OrganizationContact,
    newContact: OrganizationContact,
  ): Promise<void> {
    await logActivity({
      userId: user.id,
      activityType: ActivityType.UPDATE,
      entityType: "OrganizationContact",
      entityId: newContact.id,
      description: `Updated organization contact for period`,
      metadata: {
        oldData: {
          vision: oldContact.vision,
          mission: oldContact.mission,
          email: oldContact.email,
          address: oldContact.address,
          periodId: oldContact.periodId,
        },
        newData: {
          vision: newContact.vision,
          mission: newContact.mission,
          email: newContact.email,
          address: newContact.address,
          periodId: newContact.periodId,
        },
      },
    });
  }
}
