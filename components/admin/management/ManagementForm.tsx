"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type {
  Management,
  CreateManagementData,
  UpdateManagementData,
} from "@/types/management";
import { UserApi } from "@/lib/api/user";
import { managementAPI } from "@/lib/api/management";
// import Image from "next/image";

interface ManagementFormProps {
  management?: Management;
  periods: any[];
  onSubmit: (
    data: CreateManagementData | UpdateManagementData
  ) => Promise<void>;
  isSubmitting: boolean;
}

const ManagementForm: React.FC<ManagementFormProps> = ({
  management,
  periods,
  onSubmit,
  isSubmitting,
}) => {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    userId: management?.userId || "",
    periodId: management?.periodId || "",
    position: management?.position || "",
    department: management?.department || "",
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    management?.photo || null
  );
  const [removePhoto, setRemovePhoto] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await UserApi.getUsers({ limit: 50 });
        if (response.data) {
          setUsers(response.data.users || []);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPhoto(file);
    setRemovePhoto(false);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    setRemovePhoto(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitData: any = {
      ...formData,
      photo: photo || (removePhoto ? null : undefined),
    };

    if (management) {
      submitData.id = management.id;
    }

    await onSubmit(submitData);
  };

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            User
          </label>
          <select
            name="userId"
            value={formData.userId}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        {/* Period Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Period
          </label>
          <select
            name="periodId"
            value={formData.periodId}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Period</option>
            {periods.map((period) => (
              <option key={period.id} value={period.id}>
                {period.name}
              </option>
            ))}
          </select>
        </div>

        {/* Position Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Position
          </label>
          <select
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Position</option>
            {managementAPI.positionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Department Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department
          </label>
          <select
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Department</option>
            {managementAPI.departmentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Photo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Photo
        </label>
        <div className="flex items-center space-x-4">
          {photoPreview && (
            <div className="relative">
              <img
                src={photoPreview}
                alt="Preview"
                className="w-20 h-20 rounded-full object-cover"
              />
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                ×
              </button>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="flex-1 p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Upload a photo for this management position
        </p>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : management ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};

export default ManagementForm;
