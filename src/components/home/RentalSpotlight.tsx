
import React from 'react';
import Link from 'next/link';
import { Clock, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { WooCommerceService } from '@/services/woocommerce';
import { RentalProductCard } from '@/components/product/RentalProductCard';

export const RentalSpotlight = async () => {
  const products = await WooCommerceService.getProducts();
  const rentalProducts = products.filter((p) => p.isRentalAvailable).slice(0, 4);

  return (
    <section className="py-16 bg-gradient-to-b from-maroon-950 to-maroon-900 text-white relative overflow-hidden border-y border-gold/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
          {/* Info Column */}
          <div className="space-y-6">


            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
              Wear Anti-Tarnish Luxury For Your Special Event
            </h2>

            <p className="text-xs sm:text-sm text-white/80 font-light leading-relaxed">
              From daily wear to special celebrations, <strong className="text-gold">CHARMIKA By Lekshmi</strong> brings you premium anti-tarnish jewellery that shines longer, feels lighter, and adds elegance to every outfit.
            </p>


            <div className="pt-2">
              <Link
                href="/rental"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-maroon-950 font-bold text-xs uppercase tracking-widest rounded-full hover:bg-white transition-all shadow-luxury"
              >
                Shop collection
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Rental Showcase Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rentalProducts.map((product) => (
              <RentalProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
