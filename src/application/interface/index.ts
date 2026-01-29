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
  ActivityPagination,
  ActivityPaginationResult,
  ActivityStats,
} from "./activity.repository.interface";
export type {
  IArticleRepository,
  ArticleFilter,
  ArticlePagination,
  ArticlePaginationResult,
  ArticleStats,
} from "./article.repository.interface";
export type {
  IArticleCategoryRepository,
  ArticleCategoryFilter,
  ArticleCategoryPagination,
  ArticleCategoryPaginationResult,
  ArticleCategoryStats,
} from "./article-category.repository.interface";
export type {
  IDocumentRepository,
  DocumentFilters,
  DocumentPagination,
  DocumentPaginationResult,
  DocumentStats,
} from "./document.repository.interface";
export type {
  IEventRepository,
  EventFilters,
  EventPagination,
  EventPaginationResult,
  EventStats,
} from "./event.repository.interface";
export type {
  IEventCategoryRepository,
  EventCategoryFilter,
  EventCategoryPagination,
  EventCategoryPaginationResult,
  EventCategoryStats,
} from "./event-category.repository.interface";
export type {
  IFinanceRepository,
  FinanceFilter,
  FinancePagination,
  FinancePaginationResult,
  FinanceStats,
} from "./finance.repository.interface";
export type {
  IFinanceCategoryRepository,
  FinanceCategoryFilter,
  FinanceCategoryPagination,
  FinanceCategoryPaginationResult,
  FinanceCategoryStats,
} from "./finance-category.repository.interface";
export type {
  IGalleryRepository,
  GalleryFilter,
  GalleryPagination,
  GalleryPaginationResult,
  GalleryStats,
} from "./gallery.repository.interface";
export type {
  IGalleryCategoryRepository,
  GalleryCategoryFilter,
  GalleryCategoryPagination,
  GalleryCategoryPaginationResult,
  GalleryCategoryStats,
} from "./gallery-category.repository.interface";
export type {
  ILetterRepository,
  LetterFilter,
  LetterPagination,
  LetterPaginationResult,
  LetterStats,
} from "./letter.repository.interface";
export type {
  IManagementRepository,
  ManagementFilters,
  ManagementPagination,
  ManagementPaginationResult,
  ManagementStats,
} from "./management.repository.interface";
export type {
  IOrganizationContactRepository,
  OrganizationContactFilter,
  OrganizationContactPagination,
  OrganizationContactPaginationResult,
  OrganizationContactStats,
} from "./organization-contact.repository.interface";
export type {
  IOrganizationalStructureRepository,
  OrganizationalStructureFilter,
  OrganizationalStructurePagination,
  OrganizationalStructurePaginationResult,
  OrganizationalStructureStats,
} from "./organizational-structure.repository.interface";
export type {
  IPeriodRepository,
  PeriodFilter,
  PeriodPagination,
  PeriodPaginationResult,
  PeriodStats,
} from "./period.repository.interface";
export type {
  IStatisticRepository,
  StatisticFilter,
  StatisticPagination,
  StatisticPaginationResult,
  StatisticStats,
} from "./statistic.repository.interface";
export type {
  ITaskDepartmentRepository,
  DepartmentTaskFilter,
  DepartmentTaskPagination,
  DepartmentTaskPaginationResult,
  DepartmentTaskStats,
} from "./task-department.repository.interface";
export type {
  IUserRepository,
  UserFilter,
  UserPagination,
  UserPaginationResult,
  UserStats,
} from "./user.repository.interface";
export type {
  IWorkProgramRepository,
  WorkProgramFilter,
  WorkProgramPagination,
  WorkProgramPaginationResult,
  WorkProgramStats,
} from "./work-program.repository.interface";
