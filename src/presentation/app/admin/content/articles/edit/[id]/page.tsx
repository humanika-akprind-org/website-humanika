"use client";

import { useParams } from "next/navigation";
import ArticleForm from "@/src/presentation/components/admin/pages/article/Form";
import LoadingForm from "@/src/presentation/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/src/presentation/components/admin/ui/PageHeader";
import Alert from "@/src/presentation/components/admin/ui/alert/Alert";
import { useEditArticle } from "@/src/presentation/hooks/article/useEditArticle";
import { useArticleFormData } from "@/src/presentation/hooks/article/useArticleFormData";

export default function EditArticlePage() {
  const params = useParams();
  const articleId = params.id as string;

  const { article, loading, error, updateArticle, handleBack } =
    useEditArticle(articleId);

  const {
    periods,
    currentUser,
    loading: formDataLoading,
    error: formDataError,
  } = useArticleFormData();

  const isLoading = loading || formDataLoading;
  const loadError = error || formDataError;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Edit Article" onBack={handleBack} />

      {loadError && <Alert type="error" message={loadError} />}

      {isLoading ? (
        <LoadingForm />
      ) : article ? (
        <ArticleForm
          article={article}
          onSubmit={updateArticle}
          periods={periods}
          currentUser={currentUser}
          isEditing={true}
        />
      ) : null}
    </div>
  );
}
