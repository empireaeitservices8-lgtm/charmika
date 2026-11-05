'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Gem, MapPin, Phone, Mail, Instagram, Facebook, ShieldCheck, Award, RefreshCw } from 'lucide-react';
import { Category } from '@/types';

export const Footer: React.FC<{ categories?: Category[] }> = ({ categories = [] }) => {

  return (
    <footer className="bg-maroon-950 text-white pt-16 pb-28 sm:pb-12 border-t-2 border-gold/40 relative overflow-hidden">
      {/* Subtle Gold Background Accent */}
      <div className="absolute inset-0 bg-luxury-radial pointer-events-none opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Brand Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 mb-12 border-b border-gold/20 text-center">
          <div className="flex flex-col items-center p-4 rounded-xl bg-white/5 border border-gold/10">
            <Award className="w-8 h-8 text-gold mb-2" />
            <h4 className="font-serif text-sm font-bold text-gold">Heritage Craftsmanship</h4>
            <p className="text-xs text-white/70 mt-1">Handpicked luxury designs blending traditional Indian artistry & modern glamour.</p>
          </div>
          <div className="flex flex-col items-center p-4 rounded-xl bg-white/5 border border-gold/10">
            <ShieldCheck className="w-8 h-8 text-gold mb-2" />
            <h4 className="font-serif text-sm font-bold text-gold">Flexible Rental System</h4>
            <p className="text-xs text-white/70 mt-1">Rent grand bridal sets for your special days at a fraction of purchase cost.</p>
          </div>
          <div className="flex flex-col items-center p-4 rounded-xl bg-white/5 border border-gold/10">
            <RefreshCw className="w-8 h-8 text-gold mb-2" />
            <h4 className="font-serif text-sm font-bold text-gold">Sanitized & Safe Delivery</h4>
            <p className="text-xs text-white/70 mt-1">Inspected, anti-tarnish protected, and safely shipped.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-gold/20">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gold/70 shadow-[0_0_15px_rgba(200,155,60,0.3)] group-hover:scale-105 transition-transform duration-300">
                <Image
                  src="/images/logo.png"
                  alt="CHARMIKA JEWELLERY"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold text-white group-hover:text-gold transition-colors leading-tight">
                  CHARMIKA
                </span>
                <span className="text-[10px] tracking-[0.3em] font-sans font-medium text-gold uppercase">
                  By Lekshmi
                </span>
              </div>
            </Link>

            <p className="text-xs text-white/70 leading-relaxed font-light max-w-sm">
              CHARMIKA By Lekshmi was born from a passion for timeless jewellery and the confidence it instills in every woman. We offer fine heritage pieces for outright purchase and premium event rentals.
            </p>

            <div className="pt-2 space-y-2 text-xs text-white/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>Karthika, Kuttypady, Gandhinagar PO, Kottayam, Kerala 686008</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <a href="tel:+919400976257" className="hover:text-gold transition-colors font-medium">
                  +91 94009 76257
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <a href="mailto:charmikajewel@gmail.com" className="hover:text-gold transition-colors">
                  charmikajewel@gmail.com
                </a>
              </div>
            </div>

            <div className="pt-2 flex items-center space-x-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-white/10 hover:bg-gold hover:text-maroon rounded-full transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-white/10 hover:bg-gold hover:text-maroon rounded-full transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-serif text-sm font-bold text-gold uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <Link href="/shop" className="hover:text-gold transition-colors">
                  All Jewellery
                </Link>
              </li>
              <li>
                <Link href="/rental" className="hover:text-gold transition-colors text-gold font-semibold">
                  Rental Jewellery
                </Link>
              </li>
              <li>
                <Link href="/combos" className="hover:text-gold transition-colors">
                  Combo Collections
                </Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-gold transition-colors">
                  Festival Deals & Offers
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-gold transition-colors text-gold flex items-center gap-1">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold transition-colors">
                  About Founder Lekshmi D.S
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold transition-colors">
                  Store Contact & Maps
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h4 className="font-serif text-sm font-bold text-gold uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link href={`/shop?category=${cat.slug}`} className="hover:text-gold transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom copyright & legal */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-white/60 space-y-4 md:space-y-0 text-center md:text-left">
          <p>© {new Date().getFullYear()} CHARMIKA By Lekshmi (Charmika Jewels). All Rights Reserved.</p>
          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-2 text-xs">
            <span className="hover:text-gold cursor-pointer transition-colors">Privacy Policy</span>
            <span className="text-white/30">•</span>
            <span className="hover:text-gold cursor-pointer transition-colors">Terms & Conditions</span>
            <span className="text-white/30">•</span>
            <Link href="/rental" className="hover:text-gold transition-colors text-gold font-semibold">
              Rental Policy
            </Link>
            <span className="text-white/30">•</span>
            <Link href="/return-policy" className="hover:text-gold transition-colors text-gold font-semibold">
              Return Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
