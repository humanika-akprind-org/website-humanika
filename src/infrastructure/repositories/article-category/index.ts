/**
 * Article Category Repository Index - Barrel exports
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This file re-exports all article category repository functions and types
 * for convenient imports throughout the application.
 */

// Export types
export type { ArticleCategory } from "@/domain/value-objects/article-category";

// Export functions
export * from "./get-article-categories.repository";
export * from "./get-article-category-by-id.repository";
export * from "./create-article-category.repository";
export * from "./update-article-category.repository";
export * from "./delete-article-category.repository";
