# API Documentation

Dokumentasi lengkap untuk semua API endpoints di Humanika Organizational Management System.

## 📋 Overview

API menggunakan RESTful design dengan Next.js API Routes. Semua response menggunakan format JSON.

### Authentication

Sebagian besar API endpoints memerlukan authentication. Gunakan NextAuth.js session untuk authentication.

### Response Format

```json
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}
```

### Error Response

```json
{
  "error": "Error message",
  "status": 400
}
```

## 🔗 API Endpoints

### 👥 User Management API

#### GET /api/user

Mengambil list pengguna dengan pagination dan filter.

**Authentication:** Diperlukan

**Query Parameters:**

- `page` (number): Halaman (default: 1)
- `limit` (number): Jumlah item per halaman (default: 10)
- `search` (string): Pencarian berdasarkan nama/email/username
- `role` (UserRole): Filter berdasarkan role
- `department` (Department): Filter berdasarkan departemen
- `isActive` (boolean): Filter pengguna aktif
- `verifiedAccount` (boolean): Filter akun terverifikasi
- `allUsers` (boolean): Ambil semua pengguna tanpa pagination

**Response:**

```json
{
  "users": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "totalPages": 15
  }
}
```

#### POST /api/user

Membuat pengguna baru.

**Authentication:** Diperlukan

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "password123",
  "role": "ANGGOTA",
  "department": "INFOKOM",
  "position": "STAFF_DEPARTEMEN",
  "isActive": true,
  "verifiedAccount": false
}
```

**Response:** User object (201 Created)

### 📝 Article API

#### GET /api/article

Mengambil list artikel dengan filter.

**Authentication:** Tidak diperlukan untuk artikel published

**Query Parameters:**

- `status` (Status): Status artikel (DRAFT, PENDING, PUBLISH, etc.)
- `periodId` (string): Filter berdasarkan periode
- `categoryId` (string): Filter berdasarkan kategori
- `authorId` (string): Filter berdasarkan penulis
- `search` (string): Pencarian berdasarkan judul/konten

**Response:**

```json
{
  "articles": [...],
  "pagination": { ... }
}
```

#### POST /api/article

Membuat artikel baru.

**Authentication:** Diperlukan

**Request Body:**

```json
{
  "title": "Judul Artikel",
  "content": "Konten artikel...",
  "authorId": "user-id",
  "categoryId": "category-id",
  "thumbnail": "url-gambar",
  "status": "DRAFT"
}
```

**Response:** Article object (201 Created)

#### GET /api/article/[id]

Mengambil detail artikel berdasarkan ID.

**Authentication:** Tidak diperlukan untuk artikel published

**Response:** Article object

#### PUT /api/article/[id]

Update artikel.

**Authentication:** Diperlukan (author atau admin)

**Request Body:** Partial article object

**Response:** Updated article object

#### DELETE /api/article/[id]

Hapus artikel.

**Authentication:** Diperlukan (author atau admin)

**Response:** Success message (204 No Content)

### 💰 Finance API

#### GET /api/finance

Mengambil list transaksi keuangan.

**Authentication:** Diperlukan

**Query Parameters:**

- `type` (FinanceType): INCOME atau EXPENSE
- `status` (Status): Status transaksi
- `periodId` (string): Filter berdasarkan periode
- `categoryId` (string): Filter berdasarkan kategori
- `eventId` (string): Filter berdasarkan event
- `search` (string): Pencarian
- `startDate` (string): Tanggal mulai
- `endDate` (string): Tanggal akhir

**Response:**

```json
{
  "finances": [...],
  "pagination": { ... },
  "summary": {
    "totalIncome": 10000000,
    "totalExpense": 5000000,
    "balance": 5000000
  }
}
```

#### POST /api/finance

Membuat transaksi keuangan baru.

**Authentication:** Diperlukan

**Request Body:**

```json
{
  "name": "Pembelian ATK",
  "amount": 500000,
  "description": "Pembelian alat tulis kantor",
  "date": "2024-01-15",
  "type": "EXPENSE",
  "categoryId": "category-id",
  "proof": "url-bukti-transfer"
}
```

**Response:** Finance object (201 Created)

### 📅 Event API

#### GET /api/event

Mengambil list event/kegiatan.

**Authentication:** Tidak diperlukan untuk event published

**Query Parameters:**

- `status` (Status): Status event
- `periodId` (string): Filter berdasarkan periode
- `categoryId` (string): Filter berdasarkan kategori
- `department` (Department): Filter berdasarkan departemen
- `scheduleStartDate` (string): Tanggal mulai jadwal (filter dari schedules)
- `scheduleEndDate` (string): Tanggal akhir jadwal (filter dari schedules)
- `search` (string): Pencarian

**Response:**

```json
{
  "events": [...],
  "pagination": { ... }
}
```

#### POST /api/event

Membuat event baru.

**Authentication:** Diperlukan

**Request Body:**

```json
{
  "name": "Seminar Teknologi",
  "description": "Seminar tentang teknologi terkini",
  "responsibleId": "user-id",
  "goal": "Meningkatkan pengetahuan anggota",
  "department": "INFOKOM",
  "schedules": [
    {
      "date": "2024-10-15",
      "location": "Jakarta Convention Center",
      "startTime": "09:00",
      "endTime": "17:00",
      "notes": "Session 1 - Opening"
    }
  ],
  "status": "DRAFT"
}
```

### 📄 Document API

#### GET /api/document

Mengambil list dokumen.

**Authentication:** Diperlukan

**Query Parameters:**

- `documentTypeId` (string): Filter berdasarkan tipe dokumen
- `status` (Status): Status dokumen
- `userId` (string): Filter berdasarkan uploader
- `letterId` (string): Filter berdasarkan surat terkait

**Response:**

```json
{
  "documents": [...],
  "pagination": { ... }
}
```

#### POST /api/document

Upload dokumen baru.

**Authentication:** Diperlukan

**Request Body:**

```json
{
  "name": "Laporan Kegiatan 2024",
  "documentTypeId": "type-id",
  "document": "url-file",
  "status": "PENDING"
}
```

### ✉️ Letter API

#### GET /api/letter

Mengambil list surat.

**Authentication:** Diperlukan

**Query Parameters:**

- `type` (LetterType): INCOMING atau OUTGOING
- `priority` (LetterPriority): NORMAL, IMPORTANT, URGENT
- `status` (Status): Status surat
- `createdById` (string): Filter berdasarkan pembuat
- `periodId` (string): Filter berdasarkan periode

**Response:**

```json
{
  "letters": [...],
  "pagination": { ... }
}
```

#### POST /api/letter

Membuat surat baru.

**Authentication:** Diperlukan

**Request Body:**

```json
{
  "number": "001/LETTER/2024",
  "regarding": "Undangan Rapat",
  "origin": "Humanika",
  "destination": "Universitas",
  "classification": "GENERAL",
  "date": "2024-01-15",
  "type": "OUTGOING",
  "priority": "NORMAL",
  "body": "Isi surat...",
  "letter": "url-file-surat"
}
```

### 🖼️ Gallery API

#### GET /api/gallery

Mengambil list foto galeri.

**Authentication:** Tidak diperlukan

**Query Parameters:**

- `eventId` (string): Filter berdasarkan event
- `categoryId` (string): Filter berdasarkan kategori

**Response:**

```json
{
  "galleries": [...],
  "pagination": { ... }
}
```

#### POST /api/gallery

Upload foto ke galeri.

**Authentication:** Diperlukan

**Request Body:**

```json
{
  "title": "Foto Seminar",
  "image": "url-gambar",
  "eventId": "event-id",
  "categoryId": "category-id"
}
```

### ✅ Approval API

#### GET /api/approval

Mengambil list approval requests.

**Authentication:** Diperlukan

**Query Parameters:**

- `entityType` (ApprovalType): Tipe entitas yang perlu approval
- `entityId` (string): ID entitas
- `userId` (string): ID approver
- `status` (StatusApproval): Status approval

**Response:**

```json
{
  "approvals": [...],
  "pagination": { ... }
}
```

#### POST /api/approval

Membuat approval request atau memberikan approval.

**Authentication:** Diperlukan

**Request Body:**

```json
{
  "entityType": "EVENT",
  "entityId": "event-id",
  "status": "APPROVED",
  "note": "Approved by admin"
}
```

### 📊 Activity Log API

#### GET /api/activity

Mengambil log aktivitas pengguna.

**Authentication:** Diperlukan

**Query Parameters:**

- `userId` (string): Filter berdasarkan user
- `activityType` (ActivityType): Tipe aktivitas
- `entityType` (string): Tipe entitas
- `startDate` (string): Tanggal mulai
- `endDate` (string): Tanggal akhir

**Response:**

```json
{
  "activities": [...],
  "pagination": { ... }
}
```

### 🔐 Authentication API

API authentication menggunakan NextAuth.js dengan providers:

- Credentials (email/password)
- Google OAuth

#### POST /api/auth/signin

Login pengguna.

#### POST /api/auth/signout

Logout pengguna.

#### GET /api/auth/session

Mengambil session pengguna saat ini.

### ☁️ Google Drive Integration API

#### GET /api/google-drive

Integrasi dengan Google Drive untuk upload file.

**Authentication:** Diperlukan

**Query Parameters:**

- `action` (string): Tipe aksi (upload, list, delete)

### 📧 Email API

#### POST /api/email

Mengirim email.

**Authentication:** Diperlukan

**Request Body:**

```json
{
  "to": "recipient@example.com",
  "subject": "Subject",
  "body": "Email content",
  "type": "notification"
}
```

## 🔧 Error Codes

- `400` - Bad Request: Data yang dikirim tidak valid
- `401` - Unauthorized: Tidak memiliki akses
- `403` - Forbidden: Akses ditolak
- `404` - Not Found: Resource tidak ditemukan
- `409` - Conflict: Data sudah ada (duplicate)
- `500` - Internal Server Error: Error server

## 📝 Notes

- Semua API menggunakan JSON sebagai format data
- Authentication menggunakan JWT tokens via NextAuth.js
- Pagination menggunakan format standar dengan `page` dan `limit`
- File uploads menggunakan Google Drive integration
- Error handling mengikuti pola yang konsisten
- Rate limiting diterapkan pada beberapa endpoints

Untuk detail implementasi spesifik, lihat kode di folder `app/api/`.
