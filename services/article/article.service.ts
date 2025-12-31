import prisma from "@/lib/prisma";
import type { CreateArticleInput, UpdateArticleInput } from "@/types/article";
import type { Status } from "@/types/enums";
import { logActivity } from "@/lib/activity-log";
import { ActivityType } from "@/types/enums";
import type { Prisma, Status as PrismaStatus } from "@prisma/client";

type ArticleWithPartialAuthor = Prisma.ArticleGetPayload<{
  include: {
    author: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
    category: true;
    period: true;
  };
}>;

export async function getArticles(filter?: {
  status?: Status;
  periodId?: string;
  categoryId?: string;
  authorId?: string;
  search?: string;
}): Promise<ArticleWithPartialAuthor[]> {
  const where: Prisma.ArticleWhereInput = {};

  if (filter?.status) {
    where.status = { equals: filter.status as unknown as PrismaStatus };
  }
  if (filter?.periodId) where.periodId = filter.periodId;
  if (filter?.categoryId) where.categoryId = filter.categoryId;
  if (filter?.authorId) where.authorId = filter.authorId;
  if (filter?.search) {
    where.OR = [
      { title: { contains: filter.search, mode: "insensitive" } },
      { content: { contains: filter.search, mode: "insensitive" } },
    ];
  }

  return await prisma.article.findMany({
    where,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      category: true,
      period: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createArticle(
  data: CreateArticleInput,
  user: { id: string }
): Promise<ArticleWithPartialAuthor> {
  // Generate slug from title
  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const articleData: Prisma.ArticleCreateInput = {
    title: data.title,
    slug,
    thumbnail: data.thumbnail,
    content: data.content,
    author: { connect: { id: data.authorId } },
    category: { connect: { id: data.categoryId } },
  };

  // Only include periodId if it's provided and not empty
  if (data.periodId && data.periodId.trim() !== "") {
    articleData.period = { connect: { id: data.periodId } };
  }

  const article = await prisma.article.create({
    data: articleData,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      category: true,
      period: true,
    },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.CREATE,
    entityType: "Article",
    entityId: article.id,
    description: `Created article: ${article.title}`,
    metadata: {
      oldData: null,
      newData: {
        title: article.title,
        slug: article.slug,
        categoryId: article.categoryId,
        authorId: article.authorId,
      },
    },
  });

  return article;
}

export async function getArticleById(id: string): Promise<
  | (ArticleWithPartialAuthor & {
      relatedArticles?: ArticleWithPartialAuthor[];
    })
  | null
> {
  // Fetch main article
  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      category: true,
      period: true,
    },
  });

  if (!article) {
    return null;
  }

  // Fetch related articles by same category excluding current article
  const relatedArticles = await prisma.article.findMany({
    where: {
      categoryId: article.categoryId,
      id: {
        not: id,
      },
      status: "PUBLISH",
    },
    take: 4, // Limit to 4 related articles
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      category: true,
      period: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    ...article,
    relatedArticles,
  };
}

export async function updateArticle(
  id: string,
  data: UpdateArticleInput,
  user: { id: string }
): Promise<ArticleWithPartialAuthor> {
  const existingArticle = await prisma.article.findUnique({
    where: { id },
  });

  if (!existingArticle) {
    throw new Error("Article not found");
  }

  const updateData: Record<string, unknown> = {};

  if (data.title) {
    updateData.title = data.title;
    updateData.slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail;
  if (data.content !== undefined) updateData.content = data.content;
  if (data.authorId) updateData.authorId = data.authorId;
  if (data.categoryId) updateData.categoryId = data.categoryId;
  if (data.periodId !== undefined && data.periodId.trim() !== "") {
    updateData.periodId = data.periodId;
  } else if (data.periodId === "") {
    updateData.periodId = null;
  }
  if (data.status) updateData.status = data.status;

  const article = await prisma.article.update({
    where: { id },
    data: updateData,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      category: true,
      period: true,
    },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.UPDATE,
    entityType: "Article",
    entityId: article.id,
    description: `Updated article: ${article.title}`,
    metadata: {
      oldData: {
        title: existingArticle.title,
        slug: existingArticle.slug,
        categoryId: existingArticle.categoryId,
        authorId: existingArticle.authorId,
      },
      newData: {
        title: article.title,
        slug: article.slug,
        categoryId: article.categoryId,
        authorId: article.authorId,
      },
    },
  });

  return article;
}

export async function deleteArticle(
  id: string,
  user: { id: string }
): Promise<void> {
  const existingArticle = await prisma.article.findUnique({
    where: { id },
  });

  if (!existingArticle) {
    throw new Error("Article not found");
  }

  await prisma.article.delete({
    where: { id },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.DELETE,
    entityType: "Article",
    entityId: id,
    description: `Deleted article: ${existingArticle.title}`,
    metadata: {
      oldData: {
        title: existingArticle.title,
        slug: existingArticle.slug,
        categoryId: existingArticle.categoryId,
        authorId: existingArticle.authorId,
      },
      newData: null,
    },
  });
}
