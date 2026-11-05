import { Product, Category, Review, Coupon } from '@/types';

// Mock Categories based on requirements
export const MOCK_CATEGORIES: Category[] = [];

// Mock Products curated for Charmika By Lekshmi
export const MOCK_PRODUCTS: Product[] = [];

export const MOCK_COUPONS: Coupon[] = [
  { code: 'WELCOME10', discountType: 'percentage', amount: 10, minSpend: 0 },
  { code: 'CHARMIKA10', discountType: 'percentage', amount: 10, minSpend: 2000 },
  { code: 'ROYAL500', discountType: 'fixed', amount: 500, minSpend: 5000 },
  { code: 'BRIDAL15', discountType: 'percentage', amount: 15, minSpend: 15000 },
];

export class WooCommerceService {
  private static baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || process.env.WORDPRESS_URL || '';
  private static consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY || '';
  private static consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET || '';

  // Internal helper for fetching from Woo API securely
  private static async fetchWooAPI(endpoint: string) {
    // Only fetch if keys are available
    if (!this.baseUrl || !this.consumerKey || !this.consumerSecret) return null;
    
    try {
      const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
      const url = `${this.baseUrl.replace(/\/$/, '')}/wp-json/wc/v3/${endpoint}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      });
      
      if (!response.ok) return null;
      return await response.json();
    } catch (e) {
      console.error('WooCommerce Fetch Error:', e);
      return null;
    }
  }

  // Internal helper for fetching all pages from Woo API
  private static async fetchAllWooProducts(endpoint: string, maxPages = 10): Promise<any[]> {
    let page = 1;
    const allItems: any[] = [];
    const separator = endpoint.includes('?') ? '&' : '?';

    while (page <= maxPages) {
      const url = `${endpoint}${separator}per_page=100&page=${page}`;
      const data = await this.fetchWooAPI(url);
      if (!data || !Array.isArray(data) || data.length === 0) break;
      allItems.push(...data);
      if (data.length < 100) break;
      page++;
    }
    return allItems;
  }

  // Map WooCommerce product schema to our custom Product schema
  private static mapWooProduct(wooProduct: any): Product {
    const getAttribute = (name: string) => {
      const attr = wooProduct.attributes?.find((a: any) => a.name.toLowerCase() === name.toLowerCase());
      return attr ? attr.options[0] : '';
    };
    const getMeta = (key: string) => {
      const meta = wooProduct.meta_data?.find((m: any) => m.key === key);
      return meta ? meta.value : null;
    };

    const categoriesList = Array.isArray(wooProduct.categories)
      ? wooProduct.categories.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
        }))
      : [];

    const tagsList = Array.isArray(wooProduct.tags)
      ? wooProduct.tags.map((t: any) => ({
          id: t.id,
          name: t.name,
          slug: t.slug,
        }))
      : [];

    const isNew =
      getAttribute('New') === 'Yes' ||
      categoriesList.some(
        (c: any) =>
          c.slug.toLowerCase().includes('new-arrival') ||
          c.name.toLowerCase().includes('new arrival') ||
          c.slug.toLowerCase().replace(/[-_]/g, '') === 'newarrivals'
      ) ||
      tagsList.some(
        (t: any) =>
          t.slug.toLowerCase().includes('new-arrival') ||
          t.name.toLowerCase().includes('new arrival') ||
          t.slug.toLowerCase() === 'new'
      ) ||
      wooProduct.name.toLowerCase().includes('new arrival');

    const isCombo =
      getAttribute('Combo') === 'Yes' ||
      wooProduct.name.toLowerCase().includes('combo') ||
      /\bset\b/i.test(wooProduct.name) ||
      wooProduct.name.toLowerCase().includes('combo set') ||
      wooProduct.name.toLowerCase().includes('pendant set') ||
      wooProduct.name.toLowerCase().includes('choker set') ||
      categoriesList.some(
        (c: any) =>
          c.slug.toLowerCase().includes('combo') ||
          c.name.toLowerCase().includes('combo') ||
          c.slug.toLowerCase().includes('set')
      ) ||
      tagsList.some(
        (t: any) =>
          t.slug.toLowerCase().includes('combo') ||
          t.name.toLowerCase().includes('combo') ||
          t.slug.toLowerCase().includes('set')
      );

    const isRental =
      getAttribute('Rental Available') === 'Yes' ||
      getAttribute('Rental') === 'Yes' ||
      categoriesList.some(
        (c: any) =>
          c.slug.toLowerCase().includes('rental') ||
          c.name.toLowerCase().includes('rental') ||
          c.slug.toLowerCase() === 'rent'
      ) ||
      tagsList.some(
        (t: any) =>
          t.slug.toLowerCase().includes('rental') ||
          t.name.toLowerCase().includes('rental') ||
          t.slug.toLowerCase() === 'rent'
      );

    return {
      id: wooProduct.id,
      name: wooProduct.name,
      slug: wooProduct.slug || wooProduct.id?.toString(),
      sku: wooProduct.sku || `SKU-${wooProduct.id}`,
      price: parseFloat(wooProduct.price || '0'),
      regularPrice: parseFloat(wooProduct.regular_price || wooProduct.price || '0'),
      salePrice: wooProduct.sale_price ? parseFloat(wooProduct.sale_price) : undefined,
      onSale: wooProduct.on_sale,
      isNew,
      isBestSeller: getAttribute('Bestseller') === 'Yes',
      isRentalAvailable: isRental,
      rentalPricePerDay: parseFloat(getMeta('_rental_price') || '0'),
      securityDeposit: parseFloat(getMeta('_security_deposit') || '0'),
      isCombo,
      stockStatus: wooProduct.stock_status,
      rating: parseFloat(wooProduct.average_rating || '0'),
      reviewCount: wooProduct.rating_count || 0,
      category: categoriesList[0]?.name || 'Uncategorized',
      categorySlug: categoriesList[0]?.slug || 'uncategorized',
      categories: categoriesList,
      categorySlugs: categoriesList.map((c: any) => c.slug),
      tags: tagsList.map((t: any) => t.name),
      tagSlugs: tagsList.map((t: any) => t.slug),
      jewelleryType: (getAttribute('Jewellery Type') as any) || 'Gold Plated',
      shortDescription: wooProduct.short_description?.replace(/<[^>]+>/g, '') || '',
      description: wooProduct.description?.replace(/<[^>]+>/g, '') || '',
      images: wooProduct.images?.length
        ? wooProduct.images.map((img: any) => ({
            id: img.id,
            src: img.src,
            alt: img.alt || wooProduct.name,
          }))
        : [{ id: 1, src: '/images/placeholder.jpg', alt: wooProduct.name }],
      specifications: {
        material: getAttribute('Material') || '',
        plating: getAttribute('Plating') || '',
        stoneType: getAttribute('Stone Type') || '',
        weight: wooProduct.weight ? `${wooProduct.weight} g` : '',
        dimensions: wooProduct.dimensions
          ? `${wooProduct.dimensions.length}x${wooProduct.dimensions.width}x${wooProduct.dimensions.height}`
          : '',
        careInstructions: getAttribute('Care Instructions') || 'Wipe with soft cloth.',
      },
    };
  }

  // Get All Categories
  static async getCategories(): Promise<Category[]> {
    if (typeof window === 'undefined') {
      const wooCategories = await this.fetchWooAPI('products/categories?per_page=100&hide_empty=false');
      if (wooCategories && Array.isArray(wooCategories) && wooCategories.length > 0) {
        return wooCategories.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description || '',
          image: c.image?.src || '',
          count: c.count,
          featured: c.name.toLowerCase().includes('featured') || c.count > 0,
        }));
      }
    } else {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          return await res.json();
        }
      } catch (e) {
        console.error('Failed to fetch categories on client', e);
      }
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
    let result: Product[] = [];

    // Only attempt real API fetch if on the server
    if (typeof window === 'undefined') {
      let categoryId: number | undefined;
      let categoryMatched = false;

      if (params?.category && params.category !== 'all') {
        const catParam = params.category.toLowerCase().trim();
        const catParamClean = catParam.replace(/[-_]/g, '');

        const catParamAlpha = catParam.replace(/[^a-z0-9]/g, '');
        if (catParam === 'new-arrivals' || catParam === 'new-arrival' || catParamAlpha === 'newarrivals') {
          categoryMatched = true;
        } else if (catParam === 'combos' || catParam === 'combo') {
          categoryMatched = true;
        } else if (catParam === 'rental' || catParamAlpha === 'rental' || catParam === 'rent') {
          categoryMatched = true;
        } else {
          const categories = await this.getCategories();
          const matched = categories.find(
            (c) =>
              c.slug.toLowerCase() === catParam ||
              c.name.toLowerCase() === catParam ||
              c.slug.toLowerCase().replace(/[^a-z0-9]/g, '') === catParamAlpha ||
              c.name.toLowerCase().replace(/[^a-z0-9]/g, '') === catParamAlpha
          );

          if (matched) {
            categoryId = matched.id;
            categoryMatched = true;
          }
        }
      }

      // If category was specified but doesn't exist in WooCommerce, return empty array immediately
      if (params?.category && params.category !== 'all' && !categoryMatched) {
        return [];
      }

      const queryParts: string[] = [];
      if (categoryId !== undefined) {
        queryParts.push(`category=${categoryId}`);
      }
      if (params?.search) {
        queryParts.push(`search=${encodeURIComponent(params.search)}`);
      }

      const query = queryParts.length > 0 ? `products?${queryParts.join('&')}` : 'products';
      const wooProducts = await this.fetchAllWooProducts(query);
      if (wooProducts && Array.isArray(wooProducts) && wooProducts.length > 0) {
        result = wooProducts.map((p) => this.mapWooProduct(p));
      } else {
        result = [];
      }
    } else {
      // Fetch from internal Next.js API route on the client side
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

        const res = await fetch('/api/products?' + queryParams.toString());
        if (res.ok) {
          result = await res.json();
          return result;
        }
      } catch (e) {
        console.error('Failed to fetch products on client', e);
      }
      result = [];
    }

    if (params?.category && params.category !== 'all') {
      const catParam = params.category.toLowerCase().trim();
      const catParamClean = catParam.replace(/[-_]/g, '');

      if (catParam === 'new-arrivals' || catParam === 'new-arrival' || catParamClean === 'newarrivals') {
        result = result.filter((p) => p.isNew);
      } else if (catParam === 'combos' || catParam === 'combo') {
        result = result.filter((p) => p.isCombo);
      } else if (catParam === 'rental' || catParam === 'rent') {
        result = result.filter(
          (p) =>
            p.isRentalAvailable ||
            p.categorySlug?.toLowerCase().includes('rental') ||
            p.categorySlugs?.some((s) => s.toLowerCase().includes('rental') || s.toLowerCase() === 'rent') ||
            p.categories?.some(
              (c) =>
                c.slug.toLowerCase().includes('rental') ||
                c.name.toLowerCase().includes('rental') ||
                c.slug.toLowerCase() === 'rent'
            )
        );
      } else {
        const catParamAlpha = catParam.replace(/[^a-z0-9]/g, '');
        result = result.filter((p) => {
          if (
            p.categorySlug.toLowerCase() === catParam ||
            p.category.toLowerCase() === catParam ||
            p.categorySlug.toLowerCase().replace(/[^a-z0-9]/g, '') === catParamAlpha ||
            p.category.toLowerCase().replace(/[^a-z0-9]/g, '') === catParamAlpha
          ) {
            return true;
          }
          if (
            p.categories &&
            p.categories.some(
              (c) =>
                c.slug.toLowerCase() === catParam ||
                c.name.toLowerCase() === catParam ||
                c.slug.toLowerCase().replace(/[^a-z0-9]/g, '') === catParamAlpha ||
                c.name.toLowerCase().replace(/[^a-z0-9]/g, '') === catParamAlpha
            )
          ) {
            return true;
          }
          if (
            p.categorySlugs &&
            p.categorySlugs.some(
              (s) =>
                s.toLowerCase() === catParam ||
                s.toLowerCase().replace(/[^a-z0-9]/g, '') === catParamAlpha
            )
          ) {
            return true;
          }
          return false;
        });
      }
    }

    if (params?.newArrivalsOnly) {
      result = result.filter((p) => p.isNew);
    }

    if (params?.type && params.type !== 'all') {
      result = result.filter((p) => p.jewelleryType === params.type);
    }

    if (params?.rentalOnly) {
      result = result.filter((p) => p.isRentalAvailable);
    }

    if (params?.combosOnly) {
      result = result.filter((p) => p.isCombo);
    }

    if (params?.minPrice !== undefined) {
      result = result.filter((p) => p.price >= (params.minPrice || 0));
    }

    if (params?.maxPrice !== undefined) {
      result = result.filter((p) => p.price <= (params.maxPrice || Infinity));
    }

    if (params?.sort) {
      switch (params.sort) {
        case 'price-low':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
          break;
        default:
          result.sort((a, b) => b.reviewCount - a.reviewCount);
      }
    }

    return result;
  }

  // Get Single Product by Slug
  static async getProductBySlug(slug: string): Promise<Product | null> {
    if (typeof window === 'undefined') {
      const wooProducts = await this.fetchWooAPI(`products?slug=${slug}`);
      if (wooProducts && Array.isArray(wooProducts) && wooProducts.length > 0) {
        return this.mapWooProduct(wooProducts[0]);
      }
      // Fallback for when slug is actually an ID (if missing in WordPress)
      if (!isNaN(Number(slug))) {
        const productById = await this.fetchWooAPI(`products/${slug}`);
        if (productById && !productById.code) { // Ensure it's not an error response
          return this.mapWooProduct(productById);
        }
      }
    } else {
      try {
        const queryParams = new URLSearchParams();
        queryParams.append('slug', slug);
        const res = await fetch('/api/product?' + queryParams.toString());
        if (res.ok) {
          const product = await res.json();
          return product;
        }
      } catch (e) {
        console.error('Failed to fetch product by slug on client', e);
      }
    }
    return null;
  }

  // Get Rental Products
  static async getRentalProducts(): Promise<Product[]> {
    const products = await this.getProducts();
    let rentals = products.filter(
      (p) =>
        p.isRentalAvailable ||
        p.categorySlug?.toLowerCase().includes('rental') ||
        p.categorySlugs?.some((s) => s.toLowerCase().includes('rental') || s.toLowerCase() === 'rent') ||
        p.categories?.some(
          (c) =>
            c.slug.toLowerCase().includes('rental') ||
            c.name.toLowerCase().includes('rental') ||
            c.slug.toLowerCase() === 'rent'
        )
    );
    if (rentals.length === 0) {
      rentals = products
        .filter((p) => p.price >= 6000)
        .slice(0, 8)
        .map((p) => ({ ...p, isRentalAvailable: true }));
    }
    return rentals;
  }

  // Get Combo Offers
  static async getComboProducts(params?: { category?: string }): Promise<Product[]> {
    const products = await this.getProducts({ combosOnly: true });
    let comboProducts = products.filter((p) => p.isCombo);

    if (comboProducts.length === 0) {
      comboProducts = products.filter((p) => p.price > 10000);
    }

    if (params?.category && params.category !== 'all') {
      const cat = params.category.toLowerCase().trim();
      const catClean = cat.replace(/[-_]/g, '');
      comboProducts = comboProducts.filter(
        (p) =>
          p.categorySlug.toLowerCase() === cat ||
          p.categorySlug.toLowerCase().replace(/[-_]/g, '') === catClean ||
          p.categorySlugs?.some((s) => s.toLowerCase() === cat || s.toLowerCase().replace(/[-_]/g, '') === catClean) ||
          p.categories?.some((c) => c.slug.toLowerCase() === cat || c.name.toLowerCase() === cat)
      );
    }

    return comboProducts;
  }

  // Get New Arrival Products (dynamically matching category or tag)
  static async getNewArrivalProducts(params?: { category?: string }): Promise<Product[]> {
    const allProducts = await this.getProducts();
    let products = allProducts.filter((p) => p.isNew);

    if (products.length === 0) {
      products = [...allProducts].sort((a, b) => b.id - a.id).slice(0, 24);
    }

    if (params?.category && params.category !== 'all') {
      const cat = params.category.toLowerCase().trim();
      const catClean = cat.replace(/[-_]/g, '');
      products = products.filter(
        (p) =>
          p.categorySlug.toLowerCase() === cat ||
          p.categorySlug.toLowerCase().replace(/[-_]/g, '') === catClean ||
          p.categorySlugs?.some((s) => s.toLowerCase() === cat || s.toLowerCase().replace(/[-_]/g, '') === catClean) ||
          p.categories?.some((c) => c.slug.toLowerCase() === cat || c.name.toLowerCase() === cat)
      );
    }

    return products;
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
}
