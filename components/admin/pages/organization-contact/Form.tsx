"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FiSave, FiX, FiPlus, FiTrash2 } from "react-icons/fi";
import Button from "@/components/admin/ui/button/Button";
import TextInput from "@/components/admin/ui/input/TextInput";
import TextEditor from "@/components/admin/ui/text-area/TextEditor";
import SelectInput from "@/components/admin/ui/input/SelectInput";

const organizationContactSchema = z.object({
  vision: z.string().min(1, "Vision is required"),
  mission: z.array(z.string()).min(1, "At least one mission is required"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  periodId: z.string().min(1, "Period is required"),
});

export type OrganizationContactFormData = z.infer<
  typeof organizationContactSchema
>;

interface OrganizationContactFormProps {
  initialData?: Partial<OrganizationContactFormData> & { periodId?: string };
  onSubmit: (data: OrganizationContactFormData) => void;
  onCancel?: () => void;
  loading?: boolean;
  periods?: { id: string; name: string }[];
}

export default function OrganizationContactForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  periods = [],
}: OrganizationContactFormProps) {
  const [missionInputs, setMissionInputs] = useState<string[]>(
    initialData?.mission
      ? Array.isArray(initialData.mission)
        ? initialData.mission
        : [initialData.mission as string]
      : [""]
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OrganizationContactFormData>({
    resolver: zodResolver(organizationContactSchema),
    defaultValues: {
      vision: initialData?.vision || "",
      mission: initialData?.mission || [""],
      phone: initialData?.phone || "",
      email: initialData?.email || "",
      address: initialData?.address || "",
      periodId: initialData?.periodId || "",
    },
  });

  const watchPeriodId = watch("periodId");

  const addMission = () => {
    const newMissionInputs = [...missionInputs, ""];
    setMissionInputs(newMissionInputs);
    setValue("mission", newMissionInputs);
  };

  const removeMission = (index: number) => {
    if (missionInputs.length > 1) {
      const newMissionInputs = missionInputs.filter((_, i) => i !== index);
      setMissionInputs(newMissionInputs);
      setValue("mission", newMissionInputs);
    }
  };

  const updateMission = (index: number, value: string) => {
    const newMissionInputs = [...missionInputs];
    newMissionInputs[index] = value;
    setMissionInputs(newMissionInputs);
    setValue("mission", newMissionInputs);
  };

  const onFormSubmit = (data: OrganizationContactFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Period Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <SelectInput
            name="periodId"
            label="Period"
            options={periods.map((p) => ({
              value: p.id,
              label: p.name,
            }))}
            placeholder="Select period"
            value={watchPeriodId}
            onChange={(value: string) => {
              setValue("periodId", value);
            }}
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vision <span className="text-red-500">*</span>
          </label>
          <TextEditor
            value={initialData?.vision || ""}
            onChange={(data) => setValue("vision", data)}
            disabled={loading}
            height="150px"
          />
          {errors.vision && (
            <p className="mt-1 text-sm text-red-600">{errors.vision.message}</p>
          )}
        </div>
      </div>

      {/* Mission Array */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Mission <span className="text-red-500">*</span>
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addMission}
            icon={<FiPlus size={14} />}
          >
            Add Mission
          </Button>
        </div>

        {errors.mission && typeof errors.mission.message === "string" && (
          <p className="text-sm text-red-600">{errors.mission.message}</p>
        )}

        {missionInputs.map((mission, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="flex-1">
              <TextInput
                label={`Mission ${index + 1}`}
                name={`mission.${index}`}
                placeholder={`Mission ${index + 1}`}
                value={mission}
                onChange={(e) => updateMission(index, e.target.value)}
                error={
                  errors.mission &&
                  Array.isArray(errors.mission) &&
                  errors.mission[index]?.message
                }
              />
            </div>
            {missionInputs.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeMission(index)}
                className="mt-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                icon={<FiTrash2 size={16} />}
              >
                Remove
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <TextInput
            label="Email"
            type="email"
            {...register("email")}
            value={watch("email") || ""}
            error={errors.email?.message}
            placeholder="Enter email address"
            required
          />
        </div>

        <div>
          <TextInput
            label="Phone (Optional)"
            {...register("phone")}
            value={watch("phone") || ""}
            error={errors.phone?.message}
            placeholder="Enter phone number"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address <span className="text-red-500">*</span>
          </label>
          <TextEditor
            value={initialData?.address || ""}
            onChange={(data) => setValue("address", data)}
            disabled={loading}
            height="100px"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">
              {errors.address.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
            icon={<FiX size={16} />}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          icon={<FiSave size={16} />}
        >
          {loading ? "Saving..." : "Save Organization Contact"}
        </Button>
      </div>
    </form>
  );
}
