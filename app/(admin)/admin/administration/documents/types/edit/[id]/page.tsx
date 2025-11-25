"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import DocumentTypeForm from "@/components/admin/document/type/Form";
import { useToast } from "@/hooks/use-toast";
import type {
  DocumentType,
  CreateDocumentTypeInput,
  UpdateDocumentTypeInput,
} from "@/types/document-type";

export default function EditDocumentTypePage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documentType, setDocumentType] = useState<DocumentType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const id = params.id as string;

  useEffect(() => {
    const fetchDocumentType = async () => {
      try {
        const response = await fetch(`/api/document/type/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch document type");
        }
        const data = await response.json();
        setDocumentType(data);
      } catch (error) {
        console.error("Error fetching document type:", error);
        toast({
          title: "Error",
          description: "Failed to fetch document type",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchDocumentType();
    }
  }, [id, toast]);

  const handleSubmit = async (
    data: CreateDocumentTypeInput | UpdateDocumentTypeInput
  ) => {
    try {
      setIsSubmitting(true);

      const response = await fetch(`/api/document/type/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update document type");
      }

      toast({
        title: "Success",
        description: "Document type updated successfully",
      });

      router.push("/admin/administration/documents/types");
    } catch (error) {
      console.error("Error updating document type:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update document type",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!documentType) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Document Type Not Found
          </h1>
          <p className="text-gray-600">
            The document type you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/admin/administration/documents/types"
            className="inline-flex items-center px-4 py-2 mt-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Document Types
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/administration/documents/types"
          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Edit Document Type
          </h1>
          <p className="text-gray-600">Update document type information</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <DocumentTypeForm
          initialData={documentType}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
