// app/api/user/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { type UserRole, type Department, type Position } from "@prisma/client";
import { getUsers, createUser } from "@/services/user/user.service";
import { getCurrentUser } from "@/lib/auth-server";

// GET - Get all users
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const department = searchParams.get("department") || "";
    const isActive = searchParams.get("isActive");
    const verifiedAccount = searchParams.get("verifiedAccount");
    const allUsers = searchParams.get("allUsers");

    // Get current user to exclude from results
    const currentUser = await getCurrentUser();

    // When search is provided, automatically fetch all users without pagination
    // This enables proper search functionality in select inputs
    const shouldFetchAll = !!search || allUsers === "true";

    const result = await getUsers({
      page: shouldFetchAll ? undefined : page,
      limit: shouldFetchAll ? undefined : limit,
      search: search || undefined,
      role: (role as UserRole) || undefined,
      department: (department as Department) || undefined,
      isActive: isActive ? isActive === "true" : undefined,
      verifiedAccount: verifiedAccount ? verifiedAccount === "true" : undefined,
      allUsers: shouldFetchAll,
      excludeUserId: currentUser?.id,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST - Create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      username,
      password,
      role,
      department,
      position,
      isActive,
      verifiedAccount,
    } = body;

    // Validation
    if (!name || !email || !username || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const user = await createUser({
      name,
      email,
      username,
      password,
      role: role as UserRole,
      department: department as Department,
      position: position as Position,
      isActive,
      verifiedAccount,
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    if (error instanceof Error && error.message.includes("already exists")) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
