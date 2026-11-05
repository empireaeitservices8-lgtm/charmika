export interface ProductImage {
  id: number;
  src: string;
  alt: string;
}

export interface ProductAttribute {
  id: number;
  name: string;
  options: string[];
}

export interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  price: number;
  regularPrice: number;
  salePrice?: number;
  onSale: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  isRentalAvailable?: boolean;
  rentalPricePerDay?: number;
  securityDeposit?: number;
  isCombo?: boolean;
  comboSaveAmount?: number;
  stockStatus: 'instock' | 'outofstock' | 'onbackorder';
  rating: number;
  reviewCount: number;
  category: string;
  categorySlug: string;
  categories?: ProductCategory[];
  categorySlugs?: string[];
  tags?: string[];
  tagSlugs?: string[];
  subCategory?: string;
  jewelleryType: 'Gold Plated' | 'Temple Jewellery' | 'AD Stone' | 'Anti Tarnish' | 'Kundan' | 'Silver Finish';
  shortDescription: string;
  description: string;
  images: ProductImage[];
  specifications: {
    material: string;
    plating: string;
    stoneType: string;
    weight: string;
    dimensions: string;
    careInstructions: string;
  };
  reviewsList?: Review[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  count: number;
  featured?: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  isRental: boolean;
  rentalDurationDays?: number;
  rentalStartDate?: string;
  rentalEndDate?: string;
  selectedVariant?: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  amount: number; // e.g. 10 for 10% or 500 for ₹500 off
  minSpend?: number;
}

export interface UserAddress {
  firstName: string;
  lastName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  address?: UserAddress;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Rental Active';
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: UserAddress;
  paymentMethod: string;
  isRentalOrder?: boolean;
  rentalReturnDate?: string;
}
