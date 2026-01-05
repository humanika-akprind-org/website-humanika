"use client";

import { useParams } from "next/navigation";
import WorkProgramForm from "@/components/admin/pages/work/Form";
import LoadingForm from "@/components/admin/layout/loading/LoadingForm";
import Alert from "@/components/admin/ui/alert/Alert";
import PageHeader from "@/components/admin/ui/PageHeader";
import { useEditWorkProgram } from "@/hooks/work-program/useEditWorkProgram";

export default function EditWorkProgramPage() {
  const params = useParams();
  const workProgramId = params.id as string;

  const {
    workProgram,
    loading,
    alert,
    handleSubmit,
    handleSubmitForApproval,
    handleBack,
  } = useEditWorkProgram(workProgramId);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Edit Work Program" onBack={handleBack} />

      {alert && <Alert type={alert.type} message={alert.message} />}

      {loading ? (
        <LoadingForm />
      ) : workProgram ? (
        <WorkProgramForm
          workProgram={workProgram}
          onSubmit={handleSubmit}
          onSubmitForApproval={handleSubmitForApproval}
          isEditing={true}
        />
      ) : null}
    </div>
  );
}
