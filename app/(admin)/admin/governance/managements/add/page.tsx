"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { CreateManagementData, UpdateManagementData } from "@/types/management";
import { managementAPI } from "@/lib/api/management";
import ManagementForm from "@/components/admin/management/ManagementForm";

export default function AddManagementPage() {
  const router = useRouter();
  const [periods, setPeriods] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPeriods();
  }, []);

  const fetchPeriods = async () => {
    try {
      const response = await fetch("/api/period");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPeriods(data.data || []);
        }
      }
    } catch (error) {
      console.error("Error fetching periods:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: CreateManagementData | UpdateManagementData) => {
    setIsSubmitting(true);
    try {
      const response = await managementAPI.createManagement(data as CreateManagementData);
      if (response.error) {
        alert(response.error);
      } else {
        router.push("/admin/governance/managements");
      }
    } catch (error) {
      alert("Failed to create management");
      console.error("Error creating management:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"/>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add Management</h1>
        <p className="text-gray-600 mt-2">Create a new management position</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <ManagementForm
          periods={periods}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
