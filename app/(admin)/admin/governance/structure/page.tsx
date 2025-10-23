"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import StructureTable from "@/components/admin/structure/Table";
import DeleteModal from "@/components/admin/structure/modal/DeleteModal";
import type { OrganizationalStructure } from "@/types/structure";
import { useToast } from "@/hooks/use-toast";

export default function StructuresPage() {
  const [_structures, setStructures] = useState<OrganizationalStructure[]>([]);
  const [filteredStructures, setFilteredStructures] = useState<
    OrganizationalStructure[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    structureId: "",
    structureName: "",
  });

  const { toast } = useToast();

  const fetchStructures = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/structure");
      if (response.ok) {
        const data = await response.json();
        setStructures(data || []);
        setFilteredStructures(data || []);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch organizational structures",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching structures:", error);
      toast({
        title: "Error",
        description: "Failed to fetch organizational structures",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Fetch structures
  useEffect(() => {
    fetchStructures();
  }, [fetchStructures]);

  const handleDelete = async (structureId: string) => {
    try {
      const response = await fetch(`/api/structure/${structureId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Organizational structure deleted successfully",
        });
        fetchStructures(); // Refresh the list
      } else {
        toast({
          title: "Error",
          description: "Failed to delete organizational structure",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting structure:", error);
      toast({
        title: "Error",
        description: "Failed to delete organizational structure",
        variant: "destructive",
      });
    } finally {
      setDeleteModal({ isOpen: false, structureId: "", structureName: "" });
    }
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, structureId: "", structureName: "" });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Organizational Structures Management
          </h1>
          <p className="text-gray-600">
            Manage and organize your organizational structures
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/admin/governance/structure/add"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPlus className="h-4 w-4 mr-2" />
            Add Structure
          </Link>
        </div>
      </div>

      {/* Structures Table */}
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
        <StructureTable
          structures={filteredStructures}
          onDelete={handleDelete}
        />
      )}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={() => handleDelete(deleteModal.structureId)}
        structureName={deleteModal.structureName}
        count={1}
        isLoading={false}
      />
    </div>
  );
}
