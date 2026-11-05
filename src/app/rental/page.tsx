import React from 'react';
import Link from 'next/link';
import { WooCommerceService } from '@/services/woocommerce';
import { RentalProductCard } from '@/components/product/RentalProductCard';
import { Clock, ShieldCheck, RefreshCw, Sparkles, HelpCircle, CheckCircle2 } from 'lucide-react';

export default async function RentalPage() {
  const rentalProducts = await WooCommerceService.getRentalProducts();

  return (
    <div className="py-12 bg-beige min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-maroon-950 via-maroon-900 to-maroon-950 text-white rounded-3xl p-8 sm:p-12 border border-gold/30 shadow-luxury mb-12 relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/20 rounded-full text-gold text-xs font-semibold uppercase tracking-wider border border-gold/40">
              <Clock className="w-3.5 h-3.5" />
              CHARMIKA LUXURY RENTALS
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
              Grand Bridal Jewellery On Rental
            </h1>

            <p className="text-xs sm:text-sm text-white/80 font-light leading-relaxed">
              Why spend lakhs buying heavy bridal haarams for a single day? Rent authentic gold plated & Kundan sets starting from <span className="text-gold font-bold">₹299/day</span>. Guaranteed sanitized, pristine quality delivered to your doorstep in Kerala & India.
            </p>

            <div className="flex flex-wrap gap-4 pt-2 text-xs font-medium text-gold">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> 3, 5 or 7 Days Duration</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Instant Refundable Deposit</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Free Return Pickup</span>
            </div>
          </div>
        </div>

        {/* Rental Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-6 rounded-2xl border border-gold/20 shadow-xs text-center">
            <div className="w-12 h-12 bg-gold/10 text-gold font-serif font-bold text-xl rounded-full flex items-center justify-center mx-auto mb-3 border border-gold/30">
              1
            </div>
            <h3 className="font-serif text-base font-bold text-maroon">Select Your Dates</h3>
            <p className="text-xs text-charcoal/70 mt-1">Choose your product and pick 3, 5, or 7 days rental slot covering your event.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gold/20 shadow-xs text-center">
            <div className="w-12 h-12 bg-gold/10 text-gold font-serif font-bold text-xl rounded-full flex items-center justify-center mx-auto mb-3 border border-gold/30">
              2
            </div>
            <h3 className="font-serif text-base font-bold text-maroon">Receive & Flaunt</h3>
            <p className="text-xs text-charcoal/70 mt-1">Receive fully sanitized jewellery in our premium safety box 1 day prior to your event.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gold/20 shadow-xs text-center">
            <div className="w-12 h-12 bg-gold/10 text-gold font-serif font-bold text-xl rounded-full flex items-center justify-center mx-auto mb-3 border border-gold/30">
              3
            </div>
            <h3 className="font-serif text-base font-bold text-maroon">Easy Return & Deposit</h3>
            <p className="text-xs text-charcoal/70 mt-1">Pack in provided prepaid box. Courier collects from your home & deposit is refunded instantly.</p>
          </div>
        </div>

        {/* Product Showcase */}
        <div className="mb-8 flex justify-between items-center pb-4 border-b border-gold/20">
          <div>
            <h2 className="font-serif text-2xl font-bold text-maroon">Available Rental Jewellery</h2>
            <p className="text-xs text-charcoal/60">Reserve your dates before slots fill up for peak wedding seasons.</p>
          </div>
          <span className="text-xs font-semibold text-gold bg-white px-3 py-1.5 rounded-full border border-gold/30">
            {rentalProducts.length} Rental Designs
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {rentalProducts.map((product) => (
            <RentalProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
