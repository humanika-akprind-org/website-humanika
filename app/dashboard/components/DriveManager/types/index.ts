import { drive_v3 } from "googleapis/build/src/apis/drive/v3";

export interface DriveManagerProps {
  files: drive_v3.Schema$File[] | undefined;
  accessToken: string;
}

export interface ApiRequestBody {
  action: string;
  fileId?: string;
  fileName?: string;
  accessToken: string;
}

export interface LoadingState {
  files: boolean;
  folders: boolean;
  upload: boolean;
  operations: boolean;
}

export interface FolderOption {
  id: string;
  name: string;
}

export interface UploadSectionProps {
  selectedFile: File | null;
  selectedFolderId: string;
  folderOptions: FolderOption[];
  isLoading: LoadingState;
  fileNameInput: string; // Add this line
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFolderChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onUpload: () => Promise<void>;
}