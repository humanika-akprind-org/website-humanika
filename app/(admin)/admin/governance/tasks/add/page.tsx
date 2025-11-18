"use client";

import { useState, useEffect } from "react";
import { createDepartmentTask } from "@/use-cases/api/task";
import TaskForm from "@/components/admin/task/Form";
import type {
  CreateDepartmentTaskInput,
  UpdateDepartmentTaskInput,
} from "@/types/task";
import type { User } from "@/types/user";
import { getUsers } from "@/use-cases/api/user";

export const dynamic = "force-dynamic";

export default function AddTaskPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getUsers();
        if (response.data) {
          setUsers(response.data.users);
        } else if (response.error) {
          setError(response.error);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
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
      <TaskForm onSubmit={handleSubmit} users={users} />
    </div>
  );
}
