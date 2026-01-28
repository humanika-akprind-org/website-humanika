/**
 * Get Drive Image Metadata Use Case - Complex read operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles fetching image metadata from Google Drive with:
 * - Input validation
 * - Authentication handling (API key + OAuth)
 * - Multiple fallback strategies
 * - Consistent response format
 */

import type {
  DriveImageMetadataInput,
  DriveImageMetadataResult,
  DriveImageMetadataOptions,
} from "@/domain/entities/drive-image.entity";

/**
 * Google Drive API base URL
 */
const GOOGLE_DRIVE_API_BASE = "https://www.googleapis.com/drive/v3/files";

/**
 * Google Drive public download URL pattern
 */
const GOOGLE_DRIVE_PUBLIC_URL = "https://drive.google.com/uc?export=view&id=";

/**
 * Get Drive Image Metadata Use Case
 *
 * Encapsulates the business logic for fetching image metadata from Google Drive.
 */
export class GetDriveImageMetadataUseCase {
  private readonly options: Required<DriveImageMetadataOptions>;

  /**
   * Create a new GetDriveImageMetadataUseCase instance
   * @param options - Configuration options for metadata fetching
   */
  constructor(options?: Partial<DriveImageMetadataOptions>) {
    this.options = {
      apiKey: options?.apiKey || process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "",
      defaultFormat: options?.defaultFormat || "JPEG",
    };
  }

  /**
   * Execute the use case to fetch image metadata
   *
   * @param input - Metadata input parameters
   * @returns Promise resolving to metadata result
   */
  async execute(
    input: DriveImageMetadataInput,
  ): Promise<DriveImageMetadataResult> {
    // 1. Validate input
    this.validateInput(input);

    // 2. Try to fetch metadata from Google Drive API v3
    const metadataResult = await this.fetchFromGoogleDriveApi(input);

    if (metadataResult.success) {
      return metadataResult;
    }

    // 3. Fallback: Get metadata from image URL headers
    const headerResult = await this.fetchFromImageHeaders(input);

    if (headerResult.success) {
      return headerResult;
    }

    // 4. Fallback: Get metadata from direct download URL headers
    const directResult = await this.fetchFromDirectUrl(input);

    if (directResult.success) {
      return directResult;
    }

    // 5. Return null values if all fallbacks fail
    return this.getNullResult();
  }

  /**
   * Execute with URL search params (for direct route handler use)
   *
   * @param searchParams - URL search parameters
   * @returns Promise resolving to metadata result
   */
  async executeFromSearchParams(
    searchParams: URLSearchParams,
  ): Promise<DriveImageMetadataResult> {
    const input: DriveImageMetadataInput = {
      fileId: searchParams.get("fileId") || "",
      accessToken: searchParams.get("accessToken") || undefined,
    };

    return this.execute(input);
  }

  /**
   * Validate input parameters
   * @throws Error if validation fails
   */
  private validateInput(input: DriveImageMetadataInput): void {
    const errors: string[] = [];

    if (!input.fileId || input.fileId.trim() === "") {
      errors.push("File ID is required");
    }

    if (input.fileId && input.fileId.length < 5) {
      errors.push("Invalid file ID format");
    }

    // Validate file ID format (Google Drive IDs are typically 44+ chars)
    if (input.fileId && !/^[a-zA-Z0-9_-]+$/.test(input.fileId)) {
      errors.push("File ID contains invalid characters");
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }
  }

  /**
   * Calculate size in human-readable format
   */
  private formatSize(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }

  /**
   * Get format from mimeType
   */
  private getFormat(mimeType: string): string {
    const format = mimeType.split("/")[1]?.toUpperCase();
    return format || this.options.defaultFormat;
  }

