"use client";

import { useState, useEffect, useRef } from "react";
import Button from "@/components/admin/ui/button/Button";
import TextInput from "@/components/admin/ui/input/TextInput";
import IconPicker, { type IconOption, defaultIcons } from "./IconPicker";
import { FiPlus, FiTrash2 } from "react-icons/fi";

export interface MissionItem {
  icon?: string;
  title: string;
  description: string;
}

interface MissionArrayInputProps {
  label?: string;
  name?: string;
  value?: MissionItem[] | string[];
  onChange?: (value: MissionItem[] | string[]) => void;
  error?: string | string[] | { title?: string; description?: string }[];
  placeholder?: string;
  required?: boolean;
  minItems?: number;
  maxItems?: number;
  withIcon?: boolean;
  iconOptions?: IconOption[];
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
  withIcon = false,
  iconOptions = defaultIcons,
}: MissionArrayInputProps) {
  // Initialize with value or default to one empty string/object
  const [missionInputs, setMissionInputs] = useState<MissionItem[] | string[]>(
    () => {
      if (value && value.length > 0) {
        if (Array.isArray(value)) {
          // Check if it's an array of objects (with icon) or strings
          if (value.length > 0 && typeof value[0] === "object") {
            return value as MissionItem[];
          }
          return value as string[];
        }
        return [value];
      }
      return withIcon ? [{ icon: "", title: "", description: "" }] : [""];
    }
  );

  // Update local state when prop value changes
  const prevValueRef = useRef<string | null>(null);
  useEffect(() => {
    const valueStr = JSON.stringify(value);
    if (valueStr !== prevValueRef.current && value && value.length > 0) {
      prevValueRef.current = valueStr;
      if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === "object") {
          setMissionInputs(value as MissionItem[]);
        } else {
          setMissionInputs(value as string[]);
        }
      } else {
        setMissionInputs([value]);
      }
    }
  }, [value]);

  const addMission = () => {
    if (maxItems && missionInputs.length >= maxItems) {
      return;
    }
    let newMissionInputs: MissionItem[] | string[];
    if (withIcon) {
      newMissionInputs = [
        ...(missionInputs as MissionItem[]),
        { icon: "", title: "", description: "" },
      ];
    } else {
      newMissionInputs = [...(missionInputs as string[]), ""];
    }
    setMissionInputs(newMissionInputs);
    onChange?.(newMissionInputs);
  };

  const removeMission = (index: number) => {
    if (missionInputs.length > minItems) {
      let newMissionInputs: MissionItem[] | string[];
      if (withIcon) {
        newMissionInputs = (missionInputs as MissionItem[]).filter(
          (_, i) => i !== index
        );
      } else {
        newMissionInputs = missionInputs.filter(
          (_, i) => i !== index
        ) as string[];
      }
      setMissionInputs(newMissionInputs);
      onChange?.(newMissionInputs);
    }
  };

  const updateMissionTitle = (index: number, newValue: string) => {
    const missionArray = missionInputs as MissionItem[];
    const newMissionInputs: MissionItem[] = [
      ...missionArray.slice(0, index),
      { ...missionArray[index], title: newValue },
      ...missionArray.slice(index + 1),
    ];
    setMissionInputs(newMissionInputs);
    onChange?.(newMissionInputs);
  };

  const updateMissionDescription = (index: number, newValue: string) => {
    const missionArray = missionInputs as MissionItem[];
    const newMissionInputs: MissionItem[] = [
      ...missionArray.slice(0, index),
      { ...missionArray[index], description: newValue },
      ...missionArray.slice(index + 1),
    ];
    setMissionInputs(newMissionInputs);
    onChange?.(newMissionInputs);
  };

  const updateMissionIcon = (index: number, iconValue: string) => {
    const missionArray = missionInputs as MissionItem[];
    const newMissionInputs: MissionItem[] = [
      ...missionArray.slice(0, index),
      { ...missionArray[index], icon: iconValue },
      ...missionArray.slice(index + 1),
    ];
    setMissionInputs(newMissionInputs);
    onChange?.(newMissionInputs);
  };

  const getErrorMessage = (
    errorIndex: number,
    field: "title" | "description"
  ): string | undefined => {
    if (!error) return undefined;
    if (typeof error === "string") return error;
    if (Array.isArray(error)) {
      // Check for object-based error format with title/description
      if (
        error.length > errorIndex &&
        typeof error[errorIndex] === "object" &&
        error[errorIndex] !== null
      ) {
        const errorObj = error[errorIndex] as {
          title?: string;
          description?: string;
        };
        return errorObj[field];
      }
      // Fallback to old string array format
      if (typeof error[errorIndex] === "string") {
        return error[errorIndex] as string;
      }
    }
    return undefined;
  };

  // Format mission display: bold the title before "-"
  const formatMissionDisplay = (mission: string): React.ReactNode => {
    if (!mission) return mission;
    const dashIndex = mission.indexOf(" - ");
    if (dashIndex === -1) {
      // Try with single "-"
      const singleDashIndex = mission.indexOf("-");
      if (singleDashIndex > 0) {
        return (
          <>
            <strong>{mission.substring(0, singleDashIndex)}</strong>
            {mission.substring(singleDashIndex)}
          </>
        );
      }
      return mission;
    }
    return (
      <>
        <strong>{mission.substring(0, dashIndex)}</strong>
        {mission.substring(dashIndex)}
      </>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && "*"}
          </label>
          <span className="text-xs text-gray-500">
            (format: <strong>Title</strong> - Description)
          </span>
        </div>
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
        <div key={index} className="flex items-start gap-2">
          {withIcon && typeof mission === "object" && (
            <div className="pt-6">
              <IconPicker
                value={mission.icon || ""}
                onChange={(iconValue) => updateMissionIcon(index, iconValue)}
                options={iconOptions}
                placeholder="Select icon"
                label={index === 0 ? "Icon" : undefined}
              />
            </div>
          )}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <TextInput
                label={`Title ${index + 1}`}
                name={`${name}.${index}.title`}
                placeholder={placeholder}
                value={typeof mission === "string" ? mission : mission.title}
                onChange={(e) => updateMissionTitle(index, e.target.value)}
                error={getErrorMessage(index, "title")}
              />
            </div>
            <div>
              <TextInput
                label={`Description ${index + 1}`}
                name={`${name}.${index}.description`}
                placeholder="Enter description"
                value={
                  typeof mission === "string" ? mission : mission.description
                }
                onChange={(e) =>
                  updateMissionDescription(index, e.target.value)
                }
                error={getErrorMessage(index, "description")}
              />
            </div>
          </div>
          {missionInputs.length > minItems && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeMission(index)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-6"
              icon={<FiTrash2 size={16} />}
            >
              Remove
            </Button>
          )}
        </div>
      ))}

      {/* Display formatted missions with bold title */}
      {missionInputs.some((m) =>
        typeof m === "string"
          ? m.trim()
          : m.title.trim() || m.description.trim()
      ) && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
          <p className="text-xs font-medium text-gray-500 mb-2">Preview:</p>
          <ul className="space-y-2">
            {missionInputs.map((mission, index) => {
              const missionTitle =
                typeof mission === "string" ? "" : mission.title;
              const missionDescription =
                typeof mission === "string" ? mission : mission.description;
              if (!missionTitle.trim() && !missionDescription.trim()) {
                return null;
              }
              return (
                <li key={index} className="text-sm text-gray-700">
                  {withIcon && typeof mission === "object" && mission.icon ? (
                    <span className="flex items-start gap-2">
                      <span className="flex items-center mt-0.5">
                        {(() => {
                          const iconOption = iconOptions.find(
                            (opt) => opt.value === mission.icon
                          );
                          const IconComponent = iconOption?.icon;
                          return IconComponent ? (
                            <IconComponent
                              size={16}
                              className="text-blue-600"
                            />
                          ) : null;
                        })()}
                      </span>
                      <span>
                        {missionTitle && <strong>{missionTitle}</strong>}
                        {missionTitle && missionDescription && " - "}
                        {missionDescription}
                      </span>
                    </span>
                  ) : typeof mission === "string" ? (
                    formatMissionDisplay(mission)
                  ) : (
                    <span>
                      {mission.title && <strong>{mission.title}</strong>}
                      {mission.title && mission.description && " - "}
                      {mission.description}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

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
