"use client";

import { useParams } from "next/navigation";
import StructureForm from "@/components/admin/structure/Form";
import LoadingForm from "@/components/admin/layout/loading/LoadingForm";
import Alert from "@/components/admin/ui/alert/Alert";
import PageHeader from "@/components/admin/ui/PageHeader";
import { useEditStructure } from "@/hooks/structure/useEditStructure";

export default function EditStructurePage() {
  const params = useParams();
  const structureId = params.id as string;

  const { structure, loading, error, alert, handleSubmit, handleBack } =
    useEditStructure(structureId);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Edit Structure" onBack={handleBack} />

      {alert && <Alert type={alert.type} message={alert.message} />}

      {loading ? (
        <LoadingForm />
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
        </div>
      ) : structure ? (
        <StructureForm structure={structure} onSubmit={handleSubmit} />
      ) : null}
    </div>
  );
}
