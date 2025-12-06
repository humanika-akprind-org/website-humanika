"use client";

import { useParams } from "next/navigation";
import TaskForm from "@/components/admin/task/Form";
import LoadingForm from "@/components/admin/layout/loading/LoadingForm";
import Alert from "@/components/admin/ui/alert/Alert";
import PageHeader from "@/components/admin/ui/PageHeader";
import { useEditTask } from "@/hooks/task/useEditTask";

export default function EditTaskPage() {
  const params = useParams();
  const taskId = params.id as string;

  const { task, users, loading, error, alert, handleSubmit, handleBack } =
    useEditTask(taskId);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Edit Task" onBack={handleBack} />

      {alert && <Alert type={alert.type} message={alert.message} />}

      {loading ? (
        <LoadingForm />
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
        </div>
      ) : task ? (
        <TaskForm task={task} onSubmit={handleSubmit} users={users} />
      ) : null}
    </div>
  );
}
