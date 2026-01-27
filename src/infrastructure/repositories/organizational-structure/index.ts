/**
 * Organizational Structure Repository Index - Barrel exports
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This file re-exports all organizational structure repository functions and types
 * for convenient imports throughout the application.
 */

// Export types
export type { GetStructuresFilter } from "./get-structures.repository";

// Export functions
export * from "./get-structures.repository";
export * from "./get-structure-by-id.repository";
export * from "./create-structure.repository";
export * from "./update-structure.repository";
export * from "./delete-structure.repository";
