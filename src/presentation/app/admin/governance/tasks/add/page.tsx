"use client";

import TaskForm from "@/src/presentation/components/admin/pages/task/Form";
import LoadingForm from "@/src/presentation/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/src/presentation/components/admin/ui/PageHeader";
import Alert from "@/src/presentation/components/admin/ui/alert/Alert";
import { useCreateTask } from "@/src/presentation/hooks/task/useCreateTask";

export default function AddTaskPage() {
  const { createTask, handleBack, isSubmitting, error, isLoading } =
    useCreateTask();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Add New Task" onBack={handleBack} />

      {error && <Alert type="error" message={error} />}

      {isSubmitting || isLoading ? (
        <LoadingForm />
      ) : (
        <TaskForm onSubmit={createTask} />
      )}
    </div>
  );
}
