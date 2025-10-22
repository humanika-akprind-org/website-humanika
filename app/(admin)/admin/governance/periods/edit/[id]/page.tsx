import { notFound } from "next/navigation";
import { getPeriod } from "@/use-cases/api/period";
import PeriodForm from "@/components/admin/period/Form";

interface EditPeriodPageProps {
  params: {
    id: string;
  };
}

export default async function EditPeriodPage({ params }: EditPeriodPageProps) {
  try {
    const period = await getPeriod(params.id);

    return (
      <div className="p-6">
        <PeriodForm period={period} isEdit={true} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching period:", error);
    notFound();
  }
}
