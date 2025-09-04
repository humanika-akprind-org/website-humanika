"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  FiArrowLeft,
  FiUpload,
  FiX,
  FiUser,
  FiCalendar,
  FiAward,
  FiUsers,
  FiTrash2,
} from "react-icons/fi";
import { managementAPI } from "@/lib/api/management";
import { UserApi } from "@/lib/api/user";
import { getPeriods } from "@/lib/api/period";
import type { Management, UpdateManagementData } from "@/types/management";
import { Department, Position } from "@/types/enums";
import type { User } from "@/types/user";
import type { Period } from "@/types/period";

export default function EditManagementPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [management, setManagement] = useState<Management | null>(null);
  const [formData, setFormData] = useState<UpdateManagementData>({
    id,
    userId: "",
    periodId: "",
    position: Position.STAFF_DEPARTEMEN,
    department: Department.INFOKOM,
    photoFile: undefined,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch management data, users, and periods
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);
        const [managementResponse, usersResponse, periods] =
          await Promise.all([
            managementAPI.getManagementById(id),
            UserApi.getUsers({ role: "BPH"}),
            getPeriods(),
          ]);

        if (managementResponse.error) {
          setError(managementResponse.error);
          return;
        }

        if (usersResponse.error) {
          setError(usersResponse.error);
          return;
        }

        if (managementResponse.data) {
          setManagement(managementResponse.data);
          setFormData({
            id,
            userId: managementResponse.data.userId,
            periodId: managementResponse.data.periodId,
            position: managementResponse.data.position,
            department: managementResponse.data.department,
            photoFile: undefined,
          });
          if (managementResponse.data.photo) {
            setPhotoPreview(managementResponse.data.photo);
          }
        }

        if (usersResponse.data) setUsers(usersResponse.data.users);
        setPeriods(periods);
      } catch (err) {
        setError("Failed to load data");
        console.error("Error fetching data:", err);
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle photo upload
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith("image/")) {
        setError("File harus berupa gambar");
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Ukuran file maksimal 5MB");
        return;
      }

      setFormData((prev) => ({ ...prev, photoFile: file }));

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove photo
  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, photoFile: null }));
    setPhotoPreview(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await managementAPI.updateManagement(id, formData);

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data) {
        router.push("/admin/governance/managements");
      }
    } catch (err) {
      setError("Failed to update management");
      console.error("Error updating management:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      const response = await managementAPI.deleteManagement(id);

      if (response.error) {
        setError(response.error);
        return;
      }

      router.push("/admin/governance/managements");
    } catch (err) {
      setError("Failed to delete management");
      console.error("Error deleting management:", err);
    }
  };

  if (isFetching) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!management) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button
            className="p-2 rounded-lg hover:bg-gray-100 mr-3 transition-colors"
            onClick={() => router.back()}
          >
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Management Tidak Ditemukan
          </h1>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center">
          <p className="text-gray-600">
            Management yang Anda cari tidak ditemukan.
          </p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => router.push("/admin/governance/managements")}
          >
            Kembali ke Daftar Management
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            className="p-2 rounded-lg hover:bg-gray-100 mr-3 transition-colors"
            onClick={() => router.back()}
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Edit Management
            </h1>
            <p className="text-gray-600 mt-1">
              Edit data anggota dalam struktur management
            </p>
          </div>
        </div>
        <button
          className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors flex items-center"
          onClick={() => setShowDeleteModal(true)}
        >
          <FiTrash2 className="mr-2" />
          Hapus
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-start">
          <FiX className="mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium">Error</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <FiUser className="mr-2 text-gray-500" />
                Anggota
              </div>
            </label>
            <select
              name="userId"
              value={formData.userId}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Pilih Anggota</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.email}
                </option>
              ))}
            </select>
          </div>

          {/* Period Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <FiCalendar className="mr-2 text-gray-500" />
                Periode
              </div>
            </label>
            <select
              name="periodId"
              value={formData.periodId}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Pilih Periode</option>
              {periods.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.name} ({new Date(period.startYear).getFullYear()})
                </option>
              ))}
            </select>
          </div>

          {/* Department Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <FiUsers className="mr-2 text-gray-500" />
                Departemen
              </div>
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {managementAPI.departmentOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Position Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <FiAward className="mr-2 text-gray-500" />
                Posisi
              </div>
            </label>
            <select
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {managementAPI.positionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Photo Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto Profil
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                {photoPreview ? (
                  <div className="relative">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="h-20 w-20 rounded-lg object-cover border border-gray-200"
                    />
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      onClick={handleRemovePhoto}
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="h-20 w-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                    <FiUpload className="text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  id="photo"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <label
                  htmlFor="photo"
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors inline-block"
                >
                  {photoPreview ? "Ganti Foto" : "Pilih Foto"}
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Format: JPG, PNG. Maksimal: 5MB
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-100">
          <button
            type="button"
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => router.back()}
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Menyimpan...
              </>
            ) : (
              "Simpan Perubahan"
            )}
          </button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Konfirmasi Hapus
            </h3>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus {management.user.name} dari
              struktur management? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => setShowDeleteModal(false)}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={handleDelete}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
