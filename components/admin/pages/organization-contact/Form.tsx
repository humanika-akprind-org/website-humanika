"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FiSave, FiX } from "react-icons/fi";
import Button from "@/components/admin/ui/button/Button";
import TextInput from "@/components/admin/ui/input/TextInput";
import TextAreaInput from "@/components/admin/ui/input/TextAreaInput";
import SelectInput from "@/components/admin/ui/input/SelectInput";
import MissionArrayInput from "@/components/admin/ui/input/MissionArrayInput";

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
  const {
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
  const watchMission = watch("mission");

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
          <TextAreaInput
            label="Vision"
            name="vision"
            value={watch("vision") || ""}
            onChange={(e) => setValue("vision", e.target.value)}
            placeholder="Enter organization vision"
            required
            error={errors.vision?.message}
            rows={4}
            height="150px"
          />
        </div>
      </div>

      {/* Mission Array */}
      <MissionArrayInput
        label="Mission"
        name="mission"
        value={watchMission || []}
        onChange={(value) => setValue("mission", value)}
        error={
          errors.mission && typeof errors.mission.message === "string"
            ? errors.mission.message
            : errors.mission && Array.isArray(errors.mission)
            ? errors.mission
            : undefined
        }
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <TextInput
            label="Email"
            type="email"
            name="email"
            value={watch("email") || ""}
            onChange={(e) => setValue("email", e.target.value)}
            error={errors.email?.message}
            placeholder="Enter email address"
            required
          />
        </div>

        <div>
          <TextInput
            label="Phone (Optional)"
            name="phone"
            value={watch("phone") || ""}
            onChange={(e) => setValue("phone", e.target.value)}
            error={errors.phone?.message}
            placeholder="Enter phone number"
          />
        </div>

        <div className="md:col-span-2">
          <TextAreaInput
            label="Address"
            name="address"
            value={watch("address") || ""}
            onChange={(e) => setValue("address", e.target.value)}
            placeholder="Enter organization address"
            required
            error={errors.address?.message}
            rows={3}
            height="100px"
          />
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
