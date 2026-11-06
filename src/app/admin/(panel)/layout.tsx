"use client";

import { Suspense, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";

function PanelContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (pathname === "/admin/login" || pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-beige">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="mx-auto max-w-7xl p-6 sm:p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-beige p-6" />}>
      <PanelContent>{children}</PanelContent>
    </Suspense>
  );
}
