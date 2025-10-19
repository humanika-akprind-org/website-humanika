import GalleryForm from "@/components/admin/gallery/Form";
import AuthGuard from "@/components/admin/auth/google-oauth/AuthGuard";
import { cookies } from "next/headers";
import type { CreateGalleryInput, UpdateGalleryInput } from "@/types/gallery";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

async function AddGalleryPage() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("google_access_token")?.value || "";

  const handleSubmit = async (data: CreateGalleryInput | UpdateGalleryInput) => {
    "use server";

    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Unauthorized");
    }

    // Cast data to CreateGalleryInput since this is the add page
    const galleryData = data as CreateGalleryInput;

    if (!galleryData.title || !galleryData.eventId) {
      throw new Error("Missing required fields");
    }

    await prisma.gallery.create({
      data: {
        title: galleryData.title,
        eventId: galleryData.eventId,
        image: galleryData.image || "",
      },
    });

    redirect("/admin/content/galleries");
  };

  return (
    <AuthGuard accessToken={accessToken}>
      <div className="p-6 max-w-4xl min-h-screen mx-auto">
        <div className="flex items-center mb-6">
          <Link
            href="/admin/content/galleries"
            className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
          >
            <FiArrowLeft className="mr-1" />
            Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Add New Gallery</h1>
        </div>
        <GalleryForm
          accessToken={accessToken}
          onSubmit={handleSubmit}
          isLoading={false}
        />
      </div>
    </AuthGuard>
  );
}

export default AddGalleryPage;
