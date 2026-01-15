export interface ApiResponse {
  success: boolean;
  message?: string;
  url?: string;
}

export interface ApiCallParams {
  action: "getUrl" | "delete" | "upload" | "rename" | "setPublicAccess";
  fileId?: string;
  accessToken: string;
  file?: File;
  fileName?: string;
  folderId?: string;
  permission?: {
    type: string;
    role: string;
    allowFileDiscovery: boolean;
  };
}

export interface ApiRequestBody {
  action: string;
  fileId?: string | null;
  fileName?: string;
  newName?: string;
  accessToken: string;
  folderId?: string;
  permission?: {
    type: string;
    role: string;
    allowFileDiscovery: boolean;
  };
}
