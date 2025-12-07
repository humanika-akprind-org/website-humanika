import { FiCheck, FiX, FiClock, FiRotateCcw } from "react-icons/fi";

interface BulkApprovalActionsProps {
  selectedCount: number;
  disabledApprove?: boolean;
  disabledReject?: boolean;
  disabledRevision?: boolean;
  disabledReturn?: boolean;
  isPending?: boolean;
  onBulkApprove: () => void;
  onBulkReject: () => void;
  onBulkRequestRevision: () => void;
  onBulkReturn: () => void;
}

export default function BulkApprovalActions({
  selectedCount,
  disabledApprove = false,
  disabledReject = false,
  disabledRevision = false,
  disabledReturn = false,
  isPending = false,
  onBulkApprove,
  onBulkReject,
  onBulkRequestRevision,
  onBulkReturn,
}: BulkApprovalActionsProps) {
  const isDisabledApprove = selectedCount === 0 || disabledApprove || isPending;
  const isDisabledReject = selectedCount === 0 || disabledReject || isPending;
  const isDisabledRevision =
    selectedCount === 0 || disabledRevision || isPending;
  const isDisabledReturn = selectedCount === 0 || disabledReturn || isPending;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
      <button
        className={`px-8 py-3.5 border border-gray-200 rounded-lg transition-colors text-sm font-medium inline-flex items-center justify-center ${
          isDisabledApprove
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-green-50 text-green-700 hover:bg-green-100"
        }`}
        onClick={onBulkApprove}
        disabled={isDisabledApprove}
        title="Approve"
      >
        <FiCheck size={14} />
      </button>

      <button
        className={`px-8 py-3.5 border border-gray-200 rounded-lg transition-colors text-sm font-medium inline-flex items-center justify-center ${
          isDisabledReject
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-red-50 text-red-700 hover:bg-red-100"
        }`}
        onClick={onBulkReject}
        disabled={isDisabledReject}
        title="Reject"
      >
        <FiX size={14} />
      </button>

      <button
        className={`px-8 py-3.5 border border-gray-200 rounded-lg transition-colors text-sm font-medium inline-flex items-center justify-center ${
          isDisabledRevision
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-blue-50 text-blue-700 hover:bg-blue-100"
        }`}
        onClick={onBulkRequestRevision}
        disabled={isDisabledRevision}
        title="Request Revision"
      >
        <FiClock size={14} />
      </button>

      <button
        className={`px-8 py-3.5 border border-gray-200 rounded-lg transition-colors text-sm font-medium inline-flex items-center justify-center ${
          isDisabledReturn
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-purple-50 text-purple-700 hover:bg-purple-100"
        }`}
        onClick={onBulkReturn}
        disabled={isDisabledReturn}
        title="Return"
      >
        <FiRotateCcw size={14} />
      </button>
    </div>
  );
}
