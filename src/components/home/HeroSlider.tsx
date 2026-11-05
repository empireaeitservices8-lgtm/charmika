'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Clock } from 'lucide-react';

const SLIDES: Array<{
  id: number;
  title: string;
  subtitle: string;
  image: string;
  ctaPrimary: { text: string; href: string };
  ctaSecondary?: { text: string; href: string };
  badge: string;
}> = [
  {
    id: 1,
    title: 'Timeless Elegance That Tells Your Story',
    subtitle: 'Discover hand-crafted Temple Haarams, Grand Chokers & Royal Bridal Collections.',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1600&auto=format&fit=crop',
    ctaPrimary: { text: 'Shop Collection', href: '/shop' },
    badge: 'Signature Heritage Collection 2026',
  },
  {
    id: 3,
    title: 'Your Daily Sparkle',
    subtitle: 'Lightweight, anti-tarnish, and perfect for everyday styling',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1600&auto=format&fit=crop',
    ctaPrimary: { text: 'Shop Collections', href: '/shop?category=ad-stone-jewellery' },
    badge: 'Everyday Luxury Essentials',
  },
];

export const HeroSlider: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[current];

  return (
    <section className="relative h-[80vh] min-h-[550px] max-h-[750px] w-full overflow-hidden bg-maroon-950">
      {/* Background Image with Fade Animation */}
      {SLIDES.map((s, idx) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={s.image}
            alt={s.title}
            className="w-full h-full object-cover brightness-[0.45] scale-105 transition-transform duration-10000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-maroon-950/90 via-maroon-950/50 to-transparent" />
        </div>
      ))}

      {/* Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="max-w-2xl text-white space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/20 backdrop-blur-md rounded-full border border-gold/40 text-gold text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            {slide.badge}
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white">
            {slide.title}
          </h1>

          <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed max-w-xl">
            {slide.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href={slide.ctaPrimary.href}
              className="btn-ripple px-8 py-3.5 bg-gold text-maroon-950 font-bold text-xs uppercase tracking-widest rounded-full hover:bg-white hover:text-maroon transition-all shadow-luxury flex items-center gap-2"
            >
              {slide.ctaPrimary.text}
              <ArrowRight className="w-4 h-4" />
            </Link>

            {slide.ctaSecondary && (
              <Link
                href={slide.ctaSecondary.href}
                className="px-6 py-3.5 border border-gold/50 bg-white/10 hover:bg-gold/20 text-white font-medium text-xs uppercase tracking-widest rounded-full backdrop-blur-xs transition-all flex items-center gap-2"
              >
                <Clock className="w-4 h-4 text-gold" />
                {slide.ctaSecondary.text}
              </Link>
            )}
          </div>

        </div>
      </div>

      {/* Slide Navigation Controls */}
      <div className="absolute bottom-6 right-6 z-30 flex items-center space-x-3">
        <button
          onClick={() => setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1))}
          className="p-2.5 rounded-full bg-white/10 hover:bg-gold hover:text-maroon text-white border border-gold/30 backdrop-blur-md transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-serif font-bold text-gold">
          0{current + 1} / 0{SLIDES.length}
        </span>
        <button
          onClick={() => setCurrent((prev) => (prev + 1) % SLIDES.length)}
          className="p-2.5 rounded-full bg-white/10 hover:bg-gold hover:text-maroon text-white border border-gold/30 backdrop-blur-md transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
