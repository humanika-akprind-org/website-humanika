import { FiX } from "react-icons/fi";
import { useState, useEffect } from "react";
import { getAccessTokenAction } from "@/lib/actions/accessToken";
import { Loader2 } from "lucide-react";

interface DeleteModalProps {
  isOpen: boolean;
  itemName?: string;
  selectedCount?: number;
  onClose: () => void;
  onConfirm: () => void;
  /** When true, requires Google Drive connection to enable delete button */
  requireGoogleDriveAuth?: boolean;
  /** Optional callback for Google Drive connection */
  onConnectGoogleDrive?: () => void;
}

export default function DeleteModal({
  isOpen,
  itemName,
  selectedCount,
  onClose,
  onConfirm,
  requireGoogleDriveAuth = false,
  onConnectGoogleDrive,
}: DeleteModalProps) {
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [isLoadingToken, setIsLoadingToken] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!requireGoogleDriveAuth) {
      setIsGoogleConnected(true);
      return;
    }

    const checkGoogleDriveConnection = async () => {
      setIsLoadingToken(true);
      try {
        const token = await getAccessTokenAction();
        setIsGoogleConnected(!!token);
      } catch (error) {
        console.error("Failed to check Google Drive connection:", error);
        setIsGoogleConnected(false);
      } finally {
        setIsLoadingToken(false);
      }
    };

    checkGoogleDriveConnection();
  }, [requireGoogleDriveAuth]);

  if (!isOpen) return null;

  const isDeleteDisabled = requireGoogleDriveAuth && !isGoogleConnected;
  const showWarningMessage = requireGoogleDriveAuth && !isGoogleConnected;

  const handleConnectGoogleDrive = async () => {
    if (onConnectGoogleDrive) {
      onConnectGoogleDrive();
      return;
    }
    setIsConnecting(true);
    try {
      const response = await fetch("/api/google-drive/auth");
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Connection error:", error);
      setIsConnecting(false);
    }
  };

  const handleConfirm = () => {
    setIsDeleting(true);
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Confirm Deletion
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-600">
            {itemName
              ? `Are you sure you want to delete ${itemName}? This action cannot be undone.`
              : `Are you sure you want to delete ${selectedCount} selected items? This action cannot be undone.`}
          </p>
          {showWarningMessage && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              {isLoadingToken ? (
                <p className="text-sm text-amber-600 flex items-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-500 mr-2" />
                  Checking Google Drive connection...
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-amber-700">
                    You need to connect to Google Drive first to delete this
                    file.
                  </p>
                  <button
                    onClick={handleConnectGoogleDrive}
                    disabled={isConnecting}
                    className="px-3 py-1.5 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2"
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      "Connect Google Drive"
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
          <button
            className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              isDeleteDisabled || isDeleting
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
            onClick={handleConfirm}
            disabled={isDeleteDisabled || isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
