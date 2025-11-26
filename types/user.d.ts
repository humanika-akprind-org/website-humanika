import { UserRole, Department, Position } from "./enums";

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  department: Department | null;
  position: Position | null;
  isActive: boolean;
  verifiedAccount: boolean;
  attemptLogin: number;
  blockExpires: Date | null;
  createdAt: Date;
  updatedAt: Date;
  avatarColor: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  username: string;
  password: string;
  role?: UserRole;
  department?: Department;
  position?: Position;
  isActive?: boolean;
}

export interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface UserFilters {
  role: UserRole | "";
  department: Department | "";
  isActive: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  username: string;
  password: string;
  role?: UserRole;
  department?: Department;
  position?: Position;
  isActive?: boolean;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  username?: string;
  password?: string;
  role?: UserRole;
  department?: Department;
  position?: Position;
  isActive?: boolean;
}

export interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface BulkOperationResponse {
  count: number;
  message?: string;
}

export interface VerificationResponse {
  message: string;
}

interface UserTableProps {
  users: User[];
  selectedUsers: string[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onUserSelect: (id: string) => void;
  onSelectAll: () => void;
  onViewUser: (id: string) => void;
  onEditUser: (id: string) => void;
  onDeleteUser: (user: User) => void;
  onLockAccount: (userId: string) => void;
  onUnlockAccount: (userId: string) => void;
  onPageChange: (page: number) => void;
}
