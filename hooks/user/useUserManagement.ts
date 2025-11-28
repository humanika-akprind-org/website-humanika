import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UserApi } from "@/use-cases/api/user";
import type { User, UserFilters as UserFiltersType } from "@/types/user";

export function useUserManagement() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<UserFiltersType>({
    role: "all",
    department: "all",
    isActive: "all",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await UserApi.getUsers({
        search: searchTerm,
        role: filters.role && filters.role !== "all" ? filters.role : undefined,
        department:
          filters.department && filters.department !== "all"
            ? filters.department
            : undefined,
        isActive:
          filters.isActive && filters.isActive !== "all"
            ? filters.isActive === "true"
            : undefined,
        page: currentPage,
        limit: 10,
      });

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setUsers(response.data.users);
        setTotalPages(response.data.pagination.pages);
      }
    } catch (_error) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [
    searchTerm,
    currentPage,
    filters.role,
    filters.department,
    filters.isActive,
  ]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const toggleUserSelection = (id: string) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((userId) => userId !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user.id));
    }
  };

  const handleViewUser = (id: string) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      setCurrentUser(user);
      setShowViewModal(true);
    }
  };

  const handleAddUser = () => {
    router.push("/admin/people/users/add");
  };

  const handleEditUser = (id: string) => {
    router.push(`/admin/people/users/edit/${id}`);
  };

  const handleDelete = (user?: User) => {
    if (user) {
      setCurrentUser(user);
    }
    setShowDeleteModal(true);
  };

  const handleLockAccount = async (userId: string) => {
    try {
      const response = await UserApi.toggleUserStatus(userId, false);
      if (response.error) {
        setError(response.error);
      } else {
        setSuccess("Account locked successfully");
        fetchUsers();
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (_error) {
      setError("Failed to lock account");
    }
  };

  const handleUnlockAccount = async (userId: string) => {
    try {
      const response = await UserApi.toggleUserStatus(userId, true);
      if (response.error) {
        setError(response.error);
      } else {
        setSuccess("Account unlocked successfully");
        fetchUsers();
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (_error) {
      setError("Failed to unlock account");
    }
  };

  const confirmDelete = async () => {
    try {
      if (currentUser) {
        const response = await UserApi.deleteUser(currentUser.id);
        if (response.error) {
          setError(response.error);
        } else {
          setSuccess("User deleted successfully");
          fetchUsers();
        }
      } else if (selectedUsers.length > 0) {
        for (const userId of selectedUsers) {
          await UserApi.deleteUser(userId);
        }
        setSuccess(`${selectedUsers.length} users deleted successfully`);
        setSelectedUsers([]);
        fetchUsers();
      }
    } catch (_error) {
      setError("Failed to delete user(s)");
    } finally {
      setShowDeleteModal(false);
      setCurrentUser(null);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const handleFilterChange = (key: keyof UserFiltersType, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  return {
    users,
    loading,
    error,
    success,
    selectedUsers,
    searchTerm,
    currentPage,
    totalPages,
    filters,
    showDeleteModal,
    showViewModal,
    currentUser,
    setSearchTerm,
    setCurrentPage,
    setShowDeleteModal,
    setShowViewModal,
    setCurrentUser,
    toggleUserSelection,
    toggleSelectAll,
    handleViewUser,
    handleAddUser,
    handleEditUser,
    handleDelete,
    handleLockAccount,
    handleUnlockAccount,
    confirmDelete,
    handleFilterChange,
  };
}
