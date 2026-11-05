'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, Clock, Truck, ShieldCheck, Sparkles } from 'lucide-react';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discountAmount,
    shippingAmount,
    totalAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const freeShippingThreshold = 2000;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountNeededForFreeShipping = freeShippingThreshold - subtotal;

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    const res = applyCoupon(couponCode);
    if (!res.success) {
      setErrorMsg(res.message);
    } else {
      setErrorMsg('');
      setCouponCode('');
    }
  };

  const handleQuickApplyCoupon = (code: string) => {
    const res = applyCoupon(code);
    if (!res.success) {
      setErrorMsg(res.message);
    } else {
      setErrorMsg('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="py-20 bg-beige min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mb-4 border border-gold/30">
          <ShoppingBag className="w-10 h-10 text-gold" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-maroon">Your Shopping Cart Is Empty</h1>
        <p className="text-xs text-charcoal/60 mt-2 max-w-sm leading-relaxed">
          Explore our signature Temple Nakshi haarams, AD stone chokers, or rental bridal packages.
        </p>
        <Link
          href="/shop"
          className="mt-6 px-8 py-3.5 bg-maroon text-white font-bold text-xs uppercase tracking-widest rounded-full hover:bg-gold hover:text-maroon transition-all shadow-luxury"
        >
          Explore Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 bg-beige min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-gold/20">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-gold block mb-1">Review Items</span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-maroon">Shopping Cart</h1>
            <p className="text-xs text-charcoal/60 mt-1">{cart.length} items in your order</p>
          </div>

          <button
            onClick={clearCart}
            className="px-4 py-2 bg-white text-charcoal/70 border border-gold/30 hover:border-red-500 hover:text-red-600 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Cart
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="bg-gradient-to-r from-maroon-950 to-maroon-900 text-white p-4 rounded-2xl border border-gold/30 mb-8 shadow-md">
          {subtotal >= freeShippingThreshold ? (
            <p className="flex items-center gap-2 text-gold text-xs sm:text-sm font-bold">
              <Truck className="w-5 h-5 text-gold shrink-0" />
              🎉 Congratulations! You have unlocked FREE Insured Shipping on orders above ₹2,000!
            </p>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-1.5 text-white/90">
                  <Truck className="w-4 h-4 text-gold" />
                  Add <strong className="text-gold font-bold">₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> more to get FREE shipping!
                </span>
                <span className="text-gold font-bold">{Math.round(progressToFreeShipping)}%</span>
              </div>
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gold h-full transition-all duration-500"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List Column */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 sm:p-6 rounded-3xl border border-gold/20 shadow-xs hover:shadow-luxury transition-all flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
              >
                <div className="flex gap-4 items-center">
                  <img
                    src={item.product.images[0].src}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-2xl border border-gold/20 shrink-0"
                  />
                  <div>
                    <h3 className="font-serif text-base font-bold text-maroon">{item.product.name}</h3>
                    <span className="text-[11px] text-gold uppercase tracking-wider font-semibold block mt-0.5">
                      {item.product.jewelleryType}
                    </span>

                    {item.isRental ? (
                      <div className="mt-2 space-y-1">
                        <div className="inline-flex items-center gap-1.5 text-xs bg-gold/15 text-maroon px-2.5 py-1 rounded-lg font-semibold border border-gold/30">
                          <Clock className="w-3.5 h-3.5 text-gold" />
                          Rental Booking: {item.rentalDurationDays} Days
                        </div>
                        <p className="text-[10px] text-charcoal/60">
                          Daily Rate: ₹{item.product.rentalPricePerDay} | Security Deposit: ₹
                          {(item.product.securityDeposit || 2000).toLocaleString('en-IN')} (Refundable)
                        </p>
                      </div>
                    ) : (
                      <span className="text-xs text-charcoal/60 block mt-1">Outright Purchase</span>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col justify-between sm:justify-end items-center sm:items-end w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gold/10">
                  <div className="font-serif font-bold text-xl text-maroon">
                    ₹
                    {(item.isRental && item.product.rentalPricePerDay
                      ? (item.product.rentalPricePerDay * (item.rentalDurationDays || 3) +
                          (item.product.securityDeposit || 0)) *
                        item.quantity
                      : item.product.price * item.quantity
                    ).toLocaleString('en-IN')}
                  </div>

                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center border border-gold/30 rounded-xl bg-beige">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 text-charcoal hover:bg-gold/20 rounded-l-xl"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-bold text-maroon">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 text-charcoal hover:bg-gold/20 rounded-r-xl"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-charcoal/40 hover:text-red-600 transition-colors p-1"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Column */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold/30 shadow-luxury h-fit space-y-6">
            <h2 className="font-serif text-xl font-bold text-maroon pb-4 border-b border-gold/20">
              Order Summary
            </h2>

            {/* Available Coupons Suggestions */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-gold uppercase tracking-wider block">
                Available Promo Codes
              </span>
              <div className="flex flex-wrap gap-2">
                {['WELCOME10', 'CHARMIKA10', 'ROYAL500', 'BRIDAL15'].map((code) => (
                  <button
                    key={code}
                    onClick={() => handleQuickApplyCoupon(code)}
                    className={`px-2.5 py-1 border rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                      code === 'WELCOME10'
                        ? 'bg-gold text-maroon border-gold hover:bg-maroon hover:text-white'
                        : 'bg-gold/10 hover:bg-gold hover:text-maroon border-gold/30 text-maroon'
                    }`}
                  >
                    <Sparkles className="w-2.5 h-2.5" /> {code}
                    {code === 'WELCOME10' && <span className="ml-0.5 text-[9px] font-normal">★ New</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Coupon Code Input Form */}
            {appliedCoupon ? (
              <div className="flex justify-between items-center bg-gold/15 p-3 rounded-xl border border-gold/40 text-xs">
                <span className="flex items-center gap-1.5 text-maroon font-bold">
                  <Tag className="w-4 h-4 text-gold" /> Promo Code {appliedCoupon.code} Applied
                </span>
                <button onClick={removeCoupon} className="text-red-600 font-bold hover:underline">
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleCouponSubmit} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter Coupon Code"
                    className="flex-1 px-3.5 py-2.5 border border-gold/30 rounded-xl text-xs focus:outline-none focus:border-gold"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-gold text-maroon text-xs font-bold rounded-xl hover:bg-maroon hover:text-white transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {errorMsg && <p className="text-[11px] text-red-600 font-medium">{errorMsg}</p>}
              </form>
            )}

            <div className="space-y-3 text-xs text-charcoal/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-charcoal">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-700 font-medium">
                  <span>Coupon Discount</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Insured Shipping</span>
                <span>{shippingAmount === 0 ? 'FREE' : `₹${shippingAmount}`}</span>
              </div>
              <div className="flex justify-between font-serif text-xl font-bold text-maroon pt-3 border-t border-gold/20">
                <span>Grand Total</span>
                <span className="text-gold">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="p-3.5 bg-beige/60 rounded-2xl border border-gold/20 text-[11px] text-charcoal/80 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gold shrink-0" />
              <span>100% Insured Delivery with Premium Safety Case & Guarantee Certificate</span>
            </div>

            <Link
              href="/checkout"
              className="w-full py-4 bg-maroon text-white font-bold text-xs uppercase tracking-widest rounded-full hover:bg-gold hover:text-maroon transition-all flex items-center justify-center gap-2 shadow-luxury"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
