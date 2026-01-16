"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FiSave } from "react-icons/fi";
import SubmitButton from "@/components/admin/ui/button/SubmitButton";
import CancelButton from "@/components/ui/CancelButton";
import TextInput from "@/components/admin/ui/input/TextInput";
import SelectInput from "@/components/admin/ui/input/SelectInput";

const statisticSchema = z.object({
  activeMembers: z.number().min(0, "Active members must be at least 0"),
  annualEvents: z.number().min(0, "Annual events must be at least 0"),
  collaborativeProjects: z
    .number()
    .min(0, "Collaborative projects must be at least 0"),
  innovationProjects: z
    .number()
    .min(0, "Innovation projects must be at least 0"),
  awards: z.number().min(0, "Awards must be at least 0"),
  memberSatisfaction: z
    .number()
    .min(0)
    .max(100, "Member satisfaction must be between 0 and 100"),
  learningMaterials: z.number().min(0, "Learning materials must be at least 0"),
  periodId: z.string().min(1, "Period is required"),
});

export type StatisticFormData = z.infer<typeof statisticSchema>;

interface StatisticFormProps {
  initialData?: Partial<StatisticFormData> & { periodId?: string };
  onSubmit: (data: StatisticFormData) => void;
  onCancel?: () => void;
  loading?: boolean;
  periods?: { id: string; name: string }[];
}

export default function StatisticForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  periods = [],
}: StatisticFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<StatisticFormData>({
    resolver: zodResolver(statisticSchema),
    defaultValues: {
      activeMembers: initialData?.activeMembers || 0,
      annualEvents: initialData?.annualEvents || 0,
      collaborativeProjects: initialData?.collaborativeProjects || 0,
      innovationProjects: initialData?.innovationProjects || 0,
      awards: initialData?.awards || 0,
      memberSatisfaction: initialData?.memberSatisfaction || 0,
      learningMaterials: initialData?.learningMaterials || 0,
      periodId: initialData?.periodId || "",
    },
  });

  const onFormSubmit = (data: StatisticFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Period Selection */}
      <div className="mb-6">
        <Controller
          name="periodId"
          control={control}
          render={({ field }) => (
            <SelectInput
              name={field.name}
              label="Period"
              options={periods.map((p) => ({
                value: p.id,
                label: p.name,
              }))}
              placeholder="Select period"
              value={field.value || ""}
              onChange={field.onChange}
              required
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Controller
            name="activeMembers"
            control={control}
            render={({ field }) => (
              <TextInput
                label="Active Members"
                type="number"
                name={field.name}
                value={String(field.value ?? 0)}
                onChange={(e) => {
                  const val = e.target.value;
                  field.onChange(val === "" ? 0 : Number(val));
                }}
                error={errors.activeMembers?.message}
                placeholder="Enter number of active members"
              />
            )}
          />
        </div>

        <div>
          <Controller
            name="annualEvents"
            control={control}
            render={({ field }) => (
              <TextInput
                label="Annual Events"
                type="number"
                name={field.name}
                value={String(field.value ?? 0)}
                onChange={(e) => {
                  const val = e.target.value;
                  field.onChange(val === "" ? 0 : Number(val));
                }}
                error={errors.annualEvents?.message}
                placeholder="Enter number of annual events"
              />
            )}
          />
        </div>

        <div>
          <Controller
            name="collaborativeProjects"
            control={control}
            render={({ field }) => (
              <TextInput
                label="Collaborative Projects"
                type="number"
                name={field.name}
                value={String(field.value ?? 0)}
                onChange={(e) => {
                  const val = e.target.value;
                  field.onChange(val === "" ? 0 : Number(val));
                }}
                error={errors.collaborativeProjects?.message}
                placeholder="Enter number of collaborative projects"
              />
            )}
          />
        </div>

        <div>
          <Controller
            name="innovationProjects"
            control={control}
            render={({ field }) => (
              <TextInput
                label="Innovation Projects"
                type="number"
                name={field.name}
                value={String(field.value ?? 0)}
                onChange={(e) => {
                  const val = e.target.value;
                  field.onChange(val === "" ? 0 : Number(val));
                }}
                error={errors.innovationProjects?.message}
                placeholder="Enter number of innovation projects"
              />
            )}
          />
        </div>

        <div>
          <Controller
            name="awards"
            control={control}
            render={({ field }) => (
              <TextInput
                label="Awards"
                type="number"
                name={field.name}
                value={String(field.value ?? 0)}
                onChange={(e) => {
                  const val = e.target.value;
                  field.onChange(val === "" ? 0 : Number(val));
                }}
                error={errors.awards?.message}
                placeholder="Enter number of awards"
              />
            )}
          />
        </div>

        <div>
          <Controller
            name="memberSatisfaction"
            control={control}
            render={({ field }) => (
              <TextInput
                label="Member Satisfaction (%)"
                type="number"
                name={field.name}
                value={String(field.value ?? 0)}
                onChange={(e) => {
                  const val = e.target.value;
                  field.onChange(val === "" ? 0 : Number(val));
                }}
                error={errors.memberSatisfaction?.message}
                placeholder="Enter member satisfaction percentage (0-100)"
              />
            )}
          />
        </div>

        <div>
          <Controller
            name="learningMaterials"
            control={control}
            render={({ field }) => (
              <TextInput
                label="Learning Materials"
                type="number"
                name={field.name}
                value={String(field.value ?? 0)}
                onChange={(e) => {
                  const val = e.target.value;
                  field.onChange(val === "" ? 0 : Number(val));
                }}
                error={errors.learningMaterials?.message}
                placeholder="Enter number of learning materials"
              />
            )}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        {onCancel && <CancelButton onClick={onCancel} disabled={loading} />}
        <SubmitButton
          isSubmitting={loading}
          text="Save Statistic"
          loadingText="Saving..."
          icon={<FiSave className="mr-2" />}
        />
      </div>
    </form>
  );
}
