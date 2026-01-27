/**
 * Event Repository Index - Barrel exports
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This file re-exports all event repository functions and classes
 * for convenient imports throughout the application.
 */

// Export functions (for direct use - simple endpoints)
export * from "./get-events.repository";
export * from "./get-event.repository";
export * from "./get-event-by-slug.repository";
export * from "./create-event.repository";
export * from "./update-event.repository";
export * from "./delete-event.repository";

// Export class (for use case pattern)
export * from "./event-repository-prisma";
