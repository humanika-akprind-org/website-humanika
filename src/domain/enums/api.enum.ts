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
