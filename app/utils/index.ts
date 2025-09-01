import { type drive_v3 } from "googleapis/build/src/apis/drive/v3";
import { type FolderOption } from "../../types/google-drive";

export const getFolderOptions = (
  folders: drive_v3.Schema$File[]
): FolderOption[] => [
  { id: "root", name: "📁 Root Folder" },
  ...folders
    .filter((f): f is { id: string; name: string } => !!f.id)
    .map((f) => ({ id: f.id, name: `📂 ${f.name}` })),
];

export const loadFolderFromLocalStorage = (): string => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("lastUsedFolderId") || "root";
  }
  return "root";
};

export const saveFolderToLocalStorage = (folderId: string): void => {
  if (folderId && folderId !== "root" && typeof window !== "undefined") {
    localStorage.setItem("lastUsedFolderId", folderId);
  }
};