  /**
   * Fetch metadata from Google Drive API v3
   */
  private async fetchFromGoogleDriveApi(
    input: DriveImageMetadataInput,
  ): Promise<DriveImageMetadataResult> {
    try {
      const metadataUrl = new URL(`${GOOGLE_DRIVE_API_BASE}/${input.fileId}`);
      metadataUrl.searchParams.set(
        "fields",
        "fileSize,mimeType,imageMediaMetadata",
      );

      let response: Response | null = null;

      // Try with API key first (for public files)
      if (this.options.apiKey) {
        metadataUrl.searchParams.set("key", this.options.apiKey);
        response = await fetch(metadataUrl.toString());
      }

      // Try with OAuth token if API key failed or not available
      if ((!response || !response.ok) && input.accessToken) {
        metadataUrl.searchParams.delete("key");
        response = await fetch(metadataUrl.toString(), {
          headers: {
            Authorization: `Bearer ${input.accessToken}`,
          },
        });
      }

      // If we have a successful response, use the metadata
      if (response && response.ok) {
        const metadata = await response.json();

        const fileSize = metadata.fileSize || 0;
        const mimeType = metadata.mimeType || "image/jpeg";
        const imageMetadata = metadata.imageMediaMetadata || {};
        const width = imageMetadata.width || 0;
        const height = imageMetadata.height || 0;

        return {
          resolution: width > 0 && height > 0 ? `${width} × ${height}` : null,
          format: this.getFormat(mimeType),
          size: fileSize > 0 ? this.formatSize(fileSize) : null,
          fileSize,
          mimeType,
          width,
          height,
          success: true,
        };
      }

      return this.getNullResult();
    } catch (error) {
      console.error("Error fetching metadata from Google Drive API:", error);
      return this.getNullResult();
    }
  }

  /**
   * Fetch metadata from image URL headers
   */
  private async fetchFromImageHeaders(
    input: DriveImageMetadataInput,
  ): Promise<DriveImageMetadataResult> {
    try {
      const imageUrl = `${GOOGLE_DRIVE_PUBLIC_URL}${input.fileId}`;
      const headResponse = await fetch(imageUrl, { method: "HEAD" });

      if (headResponse.ok) {
        const contentLength = headResponse.headers.get("Content-Length");
        const contentType =
          headResponse.headers.get("Content-Type") || "image/jpeg";

        const fileSize = contentLength ? parseInt(contentLength, 10) : 0;

        return {
          resolution: null,
          format: this.getFormat(contentType),
          size: fileSize > 0 ? this.formatSize(fileSize) : null,
          fileSize,
          mimeType: contentType,
          width: 0,
          height: 0,
          success: true,
        };
      }

      return this.getNullResult();
    } catch (error) {
      console.error("Error fetching metadata from image headers:", error);
      return this.getNullResult();
    }
  }

  /**
   * Fetch metadata from direct download URL headers
   */
  private async fetchFromDirectUrl(
    input: DriveImageMetadataInput,
  ): Promise<DriveImageMetadataResult> {
    try {
      const directUrl = `${GOOGLE_DRIVE_API_BASE}/${input.fileId}?alt=media`;
      let directResponse: Response;

      if (input.accessToken) {
        directResponse = await fetch(directUrl, {
          headers: { Authorization: `Bearer ${input.accessToken}` },
        });
      } else {
        directResponse = await fetch(directUrl);
      }

      if (directResponse.ok) {
        const contentLength = directResponse.headers.get("Content-Length");
        const contentType =
          directResponse.headers.get("Content-Type") || "image/jpeg";

        const fileSize = contentLength ? parseInt(contentLength, 10) : 0;

        return {
          resolution: null,
          format: this.getFormat(contentType),
          size: fileSize > 0 ? this.formatSize(fileSize) : null,
          fileSize,
          mimeType: contentType,
          width: 0,
          height: 0,
          success: true,
        };
      }

      return this.getNullResult();
    } catch (error) {
      console.error("Error fetching metadata from direct URL:", error);
      return this.getNullResult();
    }
  }

  /**
   * Get null result when all fallbacks fail
   */
  private getNullResult(): DriveImageMetadataResult {
    return {
      resolution: null,
      format: null,
      size: null,
      fileSize: 0,
      mimeType: "image/jpeg",
      width: 0,
      height: 0,
      success: false,
    };
  }
}
