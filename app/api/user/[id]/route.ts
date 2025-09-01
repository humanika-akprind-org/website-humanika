// app/api/user/[id]/route.ts
import { type NextRequest, NextResponse } from "next/server";
import {
  PrismaClient,
  type UserRole,
  type Department,
  type Position,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// GET - Get user by ID
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const user = await prisma.user.findUnique({
      where: { id },
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
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check for duplicate email or username
    if (email !== existingUser.email || username !== existingUser.username) {
      const duplicateUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { username }],
          NOT: { id },
        },
      });

      if (duplicateUser) {
        return NextResponse.json(
          { error: "Email or username already taken" },
          { status: 409 }
        );
      }
    }

    const updateData: {
      name: string;
      email: string;
      username: string;
      role: UserRole;
      department: Department | null;
      position: Position | null;
      isActive: boolean;
      verifiedAccount: boolean;
      password?: string;
    } = {
      name,
      email,
      username,
      role: role as UserRole,
      department: department ? (department as Department) : null,
      position: position ? (position as Position) : null,
      isActive: isActive !== undefined ? isActive : existingUser.isActive,
      verifiedAccount:
        verifiedAccount !== undefined
          ? verifiedAccount
          : existingUser.verifiedAccount,
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
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
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete user
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
