# Deployment Guide

Panduan lengkap untuk deployment Humanika Organizational Management System ke production.

## 🌐 Deployment Platforms

### Recommended Platforms

#### Vercel (Recommended)

- **Best for**: Next.js applications
- **Features**: Automatic deployments, CDN, serverless functions
- **Pricing**: Generous free tier, pay-as-you-go

#### Railway

- **Best for**: Full-stack applications with databases
- **Features**: Managed databases, easy scaling
- **Pricing**: Developer-friendly pricing

#### DigitalOcean App Platform

- **Best for**: Containerized applications
- **Features**: Docker support, managed databases
- **Pricing**: Predictable pricing

## 🚀 Quick Deployment to Vercel

### Prerequisites

- Vercel account
- GitHub repository
- MongoDB database (MongoDB Atlas recommended)

### Steps

1. **Connect Repository**

   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login to Vercel
   vercel login

   # Link project
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

### Vercel Configuration

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    }
  ]
}
```

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

1. **Create Cluster**

   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Create new project
   - Create cluster (free tier available)

2. **Database User**

   ```javascript
   // In Atlas dashboard
   // Database Access > Add New Database User
   // Create user with read/write access
   ```

3. **Network Access**

   ```javascript
   // Network Access > Add IP Address
   // Add 0.0.0.0/0 for development
   // Add specific IPs for production
   ```

4. **Connection String**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/humanika?retryWrites=true&w=majority
   ```

### Prisma Deployment

```bash
# Generate Prisma client for production
npx prisma generate

# Push schema to production database
npx prisma db push

# Optional: Seed production data
npx prisma db seed
```

## 🔐 Environment Variables

### Required Variables

```env
# Database
DATABASE_URL="mongodb+srv://..."

# NextAuth.js
NEXTAUTH_SECRET="your-production-secret-here"
NEXTAUTH_URL="https://yourdomain.com"

# Google OAuth
GOOGLE_CLIENT_ID="your-prod-google-client-id"
GOOGLE_CLIENT_SECRET="your-prod-google-client-secret"

# Email Service (Resend)
RESEND_API_KEY="re_..."

# Optional: Analytics, Monitoring
NEXT_PUBLIC_ANALYTICS_ID="..."
SENTRY_DSN="..."
```

### Security Best Practices

```bash
# Generate secure secret
openssl rand -base64 32

# Never commit .env files
echo ".env*" >> .gitignore

# Use different secrets for each environment
# Development: dev-secret
# Staging: staging-secret
# Production: prod-secret
```

## 🔧 Build Configuration

### Next.js Configuration

```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Image optimization
  images: {
    domains: ["drive.google.com", "lh3.googleusercontent.com"],
    formats: ["image/webp", "image/avif"],
  },

  // Headers for security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // Experimental features (if needed)
  experimental: {
    esmExternals: "loose",
  },
};

export default nextConfig;
```

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "eslint . --ext .ts,.tsx",
    "type-check": "tsc --noEmit",
    "prisma:generate": "prisma generate",
    "prisma:push": "prisma db push",
    "prisma:studio": "prisma studio",
    "db:setup": "prisma generate && prisma db push",
    "postinstall": "prisma generate"
  }
}
```

## 📊 Monitoring & Analytics

### Error Monitoring (Sentry)

```bash
# Install Sentry
npm install @sentry/nextjs

# Initialize Sentry
npx @sentry/wizard@latest -i nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

### Analytics (Vercel Analytics)

```javascript
// app/layout.tsx
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Performance Monitoring

```javascript
// lib/performance.ts
export function reportWebVitals(metric) {
  // Send to analytics service
  console.log(metric);
}

// In app/_document.tsx or app/layout.tsx
import { reportWebVitals } from "@/lib/performance";

