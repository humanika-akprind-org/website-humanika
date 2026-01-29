/**
 * Application Layer Interfaces Index
 * Part of Clean Architecture: Application Layer
 *
 * Export all repository interfaces for easier imports.
 */

// Base types
export type {
  IBaseRepository,
  BaseFilter,
  BasePagination,
  BasePaginationResult,
  BaseStats,
} from "./base.repository.interface";

// Entity-specific repositories
export type {
  IActivityRepository,
  ActivityFilters,
  RadarChartResult,
  DepartmentActivityData,
} from "./activity.repository.interface";
export type {
  IArticleRepository,
  ArticleFilter,
} from "./article.repository.interface";
export type {
  IArticleCategoryRepository,
  ArticleCategoryFilter,
} from "./article-category.repository.interface";
export type {
  IDocumentRepository,
  DocumentFilters,
} from "./document.repository.interface";
export type {
  IEventRepository,
  EventFilters,
} from "./event.repository.interface";
export type {
  IEventCategoryRepository,
  EventCategoryFilter,
} from "./event-category.repository.interface";
export type {
  IFinanceRepository,
  FinanceFilter,
} from "./finance.repository.interface";
export type {
  IFinanceCategoryRepository,
  FinanceCategoryFilter,
} from "./finance-category.repository.interface";
export type {
  IGalleryRepository,
  GalleryFilter,
} from "./gallery.repository.interface";
export type {
  IGalleryCategoryRepository,
  GalleryCategoryFilter,
} from "./gallery-category.repository.interface";
export type {
  ILetterRepository,
  LetterFilter,
} from "./letter.repository.interface";
export type {
  IManagementRepository,
  ManagementFilters,
} from "./management.repository.interface";
export type {
  IOrganizationContactRepository,
  OrganizationContactFilter,
} from "./organization-contact.repository.interface";
export type {
  IOrganizationalStructureRepository,
  OrganizationalStructureFilter,
} from "./organizational-structure.repository.interface";
export type {
  IPeriodRepository,
  PeriodFilter,
} from "./period.repository.interface";
export type {
  IStatisticRepository,
  StatisticFilter,
} from "./statistic.repository.interface";
export type {
  ITaskDepartmentRepository,
  DepartmentTaskFilter,
} from "./task-department.repository.interface";
export type { IUserRepository, UserFilter } from "./user.repository.interface";
export type {
  IWorkProgramRepository,
  WorkProgramFilter,
} from "./work-program.repository.interface";
