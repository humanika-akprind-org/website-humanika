import crypto from "crypto";
import Link from "next/link";
import oauth2Client from "./lib/google-oauth";
import { Button } from "@/components/ui/button";
export default function Home() {
  const SCOPE = [
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/documents",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive.appdata",
    "https://www.googleapis.com/auth/drive.photos.readonly",
  ];

  //where do i store this state
  const state = crypto.randomBytes(16).toString("hex");

  //generate the url
  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPE,
    state,
  });

  return (
    <div className="justify-center w-full flex text-center pt-10 flex-col items-center">
      <h1>Home</h1>
      <Link href={authorizationUrl}>
        <Button>Login with Google</Button>
      </Link>
    </div>
  );
}
