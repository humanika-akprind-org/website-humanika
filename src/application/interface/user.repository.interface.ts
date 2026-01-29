import type {
  BaseFilter,
  BasePagination,
  BasePaginationResult,
} from "./base.repository.interface";
import type {
  User,
  CreateUserData,
  UpdateUserData,
} from "@/domain/entities/user.entity";

// User-specific repository interface
export interface IUserRepository {
  /** Find all users */
  findAll(): Promise<User[]>;

  /** Find a user by ID */
  findById(id: string): Promise<User | null>;

  /** Find users with filters and pagination */
  findMany(
    filters?: UserFilter,
    pagination?: BasePagination,
  ): Promise<{ records: User[]; pagination: BasePaginationResult }>;

  /** Create a user */
  create(data: CreateUserData): Promise<User>;

  /** Update an existing user */
  update(id: string, data: UpdateUserData): Promise<User>;

  /** Delete a user */
  delete(id: string): Promise<void>;

  /** Count users with optional filter */
  count(where?: BaseFilter): Promise<number>;

  /** Change user password */
  changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void>;

  /** Delete user account (soft delete) */
  deleteAccount(userId: string): Promise<void>;

  /** Bulk verify users */
  bulkVerifyUsers(userIds: string[]): Promise<{ count: number }>;

  /** Get users for verification */
  getUsersForVerification(
    userIds: string[],
  ): Promise<Array<{ id: string; email: string; name: string }>>;
}

// Filter types for User queries
export interface UserFilter extends BaseFilter {
  search?: string;
  role?: string;
  department?: string;
  isActive?: boolean;
  verifiedAccount?: boolean;
  allUsers?: boolean;
  excludeUserId?: string;
}
