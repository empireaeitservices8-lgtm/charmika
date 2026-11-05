'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

export const Preloader: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Increment progress bar smoothly
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 10;
      });
    }, 120);

    const timer = setTimeout(() => {
      setIsLoading(false);
      // Remove from DOM after fade-out transition completes
      setTimeout(() => setShouldRender(false), 700);
    }, 1800);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-maroon-950 text-white transition-opacity duration-700 ${
        isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,155,60,0.25)_0%,rgba(45,3,16,0.98)_75%)] pointer-events-none" />

      {/* Decorative Rotating Gold Ring & Logo */}
      <div className="relative flex items-center justify-center">
        {/* Animated Rotating Ring */}
        <div className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-gold/40 border-t-gold border-r-gold/20 animate-spin" style={{ animationDuration: '6s' }} />
        <div className="absolute w-40 h-40 sm:w-48 sm:h-48 rounded-full border border-dashed border-gold/30 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }} />

        {/* Logo Image */}
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-gold shadow-[0_0_35px_rgba(200,155,60,0.5)] transform animate-pulse-slow">
          <Image
            src="/images/logo.png"
            alt="CHARMIKA JEWELLERY"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Brand Title & Subtitle */}
      <div className="relative z-10 text-center mt-6 space-y-1">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-400 to-gold-600">
          CHARMIKA
        </h1>
        <p className="text-[10px] sm:text-xs tracking-[0.3em] font-sans font-medium text-gold/90 uppercase">
          Jewellery • Rental & Sales
        </p>
      </div>

      {/* Luxury Progress Bar */}
      <div className="relative z-10 mt-8 w-44 sm:w-56 h-1 bg-maroon-900/80 rounded-full overflow-hidden border border-gold/20 shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-200 transition-all duration-200 ease-out shadow-[0_0_10px_#D4AF37]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="relative z-10 text-[9px] text-white/40 tracking-widest mt-2 uppercase">
        Loading Elegance...
      </p>
    </div>
  );
};
