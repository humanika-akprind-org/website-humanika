import { type DriveFile } from "./common";

export interface UseFileOperationsParams {
  file: File;
  fileName: string;
  folderId: string;
  accessToken: string;
}

export interface UseRenameFileParams {
  fileId: string;
  fileName: string;
  accessToken: string;
}

export interface UseFileOperationsReturn {
  isLoading: boolean;
  error: string | null;
  uploadFile: (params: {
    file: File;
    fileName: string;
    folderId: string;
    accessToken: string;
  }) => Promise<boolean>;
  renameFile: (params: {
    fileId: string;
    fileName: string;
    accessToken: string;
  }) => Promise<boolean>;
  deleteFile: (params: {
    fileId: string;
    accessToken: string;
  }) => Promise<boolean>;
}

export interface UseDriveFoldersReturn {
  folders: DriveFile[];
  isLoading: boolean;
  error: string | null;
  fetchFolders: () => Promise<void>;
}

export interface UseDriveFormProps {
  accessToken: string;
  file?: DriveFile;
}

export interface UseDriveFormReturn {
  // State
  selectedFile: File | null;
  fileName: string;
  fileExtension: string;
  selectedFolderId: string;
  isLoading: {
    upload: boolean;
    folders: boolean;
  };
  error: string | null;
  folderOptions: Array<{ id: string; name: string }>;

  // Handlers
  setSelectedFile: (file: File | null) => void;
  setFileName: (name: string) => void;
  setSelectedFolderId: (id: string) => void;
  setError: (error: string | null) => void;
  handleSubmit: (e: React.FormEvent) => Promise<boolean>;
  handleFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFolderChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}
