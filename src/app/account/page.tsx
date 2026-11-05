'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { User, Package, Clock, MapPin, LogOut, ShieldCheck, ChevronRight } from 'lucide-react';

export default function AccountPage() {
  const { user, logout, setIsAuthModalOpen } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'rentals' | 'address'>('dashboard');

  if (!user) {
    return (
      <div className="py-20 bg-beige min-h-screen flex flex-col items-center justify-center text-center px-4">
        <User className="w-16 h-16 text-gold mb-4" />
        <h1 className="font-serif text-3xl font-bold text-maroon">Please Sign In</h1>
        <p className="text-xs text-charcoal/60 mt-2 max-w-sm">
          Access your recent orders, rental booking history, and saved addresses.
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="mt-6 px-8 py-3.5 bg-maroon text-white font-bold text-xs uppercase tracking-widest rounded-full hover:bg-gold hover:text-maroon transition-all shadow-luxury"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  const mockOrders = [
    {
      id: 'CBL-ORD-92841',
      date: '2026-07-28',
      total: 18499,
      status: 'Shipped',
      item: 'Royal Heritage Temple Nakshi Haaram',
    },
    {
      id: 'CBL-ORD-81723',
      date: '2026-06-14',
      total: 2499,
      status: 'Delivered',
      item: 'Everyday Luxe Anti-Tarnish Gold Snake Chain',
    },
  ];

  const mockRentals = [
    {
      id: 'CBL-RNT-4012',
      item: 'Maharani Bridal Kundan & Pearl Combo Set',
      dates: 'Aug 10 - Aug 13, 2026',
      deposit: 5000,
      status: 'Booking Reserved',
    },
  ];

  return (
    <div className="py-12 bg-beige min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 mb-8 border-b border-gold/20 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-maroon text-gold font-serif font-bold text-2xl rounded-full flex items-center justify-center border-2 border-gold shadow-xs">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-maroon">{user.name}</h1>
              <p className="text-xs text-charcoal/60">{user.email}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gold/30 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Tabs Menu */}
          <div className="bg-white p-4 rounded-2xl border border-gold/20 shadow-xs h-fit space-y-1 text-xs font-semibold text-charcoal">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                activeTab === 'dashboard' ? 'bg-maroon text-white font-bold' : 'hover:bg-beige'
              }`}
            >
              <User className="w-4 h-4" /> Dashboard
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                activeTab === 'orders' ? 'bg-maroon text-white font-bold' : 'hover:bg-beige'
              }`}
            >
              <Package className="w-4 h-4" /> Order History ({mockOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('rentals')}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                activeTab === 'rentals' ? 'bg-maroon text-white font-bold' : 'hover:bg-beige'
              }`}
            >
              <Clock className="w-4 h-4" /> Rental Bookings ({mockRentals.length})
            </button>
            <button
              onClick={() => setActiveTab('address')}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                activeTab === 'address' ? 'bg-maroon text-white font-bold' : 'hover:bg-beige'
              }`}
            >
              <MapPin className="w-4 h-4" /> Saved Address
            </button>
          </div>

          {/* Content Pane */}
          <div className="lg:col-span-3">
            {activeTab === 'dashboard' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold/20 shadow-xs space-y-6">
                <h2 className="font-serif text-xl font-bold text-maroon">Account Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-beige/50 rounded-2xl border border-gold/20">
                    <span className="text-gold font-bold uppercase tracking-wider block">Phone Number</span>
                    <span className="font-bold text-maroon text-sm mt-1 block">{user.phone}</span>
                  </div>
                  <div className="p-4 bg-beige/50 rounded-2xl border border-gold/20">
                    <span className="text-gold font-bold uppercase tracking-wider block">Default City</span>
                    <span className="font-bold text-maroon text-sm mt-1 block">Kottayam, Kerala</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold/20 shadow-xs space-y-4">
                <h2 className="font-serif text-xl font-bold text-maroon mb-4">Your Recent Orders</h2>
                {mockOrders.map((ord) => (
                  <div key={ord.id} className="p-4 bg-beige/40 rounded-2xl border border-gold/15 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-serif font-bold text-maroon text-sm block">{ord.item}</span>
                      <span className="text-charcoal/60">{ord.id} • Date: {ord.date}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-maroon block">₹{ord.total.toLocaleString('en-IN')}</span>
                      <span className="bg-gold/20 text-maroon px-2 py-0.5 rounded text-[10px] font-bold">{ord.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'rentals' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold/20 shadow-xs space-y-4">
                <h2 className="font-serif text-xl font-bold text-maroon mb-4">Active Rental Bookings</h2>
                {mockRentals.map((rnt) => (
                  <div key={rnt.id} className="p-4 bg-beige/40 rounded-2xl border border-gold/15 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-serif font-bold text-maroon text-sm block">{rnt.item}</span>
                      <span className="text-gold font-bold block mt-0.5">{rnt.dates}</span>
                      <span className="text-charcoal/60 text-[10px]">Refundable Deposit: ₹{rnt.deposit}</span>
                    </div>
                    <span className="bg-green-100 text-green-800 px-2.5 py-1 rounded-full text-[10px] font-bold">
                      {rnt.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'address' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold/20 shadow-xs space-y-4">
                <h2 className="font-serif text-xl font-bold text-maroon mb-4">Saved Shipping Address</h2>
                <div className="p-4 bg-beige/40 rounded-2xl border border-gold/15 text-xs space-y-1">
                  <p className="font-serif font-bold text-maroon text-sm">{user.address?.firstName} {user.address?.lastName}</p>
                  <p>{user.address?.addressLine1}, {user.address?.addressLine2}</p>
                  <p>{user.address?.city}, {user.address?.state} - {user.address?.pincode}</p>
                  <p>Phone: {user.address?.phone}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
