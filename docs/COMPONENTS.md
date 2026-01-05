# Components Documentation

Dokumentasi lengkap komponen React yang digunakan dalam Humanika Organizational Management System.

## 📁 Struktur Komponen

```
components/
├── admin/                    # Komponen untuk panel admin
│   ├── auth/                # Komponen autentikasi admin
│   ├── google-drive/        # Komponen integrasi Google Drive
│   ├── layout/              # Komponen layout admin
│   ├── pages/               # Komponen halaman admin
│   └── ui/                  # Komponen UI khusus admin
├── public/                  # Komponen untuk website publik
│   ├── layout/              # Komponen layout publik
│   ├── pages/               # Komponen halaman publik
│   ├── sections/            # Komponen section/halaman
│   └── ui/                  # Komponen UI khusus publik
└── ui/                      # Komponen UI bersama (shadcn/ui)
```

## 🔧 Komponen Admin

### Layout Components

#### Sidebar (`components/admin/layout/Sidebar.tsx`)

Komponen sidebar navigasi utama untuk panel admin dengan fitur:

- **Role-based Access Control**: Menu ditampilkan berdasarkan role pengguna
- **Responsive Design**: Sembunyikan di mobile, tampilkan di desktop
- **Loading State**: Skeleton loading saat fetch user data
- **Navigation Groups**:
  - Dashboard (Overview, Activity, Stats)
  - Governance (Periods, Managements, Structure, Tasks)
  - People & Access (Users management)
  - Programs & Events (Work Programs, Events)
  - Administration (Proposals, Reports, Letters, Documents)
  - Content & Media (Articles, Galleries)
  - Finance (Transactions)
  - System (Activity Log)
  - Settings (Profile, Account)

**Props**: Tidak ada (menggunakan internal state)

**Features**:

- Dynamic menu berdasarkan user role
- Skeleton loading animation
- Logo dan branding HUMANIKA
- Logout button di footer

#### NavLink (`components/admin/layout/NavLink.tsx`)

Komponen link navigasi individual dengan icon.

```tsx
interface NavLinkProps {
  href: string;
  icon: LucideIcon;
  children: React.ReactNode;
}
```

#### NavDropdown (`components/admin/layout/NavDropdown.tsx`)

Komponen dropdown menu dengan sub-menu items.

```tsx
interface NavDropdownProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}
```

#### NavDropdownItem (`components/admin/layout/NavDropdownItem.tsx`)

Item individual dalam dropdown menu.

```tsx
interface NavDropdownItemProps {
  href: string;
  children: React.ReactNode;
}
```

#### UserInfo (`components/admin/layout/UserInfo.tsx`)

Komponen informasi pengguna di header admin.

### Authentication Components

#### AuthProvider (`components/admin/auth/AuthProvider.tsx`)

Provider untuk autentikasi admin menggunakan NextAuth.js.

#### LogoutButton (`components/admin/auth/LogoutButton.tsx`)

Button logout dengan icon dan styling.

#### AuthGuard (`components/admin/auth/google-oauth/AuthGuard.tsx`)

Guard untuk melindungi route admin dengan Google OAuth.

### Page Components

Komponen-komponen untuk halaman admin spesifik:

#### Dashboard Components

- `LoadingOverview.tsx` - Loading state untuk overview dashboard
- `ChartCard.tsx` - Card untuk chart/statistik
- `TimeFilter.tsx` - Filter waktu untuk dashboard
- `MetricCard.tsx` - Card metrik dengan angka

#### Form Components

- `Form.tsx` - Form umum untuk berbagai entitas (User, Finance, Document, etc.)
- `Filters.tsx` - Komponen filter untuk tabel data

#### Table Components

- `Table.tsx` - Tabel data dengan sorting dan pagination
- `Stats.tsx` - Komponen statistik untuk halaman tertentu

#### Modal Components

- `WarningModal.tsx` - Modal peringatan konfirmasi

### UI Components

#### Input Components

- `AccessTokenGuard.tsx` - Guard untuk input access token
- `ImageUpload.tsx` - Upload gambar dengan preview
- `FileUpload.tsx` - Upload file umum
- `PhotoUpload.tsx` - Upload foto profil

#### Alert Components

- `Alert.tsx` - Komponen alert/notifikasi

#### Loading Components

- `LoadingForm.tsx` - Loading state untuk form
- `LoadingAccount.tsx` - Loading state untuk account page
- `LoadingActivity.tsx` - Loading state untuk activity page

## 🌐 Komponen Public

### Layout Components

#### Header (`components/public/layout/Header.tsx`)

Header navigasi untuk website publik dengan:

- Logo HUMANIKA
- Menu navigasi (About, Article, Event, Gallery, Contact)
- Mobile menu toggle
- User dropdown untuk user yang login

#### Footer (`components/public/layout/Footer.tsx`)

Footer dengan informasi kontak, link sosial, dan navigasi.

#### MobileHeader (`components/public/layout/MobileHeader.tsx`)

Header khusus mobile dengan hamburger menu.

### Section Components

Komponen-komponen untuk section halaman home:

#### HeroSection (`components/public/sections/home/HeroSection.tsx`)

Section hero dengan:

- Background gradient dengan efek blur
- Animasi teks dengan Framer Motion
- Call-to-action buttons
- Stats cards dengan loading state
- Scroll indicator

**Features**:

