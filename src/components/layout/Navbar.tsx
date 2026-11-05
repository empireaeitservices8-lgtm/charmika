'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Search, Heart, ShoppingBag, Menu, X, ChevronDown, Sparkles, Gem, Clock,
  Star, Gift, Tag, Phone, MapPin, Zap, Crown, Shield, RefreshCw, Video, Truck,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { Category, Product } from '@/types';
import { SearchOverlay } from '@/components/common/SearchOverlay';

/* ─── Mega Menu Data ──────────────────────────────────────────────── */
const categoryMenu = [
  { name: 'Necklaces', href: '/shop?category=necklaces', icon: '📿' },
  { name: 'Long Haarams', href: '/shop?category=long-haarams', icon: '✨' },
  { name: 'Chokers', href: '/shop?category=chokers', icon: '💛' },
  { name: 'Temple Jewellery', href: '/shop?category=temple-jewellery', icon: '🛕' },
  { name: 'AD Stone', href: '/shop?category=ad-stone-jewellery', icon: '💎' },
  { name: 'Anti Tarnish', href: '/shop?category=anti-tarnish-jewellery', icon: '🌟' },
  { name: 'Bangles & Bracelets', href: '/shop?category=bangles-bracelets', icon: '💫' },
  { name: 'Earrings', href: '/shop?category=earrings', icon: '🌸' },
  { name: 'Finger Rings', href: '/shop?category=finger-rings', icon: '💍' },
  { name: 'Hip Belts', href: '/shop?category=hip-belts-oddiyanam', icon: '🎀' },
];

const megaMenus: Record<string, React.ReactNode> = {};

