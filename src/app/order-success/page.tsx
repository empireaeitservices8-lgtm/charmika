'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Truck,
  Package,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('payment_id');
  const paymentMethod = searchParams.get('payment_method') || 'payu';
  const rawOrderId = searchParams.get('order_id');
  const { clearCart } = useCart();

  const [orderId, setOrderId] = useState<string>('');

  useEffect(() => {
    // Clear cart once order is confirmed
    clearCart();

    // Determine order ID from URL or payment_id or localStorage
    if (rawOrderId) {
      setOrderId(rawOrderId);
    } else if (paymentId) {
      const match = paymentId.match(/CBL-ORD-(\d+)-/);
      if (match && match[1]) {
        setOrderId(match[1]);
      }
    } else {
      try {
        const saved = localStorage.getItem('charmika_pending_order');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.orderId) setOrderId(String(parsed.orderId));
        }
      } catch (e) {}
    }
  }, [rawOrderId, paymentId]);

  const displayOrderNumber = orderId ? `#${orderId}` : `CBL-${Date.now().toString().slice(-6)}`;

  return (
    <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gold/30 shadow-luxury max-w-lg w-full space-y-6">
      <div className="w-20 h-20 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto border-2 border-gold animate-bounce">
        <CheckCircle2 className="w-12 h-12 text-gold" />
      </div>

      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold block mb-1">
          Order Confirmed &amp; Verified
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-maroon">
          Thank You For Choosing CHARMIKA
        </h1>
        <p className="text-xs text-charcoal/70 mt-1">
          Your order <strong className="text-maroon font-serif text-sm">{displayOrderNumber}</strong> has been successfully placed and synced to our fulfillment system.
        </p>
      </div>

      <div className="p-4 bg-beige/60 rounded-2xl border border-gold/20 text-xs text-charcoal/80 space-y-2 text-left">
        <p className="flex justify-between border-b border-gold/10 pb-1.5">
          <strong className="text-maroon">Payment Status:</strong>
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Secure (PayU)
          </span>
        </p>
        {orderId && (
          <p className="flex justify-between border-b border-gold/10 pb-1.5 font-mono text-[11px]">
            <strong>WooCommerce Order ID:</strong>
            <span className="text-maroon font-bold">#{orderId}</span>
          </p>
        )}
        {paymentId && (
          <p className="flex justify-between border-b border-gold/10 pb-1.5 font-mono text-[11px]">
            <strong>Transaction ID:</strong>
            <span className="text-charcoal/70 truncate max-w-[200px]">{paymentId}</span>
          </p>
        )}
        <p className="flex justify-between border-b border-gold/10 pb-1.5">
          <strong>Shipping &amp; Logistics:</strong>
          <span className="text-maroon font-semibold flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-gold" /> Shiprocket Express
          </span>
        </p>
        <p className="flex justify-between">
          <strong>Dispatch Origin:</strong>
          <span>Kottayam Boutique, Kerala</span>
        </p>
      </div>

      {/* Shiprocket Fulfillment Notice */}
      <div className="p-3 bg-gold/10 border border-gold/30 rounded-2xl text-[11px] text-maroon flex items-center gap-2.5 text-left">
        <Package className="w-5 h-5 text-gold shrink-0" />
        <div>
          <span className="font-bold block">Fulfilled via Shiprocket</span>
          <span className="text-charcoal/70">
            You will receive SMS and WhatsApp tracking updates with your courier AWB as soon as the package is dispatched.
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link
          href={`/track?order_id=${orderId || ''}`}
          className="flex-1 py-3 bg-maroon text-white font-bold text-xs uppercase tracking-widest rounded-full hover:bg-gold hover:text-maroon transition-all flex items-center justify-center gap-1.5 shadow-md"
        >
          <Truck className="w-3.5 h-3.5" /> Track Live Status
        </Link>

        <a
          href={`https://wa.me/919400976257?text=Hello%20Charmika,%20I%20placed%20order%20${displayOrderNumber}.%20Payment%20ID:%20${paymentId || 'N/A'}`}
          target="_blank"
          rel="noreferrer"
          className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-full transition-all flex items-center justify-center gap-1.5"
        >
          <MessageSquare className="w-4 h-4" /> WhatsApp Support
        </a>
      </div>

      <div>
        <Link
          href="/shop"
          className="text-xs text-charcoal/60 hover:text-maroon underline transition-colors inline-flex items-center gap-1"
        >
          Continue Shopping <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="py-20 bg-beige min-h-screen flex flex-col items-center justify-center text-center px-4">
      <Suspense fallback={<div className="text-maroon font-serif">Loading order confirmation...</div>}>
        <OrderSuccessContent />
      </Suspense>
    </div>
  );
}
