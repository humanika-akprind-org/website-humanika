"use client";

import TaskForm from "@/components/admin/task/Form";
import LoadingForm from "@/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/components/admin/ui/PageHeader";
import Alert from "@/components/admin/ui/alert/Alert";
import { useCreateTask } from "@/hooks/task/useCreateTask";

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
