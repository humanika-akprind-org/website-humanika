/**
 * Drive Image Entity - Domain Layer
 * Part of Clean Architecture: Domain Layer (Entities)
 *
 * This file defines types for Google Drive image proxy operations.
 */

/**
 * Input parameters for fetching a drive image
 */
export interface DriveImageInput {
  /** The Google Drive file ID */
  fileId: string;
  /** Optional access token for private files */
  accessToken?: string;
}

/**
 * Result of fetching a drive image
 */
export interface DriveImageResult {
  /** The image data as Uint8Array */
  data: Uint8Array;
  /** Content type of the image */
  contentType: string;
  /** Whether the image was fetched successfully */
  success: boolean;
  /** Whether this is a placeholder fallback */
  isPlaceholder?: boolean;
}

/**
 * Options for drive image fetching
 */
export interface DriveImageOptions {
  /** Cache control header value */
  cacheControl?: string;
  /** Default content type if not provided by API */
  defaultContentType?: string;
  /** Whether to include placeholder on 404 */
  enablePlaceholder?: boolean;
  /** Placeholder SVG content */
  placeholderSvg?: string;
}

// ============================================================================
// Drive Image Metadata Types
// ============================================================================

/**
 * Input parameters for fetching drive image metadata
 */
export interface DriveImageMetadataInput {
  /** The Google Drive file ID */
  fileId: string;
  /** Optional access token for private files */
  accessToken?: string;
}

/**
 * Result of fetching drive image metadata
 */
export interface DriveImageMetadataResult {
  /** Image resolution in format "width × height" or null */
  resolution: string | null;
  /** Image format (e.g., "JPEG", "PNG") or null */
  format: string | null;
  /** Human-readable file size (e.g., "1.5 MB") or null */
  size: string | null;
  /** Raw file size in bytes */
  fileSize: number;
  /** Raw mime type */
  mimeType: string;
  /** Image width in pixels */
  width: number;
  /** Image height in pixels */
  height: number;
  /** Whether metadata was fetched successfully */
  success: boolean;
}

/**
 * Options for drive image metadata fetching
 */
export interface DriveImageMetadataOptions {
  /** Google API key for public files */
  apiKey?: string;
  /** Default format if not detected */
  defaultFormat?: string;
}
