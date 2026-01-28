/**
 * Create User Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { UserRole, Department, Position } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomColor } from "@/presentation/lib/random-color";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import { type User } from "@/domain/entities/user.entity";

type CreateUserInput = {
  name: string;
  email: string;
  username: string;
  password: string;
  role?: UserRole;
  department?: Department;
  position?: Position;
  isActive?: boolean;
  verifiedAccount?: boolean;
};

/**
 * Create a new user
 */
export async function createUser(data: CreateUserInput) {
  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: data.email }, { username: data.username }],
    },
  });

  if (existingUser) {
    throw new Error("User with this email or username already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      username: data.username,
      password: hashedPassword,
      role: data.role || "ANGGOTA",
      department: data.department || null,
      position: data.position || null,
      isActive: data.isActive !== undefined ? data.isActive : true,
      verifiedAccount:
        data.verifiedAccount !== undefined ? data.verifiedAccount : false,
      avatarColor: randomColor,
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
      avatarColor: true,
    },
  });

  // Log activity
  await logActivity({
    userId: "system", // Since this is user creation, no authenticated user context
    activityType: ActivityType.CREATE,
    entityType: "User",
    entityId: user.id,
    description: `Created user: ${user.name}`,
    metadata: {
      newData: {
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        department: user.department,
        position: user.position,
        isActive: user.isActive,
        verifiedAccount: user.verifiedAccount,
      },
    },
  });

  return user as unknown as User;
}
