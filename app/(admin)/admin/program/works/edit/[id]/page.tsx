"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { FiAlertCircle } from "react-icons/fi";
import WorkProgramForm from "@/components/admin/work/Form";
import type {
  WorkProgram,
  UpdateWorkProgramInput,
  CreateWorkProgramInput,
} from "@/types/work";
import type { User } from "@/types/user";
import type { Period } from "@/types/period";
import { getWorkProgram, updateWorkProgram } from "@/lib/api/work";
import { getUsers } from "@/lib/api/user";
import { getPeriods } from "@/lib/api/period";

export default function EditWorkProgramPage() {
  const params = useParams();
  const id = params.id as string;

  const [workProgram, setWorkProgram] = useState<WorkProgram | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [programData, usersRes, periodsData] = await Promise.all([
        getWorkProgram(id),
        getUsers(),
        getPeriods(),
      ]);
      setWorkProgram(programData);
      if (usersRes.data) {
        setUsers(usersRes.data.users);
      } else {
        setError(usersRes.error || "Failed to fetch users");
      }
      setPeriods(periodsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (
    data: CreateWorkProgramInput | UpdateWorkProgramInput
  ) => {
    await updateWorkProgram(id, data as UpdateWorkProgramInput);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
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
        </div>
      </div>
    );
  }

  if (!workProgram) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-yellow-400 mr-2">
              <FiAlertCircle size={20} />
            </div>
            <h3 className="text-yellow-800 font-medium">Not Found</h3>
          </div>
          <p className="text-yellow-700 mt-1">Work program not found.</p>
        </div>
      </div>
    );
  }

  return (
    <WorkProgramForm
      workProgram={workProgram}
      users={users}
      periods={periods}
      onSubmit={handleSubmit}
      isEditing={true}
    />
  );
}
