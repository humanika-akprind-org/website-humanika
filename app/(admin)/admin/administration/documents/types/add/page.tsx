"use client";

import { useState } from "react";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import DocumentTypeForm from "@/components/admin/document/type/Form";
import type {
  CreateDocumentTypeInput,
  UpdateDocumentTypeInput,
} from "@/types/document-type";
import { createDocumentType } from "@/use-cases/api/document-type";
import { useToast } from "@/hooks/use-toast";

export default function AddDocumentTypePage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (
    data: CreateDocumentTypeInput | UpdateDocumentTypeInput
  ) => {
    setIsLoading(true);
    try {
      await createDocumentType(data as CreateDocumentTypeInput);
      toast({
        title: "Success",
        description: "Document type created successfully",
      });
      // Redirect is handled in the form
    } catch (error) {
      console.error("Error creating type:", error);
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
          href="/admin/administration/documents/types"
          className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
        >
          <FiArrowLeft className="mr-1" />
          Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">
          Add New Document Type
        </h1>
      </div>

      {/* Form */}
      <DocumentTypeForm onSubmit={handleSubmit} isSubmitting={isLoading} />
    </div>
  );
}
