"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FolderTree,
  UserCircle,
  ShoppingBag,
  Users,
  LogOut,
  X,
  ExternalLink,
} from "lucide-react";
import { authService } from "@/lib/services/auth.service";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Add Product", href: "/admin/products/add", icon: PlusCircle },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Profile", href: "/admin/profile", icon: UserCircle },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin/products") {
    return pathname === href || pathname.startsWith("/admin/products/edit");
  }
  if (href === "/admin/orders") {
    return pathname === href || pathname.startsWith("/admin/orders/");
  }
  if (href === "/admin/customers") {
    return pathname === href || pathname.startsWith("/admin/customers/");
  }
  return pathname === href;
}

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const pathname = usePathname();

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

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gold/20 bg-gradient-to-b from-maroon-900 to-maroon-950 text-white transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between border-b border-gold/20 px-6 py-6">
          <div>
            <span className="block font-serif text-xl font-bold tracking-[0.25em] text-gold">
              CHARMIKA
            </span>
            <span className="mt-0.5 block text-[10px] uppercase tracking-[0.3em] text-white/60">
              By Lekshmi · Admin
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-gold lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-lg border-l-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive(pathname, href)
                  ? "border-gold bg-gold/15 text-gold"
                  : "border-transparent text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="border-t border-gold/20 p-3 space-y-1">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-gold hover:bg-gold/10 transition-colors"
          >
            <span className="flex items-center gap-3">
              <ExternalLink className="h-4 w-4" />
              View Storefront
            </span>
            <span className="text-[10px] uppercase tracking-wider bg-gold/20 text-gold px-1.5 py-0.5 rounded">
              Live
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
