"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Management } from "@/types/management";
import { managementAPI } from "@/lib/api/management";
import ManagementList from "@/components/admin/management/ManagementList";

export default function ManagementsPage() {
  const router = useRouter();
  const [managements, setManagements] = useState<Management[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchManagements();
  }, []);

  const fetchManagements = async () => {
    try {
      setIsLoading(true);
      const response = await managementAPI.getManagements({
        search: searchTerm || undefined,
      });

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setManagements(response.data.managements);
      }
    } catch (err) {
      setError("Failed to fetch managements");
      console.error("Error fetching managements:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (management: Management) => {
    router.push(`/admin/governance/managements/edit/${management.id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this management position?")) {
      return;
    }

    try {
      const response = await managementAPI.deleteManagement(id);
      if (response.error) {
        alert(response.error);
      } else {
        setManagements((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      alert("Failed to delete management");
      console.error("Error deleting management:", err);
    }
  };

  const handleView = (id: string) => {
    router.push(`/admin/governance/managements/${id}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchManagements();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"/>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Management</h1>
          <p className="text-gray-600 mt-2">
            Manage organizational leadership positions
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/governance/managements/add")}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Add Management
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            placeholder="Search by name, email, or period..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              fetchManagements();
            }}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
          >
            Clear
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <ManagementList
        managements={managements}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />
    </div>
  );
}
