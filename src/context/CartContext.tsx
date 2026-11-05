'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, Coupon } from '@/types';
import { WooCommerceService } from '@/services/woocommerce';

import { useToast } from './ToastContext';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, isRental?: boolean, rentalDays?: number, startDate?: string, endDate?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  totalItemsCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const { addToast } = useToast();

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('charmika_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error('Failed to load cart', e);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('charmika_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [cart]);

  const addToCart = (
    product: Product,
    isRental: boolean = false,
    rentalDays: number = 3,
    startDate?: string,
    endDate?: string
  ) => {
    const isRentalProduct = Boolean(
      isRental ||
        product.isRentalAvailable ||
        product.categorySlug?.toLowerCase().includes('rental') ||
        product.categorySlugs?.some((s) => s.toLowerCase().includes('rental') || s.toLowerCase() === 'rent') ||
        product.categories?.some(
          (c) =>
            c.slug.toLowerCase().includes('rental') ||
            c.name.toLowerCase().includes('rental') ||
            c.slug.toLowerCase() === 'rent'
        )
    );

    if (isRentalProduct) {
      addToast(`Rental items cannot be purchased online. Opening WhatsApp to book "${product.name}"...`, 'info');
      const text = encodeURIComponent(
        `Hello Charmika By Lekshmi, I would like to book "${product.name}" for rental (${rentalDays} Days). Please let me know the availability.`
      );
      if (typeof window !== 'undefined') {
        window.open(`https://wa.me/919400976257?text=${text}`, '_blank');
      }
      return;
    }

    const cartItemId = `${product.id}-buy`;

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === cartItemId);
      if (existing) {
        return prevCart.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prevCart,
        {
          id: cartItemId,
          product,
          quantity: 1,
          isRental,
          rentalDurationDays: isRental ? rentalDays : undefined,
          rentalStartDate: startDate,
          rentalEndDate: endDate,
        },
      ];
    });

    addToast(
      isRental
        ? `Added ${product.name} to cart as a ${rentalDays}-day rental!`
        : `Added ${product.name} to your shopping cart!`,
      'success'
    );
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    const itemToRemove = cart.find((i) => i.id === cartItemId);
    setCart((prevCart) => prevCart.filter((item) => item.id !== cartItemId));
    if (itemToRemove) {
      addToast(`Removed ${itemToRemove.product.name} from cart`, 'info');
    }
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    addToast('Shopping cart cleared', 'info');
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => {
    if (item.isRental && item.product.rentalPricePerDay) {
      const dailyRate = item.product.rentalPricePerDay;
      const days = item.rentalDurationDays || 3;
      const deposit = item.product.securityDeposit || 0;
      return acc + (dailyRate * days + deposit) * item.quantity;
    }
    return acc + item.product.price * item.quantity;
  }, 0);

  const applyCoupon = (code: string) => {
    const res = WooCommerceService.verifyCoupon(code, subtotal);
    if (res.valid && res.coupon) {
      setAppliedCoupon(res.coupon);
      addToast(res.message || `Coupon ${res.coupon.code} applied!`, 'success');
      return { success: true, message: res.message || 'Coupon applied' };
    }
    addToast(res.message || 'Invalid coupon code', 'error');
    return { success: false, message: res.message || 'Invalid coupon' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon code removed', 'info');
  };

  const discountAmount = appliedCoupon
    ? appliedCoupon.discountType === 'percentage'
      ? Math.round((subtotal * appliedCoupon.amount) / 100)
      : appliedCoupon.amount
    : 0;

  const taxAmount = 0; // Inclusive for luxury jewellery
  const FREE_SHIPPING_THRESHOLD = 2000;
  const STANDARD_SHIPPING_RATE = 80;
  const shippingAmount = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING_RATE;
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingAmount);
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        discountAmount,
        taxAmount,
        shippingAmount,
        totalAmount,
        totalItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
