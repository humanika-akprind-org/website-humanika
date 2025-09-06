import { useState, useEffect, useCallback } from "react";
import { useDriveFolders } from "./useDriveFolders";
import { useFileOperations } from "./useFileOperations";
import { getFolderOptions } from "@/app/utils/google-drive";
import type {
  UseDriveFormProps,
  UseDriveFormReturn,
} from "@/types/google-drive";

export function useDriveForm({
  accessToken,
  file,
}: UseDriveFormProps): UseDriveFormReturn {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileExtension, setFileExtension] = useState<string>("");
  const [selectedFolderId, setSelectedFolderId] = useState<string>("root");
  const [formError, setFormError] = useState<string | null>(null);

  const {
    folders,
    isLoading: foldersLoading,
    error: foldersError,
    fetchFolders,
  } = useDriveFolders(accessToken);
  const {
    isLoading: operationsLoading,
    error: operationsError,
    uploadFile,
    renameFile,
  } = useFileOperations();

  const extractFileInfo = useCallback((file: File) => {
    const fileNameParts = file.name.split(".");
    const extension = fileNameParts.length > 1 ? fileNameParts.pop() : "";
    return {
      name: fileNameParts.join("."),
      extension: extension || "",
    };
  }, []);

  // Fetch folders on mount
  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  // Set initial file name and extension if editing
  useEffect(() => {
    if (file?.name) {
      const parts = file.name.split(".");
      const extension = parts.length > 1 ? parts[parts.length - 1] : "";
      const name = parts.length > 1 ? parts.slice(0, -1).join(".") : parts[0];
      setFileName(name);
      setFileExtension(extension);
    }
  }, [file]);

  // Update file extension when file is selected
  useEffect(() => {
    if (selectedFile) {
      const { name, extension } = extractFileInfo(selectedFile);
      setFileExtension(extension);

      if (fileName === "" || fileName === name) {
        setFileName(name);
      }
    }
  }, [selectedFile, fileName, extractFileInfo]);

  const handleSubmit = async (e: React.FormEvent): Promise<boolean> => {
    e.preventDefault();
    setFormError(null);

    if (file) {
      // Edit mode - rename file
      if (!fileName.trim()) {
        setFormError("Nama file tidak boleh kosong");
        return false;
      }

      const newFileName = `${fileName.trim()}${
        fileExtension ? `.${fileExtension}` : ""
      }`;
      const success = await renameFile({
        fileId: file.id!,
        fileName: newFileName,
        accessToken,
      });

      return success;
    } else {
      // Add mode - upload file
      if (!selectedFile) {
        setFormError("Please select a file to upload");
        return false;
      }

      if (!fileName.trim()) {
        setFormError("Nama file tidak boleh kosong");
        return false;
      }

      const newFileName = `${fileName.trim()}${
        fileExtension ? `.${fileExtension}` : ""
      }`;
      const success = await uploadFile({
        file: selectedFile,
        fileName: newFileName,
        folderId: selectedFolderId,
        accessToken,
      });

      return success;
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
      setFormError(null);
    }
  };

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value);
  };

  const handleFolderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFolderId(e.target.value);
  };

  const folderOptions = getFolderOptions(folders);
  const error = formError || foldersError || operationsError;

  return {
    // State
    selectedFile,
    fileName,
    fileExtension,
    selectedFolderId,
    isLoading: {
      upload: operationsLoading,
      folders: foldersLoading,
    },
    error,
    folderOptions,

    // Handlers
    setSelectedFile,
    setFileName,
    setSelectedFolderId,
    setError: setFormError,
    handleSubmit,
    handleFileInputChange,
    handleFileNameChange,
    handleFolderChange,
  };
}
