import { UserApi } from "@/lib/api/user";
import { PeriodApi } from "@/lib/api/period";
import EventForm from "@/components/admin/event/Form";
import AuthGuard from "@/components/admin/auth/google-oauth/AuthGuard";
import { cookies } from "next/headers";
import type { CreateEventInput, UpdateEventInput, Event } from "@/types/event";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

async function AddEventPage() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("google_access_token")?.value || "";

  try {
    const [usersResponse, periods] = await Promise.all([
      UserApi.getUsers({ limit: 50 }),
      PeriodApi.getPeriods(),
    ]);

    const users = usersResponse.data?.users || [];
    const periodsData = periods || [];

    const handleSubmit = async (data: CreateEventInput | UpdateEventInput) => {
      "use server";

      const user = await getCurrentUser();
      if (!user) {
        throw new Error("Unauthorized");
      }

      // Cast data to CreateEventInput since this is the add page
      const eventData = data as CreateEventInput;

      if (
        !eventData.name ||
        !eventData.department ||
        !eventData.periodId ||
        !eventData.responsibleId ||
        !eventData.startDate ||
        !eventData.endDate
      ) {
        throw new Error("Missing required fields");
      }

      // Generate slug from name
      const slug = eventData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const eventPayload: Omit<Event, 'id' | 'responsible' | 'period' | 'workProgram' | 'status' | 'createdAt' | 'updatedAt'> = {
        name: eventData.name,
        slug,
        thumbnail: eventData.thumbnail,
        description: eventData.description || "",
        goal: eventData.goal || "",
        department: eventData.department,
        periodId: eventData.periodId,
        responsibleId: eventData.responsibleId,
        startDate: new Date(eventData.startDate),
        endDate: new Date(eventData.endDate),
        funds: parseFloat(String(eventData.funds)) || 0,
        usedFunds: 0,
        remainingFunds: parseFloat(String(eventData.funds)) || 0,
      };

      // Only include workProgramId if it's provided and not empty
      if (eventData.workProgramId && eventData.workProgramId.trim() !== "") {
        eventPayload.workProgramId = eventData.workProgramId;
      }

      await prisma.event.create({
        data: eventPayload,
      });

      redirect("/admin/programs/events");
    };

    return (
      <AuthGuard accessToken={accessToken}>
        <div className="p-6 max-w-4xl min-h-screen mx-auto">
          <div className="flex items-center mb-6">
            <Link
              href="/admin/programs/events"
              className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
            >
              <FiArrowLeft className="mr-1" />
              Back
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
              Add New Event
            </h1>
          </div>
          <EventForm
            accessToken={accessToken}
            users={users}
            periods={periodsData}
            onSubmit={handleSubmit}
          />
        </div>
      </AuthGuard>
    );
  } catch (error) {
    console.error("Error loading form data:", error);
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="text-center text-red-500">
              <h2 className="text-xl font-semibold mb-4">Error Loading Form</h2>
              <p>{error instanceof Error ? error.message : "Unknown error"}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddEventPage;
