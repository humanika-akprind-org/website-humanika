# Development Guide

Panduan lengkap untuk development Humanika Organizational Management System.

## 🚀 Getting Started

### Prerequisites

Pastikan sistem Anda memiliki:

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **MongoDB** database (local atau cloud)
- **Git** untuk version control

### Local Development Setup

1. **Clone Repository**

   ```bash
   git clone <repository-url>
   cd humanika
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   ```bash
   cp .env.example .env
   ```

   Isi file `.env` dengan konfigurasi yang diperlukan:

   ```env
   DATABASE_URL="mongodb://localhost:27017/humanika"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   RESEND_API_KEY="your-resend-api-key"
   ```

4. **Database Setup**

   ```bash
   # Generate Prisma client
   npm run prisma:generate

   # Push schema to database
   npm run prisma:push

   # Seed initial data
   npm run prisma:seed
   ```

5. **Start Development Server**

   ```bash
   npm run dev
   ```

   Aplikasi akan berjalan di `http://localhost:3000`

## 📁 Project Structure

```
humanika/
├── app/                          # Next.js App Router
│   ├── (humanika)/              # Public routes (route group)
│   │   ├── page.tsx             # Home page
│   │   ├── about/               # About pages
│   │   ├── article/             # Article pages
│   │   ├── event/               # Event pages
│   │   ├── gallery/             # Gallery pages
│   │   ├── faq/                 # FAQ page
│   │   └── contact/             # Contact page
│   ├── admin/                   # Admin routes
│   │   ├── layout.tsx           # Admin layout
│   │   ├── dashboard/           # Dashboard pages
│   │   ├── administration/      # Admin management pages
│   │   ├── finance/             # Finance management
│   │   ├── settings/            # Settings pages
│   │   └── system/              # System pages
│   ├── api/                     # API routes
│   ├── auth/                    # Authentication pages
│   └── globals.css              # Global styles
├── components/                  # React components
│   ├── admin/                   # Admin-specific components
│   ├── public/                  # Public website components
│   └── ui/                      # Shared UI components (shadcn/ui)
├── docs/                        # Documentation
├── hooks/                       # Custom React hooks
├── lib/                         # Utility libraries
├── prisma/                      # Database schema & migrations
├── public/                      # Static assets
├── types/                       # TypeScript type definitions
└── utils/                       # Utility functions
```

## 🎯 Development Guidelines

### Code Style & Conventions

#### TypeScript

- **Strict Mode**: Gunakan strict TypeScript settings
- **Type Safety**: Semua props, state, dan return values harus typed
- **Interface vs Type**: Gunakan `interface` untuk object shapes, `type` untuk unions
- **Generic Types**: Manfaatkan TypeScript generics untuk reusable components

#### Naming Conventions

```typescript
// Components - PascalCase
export default function UserProfile() { ... }

// Hooks - camelCase with 'use' prefix
export function useUserData() { ... }

// Functions - camelCase
function formatDate() { ... }

// Constants - UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Types - PascalCase
interface UserProps { ... }
type UserRole = 'ADMIN' | 'USER';

// Files - kebab-case for components, camelCase for utilities
// components/user-profile.tsx
// utils/dateHelpers.ts
```

#### File Organization

- **Components**: Group by feature/domain
- **Hooks**: Group by feature (e.g., `hooks/article/useArticles.ts`)
- **Types**: Group by domain (e.g., `types/article.d.ts`)
- **Utils**: Group by functionality (e.g., `lib/auth.ts`)

### Component Patterns

#### Component Structure

```tsx
"use client";

import { useState, useEffect } from "react";
import type { User } from "@/types/user";

// Types
interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
}

// Component
export default function UserCard({ user, onEdit }: UserCardProps) {
  // Hooks
  const [isLoading, setIsLoading] = useState(false);

  // Event handlers
  const handleEdit = () => {
    onEdit?.(user);
  };

  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <button onClick={handleEdit}>Edit</button>
    </div>
  );
}
```

