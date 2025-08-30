# Next.js Google Drive Manager

A modern, full-stack Next.js application for managing Google Drive files with secure authentication, file uploads, and folder management capabilities.

## 🚀 Features

- **🔐 Secure Google OAuth Authentication**
- **📁 Google Drive File Management**
  - List files and folders
  - Upload files to specific folders
  - Rename files
  - Delete files
  - Copy file URLs
- **🎨 Modern UI/UX**
  - Responsive design with Tailwind CSS
  - Loading states and error handling
  - Toast notifications
- **⚡ Performance Optimized**
  - Server-side rendering
  - Efficient API routes
  - Optimized file handling

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: PostgreSQL with Prisma ORM
- **Google Drive API**: googleapis library
- **File Upload**: Multipart form data handling

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL database
- Google Cloud Console project with Drive API enabled
- Google OAuth 2.0 credentials

## 🔧 Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd nextjs-google-auth-starter-kit
   \`\`\`
2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`
3. **Environment Variables**
   Create a \`.env.local\` file with:
   \`\`\`env

# Database

DATABASE_URL="postgresql://username:password@localhost:5432/google_drive_manager"

# NextAuth

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# Google OAuth

GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Google Drive API

GOOGLE_DRIVE_API_KEY="your-google-drive-api-key"
\`\`\`

4. **Database Setup**
   \`\`\`bash
   npx prisma generate
   npx prisma db push
   \`\`\`
5. **Run Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

## 🌐 Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable APIs:
   - Google Drive API
   - Google OAuth 2.0 API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: \`http://localhost:3000/api/auth/callback/google\`
5. Copy credentials to your \`.env.local\`

## 🎯 API Endpoints

### Google Drive API (\`/api/google-drive\`)

- **POST** \`/api/google-drive\` - Upload files
- **POST** \`/api/google-drive\` - Rename files
- **POST** \`/api/google-drive\` - Delete files
- **POST** \`/api/google-drive\` - Get file URLs

### Google Drive Folders (\`/api/google-drive-folders\`)

- **GET** \`/api/google-drive-folders\` - List folders

### Google Drive List (\`/api/google-drive-list\`)

- **GET** \`/api/google-drive-list\` - List files

### Gallery (\`/api/gallery\`)

- **GET** \`/api/gallery\` - List gallery items
- **POST** \`/api/gallery\` - Upload to gallery

## 🐛 Common Issues & Solutions

### Error: "Unexpected token '<', "<!DOCTYPE "... is not valid JSON"

**Cause**: Frontend trying to POST to non-existent \`/api/upload\` endpoint
**Solution**: Update frontend to use \`/api/google-drive\` instead

### Error: "POST /api/upload 404"

**Cause**: Missing \`/api/upload\` route
**Solution**: Use \`/api/google-drive\` for file uploads

### Error: "Google OAuth not working"

**Cause**: Incorrect OAuth credentials or redirect URI
**Solution**: Verify Google Cloud Console settings

## 🚀 Deployment

### Vercel

1. Push code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Docker

\`\`\`bash
docker build -t google-drive-manager .
docker run -p 3000:3000 --env-file .env.local google-drive-manager
\`\`\`

## 🔍 Development Commands

\`\`\`bash

# Development

npm run dev

# Build

npm run build

# Start production

npm start

# Lint

npm run lint

# Database

npx prisma studio
npx prisma db p
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit changes (\`git commit -m 'Add amazing feature'\`)
4. Push to branch (\`git push origin feature/amazing-feature\`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Google Drive API](https://developers.google.com/drive)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/)

```
src/
├── app/
│   ├── admin/
│   │   ├── dashboard/
│   │   │   ├── overview/
│   │   │   │   └── page.tsx
│   │   │   ├── activity/
│   │   │   │   └── page.tsx
│   │   │   └── stats/
│   │   │       └── page.tsx
│   │   ├── governance/
│   │   │   ├── periods/
│   │   │   │   ├── all/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── add/
│   │   │   │   │   └── page.tsx
│   │   │   └── organizationals/
│   │   │       ├── all/
│   │   │       │   └── page.tsx
│   │   │       ├── add/
│   │   │       │   └── page.tsx
│   │   │       ├── structure/
│   │   │       │   └── page.tsx
│   │   ├── people/
│   │   │   ├── users/
│   │   │   │   ├── all/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── add/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── approval/
│   │   │   │   │   └── page.tsx
│   │   ├── programs/
│   │   │   ├── works/
│   │   │   │   ├── all/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── add/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── approval/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── reports/
│   │   │   │   │   └── page.tsx
│   │   │   ├── events/
│   │   │   │   ├── all/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── add/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── approval/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── reports/
│   │   │   │   │   └── page.tsx
│   │   ├── administration/
│   │   │   ├── documents/
│   │   │   │   ├── all/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── add/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── approval/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── templates/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── reports/
│   │   │   │   │   └── page.tsx
│   │   │   ├── letters/
│   │   │   │   ├── all/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── add/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── approval/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── templates/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── reports/
│   │   │   │   │   └── page.tsx
│   │   ├── content/
│   │   │   ├── articles/
│   │   │   │   ├── all/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── add/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── approval/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── categories/
│   │   │   │   │   └── page.tsx
│   │   │   ├── galleries/
│   │   │   │   ├── all/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── add/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── approval/
│   │   │   │   │   └── page.tsx
│   │   │   ├── links/
│   │   │   │   ├── all/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── add/
│   │   │   │   │   └── page.tsx
│   │   ├── finance/
│   │   │   ├── transactions/
│   │   │   │   ├── all/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── add/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── approval/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── categories/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── reports/
│   │   │   │   │   └── page.tsx
│   │   ├── system/
│   │   │   └── activity/
│   │   │       └── page.tsx
│   │   ├── settings/
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   ├── account/
│   │   │   │   └── page.tsx
```
