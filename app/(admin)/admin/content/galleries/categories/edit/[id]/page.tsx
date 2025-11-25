"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import GalleryCategoryForm from "@/components/admin/gallery/category/Form";
import type {
  GalleryCategory,
  UpdateGalleryCategoryInput,
} from "@/types/gallery-category";
import {
  getGalleryCategory,
  updateGalleryCategory,
} from "@/use-cases/api/gallery-category";
import { useToast } from "@/hooks/use-toast";

export default function EditGalleryCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const [category, setCategory] = useState<GalleryCategory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const { toast } = useToast();

  const categoryId = params.id as string;

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await getGalleryCategory(categoryId);
        setCategory(data);
      } catch (error) {
        console.error("Error fetching category:", error);
        toast({
          title: "Error",
          description: "Failed to fetch gallery category",
          variant: "destructive",
        });
        router.push("/admin/content/galleries/categories");
      } finally {
        setIsLoadingData(false);
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId, router, toast]);

  const handleSubmit = async (data: UpdateGalleryCategoryInput) => {
    setIsLoading(true);
    try {
      await updateGalleryCategory(categoryId, data);
      toast({
        title: "Success",
        description: "Gallery category updated successfully",
      });
      // Redirect is handled in the form
    } catch (error) {
      console.error("Error updating category:", error);
      throw error; // Re-throw to let the form handle it
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center mb-6">
          <Link
            href="/admin/content/galleries/categories"
            className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
          >
            <FiArrowLeft className="mr-1" />
            Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            Edit Gallery Category
          </h1>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="space-y-6">
        <div className="flex items-center mb-6">
          <Link
            href="/admin/content/galleries/categories"
            className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
          >
            <FiArrowLeft className="mr-1" />
            Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            Edit Gallery Category
          </h1>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
          <div className="text-center text-red-500">
            <h2 className="text-xl font-semibold mb-4">Category Not Found</h2>
            <p>
              The gallery category you&apos;re trying to edit doesn&apos;t
              exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center mb-6">
        <Link
          href="/admin/content/galleries/categories"
          className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
        >
          <FiArrowLeft className="mr-1" />
          Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">
          Edit Gallery Category
        </h1>
      </div>

      {/* Form */}
      <GalleryCategoryForm
        category={category}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
