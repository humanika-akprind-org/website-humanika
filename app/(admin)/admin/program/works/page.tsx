"use client";

import { useState, useEffect } from "react";
import { FiAlertCircle } from "react-icons/fi";
import WorkProgramTable from "@/components/admin/work/Table";
import type { WorkProgram } from "@/types/work";
import {
  getWorkPrograms,
  deleteWorkProgram,
  deleteWorkPrograms,
} from "@/use-cases/api/work";

export default function WorkProgramPage() {
  const [workPrograms, setWorkPrograms] = useState<WorkProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkPrograms = async () => {
    try {
      setLoading(true);
      const data = await getWorkPrograms();
      setWorkPrograms(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch work programs"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkPrograms();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteWorkProgram(id);
      setWorkPrograms((prev) => prev.filter((program) => program.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete work program"
      );
    }
  };

  const handleDeleteMultiple = async (ids: string[]) => {
    try {
      const validIds = ids.filter(
        (id) =>
          id && typeof id === "string" && id.trim() !== "" && id !== "undefined"
      );
      if (validIds.length > 0) {
        await deleteWorkPrograms(validIds);
        setWorkPrograms((prev) =>
          prev.filter((program) => !validIds.includes(program.id))
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete work programs"
      );
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-400 mr-2">
              <FiAlertCircle size={20} />
            </div>
            <h3 className="text-red-800 font-medium">Error</h3>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
          <button
            onClick={fetchWorkPrograms}
            className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <WorkProgramTable
      workPrograms={workPrograms}
      onDelete={handleDelete}
      onDeleteMultiple={handleDeleteMultiple}
    />
  );
}
