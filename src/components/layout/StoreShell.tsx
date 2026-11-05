"use client";

import { usePathname } from 'next/navigation';
import { TopBanner } from '@/components/layout/TopBanner';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { QuickViewModal } from '@/components/product/QuickViewModal';
import { AuthModal } from '@/components/account/AuthModal';
import { WhatsAppFloat } from '@/components/common/WhatsAppFloat';
import { BackToTop } from '@/components/common/BackToTop';
import { Preloader } from '@/components/common/Preloader';

interface StoreShellProps {
  children: React.ReactNode;
  categories: any[];
  combos: any[];
}

export function StoreShell({ children, categories, combos }: StoreShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <main className="min-h-screen bg-beige">{children}</main>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-beige">
      <TopBanner />
      <Navbar categories={categories} combos={combos} />
      <main className="flex-1">{children}</main>
      <Footer categories={categories} />

      {/* Drawers & Floating Action Overlays */}
      <Preloader />
      <CartDrawer />
      <QuickViewModal />
      <AuthModal />
      <WhatsAppFloat />
      <BackToTop />
    </div>
  );
}

