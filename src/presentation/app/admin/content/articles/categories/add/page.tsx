"use client";

import ArticleCategoryForm from "@/src/presentation/components/admin/pages/article/category/Form";
import LoadingForm from "@/src/presentation/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/src/presentation/components/admin/ui/PageHeader";
import Alert from "@/src/presentation/components/admin/ui/alert/Alert";
import { useCreateArticleCategory } from "@/src/presentation/hooks/article-category/useCreateArticleCategory";

export default function AddArticleCategoryPage() {
  const { createArticleCategory, handleBack, isSubmitting, error, isLoading } =
    useCreateArticleCategory();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Add New Article Category" onBack={handleBack} />

      {error && <Alert type="error" message={error} />}

      {isSubmitting || isLoading ? (
        <LoadingForm />
      ) : (
        <ArticleCategoryForm onSubmit={createArticleCategory} />
      )}
    </div>
  );
}
