// app/api/user/[id]/route.ts
import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { type UserRole, type Department, type Position } from "@prisma/client";
import bcrypt from "bcryptjs";
import { logActivityFromRequest } from "@/lib/activity-log";
import { ActivityType } from "@/types/enums";

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
        avatarColor: true,
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
        avatarColor: true,
      },
    });

    // Log activity - Note: This is an admin operation, so we use "system" as userId
    await logActivityFromRequest(request, {
      userId: "system", // Since this is user update, no authenticated user context
      activityType: ActivityType.UPDATE,
      entityType: "User",
      entityId: updatedUser.id,
      description: `Updated user: ${updatedUser.name}`,
      metadata: {
        oldData: {
          name: existingUser.name,
          email: existingUser.email,
          username: existingUser.username,
          role: existingUser.role,
          department: existingUser.department,
          position: existingUser.position,
          isActive: existingUser.isActive,
          verifiedAccount: existingUser.verifiedAccount,
        },
        newData: {
          name: updatedUser.name,
          email: updatedUser.email,
          username: updatedUser.username,
          role: updatedUser.role,
          department: updatedUser.department,
          position: updatedUser.position,
          isActive: updatedUser.isActive,
          verifiedAccount: updatedUser.verifiedAccount,
        },
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

    // Log activity - Note: This is an admin operation, so we use "system" as userId
    await logActivityFromRequest(_request, {
      userId: "system", // Since this is user deletion, no authenticated user context
      activityType: ActivityType.DELETE,
      entityType: "User",
      entityId: id,
      description: `Deleted user: ${user.name}`,
      metadata: {
        oldData: {
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role,
          department: user.department,
          position: user.position,
          isActive: user.isActive,
          verifiedAccount: user.verifiedAccount,
        },
        newData: null,
      },
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
