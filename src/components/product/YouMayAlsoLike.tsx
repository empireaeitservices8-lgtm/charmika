'use client';

import React, { useRef } from 'react';
import { Product } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface YouMayAlsoLikeProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export const YouMayAlsoLike: React.FC<YouMayAlsoLikeProps> = ({
  products,
  title = 'Products You May Like',
  subtitle = 'Handpicked luxury pieces curated for your elegant style',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="mt-16 pt-10 border-t border-gold/20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Recommended For You
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-maroon">
            {title}
          </h2>
          <p className="text-xs text-charcoal/60 mt-1 font-light">
            {subtitle}
          </p>
        </div>

        {/* Horizontal Scroll Navigation Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => handleScroll('left')}
            className="p-2.5 rounded-full border border-gold/30 bg-white text-maroon hover:bg-gold hover:text-maroon transition-all shadow-xs active:scale-95 cursor-pointer"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="p-2.5 rounded-full border border-gold/30 bg-white text-maroon hover:bg-gold hover:text-maroon transition-all shadow-xs active:scale-95 cursor-pointer"
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrolling Track */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth pb-6 pt-2 px-1 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[270px] sm:w-[300px] md:w-[320px] shrink-0 snap-start"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};
