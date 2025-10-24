"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import Stats from "@/components/admin/finance/Stats";
import Filters from "@/components/admin/finance/transaction/Filters";
import FinanceTable from "@/components/admin/finance/transaction/Table";
import DeleteModal from "@/components/admin/finance/modal/DeleteModal";
import type { Finance } from "@/types/finance";
import { useToast } from "@/hooks/use-toast";
import { useFile } from "@/hooks/useFile";

export default function FinanceTransactionsPage() {
  const [_finances, setFinances] = useState<Finance[]>([]);
  const [filteredFinances, setFilteredFinances] = useState<Finance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    financeId: "",
    financeName: "",
  });

  const { toast } = useToast();
  const { deleteFile } = useFile("");

  const fetchFinances = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/finance");
      if (response.ok) {
        const data = await response.json();
        setFinances(data || []);
        setFilteredFinances(data || []);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch transactions",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Fetch finances
  useEffect(() => {
    fetchFinances();
  }, [fetchFinances]);

  const handleDelete = async (financeId: string) => {
    try {
      // First, get the finance to check if it has a file
      const financeResponse = await fetch(`/api/finance/${financeId}`);
      if (!financeResponse.ok) {
        throw new Error("Failed to fetch finance details");
      }
      const finance = await financeResponse.json();

      // Delete the file from Google Drive if it exists
      if (finance.fileId) {
        const fileDeleted = await deleteFile(finance.fileId);
        if (!fileDeleted) {
          console.warn(
            "Failed to delete file from Google Drive, but continuing with database deletion"
          );
        }
      }

      // Delete from database
      const response = await fetch(`/api/finance/${financeId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Transaction deleted successfully",
        });
        fetchFinances(); // Refresh the list
      } else {
        toast({
          title: "Error",
          description: "Failed to delete transaction",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
    }
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, financeId: "", financeName: "" });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Finance Management
          </h1>
          <p className="text-gray-600">
            Manage and organize your financial transactions
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/admin/finance/transactions/add"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPlus className="h-4 w-4 mr-2" />
            Add Transaction
          </Link>
        </div>
      </div>

      {/* Stats */}
      <Stats finances={filteredFinances} />

      {/* Filters */}
      <Filters
        searchTerm=""
        onSearchChange={() => {}}
        statusFilter="all"
        onStatusFilterChange={() => {}}
        typeFilter="all"
        onTypeFilterChange={() => {}}
        categoryFilter="all"
        onCategoryFilterChange={() => {}}
        periodFilter="all"
        onPeriodFilterChange={() => {}}
        isFilterOpen={false}
        setIsFilterOpen={() => {}}
        selectedCount={0}
        onDeleteSelected={() => {}}
      />

      {/* Finances Table */}
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
        <FinanceTable
          finances={filteredFinances}
          onDelete={handleDelete}
          accessToken={undefined}
        />
      )}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={() => handleDelete(deleteModal.financeId)}
        financeName={deleteModal.financeName}
      />
    </div>
  );
}
