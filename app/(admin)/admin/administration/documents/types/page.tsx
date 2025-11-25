"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import DocumentTypeTable from "@/components/admin/document/type/Table";
import type { DocumentType } from "@/types/document-type";
import {
  getDocumentTypes,
  deleteDocumentType,
} from "@/use-cases/api/document-type";
import { useToast } from "@/hooks/use-toast";

export default function DocumentTypesPage() {
  const [types, setTypes] = useState<DocumentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchTypes = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getDocumentTypes();
      setTypes(data || []);
    } catch (error) {
      console.error("Error fetching types:", error);
      toast({
        title: "Error",
        description: "Failed to fetch document types",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Fetch types
  useEffect(() => {
    fetchTypes();
  }, [fetchTypes]);

  const handleDelete = async (typeId: string) => {
    try {
      await deleteDocumentType(typeId);
      toast({
        title: "Success",
        description: "Document type deleted successfully",
      });
      fetchTypes(); // Refresh the list
    } catch (error) {
      console.error("Error deleting type:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete type",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Types</h1>
          <p className="text-gray-600">Manage document types</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/admin/administration/documents/types/add"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPlus className="h-4 w-4 mr-2" />
            Add Type
          </Link>
        </div>
      </div>

      {/* Types Table */}
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
        <DocumentTypeTable types={types} onDelete={handleDelete} />
      )}
    </div>
  );
}
