"use server";

import { getCurrentUser } from "@/src/presentation/lib/auth-server";
import type { User } from "@/src/domain/entities/user";

export async function getCurrentUserAction(): Promise<User | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  return user as unknown as User;
}
