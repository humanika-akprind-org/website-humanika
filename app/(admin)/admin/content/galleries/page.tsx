"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import GalleryTable from "@/components/admin/gallery/Table";
import type { Gallery } from "@/types/gallery";
import { useToast } from "@/hooks/use-toast";

export default function GalleriesPage() {
  const [_galleries, setGalleries] = useState<Gallery[]>([]);
  const [filteredGalleries, setFilteredGalleries] = useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [_deleteModal, setDeleteModal] = useState({
    isOpen: false,
    galleryId: "",
    galleryName: "",
  });
  const [accessToken, setAccessToken] = useState<string>("");

  const { toast } = useToast();

  // Get access token on component mount
  useEffect(() => {
    const getToken = async () => {
      try {
        // Get token from cookies (server-side rendered)
        const response = await fetch('/api/auth/token');
        if (response.ok) {
          const data = await response.json();
          setAccessToken(data.accessToken || '');
        } else {
          console.error('Failed to get access token from API');
        }
      } catch (error) {
        console.error('Failed to get access token:', error);
      }
    };
    getToken();
  }, []);

  const fetchGalleries = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/gallery");
      if (response.ok) {
        const data = await response.json();
        setGalleries(data || []);
        setFilteredGalleries(data || []);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch galleries",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching galleries:", error);
      toast({
        title: "Error",
        description: "Failed to fetch galleries",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Fetch galleries
  useEffect(() => {
    fetchGalleries();
  }, [fetchGalleries]);

  const handleDelete = async (galleryId: string) => {
    try {
      const response = await fetch(`/api/gallery/${galleryId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Gallery deleted successfully",
        });
        fetchGalleries(); // Refresh the list
      } else {
        toast({
          title: "Error",
          description: "Failed to delete gallery",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting gallery:", error);
      toast({
        title: "Error",
        description: "Failed to delete gallery",
        variant: "destructive",
      });
    } finally {
      setDeleteModal({ isOpen: false, galleryId: "", galleryName: "" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gallery Management
          </h1>
          <p className="text-gray-600">Manage and organize your gallery files</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/admin/content/galleries/add"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPlus className="h-4 w-4 mr-2" />
            Add Gallery
          </Link>
        </div>
      </div>

      {/* Galleries Table */}
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
        <GalleryTable galleries={filteredGalleries} onDelete={handleDelete} accessToken={accessToken} />
      )}
    </div>
  );
}
