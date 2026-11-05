'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Gem, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      login(email, mode === 'register' ? name : undefined);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative bg-white max-w-md w-full rounded-2xl shadow-2xl overflow-hidden border border-gold/30 p-6 sm:p-8">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-beige text-charcoal/70 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2.5 justify-center mb-2">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gold shadow-sm">
              <Image
                src="/images/logo.png"
                alt="CHARMIKA JEWELLERY"
                fill
                className="object-cover"
              />
            </div>
            <span className="font-serif text-2xl font-bold text-maroon">CHARMIKA</span>
          </div>
          <p className="text-xs text-charcoal/60">
            {mode === 'login' ? 'Welcome back! Access your orders & rentals' : 'Create your Charmika account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gold absolute left-3 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Lekshmi D.S"
                  required
                  className="w-full pl-9 pr-3 py-2 border border-gold/30 rounded-lg text-xs focus:outline-none focus:border-gold"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gold absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-9 pr-3 py-2 border border-gold/30 rounded-lg text-xs focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gold absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-9 pr-3 py-2 border border-gold/30 rounded-lg text-xs focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-maroon text-white font-bold text-xs uppercase tracking-widest rounded-full hover:bg-gold hover:text-maroon transition-all flex items-center justify-center gap-2 shadow-md"
          >
            {mode === 'login' ? 'Sign In' : 'Create Account'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-charcoal/70 border-t border-gold/15 pt-4">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button onClick={() => setMode('register')} className="text-maroon font-bold hover:underline">
                Register Now
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button onClick={() => setMode('login')} className="text-maroon font-bold hover:underline">
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
