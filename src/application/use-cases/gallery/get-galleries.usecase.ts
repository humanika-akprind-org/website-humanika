/**
 * Get Galleries Use Case - Complex read operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles fetching galleries with filtering and pagination.
 */

import type {
  IGalleryRepository,
  GalleryFilter,
  GalleryPagination,
} from "@/application/interface/gallery.repository.interface";
import type { Gallery } from "@/domain/entities/gallery.entity";

interface GalleryResult {
  galleries: Gallery[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class GetGalleriesUseCase {
  constructor(private galleryRepo: IGalleryRepository) {}

  /**
   * Execute the use case to get galleries with optional filters and pagination
   */
  async execute(
    filters?: GalleryFilter,
    pagination?: GalleryPagination,
  ): Promise<GalleryResult> {
    // Apply default pagination if not provided
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;

    // Validate pagination parameters
    if (page < 1) throw new Error("Page must be greater than 0");
    if (limit < 1) throw new Error("Limit must be greater than 0");
    if (limit > 100) throw new Error("Limit cannot exceed 100");

    // Execute the repository method
    const result = await this.galleryRepo.findMany(filters, { page, limit });

    return {
      galleries: result.records,
      pagination: result.pagination,
    };
  }

  /**
   * Execute with query parameters from request URL
   */
  async executeFromQueryParams(
    searchParams: URLSearchParams,
  ): Promise<GalleryResult> {
    const filters: GalleryFilter = {
      eventId: searchParams.get("eventId") || undefined,
      categoryId: searchParams.get("categoryId") || undefined,
      periodId: searchParams.get("periodId") || undefined,
      search: searchParams.get("search") || undefined,
    };

    const pagination: GalleryPagination = {
      page: parseInt(searchParams.get("page") || "1", 10),
      limit: parseInt(searchParams.get("limit") || "10", 10),
    };

    return this.execute(filters, pagination);
  }
}
