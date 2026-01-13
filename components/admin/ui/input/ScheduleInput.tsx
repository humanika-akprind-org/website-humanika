"use client";

import React, { useState, useMemo } from "react";
import {
  FiPlus,
  FiTrash2,
  FiEdit3,
  FiClock,
  FiMapPin,
  FiAlertCircle,
} from "react-icons/fi";
import { GripHorizontal, GripVertical } from "lucide-react";
import type { ScheduleItem } from "@/types/event";
import TextInput from "./TextInput";
import DateInput from "@/components/admin/ui/date/DateInput";
import TimeInput from "./TimeInput";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Helper function to format date for input (date expects "YYYY-MM-DD")
const formatDateForInput = (dateString: string): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 10);
  } catch {
    return "";
  }
};

// Helper function to convert input value to ISO 8601 string
const formatDateFromInput = (inputValue: string): string => {
  if (!inputValue) return "";
  return inputValue; // date input already provides valid date format
};

// Validation function to check if start time is before end time
const isTimeValid = (startTime?: string, endTime?: string): boolean => {
  if (!startTime || !endTime) return true; // Allow if one is empty
  return startTime < endTime;
};

// Check if schedules are in chronological order
const areDatesInOrder = (schedules: ScheduleItem[]): boolean => {
  if (schedules.length <= 1) return true;
  for (let i = 0; i < schedules.length - 1; i++) {
    if (schedules[i].date > schedules[i + 1].date) {
      return false;
    }
  }
  return true;
};

// Get indices of schedules that are out of order
const getOutOfOrderIndices = (schedules: ScheduleItem[]): number[] => {
  const outOfOrderIndices: number[] = [];
  for (let i = 0; i < schedules.length - 1; i++) {
    if (schedules[i].date > schedules[i + 1].date) {
      outOfOrderIndices.push(i, i + 1);
    }
  }
  return Array.from(new Set(outOfOrderIndices)); // Remove duplicates
};

// Sortable Schedule Item Component
interface SortableScheduleItemProps {
  schedule: ScheduleItem;
  index: number;
  isEditing: boolean;
  disabled: boolean;
  editingIndex: number | null;
  editForm: ScheduleItem;
  timeError: string;
  dateError: string;
  isOutOfOrder: boolean;
  isDatesValid: boolean;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  onEditFormChange: (updates: Partial<ScheduleItem>) => void;
  onSave: () => void;
  onCancel: () => void;
  formatDate: (dateString: string) => string;
}

