"use client";

import { useState } from "react";
import WidgetShell from "@/components/widgets/WidgetShell";
import { RiFilePdf2Line, RiDownloadLine, RiEyeLine, RiCloseLine } from "@remixicon/react";

const documents = [
  {
    title: "Business Case",
    filename: "transparency-portal-business-case.pdf",
    description:
      "Strategic business case for the All Is Well platform, covering ROI, market analysis, and value proposition.",
  },
  {
    title: "Project Description",
    filename: "transparency-portal-project-description.pdf",
    description:
      "Comprehensive project overview including scope, objectives, and key deliverables of All Is Well.",
  },
  {
    title: "Technology Statement",
    filename: "transparency-portal-technology-statement.pdf",
    description:
      "Technical architecture and technology stack powering the All Is Well digital health dashboard.",
  },
];

export default function DocumentationPage() {
  const [previewFile, setPreviewFile] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <WidgetShell title="Project Documentation" size="full">
        <div className="space-y-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            All Is Well — Your End-to-End Digital Health Dashboard. Download or view project documents below.
          </p>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
            {documents.map((doc) => (
              <div
                key={doc.filename}
                className="flex flex-col gap-3 p-4 rounded-lg border border-gray-100 dark:border-[#2E2E3D] bg-gray-50 dark:bg-[#262633]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                    <RiFilePdf2Line className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {doc.title}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                  {doc.description}
                </p>
                <div className="flex items-center gap-2 mt-auto pt-2">
                  <button
                    onClick={() => setPreviewFile(doc.filename)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-magenta/10 text-magenta hover:bg-magenta/20 transition-colors"
                  >
                    <RiEyeLine className="w-3.5 h-3.5" />
                    View
                  </button>
                  <a
                    href={`/docs/${doc.filename}`}
                    download
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-gray-200 dark:border-[#2E2E3D] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2E2E3D] transition-colors"
                  >
                    <RiDownloadLine className="w-3.5 h-3.5" />
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </WidgetShell>

      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="relative w-full max-w-5xl h-[85vh] mx-4 bg-white dark:bg-[#1C1C27] rounded-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-[#2E2E3D]">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {documents.find((d) => d.filename === previewFile)?.title}
              </h3>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <RiCloseLine className="w-5 h-5" />
              </button>
            </div>
            <iframe
              src={`/docs/${previewFile}`}
              className="flex-1 w-full"
              title="PDF Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
}
