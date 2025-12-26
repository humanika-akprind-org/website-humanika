"use client";

import { useState, useEffect } from "react";
import { FiKey, FiSave } from "react-icons/fi";
import { useToast } from "@/hooks/use-toast";
import { UserApi } from "@/use-cases/api/user";

interface AccountStatus {
  isActive: boolean;
  verifiedAccount: boolean;
  email: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function AccountPage() {
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState<ChangePasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<ChangePasswordData>>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchAccountStatus = async () => {
      try {
        const response = await UserApi.getCurrentUser();
        if (response.data) {
          setAccountStatus({
            isActive: response.data.isActive,
            verifiedAccount: response.data.verifiedAccount,
            email: response.data.email,
          });
        } else {
          toast({
            title: "Error",
            description: response.error || "Failed to load account status",
            variant: "destructive",
          });
        }
      } catch (_error) {
        toast({
          title: "Error",
          description: "Network error occurred while loading account status",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAccountStatus();
  }, [toast]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name as keyof ChangePasswordData]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validatePasswordForm = (): boolean => {
    const errors: Partial<ChangePasswordData> = {};

    if (!passwordData.currentPassword.trim()) {
      errors.currentPassword = "Current password is required";
    }
    if (!passwordData.newPassword.trim()) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "New password must be at least 6 characters";
    }
    if (passwordData.confirmPassword !== passwordData.newPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswordForm()) return;

    setIsSubmitting(true);

    try {
      const response = await UserApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.error) {
        let errorMessage = "Failed to change password";
        switch (response.error) {
          case "Current password and new password are required":
            errorMessage = "Please fill in all password fields";
            break;
          case "Current password is incorrect":
            errorMessage = "Current password is incorrect";
            break;
          case "User not found or password not set":
            errorMessage =
              "Account password not found. Please contact support.";
            break;
          case "Unauthorized":
            errorMessage = "You are not authorized to perform this action";
            break;
          default:
            errorMessage = response.error;
        }
        setError(errorMessage);
      } else {
        setSuccess(
          "Password changed successfully! You can now use your new password to log in."
        );
        setError(""); // Clear any previous error messages
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setIsChangingPassword(false);
      }
    } catch (_error) {
      setError("Network error occurred while changing password");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeleteModalOpen(false);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/user/delete-account", {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        let errorMessage = "Failed to delete account";
        if (data.error) {
          switch (data.error) {
            case "Unauthorized":
              errorMessage = "You are not authorized to perform this action";
              break;
            case "User not found":
              errorMessage = "Account not found. Please contact support.";
              break;
            default:
              errorMessage = data.error;
          }
        }
        setError(errorMessage);
      } else {
        setSuccess(
          "Account deleted successfully! You will be redirected shortly."
        );
        // Optionally redirect user after account deletion
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }
    } catch (_error) {
      setError("Network error occurred while deleting account");
    } finally {
      setIsSubmitting(false);
      setIsDeleteModalOpen(false);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!accountStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Account Not Found
          </h1>
          <p className="text-gray-600">
            Unable to load your account information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your account security and preferences
          </p>
        </div>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Change Password */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Change Password
        </h3>
        {isChangingPassword ? (
          <form onSubmit={handleSubmitPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter current password"
              />
              {formErrors.currentPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.currentPassword}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter new password"
              />
              {formErrors.newPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.newPassword}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm new password"
              />
              {formErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setIsChangingPassword(false);
                  setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                  setFormErrors({});
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
              >
                <FiSave className="mr-2" />
                {isSubmitting ? "Saving..." : "Save Password"}
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsChangingPassword(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <FiKey className="mr-2" />
            Change Password
          </button>
        )}
      </div>

      {/* Delete Account */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Delete Account
        </h3>
        <p className="text-gray-600 mb-4">
          Deleting your account is permanent and cannot be undone. All your data
          will be lost.
        </p>
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          disabled={isSubmitting}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          Delete My Account
        </button>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Confirm Account Deletion
            </h2>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isSubmitting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
