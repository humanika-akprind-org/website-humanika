import { type drive_v3 } from "googleapis/build/src/apis/drive/v3";
import { type LoadingState, type DriveFile } from "./common";

export interface DeleteModalProps {
  isOpen: boolean;
  fileName: string;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
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
