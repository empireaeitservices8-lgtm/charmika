import React from 'react';
import Link from 'next/link';
import { WooCommerceService } from '@/services/woocommerce';
import { ProductCard } from '@/components/product/ProductCard';
import { Tag, Sparkles, ShieldCheck, ChevronRight, ArrowRight, SlidersHorizontal, Gift } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Matching Sets & Combos | Charmika By Lekshmi',
  description: 'Explore curated matching jewellery sets, bridal combos, and pendant pairs from Charmika By Lekshmi. Handcrafted in Kottayam, Kerala.',
};

interface PageProps {
  searchParams?: Promise<{ category?: string }>;
}

export default async function CombosPage({ searchParams }: PageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const activeCategory = resolvedParams?.category ? resolvedParams.category.toLowerCase().trim() : 'all';

  // 1. Fetch real combo products
  const allCombos = await WooCommerceService.getComboProducts();

  // 2. Extract real subcategories from the actual combo products
  const categoryMap = new Map<string, { name: string; slug: string; count: number }>();

  allCombos.forEach((product) => {
    const cats =
      product.categories && product.categories.length > 0
        ? product.categories
        : [{ id: 0, name: product.category, slug: product.categorySlug }];

    cats.forEach((cat) => {
      const slug = cat.slug.toLowerCase();
      if (
        slug !== 'combos' &&
        slug !== 'combo' &&
        slug !== 'uncategorized' &&
        !slug.includes('combo')
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
  const filteredCombos =
    activeCategory === 'all'
      ? allCombos
      : allCombos.filter((p) => {
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
      ? 'All Matching Sets & Combos'
      : subcategories.find((c) => c.slug.toLowerCase() === activeCategory)?.name ||
        activeCategory.replace(/[-_]/g, ' ');

  return (
    <div className="py-10 bg-beige min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center text-xs text-charcoal/60">
          <Link href="/" className="hover:text-gold transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 mx-1" />
          <Link href="/combos" className="hover:text-gold transition-colors">
            Combos
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
              <Gift className="w-3.5 h-3.5" />
              Curated Studio Sets
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
              Matching Sets &amp; Combos
            </h1>

            <p className="text-xs sm:text-sm text-white/80 font-light leading-relaxed">
              Complete matching jewellery sets, pendant combos, and bridal pairs curated to save you time and cost. Handcrafted by master artisans in Kottayam, Kerala.
            </p>

            <div className="flex flex-wrap gap-4 pt-2 text-xs font-medium text-gold">
              <span className="flex items-center gap-1.5">
                <Tag className="w-4 h-4" /> Bundled Savings
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Premium Quality Finish
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Perfect Match Guarantee
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Subcategory Filter Tabs */}
        {subcategories.length > 0 && (
          <div className="mb-8 bg-white p-4 sm:p-5 rounded-2xl border border-gold/25 shadow-xs">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-gold">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filter Sets by Category
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-wrap">
              <Link
                href="/combos"
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                  activeCategory === 'all'
                    ? 'bg-maroon text-white shadow-md border border-gold/30'
                    : 'bg-beige/60 text-charcoal/80 hover:bg-gold/15 hover:text-maroon border border-gold/20'
                }`}
              >
                <span>🎁 All Combos</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    activeCategory === 'all' ? 'bg-gold text-maroon' : 'bg-white text-maroon'
                  }`}
                >
                  {allCombos.length}
                </span>
              </Link>

              {subcategories.map((sub) => {
                const isSelected = activeCategory === sub.slug.toLowerCase();
                return (
                  <Link
                    key={sub.slug}
                    href={`/combos?category=${sub.slug}`}
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
              Showing {filteredCombos.length} matching combo {filteredCombos.length === 1 ? 'set' : 'sets'}.
            </p>
          </div>
          <span className="text-xs font-bold text-maroon bg-white px-3.5 py-1.5 rounded-full border border-gold/30 shadow-xs">
            {filteredCombos.length} {filteredCombos.length === 1 ? 'Set' : 'Sets'}
          </span>
        </div>

        {/* Product Grid or Empty State */}
        {filteredCombos.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 sm:p-16 text-center border border-gold/20 shadow-xs max-w-xl mx-auto my-12">
            <div className="w-16 h-16 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-4 border border-gold/30">
              <Gift className="w-8 h-8 animate-pulse" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-maroon mb-2">
              No Sets In This Category Yet
            </h3>
            <p className="text-xs sm:text-sm text-charcoal/70 leading-relaxed mb-6 font-light">
              We haven't added matching sets under <strong className="text-maroon font-semibold">{activeCategoryName}</strong> yet. You can view all our combo offers or explore the entire catalogue.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/combos"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-maroon text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-gold hover:text-maroon transition-all shadow-md"
              >
                All Combos
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCombos.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
