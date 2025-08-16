import { SCOPES } from "@/lib/scopes";
import { FaGoogle } from "react-icons/fa6"; // Changed from react-icons/fa to fa6
import { signIn, type SignInResponse } from "next-auth/react";

export interface AuthProvider {
  id: string;
  name: string;
  Icon: React.ComponentType<{ className?: string }>;
  signIn: (callbackUrl?: string) => Promise<SignInResponse | undefined>;
  scopes?: string[];
}

export const authProviders: AuthProvider[] = [
  {
    id: "google",
    name: "Google",
    Icon: FaGoogle,
    signIn: (callbackUrl = "/") => signIn("google", { callbackUrl }),
    scopes: [...SCOPES],
  },
];

export const getProviderById = (id: string): AuthProvider | undefined => {
  return authProviders.find((provider) => provider.id === id);
};

export type AuthProviderType = (typeof authProviders)[number];
