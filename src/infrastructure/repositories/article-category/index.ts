/**
 * Article Category Repository Index - Barrel exports
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This file re-exports all article category repository functions and types
 * for convenient imports throughout the application.
 */

// Export functions
export * from "../article-category/get-article-categories.repository";
export * from "../article-category/get-article-category-by-id.repository";
export * from "../article-category/create-article-category.repository";
export * from "../article-category/update-article-category.repository";
export * from "../article-category/delete-article-category.repository";

// Export types
export type { ArticleCategory } from "@/domain/value-objects/article-category";

// Export class (for use case pattern)
export { ArticleCategoryRepositoryPrisma } from "./article-category-repository-prisma";
