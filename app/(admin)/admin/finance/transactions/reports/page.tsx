"use client";

import { useState, useEffect, useCallback } from "react";
import { FileText, FileSpreadsheet } from "lucide-react";
import Stats from "@/components/admin/finance/Stats";
import Filters from "@/components/admin/finance/Filters";
import FinanceTable from "@/components/admin/finance/Table";
import DeleteModal from "@/components/admin/finance/modal/DeleteModal";
import type { Finance } from "@/types/finance";
import { useToast } from "@/hooks/use-toast";
import { useFile } from "@/hooks/useFile";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export default function FinanceTransactionsReportsPage() {
  const [finances, setFinances] = useState<Finance[]>([]);
  const [filteredFinances, setFilteredFinances] = useState<Finance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    financeId: "",
    financeName: "",
  });

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFinances, setSelectedFinances] = useState<string[]>([]);

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

  // Apply filters
  useEffect(() => {
    let filtered = finances;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (finance) =>
          finance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          finance.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((finance) => finance.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((finance) => finance.type === typeFilter);
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (finance) => finance.category?.id === categoryFilter
      );
    }

    // Period filter
    if (periodFilter !== "all") {
      filtered = filtered.filter(
        (finance) => finance.period.id === periodFilter
      );
    }

    setFilteredFinances(filtered);
  }, [
    finances,
    searchTerm,
    statusFilter,
    typeFilter,
    categoryFilter,
    periodFilter,
  ]);

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

  const handleDeleteSelected = async () => {
    if (selectedFinances.length === 0) return;

    try {
      for (const financeId of selectedFinances) {
        // First, get the finance to check if it has a file
        const financeResponse = await fetch(`/api/finance/${financeId}`);
        if (!financeResponse.ok) continue;
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
        await fetch(`/api/finance/${financeId}`, {
          method: "DELETE",
        });
      }

      toast({
        title: "Success",
        description: `${selectedFinances.length} transactions deleted successfully`,
      });
      setSelectedFinances([]);
      fetchFinances(); // Refresh the list
    } catch (error) {
      console.error("Error deleting selected transactions:", error);
      toast({
        title: "Error",
        description: "Failed to delete selected transactions",
        variant: "destructive",
      });
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text("Finance Transactions Report", 20, 10);

    // Add generation date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 20);

    const tableData = filteredFinances.map((finance) => [
      finance.name,
      `Rp ${finance.amount.toLocaleString()}`,
      finance.description,
      new Date(finance.date).toLocaleDateString(),
      finance.category?.name || "Tidak ada kategori",
      finance.type,
      finance.status,
      finance.user.name,
    ]);

    autoTable(doc, {
      head: [
        [
          "Name",
          "Amount",
          "Description",
          "Date",
          "Category",
          "Type",
          "Status",
          "User",
        ],
      ],
      body: tableData,
      startY: 30,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    doc.save("finance-report.pdf");
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredFinances.map((finance) => ({
        Name: finance.name,
        Amount: finance.amount,
        Description: finance.description,
        Date: new Date(finance.date).toLocaleDateString(),
        Category: finance.category?.name || "Tidak ada kategori",
        Type: finance.type,
        Status: finance.status,
        User: finance.user.name,
        Period: finance.period.name,
        Event: finance.event?.name || "N/A",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Finance Report");
    XLSX.writeFile(workbook, "finance-report.xlsx");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finance Reports</h1>
          <p className="text-gray-600">
            View and export financial transaction reports
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={exportToPDF}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </button>
          <button
            onClick={exportToExcel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export Excel
          </button>
        </div>
      </div>

      {/* Stats */}
      <Stats finances={filteredFinances} />

      {/* Filters */}
      <Filters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        periodFilter={periodFilter}
        onPeriodFilterChange={setPeriodFilter}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        selectedCount={selectedFinances.length}
        onDeleteSelected={handleDeleteSelected}
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
