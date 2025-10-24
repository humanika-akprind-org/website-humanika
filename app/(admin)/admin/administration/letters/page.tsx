"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiPlus } from "react-icons/fi";
import { getLetters, deleteLetter } from "@/use-cases/api/letter";
import type { Letter, LetterFilter } from "@/types/letter";
import LetterTable from "@/components/admin/letter/Table";
import LetterFilters from "@/components/admin/letter/Filters";
import LetterStats from "@/components/admin/letter/Stats";
import DeleteModal from "@/components/admin/letter/modal/DeleteModal";

export default function LettersPage() {
  const router = useRouter();
  const [letters, setLetters] = useState<Letter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    letter: Letter | null;
  }>({
    isOpen: false,
    letter: null,
  });

  // Stats
  const [stats, setStats] = useState({
    totalLetters: 0,
  });

  const fetchLetters = async (filter?: LetterFilter) => {
    try {
      setIsLoading(true);
      const data = await getLetters(filter);
      setLetters(data);

      // Calculate stats
      const total = data.length;

      setStats({
        totalLetters: total,
      });
    } catch (error) {
      console.error("Failed to fetch letters:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLetters();
  }, []);

  const handleFilter = (filter: LetterFilter) => {
    fetchLetters(filter);
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteLetter(id);
      setDeleteModal({ isOpen: false, letter: null });
      fetchLetters(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete letter:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, letter: null });
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.letter) {
      await handleDelete(deleteModal.letter.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Letters</h1>
          <p className="text-gray-600">
            Manage official letters and correspondence
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/administration/letters/add")}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiPlus className="w-4 h-4 mr-2" />
          Add Letter
        </button>
      </div>

      {/* Stats */}
      <LetterStats totalLetters={stats.totalLetters} isLoading={isLoading} />

      {/* Filters */}
      <LetterFilters onFilter={handleFilter} isLoading={isLoading} />

      {/* Table */}
      <LetterTable
        letters={letters}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        letterTitle={deleteModal.letter?.regarding || ""}
      />
    </div>
  );
}
