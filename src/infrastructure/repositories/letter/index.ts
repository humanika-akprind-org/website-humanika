/**
 * Letter Repository Index - Barrel exports
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This file re-exports all letter repository functions and types
 * for convenient imports throughout the application.
 */

// Export types
export type {
  LetterFilter,
  LetterWithRelations,
} from "./get-letters.repository";

// Export functions
export * from "./get-letters.repository";
export * from "./get-letter-by-id.repository";
export * from "./create-letter.repository";
export * from "./update-letter.repository";
export * from "./delete-letter.repository";
