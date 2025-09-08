"use client";

import { useState, useEffect } from "react";
import { FiAlertCircle } from "react-icons/fi";
import WorkProgramForm from "@/components/admin/work/Form";
import type { CreateWorkProgramInput, UpdateWorkProgramInput } from "@/types/work";
import type { User } from "@/types/user";
import type { Period } from "@/types/period";
import { createWorkProgram } from "@/lib/api/work";
import { getUsers } from "@/lib/api/user";
import { getPeriods } from "@/lib/api/period";

export default function AddWorkProgramPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (data: CreateWorkProgramInput | UpdateWorkProgramInput) => {
    await createWorkProgram(data as CreateWorkProgramInput);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [usersRes, periodsData] = await Promise.all([
        getUsers(),
        getPeriods(),
      ]);
      if (usersRes.data) {
        setUsers(usersRes.data.users);
      } else {
        setError(usersRes.error || "Failed to fetch users");
      }
      setPeriods(periodsData);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch data"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"/>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-400 mr-2">
          <FiAlertCircle size={20} />
        </div>
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchData}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <WorkProgramForm
      users={users}
      periods={periods}
      onSubmit={handleSubmit}
      isEditing={false}
    />
  );
}
