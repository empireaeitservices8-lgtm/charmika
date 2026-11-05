
import React from 'react';
import Link from 'next/link';
import { Tag, Sparkles, ArrowRight } from 'lucide-react';
import { WooCommerceService } from '@/services/woocommerce';
import { ProductCard } from '@/components/product/ProductCard';

export const ComboOffersSection = async () => {
  const products = await WooCommerceService.getProducts();
  const comboProducts = products.filter((p) => p.isCombo || p.price > 10000).slice(0, 3);

  return (
    <section className="py-16 bg-beige/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold block mb-1">
              Bridal & Festival Packages
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-maroon">
              Grand Combo Collections
            </h2>
          </div>
          <Link
            href="/combos"
            className="mt-3 md:mt-0 text-xs font-bold text-maroon hover:text-gold uppercase tracking-wider flex items-center gap-1 transition-colors"
          >
            View All Combos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {comboProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
