"use client";

import { Suspense, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { authService } from "@/lib/services/auth.service";

function PanelContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const isLoginPage = pathname === "/admin/login" || pathname === "/login";

  useEffect(() => {
    if (isLoginPage) {
      setAuthChecked(true);
      return;
    }

    authService
      .getMe()
      .then(() => {
        setAuthChecked(true);
      })
      .catch(() => {
        router.replace("/admin/login");
      });
  }, [isLoginPage, pathname, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-beige text-xs font-semibold text-maroon">
        Verifying administrator session...
      </div>
    );
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
