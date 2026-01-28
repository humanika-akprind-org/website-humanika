/**
 * Delete Organization Contact Use Case - Complex write operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles deleting organization contacts with:
 * - Existence checking
 * - Activity logging
 *
 * Use this for complex write operations that require business logic.
 */

import type { IOrganizationContactRepository } from "@/application/interface/organization-contact.repository.interface";
import type { OrganizationContact } from "@/domain/entities/organization-contact.entity";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

type UserWithId = Pick<{ id: string }, "id">;

export class DeleteOrganizationContactUseCase {
  constructor(
    private organizationContactRepo: IOrganizationContactRepository,
  ) {}

  /**
   * Execute the use case to delete an organization contact
   *
   * @param id - Organization contact ID
   * @param user - The user deleting the organization contact
   */
  async execute(id: string, user: UserWithId): Promise<void> {
    // 1. Check if organization contact exists
    const existingContact = await this.organizationContactRepo.findById(id);
    if (!existingContact) {
      throw new Error("Organization contact not found");
    }

    // 2. Delete the organization contact
    await this.organizationContactRepo.delete(id, user.id);

    // 3. Log activity
    await this.logDeletion(user, existingContact);
  }

  /**
   * Log the organization contact deletion activity
   */
  private async logDeletion(
    user: UserWithId,
    organizationContact: OrganizationContact,
  ): Promise<void> {
    await logActivity({
      userId: user.id,
      activityType: ActivityType.DELETE,
      entityType: "OrganizationContact",
      entityId: organizationContact.id,
      description: `Deleted organization contact for period`,
      metadata: {
        oldData: {
          vision: organizationContact.vision,
          mission: organizationContact.mission,
          email: organizationContact.email,
          address: organizationContact.address,
          periodId: organizationContact.periodId,
        },
        newData: null,
      },
    });
  }
}
