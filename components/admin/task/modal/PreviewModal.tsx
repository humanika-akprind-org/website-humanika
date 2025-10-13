import React from "react";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: {
    note: string;
    department: string;
    user?: { name: string };
    status: string;
    createdAt: Date;
  } | null;
}

export default function PreviewModal({
  isOpen,
  onClose,
  task,
}: PreviewModalProps) {
  if (!isOpen || !task) return null;

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose} />
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Task Preview
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <p className="text-sm text-gray-900">{task.department}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assigned User
                    </label>
                    <p className="text-sm text-gray-900">{task.user?.name || "Unassigned"}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <p className="text-sm text-gray-900">{task.status}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Created At
                    </label>
                    <p className="text-sm text-gray-900">{formatDate(task.createdAt)}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Task Note
                    </label>
                    <div className="border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <style>
                        {`
                          .preview-content h1 { font-size: 2em; margin: 0.67em 0; font-weight: bold; }
                          .preview-content h2 { font-size: 1.5em; margin: 0.83em 0; font-weight: bold; }
                          .preview-content h3 { font-size: 1.17em; margin: 1em 0; font-weight: bold; }
                          .preview-content h4 { font-size: 1em; margin: 1.33em 0; font-weight: bold; }
                          .preview-content h5 { font-size: 0.83em; margin: 1.67em 0; font-weight: bold; }
                          .preview-content h6 { font-size: 0.67em; margin: 2.33em 0; font-weight: bold; }
                          .preview-content p { margin: 1em 0; }
                          .preview-content ul, .preview-content ol { margin: 1em 0; padding-left: 2em; }
                          .preview-content li { margin: 0.5em 0; }
                          .preview-content strong, .preview-content b { font-weight: bold; }
                          .preview-content em, .preview-content i { font-style: italic; }
                          .preview-content u { text-decoration: underline; }
                          .preview-content s, .preview-content strike { text-decoration: line-through; }
                          .preview-content blockquote { margin: 1em 0; padding-left: 1em; border-left: 4px solid #e5e7eb; font-style: italic; }
                          .preview-content code { background-color: #f3f4f6; padding: 0.125em 0.25em; border-radius: 0.25em; font-family: monospace; }
                          .preview-content pre { background-color: #f3f4f6; padding: 1em; border-radius: 0.375em; overflow-x: auto; }
                          .preview-content table { border-collapse: collapse; width: 100%; margin: 1em 0; }
                          .preview-content th, .preview-content td { border: 1px solid #d1d5db; padding: 0.5em; text-align: left; }
                          .preview-content th { background-color: #f9fafb; font-weight: bold; }
                        `}
                      </style>
                      <div
                        className="prose prose-sm max-w-none preview-content"
                        dangerouslySetInnerHTML={{ __html: task.note }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
