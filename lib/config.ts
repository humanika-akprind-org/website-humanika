class AppConfig {
  // Environment
  get nodeEnv(): string {
    return process.env.NODE_ENV || "development";
  }

  get isProduction(): boolean {
    return this.nodeEnv === "production";
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === "development";
  }

  // NextAuth
  get nextAuthSecret(): string {
    return process.env.NEXTAUTH_SECRET || "";
  }

  get nextAuthUrl(): string {
    return process.env.NEXTAUTH_URL || "http://localhost:3000";
  }

  // OAuth Google
  get googleClientId(): string {
    return process.env.GOOGLE_CLIENT_ID || "";
  }

  get googleClientSecret(): string {
    return process.env.GOOGLE_CLIENT_SECRET || "";
  }

  get googleRedirectUri(): string {
    return process.env.GOOGLE_REDIRECT_URI || "";
  }

  // JWT
  get jwtSecret(): string {
    return process.env.JWT_SECRET || "";
  }

  get jwtExpiresIn(): string {
    return process.env.JWT_EXPIRES_IN || "7d";
  }

  // Database
  get databaseUrl(): string {
    return process.env.DATABASE_URL || "";
  }

  // API
  get apiUrl(): string {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
  }

  // Google Drive Folder ID (disarankan jangan ambil folder ID dari environment variable (.env), gunakan default. Dikarenakan folder ID tidak dapat membaca dari environment variable)
  get photoManagementFolderId(): string {
    return (
      process.env.PHOTO_MANAGEMENT_FOLDER_ID ||
      "1b-rGfIotafs5GIoatDEaJPBFKnfzDsha"
    );
  }

  get eventThumbnailFolderId(): string {
    return (
      process.env.EVENT_THUMBNAIL_FOLDER_ID ||
      "1_Wo5jifUNXcr6ipWEvKbNfWJ3ZrZTU8h"
    );
  }

  get galleryFolderId(): string {
    return process.env.GALLERY_FOLDER_ID || "1Ww2JrMagrvlQ-FfqJO17UJ_8ONU8UgmF";
  }

  get articleFolderId(): string {
    return process.env.ARTICLE_FOLDER_ID || "1TF3amcf7AJDMtsK7PzKpjyoCGhrrgrI1";
  }

  get documentFolderId(): string {
    return (
      process.env.DOCUMENT_FOLDER_ID || "19H6acPYsoS8bYj0XfWzkl-N_pC8ttZ-t"
    );
  }

  get structureFolderId(): string {
    return (
      process.env.STRUCTURE_FOLDER_ID || "1iyhli_RGSyKFzABF5phpww7XtgixyQLd"
    );
  }

  get organizationalStructureFolderId(): string {
    return (
      process.env.ORGANIZATIONAL_STRUCTURE_FOLDER_ID ||
      "16jQ6MqEYTBWejHFxr8iGUmMrKKvJGY4D"
    );
  }

  // Email
  get resendApiKey(): string {
    return process.env.RESEND_API_KEY || "";
  }
}

// Instance tunggal dari AppConfig
export const appConfig = new AppConfig();

// Export individual getters for tree-shaking (optional)
export const {
  nodeEnv,
  isProduction,
  isDevelopment,
  nextAuthSecret,
  nextAuthUrl,
  googleClientId,
  googleClientSecret,
  googleRedirectUri,
  jwtSecret,
  jwtExpiresIn,
  databaseUrl,
  apiUrl,
  photoManagementFolderId,
  eventThumbnailFolderId,
  galleryFolderId,
  articleFolderId,
  documentFolderId,
  structureFolderId,
  organizationalStructureFolderId,
  resendApiKey,
} = appConfig;

// Export type
export type { AppConfig };
