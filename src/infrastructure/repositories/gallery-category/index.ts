/**
 * Gallery Category Repository Index - Barrel exports
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This file re-exports all gallery category repository functions and types
 * for convenient imports throughout the application.
 */

// Export class-based repository
export { GalleryCategoryRepositoryPrisma } from "./gallery-category-repository-prisma";

// Export functions
export * from "./get-gallery-categories.repository";
export * from "./get-gallery-category-by-id.repository";
export * from "./create-gallery-category.repository";
export * from "./update-gallery-category.repository";
export * from "./delete-gallery-category.repository";
