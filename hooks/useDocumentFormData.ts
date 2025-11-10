import { UserApi } from "@/use-cases/api/user";
import prisma from "@/lib/prisma";
import type { User } from "@/types/user";
import type { Event } from "@/types/event";
import type { Letter } from "@/types/letter";

export interface FormDataResult {
  users: User[];
  events: Pick<Event, "id" | "name">[];
  letters: Pick<Letter, "id" | "number" | "regarding">[];
}

export async function fetchDocumentFormData(): Promise<FormDataResult> {
  // Fetch users first (this is used to assign ownership).
  const usersResponse = await UserApi.getUsers({ limit: 50 });
  const users = usersResponse.data?.users || [];

  // Fetch events and letters directly from the database; use allSettled
  // so that a failure in one doesn't block rendering the form.
  const [eventsSettled, lettersSettled] = await Promise.allSettled([
    prisma.event.findMany({ orderBy: { name: "asc" } }),
    prisma.letter.findMany({ orderBy: { date: "desc" } }),
  ]);

  const events =
    eventsSettled.status === "fulfilled" ? eventsSettled.value : [];
  if (eventsSettled.status === "rejected") {
    console.error("Failed to load events from DB:", eventsSettled.reason);
  }

  const letters =
    lettersSettled.status === "fulfilled" ? lettersSettled.value : [];
  if (lettersSettled.status === "rejected") {
    console.error("Failed to load letters from DB:", lettersSettled.reason);
  }

  return {
    users,
    events: events.map((ev) => ({
      id: ev.id,
      name: ev.name,
    })),
    letters: letters.map((l) => ({
      id: l.id,
      number: l.number,
      regarding: l.regarding,
    })),
  };
}
