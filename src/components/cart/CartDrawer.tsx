'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ShoppingBag, Truck, Tag, ArrowRight, Clock } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountAmount,
    shippingAmount,
    totalAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const freeShippingThreshold = 2000;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountNeededForFreeShipping = freeShippingThreshold - subtotal;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-beige text-charcoal shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 sm:p-6 bg-white border-b border-gold/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-maroon" />
              <h2 className="font-serif text-lg font-bold text-maroon">Your Shopping Cart</h2>
              <span className="bg-gold/20 text-maroon text-xs font-semibold px-2 py-0.5 rounded-full">
                {cart.length} items
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full hover:bg-beige text-charcoal/70 hover:text-charcoal transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-maroon-900 text-white p-3 text-xs">
            {subtotal >= freeShippingThreshold ? (
              <p className="flex items-center gap-2 text-gold font-medium">
                <Truck className="w-4 h-4" />
                Free shipping on orders above ₹2,000!
              </p>
            ) : (
              <div>
                <p className="flex items-center justify-between font-medium">
                  <span>Add ₹{amountNeededForFreeShipping.toLocaleString('en-IN')} more for FREE shipping</span>
                  <span>{Math.round(progressToFreeShipping)}%</span>
                </p>
                <div className="w-full bg-white/20 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-gold h-full transition-all duration-300"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-12 h-12 text-gold/60 mx-auto mb-3" />
                <h3 className="font-serif text-base font-semibold text-maroon">Your cart is currently empty</h3>
                <p className="text-xs text-charcoal/60 mt-1">Discover our royal collection of necklaces, temple sets & rentals.</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 bg-maroon text-white text-xs font-semibold rounded-full hover:bg-gold hover:text-maroon transition-all shadow-md"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 bg-white p-3 rounded-lg border border-gold/15 shadow-xs relative"
                >
                  <img
                    src={item.product.images[0].src}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-md border border-gold/20"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-xs font-semibold text-maroon line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-charcoal/40 hover:text-red-600 transition-colors p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.isRental ? (
                        <div className="mt-1 flex items-center gap-1 text-[10px] bg-gold/15 text-maroon px-2 py-0.5 rounded w-max font-medium">
                          <Clock className="w-3 h-3 text-gold" />
                          Rental: {item.rentalDurationDays} Days
                        </div>
                      ) : (
                        <span className="text-[10px] text-charcoal/60 block mt-0.5">Purchase Item</span>
                      )}
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center border border-gold/30 rounded bg-beige">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-charcoal hover:bg-gold/20"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-charcoal hover:bg-gold/20"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-semibold text-sm text-maroon">
                        ₹
                        {(item.isRental && item.product.rentalPricePerDay
                          ? (item.product.rentalPricePerDay * (item.rentalDurationDays || 3) +
                              (item.product.securityDeposit || 0)) *
                            item.quantity
                          : item.product.price * item.quantity
                        ).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Coupon */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 bg-white border-t border-gold/20 space-y-3">
              {/* Coupon Form */}
              {appliedCoupon ? (
                <div className="flex justify-between items-center bg-gold/10 p-2.5 rounded text-xs border border-gold/30">
                  <span className="flex items-center gap-1.5 text-maroon font-semibold">
                    <Tag className="w-3.5 h-3.5 text-gold" />
                    Code {appliedCoupon.code} Applied
                  </span>
                  <button onClick={removeCoupon} className="text-red-600 font-bold hover:underline">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter Coupon (e.g. CHARMIKA10)"
                    className="flex-1 px-3 py-1.5 border border-gold/30 rounded text-xs focus:outline-none focus:border-gold"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-gold text-maroon text-xs font-bold rounded hover:bg-maroon hover:text-white transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-charcoal/80 pt-2 border-t border-gold/10">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-charcoal">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Discount</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingAmount === 0 ? 'FREE' : `₹${shippingAmount}`}</span>
                </div>
                <div className="flex justify-between font-serif text-base font-bold text-maroon pt-2 border-t border-gold/20">
                  <span>Total Amount</span>
                  <span className="text-gold">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full text-center py-2.5 border border-maroon text-maroon text-xs font-bold rounded-full hover:bg-maroon hover:text-white transition-all"
                >
                  View Full Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full text-center py-2.5 bg-maroon text-white text-xs font-bold rounded-full hover:bg-gold hover:text-maroon transition-all flex items-center justify-center gap-1.5 shadow-md"
                >
                  Checkout <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
