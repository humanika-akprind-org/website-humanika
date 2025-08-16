import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="justify-center w-full flex text-center pt-10 flex-col items-center">
        {/* Company Logo */}
        <Image
          src="https://drive.google.com/uc?export=view&id=1sRLxNW0acJyOJdflhEF30QiqNkuSaw03"
          alt="Company Logo"
          width={200}
          height={100}
          className="mb-4"
          priority
        />

        <h1 className="text-2xl font-bold mb-6">Welcome to Our Platform</h1>

        <div className="flex flex-col gap-4 w-full max-w-xs">
          <Link href="/api/auth/signin/google" className="w-full">
            <Button className="w-full">Login with Google</Button>
          </Link>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          <Link href="/auth/login">
            <Button variant="outline" className="w-full">
              Login with Email
            </Button>
          </Link>

          <p className="text-sm text-muted-foreground mt-4">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    );
  }

  redirect("/dashboard");
}
