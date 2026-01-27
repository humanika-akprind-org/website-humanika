"use client";

import StructureForm from "@/src/presentation/components/admin/pages/structure/Form";
import LoadingForm from "@/src/presentation/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/src/presentation/components/admin/ui/PageHeader";
import Alert from "@/src/presentation/components/admin/ui/alert/Alert";
import { useCreateStructure } from "@/src/presentation/hooks/structure/useCreateStructure";

export default function AddStructurePage() {
  const { createStructure, handleBack, isSubmitting, error } =
    useCreateStructure();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Add New Structure" onBack={handleBack} />

      {error && <Alert type="error" message={error} />}

      {isSubmitting ? (
        <LoadingForm />
      ) : (
        <StructureForm onSubmit={createStructure} />
      )}
    </div>
  );
}
