/**
 * Event Category Repository Index - Barrel exports
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This file re-exports all event category repository functions
 * for convenient imports throughout the application.
 */

// Export functions
export * from "./get-event-categories.repository";
export * from "./get-event-category-by-id.repository";
export * from "./create-event-category.repository";
export * from "./update-event-category.repository";
export * from "./delete-event-category.repository";

// Export class (for use case pattern)
export { EventCategoryRepositoryPrisma } from "./event-category-repository-prisma";
