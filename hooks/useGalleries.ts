import { useState, useEffect, useCallback } from "react";
import { getGalleries, getGallery, createGallery, updateGallery, deleteGallery } from "@/lib/api/gallery";
import type { Gallery, CreateGalleryInput, UpdateGalleryInput, GalleryFilter } from "@/types/gallery";

export const useGalleries = (filter?: GalleryFilter) => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGalleries = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getGalleries(filter);
      setGalleries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch galleries");
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchGalleries();
  }, [fetchGalleries]);

  const create = async (data: CreateGalleryInput): Promise<Gallery> => {
    const newGallery = await createGallery(data);
    setGalleries(prev => [newGallery, ...prev]);
    return newGallery;
  };

  const update = async (id: string, data: UpdateGalleryInput): Promise<Gallery> => {
    const updatedGallery = await updateGallery(id, data);
    setGalleries(prev => prev.map(g => g.id === id ? updatedGallery : g));
    return updatedGallery;
  };

  const remove = async (id: string): Promise<void> => {
    await deleteGallery(id);
    setGalleries(prev => prev.filter(g => g.id !== id));
  };

  return {
    galleries,
    isLoading,
    error,
    refetch: fetchGalleries,
    create,
    update,
    remove,
  };
};

export const useGallery = (id: string) => {
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGallery = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getGallery(id);
      setGallery(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch gallery");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchGallery();
    }
  }, [id, fetchGallery]);

  const update = async (data: UpdateGalleryInput): Promise<Gallery> => {
    const updatedGallery = await updateGallery(id, data);
    setGallery(updatedGallery);
    return updatedGallery;
  };

  const remove = async (): Promise<void> => {
    await deleteGallery(id);
    setGallery(null);
  };

  return {
    gallery,
    isLoading,
    error,
    refetch: fetchGallery,
    update,
    remove,
  };
};
