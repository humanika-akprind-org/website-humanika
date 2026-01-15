# Database Schema Documentation

Dokumentasi lengkap skema database Humanika menggunakan MongoDB dengan Prisma ORM.

## 🗄️ Overview

Database menggunakan **MongoDB** sebagai database NoSQL dengan **Prisma** sebagai ORM. Skema terdiri dari beberapa model yang saling terkait untuk mengelola organisasi mahasiswa.

## 📊 Models

### Core Models

#### User

Model untuk data anggota organisasi.

```prisma
model User {
  id              String      @id @default(auto()) @map("_id") @db.ObjectId
  name            String      // Nama lengkap
  email           String      @unique // Email unik
  username        String      @unique // Username unik
  password        String      // Password terenkripsi
  role            UserRole    @default(ANGGOTA) // Role dalam organisasi
  department      Department? // Departemen (opsional)
  position        Position?   // Jabatan (opsional)
  isActive        Boolean     @default(true) // Status aktif
  verifiedAccount Boolean     @default(false) // Status verifikasi
  attemptLogin    Int         @default(0) // Jumlah percobaan login gagal
  blockExpires    DateTime?   // Waktu blokir berakhir
  avatarColor     String      @default("#3B82F6") // Warna avatar
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  // Relations
  activityLogs    ActivityLog[]
  approvals       Approval[]
  managements     Management[]
  articles        Article[]
  finances        Finance[]
  documents       Document[]
  createdLetters  Letter[]    @relation("LetterCreator")
  approvedLetters Letter[]    @relation("LetterApprover")
  workPrograms    WorkProgram[] @relation("WorkProgramResponsible")
  events          Event[]     @relation("EventResponsible")
  departmentTasks DepartmentTask[]
}
```

**Enums terkait:**

- `UserRole`: DPO, BPH, PENGURUS, ANGGOTA
- `Department`: BPH, INFOKOM, PSDM, LITBANG, KWU
- `Position`: KETUA_UMUM, WAKIL_KETUA_UMUM, SEKRETARIS, BENDAHARA, KEPALA_DEPARTEMEN, STAFF_DEPARTEMEN

#### Period

Model untuk periode kepengurusan organisasi.

```prisma
model Period {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  name      String   // Nama periode (e.g., "2023-2024")
  startYear Int      // Tahun mulai
  endYear   Int      // Tahun akhir
  isActive  Boolean  @default(false) // Status aktif
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  managements              Management[]
  letters                  Letter[]
  workPrograms             WorkProgram[]
  events                   Event[]
  articles                 Article[]
  organizationalStructures OrganizationalStructure[]
}
```

#### Management

Model untuk jabatan manajemen dalam periode tertentu.

```prisma
model Management {
  id         String     @id @default(auto()) @map("_id") @db.ObjectId
  userId     String     @db.ObjectId
  periodId   String     @db.ObjectId
  position   Position
  photo      String?    // URL foto
  department Department
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt

  // Relations
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  period Period @relation(fields: [periodId], references: [id], onDelete: Cascade)

  @@unique([userId, periodId])
  @@unique([periodId, position, department])
}
```

### Content Models

#### Article

Model untuk artikel dan berita.

```prisma
model Article {
  id         String   @id @default(auto()) @map("_id") @db.ObjectId
  title      String   // Judul artikel
  slug       String   @unique // Slug unik untuk URL
  thumbnail  String?  // URL gambar thumbnail
  content    String   // Konten artikel
  authorId   String   @db.ObjectId
  periodId   String?  @db.ObjectId
  status     Status   @default(DRAFT)
  categoryId String?  @db.ObjectId
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  // Relations
  author   User             @relation(fields: [authorId], references: [id], onDelete: Cascade)
  category ArticleCategory? @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  period   Period?          @relation(fields: [periodId], references: [id], onDelete: SetNull)
}
```

#### ArticleCategory

Model untuk kategori artikel.

```prisma
model ArticleCategory {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  name        String   @unique
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  articles Article[]
}
```

#### Event

Model untuk kegiatan/acara organisasi.

```prisma
model Event {
  id            String     @id @default(auto()) @map("_id") @db.ObjectId
  name          String     // Nama kegiatan
  slug          String     @unique // Slug unik
  thumbnail     String?    // URL thumbnail
  description   String     // Deskripsi lengkap
  responsibleId String     @db.ObjectId
  goal          String     // Tujuan kegiatan
  department    Department // Departemen penyelenggara
  periodId      String     @db.ObjectId
  schedules     Json       @default("[]") // Jadwal kegiatan (array of schedule items)
  status        Status     @default(DRAFT)
  workProgramId String?    @db.ObjectId
  categoryId    String?    @db.ObjectId
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  // Relations
  period      Period         @relation(fields: [periodId], references: [id], onDelete: Cascade)
  workProgram WorkProgram?   @relation(fields: [workProgramId], references: [id], onDelete: SetNull)
  category    EventCategory? @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  approvals   Approval[]
  galleries   Gallery[]
  letters     Letter[]
  responsible User           @relation(fields: [responsibleId], references: [id], onDelete: Cascade)
}
```

