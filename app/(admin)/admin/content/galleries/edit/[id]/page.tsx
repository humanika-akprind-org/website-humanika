import GalleryForm from "@/components/admin/gallery/Form";
import AuthGuard from "@/components/admin/auth/google-oauth/AuthGuard";
import { cookies } from "next/headers";
import type { UpdateGalleryInput } from "@/types/gallery";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";

async function EditGalleryPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("google_access_token")?.value || "";

  try {
    const [events, gallery] = await Promise.all([
      prisma.event.findMany({
        include: {
          period: true,
          responsible: {
            select: {
              id: true,
              name: true,
              email: true,
              department: true,
            },
          },
          workProgram: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { startDate: "desc" },
      }),
      prisma.gallery.findUnique({
        where: { id: params.id },
      }),
    ]);

    if (!gallery) {
      notFound();
    }

    const handleSubmit = async (data: UpdateGalleryInput) => {
      "use server";

      const user = await getCurrentUser();
      if (!user) {
        throw new Error("Unauthorized");
      }

      // Cast data to UpdateGalleryInput since this is the edit page
      const galleryData = data as UpdateGalleryInput;

      if (!galleryData.title || !galleryData.eventId) {
        throw new Error("Missing required fields");
      }

      await prisma.gallery.update({
        where: { id: params.id },
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
            <h1 className="text-2xl font-bold text-gray-800">Edit Gallery</h1>
          </div>
          <GalleryForm
            gallery={gallery}
            accessToken={accessToken}
            events={events as any[]}
            onSubmit={handleSubmit}
            isLoading={false}
          />
        </div>
      </AuthGuard>
    );
  } catch (error) {
    console.error("Error loading form data:", error);
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="text-center text-red-500">
              <h2 className="text-xl font-semibold mb-4">Error Loading Form</h2>
              <p>{error instanceof Error ? error.message : "Unknown error"}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EditGalleryPage;
