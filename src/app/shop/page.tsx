'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { WooCommerceService } from '@/services/woocommerce';
import { Product, Category } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { Filter, SlidersHorizontal, ChevronRight, X, RotateCcw } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSort = searchParams.get('sort') || 'popularity';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort);
  const [jewelleryType, setJewelleryType] = useState('all');
  const [rentalOnly, setRentalOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(30000);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const urlCat = searchParams.get('category') || 'all';
    const urlSort = searchParams.get('sort') || 'popularity';
    setCategory(urlCat);
    setSort(urlSort);
  }, [searchParams]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        WooCommerceService.getProducts({
          category: category !== 'all' ? category : undefined,
          sort,
          type: jewelleryType !== 'all' ? jewelleryType : undefined,
          rentalOnly,
          maxPrice,
          search: initialSearch,
        }),
        WooCommerceService.getCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setLoading(false);
    }
    load();
  }, [category, sort, jewelleryType, rentalOnly, maxPrice, initialSearch]);

  const resetFilters = () => {
    setCategory('all');
    setSort('popularity');
    setJewelleryType('all');
    setRentalOnly(false);
    setMaxPrice(30000);
  };

  return (
    <div className="py-10 bg-beige min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Header */}
        <div className="mb-6 flex items-center text-xs text-charcoal/60">
          <span>Home</span>
          <ChevronRight className="w-3.5 h-3.5 mx-1" />
          <span className="font-semibold text-maroon">Shop Jewellery</span>
          {category !== 'all' && (
            <>
              <ChevronRight className="w-3.5 h-3.5 mx-1" />
              <span className="capitalize text-gold font-bold">{category.replace('-', ' ')}</span>
            </>
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 mb-8 border-b border-gold/20 gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-maroon">
              {category === 'all'
                ? 'Luxury Jewellery Catalogue'
                : categories.find((c) => c.slug === category)?.name ||
                  (category === 'new-arrivals' ? 'New Arrivals Collection' : category.replace(/-/g, ' '))}
            </h1>
            <p className="text-xs text-charcoal/70 mt-1">
              Showing {products.length} exquisite designs handcrafted for royalty.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gold/30 text-xs font-semibold text-maroon"
            >
              <Filter className="w-4 h-4 text-gold" /> Filter & Sort
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-charcoal/70 font-medium">Sort By:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-3 py-2 bg-white border border-gold/30 rounded-lg text-xs font-semibold text-maroon focus:outline-none focus:border-gold"
              >
                <option value="popularity">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block space-y-6 bg-white p-6 rounded-2xl border border-gold/20 shadow-xs h-fit">
            <div className="flex justify-between items-center pb-3 border-b border-gold/20">
              <h3 className="font-serif text-base font-bold text-maroon flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-gold" /> Filters
              </h3>
              <button
                onClick={resetFilters}
                className="text-xs text-gold hover:text-maroon font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Categories Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gold mb-3">Categories</h4>
              <div className="space-y-1.5 text-xs">
                <button
                  onClick={() => setCategory('all')}
                  className={`w-full text-left px-2.5 py-1.5 rounded transition-colors ${
                    category === 'all' ? 'bg-maroon text-white font-bold' : 'text-charcoal/80 hover:bg-beige'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.slug)}
                    className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex justify-between ${
                      category === cat.slug ? 'bg-maroon text-white font-bold' : 'text-charcoal/80 hover:bg-beige'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] opacity-70">({cat.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Purpose Filter (Rental vs Buy) */}
            <div className="pt-4 border-t border-gold/15">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gold mb-3">Service Type</h4>
              <label className="flex items-center gap-2 text-xs font-medium text-charcoal cursor-pointer">
                <input
                  type="checkbox"
                  checked={rentalOnly}
                  onChange={(e) => setRentalOnly(e.target.checked)}
                  className="rounded text-gold focus:ring-gold"
                />
                Show Rental Available Only
              </label>
            </div>

            {/* Jewellery Type Filter */}
            <div className="pt-4 border-t border-gold/15">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gold mb-3">Jewellery Type</h4>
              <select
                value={jewelleryType}
                onChange={(e) => setJewelleryType(e.target.value)}
                className="w-full px-3 py-2 bg-beige border border-gold/30 rounded text-xs text-charcoal focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="Temple Jewellery">Temple Jewellery</option>
                <option value="AD Stone">AD Stone / CZ</option>
                <option value="Anti Tarnish">Anti Tarnish</option>
                <option value="Gold Plated">Gold Plated</option>
                <option value="Kundan">Kundan & Meenakari</option>
              </select>
            </div>

            {/* Price Filter */}
            <div className="pt-4 border-t border-gold/15">
              <div className="flex justify-between text-xs font-bold text-maroon mb-2">
                <span>Max Price:</span>
                <span>₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="35000"
                step="1000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-gold cursor-pointer"
              />
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-80 bg-white/60 animate-pulse rounded-xl border border-gold/10" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-gold/20">
                <p className="font-serif text-lg text-maroon font-bold">No products match your active filters.</p>
                <p className="text-xs text-charcoal/60 mt-1">Try resetting your price or category selection.</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-6 py-2 bg-gold text-maroon font-bold text-xs rounded-full hover:bg-maroon hover:text-white transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-maroon font-serif">Loading Catalogue...</div>}>
      <ShopContent />
    </Suspense>
  );
}