#### EventCategory

Model untuk kategori event.

```prisma
model EventCategory {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  name        String   @unique
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  events Event[]
}
```

#### Gallery

Model untuk galeri foto.

```prisma
model Gallery {
  id         String   @id @default(auto()) @map("_id") @db.ObjectId
  title      String   // Judul foto
  image      String   // URL gambar
  eventId    String   @db.ObjectId
  categoryId String?  @db.ObjectId
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  // Relations
  event    Event            @relation(fields: [eventId], references: [id], onDelete: Cascade)
  category GalleryCategory? @relation(fields: [categoryId], references: [id], onDelete: SetNull)
}
```

#### GalleryCategory

Model untuk kategori galeri.

```prisma
model GalleryCategory {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  name        String   @unique
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  galleries Gallery[]
}
```

### Administrative Models

#### Document

Model untuk dokumen yang diupload.

```prisma
model Document {
  id             String   @id @default(auto()) @map("_id") @db.ObjectId
  name           String   // Nama dokumen
  letterId       String?  @db.ObjectId
  documentTypeId String   @db.ObjectId
  status         Status   @default(PENDING)
  document       String?  // URL file dokumen
  userId         String   @db.ObjectId
  parentId       String?  @db.ObjectId
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  // Relations
  user            User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  letter          Letter?      @relation(fields: [letterId], references: [id], onDelete: Cascade)
  documentType    DocumentType @relation(fields: [documentTypeId], references: [id], onDelete: Cascade)
  previousVersion Document?    @relation("DocumentVersions", fields: [parentId], references: [id])
  nextVersions    Document[]   @relation("DocumentVersions")
  approvals       Approval[]
}
```

#### DocumentType

Model untuk tipe dokumen.

```prisma
model DocumentType {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  name        String   @unique
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  documents Document[]
}
```

#### Letter

Model untuk surat masuk/keluar.

```prisma
model Letter {
  id             String                @id @default(auto()) @map("_id") @db.ObjectId
  number         String?               @unique // Nomor surat unik
  regarding      String                // Perihal
  origin         String                // Asal surat
  destination    String                // Tujuan surat
  classification LetterClassification? // Klasifikasi surat
  date           DateTime              // Tanggal surat
  type           LetterType            // INCOMING/OUTGOING
  priority       LetterPriority        @default(NORMAL)
  body           String?               // Isi surat
  letter         String?               // URL file surat
  notes          String?               // Catatan
  status         Status                @default(PENDING)
  createdById    String                @db.ObjectId
  approvedById   String?               @db.ObjectId
  periodId       String?               @db.ObjectId
  eventId        String?               @db.ObjectId
  createdAt      DateTime              @default(now())
  updatedAt      DateTime              @updatedAt

  // Relations
  createdBy   User       @relation(fields: [createdById], references: [id], onDelete: Cascade, name: "LetterCreator")
  approvedBy  User?      @relation(fields: [approvedById], references: [id], onDelete: SetNull, name: "LetterApprover")
  period      Period?    @relation(fields: [periodId], references: [id], onDelete: SetNull)
  event       Event?     @relation(fields: [eventId], references: [id], onDelete: SetNull)
  attachments Document[] // Dokumen lampiran
  approvals   Approval[]
}
```

### Financial Models

#### Finance

Model untuk transaksi keuangan.

```prisma
model Finance {
  id            String      @id @default(auto()) @map("_id") @db.ObjectId
  name          String      // Nama transaksi
  amount        Float       // Jumlah nominal
  description   String      // Deskripsi
  date          DateTime    // Tanggal transaksi
  type          FinanceType // INCOME/EXPENSE
  userId        String      @db.ObjectId
  status        Status      @default(PENDING)
  proof         String?     // URL bukti transfer
  categoryId    String?     @db.ObjectId
  workProgramId String?     @db.ObjectId
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  // Relations
  category    FinanceCategory? @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  workProgram WorkProgram?     @relation(fields: [workProgramId], references: [id], onDelete: SetNull)
  user        User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  approvals   Approval[]
}
```

#### FinanceCategory

Model untuk kategori keuangan.

