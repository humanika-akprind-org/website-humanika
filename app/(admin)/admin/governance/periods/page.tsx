"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Period } from "@/types/period";
import { getPeriods, deletePeriod, reorderPeriods } from "@/lib/api/period";
import PeriodStats from "@/components/admin/period/Stats";
import PeriodFilters from "@/components/admin/period/Filters";
import PeriodTable from "@/components/admin/period/Table";
import DeleteModal from "@/components/admin/period/modal/DeleteModal";
import { FiPlus } from "react-icons/fi";

export default function PeriodsPage() {
  const router = useRouter();
  const [periods, setPeriods] = useState<Period[]>([]);
  const [filteredPeriods, setFilteredPeriods] = useState<Period[]>([]);
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState<Period | null>(null);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPeriods();
  }, []);

  useEffect(() => {
    filterPeriods();
  }, [periods, searchTerm, statusFilter, sortField, sortDirection]);

  const loadPeriods = async () => {
    try {
      setLoading(true);
      const data = await getPeriods();
      setPeriods(data);
    } catch (error) {
      console.error("Error loading periods:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterPeriods = () => {
    let result = [...periods];

    // Apply search filter
    if (searchTerm) {
      result = result.filter((period) =>
        period.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((period) => {
        if (statusFilter === "ACTIVE") return period.isActive;
        if (statusFilter === "INACTIVE") return !period.isActive;
        return true;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue, bValue;

      switch (sortField) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "createdAt":
          aValue = a.createdAt;
          bValue = b.createdAt;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredPeriods(result);
  };

  const togglePeriodSelection = (id: string) => {
    if (selectedPeriods.includes(id)) {
      setSelectedPeriods(selectedPeriods.filter((periodId) => periodId !== id));
    } else {
      setSelectedPeriods([...selectedPeriods, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedPeriods.length === filteredPeriods.length) {
      setSelectedPeriods([]);
    } else {
      setSelectedPeriods(filteredPeriods.map((period) => period.id));
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleAddPeriod = () => {
    router.push("/admin/governance/periods/add");
  };

  const handleDelete = (period?: Period) => {
    if (period) {
      setCurrentPeriod(period);
    }
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      if (currentPeriod) {
        // Delete single period
        await deletePeriod(currentPeriod.id);
        setPeriods(periods.filter((p) => p.id !== currentPeriod.id));
      } else if (selectedPeriods.length > 0) {
        // Delete multiple periods
        const deletePromises = selectedPeriods.map((id) => deletePeriod(id));
        await Promise.all(deletePromises);
        setPeriods(periods.filter((p) => !selectedPeriods.includes(p.id)));
        setSelectedPeriods([]);
      }
      setShowDeleteModal(false);
      setCurrentPeriod(null);
    } catch (error) {
      console.error("Error deleting period:", error);
    }
  };

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const index = periods.findIndex((p) => p.id === id);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === periods.length - 1)
    ) {
      return;
    }

    const newPeriods = [...periods];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    // Swap positions
    [newPeriods[index], newPeriods[targetIndex]] = [
      newPeriods[targetIndex],
      newPeriods[index],
    ];

    setPeriods(newPeriods);

    try {
      await reorderPeriods(newPeriods);
    } catch (error) {
      console.error("Error reordering periods:", error);
      // Revert if API call fails
      setPeriods([...periods]);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"/>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Management Period
          </h1>
          <p className="text-gray-600 mt-1">Kelola semua period organisasi</p>
        </div>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center mt-4 md:mt-0"
          onClick={handleAddPeriod}
        >
          <FiPlus className="mr-2" />
          Tambah Period
        </button>
      </div>

      <PeriodStats periods={periods} />

      <PeriodFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        selectedCount={selectedPeriods.length}
        onDeleteSelected={() => handleDelete()}
      />

      <PeriodTable
        periods={filteredPeriods}
        selectedPeriods={selectedPeriods}
        onSelectPeriod={togglePeriodSelection}
        onSelectAll={toggleSelectAll}
        onDelete={handleDelete}
        onReorder={handleReorder}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setCurrentPeriod(null);
        }}
        onConfirm={confirmDelete}
        period={currentPeriod}
        selectedCount={selectedPeriods.length}
      />
    </div>
  );
}
