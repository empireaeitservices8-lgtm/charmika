import { Product, Category, Coupon } from '@/types';

export const MOCK_COUPONS: Coupon[] = [
  { code: 'WELCOME10', discountType: 'percentage', amount: 10, minSpend: 0 },
  { code: 'CHARMIKA10', discountType: 'percentage', amount: 10, minSpend: 2000 },
  { code: 'ROYAL500', discountType: 'fixed', amount: 500, minSpend: 5000 },
  { code: 'BRIDAL15', discountType: 'percentage', amount: 15, minSpend: 15000 },
];

export class WooCommerceService {
  // Get All Categories
  static async getCategories(): Promise<Category[]> {
    if (typeof window === 'undefined') {
      const { getStoreCategories } = await import('@/lib/store-products');
      return getStoreCategories();
    }
    try {
      const res = await fetch('/api/categories', { cache: 'no-store' });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Failed to fetch categories on client', e);
    }
    return [];
  }

  // Get Products with optional filters
  static async getProducts(params?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    type?: string;
    rentalOnly?: boolean;
    combosOnly?: boolean;
    newArrivalsOnly?: boolean;
    sort?: string;
  }): Promise<Product[]> {
    if (typeof window === 'undefined') {
      const { getStoreProducts } = await import('@/lib/store-products');
      return getStoreProducts(params);
    }
    try {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append('search', params.search);
      if (params?.category && params.category !== 'all') queryParams.append('category', params.category);
      if (params?.type && params.type !== 'all') queryParams.append('type', params.type);
      if (params?.rentalOnly) queryParams.append('rentalOnly', 'true');
      if (params?.combosOnly) queryParams.append('combosOnly', 'true');
      if (params?.newArrivalsOnly) queryParams.append('newArrivalsOnly', 'true');
      if (params?.minPrice !== undefined) queryParams.append('minPrice', params.minPrice.toString());
      if (params?.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice.toString());
      if (params?.sort) queryParams.append('sort', params.sort);

      const res = await fetch('/api/products?' + queryParams.toString(), { cache: 'no-store' });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Failed to fetch products on client', e);
    }
    return [];
  }

  // Get Single Product by Slug
  static async getProductBySlug(slug: string): Promise<Product | null> {
    if (typeof window === 'undefined') {
      const { getStoreProductBySlug } = await import('@/lib/store-products');
      return getStoreProductBySlug(slug);
    }
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('slug', slug);
      const res = await fetch('/api/product?' + queryParams.toString(), { cache: 'no-store' });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Failed to fetch product by slug on client', e);
    }
    return null;
  }

  // Get Rental Products
  static async getRentalProducts(): Promise<Product[]> {
    const products = await this.getProducts({ rentalOnly: true });
    if (products.length > 0) return products;
    const all = await this.getProducts();
    return all
      .filter((p) => p.isRentalAvailable || p.price >= 990)
      .slice(0, 8)
      .map((p) => ({ ...p, isRentalAvailable: true }));
  }

  // Get Combo Offers
  static async getComboProducts(params?: { category?: string }): Promise<Product[]> {
    const products = await this.getProducts({ combosOnly: true, category: params?.category });
    if (products.length > 0) return products;
    const all = await this.getProducts({ category: params?.category });
    return all.filter((p) => p.isCombo || p.price > 10000).slice(0, 8);
  }

  // Get New Arrival Products
  static async getNewArrivalProducts(params?: { category?: string }): Promise<Product[]> {
    const products = await this.getProducts({ newArrivalsOnly: true, category: params?.category });
    if (products.length > 0) return products;
    const all = await this.getProducts({ category: params?.category });
    return all.slice(0, 8);
  }

  // Verify Coupon
  static verifyCoupon(code: string, cartSubtotal: number): { valid: boolean; coupon?: Coupon; message?: string } {
    const coupon = MOCK_COUPONS.find((c) => c.code.toUpperCase() === code.toUpperCase());
    if (!coupon) {
      return { valid: false, message: 'Invalid coupon code.' };
    }
    if (coupon.minSpend && cartSubtotal < coupon.minSpend) {
      return { valid: false, message: `Minimum spend of ₹${coupon.minSpend} required for code ${coupon.code}.` };
    }
    return { valid: true, coupon, message: `Coupon ${coupon.code} applied successfully!` };
  }

  // Create Product in Catalog
  static async createProduct(data: any): Promise<Product | null> {
    if (typeof window === 'undefined') {
      const { createUnifiedProduct, getStoreProductBySlug } = await import('@/lib/store-products');
      const created = await createUnifiedProduct(data);
      return getStoreProductBySlug(created.slug);
    }
    return null;
  }

  // Update Product in Catalog
  static async updateProduct(id: number | string, data: any): Promise<Product | null> {
    if (typeof window === 'undefined') {
      const { updateUnifiedProduct, getStoreProductBySlug } = await import('@/lib/store-products');
      const updated = await updateUnifiedProduct(Number(id), data);
      return updated ? getStoreProductBySlug(updated.slug) : null;
    }
    return null;
  }

  // Delete Product in Catalog
  static async deleteProduct(id: number | string): Promise<boolean> {
    if (typeof window === 'undefined') {
      const { deleteUnifiedProduct } = await import('@/lib/store-products');
      return deleteUnifiedProduct(Number(id));
    }
    return false;
  }
}
