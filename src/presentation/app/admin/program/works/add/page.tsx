// app/(admin)/admin/people/users/add/page.tsx
"use client";

import WorkProgramForm from "@/src/presentation/components/admin/pages/work/Form";
import LoadingForm from "@/src/presentation/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/src/presentation/components/admin/ui/PageHeader";
import Alert from "@/src/presentation/components/admin/ui/alert/Alert";
import { useCreateWorkProgram } from "@/src/presentation/hooks/work-program/useCreateWorkProgram";

export default function AddUserPage() {
  const {
    createWorkProgramSubmit,
    createWorkProgramForApproval,
    handleBack,
    isSubmitting,
    error,
  } = useCreateWorkProgram();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Add New Work Program" onBack={handleBack} />

      {error && <Alert type="error" message={error} />}

      {isSubmitting ? (
        <LoadingForm />
      ) : (
        <WorkProgramForm
          onSubmit={createWorkProgramSubmit}
          onSubmitForApproval={createWorkProgramForApproval}
          isEditing={false}
        />
      )}
    </div>
  );
}
