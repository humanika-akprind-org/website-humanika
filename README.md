# Humanika - Organizational Management System

## 📋 Project Overview

Humanika adalah sistem manajemen organisasi komprehensif yang dibangun untuk mengelola kegiatan organisasi mahasiswa. Sistem ini terdiri dari dua bagian utama:

- **Website Publik**: Platform informasi untuk anggota dan masyarakat umum
- **Panel Admin**: Sistem administrasi untuk mengelola semua aspek organisasi

Proyek ini menggunakan teknologi modern untuk memberikan pengalaman yang baik bagi pengguna dan administrator.

## 🏗️ Architecture Overview

### System Architecture

Humanika mengikuti arsitektur **full-stack web application** dengan separation of concerns yang jelas:

- **Frontend**: Next.js 15 dengan App Router untuk routing dan server-side rendering
- **Backend**: Next.js API Routes sebagai RESTful API endpoints
- **Database**: MongoDB dengan Prisma ORM untuk type-safe database operations
- **Authentication**: NextAuth.js dengan multiple providers (Credentials, Google OAuth)
- **Styling**: Tailwind CSS dengan shadcn/ui components
- **State Management**: TanStack Query untuk server state, React hooks untuk local state

### Application Structure

```
├── Public Website (/)
│   ├── Home - Hero, features, latest articles/events
│   ├── Articles - Blog system with categories
│   ├── Events - Event calendar and registration
│   ├── Gallery - Photo gallery from activities
│   ├── About - Organization info and structure
│   └── Contact - Contact form and information
│
├── Admin Panel (/admin)
│   ├── Dashboard - Analytics and overview
│   ├── User Management - CRUD operations for members
│   ├── Content Management - Articles, events, galleries
│   ├── Financial Management - Income/expense tracking
│   ├── Document Management - File uploads and approvals
│   ├── Activity Logs - User activity monitoring
│   └── Settings - System configuration
```

### Key Design Patterns

- **Component-based Architecture**: Reusable React components
- **Custom Hooks**: Business logic separation
- **Service Layer**: API business logic abstraction
- **Type Safety**: Full TypeScript coverage
- **Responsive Design**: Mobile-first approach

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework untuk web aplikasi
- **React 18** - Library JavaScript untuk UI
- **TypeScript** - Superset JavaScript dengan type safety
- **Tailwind CSS** - Framework CSS utility-first

### Backend & Database

- **Next.js API Routes** - API endpoints
- **Prisma** - ORM untuk database
- **MongoDB** - Database NoSQL
- **NextAuth.js** - Authentication

### Tools & Libraries

- **CKEditor 5** - Rich text editor
- **Recharts** - Chart library
- **Google APIs** - Integrasi Google Drive

## ✨ Features

### 🌐 Website Publik

- **Beranda**: Hero section, fitur, artikel terbaru, tentang, event, galeri
- **Artikel**: Sistem blog dengan kategori, pencarian, dan bookmark
- **Event**: Kalender event, detail event, registrasi
- **Galeri**: Album foto dari berbagai kegiatan
- **Tentang**: Visi misi, struktur organisasi, sejarah
- **FAQ**: Pertanyaan umum dan jawaban
- **Kontak**: Formulir kontak dan informasi kontak

### 👨‍💼 Panel Admin

- **Dashboard**: Overview statistik dan aktivitas
- **Manajemen Pengguna**: CRUD anggota organisasi
- **Dokumen**: Upload dan manajemen dokumen
- **Keuangan**: Transaksi pemasukan/pengeluaran
- **Surat**: Manajemen surat masuk/keluar
- **Event**: Pengelolaan kegiatan organisasi
- **Artikel**: Publikasi konten
- **Approval System**: Sistem persetujuan untuk berbagai entitas
- **Activity Log**: Log aktivitas pengguna

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- MongoDB database

### Setup Steps

