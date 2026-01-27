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
