"use client";

import { useParams } from "next/navigation";
import ArticleCategoryForm from "@/components/admin/pages/article/category/Form";
import LoadingForm from "@/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/components/admin/ui/PageHeader";
import Alert from "@/components/admin/ui/alert/Alert";
import { useEditArticleCategory } from "@/hooks/article-category/useEditArticleCategory";

export default function EditArticleCategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;

  const { category, loading, error, updateArticleCategory, handleBack } =
    useEditArticleCategory(categoryId);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Edit Article Category" onBack={handleBack} />

      {error && <Alert type="error" message={error} />}

      {loading ? (
        <LoadingForm />
      ) : category ? (
        <ArticleCategoryForm
          category={category}
          onSubmit={updateArticleCategory}
        />
      ) : null}
    </div>
  );
}
