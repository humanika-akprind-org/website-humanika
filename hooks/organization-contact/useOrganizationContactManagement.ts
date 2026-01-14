import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteOrganizationContact } from "@/use-cases/api/organization-contact";
import type { OrganizationContact } from "@/types/organization-contact";
import { useOrganizationContacts } from "./useOrganizationContacts";
import { getAccessTokenAction } from "@/lib/actions/accessToken";
import { getCurrentUserAction } from "@/lib/actions/getCurrentUser";

export function useOrganizationContactManagement() {
  const router = useRouter();
  const { organizationContacts, isLoading, error, refetch } =
    useOrganizationContacts();

  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentContact, setCurrentContact] =
    useState<OrganizationContact | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Apply client-side filtering and pagination
  const filteredContacts = organizationContacts.filter(
    (contact) =>
      contact.vision
        ?.toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase()) ||
      contact.period?.name
        ?.toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  useEffect(() => {
    setTotalPages(Math.ceil(filteredContacts.length / 10));
  }, [filteredContacts, currentPage]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const toggleContactSelection = (id: string) => {
    if (selectedContacts.includes(id)) {
      setSelectedContacts(
        selectedContacts.filter((contactId) => contactId !== id)
      );
    } else {
      setSelectedContacts([...selectedContacts, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map((c) => c.id));
    }
  };

  const handleAddContact = () => {
    router.push("/admin/content/organization-contacts/add");
  };

  const handleEditContact = (id: string) => {
    router.push(`/admin/content/organization-contacts/edit/${id}`);
  };

  const handleViewContact = (contact: OrganizationContact) => {
    setCurrentContact(contact);
    setShowViewModal(true);
  };

  const handleDelete = (contact?: OrganizationContact) => {
    if (contact) {
      setCurrentContact(contact);
    }
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const user = await getCurrentUserAction();
      if (!user) {
        throw new Error("User not found");
      }

      if (currentContact) {
        // Single contact deletion
        await deleteOrganizationContact(currentContact.id);
        setSuccess("Organization contact deleted successfully");
        refetch();
      } else if (selectedContacts.length > 0) {
        // Bulk deletion
        for (const contactId of selectedContacts) {
          await deleteOrganizationContact(contactId);
        }
        setSelectedContacts([]);
        setSuccess(
          `${selectedContacts.length} organization contacts deleted successfully`
        );
        refetch();
      }
    } catch (err) {
      console.error("Error deleting organization contact:", err);
    } finally {
      setShowDeleteModal(false);
      setCurrentContact(null);
    }
  };

  const handleCreateOrganizationContact = async (
    data: Partial<OrganizationContact>
  ) => {
    try {
      const token = await getAccessTokenAction();
      const response = await fetch("/api/organization-contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to create organization contact"
        );
      }

      const newContact = await response.json();
      setSuccess("Organization contact created successfully");
      refetch();
      return newContact;
    } catch (err) {
      console.error("Error creating organization contact:", err);
      throw err;
    }
  };

  const handleUpdateOrganizationContact = async (
    id: string,
    data: Partial<OrganizationContact>
  ) => {
    try {
      const token = await getAccessTokenAction();
      const response = await fetch(`/api/organization-contact/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to update organization contact"
        );
      }

      const updatedContact = await response.json();
      setSuccess("Organization contact updated successfully");
      refetch();
      return updatedContact;
    } catch (err) {
      console.error("Error updating organization contact:", err);
      throw err;
    }
  };

  return {
    organizationContacts: filteredContacts,
    loading: isLoading,
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
    setError: (_msg: string | null) => {},
    setSuccess: (_msg: string | null) => {},
    toggleContactSelection,
    toggleSelectAll,
    handleAddContact,
    handleEditContact,
    handleViewContact,
    handleDelete,
    confirmDelete,
    handleCreateOrganizationContact,
    handleUpdateOrganizationContact,
  };
}
