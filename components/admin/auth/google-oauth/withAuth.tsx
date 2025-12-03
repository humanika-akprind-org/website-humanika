import { getGoogleAccessToken } from "@/lib/google-drive/google-oauth";
import AuthGuard from "./AuthGuard";
import type { ReactNode } from "react";

export interface WithAuthProps {
  accessToken: string;
  children: ReactNode;
}

export function withAuth<T extends object>(Component: React.ComponentType<T>) {
  return async function WithAuthWrapper(props: T) {
    const accessToken = await getGoogleAccessToken();

    return (
      <AuthGuard accessToken={accessToken}>
        <Component {...props} accessToken={accessToken} />
      </AuthGuard>
    );
  };
}
