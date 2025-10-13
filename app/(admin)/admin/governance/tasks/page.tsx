"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { getDepartmentTasks, deleteDepartmentTask } from "@/lib/api/task";
import type { DepartmentTask } from "@/types/task";
import TaskTable from "@/components/admin/task/Table";


export default function TasksPage() {
  const [tasks, setTasks] = useState<DepartmentTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getDepartmentTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDepartmentTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      alert("Task deleted successfully");
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Failed to delete task");
    }
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
        <button
          onClick={fetchTasks}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Department Tasks</h1>
          <p className="text-gray-600 mt-1">
            Manage department tasks and assignments
          </p>
        </div>
        <Link
          href="/admin/governance/tasks/add"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="mr-2" />
          Add Task
        </Link>
      </div>

      <TaskTable tasks={tasks} onDelete={handleDelete} />
    </div>
  );
}
