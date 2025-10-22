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

async function AddArticlePage() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("google_access_token")?.value || "";

  try {
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

      // Cast data to CreateArticleInput since this is the add page
      const articleData = data as CreateArticleInput;

      if (
        !articleData.title ||
        !articleData.content ||
        !articleData.authorId ||
        !articleData.categoryId
      ) {
        throw new Error("Missing required fields");
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

      await prisma.article.create({
        data: articlePayload,
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
            <h1 className="text-2xl font-bold text-gray-800">
              Add New Article
            </h1>
          </div>
          <ArticleForm
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

export default AddArticlePage;
