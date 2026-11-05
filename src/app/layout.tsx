import type { Metadata } from 'next';
import '@/styles/globals.css';
import { StoreShell } from '@/components/layout/StoreShell';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { AuthProvider } from '@/context/AuthContext';
import { QuickViewProvider } from '@/context/QuickViewContext';
import { ToastProvider } from '@/context/ToastContext';
import { WooCommerceService } from '@/services/woocommerce';

export const metadata: Metadata = {
  title: 'CHARMIKA By Lekshmi | Premium Luxury Jewellery & Rental Store',
  description:
    'Handcrafted Temple Nakshi Haarams, Chokers, AD Stone Jewellery & Exclusive Rental Jewellery for Weddings & Events in Kottayam, Kerala.',
  keywords: [
    'Charmika By Lekshmi',
    'Luxury Jewellery Kerala',
    'Rental Jewellery Kottayam',
    'Temple Jewellery',
    'AD Stone Chokers',
    'Long Haarams',
    'Bridal Jewellery Rental',
    'Anti Tarnish Jewellery',
  ],
  authors: [{ name: 'Lekshmi D.S' }],
  openGraph: {
    title: 'CHARMIKA By Lekshmi | Luxury Jewellery',
    description: 'Elegance That Tells Your Story',
    type: 'website',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [categories, combos] = await Promise.all([
    WooCommerceService.getCategories(),
    WooCommerceService.getComboProducts(),
  ]);

  return (
    <html lang="en">
      <body className="antialiased selection:bg-gold selection:text-maroon">
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <QuickViewProvider>
                  <StoreShell categories={categories} combos={combos}>
                    {children}
                  </StoreShell>
                </QuickViewProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
