'use client';

import React from 'react';
import Link from 'next/link';
import { Gem, ArrowRight } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="py-24 bg-beige min-h-screen flex flex-col items-center justify-center text-center px-4">
      <Gem className="w-16 h-16 text-gold mb-4 animate-pulse" />
      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold block mb-2">
        Error 404
      </span>
      <h1 className="font-serif text-4xl sm:text-5xl font-bold text-maroon">
        Page Not Found
      </h1>
      <p className="text-xs sm:text-sm text-charcoal/70 mt-2 max-w-sm font-light">
        The royal page you are seeking does not exist or has been moved.
      </p>

      <Link
        href="/"
        className="mt-8 px-8 py-3.5 bg-maroon text-white font-bold text-xs uppercase tracking-widest rounded-full hover:bg-gold hover:text-maroon transition-all shadow-luxury flex items-center gap-2"
      >
        Return to Home <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
