/**
 * Get Drive Image Use Case - Complex read operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles fetching images from Google Drive with:
 * - Input validation
 * - Authentication handling
 * - Error handling with placeholder fallback
 * - Consistent response format
 */

import type {
  DriveImageInput,
  DriveImageResult,
  DriveImageOptions,
} from "@/domain/entities/drive-image.entity";

/**
 * Default placeholder SVG for 404 or error cases
 */
const DEFAULT_PLACEHOLDER_SVG = `
<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" fill="#E5E7EB"/>
  <circle cx="32" cy="24" r="8" fill="#9CA3AF"/>
  <path d="M16 48c0-8.8 7.2-16 16-16s16 7.2 16 16" fill="#9CA3AF"/>
</svg>
`;

/**
 * Google Drive API base URL for file download
 */
const GOOGLE_DRIVE_API_BASE = "https://www.googleapis.com/drive/v3/files";

/**
 * Google Drive public download URL pattern
 */
const GOOGLE_DRIVE_PUBLIC_URL = "https://drive.google.com/uc?export=view&id=";

/**
 * Get Drive Image Use Case
 *
 * Encapsulates the business logic for fetching/proxying images from Google Drive.
 */
export class GetDriveImageUseCase {
  private readonly options: Required<DriveImageOptions>;

  /**
   * Create a new GetDriveImageUseCase instance
   * @param options - Configuration options for image fetching
   */
  constructor(options?: Partial<DriveImageOptions>) {
    this.options = {
      cacheControl: options?.cacheControl || "public, max-age=86400",
      defaultContentType: options?.defaultContentType || "image/jpeg",
      enablePlaceholder: options?.enablePlaceholder ?? true,
      placeholderSvg: options?.placeholderSvg || DEFAULT_PLACEHOLDER_SVG,
    };
  }

  /**
   * Execute the use case to fetch an image from Google Drive
   *
   * @param input - Drive image input parameters
   * @returns Promise resolving to drive image result
   */
  async execute(input: DriveImageInput): Promise<DriveImageResult> {
    // 1. Validate input
    this.validateInput(input);

    // 2. Fetch image from Google Drive
    const result = await this.fetchFromGoogleDrive(input);

    // 3. Return result (placeholder fallback handled in fetch)
    return result;
  }

  /**
   * Execute with URL search params (for direct route handler use)
   *
   * @param searchParams - URL search parameters
   * @returns Promise resolving to drive image result
   */
  async executeFromSearchParams(
    searchParams: URLSearchParams,
  ): Promise<DriveImageResult> {
    const input: DriveImageInput = {
      fileId: searchParams.get("fileId") || "",
      accessToken: searchParams.get("accessToken") || undefined,
    };

    return this.execute(input);
  }

  /**
   * Validate input parameters
   * @throws Error if validation fails
   */
  private validateInput(input: DriveImageInput): void {
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
   * Fetch image from Google Drive API
   *
   * @param input - Drive image input parameters
   * @returns Promise resolving to drive image result
   */
  private async fetchFromGoogleDrive(
    input: DriveImageInput,
  ): Promise<DriveImageResult> {
    try {
      let response: Response;

      if (input.accessToken) {
        // For private files, use Google Drive API with authentication
        response = await fetch(
          `${GOOGLE_DRIVE_API_BASE}/${input.fileId}?alt=media`,
          {
            headers: {
              Authorization: `Bearer ${input.accessToken}`,
            },
          },
        );
      } else {
        // For public files, use direct download URL
        response = await fetch(`${GOOGLE_DRIVE_PUBLIC_URL}${input.fileId}`);
      }

      // Handle non-OK responses
      if (!response.ok) {
        console.error(`Google Drive API response status: ${response.status}`);
        console.error(
          "Response headers:",
          Object.fromEntries(response.headers.entries()),
        );

        // If file not found (404), return placeholder
        if (response.status === 404) {
          return this.getPlaceholderResult();
        }

        throw new Error(
          `Failed to fetch image: ${response.status} ${response.statusText}`,
        );
      }

      // Convert response to Uint8Array
      const imageArrayBuffer = await response.arrayBuffer();
      const imageUint8Array = new Uint8Array(imageArrayBuffer);

      return {
        data: imageUint8Array,
        contentType:
          response.headers.get("Content-Type") ||
          this.options.defaultContentType,
        success: true,
      };
    } catch (error) {
      console.error("Error fetching from Google Drive:", error);

      // Return placeholder on error if enabled
      if (this.options.enablePlaceholder) {
        return this.getPlaceholderResult();
      }

      throw error;
    }
  }

  /**
   * Get a placeholder result for error/404 cases
   *
   * @returns Drive image result with placeholder SVG
   */
  private getPlaceholderResult(): DriveImageResult {
    const svgUint8Array = new TextEncoder().encode(this.options.placeholderSvg);

    return {
      data: svgUint8Array,
      contentType: "image/svg+xml",
      success: true,
      isPlaceholder: true,
    };
  }

  /**
   * Get the cache control header value
   *
   * @returns Cache control string
   */
  getCacheControl(): string {
    return this.options.cacheControl;
  }

  /**
   * Get the default content type
   *
   * @returns Default content type string
   */
  getDefaultContentType(): string {
    return this.options.defaultContentType;
  }
}
