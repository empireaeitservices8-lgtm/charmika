import React from 'react';
import Link from 'next/link';
import { WooCommerceService } from '@/services/woocommerce';
import { ProductCard } from '@/components/product/ProductCard';
import { Sparkles, ChevronRight, ArrowRight, ShieldCheck, Gem, SlidersHorizontal, Tag } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'New Arrivals | Exclusive Jewellery Designs | Charmika By Lekshmi',
  description: 'Explore the latest handcrafted luxury jewellery arrivals from Charmika By Lekshmi. Fresh bridal haarams, chokers, bangles, and anti-tarnish jewels.',
};

interface PageProps {
  searchParams?: Promise<{ category?: string }>;
}

export default async function NewArrivalsPage({ searchParams }: PageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const activeCategory = resolvedParams?.category ? resolvedParams.category.toLowerCase().trim() : 'all';

  // 1. Fetch all New Arrival products
  const allNewArrivals = await WooCommerceService.getNewArrivalProducts();

  // 2. Dynamically gather real subcategories from the actual products
  const categoryMap = new Map<string, { name: string; slug: string; count: number }>();

  allNewArrivals.forEach((product) => {
    const cats =
      product.categories && product.categories.length > 0
        ? product.categories
        : [{ id: 0, name: product.category, slug: product.categorySlug }];

    cats.forEach((cat) => {
      const slug = cat.slug.toLowerCase();
      // Skip the generic new arrivals and uncategorized identifiers
      if (
        slug !== 'new-arrivals' &&
        slug !== 'new-arrival' &&
        slug !== 'uncategorized' &&
        !slug.includes('new-arrival')
      ) {
        const existing = categoryMap.get(slug);
        if (existing) {
          existing.count += 1;
        } else {
          categoryMap.set(slug, {
            name: cat.name,
            slug: cat.slug,
            count: 1,
          });
        }
      }
    });
  });

  const subcategories = Array.from(categoryMap.values()).sort((a, b) => b.count - a.count);

  // 3. Filter products based on selected subcategory
  const filteredProducts =
    activeCategory === 'all'
      ? allNewArrivals
      : allNewArrivals.filter((p) => {
          const catClean = activeCategory.replace(/[-_]/g, '');
          return (
            p.categorySlug.toLowerCase() === activeCategory ||
            p.categorySlug.toLowerCase().replace(/[-_]/g, '') === catClean ||
            p.categorySlugs?.some(
              (s) => s.toLowerCase() === activeCategory || s.toLowerCase().replace(/[-_]/g, '') === catClean
            ) ||
            p.categories?.some(
              (c) =>
                c.slug.toLowerCase() === activeCategory ||
                c.name.toLowerCase() === activeCategory ||
                c.slug.toLowerCase().replace(/[-_]/g, '') === catClean
            )
          );
        });

  const activeCategoryName =
    activeCategory === 'all'
      ? 'All New Arrivals'
      : subcategories.find((c) => c.slug.toLowerCase() === activeCategory)?.name ||
        activeCategory.replace(/[-_]/g, ' ');

  return (
    <div className="py-10 bg-beige min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Header */}
        <div className="mb-6 flex items-center text-xs text-charcoal/60">
          <Link href="/" className="hover:text-gold transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 mx-1" />
          <Link href="/new-arrivals" className="hover:text-gold transition-colors">
            New Arrivals
          </Link>
          {activeCategory !== 'all' && (
            <>
              <ChevronRight className="w-3.5 h-3.5 mx-1" />
              <span className="font-semibold text-maroon capitalize">{activeCategoryName}</span>
            </>
          )}
        </div>

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-maroon-950 via-maroon-900 to-maroon-950 text-white rounded-3xl p-8 sm:p-12 border border-gold/30 shadow-luxury mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-2xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/20 rounded-full text-gold text-xs font-semibold uppercase tracking-wider border border-gold/40">
              <Sparkles className="w-3.5 h-3.5" />
              Latest Studio Additions
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
              Exclusive New Arrivals
            </h1>

            <p className="text-xs sm:text-sm text-white/80 font-light leading-relaxed">
              Discover our newest handcrafted masterpieces. From authentic antique gold-plated nakshi haarams to modern anti-tarnish daily essentials, curated by Lekshmi.
            </p>

            <div className="flex flex-wrap gap-4 pt-2 text-xs font-medium text-gold">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> 100% Quality Guaranteed
              </span>
              <span className="flex items-center gap-1.5">
                <Gem className="w-4 h-4" /> Handcrafted In Kerala
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Fresh Studio Drops
              </span>
            </div>
          </div>
        </div>

        {/* Real Dynamic Subcategory Filter Tabs */}
        {subcategories.length > 0 && (
          <div className="mb-8 bg-white p-4 sm:p-5 rounded-2xl border border-gold/25 shadow-xs">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-gold">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filter New Arrivals by Category
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-wrap">
              <Link
                href="/new-arrivals"
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                  activeCategory === 'all'
                    ? 'bg-maroon text-white shadow-md border border-gold/30'
                    : 'bg-beige/60 text-charcoal/80 hover:bg-gold/15 hover:text-maroon border border-gold/20'
                }`}
              >
                <span>✨ All New Arrivals</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    activeCategory === 'all' ? 'bg-gold text-maroon' : 'bg-white text-maroon'
                  }`}
                >
                  {allNewArrivals.length}
                </span>
              </Link>

              {subcategories.map((sub) => {
                const isSelected = activeCategory === sub.slug.toLowerCase();
                return (
                  <Link
                    key={sub.slug}
                    href={`/new-arrivals?category=${sub.slug}`}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-maroon text-white shadow-md border border-gold/30'
                        : 'bg-beige/60 text-charcoal/80 hover:bg-gold/15 hover:text-maroon border border-gold/20'
                    }`}
                  >
                    <span>💎 {sub.name}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isSelected ? 'bg-gold text-maroon' : 'bg-white text-maroon'
                      }`}
                    >
                      {sub.count}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Header & Product Count */}
        <div className="flex justify-between items-center pb-4 mb-8 border-b border-gold/20">
          <div>
            <h2 className="font-serif text-2xl font-bold text-maroon">
              {activeCategoryName}
            </h2>
            <p className="text-xs text-charcoal/60 mt-1">
              Showing {filteredProducts.length} new arrival {filteredProducts.length === 1 ? 'design' : 'designs'} handcrafted for royalty.
            </p>
          </div>
          <span className="text-xs font-bold text-maroon bg-white px-3.5 py-1.5 rounded-full border border-gold/30 shadow-xs">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'Design' : 'Designs'}
          </span>
        </div>

        {/* Product Grid or Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 sm:p-16 text-center border border-gold/20 shadow-xs max-w-xl mx-auto my-12">
            <div className="w-16 h-16 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-4 border border-gold/30">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-maroon mb-2">
              No Designs In This Category Yet
            </h3>
            <p className="text-xs sm:text-sm text-charcoal/70 leading-relaxed mb-6 font-light">
              We haven't added new arrival pieces under <strong className="text-maroon font-semibold">{activeCategoryName}</strong> yet. You can view all our fresh arrivals or browse the full jewellery catalogue.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/new-arrivals"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-maroon text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-gold hover:text-maroon transition-all shadow-md"
              >
                All New Arrivals
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-maroon border border-gold/30 text-xs font-bold uppercase tracking-widest rounded-full hover:bg-gold/10 transition-all shadow-xs"
              >
                Explore Catalogue
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
