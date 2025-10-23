"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import DocumentTable from "@/components/admin/document/Table";
import DeleteModal from "@/components/admin/document/modal/DeleteModal";
import type { Document } from "@/types/document";
import { useToast } from "@/hooks/use-toast";

export default function DocumentsPage() {
  const [_documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    documentId: "",
    documentName: "",
  });

  const { toast } = useToast();

  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/document");
      if (response.ok) {
        const data = await response.json();
        setDocuments(data || []);
        setFilteredDocuments(data || []);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch documents",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast({
        title: "Error",
        description: "Failed to fetch documents",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Fetch documents
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDelete = async (documentId: string) => {
    try {
      const response = await fetch(`/api/document/${documentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Document deleted successfully",
        });
        fetchDocuments(); // Refresh the list
      } else {
        toast({
          title: "Error",
          description: "Failed to delete document",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
    } finally {
      setDeleteModal({ isOpen: false, documentId: "", documentName: "" });
    }
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, documentId: "", documentName: "" });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Documents Management
          </h1>
          <p className="text-gray-600">Manage and organize your documents</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/admin/administration/documents/add"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPlus className="h-4 w-4 mr-2" />
            Add Document
          </Link>
        </div>
      </div>

      {/* Documents Table */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      ) : (
        <DocumentTable documents={filteredDocuments} onDelete={handleDelete} />
      )}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={() => handleDelete(deleteModal.documentId)}
        documentName={deleteModal.documentName}
      />
    </div>
  );
}
