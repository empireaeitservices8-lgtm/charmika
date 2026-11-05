'use client';

import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    author: 'Dr. Reshma Nair',
    location: 'Kochi, Kerala',
    rating: 5,
    date: 'July 2026',
    comment:
      'CHARMIKA By Lekshmi made my wedding reception unforgettable! The Temple Nakshi long haaram rental was flawless and arrived in a premium safety casing.',
    verified: true,
  },
  {
    id: 2,
    author: 'Meera Thomas',
    location: 'Kottayam, Kerala',
    rating: 5,
    date: 'June 2026',
    comment:
      'The Anti-Tarnish gold chain is my daily companion. I wear it in the shower and gym—no fading at all! Exceptional quality and service.',
    verified: true,
  },
  {
    id: 3,
    author: 'Archana Pillai',
    location: 'Thiruvananthapuram',
    rating: 5,
    date: 'May 2026',
    comment:
      'Lekshmi D.S personally helped me select the perfect AD Stone choker for my sister’s engagement. The rental process was transparent & hassle-free.',
    verified: true,
  },
];

export const CustomerReviews: React.FC = () => {
  return (
    <section className="py-16 bg-beige border-t border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold block mb-1">
            Real Stories & Praise
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-maroon">
            What Our Happy Customers Say
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-2xl border border-gold/20 shadow-xs relative flex flex-col justify-between"
            >
              <div>
                <Quote className="w-8 h-8 text-gold/30 mb-3" />
                <div className="flex gap-1 text-amber-400 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-charcoal/80 font-light leading-relaxed italic mb-4">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-gold/10 flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-sm font-bold text-maroon">{rev.author}</h4>
                  <span className="text-[10px] text-charcoal/50">{rev.location}</span>
                </div>
                {rev.verified && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded-full font-medium">
                    <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
