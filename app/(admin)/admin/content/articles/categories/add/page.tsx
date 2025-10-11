"use client";

import { useState } from "react";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import ArticleCategoryForm from "@/components/admin/article/category/Form";
import type { CreateArticleCategoryInput, UpdateArticleCategoryInput } from "@/types/article-category";
import { createArticleCategory } from "@/lib/api/article-category";
import { useToast } from "@/hooks/use-toast";

export default function AddArticleCategoryPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: CreateArticleCategoryInput | UpdateArticleCategoryInput) => {
    setIsLoading(true);
    try {
      await createArticleCategory(data as CreateArticleCategoryInput);
      toast({
        title: "Success",
        description: "Article category created successfully",
      });
      // Redirect is handled in the form
    } catch (error) {
      console.error("Error creating category:", error);
      throw error; // Re-throw to let the form handle it
    } finally {
      setIsLoading(false);
    }
  };

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
          Add New Article Category
        </h1>
      </div>

      {/* Form */}
      <ArticleCategoryForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