function SortableScheduleItem({
  schedule,
  index,
  isEditing,
  disabled,
  editingIndex,
  editForm,
  timeError,
  dateError,
  isOutOfOrder,
  isDatesValid,
  onEdit,
  onDelete,
  onEditFormChange,
  onSave,
  onCancel,
  formatDate,
}: SortableScheduleItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: index });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  if (isEditing) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="border border-blue-200 rounded-lg p-4 bg-blue-50"
      >
        <div className="flex justify-center mb-2">
          <button
            type="button"
            {...attributes}
            {...listeners}
            disabled={disabled || editingIndex !== null || !isDatesValid}
            className="p-1.5 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded cursor-grab active:cursor-grabbing"
            title="Drag to reorder"
          >
            <GripHorizontal className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <DateInput
                label="Date"
                value={editForm.date}
                onChange={(value) => onEditFormChange({ date: value })}
                required
                error={dateError}
              />
            </div>
            <TextInput
              label="Location"
              name="location"
              value={editForm.location}
              onChange={(e) => onEditFormChange({ location: e.target.value })}
              placeholder="e.g., Jakarta Convention Center"
              required
              icon={<FiMapPin className="text-gray-400" />}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <TimeInput
              label="Start Time"
              value={editForm.startTime || ""}
              onChange={(value) => onEditFormChange({ startTime: value })}
              error={timeError}
            />
            <TimeInput
              label="End Time"
              value={editForm.endTime || ""}
              onChange={(value) => onEditFormChange({ endTime: value })}
            />
          </div>
          <TextInput
            label="Notes (optional)"
            name="notes"
            value={editForm.notes || ""}
            onChange={(e) => onEditFormChange({ notes: e.target.value })}
            placeholder="Additional notes for this schedule"
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={!editForm.date || !editForm.location || !isDatesValid}
              className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editingIndex === index ? "Save" : "Add Schedule"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border rounded-lg p-4 bg-gray-50 group ${
        isDragging
          ? "shadow-lg"
          : isOutOfOrder
          ? "border-red-500"
          : "border-gray-200"
      }`}
    >
      <div className="flex items-start">
        <button
          type="button"
          {...attributes}
          {...listeners}
          disabled={disabled || editingIndex !== null}
          className="mt-1 p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded cursor-grab active:cursor-grabbing"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <div className="flex-1 flex items-start justify-between ml-2">
          <div className="flex-1">
            {isOutOfOrder && (
              <div className="flex items-center space-x-1 mb-2 text-red-600">
                <FiAlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Tanggal tidak berurutan
                </span>
              </div>
            )}
            <div className="flex items-center space-x-2 mb-1">
              <FiClock className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-gray-900">
                {formatDate(schedule.date)}
              </span>
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <FiMapPin className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">{schedule.location}</span>
            </div>
            {(schedule.startTime || schedule.endTime) && (
              <div className="flex items-center space-x-2 mb-1">
                <FiClock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {schedule.startTime || "--"} - {schedule.endTime || "--"}
                </span>
              </div>
            )}
            {schedule.notes && (
              <div className="text-sm text-gray-600 mt-1">{schedule.notes}</div>
            )}
          </div>
          <div className="flex items-center space-x-1 ml-4">
            <button
              type="button"
              onClick={() => onEdit(index)}
              disabled={disabled || editingIndex !== null}
              className="p-1 text-gray-400 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              <FiEdit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(index)}
              disabled={disabled || editingIndex !== null}
              className="p-1 text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ScheduleInputProps {
  schedules: ScheduleItem[];
  onChange: (schedules: ScheduleItem[]) => void;
  disabled?: boolean;
}

export default function ScheduleInput({
  schedules,
  onChange,
  disabled = false,
}: ScheduleInputProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<ScheduleItem>({
    date: "",
    location: "",
    startTime: "",
    endTime: "",
    notes: "",
  });
  const [timeError, setTimeError] = useState<string>("");
  const [dateError, setDateError] = useState<string>("");

  // Compute validation states
  const isDatesValid = useMemo(() => areDatesInOrder(schedules), [schedules]);
  const outOfOrderIndices = useMemo(
    () => getOutOfOrderIndices(schedules),
    [schedules]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddSchedule = () => {
    setEditingIndex(schedules.length);
    setEditForm({
      date: "",
      location: "",
      startTime: "",
      endTime: "",
      notes: "",
    });
    setTimeError("");
    setDateError("");
  };

  const handleEditSchedule = (index: number) => {
    setEditingIndex(index);
    setEditForm({
      ...schedules[index],
      date: formatDateForInput(schedules[index].date),
    });
    setTimeError("");
    setDateError("");
  };

  const handleSaveSchedule = () => {
    if (!editForm.date || !editForm.location) return;

    // Validate both time and date
    const hasTimeError = !isTimeValid(editForm.startTime, editForm.endTime);
    const hasDateError = !isDateValid(editForm.date, schedules, editingIndex);

    // Set errors for both if invalid
    if (hasTimeError) {
      setTimeError("Start time must be before end time");
    }
    if (hasDateError) {
      setDateError("Date must be in chronological order");
    }

    // Don't save if either validation fails
    if (hasTimeError || hasDateError) {
      return;
    }

    const newSchedules = [...schedules];
    if (editingIndex !== null) {
      if (editingIndex === schedules.length) {
        // Adding new
        newSchedules.push({
          ...editForm,
          date: formatDateFromInput(editForm.date),
        });
      } else {
        // Editing existing
        newSchedules[editingIndex] = {
          ...editForm,
          date: formatDateFromInput(editForm.date),
        };
      }
    }

    onChange(newSchedules);
    setEditingIndex(null);
    setEditForm({
      date: "",
      location: "",
      startTime: "",
      endTime: "",
      notes: "",
    });
    setTimeError("");
    setDateError("");
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditForm({
      date: "",
      location: "",
      startTime: "",
      endTime: "",
      notes: "",
    });
    setTimeError("");
    setDateError("");
  };

  const handleDeleteSchedule = (index: number) => {
    const newSchedules = schedules.filter((_, i) => i !== index);
    onChange(newSchedules);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = active.id as number;
      const newIndex = over.id as number;

      const newSchedules = [...schedules];
      const [removed] = newSchedules.splice(oldIndex, 1);
      newSchedules.splice(newIndex, 0, removed);

      onChange(newSchedules);
    }
  };

  const handleEditFormChange = (updates: Partial<ScheduleItem>) => {
    // Clear errors when user corrects the input
    if (updates.startTime || updates.endTime) {
      setTimeError("");
    }
    if (updates.date) {
      setDateError("");
    }
    setEditForm((prev) => ({ ...prev, ...updates }));
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Validation function to check if date is in correct order
  const isDateValid = (
    newDate: string,
    existingSchedules: ScheduleItem[],
    currentEditIndex: number | null
  ): boolean => {
    if (!newDate) return true;

    // Get dates of all existing schedules except the one being edited
    const existingDates = existingSchedules
      .map((schedule, index) =>
        index !== currentEditIndex ? schedule.date : null
      )
      .filter((date): date is string => date !== null);

    // Check if new date is greater than all existing dates (for adding new schedule)
    if (
      currentEditIndex === null ||
      currentEditIndex === existingSchedules.length
    ) {
      return existingDates.every((date) => newDate > date);
    }

    // For editing, check if new date is greater than previous dates and less than next dates
    const previousDates = existingSchedules
      .slice(0, currentEditIndex)
      .map((s) => s.date);
    const nextDates = existingSchedules
      .slice(currentEditIndex + 1)
      .map((s) => s.date);

    return (
      previousDates.every((date) => newDate > date) &&
      nextDates.every((date) => newDate < date)
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Event Schedules
        </label>
        <button
          type="button"
          onClick={handleAddSchedule}
          disabled={disabled || editingIndex !== null || !isDatesValid}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiPlus className="w-4 h-4 mr-1" />
          Add Schedule
        </button>
      </div>

      {schedules.length === 0 && editingIndex === null && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          <FiClock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p>No schedules added yet</p>
          <p className="text-sm">
            Click &quot;Add Schedule&quot; to get started
          </p>
        </div>
      )}

      {/* Global date order warning */}
      {!isDatesValid && schedules.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
          <FiAlertCircle className="w-5 h-5 text-red-600" />
          <div>
            <p className="text-sm font-medium text-red-800">
              Tanggal harus berurutan secara kronologis
            </p>
            <p className="text-xs text-red-600">
              Geser jadwal agar tanggalnya berurutan atau edit tanggalnya
            </p>
          </div>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={schedules.map((_, index) => index)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {schedules.map((schedule, index) => (
              <SortableScheduleItem
                key={index}
                schedule={schedule}
                index={index}
                isEditing={editingIndex === index}
                disabled={disabled}
                editingIndex={editingIndex}
                editForm={editForm}
                timeError={timeError}
                dateError={dateError}
                isOutOfOrder={outOfOrderIndices.includes(index)}
                isDatesValid={isDatesValid}
                onEdit={handleEditSchedule}
                onDelete={handleDeleteSchedule}
                onEditFormChange={handleEditFormChange}
                onSave={handleSaveSchedule}
                onCancel={handleCancelEdit}
                formatDate={formatDate}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {editingIndex !== null && editingIndex === schedules.length && (
        <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <DateInput
                label="Date"
                value={editForm.date}
                onChange={(value) => {
                  setDateError("");
                  setEditForm((prev) => ({ ...prev, date: value }));
                }}
                required
                error={dateError}
              />
              <TextInput
                label="Location"
                name="location"
                value={editForm.location}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
                placeholder="e.g., Jakarta Convention Center"
                required
                icon={<FiMapPin className="text-gray-400" />}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <TimeInput
                label="Start Time"
                value={editForm.startTime || ""}
                onChange={(value) =>
                  setEditForm((prev) => ({
                    ...prev,
                    startTime: value,
                  }))
                }
                error={timeError}
              />
              <TimeInput
                label="End Time"
                value={editForm.endTime || ""}
                onChange={(value) =>
                  setEditForm((prev) => ({
                    ...prev,
                    endTime: value,
                  }))
                }
              />
            </div>
            <TextInput
              label="Notes (optional)"
              name="notes"
              value={editForm.notes || ""}
              onChange={(e) =>
                setEditForm((prev) => ({
                  ...prev,
                  notes: e.target.value,
                }))
              }
              placeholder="Additional notes for this schedule"
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSchedule}
                disabled={!editForm.date || !editForm.location}
                className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
