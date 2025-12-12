"use client";

import GalleryStats from "components/admin/gallery/Stats";
import GalleryFilters from "components/admin/gallery/Filters";
import GalleryTable from "@/components/admin/gallery/Table";
import DeleteModal from "components/admin/ui/modal/DeleteModal";
import ViewModal from "components/admin/ui/modal/ViewModal";
import Loading from "components/admin/layout/loading/Loading";
import Alert, { type AlertType } from "components/admin/ui/alert/Alert";
import ManagementHeader from "components/admin/ui/ManagementHeader";
import AddButton from "components/admin/ui/button/AddButton";
import HtmlRenderer from "components/admin/ui/HtmlRenderer";
import DateDisplay from "components/admin/ui/date/DateDisplay";
import ImageView from "components/admin/ui/avatar/ImageView";
import { useGalleryManagement } from "hooks/gallery/useGalleryManagement";

export default function GalleriesPage() {
  const {
    galleries,
    loading,
    error,
    success,
    selectedGalleries,
    searchTerm,
    eventFilter,
    currentPage,
    totalPages,
    showDeleteModal,
    showViewModal,
    currentGallery,
    setSearchTerm,
    setEventFilter,
    setCurrentPage,
    setShowDeleteModal,
    setShowViewModal,
    setCurrentGallery,
    toggleGallerySelection,
    toggleSelectAll,
    handleAddGallery,
    handleEditGallery,
    handleViewGallery,
    handleDelete,
    confirmDelete,
  } = useGalleryManagement();

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
          title="Galleries"
          description="Manage galleries and their details"
        />
        <AddButton onClick={handleAddGallery} text="Add Gallery" />
      </div>

      <GalleryStats galleries={galleries} />

      {alert && <Alert type={alert.type} message={alert.message} />}

      <GalleryFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        eventFilter={eventFilter}
        onEventFilterChange={setEventFilter}
        selectedCount={selectedGalleries.length}
        onDeleteSelected={() => handleDelete()}
      />

      <GalleryTable
        galleries={galleries}
        selectedGalleries={selectedGalleries}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onGallerySelect={toggleGallerySelection}
        onSelectAll={toggleSelectAll}
        onViewGallery={handleViewGallery}
        onEditGallery={handleEditGallery}
        onDeleteGallery={handleDelete}
        onPageChange={setCurrentPage}
        onAddGallery={handleAddGallery}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        itemName={currentGallery?.title}
        selectedCount={selectedGalleries.length}
        onClose={() => {
          setShowDeleteModal(false);
          setCurrentGallery(null);
        }}
        onConfirm={confirmDelete}
      />

      <ViewModal
        isOpen={showViewModal}
        title="Gallery Details"
        onClose={() => {
          setShowViewModal(false);
          setCurrentGallery(null);
        }}
      >
        {currentGallery && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div>
                <h4 className="text-xl font-semibold text-gray-900">
                  {currentGallery.title}
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Event
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentGallery.event?.name || "No event"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Created At
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  <DateDisplay date={currentGallery.createdAt} />
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Updated At
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  <DateDisplay date={currentGallery.updatedAt} />
                </p>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <div className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md border border-blue-500">
                <HtmlRenderer
                  html={currentGallery.gallery || "No description"}
                />
              </div>
            </div>

            {currentGallery.image && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700">
                  Image
                </label>
                <div className="mt-2">
                  <ImageView
                    imageUrl={currentGallery.image}
                    alt={`Gallery image for ${currentGallery.title}`}
                    size={{ width: 300, height: 200 }}
                    modalTitle={`Gallery Image - ${currentGallery.title}`}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </ViewModal>
    </div>
  );
}
