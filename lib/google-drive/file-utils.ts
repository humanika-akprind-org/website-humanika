import { callApi } from "@/use-cases/api/google-drive";

/**
 * Helper function to check if a file is from Google Drive
 * @param file - File URL or file ID
 * @returns boolean indicating if it's a Google Drive file
 */
export const isGoogleDriveFile = (file: string | null | undefined): boolean => {
  if (!file) return false;
  return (
    file.includes("drive.google.com") || file.match(/^[a-zA-Z0-9_-]+$/) !== null
  );
};

/**
 * Helper function to get file ID from file URL or file ID
 * @param file - File URL or file ID
 * @returns Google Drive file ID or null if not found
 */
export const getFileIdFromFile = (
  file: string | null | undefined
): string | null => {
  if (!file) return null;

  if (file.includes("drive.google.com")) {
    const fileIdMatch = file.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    return fileIdMatch ? fileIdMatch[1] : null;
  } else if (file.match(/^[a-zA-Z0-9_-]+$/)) {
    return file;
  }
  return null;
};

/**
 * Function to delete file from Google Drive
 * @param fileId - Google Drive file ID
 * @param accessToken - Google Drive access token
 * @returns Promise<boolean> indicating if deletion was successful
 */
export const deleteGoogleDriveFile = async (
  fileId: string,
  accessToken: string
): Promise<boolean> => {
  try {
    await callApi({
      action: "delete",
      fileId,
      accessToken,
    });
    return true;
  } catch (error) {
    console.error("Failed to delete file from Google Drive:", error);
    return false;
  }
};
