"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Letter, CreateLetterInput } from "@/types/letter";
import { LetterType, LetterPriority } from "@/types/enums";
import type { Period } from "@/types/period";
import type { Event } from "@/types/event";

interface LetterFormProps {
  letter?: Letter;
  onSubmit: (data: CreateLetterInput) => Promise<void>;
  isLoading?: boolean;
  accessToken?: string;
  periods?: Period[];
  events?: Event[];
}

export default function LetterForm({
  letter,
  onSubmit,
  isLoading = false,
  accessToken,
  periods = [],
  events = [],
}: LetterFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    regarding: "",
    number: "",
    date: "",
    type: LetterType.INCOMING,
    priority: LetterPriority.NORMAL,
    origin: "",
    destination: "",
    body: "",
    letter: "",
    notes: "",
    periodId: "",
    eventId: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (letter) {
      setFormData({
        regarding: letter.regarding || "",
        number: letter.number || "",
        date: letter.date
          ? new Date(letter.date).toISOString().split("T")[0]
          : "",
        type: letter.type || LetterType.INCOMING,
        priority: letter.priority || LetterPriority.NORMAL,
        origin: letter.origin || "",
        destination: letter.destination || "",
        body: letter.body || "",
        letter: letter.letter || "",
        notes: letter.notes || "",
        periodId: letter.periodId || "",
        eventId: letter.eventId || "",
      });
    }
  }, [letter]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.regarding.trim()) {
      newErrors.regarding = "Regarding is required";
    }
    if (!formData.number.trim()) {
      newErrors.number = "Letter number is required";
    }
    if (!formData.date) {
      newErrors.date = "Date is required";
    }
    if (!formData.origin.trim()) {
      newErrors.origin = "Origin is required";
    }
    if (!formData.destination.trim()) {
      newErrors.destination = "Destination is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const submitData = {
        ...formData,
        date: new Date(formData.date).toISOString(),
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Regarding *
            </label>
            <input
              type="text"
              value={formData.regarding}
              onChange={(e) => handleInputChange("regarding", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.regarding ? "border-red-500" : "border-gray-200"
              }`}
              placeholder="Enter letter regarding"
              disabled={isLoading}
            />
            {errors.regarding && (
              <p className="text-sm text-red-600 mt-1">{errors.regarding}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Letter Number *
            </label>
            <input
              type="text"
              value={formData.number}
              onChange={(e) => handleInputChange("number", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.number ? "border-red-500" : "border-gray-200"
              }`}
              placeholder="Enter letter number"
              disabled={isLoading}
            />
            {errors.number && (
              <p className="text-sm text-red-600 mt-1">{errors.number}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.date ? "border-red-500" : "border-gray-200"
              }`}
              disabled={isLoading}
            />
            {errors.date && (
              <p className="text-sm text-red-600 mt-1">{errors.date}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange("type", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              {Object.values(LetterType).map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => handleInputChange("priority", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              {Object.values(LetterPriority).map((priority) => (
                <option key={priority} value={priority}>
                  {priority.charAt(0).toUpperCase() +
                    priority.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Origin and Destination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Origin *
            </label>
            <input
              type="text"
              value={formData.origin}
              onChange={(e) => handleInputChange("origin", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.origin ? "border-red-500" : "border-gray-200"
              }`}
              placeholder="Enter origin"
              disabled={isLoading}
            />
            {errors.origin && (
              <p className="text-sm text-red-600 mt-1">{errors.origin}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination *
            </label>
            <input
              type="text"
              value={formData.destination}
              onChange={(e) => handleInputChange("destination", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.destination ? "border-red-500" : "border-gray-200"
              }`}
              placeholder="Enter destination"
              disabled={isLoading}
            />
            {errors.destination && (
              <p className="text-sm text-red-600 mt-1">{errors.destination}</p>
            )}
          </div>
        </div>

        {/* Period and Event */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Period
            </label>
            <select
              value={formData.periodId}
              onChange={(e) => handleInputChange("periodId", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              <option value="">Select Period</option>
              {periods.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Related Event
            </label>
            <select
              value={formData.eventId}
              onChange={(e) => handleInputChange("eventId", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              <option value="">Select Event</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Body */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Body
          </label>
          <textarea
            value={formData.body}
            onChange={(e) => handleInputChange("body", e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter letter body"
            disabled={isLoading}
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter notes"
            disabled={isLoading}
          />
        </div>

        {/* Letter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Letter
          </label>
          <textarea
            value={formData.letter}
            onChange={(e) => handleInputChange("letter", e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter letter content"
            disabled={isLoading}
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Saving...
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
