"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import type { Management, UpdateManagementData, CreateManagementData } from "@/types/management";
import { managementAPI } from "@/lib/api/management";
import ManagementForm from "@/components/admin/management/ManagementForm";

export default function EditManagementPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [management, setManagement] = useState<Management | null>(null);
  const [periods, setPeriods] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [managementResponse, periodsResponse] = await Promise.all([
        managementAPI.getManagementById(id),
        fetch("/api/periods").then((res) => res.json()),
      ]);

      if (managementResponse.error) {
        setError(managementResponse.error);
      } else if (managementResponse.data) {
        setManagement(managementResponse.data);
      }

      setPeriods(periodsResponse.periods || []);
    } catch (error) {
      setError("Failed to fetch data");
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: UpdateManagementData | CreateManagementData) => {
    setIsSubmitting(true);
    try {
      const response = await managementAPI.updateManagement(id, data as UpdateManagementData);
      if (response.error) {
        alert(response.error);
      } else {
        router.push("/admin/governance/managements");
      }
    } catch (error) {
      alert("Failed to update management");
      console.error("Error updating management:", error);
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

  if (error || !management) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || "Management not found"}
        </div>
        <button
          onClick={() => router.back()}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Management</h1>
        <p className="text-gray-600 mt-2">Update management position details</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <ManagementForm
          management={management}
          periods={periods}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
