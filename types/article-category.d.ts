export interface ArticleCategory {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    articles: number;
  };
}

export interface CreateArticleCategoryInput {
  name: string;
}

export interface UpdateArticleCategoryInput extends Partial<CreateArticleCategoryInput> {}