1. **Clone repository**

   ```bash
   git clone <repository-url>
   cd humanika
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   - Copy `.env.example` ke `.env`
   - Isi variabel environment yang diperlukan

4. **Database Setup**

   ```bash
   npm run prisma:generate
   npm run prisma:push
   npm run prisma:seed
   ```

5. **Development Server**
   ```bash
   npm run dev
   ```

## ⚙️ Environment Setup

### Environment Variables

Buat file `.env` di root directory dan isi dengan konfigurasi berikut:

```env
# Database
DATABASE_URL="mongodb://localhost:27017/humanika"

# NextAuth.js Authentication
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (untuk admin login)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email Service (Resend)
RESEND_API_KEY="your-resend-api-key"

# Optional: File Upload (Google Drive)
GOOGLE_DRIVE_CLIENT_ID="your-drive-client-id"
GOOGLE_DRIVE_CLIENT_SECRET="your-drive-client-secret"
GOOGLE_DRIVE_REFRESH_TOKEN="your-drive-refresh-token"
```

### Environment Variables Explanation

- **DATABASE_URL**: Connection string untuk MongoDB database
- **NEXTAUTH_SECRET**: Secret key untuk JWT tokens (generate dengan `openssl rand -base64 32`)
- **NEXTAUTH_URL**: Base URL aplikasi (development: `http://localhost:3000`, production: domain Anda)
- **GOOGLE_CLIENT_ID/SECRET**: Credentials dari Google Cloud Console untuk OAuth login
- **RESEND_API_KEY**: API key dari Resend untuk email notifications
- **Google Drive**: Optional, untuk file upload ke Google Drive storage

### Development vs Production

Untuk production deployment, pastikan:

- Gunakan MongoDB Atlas atau database production
- Set NEXTAUTH_URL ke domain production
- Gunakan production OAuth credentials
- Enable HTTPS
- Set proper CORS policies

## 📜 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run dev:with-db      # Start dev server with database setup
npm run dev:reset        # Reset database and start dev server

# Build & Production
npm run build            # Build untuk production
npm start                # Start production server

# Database
npm run prisma:generate  # Generate Prisma client
npm run prisma:push      # Push schema ke database
npm run prisma:studio    # Buka Prisma Studio
npm run prisma:seed      # Seed database dengan data awal
npm run prisma:reset     # Reset database
npm run db:setup         # Setup lengkap database

# Quality Assurance
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run type-check       # TypeScript type checking

# Utilities
npm run seed             # Alternative seed command
```

## 🧪 Testing

### Testing Strategy

Humanika menggunakan kombinasi testing approaches:

- **Unit Tests**: Component dan utility function testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Full user workflow testing (planned)

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- components/UserCard.test.tsx
```

### Testing Guidelines

- Tulis tests untuk critical business logic
- Test component behavior, not implementation
- Mock external dependencies (API calls, database)
- Aim for >80% code coverage
- Use descriptive test names

## 📚 Documentation

Untuk dokumentasi lengkap, lihat folder `docs/`:

- **[API Documentation](docs/API.md)** - Dokumentasi lengkap API endpoints
- **[Components](docs/COMPONENTS.md)** - Dokumentasi komponen React
- **[Database Schema](docs/DATABASE.md)** - Detail skema database
- **[Development Guide](docs/DEVELOPMENT.md)** - Panduan development
- **[Deployment](docs/DEPLOYMENT.md)** - Panduan deployment

## 🚀 Deployment

### Quick Deploy to Vercel

1. **Connect Repository**

   ```bash
   npm i -g vercel
   vercel login
   vercel link
   ```

