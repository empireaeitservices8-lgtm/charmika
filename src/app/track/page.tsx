'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Truck,
  Search,
  Package,
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Phone,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface TrackingData {
  id: number;
  number: string;
  date: string;
  status: string;
  statusLabel: string;
  statusDescription: string;
  currentStage: number; // 1 to 5
  total: string;
  currency: string;
  customerName: string;
  destination: string;
  items: Array<{
    id: number;
    name: string;
    quantity: number;
    total: string;
  }>;
  shipping: {
    carrier: string;
    awb: string | null;
    shiprocketOrderId: string | null;
    trackingUrl: string | null;
  };
}

const STAGES = [
  { step: 1, label: 'Order Confirmed', desc: 'Verified & received' },
  { step: 2, label: 'Packed & Inspected', desc: 'Quality checked' },
  { step: 3, label: 'Handed to Shiprocket', desc: 'In courier transit' },
  { step: 4, label: 'Out for Delivery', desc: 'Arriving today' },
  { step: 5, label: 'Delivered', desc: 'Safely handed over' },
];

function TrackContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get('order_id') || searchParams.get('orderId') || '';

  const [orderQuery, setOrderQuery] = useState(initialOrderId);
  const [phoneQuery, setPhoneQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchTracking = async (orderId: string, phone: string) => {
    if (!orderId.trim()) {
      setError('Please enter a valid Order ID.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const url = `/api/track?orderId=${encodeURIComponent(orderId.trim())}${phone.trim() ? `&phone=${encodeURIComponent(phone.trim())}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.success && data.order) {
        setTrackingData(data.order);
      } else {
        setError(data.error || 'Order not found. Please verify your order number.');
        setTrackingData(null);
      }
    } catch (err) {
      console.error('Tracking fetch error:', err);
      setError('Failed to fetch tracking details. Please try again.');
      setTrackingData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId) {
      fetchTracking(initialOrderId, '');
    }
  }, [initialOrderId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(orderQuery, phoneQuery);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/15 border border-gold/40 rounded-full text-maroon text-xs font-semibold uppercase tracking-wider">
          <Truck className="w-3.5 h-3.5 text-gold" />
          <span>Real-time Shiprocket Tracking</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-maroon">
          Track Your Order
        </h1>
        <p className="text-xs sm:text-sm text-charcoal/70 max-w-lg mx-auto">
          Enter your Order ID (from your confirmation message or email) to check live shipment status and courier dispatch details.
        </p>
      </div>

      {/* Lookup Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold/30 shadow-luxury mb-8">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-charcoal mb-1">
              Order ID / Tracking Number *
            </label>
            <input
              type="text"
              placeholder="e.g. 1042 or CBL-ORD-1042"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gold/30 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-charcoal mb-1">
              Phone Number <span className="text-charcoal/40 font-normal">(Optional)</span>
            </label>
            <input
              type="tel"
              placeholder="e.g. 9400976257"
              value={phoneQuery}
              onChange={(e) => setPhoneQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gold/30 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          <div className="sm:col-span-5 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 bg-maroon hover:bg-gold hover:text-maroon text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              {loading ? (
                <>Searching Records...</>
              ) : (
                <>
                  <Search className="w-4 h-4" /> Track Status
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-center gap-3 text-xs">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <div className="flex-1">{error}</div>
          </div>
        )}
      </div>

      {/* Tracking Results Card */}
      {trackingData && (
        <div className="bg-white rounded-3xl border border-gold/30 shadow-luxury overflow-hidden space-y-6 p-6 sm:p-8 animate-fadeIn">
          {/* Header Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gold/20">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl font-bold text-maroon">
                  Order #{trackingData.number}
                </span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  {trackingData.statusLabel}
                </span>
              </div>
              <p className="text-xs text-charcoal/60 mt-1">
                Placed on {new Date(trackingData.date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })} • Destination: <strong className="text-charcoal">{trackingData.destination || 'Kerala, India'}</strong>
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] text-charcoal/50 uppercase tracking-widest block">Total Amount</span>
              <span className="font-serif text-xl font-bold text-maroon">
                ₹{parseFloat(trackingData.total).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="py-6">
            <div className="grid grid-cols-5 gap-2 sm:gap-4 relative">
              {/* Connecting background bar */}
              <div className="absolute top-4 left-[10%] right-[10%] h-1 bg-gray-200 -z-0">
                <div
                  className="h-full bg-gold transition-all duration-700"
                  style={{
                    width: `${Math.max(0, Math.min(100, ((trackingData.currentStage - 1) / 4) * 100))}%`
                  }}
                />
              </div>

              {STAGES.map((s) => {
                const isPassed = s.step < trackingData.currentStage;
                const isCurrent = s.step === trackingData.currentStage;

                return (
                  <div key={s.step} className="flex flex-col items-center text-center relative z-10">
                    <div
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isCurrent
                          ? 'bg-maroon text-gold ring-4 ring-gold/40 scale-110 shadow-lg'
                          : isPassed
                          ? 'bg-gold text-maroon'
                          : 'bg-white border-2 border-gray-300 text-gray-400'
                      }`}
                    >
                      {isPassed ? <Check className="w-4 h-4 stroke-[3]" /> : s.step}
                    </div>
                    <span
                      className={`text-[11px] sm:text-xs font-semibold mt-2 line-clamp-2 ${
                        isCurrent ? 'text-maroon font-bold' : isPassed ? 'text-charcoal' : 'text-gray-400'
                      }`}
                    >
                      {s.label}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-charcoal/50 hidden sm:block">
                      {s.desc}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Current Status Callout */}
            <div className="mt-8 p-4 bg-beige/60 rounded-2xl border border-gold/20 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-maroon">{trackingData.statusLabel}</p>
                <p className="text-charcoal/80 mt-0.5">{trackingData.statusDescription}</p>
              </div>
            </div>
          </div>

          {/* Courier & Shiprocket Tracking Details */}
          <div className="bg-maroon-900 text-white p-6 rounded-2xl relative overflow-hidden space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-gold block font-semibold">
                  Fulfilled via Shiprocket Express
                </span>
                <h3 className="font-serif text-lg font-bold">
                  Carrier: {trackingData.shipping.carrier}
                </h3>
              </div>

              {trackingData.shipping.awb ? (
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
                  <span className="text-[11px] text-white/70">AWB:</span>
                  <span className="font-mono text-xs font-bold text-gold">
                    {trackingData.shipping.awb}
                  </span>
                  <button
                    onClick={() => copyToClipboard(trackingData.shipping.awb || '')}
                    className="p-1 hover:text-gold transition-colors"
                    title="Copy AWB number"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ) : (
                <span className="text-xs text-white/70 italic">
                  AWB will be assigned upon dispatch
                </span>
              )}
            </div>

            {trackingData.shipping.trackingUrl ? (
              <a
                href={trackingData.shipping.trackingUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold hover:bg-gold-400 text-maroon font-bold text-xs uppercase tracking-wider rounded-full transition-all shadow-md"
              >
                Track Live on Shiprocket <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <p className="text-[11px] text-white/70">
                Shiprocket tracking updates are automatically sent via SMS / WhatsApp once the package is picked up by the courier partner.
              </p>
            )}
          </div>

          {/* Order Items Breakdown */}
          <div className="border-t border-gold/20 pt-6">
            <h4 className="font-serif text-sm font-bold text-maroon uppercase tracking-wider mb-3">
              Items in this Package
            </h4>
            <div className="divide-y divide-gold/10">
              {trackingData.items.map((item) => (
                <div key={item.id} className="py-2.5 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold text-charcoal">{item.name}</span>
                    <span className="text-charcoal/50 ml-2">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-semibold text-maroon">
                    ₹{parseFloat(item.total).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp Support CTA */}
          <div className="border-t border-gold/20 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            <div className="flex items-center gap-2 text-charcoal/80">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Insured transit with tamper-evident luxury packaging</span>
            </div>
            <a
              href={`https://wa.me/919400976257?text=Hello%20Charmika,%20I%20am%20tracking%20Order%20%23${trackingData.number}.`}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" /> Need Assistance? Chat with Support
            </a>
          </div>
        </div>
      )}

      {/* Helpful Info Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-xs text-charcoal/70">
        <div className="p-4 bg-white rounded-2xl border border-gold/20">
          <Truck className="w-6 h-6 text-gold mx-auto mb-2" />
          <h4 className="font-serif font-bold text-maroon">Express Courier</h4>
          <p className="mt-1 text-[11px]">Orders across Kerala deliver within 24-48 hours; all-India in 3-5 business days.</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-gold/20">
          <Package className="w-6 h-6 text-gold mx-auto mb-2" />
          <h4 className="font-serif font-bold text-maroon">Safe Jewellery Box</h4>
          <p className="mt-1 text-[11px]">Padded, shock-proof, and sealed with tamper-evident security tape.</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-gold/20">
          <Phone className="w-6 h-6 text-gold mx-auto mb-2" />
          <h4 className="font-serif font-bold text-maroon">Direct Support</h4>
          <p className="mt-1 text-[11px]">Questions about your shipment? Call or WhatsApp our Kottayam boutique at +91 94009 76257.</p>
        </div>
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <div className="bg-beige min-h-screen py-8">
      <Suspense fallback={<div className="text-center py-20 font-serif text-maroon">Loading tracking portal...</div>}>
        <TrackContent />
      </Suspense>
    </div>
  );
}
