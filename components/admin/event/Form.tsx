import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiUpload, FiX } from "react-icons/fi";
import type { Event, CreateEventInput, UpdateEventInput } from "@/types/event";

import { Department as DepartmentEnum, Status as StatusEnum } from "@/types/enums";
import { useFile } from "@/hooks/useFile";
import { useToast } from "@/hooks/use-toast";
import { useUsers } from "@/hooks/useUsers";
import { usePeriods } from "@/hooks/usePeriods";
import Image from "next/image";

interface EventFormProps {
  event?: Event;
  onSubmit: (data: CreateEventInput | UpdateEventInput) => Promise<void>;
  isLoading?: boolean;
}

export default function EventForm({ event, onSubmit, isLoading = false }: EventFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [accessToken, setAccessToken] = useState<string>("");

  // Get access token from localStorage or context
  useEffect(() => {
    const token = localStorage.getItem("googleAccessToken");
    if (token) {
      setAccessToken(token);
    }
  }, []);

  const { uploadFile, isLoading: isUploading } = useFile(accessToken);

  const { users, loading: usersLoading } = useUsers();
  const { periods, loading: periodsLoading } = usePeriods();

  const [formData, setFormData] = useState({
    name: event?.name || "",
    description: event?.description || "",
    goal: event?.goal || "",
    department: event?.department || DepartmentEnum.BPH,
    periodId: event?.period?.id || "",
    responsibleId: event?.responsible?.id || "",
    startDate: event?.startDate ? new Date(event.startDate).toISOString().split("T")[0] : "",
    endDate: event?.endDate ? new Date(event.endDate).toISOString().split("T")[0] : "",
    funds: event?.funds || 0,
    status: event?.status || StatusEnum.DRAFT,
    workProgramId: event?.workProgram?.id || "",
    thumbnail: null as File | null,
    thumbnailPreview: event?.thumbnail || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        thumbnail: file,
        thumbnailPreview: URL.createObjectURL(file)
      }));
    }
  };

  const removeThumbnail = () => {
    setFormData(prev => ({
      ...prev,
      thumbnail: null,
      thumbnailPreview: ""
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Event name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.goal.trim()) newErrors.goal = "Goal is required";
    if (!formData.periodId) newErrors.periodId = "Period is required";
    if (!formData.responsibleId) newErrors.responsibleId = "Responsible person is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (formData.funds <= 0) newErrors.funds = "Funds must be greater than 0";

    // Validate date range
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    try {
      let thumbnailUrl = event?.thumbnail || "";

      // Upload thumbnail if a new file is selected
      if (formData.thumbnail && accessToken) {
        const fileId = await uploadFile(formData.thumbnail, `event-thumbnail-${Date.now()}`);
        if (fileId) {
          // Convert file ID to Google Drive URL
          thumbnailUrl = `https://drive.google.com/uc?id=${fileId}`;
        }
      }

      const submitData = {
        ...formData,
        thumbnail: thumbnailUrl,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
      };

      await onSubmit(submitData);

      toast({
        title: "Success",
        description: `Event ${event ? "updated" : "created"} successfully`,
      });

      router.push("/admin/programs/events");
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: `Failed to ${event ? "update" : "create"} event`,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Event Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter event name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department *
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.values(DepartmentEnum).map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.values(StatusEnum).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Funds */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget (IDR) *
            </label>
            <input
              type="number"
              name="funds"
              value={formData.funds}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.funds ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="0"
              min="0"
            />
            {errors.funds && <p className="text-red-500 text-sm mt-1">{errors.funds}</p>}
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter event description"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Goal */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Goal *
          </label>
          <textarea
            name="goal"
            value={formData.goal}
            onChange={handleInputChange}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.goal ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter event goal"
          />
          {errors.goal && <p className="text-red-500 text-sm mt-1">{errors.goal}</p>}
        </div>
      </div>

      {/* Dates and Relations */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Dates & Relations</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date *
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.startDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date *
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.endDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
          </div>

          {/* Period */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Period *
            </label>
            <select
              name="periodId"
              value={formData.periodId}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.periodId ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select Period</option>
              {periodsLoading ? (
                <option disabled>Loading periods...</option>
              ) : (
                periods.map((period) => (
                  <option key={period.id} value={period.id}>
                    {period.name}
                  </option>
                ))
              )}
            </select>
            {errors.periodId && <p className="text-red-500 text-sm mt-1">{errors.periodId}</p>}
          </div>

          {/* Responsible Person */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Responsible Person *
            </label>
            <select
              name="responsibleId"
              value={formData.responsibleId}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.responsibleId ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select Person</option>
              {usersLoading ? (
                <option disabled>Loading users...</option>
              ) : (
                users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))
              )}
            </select>
            {errors.responsibleId && <p className="text-red-500 text-sm mt-1">{errors.responsibleId}</p>}
          </div>
        </div>
      </div>

      {/* Thumbnail Upload */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Thumbnail</h3>

        <div className="space-y-4">
          {/* Current/Preview Image */}
          {formData.thumbnailPreview && (
            <div className="relative inline-block">
              <Image
                src={formData.thumbnailPreview}
                alt="Event thumbnail"
                className="w-32 h-32 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={removeThumbnail}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Thumbnail
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="thumbnail-upload"
              />
              <label
                htmlFor="thumbnail-upload"
                className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-md cursor-pointer hover:bg-blue-100"
              >
                <FiUpload className="h-4 w-4 mr-2" />
                Choose File
              </label>
              {isUploading && <span className="text-sm text-gray-500">Uploading...</span>}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Recommended: 800x600px, max 5MB
            </p>
          </div>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading || isUploading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : event ? "Update Event" : "Create Event"}
        </button>
      </div>
    </form>
  );
}
