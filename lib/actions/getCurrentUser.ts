"use server";

import { getCurrentUser } from "@/lib/auth-server";
import type { User } from "@/types/user";

export async function getCurrentUserAction(): Promise<User | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  return user as unknown as User;
}
