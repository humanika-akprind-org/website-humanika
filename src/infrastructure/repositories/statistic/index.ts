/**
 * Statistic Repository Index - Barrel exports
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This file re-exports all statistic repository functions and types
 * for convenient imports throughout the application.
 */

// Export repository class
export { StatisticRepositoryPrisma } from "./statistic-repository-prisma";

// Export types
export type { StatisticFilter } from "@/domain/entities/statistic.entity";

// Export functions
export * from "./get-statistics.repository";
export * from "./get-statistic-by-id.repository";
export * from "./get-statistic-by-period.repository";
export * from "./get-active-period-statistic.repository";
export * from "./create-statistic.repository";
export * from "./update-statistic.repository";
export * from "./delete-statistic.repository";
