import { useState, useEffect, useCallback } from "react";
import { getDepartmentTasks, deleteDepartmentTask } from "@/use-cases/api/task";
import type { DepartmentTask, DepartmentTaskFilter } from "@/types/task";
import type { Department, Status } from "@/types/enums";

interface UseTaskManagementReturn {
  tasks: DepartmentTask[];
  loading: boolean;
  error: string | null;
  success: string | null;
  selectedTasks: string[];
  searchTerm: string;
  currentPage: number;
  totalPages: number;
  filters: Record<string, string>;
  showDeleteModal: boolean;
  showViewModal: boolean;
  currentTask: DepartmentTask | null;
  setSearchTerm: (term: string) => void;
  setCurrentPage: (page: number) => void;
  setShowDeleteModal: (show: boolean) => void;
  setShowViewModal: (show: boolean) => void;
  setCurrentTask: (task: DepartmentTask | null) => void;
  toggleTaskSelection: (id: string) => void;
  toggleSelectAll: () => void;
  handleViewTask: (id: string) => void;
  handleAddTask: () => void;
  handleEditTask: (id: string) => void;
  handleDelete: (ids?: string[]) => void;
  confirmDelete: () => Promise<void>;
  handleFilterChange: (key: string, value: string) => void;
}

export function useTaskManagement(): UseTaskManagementReturn {
  const [tasks, setTasks] = useState<DepartmentTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, _setTotalPages] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentTask, setCurrentTask] = useState<DepartmentTask | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const filter: DepartmentTaskFilter = {
        department:
          filters.department !== "all"
            ? (filters.department as Department)
            : undefined,
        status:
          filters.status !== "all" ? (filters.status as Status) : undefined,
        search: searchTerm || undefined,
      };
      const data = await getDepartmentTasks(filter);
      setTasks(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [filters, searchTerm]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const toggleTaskSelection = (id: string) => {
    setSelectedTasks((prev) =>
      prev.includes(id) ? prev.filter((taskId) => taskId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const filteredTasks = tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.workProgram?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      return matchesSearch;
    });

    if (selectedTasks.length === filteredTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(filteredTasks.map((task) => task.id));
    }
  };

  const handleViewTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      setCurrentTask(task);
      setShowViewModal(true);
    }
  };

  const handleAddTask = () => {
    // Navigate to add task page
    window.location.href = "/admin/governance/tasks/add";
  };

  const handleEditTask = (id: string) => {
    // Navigate to edit task page
    window.location.href = `/admin/governance/tasks/edit/${id}`;
  };

  const handleDelete = (ids?: string[]) => {
    if (ids && ids.length > 0) {
      setSelectedTasks(ids);
    }
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      if (selectedTasks.length > 0) {
        await Promise.all(selectedTasks.map((id) => deleteDepartmentTask(id)));
        setTasks((prev) =>
          prev.filter((task) => !selectedTasks.includes(task.id))
        );
        setSuccess(`${selectedTasks.length} task(s) deleted successfully`);
      } else if (currentTask) {
        await deleteDepartmentTask(currentTask.id);
        setTasks((prev) => prev.filter((task) => task.id !== currentTask.id));
        setSuccess("Task deleted successfully");
      }
      setSelectedTasks([]);
      setShowDeleteModal(false);
      setCurrentTask(null);
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Failed to delete task");
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return {
    tasks,
    loading,
    error,
    success,
    selectedTasks,
    searchTerm,
    currentPage,
    totalPages,
    filters,
    showDeleteModal,
    showViewModal,
    currentTask,
    setSearchTerm,
    setCurrentPage,
    setShowDeleteModal,
    setShowViewModal,
    setCurrentTask,
    toggleTaskSelection,
    toggleSelectAll,
    handleViewTask,
    handleAddTask,
    handleEditTask,
    handleDelete,
    confirmDelete,
    handleFilterChange,
  };
}
