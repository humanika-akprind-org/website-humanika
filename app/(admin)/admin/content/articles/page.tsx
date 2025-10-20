"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import ArticleTable from "@/components/admin/article/Table";
import DeleteModal from "@/components/admin/article/modal/DeleteModal";
import type { Article } from "@/types/article";
import { useToast } from "@/hooks/use-toast";

export default function ArticlesPage() {
  const [_articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    articleId: "",
    articleName: "",
  });

  const { toast } = useToast();

  const fetchArticles = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/article");
      if (response.ok) {
        const data = await response.json();
        setArticles(data || []);
        setFilteredArticles(data || []);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch articles",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast({
        title: "Error",
        description: "Failed to fetch articles",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Fetch articles
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleDelete = async (articleId: string) => {
    try {
      const response = await fetch(`/api/article/${articleId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Article deleted successfully",
        });
        fetchArticles(); // Refresh the list
      } else {
        toast({
          title: "Error",
          description: "Failed to delete article",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      toast({
        title: "Error",
        description: "Failed to delete article",
        variant: "destructive",
      });
    } finally {
      setDeleteModal({ isOpen: false, articleId: "", articleName: "" });
    }
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, articleId: "", articleName: "" });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Articles Management
          </h1>
          <p className="text-gray-600">Manage and organize your articles</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/admin/content/articles/add"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPlus className="h-4 w-4 mr-2" />
            Add Article
          </Link>
        </div>
      </div>

      {/* Articles Table */}
      {isLoading ? (
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
      ) : (
        <ArticleTable articles={filteredArticles} onDelete={handleDelete} />
      )}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={() => handleDelete(deleteModal.articleId)}
        articleName={deleteModal.articleName}
      />
    </div>
  );
}
