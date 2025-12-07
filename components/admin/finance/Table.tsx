"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiEdit,
  FiTrash2,
  FiEye,
  FiDownload,
  FiX,
  FiDollarSign,
  FiFile,
  FiTrendingUp,
  FiTrendingDown,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiClock,
} from "react-icons/fi";
import SortIcon from "../ui/SortIcon";
import type { Finance } from "@/types/finance";
import HtmlRenderer from "../ui/HtmlRenderer";

interface FinanceTableProps {
  finances: Finance[];
  onDelete: (id: string) => void;
  accessToken?: string;
}

export default function FinanceTable({
  finances,
  onDelete,
}: FinanceTableProps) {
  const router = useRouter();
  const [selectedFinances, setSelectedFinances] = useState<string[]>([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentFinance, setCurrentFinance] = useState<Finance | null>(null);
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Sort finances
  const sortedFinances = [...finances].sort((a, b) => {
    let aValue, bValue;

    switch (sortField) {
      case "amount":
        aValue = a.amount;
        bValue = b.amount;
        break;
      case "description":
        aValue = a.description;
        bValue = b.description;
        break;
      case "date":
        aValue = a.date;
        bValue = b.date;
        break;
      default:
        aValue = a.date;
        bValue = b.date;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Toggle finance selection
  const toggleFinanceSelection = (id: string) => {
    if (selectedFinances.includes(id)) {
      setSelectedFinances(
        selectedFinances.filter((financeId) => financeId !== id)
      );
    } else {
      setSelectedFinances([...selectedFinances, id]);
    }
  };

  // Select all finances on current page
  const toggleSelectAll = () => {
    if (selectedFinances.length === finances.length) {
      setSelectedFinances([]);
    } else {
      setSelectedFinances(finances.map((finance) => finance.id));
    }
  };

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Navigate to edit finance page
  const handleEditFinance = (id: string) => {
    router.push(`/admin/finance/transactions/edit/${id}`);
  };

  // View finance details
  const handleViewFinance = (id: string) => {
    router.push(`/admin/finance/transactions/view/${id}`);
  };

  // Download finance file
  const handleDownloadFile = (finance: Finance) => {
    if (finance.proof) {
      // In a real application, this would trigger a download
      console.log(
        `Downloading file: ${finance.description} from ${finance.proof}`
      );
      // You might want to use something like:
      // window.open(finance.proof, '_blank');
    }
  };

  // Delete finance(s)
  const handleDelete = (finance?: Finance) => {
    if (finance) {
      setCurrentFinance(finance);
    }
    setShowDeleteModal(true);
  };

  // Execute deletion
  const confirmDelete = async () => {
    if (currentFinance) {
      // Delete single finance
      await onDelete(currentFinance.id);
    } else if (selectedFinances.length > 0) {
      // Delete multiple finances
      for (const id of selectedFinances) {
        await onDelete(id);
      }
      setSelectedFinances([]);
    }
    setShowDeleteModal(false);
    setCurrentFinance(null);
  };

  // Get status badge class
  const getStatusClass = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "PUBLISH":
        return "bg-green-100 text-green-800";
      case "ARCHIVE":
        return "bg-red-100 text-red-800";
      case "ARCHIVED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format currency
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  // Format date
  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Get file icon based on mime type
  const getFileIcon = (mimeType: string | null) => {
    if (!mimeType) return <FiFile className="text-gray-400" />;

    if (mimeType.includes("pdf")) return <FiFile className="text-red-500" />;
    if (mimeType.includes("word")) return <FiFile className="text-blue-500" />;
    if (mimeType.includes("excel")) {
      return <FiFile className="text-green-500" />;
    }
    if (mimeType.includes("image")) {
      return <FiFile className="text-purple-500" />;
    }

    return <FiFile className="text-gray-400" />;
  };

  return (
    <div className="p-0">
      {/* Finances Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="pl-6 pr-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"
                >
                  <input
                    type="checkbox"
                    checked={
                      finances.length > 0 &&
                      selectedFinances.length === finances.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("description")}
                >
                  <div className="flex items-center">
                    Deskripsi
                    <SortIcon
                      sortField={sortField}
                      sortDirection={sortDirection}
                      field="description"
                      iconType="arrow"
                    />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Kategori
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("amount")}
                >
                  <div className="flex items-center">
                    Jumlah
                    <SortIcon
                      sortField={sortField}
                      sortDirection={sortDirection}
                      field="amount"
                      iconType="arrow"
                    />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tipe
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Bukti
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center">
                    Tanggal
                    <SortIcon
                      sortField={sortField}
                      sortDirection={sortDirection}
                      field="date"
                      iconType="arrow"
                    />{" "}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Approval
                </th>
                <th
                  scope="col"
                  className="pl-4 pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedFinances.map((finance) => (
                <tr
                  key={finance.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="pl-6 pr-2 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedFinances.includes(finance.id)}
                      onChange={() => toggleFinanceSelection(finance.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <HtmlRenderer html={finance.description} />
                    {finance.event && (
                      <div className="text-xs text-gray-500 mt-1">
                        Acara: {finance.event.name}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      {finance.category?.name || "Tidak ada kategori"}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div
                      className={`text-sm font-medium ${
                        finance.type === "INCOME"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {formatCurrency(finance.amount)}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        finance.type === "INCOME"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {finance.type === "INCOME" ? (
                        <>
                          <FiTrendingUp className="mr-1" size={12} />
                          Pendapatan
                        </>
                      ) : (
                        <>
                          <FiTrendingDown className="mr-1" size={12} />
                          Pengeluaran
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {finance.proof ? (
                        <>
                          {getFileIcon(null)}
                          <span className="ml-2 text-sm text-gray-600">
                            Bukti
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-gray-400">Tidak ada</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <FiCalendar className="mr-1 text-gray-400" size={14} />
                      {formatDate(finance.date)}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusClass(
                        finance.status
                      )}`}
                    >
                      {finance.status === "PENDING"
                        ? "Menunggu"
                        : finance.status === "PUBLISH"
                        ? "Disetujui"
                        : finance.status === "ARCHIVE"
                        ? "Ditolak"
                        : "Diarsipkan"}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {finance.approvals && finance.approvals.length > 0 ? (
                      (() => {
                        const latestApproval = finance.approvals.sort(
                          (a, b) =>
                            new Date(b.updatedAt).getTime() -
                            new Date(a.updatedAt).getTime()
                        )[0];
                        return (
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full flex items-center w-fit ${
                              latestApproval.status === "APPROVED"
                                ? "bg-green-100 text-green-800"
                                : latestApproval.status === "REJECTED"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {latestApproval.status === "APPROVED" && (
                              <FiCheckCircle className="mr-1" />
                            )}
                            {latestApproval.status === "REJECTED" && (
                              <FiXCircle className="mr-1" />
                            )}
                            {latestApproval.status === "PENDING" && (
                              <FiClock className="mr-1" />
                            )}
                            {latestApproval.status}
                          </span>
                        );
                      })()
                    ) : (
                      <span className="text-xs text-gray-400">
                        No approvals
                      </span>
                    )}
                  </td>
                  <td className="pl-4 pr-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {finance.proof && (
                        <button
                          className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                          onClick={() => handleDownloadFile(finance)}
                          title="Download bukti"
                        >
                          <FiDownload size={16} />
                        </button>
                      )}
                      <button
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        onClick={() => handleViewFinance(finance.id)}
                        title="Lihat detail"
                      >
                        <FiEye size={16} />
                      </button>
                      <button
                        className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                        onClick={() => handleEditFinance(finance.id)}
                        title="Edit transaksi"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        onClick={() => handleDelete(finance)}
                        title="Hapus transaksi"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sortedFinances.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <FiDollarSign size={48} className="mx-auto" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              Tidak ada transaksi ditemukan
            </p>
            <p className="text-gray-400 mt-1">
              Coba sesuaikan pencarian atau filter Anda
            </p>
          </div>
        )}

        {/* Table Footer */}
        {sortedFinances.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-gray-700 mb-4 sm:mb-0">
              Menampilkan{" "}
              <span className="font-medium">{sortedFinances.length}</span> dari{" "}
              <span className="font-medium">{finances.length}</span> transaksi
            </p>
            <div className="flex space-x-2">
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
                Sebelumnya
              </button>
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  Konfirmasi Penghapusan
                </h2>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setCurrentFinance(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600">
                {currentFinance
                  ? `Apakah Anda yakin ingin menghapus transaksi "${currentFinance.description}"? Tindakan ini tidak dapat dibatalkan.`
                  : `Apakah Anda yakin ingin menghapus ${selectedFinances.length} transaksi terpilih? Tindakan ini tidak dapat dibatalkan.`}
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => {
                  setShowDeleteModal(false);
                  setCurrentFinance(null);
                }}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                onClick={confirmDelete}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
