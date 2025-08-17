import GoogleDriveConnect from "@/components/google-drive/GoogleDriveConnect";
import { getCurrentUser } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/auth/LogoutButton";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-8 flex justify-center">
          <Image
            src="https://drive.google.com/uc?export=view&id=1sRLxNW0acJyOJdflhEF30QiqNkuSaw03"
            alt="HUMANIKA Logo"
            width={200}
            height={100}
            className="rounded-full border-4 border-blue-100 object-cover"
          />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Selamat Datang di DriveSync
        </h1>
        <p className="text-gray-600 mb-8">
          Kelola file Google Drive Anda dengan mudah
        </p>

        {user ? (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-medium">Halo, {user.name || user.username}!</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>

            <div className="flex flex-col space-y-3">
              <GoogleDriveConnect />
              <LogoutButton />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex space-x-4">
              <Link href="/auth/login" className="w-full">
                <Button variant="outline" className="w-full">
                  Masuk
                </Button>
              </Link>
              <Link href="/auth/register" className="w-full">
                <Button className="w-full">Daftar</Button>
              </Link>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} DriveSync. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
}
