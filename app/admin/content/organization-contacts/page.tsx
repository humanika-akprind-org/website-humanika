"use client";

import OrganizationContactTable from "@/components/admin/pages/organization-contact/Table";
import DeleteModal from "components/admin/ui/modal/DeleteModal";
import ViewModal from "components/admin/ui/modal/ViewModal";
import Loading from "components/admin/layout/loading/Loading";
import Alert, { type AlertType } from "components/admin/ui/alert/Alert";
import ManagementHeader from "components/admin/ui/ManagementHeader";
import AddButton from "components/admin/ui/button/AddButton";
import DateDisplay from "components/admin/ui/date/DateDisplay";
import { useOrganizationContactManagement } from "hooks/organization-contact/useOrganizationContactManagement";
import OrganizationContactFilters from "@/components/admin/pages/organization-contact/Filters";

export default function OrganizationContactsPage() {
  const {
    organizationContacts,
    loading,
    error,
    success,
    selectedContacts,
    searchTerm,
    currentPage,
    totalPages,
    showDeleteModal,
    showViewModal,
    currentContact,
    setSearchTerm,
    setCurrentPage,
    setShowDeleteModal,
    setShowViewModal,
    setCurrentContact,
    toggleContactSelection,
    toggleSelectAll,
    handleAddContact,
    handleEditContact,
    handleViewContact,
    handleDelete,
    confirmDelete,
  } = useOrganizationContactManagement();

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
          title="Organization Contacts"
          description="Manage organization contact information"
        />
        <AddButton onClick={handleAddContact} text="Add Organization Contact" />
      </div>

      {alert && <Alert type={alert.type} message={alert.message} />}

      <OrganizationContactFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCount={selectedContacts.length}
        onDeleteSelected={() => handleDelete()}
      />

      <OrganizationContactTable
        organizationContacts={organizationContacts}
        selectedContacts={selectedContacts}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onContactSelect={toggleContactSelection}
        onSelectAll={toggleSelectAll}
        onViewContact={handleViewContact}
        onEditContact={handleEditContact}
        onDeleteContact={handleDelete}
        onPageChange={setCurrentPage}
        onAddContact={handleAddContact}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        itemName={currentContact?.id}
        selectedCount={selectedContacts.length}
        onClose={() => {
          setShowDeleteModal(false);
          setCurrentContact(null);
        }}
        onConfirm={confirmDelete}
      />

      <ViewModal
        isOpen={showViewModal}
        title="Organization Contact Details"
        onClose={() => {
          setShowViewModal(false);
          setCurrentContact(null);
        }}
      >
        {currentContact && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Vision
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentContact.vision}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Mission
                </label>
                <div className="mt-1 text-sm text-gray-900">
                  {Array.isArray(currentContact.mission) ? (
                    <ul className="list-disc list-inside">
                      {currentContact.mission.map(
                        (
                          mission:
                            | string
                            | {
                                title?: string;
                                description?: string;
                                icon?: string;
                              },
                          index: number
                        ) => (
                          <li key={index}>
                            {typeof mission === "string"
                              ? mission
                              : mission.title
                              ? `${mission.title}${
                                  mission.description
                                    ? ` - ${mission.description}`
                                    : ""
                                }`
                              : JSON.stringify(mission)}
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p>{String(currentContact.mission)}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentContact.email}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentContact.phone || "Not provided"}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentContact.address}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Period
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentContact.period?.name || "Unknown"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Created At
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  <DateDisplay date={currentContact.createdAt} />
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Updated At
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  <DateDisplay date={currentContact.updatedAt} />
                </p>
              </div>
            </div>
          </div>
        )}
      </ViewModal>
    </div>
  );
}
