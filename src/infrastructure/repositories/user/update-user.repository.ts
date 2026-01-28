/**
 * Update User Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { UserRole, Department, Position } from "@prisma/client";
import bcrypt from "bcryptjs";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { User } from "@/domain/entities/user.entity";

type UpdateUserInput = {
  name?: string;
  email?: string;
  username?: string;
  password?: string;
  role?: UserRole;
  department?: Department;
  position?: Position;
  isActive?: boolean;
  verifiedAccount?: boolean;
};

type UserWithId = Pick<User, "id">;

/**
 * Update an existing user
 */
export async function updateUser(
  id: string,
  data: UpdateUserInput,
  user?: UserWithId,
) {
  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    throw new Error("User not found");
  }

  // Check for duplicate email or username
  if (
    (data.email && data.email !== existingUser.email) ||
    (data.username && data.username !== existingUser.username)
  ) {
    const duplicateUser = await prisma.user.findFirst({
      where: {
        OR: [
          data.email ? { email: data.email } : {},
          data.username ? { username: data.username } : {},
        ].filter((obj) => Object.keys(obj).length > 0),
        NOT: { id },
      },
    });

    if (duplicateUser) {
      throw new Error("Email or username already taken");
    }
  }

  const updateData: Record<string, unknown> = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.username !== undefined) updateData.username = data.username;
  if (data.role !== undefined) updateData.role = data.role;
  if (data.department !== undefined) updateData.department = data.department;
  if (data.position !== undefined) updateData.position = data.position;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;
  if (data.verifiedAccount !== undefined) {
    updateData.verifiedAccount = data.verifiedAccount;
  }
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 12);
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

  // Log activity only if user context is provided
  if (user) {
    await logActivity({
      userId: user.id,
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
  }

  return updatedUser as User;
}
