"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Management, ManagementServerData } from "@/types/management";
import { Department, Position } from "@/types/enums";
import { formatEnumValue } from "@/lib/utils";
import { useManagementForm } from "@/hooks/management/useManagementForm";
import { FiUser, FiCalendar, FiHome, FiBriefcase } from "react-icons/fi";
import SelectInput from "@/components/admin/ui/input/SelectInput";
import SubmitButton from "@/components/admin/ui/button/SubmitButton";
import PhotoUpload from "@/components/admin/ui/input/PhotoUpload";
import CancelButton from "@/components/ui/CancelButton";

// Mapping department to valid positions
const DEPARTMENT_POSITIONS: Record<Department, Position[]> = {
  [Department.BPH]: [
    Position.KETUA_UMUM,
    Position.WAKIL_KETUA_UMUM,
    Position.SEKRETARIS,
    Position.BENDAHARA,
  ],
  [Department.PSDM]: [Position.KEPALA_DEPARTEMEN, Position.STAFF_DEPARTEMEN],
  [Department.LITBANG]: [Position.KEPALA_DEPARTEMEN, Position.STAFF_DEPARTEMEN],
  [Department.KWU]: [Position.KEPALA_DEPARTEMEN, Position.STAFF_DEPARTEMEN],
  [Department.INFOKOM]: [Position.KEPALA_DEPARTEMEN, Position.STAFF_DEPARTEMEN],
};

interface ManagementFormProps {
  management?: Management;
  onSubmit: (data: ManagementServerData) => Promise<void>;
  isEdit?: boolean;
}

const ManagementForm: React.FC<ManagementFormProps> = ({
  management,
  onSubmit,
  isEdit = false,
}) => {
  const router = useRouter();

  const {
    formData,
    setFormData,
    users,
    periods,
    isLoading,
    previewUrl,
    existingPhoto,
    photoLoading,
    removePhoto,
    handleSubmit,
    handleFileChange,
    loadMoreUsers,
    searchUsers,
    isLoadingUsers,
    hasMoreUsers,
  } = useManagementForm(management, onSubmit);

  const [filteredPositions, setFilteredPositions] = useState<Position[]>(
    Object.values(Position),
  );

  // Update filtered positions when department changes
  useEffect(() => {
    if (formData.department && DEPARTMENT_POSITIONS[formData.department]) {
      setFilteredPositions(DEPARTMENT_POSITIONS[formData.department]);
      // Reset position when department changes
      setFormData((prev) => ({ ...prev, position: "" as Position }));
    }
  }, [formData.department, setFormData]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectInput
            label="User"
            name="userId"
            value={formData.userId}
            onChange={(value: string) =>
              setFormData((prev) => ({ ...prev, userId: value }))
            }
            options={users.map((user) => ({
              value: user.id,
              label: `${user.name} (${user.email})`,
            }))}
            placeholder="Select User"
            required
            icon={<FiUser className="text-gray-400" />}
            onSearch={searchUsers}
            onLoadMore={loadMoreUsers}
            isLoadingMore={isLoadingUsers}
            hasMore={hasMoreUsers}
          />

          <SelectInput
            label="Period"
            name="periodId"
            value={formData.periodId}
            onChange={(value: string) =>
              setFormData((prev) => ({ ...prev, periodId: value }))
            }
            options={periods.map((period) => ({
              value: period.id,
              label: period.name,
            }))}
            placeholder="Select Period"
            required
            icon={<FiCalendar className="text-gray-400" />}
          />

          <SelectInput
            label="Department"
            name="department"
            value={formData.department}
            onChange={(value: string) =>
              setFormData((prev) => ({
                ...prev,
                department: value as Department,
              }))
            }
            options={Object.values(Department).map((dept) => ({
              value: dept,
              label: dept,
            }))}
            placeholder="Select Department"
            required
            icon={<FiHome className="text-gray-400" />}
          />

          <SelectInput
            label="Position"
            name="position"
            value={formData.position}
            onChange={(value: string) =>
              setFormData((prev) => ({ ...prev, position: value as Position }))
            }
            options={filteredPositions.map((pos) => ({
              value: pos,
              label: formatEnumValue(pos),
            }))}
            required
            icon={<FiBriefcase className="text-gray-400" />}
          />
        </div>

        <PhotoUpload
          label="Photo"
          previewUrl={previewUrl}
          existingPhoto={existingPhoto}
          onFileChange={handleFileChange}
          onRemovePhoto={removePhoto}
          isLoading={isLoading}
          photoLoading={photoLoading}
          alt={management?.user?.name || "Management"}
        />

        <div className="flex justify-end space-x-3 pt-4">
          <CancelButton onClick={() => router.back()} disabled={isLoading} />

          <SubmitButton
            isSubmitting={isLoading}
            text={isEdit ? "Update Management" : "Add Management"}
            loadingText="Saving..."
          />
        </div>
      </form>
    </div>
  );
};

export default ManagementForm;
