/**
 * Period Repository Index - Barrel exports
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This file re-exports all period repository functions and types
 * for convenient imports throughout the application.
 */

// Export repository class
export { PeriodRepositoryPrisma } from "./period-repository-prisma";

// Export functions
export * from "./get-periods.repository";
export * from "./get-period-by-id.repository";
export * from "./create-period.repository";
export * from "./update-period.repository";
export * from "./delete-period.repository";