export const Navbar: React.FC<{ categories?: Category[]; combos?: Product[] }> = ({
  categories = [],
  combos = [],
}) => {
  const pathname = usePathname();
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, setIsAuthModalOpen } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openMenu = (name: string) => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setActiveMenu(name);
  };
  const closeMenu = () => {
    leaveTimer.current = setTimeout(() => setActiveMenu(null), 120);
  };
  const stayOpen = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
  };

  const isActive = (href: string) => pathname === href;

  const navLinkClass = (href: string, extra = '') =>
    `relative flex items-center gap-1 text-[11px] uppercase tracking-wider font-bold transition-colors duration-200 py-1 ${extra} ${
      isActive(href) ? 'text-maroon font-black' : 'text-maroon-950 hover:text-gold'
    }`;

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 bg-white shadow-luxury border-b border-gold/30 ${
          isScrolled ? 'py-2' : 'py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-maroon hover:text-gold transition-colors bg-gold/10 rounded-full"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-gold shadow-md group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(200,155,60,0.5)] transition-all duration-300">
                <Image src="/images/logo.png" alt="CHARMIKA JEWELLERY" fill className="object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-black tracking-wider text-maroon group-hover:text-gold transition-colors leading-tight">
                  CHARMIKA
                </span>
                <span className="text-[10px] tracking-[0.25em] font-sans font-bold text-gold-600 uppercase">
                  By Lekshmi
                </span>
              </div>
            </Link>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 text-maroon hover:text-gold bg-gold/10 hover:bg-gold/20 rounded-full transition-all"
                title="Search Jewellery"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link href="/wishlist" className="p-2.5 text-maroon hover:text-gold bg-gold/10 hover:bg-gold/20 rounded-full transition-all relative" title="View Wishlist">
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold text-maroon-950 text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white shadow-sm animate-bounce">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2.5 text-maroon hover:text-gold bg-gold/10 hover:bg-gold/20 rounded-full transition-all relative"
                title="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-maroon text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white shadow-sm">
                    {totalItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* ─── Desktop Mega Nav Bar ─────────────────────────────────── */}
          <nav className="hidden lg:flex items-center justify-center gap-2 pt-3 mt-2 border-t border-gold/20">

            {/* HOME */}
            <Link href="/" className={navLinkClass('/', 'px-3 py-2 text-xs font-bold text-maroon-950 hover:text-gold uppercase tracking-wider')}>
              Home
              {isActive('/') && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gold rounded-full" />}
            </Link>

            {/* NEW ARRIVALS */}
            <div
              className="relative"
              onMouseEnter={() => openMenu('new')}
              onMouseLeave={closeMenu}
            >
              <Link
                href="/new-arrivals"
                className="flex items-center gap-1 text-[11px] uppercase tracking-wider font-semibold text-maroon hover:text-gold transition-colors px-3 py-2"
                onFocus={() => openMenu('new')}
              >
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                New Arrivals
                <ChevronDown className={`w-3 h-3 text-gold transition-transform ${activeMenu === 'new' ? 'rotate-180' : ''}`} />
              </Link>
              {activeMenu === 'new' && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[520px] bg-white rounded-2xl shadow-2xl border border-gold/20 z-50 overflow-hidden"
                  onMouseEnter={stayOpen}
                  onMouseLeave={closeMenu}
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-gold font-bold">✨ Real New Arrivals</p>
                        <p className="text-xs text-charcoal/70 mt-0.5">Explore freshly uploaded designs by category</p>
                      </div>
                      <Link
                        href="/new-arrivals"
                        onClick={() => setActiveMenu(null)}
                        className="text-[11px] text-maroon font-bold hover:text-gold uppercase tracking-wider"
                      >
                        View All →
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.filter(c => c.slug !== 'uncategorized' && c.count > 0).map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/new-arrivals?category=${cat.slug}`}
                          onClick={() => setActiveMenu(null)}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-gold/15 hover:border-gold/40 hover:bg-gold/5 transition-all group/item"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="text-sm">💎</span>
                            <span className="text-xs font-semibold text-charcoal group-hover/item:text-maroon truncate">
                              {cat.name}
                            </span>
                          </div>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-gold/15 text-maroon shrink-0">
                            {cat.count}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="bg-maroon/5 border-t border-gold/20 px-5 py-3 flex items-center justify-between">
                    <p className="text-[10px] text-charcoal/60">Curated & Handcrafted in Kottayam, Kerala</p>
                    <Link
                      href="/new-arrivals"
                      onClick={() => setActiveMenu(null)}
                      className="text-[11px] font-bold text-maroon hover:text-gold transition-colors"
                    >
                      Browse All New Arrivals →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* CATEGORIES */}
            <div
              className="relative"
              onMouseEnter={() => openMenu('categories')}
              onMouseLeave={closeMenu}
            >
              <button className="flex items-center gap-1 text-[11px] uppercase tracking-wider font-semibold text-charcoal hover:text-maroon transition-colors px-3 py-2">
                Categories
                <ChevronDown className={`w-3 h-3 text-gold transition-transform ${activeMenu === 'categories' ? 'rotate-180' : ''}`} />
              </button>
              {activeMenu === 'categories' && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[620px] bg-white rounded-2xl shadow-2xl border border-gold/20 z-50 overflow-hidden"
                  onMouseEnter={stayOpen}
                  onMouseLeave={closeMenu}
                >
                  <div className="grid grid-cols-3">
                    {/* Left: categories grid */}
                    <div className="col-span-2 p-5">
                      <p className="text-[10px] uppercase tracking-widest text-gold font-bold mb-3">Shop by Category</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {categories.filter(c => c.slug !== 'uncategorized' && c.count > 0).map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/shop?category=${cat.slug}`}
                            onClick={() => setActiveMenu(null)}
                            className="flex items-center gap-2.5 px-3 py-2.5 text-xs text-charcoal/90 hover:bg-gold/15 hover:text-maroon rounded-xl font-medium transition-all border border-transparent hover:border-gold/20 group/item"
                          >
                            <span className="text-base">💎</span>
                            <span>{cat.name}</span>
                            <span className="ml-auto text-[10px] text-gold font-bold opacity-0 group-hover/item:opacity-100 transition-opacity">→</span>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gold/20 flex justify-between items-center">
                        <span className="text-[10px] text-charcoal/50">Curated collections</span>
                        <Link href="/shop" onClick={() => setActiveMenu(null)} className="text-[11px] text-maroon font-bold hover:text-gold uppercase tracking-wider transition-colors">
                          View All Products →
                        </Link>
                      </div>
                    </div>
                    {/* Right: spotlight */}
                    <div className="bg-gradient-to-b from-maroon to-maroon-950 p-5 flex flex-col gap-4">
                      <p className="text-[10px] uppercase tracking-widest text-gold font-bold">Spotlight</p>
                      {[
                        { href: '/shop?category=traditional-long-haramas', label: 'Long Haram', sub: 'Traditional & Divine' },
                        { href: '/shop?category=anti-tarnish-jewellery', label: 'Daily Wear', sub: 'Anti-Tarnish Series' },
                        { href: '/shop?category=ad-jewellery', label: 'AD Stone', sub: 'Premium Sparkle' },
                      ].map(({ href, label, sub }) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setActiveMenu(null)}
                          className="group/spot block p-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 transition-all"
                        >
                          <p className="text-xs font-semibold text-white group-hover/spot:text-gold transition-colors">{label}</p>
                          <p className="text-[10px] text-white/50 mt-0.5">{sub}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RENTAL JEWELLERY */}
            <div
              className="relative"
              onMouseEnter={() => openMenu('rental')}
              onMouseLeave={closeMenu}
            >
              <Link
                href="/rental"
                className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-charcoal hover:text-maroon transition-colors px-3 py-2"
              >
                <Clock className="w-3.5 h-3.5 text-gold" />
                Rental Jewellery
                <ChevronDown className={`w-3 h-3 text-gold transition-transform ${activeMenu === 'rental' ? 'rotate-180' : ''}`} />
              </Link>
              {activeMenu === 'rental' && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[340px] bg-white rounded-2xl shadow-2xl border border-gold/20 z-50 overflow-hidden"
                  onMouseEnter={stayOpen}
                  onMouseLeave={closeMenu}
                >
                  <div className="p-5">
                    <p className="text-[10px] uppercase tracking-widest text-gold font-bold mb-3">Rent by Occasion</p>
                    <div className="flex flex-col gap-1.5">
                      {[
                        { href: '/rental?filter=bridal', label: '👰 Bridal Sets', desc: 'Full bridal jewellery' },
                        { href: '/rental?filter=engagement', label: '💍 Engagement', desc: 'Ring ceremony pieces' },
                        { href: '/rental?filter=reception', label: '🌸 Reception', desc: 'Elegant reception sets' },
                        { href: '/rental?filter=function', label: '🎉 Function Wear', desc: 'Family events & parties' },
                        { href: '/rental?filter=photoshoot', label: '📸 Photo Shoots', desc: 'Professional shoots' },
                        { href: '/rental', label: '✨ All Rental Pieces', desc: 'View complete catalogue' },
                      ].map(({ href, label, desc }) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setActiveMenu(null)}
                          className="group/r flex items-center justify-between p-2.5 rounded-xl hover:bg-gold/10 border border-transparent hover:border-gold/20 transition-all"
                        >
                          <div>
                            <p className="text-xs font-semibold text-maroon group-hover/r:text-gold transition-colors">{label}</p>
                            <p className="text-[10px] text-charcoal/50">{desc}</p>
                          </div>
                          <span className="text-[10px] text-gold font-bold opacity-0 group-hover/r:opacity-100 transition-opacity">→</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* COMBO COLLECTION */}
            <div
              className="relative"
              onMouseEnter={() => openMenu('combo')}
              onMouseLeave={closeMenu}
            >
              <Link
                href="/combos"
                className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-charcoal hover:text-maroon transition-colors px-3 py-2"
              >
                <Gift className="w-3.5 h-3.5 text-gold" />
                Combo Collection
                <ChevronDown className={`w-3 h-3 text-gold transition-transform ${activeMenu === 'combo' ? 'rotate-180' : ''}`} />
              </Link>
              {activeMenu === 'combo' && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[520px] bg-white rounded-2xl shadow-2xl border border-gold/20 z-50 overflow-hidden"
                  onMouseEnter={stayOpen}
                  onMouseLeave={closeMenu}
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-gold font-bold">🎁 Verified Combo Sets</p>
                        <p className="text-xs text-charcoal/70 mt-0.5">Real matching jewellery sets from our workshop</p>
                      </div>
                      <Link
                        href="/combos"
                        onClick={() => setActiveMenu(null)}
                        className="text-[11px] text-maroon font-bold hover:text-gold uppercase tracking-wider"
                      >
                        All Combos ({combos.length}) →
                      </Link>
                    </div>

                    {combos.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2.5">
                        {combos.slice(0, 6).map((product) => (
                          <Link
                            key={product.id}
                            href={`/product/${product.slug}`}
                            onClick={() => setActiveMenu(null)}
                            className="flex items-center gap-3 p-2.5 rounded-xl border border-gold/15 hover:border-gold/40 hover:bg-gold/5 transition-all group/item"
                          >
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-gold/20 bg-beige/50">
                              <Image
                                src={product.images[0]?.src || '/images/placeholder.jpg'}
                                alt={product.name}
                                fill
                                className="object-cover group-hover/item:scale-105 transition-transform"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-maroon group-hover/item:text-gold truncate">
                                {product.name}
                              </p>
                              <p className="text-[11px] font-bold text-gold-700 mt-0.5">
                                ₹{product.price > 0 ? product.price.toLocaleString('en-IN') : 'Enquire'}
                              </p>
                            </div>
                            <span className="text-[10px] text-gold font-bold opacity-0 group-hover/item:opacity-100 transition-opacity">
                              →
                            </span>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="py-6 text-center text-xs text-charcoal/60">
                        <Gift className="w-8 h-8 text-gold mx-auto mb-2 opacity-60" />
                        Explore our upcoming bridal and festival combo sets
                      </div>
                    )}
                  </div>
                  <div className="bg-gold/10 border-t border-gold/20 px-5 py-3 flex items-center justify-between">
                    <p className="text-[11px] text-maroon font-semibold flex items-center gap-1.5">
                      <Gift className="w-4 h-4 text-gold" /> Complete sets at special bundled prices!
                    </p>
                    <Link
                      href="/combos"
                      onClick={() => setActiveMenu(null)}
                      className="text-[11px] font-bold text-maroon hover:text-gold transition-colors"
                    >
                      View All Sets →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* OFFERS & FESTIVAL */}
            <div
              className="relative"
              onMouseEnter={() => openMenu('offers')}
              onMouseLeave={closeMenu}
            >
              <button className="flex items-center gap-1 text-[11px] uppercase tracking-wider font-bold text-maroon hover:text-gold transition-colors px-3 py-2">
                <Zap className="w-3 h-3 text-gold" />
                Offers & Festival
                <ChevronDown className={`w-3 h-3 text-gold transition-transform ${activeMenu === 'offers' ? 'rotate-180' : ''}`} />
              </button>
              {activeMenu === 'offers' && (
                <div
                  className="absolute top-full right-0 mt-2 w-[520px] bg-white rounded-2xl shadow-2xl border border-gold/20 z-50 overflow-hidden"
                  onMouseEnter={stayOpen}
                  onMouseLeave={closeMenu}
                >
                  <div className="grid grid-cols-2">
                    <div className="p-5">
                      <p className="text-[10px] uppercase tracking-widest text-gold font-bold mb-3">🎊 Active Offers</p>
                      <div className="flex flex-col gap-2">
                        {[
                          { code: 'WELCOME10', desc: '10% off — First order, no min spend!', color: 'bg-gold text-maroon' },
                          { code: 'CHARMIKA10', desc: '10% off on ₹2,000+', color: 'bg-maroon text-white' },
                          { code: 'ROYAL500', desc: '₹500 off on ₹5,000+', color: 'bg-maroon text-white' },
                          { code: 'BRIDAL15', desc: '15% off on ₹15,000+', color: 'bg-maroon text-white' },
                        ].map(({ code, desc, color }) => (
                          <div key={code} className="flex items-center justify-between p-3 rounded-xl border border-gold/15 bg-beige/40">
                            <div>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono tracking-wider ${color}`}>{code}</span>
                              <p className="text-[10px] text-charcoal/60 mt-1">{desc}</p>
                            </div>
                            <Tag className="w-4 h-4 text-gold" />
                          </div>
                        ))}
                        <Link
                          href="/offers"
                          onClick={() => setActiveMenu(null)}
                          className="mt-1 text-center text-[11px] font-bold py-2 rounded-xl border-2 border-gold text-maroon hover:bg-gold hover:text-white transition-colors"
                        >
                          All Coupons & Offers →
                        </Link>
                      </div>
                    </div>
                    <div className="bg-gradient-to-b from-maroon to-maroon-950 p-5 flex flex-col gap-3">
                      <p className="text-[10px] uppercase tracking-widest text-gold font-bold">Festival Collections</p>
                      {[
                        { href: '/shop?festival=onam', label: '🌸 Onam Collection', sub: 'Traditional Kerala sets' },
                        { href: '/shop?festival=wedding', label: '💒 Wedding Season', sub: 'Bridal & event wear' },
                        { href: '/shop?festival=diwali', label: '🪔 Diwali Specials', sub: 'Festive gold-look sets' },
                        { href: '/shop?festival=christmas', label: '🎄 Christmas Picks', sub: 'Gift-ready jewellery' },
                        { href: '/offers', label: '🎁 All Festival Deals', sub: 'View every active deal' },
                      ].map(({ href, label, sub }) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setActiveMenu(null)}
                          className="group/o block p-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 transition-all"
                        >
                          <p className="text-xs font-semibold text-white group-hover/o:text-gold transition-colors">{label}</p>
                          <p className="text-[10px] text-white/50">{sub}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ABOUT & CONTACT (slim) */}
            <Link href="/about" className={navLinkClass('/about', 'px-3 py-2')}>
              About
            </Link>
            <Link href="/contact" className={navLinkClass('/contact', 'px-3 py-2')}>
              Contact
            </Link>
            <Link href="/track" className={navLinkClass('/track', 'px-3 py-2 text-gold font-semibold flex items-center gap-1')}>
              <Truck className="w-3.5 h-3.5 text-gold" />
              Track
            </Link>
          </nav>
        </div>
      </header>

      {/* ─── Mobile Drawer Menu ───────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative w-4/5 max-w-xs bg-beige h-full shadow-2xl overflow-y-auto p-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-gold/20">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2.5">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gold shadow-sm">
                    <Image src="/images/logo.png" alt="CHARMIKA JEWELLERY" fill className="object-cover" />
                  </div>
                  <div>
                    <span className="font-serif text-lg font-bold text-maroon block leading-tight">CHARMIKA</span>
                    <span className="block text-[8px] text-gold uppercase tracking-widest">By Lekshmi</span>
                  </div>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 text-charcoal">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-5 flex flex-col space-y-1 text-sm font-medium text-charcoal">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="py-3 px-2 border-b border-gold/10 flex items-center gap-2">
                  🏠 Home
                </Link>
                <Link href="/new-arrivals" onClick={() => setIsMobileMenuOpen(false)} className="py-3 px-2 border-b border-gold/10 flex items-center gap-2 text-maroon font-semibold">
                  <Sparkles className="w-4 h-4 text-gold" /> New Arrivals
                </Link>

                {/* Categories Accordion */}
                <div>
                  <button
                    onClick={() => setMobileCatOpen(!mobileCatOpen)}
                    className="w-full flex items-center justify-between py-3 px-2 border-b border-gold/10 text-left"
                  >
                    <span>📦 Categories</span>
                    <ChevronDown className={`w-4 h-4 text-gold transition-transform ${mobileCatOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileCatOpen && (
                    <div className="pl-4 pb-2 flex flex-col gap-0.5 bg-white/60 rounded-xl mt-1">
                      {categories.filter(c => c.slug !== 'uncategorized' && c.count > 0).map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/shop?category=${cat.slug}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="py-2 px-3 text-xs text-charcoal hover:text-maroon flex items-center gap-2"
                        >
                          <span>💎</span> {cat.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link href="/rental" onClick={() => setIsMobileMenuOpen(false)} className="py-3 px-2 border-b border-gold/10 flex items-center gap-2 text-maroon font-semibold">
                  <Clock className="w-4 h-4 text-gold" /> Rental Jewellery
                </Link>
                <Link href="/combos" onClick={() => setIsMobileMenuOpen(false)} className="py-3 px-2 border-b border-gold/10 flex items-center gap-2 text-maroon font-semibold">
                  <Gift className="w-4 h-4 text-gold" /> Combo Collection
                </Link>
                <Link href="/offers" onClick={() => setIsMobileMenuOpen(false)} className="py-3 px-2 border-b border-gold/10 flex items-center gap-2 text-maroon font-semibold">
                  <Zap className="w-4 h-4 text-gold" /> Offers & Festival
                </Link>
                <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="py-3 px-2 border-b border-gold/10">
                  👤 About Us
                </Link>
                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="py-3 px-2 border-b border-gold/10">
                  📞 Contact Us
                </Link>
                <Link href="/track" onClick={() => setIsMobileMenuOpen(false)} className="py-3 px-2 border-b border-gold/10 flex items-center gap-2 text-maroon font-semibold">
                  <Truck className="w-4 h-4 text-gold" /> Track Order
                </Link>
                <Link href="/return-policy" onClick={() => setIsMobileMenuOpen(false)} className="py-3 px-2 text-xs text-charcoal/60">
                  Return Policy
                </Link>
              </div>

              {/* Promo codes preview */}
              <div className="mt-5 p-4 bg-maroon/5 border border-gold/20 rounded-2xl">
                <p className="text-[10px] uppercase tracking-wider text-gold font-bold mb-2">Active Promo Codes</p>
                {['CHARMIKA10', 'ROYAL500', 'BRIDAL15'].map((code) => (
                  <span key={code} className="inline-block mr-2 mb-1 text-[10px] font-mono font-bold bg-maroon text-white px-2 py-0.5 rounded">
                    {code}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-gold/20 text-xs text-charcoal/70 text-center">
              <p className="font-serif font-semibold text-maroon">Charmika By Lekshmi</p>
              <p className="mt-1">Kottayam, Kerala</p>
            </div>
          </div>
        </div>
      )}

      {/* Live Search Modal */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
