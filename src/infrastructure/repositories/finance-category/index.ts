/**
 * Finance Category Repository Index - Barrel exports
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This file re-exports all finance category repository functions and types
 * for convenient imports throughout the application.
 */

// Export types
export type { GetFinanceCategoriesFilter } from "./get-finance-categories.repository";

// Export repository classes
export { FinanceCategoryRepositoryPrisma } from "./finance-category-repository-prisma";

// Export functions
export * from "./get-finance-categories.repository";
export * from "./get-finance-category-by-id.repository";
export * from "./create-finance-category.repository";
export * from "./update-finance-category.repository";
export * from "./delete-finance-category.repository";
