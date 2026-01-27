export interface ArticleCategory {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    articles: number;
  };
}

export interface CreateArticleCategoryInput {
  name: string;
  description?: string;
}

export interface UpdateArticleCategoryInput
  extends Partial<CreateArticleCategoryInput> {}
