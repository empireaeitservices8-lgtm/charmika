
import React from 'react';
import Link from 'next/link';
import { WooCommerceService } from '@/services/woocommerce';
import { ProductCard } from '@/components/product/ProductCard';
import { Sparkles, ArrowRight } from 'lucide-react';

export const BestSellersSection = async () => {
  const products = await WooCommerceService.getProducts();
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold flex items-center justify-center gap-1 mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Most Loved By Our Customers
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-maroon">
            Best Sellers & New Arrivals
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 bg-maroon text-white font-bold text-xs uppercase tracking-widest rounded-full hover:bg-gold hover:text-maroon transition-all shadow-md"
          >
            Explore Complete Catalogue
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