```prisma
model FinanceCategory {
  id          String      @id @default(auto()) @map("_id") @db.ObjectId
  name        String      @unique
  description String?
  type        FinanceType // INCOME/EXPENSE
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  finances Finance[]
}
```

### Governance Models

#### WorkProgram

Model untuk program kerja departemen.

```prisma
model WorkProgram {
  id             String     @id @default(auto()) @map("_id") @db.ObjectId
  name           String     // Nama program
  department     Department // Departemen
  schedule       String     // Jadwal
  status         Status     @default(DRAFT)
  funds          Float      // Dana yang dialokasikan
  usedFunds      Float      @default(0) // Dana terpakai
  remainingFunds Float      @default(0) // Sisa dana
  goal           String     // Tujuan
  periodId       String     @db.ObjectId
  responsibleId  String     @db.ObjectId
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt

  // Relations
  period          Period           @relation(fields: [periodId], references: [id], onDelete: Cascade)
  approvals       Approval[]
  events          Event[]
  departmentTasks DepartmentTask[]
  finances        Finance[]
  responsible     User             @relation(fields: [responsibleId], references: [id], onDelete: Cascade)
}
```

#### DepartmentTask

Model untuk tugas departemen.

```prisma
model DepartmentTask {
  id            String     @id @default(auto()) @map("_id") @db.ObjectId
  title         String     // Judul tugas
  subtitle      String?    // Subjudul
  note          String     // Catatan
  department    Department // Departemen
  userId        String?    @db.ObjectId
  workProgramId String?    @db.ObjectId
  status        Status     @default(PENDING)
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  // Relations
  user        User?        @relation(fields: [userId], references: [id], onDelete: SetNull)
  workProgram WorkProgram? @relation(fields: [workProgramId], references: [id], onDelete: SetNull)
}
```

#### OrganizationalStructure

Model untuk struktur organisasi.

```prisma
model OrganizationalStructure {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  name      String   // Nama struktur
  status    Status   @default(PENDING)
  periodId  String   @db.ObjectId
  decree    String   // URL SK
  structure String?  // URL file struktur
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  period Period @relation(fields: [periodId], references: [id], onDelete: Cascade)
}
```

### System Models

#### ActivityLog

Model untuk log aktivitas pengguna.

```prisma
model ActivityLog {
  id           String       @id @default(auto()) @map("_id") @db.ObjectId
  userId       String?      @db.ObjectId
  activityType ActivityType // Tipe aktivitas
  entityType   String       // Tipe entitas
  entityId     String?      @db.ObjectId
  description  String       // Deskripsi
  metadata     Json?        // Data tambahan
  ipAddress    String?      // IP address
  userAgent    String?      // User agent
  createdAt    DateTime     @default(now())

  // Relations
  user User?
}
```

#### Approval

Model unified untuk sistem persetujuan.

```prisma
model Approval {
  id         String         @id @default(auto()) @map("_id") @db.ObjectId
  entityType ApprovalType   // Tipe entitas
  entityId   String         @db.ObjectId
  userId     String         @db.ObjectId
  status     StatusApproval // PENDING/APPROVED/REJECTED/CANCELLED
  note       String?        // Catatan
  createdAt  DateTime       @default(now())
  updatedAt  DateTime       @updatedAt

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Polymorphic relations
  workProgram WorkProgram? @relation("WorkProgramApprovals")
  event       Event?       @relation("EventApprovals")
  finance     Finance?     @relation("FinanceApprovals")
  document    Document?    @relation("DocumentApprovals")
  letter      Letter?      @relation("LetterApprovals")
}
```

## 🔧 Enums

### UserRole

```prisma
enum UserRole {
  DPO       // Dewan Pengurus Organisasi
  BPH       // Badan Pengurus Harian
  PENGURUS  // Pengurus
  ANGGOTA   // Anggota
}
```

### Department

```prisma
enum Department {
  BPH      // Badan Pengurus Harian
  INFOKOM  // Departemen Informasi dan Komunikasi
  PSDM     // Departemen Pengembangan Sumber Daya Mahasiswa
  LITBANG  // Departemen Penelitian dan Pengembangan
  KWU      // Departemen Kewirausahaan
}
```

### Position

```prisma
enum Position {
  KETUA_UMUM         // Ketua Umum
  WAKIL_KETUA_UMUM   // Wakil Ketua Umum
  SEKRETARIS         // Sekretaris
  BENDAHARA          // Bendahara
  KEPALA_DEPARTEMEN  // Kepala Departemen
  STAFF_DEPARTEMEN   // Staff Departemen
}
```

### Status

```prisma
enum Status {
  DRAFT     // Draft
  PENDING   // Menunggu approval
  PUBLISH   // Published/aktif
  PRIVATE   // Private
  ARCHIVE   // Diarsipkan
}
```

