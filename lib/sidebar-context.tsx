"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface SidebarContextValue {
  isOpen: boolean;
  collapsed: boolean;
  toggle: () => void;
  close: () => void;
  toggleCollapse: () => void;
}

const SidebarCtx = createContext<SidebarContextValue>({
  isOpen: false,
  collapsed: false,
  toggle: () => {},
  close: () => {},
  toggleCollapse: () => {},
});

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  return (
    <SidebarCtx.Provider
      value={{
        isOpen,
        collapsed,
        toggle: () => setIsOpen((v) => !v),
        close: () => setIsOpen(false),
        toggleCollapse: () => setCollapsed((v) => !v),
      }}
    >
      {children}
    </SidebarCtx.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarCtx);
}
