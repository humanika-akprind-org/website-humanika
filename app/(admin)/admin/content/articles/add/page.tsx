"use client";

import ArticleForm from "@/components/admin/pages/article/Form";
import LoadingForm from "@/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/components/admin/ui/PageHeader";
import Alert from "@/components/admin/ui/alert/Alert";
import { useCreateArticle } from "@/hooks/article/useCreateArticle";
import { useArticleFormData } from "@/hooks/article/useArticleFormData";

export default function AddArticlePage() {
  const { createArticle, handleBack, isSubmitting, error, isLoading } =
    useCreateArticle();

  const {
    periods,
    currentUser,
    loading: formDataLoading,
    error: formDataError,
  } = useArticleFormData();

  const combinedLoading = isSubmitting || isLoading || formDataLoading;
  const loadError = error || formDataError;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Add New Article" onBack={handleBack} />

      {loadError && <Alert type="error" message={loadError} />}

      {combinedLoading ? (
        <LoadingForm />
      ) : (
        <ArticleForm
          onSubmit={createArticle}
          periods={periods}
          currentUser={currentUser}
          loading={combinedLoading}
        />
      )}
    </div>
  );
}