#### Custom Hooks Pattern

```tsx
import { useState, useEffect } from "react";
import type { User } from "@/types/user";

export function useUsers(filters?: UserFilters) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/users?${new URLSearchParams(filters)}`
      );
      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => fetchUsers();

  return { users, loading, error, refetch };
}
```

### API Development

#### API Route Structure

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { getUsers } from "@/services/user.service";

export async function GET(request: NextRequest) {
  try {
    // Authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const filters = {
      search: searchParams.get("search"),
      role: searchParams.get("role"),
      department: searchParams.get("department"),
    };

    // Business logic
    const users = await getUsers(filters);

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

#### Service Layer Pattern

```typescript
// services/user.service.ts
import { PrismaClient } from "@prisma/client";
import type { User, UserFilters } from "@/types/user";

const prisma = new PrismaClient();

export async function getUsers(filters: UserFilters = {}) {
  const where = buildUserWhereClause(filters);

  return await prisma.user.findMany({
    where,
    include: {
      managements: true,
      department: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createUser(userData: CreateUserInput) {
  // Validation
  validateUserData(userData);

  // Hash password
  const hashedPassword = await hashPassword(userData.password);

  return await prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
    },
  });
}

function buildUserWhereClause(filters: UserFilters) {
  const where: any = {};

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { email: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  if (filters.role) {
    where.role = filters.role;
  }

  if (filters.department) {
    where.department = filters.department;
  }

  return where;
}
```

### State Management

#### Server State (TanStack Query)

```tsx
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("/api/users");
      return response.json();
    },
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: CreateUserInput) => {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
```

#### Local State (React Hooks)

```tsx
"use client";

import { useState, useCallback } from "react";

export function useUserForm(initialData?: Partial<User>) {
  const [formData, setFormData] = useState<UserFormData>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    role: initialData?.role || "ANGGOTA",
  });

  const [errors, setErrors] = useState<Partial<UserFormData>>({});

  const updateField = useCallback(
    (field: keyof UserFormData, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  const validate = useCallback(() => {
    const newErrors: Partial<UserFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const reset = useCallback(() => {
    setFormData({
      name: "",
      email: "",
      role: "ANGGOTA",
    });
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    updateField,
    validate,
    reset,
    isValid: Object.keys(errors).length === 0,
  };
}
```

### Styling Guidelines

#### Tailwind CSS Classes

```tsx
// Good: Semantic class names
<button className="btn-primary bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
  Save Changes
</button>

// Good: Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content */}
</div>

// Good: State-based styling
<div className={`p-4 rounded-lg ${isActive ? 'bg-blue-100 border-blue-500' : 'bg-gray-100 border-gray-300'}`}>
  {/* Content */}
</div>
```

#### CSS Custom Properties

```css
/* globals.css */
:root {
  --primary-50: #eff6ff;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
}

.btn-primary {
  background-color: var(--primary-500);
}

.btn-primary:hover {
  background-color: var(--primary-600);
}
```

### Testing

#### Unit Tests (Jest + React Testing Library)

```tsx
// components/__tests__/UserCard.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import UserCard from "../UserCard";

const mockUser = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  role: "ANGGOTA",
};

describe("UserCard", () => {
  it("renders user information", () => {
    render(<UserCard user={mockUser} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  it("calls onEdit when edit button is clicked", () => {
    const mockOnEdit = jest.fn();
    render(<UserCard user={mockUser} onEdit={mockOnEdit} />);

    fireEvent.click(screen.getByRole("button", { name: /edit/i }));

    expect(mockOnEdit).toHaveBeenCalledWith(mockUser);
  });
});
```

#### API Tests

```typescript
// app/api/users/__tests__/route.test.ts
import { GET } from "../route";
import { NextRequest } from "next/server";

describe("/api/users", () => {
  it("returns users list", async () => {
    const req = new NextRequest("http://localhost:3000/api/users");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("users");
    expect(Array.isArray(data.users)).toBe(true);
  });
});
```

### Error Handling

#### Client-side Error Handling

```tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";

export function useAsyncOperation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (operation: () => Promise<void>) => {
    try {
      setLoading(true);
      setError(null);
      await operation();
      toast.success("Operation completed successfully");
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
}
```

#### API Error Handling

```typescript
// lib/api-client.ts
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Unknown error" }));
    throw new ApiError(response.status, error.message);
  }

  return response.json();
}
```

### Performance Optimization

#### Code Splitting

```tsx
// app/admin/dashboard/page.tsx
import dynamic from "next/dynamic";

const DashboardCharts = dynamic(
  () => import("@/components/admin/DashboardCharts"),
  {
    loading: () => <div>Loading charts...</div>,
  }
);

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <DashboardCharts />
    </div>
  );
}
```

#### Image Optimization

```tsx
import Image from "next/image";

export default function OptimizedImage() {
  return (
    <Image
      src="/hero-image.jpg"
      alt="Hero"
      width={800}
      height={600}
      priority // For above-the-fold images
      placeholder="blur" // With blur placeholder
      sizes="(max-width: 768px) 100vw, 50vw" // Responsive sizes
    />
  );
}
```

#### Memoization

```tsx
import { memo, useMemo } from "react";

const UserList = memo(function UserList({ users, filter }) {
  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [users, filter]);

  return (
    <ul>
      {filteredUsers.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
});
```

## 🔧 Development Tools

### Code Quality

```json
// .eslintrc.json
{
  "extends": ["next/core-web-vitals", "@typescript-eslint/recommended"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### Pre-commit Hooks (Husky)

```bash
# Install husky
npm install --save-dev husky

# Initialize husky
npx husky install

# Add pre-commit hook
echo "npm run lint && npm run type-check" > .husky/pre-commit
```

### VS Code Extensions

- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- ESLint
- Prettier
- Prisma

## 🚀 Deployment

### Environment Variables

```env
# Production environment variables
DATABASE_URL="mongodb+srv://..."
NEXTAUTH_SECRET="production-secret"
NEXTAUTH_URL="https://yourdomain.com"
GOOGLE_CLIENT_ID="prod-client-id"
GOOGLE_CLIENT_SECRET="prod-client-secret"
RESEND_API_KEY="prod-resend-key"
```

### Build Commands

```bash
# Build for production
npm run build

# Start production server
npm start

# Or use PM2 for process management
npm install -g pm2
pm2 start npm --name "humanika" -- start
```

### Database Migration

```bash
# For production database updates
npm run prisma:migrate
npm run prisma:generate
```

## 📝 Git Workflow

### Branch Naming

```
feature/add-user-management
bugfix/fix-login-validation
hotfix/critical-security-patch
docs/update-api-documentation
```

### Commit Messages

```
feat: add user registration functionality
fix: resolve login form validation issue
docs: update component documentation
style: format code with prettier
refactor: simplify user service logic
test: add unit tests for user hooks
chore: update dependencies
```

### Pull Request Process

1. Create feature branch from `main`
2. Make changes with proper commits
3. Ensure tests pass and linting is clean
4. Create PR with description
5. Code review and approval
6. Merge to `main`

## 🔍 Debugging

### Common Issues

#### Build Errors

```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Database Connection Issues

```bash
# Check database connection
npm run prisma:studio

# Reset database
npm run prisma:reset
```

#### Authentication Issues

```bash
# Clear NextAuth session
# Client-side: localStorage.clear()
# Server-side: Check NEXTAUTH_SECRET
```

### Logging

```typescript
// Client-side logging
console.log("Debug info:", data);
console.error("Error:", error);

// Server-side logging
import { logger } from "@/lib/logger";

logger.info("User created", { userId: user.id });
logger.error("Database error", { error: err.message });
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)

---

Ikuti panduan ini untuk menjaga konsistensi dan kualitas kode dalam development Humanika.
