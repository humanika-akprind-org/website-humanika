import prisma from "@/lib/prisma";
import type { UserRole, Department, Position } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomColor } from "@/lib/random-color";
import { logActivity } from "@/lib/activity-log";
import { ActivityType } from "@/types/enums";

export const getUsers = async (filter: {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  department?: Department;
  isActive?: boolean;
  verifiedAccount?: boolean;
}) => {
  const page = filter.page || 1;
  const limit = filter.limit || 10;
  const skip = (page - 1) * limit;

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

  // Default to showing only verified accounts
  where.verifiedAccount = true;

  if (filter.search) {
    where.OR = [
      { name: { contains: filter.search, mode: "insensitive" } },
      { email: { contains: filter.search, mode: "insensitive" } },
      { username: { contains: filter.search, mode: "insensitive" } },
    ];
  }

  if (filter.role) {
    where.role = filter.role;
  }

  if (filter.department) {
    where.department = filter.department;
  }

  if (filter.isActive !== undefined) {
    where.isActive = filter.isActive;
  }

  if (filter.verifiedAccount !== undefined) {
    where.verifiedAccount = filter.verifiedAccount;
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
        avatarColor: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getUser = async (id: string) => {
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

  return user;
};

export const createUser = async (data: {
  name: string;
  email: string;
  username: string;
  password: string;
  role?: UserRole;
  department?: Department;
  position?: Position;
  isActive?: boolean;
  verifiedAccount?: boolean;
}) => {
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

  return user;
};

export const updateUser = async (
  id: string,
  data: {
    name?: string;
    email?: string;
    username?: string;
    password?: string;
    role?: UserRole;
    department?: Department;
    position?: Position;
    isActive?: boolean;
    verifiedAccount?: boolean;
  }
) => {
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

  // Log activity
  await logActivity({
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

  return updatedUser;
};

export const deleteUser = async (id: string) => {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await prisma.user.delete({
    where: { id },
  });

  // Log activity
  await logActivity({
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
};

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      password: true,
    },
  });

  if (!user || !user.password) {
    throw new Error("User not found or password not set");
  }

  const isCurrentPasswordValid = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isCurrentPasswordValid) {
    throw new Error("Current password is incorrect");
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword },
  });
};

export const deleteAccount = async (userId: string) => {
  // Find the user to delete
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Delete the user
  await prisma.user.delete({
    where: { id: userId },
  });
};

export const bulkVerifyUsers = async (userIds: string[]) => {
  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    throw new Error("userIds array is required");
  }

  // Verify all users
  const result = await prisma.user.updateMany({
    where: {
      id: { in: userIds },
    },
    data: { verifiedAccount: true },
  });

  return result;
};

export const verifyUser = async (id: string) => {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Verify user account
  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      verifiedAccount: true,
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
      updatedAt: true,
    },
  });

  return updatedUser;
};

export const bulkSendVerificationEmails = async (
  userIds: string[],
  _batchSize: number = 10
) => {
  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    throw new Error("userIds array is required");
  }

  // Check if all users exist
  const users = await prisma.user.findMany({
    where: {
      id: { in: userIds },
    },
    select: { id: true, email: true, name: true },
  });

  if (users.length !== userIds.length) {
    throw new Error("Some users not found");
  }

  // For now, just return the users - email sending logic would be handled separately
  // This maintains the same interface as the original route
  return {
    count: users.length,
    users: users.map((u) => ({ id: u.id, email: u.email })),
  };
};