export function reportWebVitals(metric) {
  // Custom reporting logic
}
```

## 🔒 Security Checklist

### Pre-deployment

- [ ] Remove all `console.log` statements
- [ ] Ensure all environment variables are set
- [ ] Verify database connection
- [ ] Test all authentication flows
- [ ] Check file upload restrictions
- [ ] Validate CORS settings

### Authentication & Authorization

- [ ] Secure NextAuth.js configuration
- [ ] Implement proper role-based access
- [ ] Validate all API endpoints
- [ ] Secure file uploads
- [ ] Rate limiting on sensitive endpoints

### Data Protection

- [ ] Encrypt sensitive data
- [ ] Secure database credentials
- [ ] Implement proper session management
- [ ] GDPR compliance (if applicable)
- [ ] Data backup strategy

### Network Security

- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] CSRF protection
- [ ] XSS prevention

## 🚦 Deployment Checklist

### Pre-deployment

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Linting clean
- [ ] TypeScript compilation successful
- [ ] Build successful
- [ ] Environment variables configured
- [ ] Database schema up to date
- [ ] Static assets optimized

### Deployment Steps

- [ ] Create backup of current production data
- [ ] Deploy to staging environment first
- [ ] Run smoke tests on staging
- [ ] Deploy to production
- [ ] Verify production deployment
- [ ] Monitor error logs
- [ ] Update documentation

### Post-deployment

- [ ] Verify all features work
- [ ] Check performance metrics
- [ ] Monitor error rates
- [ ] Update team about deployment
- [ ] Plan rollback if needed

## 🔄 Rollback Strategy

### Quick Rollback (Vercel)

```bash
# Rollback to previous deployment
vercel rollback

# Or specify deployment ID
vercel rollback <deployment-id>
```

### Database Rollback

```bash
# If schema changes need rollback
npx prisma migrate reset --force

# Or restore from backup
mongorestore --db humanika /path/to/backup
```

## 📈 Performance Optimization

### Image Optimization

```javascript
// next.config.mjs
const nextConfig = {
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};
```

### Caching Strategy

```javascript
// API Routes with caching
export async function GET() {
  // Implement appropriate caching headers
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}
```

### Bundle Analysis

```bash
# Analyze bundle size
npm install --save-dev @next/bundle-analyzer

# Add to package.json
"analyze": "ANALYZE=true next build"
```

## 🌍 CDN & Global Distribution

### Vercel Edge Network

- Automatic CDN distribution
- Global edge network
- Automatic SSL certificates

### Custom CDN (Optional)

```javascript
// For static assets
// Configure CDN_URL in environment
const CDN_URL = process.env.CDN_URL || "";

<Image src={`${CDN_URL}/images/hero.jpg`} alt="Hero" />;
```

## 📋 Maintenance

### Regular Tasks

- [ ] Update dependencies monthly
- [ ] Monitor performance metrics
- [ ] Review error logs weekly
- [ ] Backup database regularly
- [ ] Security updates as needed

### Health Checks

```typescript
// app/api/health/route.ts
export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    // Check external services
    // await checkGoogleDriveConnection();
    // await checkEmailService();

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        database: "ok",
        // googleDrive: 'ok',
        // email: 'ok',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
```

## 🚨 Troubleshooting

### Common Issues

#### Build Failures

```bash
# Clear cache and rebuild
rm -rf .next
npm run build

# Check Node.js version
node --version

# Verify environment variables
vercel env ls
```

#### Database Connection Issues

```bash
# Test connection
npx prisma studio

# Check connection string
# Ensure IP whitelist in MongoDB Atlas
# Verify credentials
```

#### Authentication Problems

```bash
# Check NextAuth configuration
# Verify OAuth credentials
# Clear browser cookies
# Check NEXTAUTH_URL
```

#### Performance Issues

```bash
# Check bundle size
npm run analyze

# Monitor Core Web Vitals
# Check database query performance
# Review image optimization
```

## 📞 Support

### Deployment Support

- Vercel Documentation: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- MongoDB Atlas: https://docs.atlas.mongodb.com/

### Monitoring

- Set up alerts for:
  - Error rates > 5%
  - Response time > 2s
  - Database connection issues
  - High memory usage

---

Deployment yang berhasil memastikan aplikasi berjalan stabil, aman, dan performant di production environment.
