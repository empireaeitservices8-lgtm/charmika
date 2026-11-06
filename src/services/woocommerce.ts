import { Product, Category, Coupon } from '@/types';
import { getStoreProducts, getStoreProductBySlug, getStoreCategories } from '@/lib/store-products';
import prisma from '@/lib/prisma';

export const MOCK_COUPONS: Coupon[] = [
  { code: 'WELCOME10', discountType: 'percentage', amount: 10, minSpend: 0 },
  { code: 'CHARMIKA10', discountType: 'percentage', amount: 10, minSpend: 2000 },
  { code: 'ROYAL500', discountType: 'fixed', amount: 500, minSpend: 5000 },
  { code: 'BRIDAL15', discountType: 'percentage', amount: 15, minSpend: 15000 },
];

export class WooCommerceService {
  // Get All Categories from database
  static async getCategories(): Promise<Category[]> {
    return getStoreCategories();
  }

  // Get Products with optional filters from database
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
    return getStoreProducts(params);
  }

  // Get Single Product by Slug from database
  static async getProductBySlug(slug: string): Promise<Product | null> {
    return getStoreProductBySlug(slug);
  }

  // Get Rental Products
  static async getRentalProducts(): Promise<Product[]> {
    const products = await this.getProducts({ rentalOnly: true });
    if (products.length > 0) return products;
    const all = await this.getProducts();
    return all.filter((p) => p.isRentalAvailable || p.price >= 6000).slice(0, 8);
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

  // Create Product in Database
  static async createProduct(data: any): Promise<Product | null> {
    try {
      const created = await prisma.product.create({
        data: {
          name: data.name,
          slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          sku: data.sku || `CH-${Date.now()}`,
          categoryId: data.categoryId || 1,
          regularPrice: data.regularPrice || 0,
          salePrice: data.salePrice || null,
          stock: data.stock || 0,
          status: 'ACTIVE',
        },
      });
      return created ? getStoreProductBySlug(created.slug) : null;
    } catch {
      return null;
    }
  }

  // Update Product in Database
  static async updateProduct(id: number | string, data: any): Promise<Product | null> {
    try {
      const updated = await prisma.product.update({
        where: { id: Number(id) },
        data,
      });
      return updated ? getStoreProductBySlug(updated.slug) : null;
    } catch {
      return null;
    }
  }

  // Delete Product in Database
  static async deleteProduct(id: number | string): Promise<boolean> {
    try {
      await prisma.product.delete({
        where: { id: Number(id) },
      });
      return true;
    } catch {
      return false;
    }
  }
}
