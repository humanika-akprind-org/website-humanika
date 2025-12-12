import { Status } from "./enums";
import { User } from "./user";
import { Period } from "./period";
import { ArticleCategory } from "./article-category";

export interface Article {
  id: string;
  title: string;
  slug: string;
  thumbnail?: string | null;
  content: string;
  authorId: string;
  author: User;
  categoryId: string;
  category: ArticleCategory;
  periodId?: string | null;
  period?: Period | null;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
  relatedArticles?: Article[];
}

export interface CreateArticleInput {
  title: string;
  thumbnail?: string | null;
  content: string;
  authorId: string;
  categoryId: string;
  periodId?: string;
}

export interface UpdateArticleInput extends Partial<CreateArticleInput> {
  status?: Status;
}

export interface ArticleFilter {
  status?: Status;
  periodId?: string;
  categoryId?: string;
  authorId?: string;
  search?: string;
}
