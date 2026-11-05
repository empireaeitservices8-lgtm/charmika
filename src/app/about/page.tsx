'use client';

import React from 'react';
import Link from 'next/link';
import { Gem, Award, ShieldCheck, Heart, Sparkles, Clock, Truck, MessageSquare, CheckCircle2, Star, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { label: 'Happy Brides & Clients', value: '100+' },
    { label: 'Curated Heritage Designs', value: '500+' },
    { label: 'Anti-Tarnish Lifetime Finish', value: '100%' },
    { label: 'Insured Doorstep Delivery', value: 'Pan-India' },
  ];

  const brandValues = [
    {
      icon: Gem,
      title: 'Royal South Indian Heritage',
      desc: 'Each Temple Nakshi piece is inspired by classical temple architecture, featuring Goddess Lakshmi and peacock motifs in 22k matte gold finish.',
    },
    {
      icon: Clock,
      title: 'Accessible Bridal Rentals',
      desc: 'Our pioneering bridal rental program lets brides across Kerala and India wear grand heritage Haarams at a fraction of purchase cost.',
    },
    {
      icon: ShieldCheck,
      title: 'Anti-Tarnish Innovation',
      desc: 'Waterproof, sweatproof 18k PVD coated everyday jewellery designed for effortless elegance without fading or tarnishing.',
    },
    {
      icon: Truck,
      title: 'Premium Packaging & Easy Returns',
      desc: 'All rentals and purchases arrive in protective safety cases with prepaid pickup labels for seamless 3-day or 5-day rental returns.',
    },
  ];

  return (
    <div className="py-16 bg-beige min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold block mb-2">
            Our Brand Story & Legacy
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-maroon mb-3">
            About Charmika By Lekshmi
          </h1>
          <p className="font-serif text-xl italic text-gold font-semibold">
            A Passion Turned Into a Royal Promise
          </p>
          <div className="w-20 h-0.5 bg-gold mx-auto mt-4" />
        </div>

        {/* Narrative Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-14 border border-gold/30 shadow-luxury mb-16 space-y-6 text-charcoal/80 text-sm sm:text-base leading-relaxed font-light">
          <p className="font-serif text-2xl font-bold text-maroon leading-snug">
            CHARMIKA By Lekshmi was born from a deep love for timeless South Indian jewellery and the royal confidence it brings to every woman.
          </p>

          <p>
            Rooted in Kottayam, Kerala, we curate elegant, high-quality collections that blend centuries-old temple tradition with contemporary luxury aesthetics. From heavy Nakshi work long haarams to sparkling AD stone chokers and waterproof anti-tarnish everyday chains, every single piece in our boutique is individually hand-inspected for finish, durability, and craftsmanship.
          </p>

          <p>
            Whether you choose to purchase an heirloom piece or rent a complete 5-piece bridal ensemble for your defining event, we are committed to offering extraordinary beauty, absolute transparency, and a smooth luxury experience.
          </p>

          <div className="p-6 bg-gold/15 rounded-2xl border-l-4 border-gold text-maroon font-serif font-bold text-base sm:text-xl italic mt-6 shadow-xs">
            "At CHARMIKA By Lekshmi, we don't just offer jewellery—we become an cherished part of your defining celebrations."
          </div>
        </div>

        {/* Stats Counter Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((st) => (
            <div key={st.label} className="bg-white p-6 rounded-2xl border border-gold/30 shadow-xs text-center">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-maroon block mb-1">
                {st.value}
              </span>
              <span className="text-xs text-gold uppercase tracking-wider font-bold">
                {st.label}
              </span>
            </div>
          ))}
        </div>

        {/* Core Pillars Grid */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <span className="text-xs uppercase font-bold tracking-widest text-gold block">Why Choose Us</span>
            <h2 className="font-serif text-3xl font-bold text-maroon mt-1">Our Core Brand Pillars</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {brandValues.map((val) => {
              const Icon = val.icon;
              return (
                <div
                  key={val.title}
                  className="bg-white p-8 rounded-3xl border border-gold/30 shadow-xs hover:shadow-luxury transition-all space-y-3"
                >
                  <div className="w-12 h-12 bg-gold/15 rounded-2xl flex items-center justify-center text-maroon">
                    <Icon className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-maroon">{val.title}</h3>
                  <p className="text-xs text-charcoal/70 leading-relaxed font-light">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Founder Section */}
        <div className="bg-gradient-to-r from-maroon-950 via-maroon-900 to-maroon-950 text-white rounded-3xl p-8 sm:p-14 border border-gold/40 shadow-luxury flex flex-col md:flex-row items-center gap-10 mb-16">
          <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-gold shadow-gold shrink-0 bg-white/10 flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop"
              alt="Lekshmi D.S"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-4 text-center md:text-left">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold block">
              Meet The Visionary
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">Lekshmi D.S</h2>
            <p className="text-xs text-gold font-medium uppercase tracking-wider">
              Founder & Creative Director • CHARMIKA By Lekshmi
            </p>
            <p className="text-xs sm:text-sm text-white/90 font-light leading-relaxed max-w-xl">
              Lekshmi founded CHARMIKA with a vision to redefine bridal jewellery accessibility in Kerala and across India. Her passion for classic temple motifs combined with hassle-free rental logistics ensures that every bride experiences royal grandeur without compromise.
            </p>

            <div className="pt-3 flex flex-wrap gap-4 justify-center md:justify-start">
              <a
                href="https://wa.me/919400976257?text=Hello%20Lekshmi!%20I%20would%20like%20to%20connect%20regarding%20Charmika%20Jewels."
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 bg-gold text-maroon-950 font-bold text-xs uppercase tracking-wider rounded-full hover:bg-white transition-all flex items-center gap-2 shadow-md"
              >
                <MessageSquare className="w-4 h-4" /> Message Lekshmi Directly
              </a>
            </div>
          </div>
        </div>

        {/* Action Callouts */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gold/30 shadow-luxury text-center space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-maroon">
            Ready to Discover Your Signature Jewellery?
          </h2>
          <p className="text-xs sm:text-sm text-charcoal/70 max-w-xl mx-auto font-light">
            Explore our curated shop catalogue, reserve bridal rental packages, or reach out to our Kottayam boutique for custom inquiries.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/shop"
              className="px-8 py-3.5 bg-maroon text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-gold hover:text-maroon transition-all shadow-md flex items-center gap-2"
            >
              Browse Full Catalogue <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/rental"
              className="px-8 py-3.5 bg-gold/15 text-maroon border border-gold/40 text-xs font-bold uppercase tracking-widest rounded-full hover:bg-gold hover:text-maroon transition-all flex items-center gap-2"
            >
              <Clock className="w-4 h-4 text-gold" /> Explore Rental Collection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