### FinanceType

```prisma
enum FinanceType {
  INCOME   // Pemasukan
  EXPENSE  // Pengeluaran
}
```

### LetterType

```prisma
enum LetterType {
  OUTGOING  // Surat keluar
  INCOMING  // Surat masuk
}
```

### LetterPriority

```prisma
enum LetterPriority {
  NORMAL   // Normal
  IMPORTANT // Penting
  URGENT   // Mendesak
}
```

### LetterClassification

```prisma
enum LetterClassification {
  GENERAL           // Biasa
  CONFIDENTIAL      // Rahasia
  HIGHLY_CONFIDENTIAL // Sangat Rahasia
}
```

### ApprovalType

```prisma
enum ApprovalType {
  WORK_PROGRAM              // Program kerja
  EVENT                     // Kegiatan
  FINANCE                   // Transaksi keuangan
  DOCUMENT                  // Dokumen
  DOCUMENT_PROPOSAL         // Proposal dokumen
  DOCUMENT_ACCOUNTABILITY_REPORT // Laporan pertanggungjawaban
  LETTER                    // Surat
}
```

### StatusApproval

```prisma
enum StatusApproval {
  PENDING   // Menunggu
  APPROVED  // Disetujui
  REJECTED  // Ditolak
  CANCELLED // Dibatalkan
}
```

### ActivityType

```prisma
enum ActivityType {
  CREATE  // Membuat
  UPDATE  // Mengubah
  DELETE  // Menghapus
  LOGIN   // Login
  LOGOUT  // Logout
  APPROVE // Menyetujui
  REJECT  // Menolak
  UPLOAD  // Upload
  DOWNLOAD // Download
  OTHER   // Lainnya
}
```

## 🔗 Relationships

### One-to-Many

- User → ActivityLog, Approval, Management, Article, Finance, Document, Letter (created/approved), WorkProgram, Event, DepartmentTask
- Period → Management, Letter, WorkProgram, Event, Article, OrganizationalStructure
- ArticleCategory → Article
- EventCategory → Event
- GalleryCategory → Gallery
- DocumentType → Document
- FinanceCategory → Finance
- WorkProgram → Event, DepartmentTask, Finance

### Many-to-One

- Management → User, Period
- Article → User, Period, ArticleCategory
- Event → Period, WorkProgram, EventCategory, User (responsible)
- Gallery → Event, GalleryCategory
- Document → User, Letter, DocumentType
- Letter → User (createdBy/approvedBy), Period, Event
- Finance → User, FinanceCategory, WorkProgram
- DepartmentTask → User, WorkProgram
- OrganizationalStructure → Period
- ActivityLog → User
- Approval → User

### Polymorphic (Approval)

- Approval → WorkProgram, Event, Finance, Document, Letter

## 📊 Indexes

```prisma
// User indexes
@@index([email, role, isActive, department, position])

// Period indexes
@@index([isActive, startYear, endYear])

// Management indexes
@@unique([userId, periodId])
@@unique([periodId, position, department])
@@index([department, position])

// Article indexes
@@index([authorId, status])

// Event indexes
@@index([status, periodId, department])

// Finance indexes
@@index([date, type, status])

// Document indexes
@@index([documentTypeId, status, userId])

// Letter indexes
@@index([type, priority, status, createdById, periodId])

// ActivityLog indexes
@@index([userId, activityType, entityType, createdAt])

// Approval indexes
@@index([entityType, entityId, userId, status])
```

## 🔄 Data Flow

1. **User Management**: User dapat memiliki multiple roles dalam periode berbeda
2. **Content Creation**: Article, Event, Gallery dibuat oleh user dengan approval flow
3. **Financial Tracking**: Finance transactions linked ke WorkProgram dan Event
4. **Document Management**: Documents dapat dilampirkan ke Letter atau standalone
5. **Approval System**: Unified approval untuk semua entity types
6. **Activity Logging**: Semua aktivitas user dicatat untuk audit trail

## 🛡️ Data Integrity

- **Cascade Delete**: Parent deletion menghapus related records
- **Set Null**: Optional relations di-set null saat parent dihapus
- **Unique Constraints**: Mencegah duplicate data
- **Required Fields**: Validasi data wajib di application level

## 📈 Performance Considerations

- **Indexes**: Strategic indexes pada frequently queried fields
- **Pagination**: Semua list queries menggunakan pagination
- **Lazy Loading**: Relations dimuat sesuai kebutuhan
- **Query Optimization**: Menggunakan Prisma's query optimization features

---

Untuk detail implementasi database, lihat file `prisma/schema.prisma`.
