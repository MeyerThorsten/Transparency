"use client";

import Sidebar from "@/components/layout/Sidebar";
import NotificationPanel from "@/components/layout/NotificationPanel";
import { CustomerProvider } from "@/lib/customer-context";
import { SidebarProvider, useSidebar } from "@/lib/sidebar-context";
import { RefreshProvider } from "@/lib/refresh-context";
import { NotificationProvider } from "@/lib/notification-context";

function ContentArea({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();
  return (
    <div
      className={`transition-[margin] duration-200 ${collapsed ? "lg:ml-[68px]" : "lg:ml-[260px]"}`}
    >
      {children}
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RefreshProvider>
      <NotificationProvider>
        <CustomerProvider>
          <SidebarProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-[#111118]">
              <Sidebar />
              <ContentArea>{children}</ContentArea>
              <NotificationPanel />
            </div>
          </SidebarProvider>
        </CustomerProvider>
      </NotificationProvider>
    </RefreshProvider>
  );
}
