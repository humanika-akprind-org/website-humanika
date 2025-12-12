"use client";

import ArticleStats from "components/admin/article/Stats";
import ArticleFilters from "components/admin/article/Filters";
import ArticleTable from "components/admin/article/Table";
import DeleteModal from "components/admin/ui/modal/DeleteModal";
import ViewModal from "components/admin/ui/modal/ViewModal";
import Loading from "components/admin/layout/loading/Loading";
import Alert, { type AlertType } from "components/admin/ui/alert/Alert";
import ManagementHeader from "components/admin/ui/ManagementHeader";
import AddButton from "components/admin/ui/button/AddButton";
import HtmlRenderer from "components/admin/ui/HtmlRenderer";
import StatusChip from "components/admin/ui/chip/Status";
import DateDisplay from "components/admin/ui/date/DateDisplay";
import ImageView from "components/admin/ui/avatar/ImageView";
import { useArticleManagement } from "hooks/article/useArticleManagement";

export default function ArticlesPage() {
  const {
    articles,
    loading,
    error,
    success,
    selectedArticles,
    searchTerm,
    statusFilter,
    periodFilter,
    categoryFilter,
    currentPage,
    totalPages,
    showDeleteModal,
    showViewModal,
    currentArticle,
    setSearchTerm,
    setStatusFilter,
    setPeriodFilter,
    setCategoryFilter,
    setCurrentPage,
    setShowDeleteModal,
    setShowViewModal,
    setCurrentArticle,
    toggleArticleSelection,
    toggleSelectAll,
    handleAddArticle,
    handleEditArticle,
    handleViewArticle,
    handleDelete,
    confirmDelete,
  } = useArticleManagement();

  const alert: { type: AlertType; message: string } | null = error
    ? { type: "error", message: error }
    : success
    ? { type: "success", message: success }
    : null;

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <ManagementHeader
          title="Articles"
          description="Manage articles and their details"
        />
        <AddButton onClick={handleAddArticle} text="Add Article" />
      </div>

      <ArticleStats articles={articles} />

      {alert && <Alert type={alert.type} message={alert.message} />}

      <ArticleFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        periodFilter={periodFilter}
        onPeriodFilterChange={setPeriodFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        selectedArticles={selectedArticles}
        onDeleteSelected={() => handleDelete()}
      />

      <ArticleTable
        articles={articles}
        selectedArticles={selectedArticles}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onArticleSelect={toggleArticleSelection}
        onSelectAll={toggleSelectAll}
        onViewArticle={handleViewArticle}
        onEditArticle={handleEditArticle}
        onDeleteArticle={handleDelete}
        onPageChange={setCurrentPage}
        onAddArticle={handleAddArticle}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        itemName={currentArticle?.title}
        selectedCount={selectedArticles.length}
        onClose={() => {
          setShowDeleteModal(false);
          setCurrentArticle(null);
        }}
        onConfirm={confirmDelete}
      />

      <ViewModal
        isOpen={showViewModal}
        title="Article Details"
        onClose={() => {
          setShowViewModal(false);
          setCurrentArticle(null);
        }}
      >
        {currentArticle && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div>
                <h4 className="text-xl font-semibold text-gray-900">
                  {currentArticle.title}
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentArticle.category?.name || "No category"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="mt-1">
                  <StatusChip status={currentArticle.status} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Author
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentArticle.author?.name || "No author"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Period
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentArticle.period?.name || "No period"}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <div className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md border border-blue-500">
                  <HtmlRenderer html={currentArticle.content || "No content"} />
                </div>
              </div>

              {currentArticle.thumbnail && (
                <div className="md:col-span-2 mt-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Thumbnail
                  </label>
                  <div className="mt-2">
                    <ImageView
                      imageUrl={currentArticle.thumbnail}
                      alt={`Article thumbnail for ${currentArticle.title}`}
                      size={{ width: 300, height: 200 }}
                      modalTitle={`Article Thumbnail - ${currentArticle.title}`}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Created At
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  <DateDisplay date={currentArticle.createdAt} />
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Updated At
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  <DateDisplay date={currentArticle.updatedAt} />
                </p>
              </div>
            </div>
          </div>
        )}
      </ViewModal>
    </div>
  );
}
