import { cn } from "@/lib/utils";
import * as React from "react";

interface AuthFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

export function AuthForm({ className, children, ...props }: AuthFormProps) {
  return (
    <form className={cn("grid gap-4", className)} {...props}>
      {children}
    </form>
  );
}
