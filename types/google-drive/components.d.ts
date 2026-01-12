import { type drive_v3 } from "googleapis/build/src/apis/drive/v3";
import { type LoadingState, type DriveFile } from "./common";

// ============================================================================
// Component Props Interfaces
// ============================================================================

export interface DeleteModalProps {
  isOpen: boolean;
  fileName: string;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export interface DriveControlBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCreateFolder: () => void;
  onUpload: () => void;
  onRefresh: () => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  isLoading: boolean;
  isOperating: boolean;
}

export interface DriveErrorStateProps {
  error: string | null;
  onRetry: () => void;
}

export interface DriveEmptyStateProps {
  searchQuery: string;
  onClearSearch: () => void;
}

export interface DriveLoadingStateProps {
  count?: number;
}

export interface DriveFileCardProps {
  file: DriveFile;
  getFileIcon: (mimeType?: string | null) => React.ReactNode;
  formatFileSize: (bytes?: number | string | null) => string;
  isFolderShortcut: (file: DriveFile) => boolean;
  getShortcutTargetId: (file: DriveFile) => string | null;
  navigateToFolder: (folderId: string, folderName: string) => void;
  handleCopyUrl?: (fileId?: string | null) => void;
  handleOpenInDrive?: (fileId?: string | null) => void;
  handleRename: (fileId?: string | null, fileName?: string | null) => void;
  handleDelete: (fileId?: string | null, fileName?: string | null) => void;
  isLoading: boolean;
  isOperating: boolean;
  copiedFileId?: string | null;
}

export interface DriveFileRowProps {
  file: DriveFile;
  getFileIcon: (mimeType?: string | null) => React.ReactNode;
  formatFileSize: (bytes?: number | string | null) => string;
  isFolderShortcut: (file: DriveFile) => boolean;
  getShortcutTargetId: (file: DriveFile) => string | null;
  navigateToFolder: (folderId: string, folderName: string) => void;
  handleCopyUrl: (fileId?: string | null) => void;
  handleOpenInDrive: (fileId?: string | null) => void;
  handleRename: (fileId?: string | null, fileName?: string | null) => void;
  handleDelete: (fileId?: string | null, fileName?: string | null) => void;
  isLoading: boolean;
  isOperating: boolean;
  copiedFileId: string | null;
}

export interface DriveGridViewProps {
  files: DriveFile[];
  getFileIcon: (mimeType?: string | null) => React.ReactNode;
  formatFileSize: (bytes?: number | string | null) => string;
  isFolderShortcut: (file: DriveFile) => boolean;
  getShortcutTargetId: (file: DriveFile) => string | null;
  navigateToFolder: (folderId: string, folderName: string) => void;
  handleCopyUrl: (fileId?: string | null) => void;
  handleOpenInDrive: (fileId?: string | null) => void;
  handleRename: (fileId?: string | null, fileName?: string | null) => void;
  handleDelete: (fileId?: string | null, fileName?: string | null) => void;
  isLoading: boolean;
  isOperating: boolean;
  copiedFileId: string | null;
}

export interface DriveListViewProps {
  files: DriveFile[];
  getFileIcon: (mimeType?: string | null) => React.ReactNode;
  formatFileSize: (bytes?: number | string | null) => string;
  isFolderShortcut: (file: DriveFile) => boolean;
  getShortcutTargetId: (file: DriveFile) => string | null;
  navigateToFolder: (folderId: string, folderName: string) => void;
  handleCopyUrl: (fileId?: string | null) => void;
  handleOpenInDrive: (fileId?: string | null) => void;
  handleRename: (fileId?: string | null, fileName?: string | null) => void;
  handleDelete: (fileId?: string | null, fileName?: string | null) => void;
  isLoading: boolean;
  isOperating: boolean;
  copiedFileId: string | null;
}

export interface DriveToastProps {
  toast: {
    type: "success" | "error" | "info";
    message: string;
  } | null;
}

export interface AuthGuardProps {
  accessToken: string;
  children: React.ReactNode;
}

export interface DriveFormProps {
  accessToken: string;
  file?: DriveFile;
  onSuccess?: () => void;
}

export interface LoadingStateForm {
  upload: boolean;
  folders: boolean;
}

export interface PageHeaderProps {
  title: string;
  showAddButton?: boolean;
  addButtonHref?: string;
  addButtonText?: string;
}

export interface DriveTableProps {
  files: DriveFile[];
  accessToken: string;
  currentFolderId?: string;
  folderPath?: BreadcrumbItem[];
  onNavigateToFolder?: (folderId: string, folderName: string) => void;
  onNavigateToParent?: () => void;
}

export interface LoadingStateTable extends LoadingState {}

// Breadcrumb navigation types
export interface BreadcrumbItem {
  id: string;
  name: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  currentFolderId?: string;
  onNavigate: (folderId: string) => void;
  isLoading?: boolean;
}
