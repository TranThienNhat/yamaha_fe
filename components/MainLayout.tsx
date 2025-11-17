"use client";

import { useState } from "react";
import MainHeader from "@/components/layout/MainHeader";
import MainSidebar from "@/components/layout/MainSidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleMenuClick = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f9f9f9" }}>
      {/* Fixed Header */}
      <MainHeader onMenuClick={handleMenuClick} />

      {/* Fixed Sidebar */}
      <MainSidebar collapsed={sidebarCollapsed} />

      {/* Main Content Area */}
      <main
        style={{
          marginTop: 56,
          marginLeft: sidebarCollapsed ? 72 : 240,
          minHeight: "calc(100vh - 56px)",
          background: "#f9f9f9",
          transition: "margin-left 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          padding: "24px",
        }}>
        <div
          style={{
            maxWidth: 1600,
            margin: "0 auto",
          }}>
          {children}
        </div>
      </main>
    </div>
  );
}
