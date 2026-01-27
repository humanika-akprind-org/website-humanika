import type { IArticleCategoryRepository } from "@/application/interface/article-category.repository.interface";

/**
 * Article Category with count interface
 */
interface CategoryWithCount {
  id: string;
  _count: {
    articles: number;
  };
}

/**
 * Delete Article Category Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for deleting article categories with validation.
 */
export class DeleteArticleCategoryUseCase {
  constructor(
    private readonly categoryRepository: IArticleCategoryRepository,
  ) {}

  /**
   * Execute the use case
   * @param id - The ID of the category to delete
   * @param userId - User ID for logging
   * @returns Promise resolving when deletion is complete
   */
  async execute(id: string, _userId: string): Promise<void> {
    // Validate ID parameter
    if (!id || id.trim() === "") {
      throw new Error("Category ID is required");
    }

    // Check if category exists
    const category = await this.categoryRepository.getArticleCategoryById(
      id.trim(),
    );
    if (!category) {
      throw new Error("Article category not found");
    }

    // Check if category is being used by articles
    const categoriesWithCount =
      await this.categoryRepository.getArticleCategoriesWithCount();
    const categoryWithCount = categoriesWithCount.find((c) => c.id === id);
    const categoryCount = (categoryWithCount as CategoryWithCount | undefined)
      ?._count?.articles;
    if (categoryCount && categoryCount > 0) {
      throw new Error("Cannot delete category that is being used by articles");
    }

    // Execute repository call
    await this.categoryRepository.deleteCategory(id.trim());
  }
}