- Motion animations
- Gradient backgrounds
- Responsive design
- Dynamic stats dari API

#### FeaturesSection (`components/public/sections/home/FeaturesSection.tsx`)

Section fitur HUMANIKA dengan cards fitur.

#### ArticleSection (`components/public/sections/home/ArticleSection.tsx`)

Section artikel terbaru dengan grid layout.

#### AboutSection (`components/public/sections/home/AboutSection.tsx`)

Section tentang HUMANIKA dengan deskripsi dan CTA.

#### EventsSection (`components/public/sections/home/EventsSection.tsx`)

Section event terdekat dengan carousel/slider.

#### GallerySection (`components/public/sections/home/GallerySection.tsx`)

Section galeri foto dari event.

#### CTASection (`components/public/sections/home/CTASection.tsx`)

Call-to-action section untuk mendorong user action.

### Page Components

Komponen-komponen untuk halaman spesifik:

#### Article Components

- `ArticleGrid.tsx` - Grid artikel dengan pagination
- `ArticleCard.tsx` - Card individual untuk artikel
- `ArticleList.tsx` - List view artikel
- `ArticleDetail.tsx` - Halaman detail artikel
- `ShareButtons.tsx` - Button share artikel
- `ActionBar.tsx` - Action bar untuk artikel

#### Event Components

- `EventCard.tsx` - Card event
- `EventCalendarView.tsx` - View kalender event
- `EventTabs.tsx` - Tab untuk filter event
- `FeaturedPastEvents.tsx` - Event terdahulu unggulan

#### Gallery Components

- `GalleryCard.tsx` - Card galeri
- `GalleryGrid.tsx` - Grid galeri
- `GalleryDetail.tsx` - Detail galeri dengan lightbox

#### Contact Components

- `ContactForm.tsx` - Form kontak
- `ContactHero.tsx` - Hero section contact
- `ContactInfoSection.tsx` - Info kontak
- `MapSection.tsx` - Peta lokasi
- `FAQSection.tsx` - FAQ dengan accordion

#### About Components

- `VisionTab.tsx` - Tab visi misi
- `AboutTab.tsx` - Tab tentang umum
- `NavigationTabs.tsx` - Tab navigasi about

### UI Components

#### Shared UI

- `Divider.tsx` - Divider line
- `LogoutButton.tsx` - Button logout untuk public
- `UserDropdown.tsx` - Dropdown user menu

## 🎨 UI Components (shadcn/ui)

Komponen UI reusable dari shadcn/ui:

### Form Components

- `Button` - Button dengan variants
- `Input` - Input field
- `Label` - Label untuk form
- `Select` - Dropdown select
- `Textarea` - Textarea input
- `Form` - Form wrapper dengan validation

### Layout Components

- `Card` - Card container
- `Dialog` - Modal dialog
- `Sheet` - Slide-out panel
- `Tabs` - Tab navigation
- `Table` - Data table

### Feedback Components

- `Toast` - Toast notifications
- `Alert` - Alert messages
- `Skeleton` - Loading skeleton
- `Spinner` - Loading spinner

## 🔄 Custom Hooks

### Admin Hooks

- `useEditDocumentType.ts` - Hook untuk edit tipe dokumen
- `useCreateDocumentType.ts` - Hook untuk buat tipe dokumen
- `useDocumentManagement.ts` - Hook untuk manajemen dokumen
- `useFinanceManagement.ts` - Hook untuk manajemen finance
- `useActivityStats.ts` - Hook untuk statistik aktivitas

### Public Hooks

- `useStats.ts` - Hook untuk fetch stats
- `useArticles.ts` - Hook untuk manajemen artikel
- `useEvents.ts` - Hook untuk manajemen event
- `useGalleries.ts` - Hook untuk manajemen galeri

## 📝 Patterns & Conventions

### Naming Conventions

- **Components**: PascalCase (e.g., `UserCard.tsx`)
- **Files**: kebab-case untuk file, PascalCase untuk folder
- **Hooks**: camelCase dengan prefix `use`

### Component Structure

```tsx
"use client"; // Jika menggunakan client-side features

import { ... } from "...";

// Types
interface ComponentProps {
  // ...
}

// Component
export default function ComponentName({ prop }: ComponentProps) {
  // Hooks
  // State
  // Effects

  return (
    // JSX
  );
}
```

### Styling

- Menggunakan Tailwind CSS
- Custom CSS variables untuk theme
- Responsive design dengan breakpoint classes
- Dark mode support (jika diimplementasikan)

### State Management

- Local state: React useState/useReducer
- Server state: TanStack Query
- Global state: React Context (minimal)

## 🚀 Best Practices

### Performance

- Menggunakan `React.memo` untuk expensive components
- Lazy loading untuk routes
- Image optimization dengan Next.js Image
- Bundle splitting

### Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support

### Testing

- Unit tests untuk utilities
- Integration tests untuk components
- E2E tests untuk critical flows

### Error Handling

- Error boundaries
- Loading states
- Fallback UI
- User-friendly error messages

## 🔧 Development Tools

### Code Quality

- ESLint untuk linting
- Prettier untuk formatting
- TypeScript untuk type checking
- Husky untuk git hooks

### Build Tools

- Next.js untuk build dan development
- PostCSS untuk CSS processing
- Tailwind untuk utility classes

---

Untuk detail implementasi spesifik, lihat kode di folder `components/`.
