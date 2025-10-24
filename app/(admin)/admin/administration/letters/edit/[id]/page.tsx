"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getLetter, updateLetter } from "@/use-cases/api/letter";
import { getPeriods } from "@/use-cases/api/period";
import { getEvents } from "@/use-cases/api/event";
import type { Letter, UpdateLetterInput } from "@/types/letter";
import type { Period } from "@/types/period";
import type { Event } from "@/types/event";
import LetterForm from "@/components/admin/letter/Form";

export default function EditLetterPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [letter, setLetter] = useState<Letter | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [accessToken, setAccessToken] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);

        // Fetch letter data
        const letterData = await getLetter(id);
        setLetter(letterData);

        // Fetch periods
        const periodsData = await getPeriods();
        setPeriods(periodsData);

        // Fetch events
        const eventsData = await getEvents();
        setEvents(eventsData);

        // Get access token
        const token = localStorage.getItem("accessToken") || "";
        setAccessToken(token);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        router.push("/admin/administration/letters");
      } finally {
        setIsLoadingData(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, router]);

  const handleSubmit = async (data: UpdateLetterInput) => {
    setIsLoading(true);
    try {
      await updateLetter(id, data);
      router.push("/admin/administration/letters");
    } catch (error) {
      console.error("Failed to update letter:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <span className="ml-2 text-gray-600">Loading letter...</span>
      </div>
    );
  }

  if (!letter) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">
            Letter not found
          </h3>
          <p className="text-gray-600">
            The letter you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Letter</h1>
          <p className="text-gray-600">Update letter information and details</p>
        </div>
      </div>

      {/* Form */}
      <LetterForm
        letter={letter}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        accessToken={accessToken}
        periods={periods}
        events={events}
      />
    </div>
  );
}
