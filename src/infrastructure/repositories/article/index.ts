/**
 * Article Repository Index - Barrel exports
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This file re-exports all article repository functions and types
 * for convenient imports throughout the application.
 */

// Export types
export type { ArticleWithRelatedArticles } from "./get-article-by-slug.repository";
export * from "./get-articles.repository";

// Export functions
export * from "./get-articles.repository";
export * from "./get-article-by-id.repository";
export * from "./get-article-by-slug.repository";
export * from "./create-article.repository";
export * from "./update-article.repository";
export * from "./delete-article.repository";