2. **Configure Environment Variables**

   ```bash
   vercel env add DATABASE_URL
   vercel env add NEXTAUTH_SECRET
   vercel env add NEXTAUTH_URL
   vercel env add GOOGLE_CLIENT_ID
   vercel env add GOOGLE_CLIENT_SECRET
   vercel env add RESEND_API_KEY
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Other Platforms

- **Railway**: Full-stack dengan managed database
- **DigitalOcean App Platform**: Containerized deployment
- **VPS/Cloud**: Manual deployment dengan PM2

### Production Checklist

- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Monitoring dan error tracking setup
- [ ] Backup strategy implemented

Lihat **[Deployment Guide](docs/DEPLOYMENT.md)** untuk panduan lengkap.

## 🔧 Troubleshooting

### Common Issues

#### Build Errors

```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Clear node_modules
rm -rf node_modules package-lock.json
npm install
```

#### Database Connection Issues

```bash
# Test connection
npm run prisma:studio

# Reset database
npm run prisma:reset
```

#### Authentication Problems

```bash
# Check NextAuth configuration
# Verify OAuth credentials
# Clear browser cookies
```

#### Performance Issues

```bash
# Check bundle size
npm run build --analyze

# Monitor Core Web Vitals
# Review database queries
```

### Getting Help

- Check [Development Guide](docs/DEVELOPMENT.md) untuk development issues
- Review [API Documentation](docs/API.md) untuk API problems
- Check browser console dan server logs untuk errors

## 📁 Project Structure

```
humanika/
├── app/                          # Next.js app directory
│   ├── (humanika)/              # Public pages
│   ├── admin/                   # Admin pages
│   ├── api/                     # API routes
│   └── auth/                    # Authentication pages
├── components/                  # React components
│   ├── admin/                   # Admin components
│   ├── public/                  # Public components
│   └── ui/                      # Shared UI components
├── docs/                        # Documentation files
├── hooks/                       # Custom React hooks
├── lib/                         # Utility libraries
├── prisma/                      # Database schema & seed
├── services/                    # Business logic services
├── types/                       # TypeScript type definitions
└── public/                      # Static assets
```

## 🔌 API Overview

Humanika menyediakan RESTful API yang komprehensif untuk semua operasi:

### Core Endpoints

- **`/api/stats`** - Dashboard statistics
- **`/api/user`** - User management (CRUD)
- **`/api/article`** - Content management
- **`/api/event`** - Event management
- **`/api/finance`** - Financial tracking
- **`/api/gallery`** - Media management
- **`/api/approval`** - Approval workflow
- **`/api/activity`** - Activity logging

### Authentication

Semua API endpoints memerlukan authentication kecuali yang publik. Menggunakan NextAuth.js dengan JWT tokens.

### Response Format

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

Lihat **[API Documentation](docs/API.md)** untuk detail lengkap semua endpoints.

## 🗄️ Database Overview

### Schema Design

Humanika menggunakan **MongoDB** dengan **Prisma ORM** untuk type-safe database operations.

### Core Models

- **User**: Member management dengan role-based access
- **Period**: Organizational periods (e.g., 2023-2024)
- **Management**: Leadership positions per period
- **Article**: Blog/content management
- **Event**: Activity management
- **Finance**: Income/expense tracking
- **Document**: File management dengan approval workflow
- **Approval**: Unified approval system

### Key Features

- **Type Safety**: Full TypeScript integration
- **Relations**: Complex relationships antar entities
- **Indexing**: Optimized queries untuk performance
- **Migrations**: Version-controlled schema changes

Lihat **[Database Schema](docs/DATABASE.md)** untuk detail lengkap struktur database.

## 🔒 Security

### Authentication & Authorization

- **NextAuth.js**: Secure authentication dengan multiple providers
- **Role-based Access Control**: DPO, BPH, Pengurus, Anggota
- **Session Management**: Secure JWT token handling
- **Password Security**: bcrypt hashing dengan salt

### Data Protection

- **Input Validation**: Zod schema validation
- **SQL Injection Prevention**: Prisma ORM protection
- **XSS Protection**: React automatic escaping
- **CSRF Protection**: NextAuth.js built-in protection

### Security Best Practices

- **HTTPS Only**: Enforced SSL/TLS
- **Security Headers**: CSP, HSTS, X-Frame-Options
- **Rate Limiting**: API rate limiting
- **Audit Logging**: Comprehensive activity logging

## 🗺️ Roadmap

### Version 1.0 (Current)

- ✅ Basic organizational management
- ✅ User authentication & authorization
- ✅ Content management (articles, events)
- ✅ Financial tracking
- ✅ Document management
- ✅ Approval workflow

### Upcoming Features

- **📊 Advanced Analytics**: Detailed reporting dan insights
- **📧 Notification System**: Email & in-app notifications
- **📱 Mobile App**: React Native companion app
- **🔍 Advanced Search**: Full-text search capabilities
- **📈 Performance Monitoring**: Real-time metrics
- **🌐 Multi-language Support**: Internationalization
- **🔗 API Integrations**: Third-party service integrations

### Future Enhancements

- **🤖 AI Features**: Automated content suggestions
- **📊 Data Visualization**: Advanced charts dan dashboards
- **🔄 Workflow Automation**: Custom approval flows
- **📚 Learning Management**: Training modules
- **🎯 Goal Tracking**: KPI monitoring
- **💬 Chat System**: Internal communication

## 📝 Changelog

### Version 0.1.0 (Latest)

**Features:**

- Initial release Humanika OMS
- Basic user management
- Article dan event management
- Financial tracking system
- Document upload dengan approval
- Admin dashboard dengan statistics

**Technical:**

- Next.js 15 dengan App Router
- MongoDB dengan Prisma ORM
- NextAuth.js authentication
- Tailwind CSS styling
- Comprehensive API documentation

**Bug Fixes:**

- Initial release - no known bugs

---

Untuk changelog lengkap, lihat `CHANGELOG.md` (akan ditambahkan di release future).

## 🤝 Contributing

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📞 Support

### Getting Help

Jika Anda mengalami masalah atau memiliki pertanyaan:

1. **Check Documentation First**

   - [Development Guide](docs/DEVELOPMENT.md) untuk development issues
   - [API Documentation](docs/API.md) untuk API problems
   - [Deployment Guide](docs/DEPLOYMENT.md) untuk deployment issues

2. **Common Resources**

   - **GitHub Issues**: Laporkan bugs atau request features
   - **Discussions**: Tanya pertanyaan umum
   - **Documentation**: Update dokumentasi jika diperlukan

3. **Debugging Steps**
   - Check browser console untuk client-side errors
   - Check server logs untuk API errors
   - Verify environment variables
   - Test database connection

### Issue Reporting

Saat melaporkan issue, sertakan:

- **Environment**: OS, Node.js version, browser
- **Steps to Reproduce**: Langkah-langkah untuk mereproduksi issue
- **Expected Behavior**: Apa yang seharusnya terjadi
- **Actual Behavior**: Apa yang terjadi
- **Error Messages**: Screenshot atau copy-paste error
- **Code Snippets**: Relevant code jika applicable

### Feature Requests

Untuk feature requests:

- Jelaskan use case dan benefit
- Berikan mockups atau examples jika memungkinkan
- Diskusikan implementasi approach

### Community

- **GitHub**: https://github.com/your-org/humanika
- **Documentation**: https://your-docs-site.com
- **Discord/Slack**: Community chat (akan ditambahkan)

## 🙏 Acknowledgments

Terima kasih kepada:

- **Next.js Team** untuk framework yang powerful
- **Prisma Team** untuk ORM yang excellent
- **shadcn/ui** untuk component library
- **Vercel** untuk hosting platform
- **MongoDB** untuk database yang scalable

Special thanks to semua kontributor dan beta testers yang telah membantu development Humanika.

## 📝 License

Distributed under the MIT License.

## 👥 Authors

- **Humanika Development Team** - Initial work

---

**Catatan untuk Junior Programmer:**

Sistem ini cukup kompleks dengan banyak fitur. Mulai dari memahami struktur folder dan komponen dasar. Baca dokumentasi di folder `docs/` untuk pemahaman yang lebih mendalam.

Happy coding! 🚀
