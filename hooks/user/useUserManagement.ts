import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UserApi } from "@/use-cases/api/user";
import type { User, UserFilters as UserFiltersType } from "@/types/user";

interface UseUserManagementOptions {
  /** When true, returns all users without pagination (for select inputs) */
  allData?: boolean;
}

export function useUserManagement(options?: UseUserManagementOptions) {
  const router = useRouter();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<UserFiltersType>({
    role: "all",
    department: "all",
    position: "all",
    isActive: "all",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { allData = false } = options || {};

  const fetchAllUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await UserApi.getUsers({
        allUsers: true, // Fetch all users for client-side filtering
      });

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setAllUsers(response.data.users.filter((user) => user.verifiedAccount));
      }
    } catch (_error) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  // Apply client-side filtering and pagination
  useEffect(() => {
    // When allData is true, return all users without pagination/filtering
    if (allData) {
      setUsers(allUsers);
      setTotalPages(1);
      return;
    }

    let filtered = allUsers;

    // Search filter
    if (debouncedSearchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          user.email
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          user.username
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase())
      );
    }

    // Role filter
    if (filters.role && filters.role !== "all") {
      filtered = filtered.filter((user) => user.role === filters.role);
    }

    // Department filter
    if (filters.department && filters.department !== "all") {
      filtered = filtered.filter(
        (user) => user.department === filters.department
      );
    }

    // Position filter
    if (filters.position && filters.position !== "all") {
      filtered = filtered.filter((user) => user.position === filters.position);
    }

    // Active status filter
    if (filters.isActive && filters.isActive !== "all") {
      filtered = filtered.filter(
        (user) => user.isActive === (filters.isActive === "true")
      );
    }

    // Apply pagination
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    const paginatedUsers = filtered.slice(startIndex, endIndex);

    setUsers(paginatedUsers);
    setTotalPages(Math.ceil(filtered.length / 10));
  }, [
    allUsers,
    debouncedSearchTerm,
    currentPage,
    filters.role,
    filters.department,
    filters.position,
    filters.isActive,
    allData,
  ]);

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

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
        fetchAllUsers();
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
        fetchAllUsers();
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
          fetchAllUsers();
        }
      } else if (selectedUsers.length > 0) {
        for (const userId of selectedUsers) {
          await UserApi.deleteUser(userId);
        }
        setSuccess(`${selectedUsers.length} users deleted successfully`);
        setSelectedUsers([]);
        fetchAllUsers();
      }
    } catch (_error) {
      setError("Failed to delete user(s)");
    } finally {
      setShowDeleteModal(false);
      setCurrentUser(null);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const handleVerify = async () => {
    try {
      if (selectedUsers.length > 0) {
        for (const userId of selectedUsers) {
          await UserApi.verifyUser(userId);
        }
        setSuccess(`${selectedUsers.length} users verified successfully`);
        setSelectedUsers([]);
        fetchAllUsers();
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (_error) {
      setError("Failed to verify user(s)");
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
    handleVerify,
  };
}
