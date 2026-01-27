import { type drive_v3 } from "googleapis/build/src/apis/drive/v3";

export interface LoadingState {
  files: boolean;
  folders: boolean;
  operations: boolean;
}

export interface BasicLoadingState {
  isLoading: boolean;
}

export interface ErrorState {
  error: string | null;
}

export interface DriveFile extends drive_v3.Schema$File {}

export interface EditDriveFilePageProps {
  params: {
    id: string;
  };
}