"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, ChevronRight, ChevronDown, UserCircle, LogOut } from "lucide-react";
import { authService, type AdminUser } from "@/lib/services/auth.service";

function getTitle(pathname: string) {
  if (pathname.startsWith("/admin/products/edit")) return "Edit Product";
  if (pathname.startsWith("/admin/orders/")) return "Order Details";
  if (pathname.startsWith("/admin/customers/")) return "Customer Details";
  const titles: Record<string, string> = {
    "/admin/dashboard": "Dashboard",
    "/admin/orders": "Orders",
    "/admin/customers": "Customers",
    "/admin/products": "Products",
    "/admin/products/add": "Add Product",
    "/admin/categories": "Categories",
    "/admin/profile": "Profile",
  };
  return titles[pathname] ?? "Admin";
}

function getCrumbs(pathname: string, title: string) {
  const crumbs = ["Admin"];
  if (pathname === "/admin/products/add" || pathname.startsWith("/admin/products/edit")) {
    crumbs.push("Products");
  } else if (pathname.startsWith("/admin/orders/")) {
    crumbs.push("Orders");
  } else if (pathname.startsWith("/admin/customers/")) {
    crumbs.push("Customers");
  }
  crumbs.push(title);
  return crumbs;
}

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  const title = getTitle(pathname);
  const crumbs = getCrumbs(pathname, title);

  useEffect(() => {
    authService
      .getMe()
      .then(setAdmin)
      .catch(() => {
        if (pathname !== "/login" && pathname !== "/admin/login") {
          router.push("/admin/login");
        }
      });
  }, [pathname, router]);

  async function handleLogout() {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("charmika_token");
      }
      router.push("/admin/login");
    }
  }

  const initial = admin?.name ? admin.name.charAt(0).toUpperCase() : "A";
  const adminName = admin?.name || "Admin";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gold/20 bg-white/90 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-maroon hover:bg-beige lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <div className="flex items-center gap-1 text-[11px] text-charcoal/50">
            {crumbs.map((crumb, i) => (
              <span key={crumb + i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3 w-3" />}
                <span className={i === crumbs.length - 1 ? "font-semibold text-maroon" : ""}>
                  {crumb}
                </span>
              </span>
            ))}
          </div>
          <h2 className="font-serif text-lg font-bold leading-tight text-maroon">{title}</h2>
        </div>
      </div>

      {/* Profile dropdown */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-beige"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-maroon text-xs font-bold text-gold">
            {initial}
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-xs font-semibold text-charcoal">{adminName}</span>
            <span className="block text-[10px] text-charcoal/50">Administrator</span>
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-charcoal/50" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gold/20 bg-white py-1 shadow-luxury">
            <Link
              href="/admin/profile"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-charcoal hover:bg-beige"
            >
              <UserCircle className="h-4 w-4 text-maroon" /> My Profile
            </Link>
            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-xs font-medium text-charcoal hover:bg-beige"
            >
              <LogOut className="h-4 w-4 text-maroon" /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
