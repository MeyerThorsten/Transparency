"use client";

import { useState } from "react";
import { useTheme } from "@/lib/theme-context";
import { useCustomer } from "@/lib/customer-context";
import WidgetShell from "@/components/widgets/WidgetShell";
import { RiSunLine, RiMoonLine, RiFilePdf2Line, RiDownloadLine, RiEyeLine } from "@remixicon/react";

function Appearance() {
  const { theme, toggleTheme } = useTheme();

  return (
    <WidgetShell title="Appearance" size="full">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Theme</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Switch between light and dark mode
          </p>
        </div>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-[#2E2E3D] bg-gray-50 dark:bg-[#262633] hover:bg-gray-100 dark:hover:bg-[#2E2E3D] transition-colors"
        >
          {theme === "dark" ? (
            <>
              <RiMoonLine className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Dark</span>
            </>
          ) : (
            <>
              <RiSunLine className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Light</span>
            </>
          )}
        </button>
      </div>
    </WidgetShell>
  );
}

function Profile() {
  const { customer } = useCustomer();

  if (!customer) return null;

  const fields = [
    { label: "Company", value: customer.name },
    { label: "Industry", value: customer.industry },
    { label: "Tier", value: customer.tier },
    { label: "Contact", value: customer.contactEmail },
    { label: "Services", value: customer.subscribedCategories.join(", ") },
  ];

  return (
    <WidgetShell title="Profile" size="full">
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-magenta/10 flex items-center justify-center">
            <span className="text-sm font-bold text-magenta">{customer.logoInitials}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{customer.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{customer.tier}</p>
          </div>
        </div>
        {fields.map((field) => (
          <div key={field.label} className="flex items-start justify-between py-2 border-b border-gray-50 dark:border-[#1C1C27]">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{field.label}</span>
            <span className="text-sm text-gray-900 dark:text-gray-100 text-right">{field.value}</span>
          </div>
        ))}
      </div>
    </WidgetShell>
  );
}

function Notifications() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [incidentNotifs, setIncidentNotifs] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);
  const [maintenanceAlerts, setMaintenanceAlerts] = useState(true);

  const toggles = [
    { label: "Email Alerts", description: "Receive email notifications for critical events", value: emailAlerts, onChange: setEmailAlerts },
    { label: "Incident Notifications", description: "Get notified when new incidents are created", value: incidentNotifs, onChange: setIncidentNotifs },
    { label: "Weekly Reports", description: "Receive a weekly summary report via email", value: weeklyReport, onChange: setWeeklyReport },
    { label: "Maintenance Alerts", description: "Get notified about upcoming maintenance windows", value: maintenanceAlerts, onChange: setMaintenanceAlerts },
  ];

  return (
    <WidgetShell title="Notifications" size="full">
      <div className="space-y-4">
        {toggles.map((toggle) => (
          <div key={toggle.label} className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{toggle.label}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{toggle.description}</p>
            </div>
            <button
              onClick={() => toggle.onChange(!toggle.value)}
              className={`relative w-10 h-5 rounded-full transition-colors ${
                toggle.value ? "bg-magenta" : "bg-gray-300 dark:bg-[#2E2E3D]"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${
                  toggle.value ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </WidgetShell>
  );
}

const documents = [
  {
    title: "Business Case",
    filename: "transparency-portal-business-case.pdf",
    description: "Strategic business case for the All Is Well platform, covering ROI, market analysis, and value proposition.",
  },
  {
    title: "Project Description",
    filename: "transparency-portal-project-description.pdf",
    description: "Comprehensive project overview including scope, objectives, and key deliverables of All Is Well.",
  },
  {
    title: "Technology Statement",
    filename: "transparency-portal-technology-statement.pdf",
    description: "Technical architecture and technology stack powering the All Is Well digital health dashboard.",
  },
];

function Documentation() {
  return (
    <WidgetShell title="Documentation" size="full">
      <div className="space-y-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Project documentation for All Is Well — Your End-to-End Digital Health Dashboard.
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
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{doc.title}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{doc.description}</p>
              <div className="flex items-center gap-2 mt-auto pt-2">
                <a
                  href={`/docs/${doc.filename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-magenta/10 text-magenta hover:bg-magenta/20 transition-colors"
                >
                  <RiEyeLine className="w-3.5 h-3.5" />
                  View
                </a>
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
  );
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <Appearance />
      <Profile />
      <Notifications />
      <Documentation />
    </div>
  );
}
