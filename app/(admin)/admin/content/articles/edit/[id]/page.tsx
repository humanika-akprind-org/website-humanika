import { UserApi } from "@/use-cases/api/user";
import { PeriodApi } from "@/use-cases/api/period";
import ArticleForm from "@/components/admin/article/Form";
import AuthGuard from "@/components/admin/auth/google-oauth/AuthGuard";
import { cookies } from "next/headers";
import type {
  CreateArticleInput,
  UpdateArticleInput,
  Article,
} from "@/types/article";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { logActivity } from "@/lib/activity-log";
import { ActivityType } from "@/types/enums";

async function EditArticlePage({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("google_access_token")?.value || "";

  try {
    // Fetch article data
    const article = await prisma.article.findUnique({
      where: { id: params.id },
      include: {
        author: true,
        category: true,
        period: true,
      },
    });

    if (!article) {
      notFound();
    }

    // Transform article data to match Article type (convert null thumbnail to undefined)
    const { thumbnail, ...articleWithoutThumbnail } = article;
    const transformedArticle = {
      ...articleWithoutThumbnail,
      thumbnail: thumbnail === null ? undefined : thumbnail,
    } as unknown as Article;

    const [usersResponse, periods] = await Promise.all([
      UserApi.getUsers({ limit: 50 }),
      PeriodApi.getPeriods(),
    ]);

    const users = usersResponse.data?.users || [];
    const periodsData = periods || [];

    const handleSubmit = async (
      data: CreateArticleInput | UpdateArticleInput
    ) => {
      "use server";

      const user = await getCurrentUser();
      if (!user) {
        throw new Error("Unauthorized");
      }

      // Cast data to UpdateArticleInput since this is the edit page
      const articleData = data as UpdateArticleInput;

      if (
        !articleData.title ||
        !articleData.content ||
        !articleData.authorId ||
        !articleData.categoryId
      ) {
        throw new Error("Missing required fields");
      }

      // Get existing article for logging
      const existingArticle = await prisma.article.findUnique({
        where: { id: params.id },
      });

      if (!existingArticle) {
        throw new Error("Article not found");
      }

      // Generate slug from title
      const slug = articleData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const articlePayload: Omit<
        Article,
        | "id"
        | "author"
        | "category"
        | "period"
        | "status"
        | "createdAt"
        | "updatedAt"
      > = {
        title: articleData.title,
        slug,
        thumbnail: articleData.thumbnail,
        content: articleData.content,
        authorId: articleData.authorId,
        categoryId: articleData.categoryId,
        isPublished: articleData.isPublished || false,
        publishedAt: articleData.publishedAt,
      };

      // Only include periodId if it's provided and not empty
      if (articleData.periodId && articleData.periodId.trim() !== "") {
        articlePayload.periodId = articleData.periodId;
      }

      const updatedArticle = await prisma.article.update({
        where: { id: params.id },
        data: articlePayload,
      });

      // Log activity
      await logActivity({
        userId: user.id,
        activityType: ActivityType.UPDATE,
        entityType: "Article",
        entityId: updatedArticle.id,
        description: `Updated article: ${updatedArticle.title}`,
        metadata: {
          oldData: {
            title: existingArticle.title,
            slug: existingArticle.slug,
            categoryId: existingArticle.categoryId,
            authorId: existingArticle.authorId,
          },
          newData: {
            title: updatedArticle.title,
            slug: updatedArticle.slug,
            categoryId: updatedArticle.categoryId,
            authorId: updatedArticle.authorId,
          },
        },
      });

      redirect("/admin/content/articles");
    };

    return (
      <AuthGuard accessToken={accessToken}>
        <div className="p-6 max-w-4xl min-h-screen mx-auto">
          <div className="flex items-center mb-6">
            <Link
              href="/admin/content/articles"
              className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
            >
              <FiArrowLeft className="mr-1" />
              Back
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Edit Article</h1>
          </div>
          <ArticleForm
            article={transformedArticle}
            accessToken={accessToken}
            users={users}
            periods={periodsData}
            onSubmit={handleSubmit}
          />
        </div>
      </AuthGuard>
    );
  } catch (error) {
    console.error("Error loading form data:", error);
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="text-center text-red-500">
              <h2 className="text-xl font-semibold mb-4">Error Loading Form</h2>
              <p>{error instanceof Error ? error.message : "Unknown error"}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EditArticlePage;
