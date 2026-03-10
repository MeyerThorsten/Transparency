"use client";

import { useNotifications } from "@/lib/notification-context";
import { Notification } from "@/types/notification";
import { RiCloseLine, RiCheckboxCircleLine } from "@remixicon/react";

function getRelativeTime(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "1d ago";
  return `${diffDays}d ago`;
}

function getBorderClass(type: Notification["type"]): string {
  switch (type) {
    case "critical": return "border-l-4 border-red-500";
    case "warning": return "border-l-4 border-amber-500";
    case "info": return "border-l-4 border-blue-500";
    case "system": return "border-l-4 border-gray-400";
    default: return "border-l-4 border-gray-400";
  }
}

export default function NotificationPanel() {
  const { notifications, readIds, markAsRead, markAllAsRead, isOpen, togglePanel } = useNotifications();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[35] bg-black/40"
          onClick={togglePanel}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-96 z-40 bg-white dark:bg-[#1C1C27] shadow-2xl flex flex-col transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Notifications panel"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-[#2E2E3D] shrink-0">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Notifications
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={markAllAsRead}
              className="text-sm font-medium text-magenta hover:text-magenta/80 transition-colors"
            >
              Mark all as read
            </button>
            <button
              onClick={togglePanel}
              className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
              aria-label="Close notifications"
            >
              <RiCloseLine className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400 dark:text-gray-500">
              <RiCheckboxCircleLine className="w-12 h-12" />
              <p className="text-sm font-medium">All caught up!</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-[#2E2E3D]">
              {notifications.map((notification) => {
                const isRead = readIds.has(notification.id);
                return (
                  <li key={notification.id}>
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className={`w-full text-left px-5 py-4 flex gap-3 transition-colors ${
                        isRead
                          ? "bg-white dark:bg-[#1C1C27] hover:bg-gray-50 dark:hover:bg-[#22222F]"
                          : "bg-blue-50/40 dark:bg-[#1E2030] hover:bg-blue-50/70 dark:hover:bg-[#222338]"
                      }`}
                    >
                      {/* Color border strip */}
                      <div className={`self-stretch w-0 ${getBorderClass(notification.type)} rounded-sm shrink-0`} />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-medium leading-snug ${
                            isRead
                              ? "text-gray-600 dark:text-gray-400"
                              : "text-gray-900 dark:text-gray-100"
                          }`}>
                            {notification.title}
                          </p>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                              {getRelativeTime(notification.timestamp)}
                            </span>
                            {!isRead && (
                              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" aria-label="Unread" />
                            )}
                          </div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                          {notification.message}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
