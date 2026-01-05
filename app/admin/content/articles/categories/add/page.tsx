"use client";

import ArticleCategoryForm from "@/components/admin/pages/article/category/Form";
import LoadingForm from "@/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/components/admin/ui/PageHeader";
import Alert from "@/components/admin/ui/alert/Alert";
import { useCreateArticleCategory } from "@/hooks/article-category/useCreateArticleCategory";

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
