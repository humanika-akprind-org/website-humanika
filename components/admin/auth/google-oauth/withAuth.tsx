import { cookies } from "next/headers";
import AuthGuard from "./AuthGuard";
import type { ReactNode } from "react";

export interface WithAuthProps {
  accessToken: string;
  children: ReactNode;
}

export function withAuth<T extends object>(Component: React.ComponentType<T>) {
  return async function WithAuthWrapper(props: T) {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("google_access_token")?.value || "";

    return (
      <AuthGuard accessToken={accessToken}>
        <Component {...props} accessToken={accessToken} />
      </AuthGuard>
    );
  };
}
