export enum UserRole {
  DPO = "DPO",
  BPH = "BPH",
  PENGURUS = "PENGURUS",
  ANGGOTA = "ANGGOTA",
}

export enum Department {
  BPH = "BPH",
  INFOKOM = "INFOKOM",
  PSDM = "PSDM",
  LITBANG = "LITBANG",
  KWU = "KWU",
}

export enum Position {
  KETUA_UMUM = "KETUA_UMUM",
  WAKIL_KETUA_UMUM = "WAKIL_KETUA_UMUM",
  SEKRETARIS = "SEKRETARIS",
  BENDAHARA = "BENDAHARA",
  KEPALA_DEPARTEMEN = "KEPALA_DEPARTEMEN",
  STAFF_DEPARTEMEN = "STAFF_DEPARTEMEN",
}

export enum PeriodStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  ALL = "all",
}

export enum FinanceType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

export enum DocumentType {
  PROPOSAL = "PROPOSAL",
  LPJ = "LPJ",
  BUDGET_PLAN = "BUDGET_PLAN",
  TIMELINE = "TIMELINE",
  WORKPLAN = "WORKPLAN",
  FINANCIAL_REPORT = "FINANCIAL_REPORT",
  ATTENDANCE_LIST = "ATTENDANCE_LIST",
  ACTIVITY_REPORT = "ACTIVITY_REPORT",
  EVALUATION_REPORT = "EVALUATION_REPORT",
  INVOICE = "INVOICE",
  RECEIPT = "RECEIPT",
  OFFICIAL_LETTER = "OFFICIAL_LETTER",
  MEMORANDUM = "MEMORANDUM",
  POSTER = "POSTER",
  BROCHURE = "BROCHURE",
  PRESENTATION = "PRESENTATION",
  CERTIFICATE = "CERTIFICATE",
  DECREE = "DECREE",
  OTHER = "OTHER",
}

// Enum untuk status berbagai entitas dalam sistem
// DRAFT: Draft, belum dipublikasikan
// PENDING: Menunggu persetujuan atau proses
// PUBLISH: Sudah dipublikasikan
// PRIVATE: Hanya dapat diakses oleh pihak tertentu
// ARCHIVE: Diarsipkan, tidak aktif
export enum Status {
  DRAFT = "DRAFT", // Draft
  PENDING = "PENDING", // Menunggu persetujuan
  PUBLISH = "PUBLISH", // Sudah dipublikasikan
  PRIVATE = "PRIVATE", // Hanya untuk pihak tertentu
  ARCHIVE = "ARCHIVE", // Diarsipkan
}

// Enum Letter Type
export enum LetterType {
  OUTGOING = "OUTGOING",
  INCOMING = "INCOMING",
}

// Enum Letter Priority
export enum LetterPriority {
  NORMAL = "NORMAL",
  IMPORTANT = "IMPORTANT",
  URGENT = "URGENT",
}

// Enum Letter Classification
export enum LetterClassification {
  GENERAL = "GENERAL",
  CONFIDENTIAL = "CONFIDENTIAL",
  HIGHLY_CONFIDENTIAL = "HIGHLY_CONFIDENTIAL",
}

export enum ApprovalType {
  WORK_PROGRAM = "WORK_PROGRAM",
  EVENT = "EVENT",
  FINANCE = "FINANCE",
  DOCUMENT = "DOCUMENT",
  DOCUMENT_PROPOSAL = "DOCUMENT_PROPOSAL",
  DOCUMENT_ACCOUNTABILITY_REPORT = "DOCUMENT_ACCOUNTABILITY_REPORT",
  LETTER = "LETTER",
}

export enum ApiResponseStatus {
  SUCCESS = "success",
  ERROR = "error",
}

export enum ActivityType {
  CREATE = "CREATE", // Membuat data baru
  UPDATE = "UPDATE", // Mengubah data
  DELETE = "DELETE", // Menghapus data
  LOGIN = "LOGIN", // Login ke sistem
  LOGOUT = "LOGOUT", // Logout dari sistem
  APPROVE = "APPROVE", // Menyetujui sesuatu
  REJECT = "REJECT", // Menolak sesuatu
  UPLOAD = "UPLOAD", // Mengunggah file
  DOWNLOAD = "DOWNLOAD", // Mengunduh file
  OTHER = "OTHER", // Aktivitas lainnya
}

export enum StatusApproval {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
}
