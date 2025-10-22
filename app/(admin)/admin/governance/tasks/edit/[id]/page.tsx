"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getDepartmentTask, updateDepartmentTask } from "@/use-cases/api/task";
import TaskForm from "@/components/admin/task/Form";
import type { DepartmentTask, UpdateDepartmentTaskInput } from "@/types/task";
import type { User } from "@/types/user";
import { getUsers } from "@/use-cases/api/user";

export default function EditTaskPage() {
  const params = useParams();
  const id = params.id as string;

  const [task, setTask] = useState<DepartmentTask | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [taskData, usersResponse] = await Promise.all([
          getDepartmentTask(id),
          getUsers(),
        ]);

        setTask(taskData);

        if (usersResponse.data) {
          setUsers(usersResponse.data.users);
        } else if (usersResponse.error) {
          setError(usersResponse.error);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleSubmit = async (data: UpdateDepartmentTaskInput) => {
    await updateDepartmentTask(id, data);
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

  if (!task) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Task not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Edit Department Task
        </h1>
        <p className="text-gray-600 mt-1">Update department task details</p>
      </div>

      <TaskForm task={task} onSubmit={handleSubmit} users={users} />
    </div>
  );
}
