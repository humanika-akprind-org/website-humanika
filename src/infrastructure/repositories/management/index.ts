/**
 * Management Repository Index - Barrel exports
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This file re-exports all management repository functions and types
 * for convenient imports throughout the application.
 */

// Export Prisma repository implementation
export { ManagementRepositoryPrisma } from "./management-repository-prisma";

// Export functions
export * from "./get-managements.repository";
export * from "./get-management-by-id.repository";
export * from "./create-management.repository";
export * from "./update-management.repository";
export * from "./update-management-photo.repository";
export * from "./delete-management.repository";
