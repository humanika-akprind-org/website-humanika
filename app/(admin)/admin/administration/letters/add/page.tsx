"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createLetter } from "@/use-cases/api/letter";
import { getPeriods } from "@/use-cases/api/period";
import { getEvents } from "@/use-cases/api/event";
import type { CreateLetterInput } from "@/types/letter";
import type { Period } from "@/types/period";
import type { Event } from "@/types/event";
import LetterForm from "@/components/admin/letter/Form";

export default function AddLetterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [accessToken, setAccessToken] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch periods
        const periodsData = await getPeriods();
        setPeriods(periodsData);

        // Fetch events
        const eventsData = await getEvents();
        setEvents(eventsData);

        // Get access token from localStorage or wherever it's stored
        const token = localStorage.getItem("accessToken") || "";
        setAccessToken(token);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (data: CreateLetterInput) => {
    setIsLoading(true);
    try {
      await createLetter(data);
      router.push("/admin/administration/letters");
    } catch (error) {
      console.error("Failed to create letter:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Letter</h1>
          <p className="text-gray-600">
            Create a new official letter or correspondence
          </p>
        </div>
      </div>

      {/* Form */}
      <LetterForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        accessToken={accessToken}
        periods={periods}
        events={events}
      />
    </div>
  );
}
