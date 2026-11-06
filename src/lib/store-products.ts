import prisma from '@/lib/prisma';
import { Product, Category } from '@/types';
import { products as mockDataProducts, categories as mockDataCategories } from '@/lib/mockData';

const DEFAULT_IMAGE = '/images/long-haarams.png';

const fallbackCategoryImages: Record<string, string> = {
  chokers: '/images/chokers.png',
  haarams: '/images/long-haarams.png',
  nakshi: '/images/temple-jewellery.png',
  rentals: '/images/temple-jewellery.png',
  bangles: '/images/long-haarams.png',
};

export function formatDbProductToStore(p: any): Product {
  const images =
    p.images && p.images.length > 0
      ? p.images.map((img: any, idx: number) => ({
          id: img.id || idx + 1,
          src: img.imageUrl || DEFAULT_IMAGE,
          alt: p.name,
        }))
      : [
          {
            id: 1,
            src: fallbackCategoryImages[p.category?.slug?.toLowerCase()] || DEFAULT_IMAGE,
            alt: p.name,
          },
        ];

  const regPrice = Number(p.regularPrice || 0);
  const salePriceNum = p.salePrice !== null && p.salePrice !== undefined ? Number(p.salePrice) : undefined;
  const currentPrice = salePriceNum && salePriceNum < regPrice ? salePriceNum : regPrice;
  const onSale = Boolean(salePriceNum && salePriceNum < regPrice);

  const catName = p.category?.name || 'Jewellery';
  const catSlug = p.category?.slug || 'jewellery';

  const tagsList = p.tags ? p.tags.split(',').map((t: string) => t.trim()) : [];
  const tagSlugs = tagsList.map((t: string) => t.toLowerCase().replace(/[^a-z0-9]/g, '-'));

  const isCombo =
    tagsList.some((t: string) => t.toLowerCase().includes('combo') || t.toLowerCase().includes('set')) ||
    catSlug.toLowerCase().includes('combo') ||
    p.name.toLowerCase().includes('combo') ||
    p.name.toLowerCase().includes('set');

  const isRental =
    tagsList.some((t: string) => t.toLowerCase().includes('rental') || t.toLowerCase() === 'rent') ||
    catSlug.toLowerCase().includes('rental') ||
    catSlug.toLowerCase().includes('rent') ||
    p.name.toLowerCase().includes('rental');

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku || `CH-${p.id}`,
    price: currentPrice,
    regularPrice: regPrice,
    salePrice: salePriceNum,
    onSale,
    isNew: Boolean(p.newArrival),
    isBestSeller: Boolean(p.featured),
    isRentalAvailable: isRental,
    rentalPricePerDay: isRental ? Math.round(currentPrice * 0.15) : undefined,
    securityDeposit: isRental ? Math.round(currentPrice * 0.5) : undefined,
    isCombo,
    stockStatus: p.stock > 0 ? 'instock' : 'outofstock',
    rating: 4.9,
    reviewCount: 14 + (p.id % 20),
    category: catName,
    categorySlug: catSlug,
    categories: [{ id: p.categoryId || 1, name: catName, slug: catSlug }],
    categorySlugs: [catSlug],
    tags: tagsList,
    tagSlugs,
    jewelleryType: (p.jewelleryType as any) || 'Gold Plated',
    shortDescription: p.shortDescription || p.description?.substring(0, 160) || '',
    description: p.description || p.shortDescription || '',
    images,
    specifications: {
      material: p.material || 'Brass / Copper Antique Alloy',
      plating: 'Premium Micro Gold Plated Finish',
      stoneType: 'Semi-Precious Gemstones / Kemp / AD',
      weight: p.weight || 'Standard Weight',
      dimensions: p.size || 'Free Size / Adjustable',
      careInstructions: 'Keep away from moisture, perfumes and chemicals. Store in a zip-lock pouch after use.',
    },
  };
}

export function formatMockProductToStore(p: any): Product {
  const regPrice = Number(p.regularPrice || 0);
  const salePriceNum = p.salePrice !== null && p.salePrice !== undefined ? Number(p.salePrice) : undefined;
  const currentPrice = salePriceNum && salePriceNum < regPrice ? salePriceNum : regPrice;
  const onSale = Boolean(salePriceNum && salePriceNum < regPrice);

  const catSlug = p.category ? p.category.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'jewellery';
  const imgUrl = fallbackCategoryImages[catSlug] || DEFAULT_IMAGE;

  const tagsList = p.tags ? p.tags.split(',').map((t: string) => t.trim()) : [];
  const tagSlugs = tagsList.map((t: string) => t.toLowerCase().replace(/[^a-z0-9]/g, '-'));

  const isRental = catSlug.includes('rental') || tagsList.some((t: string) => t.toLowerCase().includes('rental'));
  const isCombo = tagsList.some((t: string) => t.toLowerCase().includes('combo') || t.toLowerCase().includes('set'));

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku || `CH-${p.id}`,
    price: currentPrice,
    regularPrice: regPrice,
    salePrice: salePriceNum,
    onSale,
    isNew: Boolean(p.newArrival),
    isBestSeller: Boolean(p.featured),
    isRentalAvailable: isRental,
    rentalPricePerDay: isRental ? Math.round(currentPrice * 0.15) : undefined,
    securityDeposit: isRental ? Math.round(currentPrice * 0.5) : undefined,
    isCombo,
    stockStatus: p.stock > 0 ? 'instock' : 'outofstock',
    rating: 4.9,
    reviewCount: 16,
    category: p.category,
    categorySlug: catSlug,
    categories: [{ id: p.id, name: p.category, slug: catSlug }],
    categorySlugs: [catSlug],
    tags: tagsList,
    tagSlugs,
    jewelleryType: (p.jewelleryType as any) || 'Gold Plated',
    shortDescription: p.shortDescription || p.description || '',
    description: p.description || p.shortDescription || '',
    images: [{ id: 1, src: imgUrl, alt: p.name }],
    specifications: {
      material: p.material || 'Antique Gold Plated Alloy',
      plating: 'Premium Micro Gold Plated Finish',
      stoneType: 'Semi-Precious Gemstones / Kemp / AD',
      weight: p.weight || 'Standard Weight',
      dimensions: p.size || 'Free Size / Adjustable',
      careInstructions: 'Keep away from moisture, perfumes and chemicals. Store in a zip-lock pouch after use.',
    },
  };
}

