import type { Status } from "@prisma/client";
import { type Period } from "./period.entity";
import { type ArticleCategory } from "../value-objects/article-category";

export interface Article {
  viewCount?: number;
  id: string;
  title: string;
  slug: string;
  thumbnail?: string | null;
  content: string;
  authorId: string;
  author?: {
    id: string;
    name: string;
    email: string;
  };
  categoryId?: string | null;
  category?: ArticleCategory | null;
  periodId?: string | null;
  period?: Period | null;
  status: Status | string;
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
