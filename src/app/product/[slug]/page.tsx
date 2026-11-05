'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { WooCommerceService } from '@/services/woocommerce';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { ProductCard } from '@/components/product/ProductCard';
import { YouMayAlsoLike } from '@/components/product/YouMayAlsoLike';
import {
  Star,
  ShoppingBag,
  Heart,
  Clock,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Share2,
  ChevronRight,
  MessageSquare,
  Zap,
  Sparkles,
  Gem,
  MessageCircle,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [selectedMode, setSelectedMode] = useState<'buy' | 'rent'>('buy');
  const [rentalDays, setRentalDays] = useState(3);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'care' | 'shipping'>('desc');

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isRental = Boolean(
    product &&
      (product.isRentalAvailable ||
        product.categorySlug?.toLowerCase().includes('rental') ||
        product.categorySlugs?.some((s) => s.toLowerCase().includes('rental') || s.toLowerCase() === 'rent') ||
        product.categories?.some(
          (c) => c.slug.toLowerCase().includes('rental') || c.name.toLowerCase().includes('rental') || c.slug.toLowerCase() === 'rent'
        ))
  );

  useEffect(() => {
    if (isRental) {
      setSelectedMode('rent');
    }
  }, [isRental]);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      const data = await WooCommerceService.getProductBySlug(slug);
      setProduct(data);
      if (data) {
        const related = await WooCommerceService.getProducts({ category: data.categorySlug });
        let filteredRelated = related.filter((p) => p.id !== data.id);
        
        if (filteredRelated.length < 6) {
          const allProducts = await WooCommerceService.getProducts();
          const extra = allProducts.filter(
            (p) => p.id !== data.id && !filteredRelated.some((r) => r.id === p.id)
          );
          filteredRelated = [...filteredRelated, ...extra];
        }
        setRelatedProducts(filteredRelated);
      }
      setLoading(false);
    }
    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-32 bg-beige min-h-screen flex flex-col items-center justify-center text-center text-maroon font-serif">
        <Gem className="w-12 h-12 text-gold animate-bounce mb-4" />
        <h2 className="text-2xl font-bold animate-pulse">Preparing Luxury Piece...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-32 bg-beige min-h-screen flex flex-col items-center justify-center text-center">
        <Gem className="w-16 h-16 text-gold/50 mb-4" />
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon mb-2">Product Not Found</h2>
        <p className="text-sm text-charcoal/60 mb-6">The exquisite piece you are looking for is unavailable.</p>
        <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-3 bg-maroon text-white font-bold text-xs uppercase tracking-widest rounded-full hover:bg-gold hover:text-maroon transition-all shadow-luxury">
          Return to Catalogue <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (selectedMode === 'rent') {
      addToCart(product, true, rentalDays);
    } else {
      addToCart(product, false);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  return (
    <div className="py-10 bg-beige min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="mb-8 flex items-center text-[11px] font-semibold tracking-wider uppercase text-charcoal/50">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 mx-2 text-gold/40" />
          <Link href="/shop" className="hover:text-gold transition-colors">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5 mx-2 text-gold/40" />
          <Link href={`/shop?category=${product.categorySlug}`} className="hover:text-gold transition-colors">{product.category}</Link>
          <ChevronRight className="w-3.5 h-3.5 mx-2 text-gold/40" />
          <span className="text-maroon truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-6 sm:p-10 lg:p-12 rounded-[2rem] border border-gold/20 shadow-luxury">
          {/* Gallery Column */}
          <div className="space-y-6">
            <div className="relative aspect-square rounded-3xl overflow-hidden border border-gold/20 bg-beige/30 group shadow-sm">
              <img
                src={product.images[selectedImgIndex]?.src || product.images[0].src}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-5 right-5 p-3.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-md ${
                  isWishlisted ? 'bg-maroon text-gold scale-110' : 'bg-white/90 text-charcoal hover:bg-gold hover:text-maroon hover:scale-110'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-gold' : ''}`} />
              </button>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImgIndex(idx)}
                    className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 shrink-0 ${
                      selectedImgIndex === idx ? 'border-maroon scale-105 shadow-md' : 'border-transparent hover:border-gold/50 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Column */}
          <div className="flex flex-col justify-between space-y-8">
            <div>
              {/* Badges & SKU */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold mb-4">
                <div className="flex flex-wrap items-center gap-2">
                  {product.categories && product.categories.length > 0 ? (
                    product.categories
                      .filter((c) => c.slug !== 'uncategorized')
                      .map((cat) => (
                        <Link
                          key={cat.id || cat.slug}
                          href={
                            cat.slug.toLowerCase().includes('rental') || cat.slug.toLowerCase() === 'rent'
                              ? '/rental'
                              : `/shop?category=${cat.slug}`
                          }
                          className={`px-3 py-1 rounded-full uppercase tracking-widest text-[10px] font-bold border transition-colors ${
                            cat.slug.toLowerCase().includes('rental') || cat.slug.toLowerCase() === 'rent'
                              ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                              : 'bg-gold/10 text-gold border-gold/25 hover:bg-gold/20'
                          }`}
                        >
                          {cat.name}
                        </Link>
                      ))
                  ) : (
                    <span className="px-3 py-1 bg-gold/10 text-gold rounded-full border border-gold/20 uppercase tracking-widest text-[10px]">
                      {product.category}
                    </span>
                  )}
                  {isRental && (
                    <span className="px-3 py-1 bg-amber-600/15 text-amber-800 rounded-full border border-amber-600/30 uppercase tracking-widest text-[10px] font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Exclusive Rental
                    </span>
                  )}
                  {product.isNew && (
                    <span className="px-3 py-1 bg-maroon/10 text-maroon rounded-full border border-maroon/20 uppercase tracking-widest text-[10px] flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> New Arrival
                    </span>
                  )}
                  {product.isCombo && (
                    <span className="px-3 py-1 bg-rose-700/10 text-rose-800 rounded-full border border-rose-700/20 uppercase tracking-widest text-[10px] flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Combo Set
                    </span>
                  )}
                </div>
                <span className="text-charcoal/40 tracking-wider">SKU: {product.sku}</span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-maroon leading-[1.15] tracking-tight">
                {product.name}
              </h1>

              {/* Reviews Preview */}
              <div className="flex items-center gap-2 mt-4 text-xs font-medium text-charcoal/70">
                <div className="flex items-center text-gold">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="pt-0.5 border-b border-gold/40 hover:text-maroon transition-colors cursor-pointer">({product.reviewCount || 12} Customer Reviews)</span>
              </div>

              {/* Short Description */}
              {(product.shortDescription || product.description) && (
                <p className="mt-6 text-sm text-charcoal/70 leading-relaxed font-light border-l-2 border-gold/50 pl-4 italic">
                  {product.shortDescription || product.description.substring(0, 150)}...
                </p>
              )}

              {/* Purchase / Rental Mode Toggle: only if NOT rental-only */}
              {!isRental && product.isRentalAvailable && (
                <div className="mt-8 p-1 bg-beige rounded-xl inline-flex border border-gold/20 shadow-inner">
                  <button
                    onClick={() => setSelectedMode('buy')}
                    className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                      selectedMode === 'buy' ? 'bg-white text-maroon shadow-sm' : 'text-charcoal/50 hover:text-maroon'
                    }`}
                  >
                    Purchase Item
                  </button>
                  <button
                    onClick={() => setSelectedMode('rent')}
                    className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                      selectedMode === 'rent' ? 'bg-white text-maroon shadow-sm' : 'text-charcoal/50 hover:text-maroon'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" /> Rent Item
                  </button>
                </div>
              )}

              {/* Price Container */}
              <div className="mt-8 p-6 sm:p-8 bg-gradient-to-br from-beige/50 to-white rounded-3xl border border-gold/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
                   <Gem className="w-48 h-48" />
                </div>

                <div className="relative z-10">
                  {isRental ? (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-2.5 py-1 rounded-md border border-amber-200">
                          Rental Fee ({rentalDays} Days)
                        </span>
                        <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                          ₹{(product.rentalPricePerDay || product.price || 500).toLocaleString('en-IN')}/day
                        </span>
                      </div>
                      <div className="flex items-baseline gap-3">
                        <span className="font-serif font-bold text-4xl sm:text-5xl text-maroon">
                          ₹{((product.rentalPricePerDay || product.price || 500) * rentalDays).toLocaleString('en-IN')}
                        </span>
                        <span className="text-sm text-charcoal/60 font-medium">for {rentalDays} days rental</span>
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-xs text-charcoal/70 bg-gold/10 px-4 py-2.5 rounded-xl inline-flex border border-gold/20">
                         <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
                         Refundable Security Deposit: <strong className="text-maroon">₹{(product.securityDeposit || Math.round((product.price || 5000) * 0.3)).toLocaleString('en-IN')}</strong>
                      </div>
                      <p className="mt-3 text-[11px] text-amber-800 bg-amber-50/80 p-3 rounded-xl border border-amber-200/70 font-medium leading-relaxed">
                        ✦ <strong>Rental Exclusive:</strong> Online cart and direct purchase are disabled for rental designs. Contact our bridal concierge on WhatsApp to verify date availability and confirm booking.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest mb-1.5">Purchase Price</div>
                      <div className="flex items-baseline gap-4">
                        <span className="font-serif font-bold text-4xl sm:text-5xl text-maroon">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.regularPrice > product.price && (
                          <span className="text-lg text-charcoal/40 line-through font-serif">
                            ₹{product.regularPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      {product.regularPrice > product.price && (
                        <div className="mt-3 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 inline-block px-2.5 py-1 rounded-md shadow-xs">
                          Save ₹{(product.regularPrice - product.price).toLocaleString('en-IN')} ({Math.round(((product.regularPrice - product.price) / product.regularPrice) * 100)}% OFF)
                        </div>
                      )}
                    </div>
                  )}

                  {/* Stock Status */}
                  <div className="mt-6 pt-5 border-t border-gold/15">
                    {product.stockStatus === 'outofstock' ? (
                      <p className="text-[11px] text-rose-600 font-bold uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-600 shadow-[0_0_8px_rgba(225,29,72,0.6)]" /> Out of Stock — Currently Unavailable
                      </p>
                    ) : (
                      <p className="text-[11px] text-emerald-700 font-bold uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" /> In Stock • Ready to {isRental ? 'Rent' : 'Ship'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Rental Days Selector */}
              {isRental && (
                <div className="mt-8 space-y-3">
                   <div className="text-xs font-bold text-charcoal uppercase tracking-widest">Select Rental Duration:</div>
                   <div className="flex flex-wrap gap-2">
                     {[1, 2, 3, 5, 7].map((days) => (
                       <button
                         key={days}
                         onClick={() => setRentalDays(days)}
                         className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                           rentalDays === days
                             ? 'bg-maroon text-white border-maroon shadow-sm'
                             : 'bg-white text-charcoal border-gold/30 hover:border-gold hover:bg-beige/50'
                         }`}
                       >
                         {days} {days === 1 ? 'Day' : 'Days'}
                       </button>
                     ))}
                   </div>
                </div>
              )}
            </div>

            {/* Action Buttons: Never allow buying rental products! */}
            <div className="space-y-4 pt-6">
              {isRental ? (
                <a
                  href={`https://wa.me/919400976257?text=${encodeURIComponent(
                    `Hello Charmika By Lekshmi, I would like to book "${product.name}" for rental (${rentalDays} Days).\n\nProduct Link: ${typeof window !== 'undefined' ? window.location.href : ''}\nPlease let me know the availability and rental booking procedure.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-3 shadow-luxury"
                >
                  <MessageCircle className="w-5 h-5 fill-white text-emerald-700" />
                  <span>Book Rental on WhatsApp ({rentalDays} Days)</span>
                </a>
              ) : (
                <>
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stockStatus === 'outofstock'}
                    className="w-full py-4 bg-maroon text-white font-bold text-xs sm:text-sm uppercase tracking-widest rounded-xl hover:bg-gold hover:text-maroon transition-all flex items-center justify-center gap-3 shadow-luxury disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    <ShoppingBag className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">Add to Shopping Cart</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={product.stockStatus === 'outofstock'}
                    className="w-full py-4 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-3 shadow-md disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    <Zap className="w-5 h-5 fill-white relative z-10" /> 
                    <span className="relative z-10">Buy It Now</span>
                  </button>
                </>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-8 mt-2 border-t border-gold/15">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-beige border border-gold/30 flex items-center justify-center text-gold shadow-sm">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold text-charcoal/80 uppercase tracking-wider">Premium<br/>Quality</span>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-beige border border-gold/30 flex items-center justify-center text-gold shadow-sm">
                  <Truck className="w-6 h-6" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold text-charcoal/80 uppercase tracking-wider">Fast & Secure<br/>Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-beige border border-gold/30 flex items-center justify-center text-gold shadow-sm">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold text-charcoal/80 uppercase tracking-wider">Easy<br/>Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="mt-16 bg-white rounded-[2rem] border border-gold/20 shadow-luxury overflow-hidden">
          <div className="flex flex-wrap border-b border-gold/10 bg-beige/30">
            {['desc', 'specs', 'care', 'shipping'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 min-w-[140px] px-6 py-5 text-xs sm:text-sm font-bold uppercase tracking-widest transition-all ${
                  activeTab === tab
                    ? 'text-maroon border-b-2 border-maroon bg-white shadow-[0_-4px_15px_rgba(0,0,0,0.02)]'
                    : 'text-charcoal/50 hover:text-maroon hover:bg-white/50'
                }`}
              >
                {tab === 'desc' ? 'Description' : tab === 'specs' ? 'Specifications' : tab === 'care' ? 'Care Guide' : 'Shipping'}
              </button>
            ))}
          </div>
          <div className="p-8 sm:p-12 lg:p-16">
            {activeTab === 'desc' && (
              <div className="prose prose-sm sm:prose-base max-w-4xl text-charcoal/80 font-light leading-loose">
                {product.description ? (
                   <p className="whitespace-pre-line">{product.description}</p>
                ) : (
                   <p className="italic opacity-70">No description available for this exquisite piece.</p>
                )}
              </div>
            )}
            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl">
                 {Object.entries(product.specifications || {}).map(([key, value]) => value && (
                   <div key={key} className="flex flex-col pb-4 border-b border-gold/10">
                     <span className="text-[10px] uppercase tracking-widest text-gold font-bold mb-1.5">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                     <span className="text-sm text-charcoal font-medium capitalize">{value}</span>
                   </div>
                 ))}
                 {!Object.values(product.specifications || {}).some(v => v) && (
                   <p className="italic opacity-70 text-sm text-charcoal/80 col-span-full">Detailed specifications are currently being updated.</p>
                 )}
              </div>
            )}
            {activeTab === 'care' && (
              <div className="space-y-6 max-w-3xl text-sm sm:text-base text-charcoal/80 font-light leading-relaxed">
                <p className="font-serif text-2xl text-maroon flex items-center gap-3"><ShieldCheck className="w-8 h-8 text-gold"/> Premium Jewellery Care</p>
                <p>To ensure your Charmika jewellery retains its royal shine and beauty for years to come, please follow these care instructions carefully:</p>
                <ul className="list-none space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1">✦</span>
                    <span>Wipe your jewellery with a soft, clean cloth after every use.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1">✦</span>
                    <span>Always store your jewellery in a flat box or pouch to avoid accidental scratches or entanglement.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1">✦</span>
                    <span>Keep sprays, perfumes, and harsh chemicals strictly away from your jewellery.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1">✦</span>
                    <span>Do not soak your jewellery in water or wear it while swimming.</span>
                  </li>
                  {product.specifications?.careInstructions && (
                    <li className="flex items-start gap-3">
                      <span className="text-gold mt-1">✦</span>
                      <span>{product.specifications.careInstructions}</span>
                    </li>
                  )}
                </ul>
              </div>
            )}
            {activeTab === 'shipping' && (
              <div className="space-y-6 max-w-3xl text-sm sm:text-base text-charcoal/80 font-light leading-relaxed">
                <p className="font-serif text-2xl text-maroon flex items-center gap-3"><Truck className="w-8 h-8 text-gold"/> Shipping & Delivery</p>
                <p>We provide secure, insured, and fast shipping across India directly from our Kottayam boutique.</p>
                <div className="grid sm:grid-cols-2 gap-6 mt-6">
                  <div className="bg-beige p-6 rounded-2xl border border-gold/20">
                    <h4 className="font-bold text-maroon text-xs uppercase tracking-widest mb-2">Processing Time</h4>
                    <p className="text-sm">Most orders are carefully packaged and dispatched within 24-48 hours of placing the order.</p>
                  </div>
                  <div className="bg-beige p-6 rounded-2xl border border-gold/20">
                    <h4 className="font-bold text-maroon text-xs uppercase tracking-widest mb-2">Delivery Time</h4>
                    <p className="text-sm">Standard delivery takes 3-7 business days depending on your location in India.</p>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-3 text-sm bg-maroon/5 p-4 rounded-xl border-l-4 border-maroon">
                  <Sparkles className="w-5 h-5 text-maroon shrink-0" />
                  <p><strong className="text-maroon">Free shipping</strong> is automatically applied at checkout to all orders above ₹2,000 (Flat ₹80 shipping below ₹2,000).</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Products You May Like Horizontal Scroll Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-8">
            <YouMayAlsoLike
              products={relatedProducts}
              title="You May Also Like"
              subtitle="Explore complementary luxury designs from our exclusive collection"
            />
          </div>
        )}
      </div>
    </div>
  );
}
