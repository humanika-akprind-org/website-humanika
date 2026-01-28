/**
 * Task Department Repository Index - Barrel exports
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This file re-exports all task department repository functions and types
 * for convenient imports throughout the application.
 */

// Export types
export type { DepartmentTaskFilter } from "./get-department-tasks.repository";

// Export class-based repository
export { TaskDepartmentRepositoryPrisma } from "./task-department-repository-prisma";

// Export functions (legacy)
export * from "./get-department-tasks.repository";
export * from "./get-department-task-by-id.repository";
export * from "./create-department-task.repository";
export * from "./update-department-task.repository";
export * from "./delete-department-task.repository";
