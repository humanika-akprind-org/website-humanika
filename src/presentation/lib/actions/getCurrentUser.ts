"use server";

import { getCurrentUser } from "@/presentation/lib/auth-server";
import type { User } from "@/domain/entities/user";

export async function getCurrentUserAction(): Promise<User | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  return user as unknown as User;
}
