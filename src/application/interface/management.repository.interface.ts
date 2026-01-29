import type {
  BaseFilter,
  BasePagination,
  BasePaginationResult,
} from "./base.repository.interface";
import type {
  Management,
  ManagementServerData,
} from "@/domain/entities/management.entity";
import type { Department, Position } from "@/domain/enums";

// Extend the base interface for Management entity
export interface IManagementRepository {
  /** Find all managements */
  findAll(): Promise<Management[]>;

  /** Find a management by ID */
  findById(id: string): Promise<Management | null>;

  /** Find managements with filters and pagination */
  findMany(
    filters?: ManagementFilters,
    pagination?: BasePagination,
  ): Promise<{ records: Management[]; pagination: BasePaginationResult }>;

  /** Find management by user ID and period ID */
  findByUserAndPeriod(
    userId: string,
    periodId: string,
  ): Promise<Management | null>;

  /** Find management by position and department in a period */
  findByPositionAndDepartment(
    position: Position,
    department: Department,
    periodId: string,
  ): Promise<Management | null>;

  /** Create a new management */
  create(data: ManagementServerData): Promise<Management>;

  /** Update an existing management */
  update(id: string, data: ManagementServerData): Promise<Management>;

  /** Delete a management */
  delete(id: string): Promise<void>;

  /** Count managements with optional filter */
  count(where?: BaseFilter): Promise<number>;

  /** Update management photo */
  updatePhoto(id: string, photo: string): Promise<Management>;
}

// Filter types for Management queries
export interface ManagementFilters extends BaseFilter {
  department?: Department;
  position?: Position;
  periodId?: string;
  search?: string;
  userId?: string;
}
