import crypto from "crypto";
import oauth2Client from "@/app/lib/google-oauth";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const SCOPE = [
  "https://www.googleapis.com/auth/drive.metadata.readonly",
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/documents",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/drive.appdata",
  "https://www.googleapis.com/auth/drive.photos.readonly",
];

interface GoogleLoginButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function GoogleLoginButton({
  className,
  children = "Login with Google",
}: GoogleLoginButtonProps) {
  const state = crypto.randomBytes(16).toString("hex");
  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPE.join(" "),
    state,
  });

  return (
    <Link href={authorizationUrl} className={className}>
      <Button variant="outline" className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21.8 10H12v4h5.7c-.8 2.3-3 4-5.7 4-3.3 0-6-2.7-6-6s2.7-6 6-6c1.7 0 3.2.7 4.2 1.8L19 4.2C17.1 2.4 14.7 1 12 1 5.9 1 1 5.9 1 12s4.9 11 11 11 11-4.9 11-11c0-1.3-.2-2.7-.7-4z" />
        </svg>
        {children}
      </Button>
    </Link>
  );
}
