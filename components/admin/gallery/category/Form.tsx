"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type {
  GalleryCategory,
  CreateGalleryCategoryInput,
  UpdateGalleryCategoryInput,
} from "@/types/gallery-category";

const galleryCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

type GalleryCategoryFormData = z.infer<typeof galleryCategorySchema>;

interface GalleryCategoryFormProps {
  category?: GalleryCategory;
  onSubmit: (
    data: CreateGalleryCategoryInput | UpdateGalleryCategoryInput
  ) => Promise<void>;
  isLoading: boolean;
}

export default function GalleryCategoryForm({
  category,
  onSubmit,
  isLoading,
}: GalleryCategoryFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<GalleryCategoryFormData>({
    resolver: zodResolver(galleryCategorySchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
    },
  });

  const handleSubmit = async (data: GalleryCategoryFormData) => {
    try {
      await onSubmit(data);
      toast({
        title: "Success",
        description: `Gallery category ${
          category ? "updated" : "created"
        } successfully`,
      });
      if (!category) {
        router.push("/admin/content/galleries/categories");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: `Failed to ${
          category ? "update" : "create"
        } gallery category`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter category name"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter category description (optional)"
                    {...field}
                    disabled={isLoading}
                    rows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : category ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
