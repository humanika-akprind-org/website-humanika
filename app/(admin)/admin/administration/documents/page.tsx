// app/dashboard/documents/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiSearch,
  FiPlus,
  FiFilter,
  FiEdit,
  FiTrash2,
  FiDownload,
  FiEye,
  FiFile,
  FiX,
  FiChevronDown,
  FiClock,
  FiCheckCircle,
  FiArchive,
  FiUser,
} from "react-icons/fi";

interface Document {
  id: string;
  name: string;
  eventId?: string;
  letterId?: string;
  type: "PROPOSAL" | "REPORT" | "CONTRACT" | "MEMORANDUM" | "OTHER";
  status: "PENDING" | "APPROVED" | "REJECTED" | "ARCHIVED";
  fileUrl?: string;
  mimeType?: string;
  fileSize?: number;
  userId: string;
  version: number;
  parentId?: string;
  isCurrent: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    name: string;
    email: string;
  };
  event?: {
    name: string;
  };
  letter?: {
    title: string;
  };
}

export default function DocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "Q3 Financial Report",
      type: "REPORT",
      status: "APPROVED",
      fileUrl: "/reports/q3-financial.pdf",
      mimeType: "application/pdf",
      fileSize: 2048576,
      userId: "user1",
      version: 2,
      isCurrent: true,
      createdAt: "2023-10-15T09:32:45Z",
      updatedAt: "2023-10-18T14:20:12Z",
      user: {
        name: "John Doe",
        email: "john.doe@organization.org",
      },
    },
    {
      id: "2",
      name: "Marketing Proposal",
      eventId: "event1",
      type: "PROPOSAL",
      status: "PENDING",
      fileUrl: "/proposals/marketing.pdf",
      mimeType: "application/pdf",
      fileSize: 1536921,
      userId: "user2",
      version: 1,
      isCurrent: true,
      createdAt: "2023-10-18T14:20:12Z",
      updatedAt: "2023-10-18T14:20:12Z",
      user: {
        name: "Alice Smith",
        email: "alice.smith@organization.org",
      },
      event: {
        name: "Annual Conference",
      },
    },
    {
      id: "3",
      name: "Client Contract",
      type: "CONTRACT",
      status: "APPROVED",
      fileUrl: "/contracts/client-agreement.pdf",
      mimeType: "application/pdf",
      fileSize: 3057214,
      userId: "user3",
      version: 3,
      parentId: "3-parent",
      isCurrent: true,
      createdAt: "2023-10-05T11:45:23Z",
      updatedAt: "2023-10-19T08:12:37Z",
      user: {
        name: "Robert Johnson",
        email: "robert.j@organization.org",
      },
    },
    {
      id: "4",
      name: "Internal Memorandum",
      type: "MEMORANDUM",
      status: "REJECTED",
      fileUrl: "/memos/internal-announcement.docx",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      fileSize: 512432,
      userId: "user4",
      version: 1,
      isCurrent: true,
      createdAt: "2023-09-28T16:30:55Z",
      updatedAt: "2023-10-01T09:15:22Z",
      user: {
        name: "Emily Wilson",
        email: "emily.wilson@organization.org",
      },
    },
    {
      id: "5",
      name: "Technical Specifications",
      type: "OTHER",
      status: "ARCHIVED",
      fileUrl: "/specs/tech-specs.pdf",
      mimeType: "application/pdf",
      fileSize: 4096128,
      userId: "user5",
      version: 1,
      isCurrent: false,
      createdAt: "2023-10-19T08:12:37Z",
      updatedAt: "2023-10-20T10:35:21Z",
      user: {
        name: "Michael Brown",
        email: "michael.b@organization.org",
      },
    },
    {
      id: "6",
      name: "Project Timeline",
      eventId: "event2",
      type: "REPORT",
      status: "PENDING",
      fileUrl: "/reports/project-timeline.xlsx",
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      fileSize: 1024456,
      userId: "user6",
      version: 1,
      isCurrent: true,
      createdAt: "2023-10-20T10:35:21Z",
      updatedAt: "2023-10-20T10:35:21Z",
      user: {
        name: "Sarah Davis",
        email: "sarah.d@organization.org",
      },
      event: {
        name: "Product Launch",
      },
    },
  ]);

  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter documents based on search term and filters
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false);
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    const matchesType = typeFilter === "all" || doc.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Toggle document selection
  const toggleDocumentSelection = (id: string) => {
    if (selectedDocuments.includes(id)) {
      setSelectedDocuments(selectedDocuments.filter((docId) => docId !== id));
    } else {
      setSelectedDocuments([...selectedDocuments, id]);
    }
  };

  // Select all documents on current page
  const toggleSelectAll = () => {
    if (selectedDocuments.length === filteredDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(filteredDocuments.map((doc) => doc.id));
    }
  };

  // Navigate to add document page
  const handleAddDocument = () => {
    router.push("/dashboard/documents/add");
  };

  // Navigate to edit document page
  const handleEditDocument = (id: string) => {
    router.push(`/dashboard/documents/edit/${id}`);
  };

  // View document details
  const handleViewDocument = (id: string) => {
    router.push(`/dashboard/documents/view/${id}`);
  };

  // Download document
  const handleDownloadDocument = (doc: Document) => {
    if (doc.fileUrl) {
      // In a real application, this would trigger a download
      console.log(`Downloading document: ${doc.name} from ${doc.fileUrl}`);
      // You might want to use something like:
      // window.open(doc.fileUrl, '_blank');
    }
  };

  // Delete document(s)
  const handleDelete = (doc?: Document) => {
    if (doc) {
      setCurrentDocument(doc);
    }
    setShowDeleteModal(true);
  };

  // Change document status
  const handleChangeStatus = (docId: string, status: Document["status"]) => {
    setDocuments(
      documents.map((doc) => (doc.id === docId ? { ...doc, status } : doc))
    );
  };

  // Execute deletion
  const confirmDelete = () => {
    if (currentDocument) {
      // Delete single document
      setDocuments(documents.filter((doc) => doc.id !== currentDocument.id));
    } else if (selectedDocuments.length > 0) {
      // Delete multiple documents
      setDocuments(
        documents.filter((doc) => !selectedDocuments.includes(doc.id))
      );
      setSelectedDocuments([]);
    }
    setShowDeleteModal(false);
    setCurrentDocument(null);
  };

  // Get status badge class
  const getStatusClass = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "ARCHIVED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get type badge class
  const getTypeClass = (type: string) => {
    switch (type) {
      case "PROPOSAL":
        return "bg-blue-100 text-blue-800";
      case "REPORT":
        return "bg-purple-100 text-purple-800";
      case "CONTRACT":
        return "bg-indigo-100 text-indigo-800";
      case "MEMORANDUM":
        return "bg-teal-100 text-teal-800";
      case "OTHER":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format file size
  const formatFileSize = (bytes: number | undefined) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Document Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage all documents and their versions
          </p>
        </div>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center mt-4 md:mt-0"
          onClick={handleAddDocument}
        >
          <FiPlus className="mr-2" />
          Add New Document
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">
              Total Documents
            </h3>
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiFile className="text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {documents.length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">
              Pending Review
            </h3>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FiClock className="text-yellow-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {documents.filter((d) => d.status === "PENDING").length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">Approved</h3>
            <div className="p-2 bg-green-100 rounded-lg">
              <FiCheckCircle className="text-green-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {documents.filter((d) => d.status === "APPROVED").length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">Archived</h3>
            <div className="p-2 bg-gray-100 rounded-lg">
              <FiArchive className="text-gray-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {documents.filter((d) => d.status === "ARCHIVED").length}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search documents by name or owner..."
              className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            className="flex items-center px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <FiFilter className="mr-2 text-gray-500" />
            Filters
            <FiChevronDown
              className={`ml-2 transition-transform ${
                isFilterOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Advanced Filters */}
        {isFilterOpen && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="PROPOSAL">Proposal</option>
                <option value="REPORT">Report</option>
                <option value="CONTRACT">Contract</option>
                <option value="MEMORANDUM">Memorandum</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                className={`px-4 py-2.5 rounded-lg transition-colors w-full flex items-center justify-center ${
                  selectedDocuments.length === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-red-50 text-red-700 hover:bg-red-100"
                }`}
                onClick={() => handleDelete()}
                disabled={selectedDocuments.length === 0}
              >
                <FiTrash2 className="mr-2" />
                Delete Selected ({selectedDocuments.length})
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Documents Table */}
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
                      filteredDocuments.length > 0 &&
                      selectedDocuments.length === filteredDocuments.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Document
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Owner
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Size
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
                  Version
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Last Updated
                </th>
                <th
                  scope="col"
                  className="pl-4 pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="pl-6 pr-2 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedDocuments.includes(doc.id)}
                      onChange={() => toggleDocumentSelection(doc.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <FiFile className="text-blue-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {doc.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {doc.event
                            ? `Event: ${doc.event.name}`
                            : doc.letter
                            ? `Letter: ${doc.letter.title}`
                            : "No associated item"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getTypeClass(
                        doc.type
                      )}`}
                    >
                      {doc.type.charAt(0) + doc.type.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-1 bg-gray-100 rounded-full mr-2">
                        <FiUser className="text-gray-500" size={14} />
                      </div>
                      <div>
                        <div className="text-sm text-gray-900">
                          {doc.user?.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {doc.user?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatFileSize(doc.fileSize)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusClass(
                        doc.status
                      )}`}
                    >
                      {doc.status.charAt(0) + doc.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    v{doc.version}
                    {!doc.isCurrent && (
                      <span className="ml-1 text-xs text-yellow-600">
                        (Old)
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(doc.updatedAt)}
                  </td>
                  <td className="pl-4 pr-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        onClick={() => handleViewDocument(doc.id)}
                        title="View document"
                      >
                        <FiEye size={16} />
                      </button>
                      <button
                        className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                        onClick={() => handleDownloadDocument(doc)}
                        title="Download document"
                      >
                        <FiDownload size={16} />
                      </button>
                      <button
                        className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                        onClick={() => handleEditDocument(doc.id)}
                        title="Edit document"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        onClick={() => handleDelete(doc)}
                        title="Delete document"
                      >
                        <FiTrash2 size={16} />
                      </button>
                      {doc.status !== "ARCHIVED" && (
                        <button
                          className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors"
                          onClick={() => handleChangeStatus(doc.id, "ARCHIVED")}
                          title="Archive document"
                        >
                          <FiArchive size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <FiFile size={48} className="mx-auto" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              No documents found
            </p>
            <p className="text-gray-400 mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Table Footer */}
        {filteredDocuments.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-gray-700 mb-4 sm:mb-0">
              Showing{" "}
              <span className="font-medium">{filteredDocuments.length}</span> of{" "}
              <span className="font-medium">{documents.length}</span> documents
            </p>
            <div className="flex space-x-2">
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
                Previous
              </button>
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
                Next
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
                  Confirm Deletion
                </h2>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setCurrentDocument(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600">
                {currentDocument
                  ? `Are you sure you want to delete "${currentDocument.name}"? This action cannot be undone.`
                  : `Are you sure you want to delete ${selectedDocuments.length} selected documents? This action cannot be undone.`}
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => {
                  setShowDeleteModal(false);
                  setCurrentDocument(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                onClick={confirmDelete}
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
