"use client";

import { useState, useEffect } from "react";
import { createDepartmentTask } from "@/use-cases/api/task";
import TaskForm from "@/components/admin/task/Form";
import type {
  CreateDepartmentTaskInput,
  UpdateDepartmentTaskInput,
} from "@/types/task";
import type { User } from "@/types/user";
import type { WorkProgram } from "@/types/work";
import { getUsers } from "@/use-cases/api/user";
import { getWorkPrograms } from "@/use-cases/api/work";

export const dynamic = "force-dynamic";

export default function AddTaskPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [workPrograms, setWorkPrograms] = useState<WorkProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersResponse, workPrograms] = await Promise.all([
          getUsers(),
          getWorkPrograms({}),
        ]);

        if (usersResponse.data) {
          setUsers(usersResponse.data.users);
        } else if (usersResponse.error) {
          setError(usersResponse.error);
          return;
        }

        setWorkPrograms(workPrograms);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (
    data: CreateDepartmentTaskInput | UpdateDepartmentTaskInput
  ) => {
    await createDepartmentTask(data as CreateDepartmentTaskInput);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TaskForm
        onSubmit={handleSubmit}
        users={users}
        workPrograms={workPrograms}
      />
    </div>
  );
}
