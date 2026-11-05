
import React from 'react';
import Link from 'next/link';
import { WooCommerceService } from '@/services/woocommerce';
import { ArrowUpRight } from 'lucide-react';

export const CategoryGrid = async () => {
  const categories = await WooCommerceService.getCategories();
  const validCategories = categories.filter((c) => c.slug !== 'uncategorized' && c.count > 0);
  const featuredCategories = validCategories.filter((c) => c.featured).length > 0
    ? validCategories.filter((c) => c.featured)
    : validCategories.slice(0, 8);

  return (
    <section className="py-16 bg-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold block mb-1">
            Curated Collections
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-maroon">
            Explore By Category
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {featuredCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] shadow-xs hover:shadow-luxury transition-all duration-500 border border-gold/20"
            >
              <img
                src={cat.image || '/images/long-haarams.png'}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-95"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/80 via-maroon-950/20 to-transparent group-hover:from-maroon-950/90 transition-colors" />

              <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                <span className="text-[10px] uppercase tracking-wider text-gold font-semibold mb-1">
                  {cat.count} Designs
                </span>

                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold group-hover:text-gold transition-colors">
                    {cat.name}
                  </h3>
                  <div className="p-1.5 rounded-full bg-gold/20 text-gold group-hover:bg-gold group-hover:text-maroon transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
