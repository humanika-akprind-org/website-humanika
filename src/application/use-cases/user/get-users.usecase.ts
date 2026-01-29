/**
 * Get Users Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 */

import type {
  IUserRepository,
  UserFilter,
  User,
} from "@/application/interface/user.repository.interface";

export class GetUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(filter?: UserFilter): Promise<User[]> {
    const sanitizedFilter = this.sanitizeFilter(filter);
    const result = await this.userRepository.getUsers(
      sanitizedFilter || { allUsers: true },
    );
    return result;
  }

  private sanitizeFilter(filter?: UserFilter): UserFilter | undefined {
    if (!filter) return undefined;
    return {
      page:
        typeof filter.page === "number" && filter.page > 0
          ? filter.page
          : undefined,
      limit:
        typeof filter.limit === "number" && filter.limit > 0
          ? filter.limit
          : undefined,
      search: filter.search?.trim() || undefined,
      role: filter.role,
      department: filter.department,
      isActive: filter.isActive,
      verifiedAccount: filter.verifiedAccount,
      allUsers: filter.allUsers,
      excludeUserId: filter.excludeUserId?.trim() || undefined,
    };
  }
}
