"use client";

import Sidebar from "@/components/layout/Sidebar";
import { CustomerProvider } from "@/lib/customer-context";
import { SidebarProvider } from "@/lib/sidebar-context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <CustomerProvider>
      <SidebarProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-[#111118]">
          <Sidebar />
          <div className="lg:ml-[260px]">
            {children}
          </div>
        </div>
      </SidebarProvider>
    </CustomerProvider>
  );
}
