"use client";

import { useState, useEffect, useRef } from "react";
import Button from "@/components/admin/ui/button/Button";
import TextInput from "@/components/admin/ui/input/TextInput";
import { FiPlus, FiTrash2 } from "react-icons/fi";

interface MissionArrayInputProps {
  label?: string;
  name?: string;
  value?: string[];
  onChange?: (value: string[]) => void;
  error?: string | string[];
  placeholder?: string;
  required?: boolean;
  minItems?: number;
  maxItems?: number;
}

export default function MissionArrayInput({
  label = "Mission",
  name = "mission",
  value = [],
  onChange,
  error,
  placeholder = "Enter mission",
  required = false,
  minItems = 1,
  maxItems,
}: MissionArrayInputProps) {
  // Initialize with value or default to one empty string
  const [missionInputs, setMissionInputs] = useState<string[]>(() => {
    if (value && value.length > 0) {
      return Array.isArray(value) ? value : [value];
    }
    return [""];
  });

  // Update local state when prop value changes
  const prevValueRef = useRef<string | null>(null);
  useEffect(() => {
    const valueStr = JSON.stringify(value);
    if (valueStr !== prevValueRef.current && value && value.length > 0) {
      prevValueRef.current = valueStr;
      const newValue = Array.isArray(value) ? value : [value];
      setMissionInputs(newValue);
    }
  }, [value]);

  const addMission = () => {
    if (maxItems && missionInputs.length >= maxItems) {
      return;
    }
    const newMissionInputs = [...missionInputs, ""];
    setMissionInputs(newMissionInputs);
    onChange?.(newMissionInputs);
  };

  const removeMission = (index: number) => {
    if (missionInputs.length > minItems) {
      const newMissionInputs = missionInputs.filter((_, i) => i !== index);
      setMissionInputs(newMissionInputs);
      onChange?.(newMissionInputs);
    }
  };

  const updateMission = (index: number, newValue: string) => {
    const newMissionInputs = [...missionInputs];
    newMissionInputs[index] = newValue;
    setMissionInputs(newMissionInputs);
    onChange?.(newMissionInputs);
  };

  const getErrorMessage = (errorIndex: number): string | undefined => {
    if (!error) return undefined;
    if (typeof error === "string") return error;
    if (Array.isArray(error) && error[errorIndex]) {
      return error[errorIndex];
    }
    return undefined;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && "*"}
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addMission}
          disabled={maxItems ? missionInputs.length >= maxItems : false}
          icon={<FiPlus size={14} />}
        >
          Add {label}
        </Button>
      </div>

      {/* General error message */}
      {typeof error === "string" && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Mission inputs */}
      {missionInputs.map((mission, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="flex-1">
            <TextInput
              label={`${label} ${index + 1}`}
              name={`${name}.${index}`}
              placeholder={`${placeholder} ${index + 1}`}
              value={mission}
              onChange={(e) => updateMission(index, e.target.value)}
              error={getErrorMessage(index)}
            />
          </div>
          {missionInputs.length > minItems && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeMission(index)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              icon={<FiTrash2 size={16} />}
            >
              Remove
            </Button>
          )}
        </div>
      ))}

      {/* Minimum items notice */}
      {missionInputs.length === minItems && (
        <p className="text-xs text-gray-500">
          At least {minItems} {label.toLowerCase()}{" "}
          {minItems === 1 ? "is" : "are"} required
        </p>
      )}
    </div>
  );
}
