"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import LetterTable from "@/components/admin/letter/Table";
import DeleteModal from "@/components/admin/letter/modal/DeleteModal";
import type { Letter } from "@/types/letter";
import { useToast } from "@/hooks/use-toast";

export default function LettersPage() {
  const [_letters, setLetters] = useState<Letter[]>([]);
  const [filteredLetters, setFilteredLetters] = useState<Letter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    letterId: "",
    letterName: "",
  });

  const { toast } = useToast();

  const fetchLetters = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/letter");
      if (response.ok) {
        const data = await response.json();
        setLetters(data || []);
        setFilteredLetters(data || []);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch letters",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching letters:", error);
      toast({
        title: "Error",
        description: "Failed to fetch letters",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Fetch letters
  useEffect(() => {
    fetchLetters();
  }, [fetchLetters]);

  const handleDelete = async (letterId: string) => {
    try {
      const response = await fetch(`/api/letter/${letterId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Letter deleted successfully",
        });
        fetchLetters(); // Refresh the list
      } else {
        toast({
          title: "Error",
          description: "Failed to delete letter",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting letter:", error);
      toast({
        title: "Error",
        description: "Failed to delete letter",
        variant: "destructive",
      });
    } finally {
      setDeleteModal({ isOpen: false, letterId: "", letterName: "" });
    }
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, letterId: "", letterName: "" });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Letters Management
          </h1>
          <p className="text-gray-600">Manage and organize your letters</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/admin/administration/letters/add"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPlus className="h-4 w-4 mr-2" />
            Add Letter
          </Link>
        </div>
      </div>

      {/* Letters Table */}
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
        <LetterTable letters={filteredLetters} onDelete={handleDelete} />
      )}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={() => handleDelete(deleteModal.letterId)}
        letterTitle={deleteModal.letterName}
      />
    </div>
  );
}
