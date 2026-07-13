"use client";

import { useState, type ReactNode } from "react";

import Sidebar from "@/components/common/Sidebar";
import Topbar from "@/components/common/Topbar";

interface WorkspaceShellProps {
  children: ReactNode;
  userName: string;
}

export default function WorkspaceShell({
  children,
  userName,
}: WorkspaceShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-brand-bg">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="min-h-screen lg:pl-72">
        <Topbar
          userName={userName}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main>{children}</main>
      </div>
    </div>
  );
}