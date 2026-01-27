/**
 * Application Layer Interfaces Index
 * Part of Clean Architecture: Application Layer
 *
 * Export all repository interfaces for easier imports.
 */

export type { IBaseRepository } from "./base.repository.interface";
export type {
  IEventRepository,
  EventFilters,
  EventPagination,
  EventPaginationResult,
} from "./event.repository.interface";
export type {
  IActivityRepository,
  ActivityFilters,
  ActivityPagination,
  ActivityPaginationResult,
  RadarChartResult,
  DepartmentActivityData,
} from "./activity.repository.interface";
export type { IArticleRepository } from "./article.repository.interface";