export async function getStoreProducts(params?: {
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
  try {
    const where: any = {
      status: 'ACTIVE',
    };

    if (params?.search && params.search.trim()) {
      const q = params.search.trim();
      where.OR = [
        { name: { contains: q } },
        { sku: { contains: q } },
        { description: { contains: q } },
      ];
    }

    if (params?.category && params.category !== 'all') {
      const cat = params.category.toLowerCase().trim();
      where.category = {
        OR: [{ slug: cat }, { name: { contains: cat } }],
      };
    }

    let orderBy: any = { id: 'desc' };
    if (params?.sort === 'price-low') {
      orderBy = { regularPrice: 'asc' };
    } else if (params?.sort === 'price-high') {
      orderBy = { regularPrice: 'desc' };
    } else if (params?.sort === 'newest') {
      orderBy = { createdAt: 'desc' };
    }

    const dbProducts = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: true,
        images: {
          orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }],
        },
      },
    });

    if (dbProducts && dbProducts.length > 0) {
      let results = dbProducts.map(formatDbProductToStore);

      if (params?.rentalOnly) {
        results = results.filter((p) => p.isRentalAvailable);
      }
      if (params?.combosOnly) {
        results = results.filter((p) => p.isCombo);
      }
      if (params?.newArrivalsOnly) {
        results = results.filter((p) => p.isNew);
      }
      if (params?.type && params.type !== 'all') {
        results = results.filter((p) => p.jewelleryType === params.type);
      }
      if (params?.minPrice !== undefined) {
        results = results.filter((p) => p.price >= (params.minPrice || 0));
      }
      if (params?.maxPrice !== undefined) {
        results = results.filter((p) => p.price <= (params.maxPrice || Infinity));
      }

      return results;
    }
  } catch (err) {
    console.warn('Prisma getStoreProducts fallback to mockData:', err);
  }

  // Fallback to mock data if DB empty or unavailable
  let mockResults = mockDataProducts.map(formatMockProductToStore);

  if (params?.category && params.category !== 'all') {
    const cat = params.category.toLowerCase().trim();
    mockResults = mockResults.filter(
      (p) =>
        p.categorySlug === cat ||
        p.category.toLowerCase() === cat ||
        p.categorySlug.replace(/[-_]/g, '') === cat.replace(/[-_]/g, '')
    );
  }

  if (params?.rentalOnly) {
    mockResults = mockResults.filter((p) => p.isRentalAvailable);
  }
  if (params?.combosOnly) {
    mockResults = mockResults.filter((p) => p.isCombo);
  }
  if (params?.newArrivalsOnly) {
    mockResults = mockResults.filter((p) => p.isNew);
  }
  if (params?.minPrice !== undefined) {
    mockResults = mockResults.filter((p) => p.price >= (params.minPrice || 0));
  }
  if (params?.maxPrice !== undefined) {
    mockResults = mockResults.filter((p) => p.price <= (params.maxPrice || Infinity));
  }

  return mockResults;
}

export async function getStoreProductBySlug(slug: string): Promise<Product | null> {
  try {
    const prod = await prisma.product.findFirst({
      where: {
        OR: [{ slug }, !isNaN(Number(slug)) ? { id: Number(slug) } : { slug }],
      },
      include: {
        category: true,
        images: {
          orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }],
        },
      },
    });

    if (prod) {
      return formatDbProductToStore(prod);
    }
  } catch (err) {
    console.warn('Prisma getStoreProductBySlug fallback to mockData:', err);
  }

  const mock = mockDataProducts.find(
    (p) => p.slug === slug || String(p.id) === slug
  );
  if (mock) {
    return formatMockProductToStore(mock);
  }

  return null;
}

export async function getStoreCategories(): Promise<Category[]> {
  try {
    const dbCats = await prisma.category.findMany({
      where: { status: 'ACTIVE' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (dbCats && dbCats.length > 0) {
      return dbCats.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description || '',
        image: c.image || fallbackCategoryImages[c.slug.toLowerCase()] || DEFAULT_IMAGE,
        count: c._count.products,
        featured: c._count.products > 0,
      }));
    }
  } catch (err) {
    console.warn('Prisma getStoreCategories fallback to mockData:', err);
  }

  return mockDataCategories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    image: fallbackCategoryImages[c.slug] || DEFAULT_IMAGE,
    count: c.products,
    featured: c.status === 'active',
  }));
}
