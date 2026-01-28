/**
 * User Repository - Barrel Export
 * Part of Clean Architecture: Infrastructure Layer
 */

import { UserRepositoryPrisma } from "./user-repository-prisma";

// Helper functions for API routes
export async function verifyUser(id: string) {
  const repo = new UserRepositoryPrisma();
  return repo.verifyUser(id);
}

export async function bulkSendVerificationEmails(userIds: string[]) {
  const repo = new UserRepositoryPrisma();
  const users = await repo.getUsersForVerification(userIds);
  // In a real implementation, you would send emails here
  // For now, just return the users
  return users;
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
) {
  const repo = new UserRepositoryPrisma();
  return repo.changePassword(userId, currentPassword, newPassword);
}

export { UserRepositoryPrisma };
