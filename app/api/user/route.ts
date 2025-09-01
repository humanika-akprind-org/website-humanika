// app/api/user/route.ts
import { type NextRequest, NextResponse } from "next/server";
import {
  PrismaClient,
  type UserRole,
  type Department,
  type Position,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

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

    const skip = (page - 1) * limit;

    const verifiedAccount = searchParams.get("verifiedAccount");

    const where: {
      OR?: Array<{
        name?: { contains: string; mode: "insensitive" };
        email?: { contains: string; mode: "insensitive" };
        username?: { contains: string; mode: "insensitive" };
      }>;
      role?: UserRole;
      department?: Department;
      isActive?: boolean;
      verifiedAccount?: boolean;
    } = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { username: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role) {
      where.role = role as UserRole;
    }

    if (department) {
      where.department = department as Department;
    }

    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    if (verifiedAccount !== null && verifiedAccount !== undefined) {
      where.verifiedAccount = verifiedAccount === "true";
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
          role: true,
          department: true,
          position: true,
          isActive: true,
          verifiedAccount: true,
          attemptLogin: true,
          blockExpires: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
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
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or username already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        username,
        password: hashedPassword,
        role: (role || "ANGGOTA") as UserRole,
        department: department ? (department as Department) : null,
        position: position ? (position as Position) : null,
        isActive: isActive !== undefined ? isActive : true,
        verifiedAccount:
          verifiedAccount !== undefined ? verifiedAccount : false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
        department: true,
        position: true,
        isActive: true,
        verifiedAccount: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
