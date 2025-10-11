"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import ArticleCategoryForm from "@/components/admin/article/category/Form";
import type { ArticleCategory, UpdateArticleCategoryInput } from "@/types/article-category";
import { getArticleCategory, updateArticleCategory } from "@/lib/api/article-category";
import { useToast } from "@/hooks/use-toast";

export default function EditArticleCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const [category, setCategory] = useState<ArticleCategory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const { toast } = useToast();

  const categoryId = params.id as string;

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await getArticleCategory(categoryId);
        setCategory(data);
      } catch (error) {
        console.error("Error fetching category:", error);
        toast({
          title: "Error",
          description: "Failed to fetch article category",
          variant: "destructive",
        });
        router.push("/admin/content/articles/categories");
      } finally {
        setIsLoadingData(false);
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId, router, toast]);

  const handleSubmit = async (data: UpdateArticleCategoryInput) => {
    setIsLoading(true);
    try {
      await updateArticleCategory(categoryId, data);
      toast({
        title: "Success",
        description: "Article category updated successfully",
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
            href="/admin/content/articles/categories"
            className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
          >
            <FiArrowLeft className="mr-1" />
            Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            Edit Article Category
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
            href="/admin/content/articles/categories"
            className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
          >
            <FiArrowLeft className="mr-1" />
            Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            Edit Article Category
          </h1>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
          <div className="text-center text-red-500">
            <h2 className="text-xl font-semibold mb-4">Category Not Found</h2>
            <p>
              The article category you&apos;re trying to edit doesn&apos;t
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
          href="/admin/content/articles/categories"
          className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
        >
          <FiArrowLeft className="mr-1" />
          Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">
          Edit Article Category
        </h1>
      </div>

      {/* Form */}
      <ArticleCategoryForm
        category={category}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
