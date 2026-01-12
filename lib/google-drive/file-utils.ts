/**
 * Google Drive File Utilities
 * Centralized utilities for handling Google Drive file URLs and IDs
 */

import { callApi } from "@/use-cases/api/google-drive";

// ============= Constants =============

const DRIVE_URL_PATTERN = /drive\.google\.com/;
const FILE_ID_PATTERN = /^[a-zA-Z0-9_-]+$/;
const DRIVE_FILE_PATH_PATTERN = /\/(?:file|d)\/d\/([a-zA-Z0-9_-]+)/;

// ============= Type Definitions =============

export type GoogleDriveFileInput = string | null | undefined;

// ============= Validation Helpers =============

/**
 * Check if a string is a valid Google Drive file ID
 * @param id - String to check
 * @returns boolean indicating if it's a valid file ID
 */
const isValidFileId = (id: string): boolean => FILE_ID_PATTERN.test(id);

/**
 * Check if a string is a Google Drive URL
 * @param url - String to check
 * @returns boolean indicating if it's a Google Drive URL
 */
const isGoogleDriveUrl = (url: string): boolean => DRIVE_URL_PATTERN.test(url);

// ============= Main Functions =============

/**
 * Check if a file is from Google Drive
 * @param file - File URL, file ID, or null/undefined
 * @returns boolean indicating if it's a Google Drive file
 */
export const isGoogleDriveFile = (file: GoogleDriveFileInput): boolean => {
  if (!file) return false;
  return isGoogleDriveUrl(file) || isValidFileId(file);
};

/**
 * Extract file ID from Google Drive URL or return the file ID directly
 * @param file - File URL, file ID, or null/undefined
 * @returns Google Drive file ID or null if not found
 */
export const getFileIdFromFile = (
  file: GoogleDriveFileInput
): string | null => {
  if (!file) return null;

  // If it's already a file ID, return it directly
  if (isValidFileId(file)) {
    return file;
  }

  // Try to extract from URL
  const match = file.match(DRIVE_FILE_PATH_PATTERN);
  return match ? match[1] : null;
};

/**
 * Convert a Google Drive file URL or ID to a direct preview URL
 * @param file - File URL, file ID, or null/undefined
 * @returns Preview URL or empty string if not a valid Google Drive file
 */
export const getGoogleDrivePreviewUrl = (
  file: GoogleDriveFileInput
): string => {
  const fileId = getFileIdFromFile(file);
  return fileId ? `/api/drive-image?fileId=${fileId}` : "";
};

/**
 * Convert a Google Drive file ID to a direct download/view URL
 * @param fileId - Google Drive file ID
 * @param exportType - Type of URL ('view' | 'download' | 'uc')
 * @returns Direct URL or empty string if invalid
 */
export const getGoogleDriveDirectUrl = (
  fileId: string,
  exportType: "view" | "download" | "uc" = "view"
): string => {
  if (!fileId || !isValidFileId(fileId)) return "";

  switch (exportType) {
    case "uc":
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    case "download":
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    case "view":
    default:
      return `https://drive.google.com/file/d/${fileId}/view`;
  }
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

/**
 * Safely delete a Google Drive file with validation
 * @param file - File URL or file ID
 * @param accessToken - Google Drive access token
 * @returns Promise<boolean> indicating if deletion was successful
 */
export const safeDeleteGoogleDriveFile = async (
  file: GoogleDriveFileInput,
  accessToken: string
): Promise<boolean> => {
  const fileId = getFileIdFromFile(file);
  if (!fileId) return false;
  return deleteGoogleDriveFile(fileId, accessToken);
};
