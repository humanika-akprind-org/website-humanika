import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "lib/auth-server";
import { UserRole } from "@prisma/client";
import NextRateLimit from "next-rate-limit";

// Define RBAC rules with regex patterns for dynamic routes
const rbacRules: { pattern: RegExp; roles: UserRole[] }[] = [
  // Dashboard Section
  {
    pattern: /^\/admin\/dashboard\/overview$/,
    roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/dashboard\/activity$/,
    roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/dashboard\/stats$/,
    roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
  },

  // Governance Section
  {
    pattern: /^\/admin\/governance\/periods$/,
    roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/governance\/periods\/add$/,
    roles: [UserRole.DPO, UserRole.BPH],
  },
  {
    pattern: /^\/admin\/governance\/periods\/edit\/[^/]+$/,
    roles: [UserRole.DPO, UserRole.BPH],
  },
  {
    pattern: /^\/admin\/governance\/managements$/,
    roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/governance\/managements\/add$/,
    roles: [UserRole.BPH, UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/governance\/managements\/edit\/[^/]+$/,
    roles: [UserRole.BPH, UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/governance\/structure$/,
    roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
  },
  { pattern: /^\/admin\/governance\/structure\/add$/, roles: [UserRole.BPH] },
  {
    pattern: /^\/admin\/governance\/structure\/edit\/[^/]+$/,
    roles: [UserRole.BPH],
  },
  {
    pattern: /^\/admin\/governance\/tasks$/,
    roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
  },
  { pattern: /^\/admin\/governance\/tasks\/add$/, roles: [UserRole.PENGURUS] },
  {
    pattern: /^\/admin\/governance\/tasks\/edit\/[^/]+$/,
    roles: [UserRole.PENGURUS],
  },

  // People & Access Section
  { pattern: /^\/admin\/people\/users$/, roles: [UserRole.BPH] },
  { pattern: /^\/admin\/people\/users\/add$/, roles: [UserRole.BPH] },
  { pattern: /^\/admin\/people\/users\/edit\/[^/]+$/, roles: [UserRole.BPH] },
  { pattern: /^\/admin\/people\/users\/roles$/, roles: [UserRole.BPH] },

  // Programs & Events Section
  {
    pattern: /^\/admin\/program\/works$/,
    roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/program\/works\/add$/,
    roles: [UserRole.BPH, UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/program\/works\/edit\/[^/]+$/,
    roles: [UserRole.BPH, UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/program\/works\/approval$/,
    roles: [UserRole.DPO, UserRole.BPH],
  },
  {
    pattern: /^\/admin\/program\/events$/,
    roles: [UserRole.BPH, UserRole.PENGURUS],
  },
  { pattern: /^\/admin\/program\/events\/add$/, roles: [UserRole.PENGURUS] },
  {
    pattern: /^\/admin\/program\/events\/edit\/[^/]+$/,
    roles: [UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/program\/events\/categories$/,
    roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/program\/events\/categories\/add$/,
    roles: [UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/program\/events\/categories\/edit\/[^/]+$/,
    roles: [UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/program\/events\/approval$/,
    roles: [UserRole.DPO, UserRole.BPH],
  },

  // Administration Section
  {
    pattern: /^\/admin\/administration\/proposals$/,
    roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/administration\/proposals\/add$/,
    roles: [UserRole.BPH, UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/administration\/proposals\/edit\/[^/]+$/,
    roles: [UserRole.BPH, UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/administration\/proposals\/approval$/,
    roles: [UserRole.DPO, UserRole.BPH],
  },
  {
    pattern: /^\/admin\/administration\/accountability-reports$/,
    roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/administration\/accountability-reports\/add$/,
    roles: [UserRole.BPH, UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/administration\/accountability-reports\/edit\/[^/]+$/,
    roles: [UserRole.BPH, UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/administration\/accountability-reports\/approval$/,
    roles: [UserRole.DPO, UserRole.BPH],
  },
  {
    pattern: /^\/admin\/administration\/letters$/,
    roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/administration\/letters\/add$/,
    roles: [UserRole.BPH, UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/administration\/letters\/edit\/[^/]+$/,
    roles: [UserRole.BPH, UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/administration\/letters\/approval$/,
    roles: [UserRole.DPO, UserRole.BPH],
  },
  {
    pattern: /^\/admin\/administration\/documents$/,
    roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/administration\/documents\/add$/,
    roles: [UserRole.BPH, UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/administration\/documents\/edit\/[^/]+$/,
    roles: [UserRole.BPH, UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/administration\/documents\/types$/,
    roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/administration\/documents\/types\/add$/,
    roles: [UserRole.BPH, UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/administration\/documents\/types\/edit\/[^/]+$/,
    roles: [UserRole.BPH, UserRole.PENGURUS],
  },

  // Content & Media Section
  {
    pattern: /^\/admin\/content\/articles$/,
    roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
  },
  { pattern: /^\/admin\/content\/articles\/add$/, roles: [UserRole.PENGURUS] },
  {
    pattern: /^\/admin\/content\/articles\/edit\/[^/]+$/,
    roles: [UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/content\/articles\/categories$/,
    roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/content\/articles\/categories\/add$/,
    roles: [UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/content\/articles\/categories\/edit\/[^/]+$/,
    roles: [UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/content\/galleries$/,
    roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
  },
  { pattern: /^\/admin\/content\/galleries\/add$/, roles: [UserRole.PENGURUS] },
  {
    pattern: /^\/admin\/content\/galleries\/edit\/[^/]+$/,
    roles: [UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/content\/galleries\/categories$/,
    roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/content\/galleries\/categories\/add$/,
    roles: [UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/content\/galleries\/categories\/edit\/[^/]+$/,
    roles: [UserRole.PENGURUS],
  },

  // Finance Section
  {
    pattern: /^\/admin\/finance\/transactions$/,
    roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/finance\/transactions\/add$/,
    roles: [UserRole.BPH, UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/finance\/transactions\/edit\/[^/]+$/,
    roles: [UserRole.BPH, UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/finance\/transactions\/approval$/,
    roles: [UserRole.DPO, UserRole.BPH],
  },
  {
    pattern: /^\/admin\/finance\/transactions\/reports$/,
    roles: [UserRole.DPO, UserRole.BPH],
  },
  {
    pattern: /^\/admin\/finance\/transactions\/categories$/,
    roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/finance\/transactions\/categories\/add$/,
    roles: [UserRole.BPH, UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/finance\/transactions\/categories\/edit\/[^/]+$/,
    roles: [UserRole.BPH, UserRole.PENGURUS],
  },

  // System Section
  {
    pattern: /^\/admin\/system\/activity$/,
    roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
  },

  // Settings Section
  {
    pattern: /^\/admin\/settings\/profile$/,
    roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
  },
  {
    pattern: /^\/admin\/settings\/account$/,
    roles: [UserRole.DPO, UserRole.BPH, UserRole.PENGURUS],
  },
];

const rateLimit = NextRateLimit({
  interval: 60 * 1000, // 1 menit
  uniqueTokenPerInterval: 500,
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rate limit API requests
  if (pathname.startsWith("/api/")) {
    try {
      const headers = await rateLimit.checkNext(request, 10); // 10 request/menit

      // Check if rate limit exceeded by looking for X-RateLimit-Remaining header
      const remaining = parseInt(headers.get("X-RateLimit-Remaining") || "0");

      if (remaining <= 0) {
        return new NextResponse(
          JSON.stringify({
            error: "Rate limit exceeded",
            resetIn: parseInt(headers.get("X-RateLimit-Reset") || "0"),
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              ...Object.fromEntries(headers.entries()),
            },
          }
        );
      }

      const response = NextResponse.next();
      // Add rate limit headers to the response
      headers.forEach((value, key) => {
        response.headers.set(key, value);
      });

      return response;
    } catch {
      return NextResponse.next(); // Fallback jika error
    }
  }

  // Handle /auth/admin/login path
  if (pathname === "/auth/admin/login") {
    const user = await getCurrentUser();
    if (
      user &&
      (user.role === UserRole.DPO ||
        user.role === UserRole.BPH ||
        user.role === UserRole.PENGURUS)
    ) {
      return NextResponse.redirect(
        new URL("/admin/dashboard/overview", request.url)
      );
    }
    // Allow access to login page if not logged in or not admin roles
    return NextResponse.next();
  }

  // Handle /auth/:path* paths for logged-in users
  if (pathname.startsWith("/auth/")) {
    const user = await getCurrentUser();
    if (user) {
      if (user.role === UserRole.ANGGOTA) {
        return NextResponse.redirect(new URL("/", request.url));
      } else if (
        user.role === UserRole.DPO ||
        user.role === UserRole.BPH ||
        user.role === UserRole.PENGURUS
      ) {
        return NextResponse.redirect(
          new URL("/admin/dashboard/overview", request.url)
        );
      }
    }
    // Allow access if not logged in
    return NextResponse.next();
  }

  // Only apply middleware to /admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.redirect(new URL("/auth/admin/login", request.url));
  }

  // Check if user is active
  if (!user.isActive) {
    return NextResponse.redirect(new URL("/auth/admin/login", request.url));
  }

  const userRole = user.role;

  // If user is ANGGOTA, redirect to home
  if (userRole === UserRole.ANGGOTA) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Find matching rule
  const rule = rbacRules.find((rule) => rule.pattern.test(pathname));

  if (rule) {
    // Check if user role is allowed
    if (!rule.roles.includes(userRole)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  } else {
    // Default for /admin/* paths not explicitly defined: DPO, BPH, PENGURUS
    if (
      userRole !== UserRole.DPO &&
      userRole !== UserRole.BPH &&
      userRole !== UserRole.PENGURUS
    ) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*", "/api/:path*"],
  runtime: "nodejs",
};
