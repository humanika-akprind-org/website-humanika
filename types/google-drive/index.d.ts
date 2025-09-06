// types/google-drive/index.d.ts
declare module "google-drive" {
  export interface GoogleDriveOptions {
    clientId?: string;
    apiKey?: string;
    scope?: string;
    discoveryDocs?: string[];
    // Tambahkan properti lain yang diketahui
  }

  export interface GoogleDriveFile {
    id?: string;
    name?: string;
    mimeType?: string;
    createdTime?: string;
    modifiedTime?: string;
    size?: number;
    // Tambahkan properti lain yang diketahui
  }

  export interface FileList {
    files?: GoogleDriveFile[];
    nextPageToken?: string;
  }

  export class GoogleDrive {
    constructor(options?: GoogleDriveOptions);

    // Tambahkan method signatures jika diketahui
    listFiles?(query?: string): Promise<FileList>;
    getFile?(fileId: string): Promise<GoogleDriveFile>;
    uploadFile?(
      file: File,
      metadata?: Partial<GoogleDriveFile>
    ): Promise<GoogleDriveFile>;
  }
}

export * from "./api";
export * from "./common";
export * from "./components";
export * from "./hooks";
