import { Product, Category } from '@/types';
import prisma from '@/lib/prisma';
import {
  products as wpProducts,
  categories as wpCategories,
  type Product as AdminCatalogProduct,
  type CategoryItem as AdminCatalogCategory,
} from '@/lib/mockData';

const DEFAULT_WP_PRODUCT_IMG =
  'https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000080f081f491e6f783dc620708.png';
const DEFAULT_WP_CATEGORY_IMG =
  'https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000aeb88230a6116622d5b66a95.png';

type RuntimeCatalogState = {
  productsMap: Map<number, AdminCatalogProduct>;
  categoriesMap: Map<number, AdminCatalogCategory>;
  deletedProductIds: Set<number>;
  deletedCategoryIds: Set<number>;
  nextProductId: number;
  nextCategoryId: number;
};

const globalForCatalog = globalThis as unknown as {
  __charmikaCatalog?: RuntimeCatalogState;
};

function getRuntimeCatalog(): RuntimeCatalogState {
  if (!globalForCatalog.__charmikaCatalog) {
    const productsMap = new Map<number, AdminCatalogProduct>();
    let maxProdId = 1000;
    for (const p of wpProducts) {
      productsMap.set(p.id, { ...p });
      if (p.id > maxProdId) maxProdId = p.id;
    }

    const categoriesMap = new Map<number, AdminCatalogCategory>();
    let maxCatId = 100;
    for (const c of wpCategories) {
      categoriesMap.set(c.id, { ...c });
      if (c.id > maxCatId) maxCatId = c.id;
    }

    globalForCatalog.__charmikaCatalog = {
      productsMap,
      categoriesMap,
      deletedProductIds: new Set<number>(),
      deletedCategoryIds: new Set<number>(),
      nextProductId: maxProdId + 1,
      nextCategoryId: maxCatId + 1,
    };
  }
  return globalForCatalog.__charmikaCatalog;
}

function mapDbProductToAdminCatalog(p: any): AdminCatalogProduct {
  const regularPrice = Number(p.regularPrice) || 0;
  const salePrice = p.salePrice ? Number(p.salePrice) : null;
  const images =
    Array.isArray(p.images) && p.images.length > 0
      ? p.images.map((img: any, idx: number) => ({
          id: img.id || idx + 1,
          url: img.imageUrl || img.url || DEFAULT_WP_PRODUCT_IMG,
          isPrimary: Boolean(img.isPrimary ?? idx === 0),
          displayOrder: img.displayOrder ?? idx,
        }))
      : [
          {
            id: 1,
            url: DEFAULT_WP_PRODUCT_IMG,
            isPrimary: true,
            displayOrder: 0,
          },
        ];

  const primaryImg = images.find((i: any) => i.isPrimary)?.url || images[0]?.url || DEFAULT_WP_PRODUCT_IMG;
  const catName = p.category?.name || 'Necklace';
  const catSlug = p.category?.slug || catName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const catId = p.categoryId || p.category?.id || 16;

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku || `CH-${p.id}`,
    category: catName,
    categoryId: catId,
    categorySlug: catSlug,
    categories: [{ id: catId, name: catName, slug: catSlug }],
    regularPrice,
    salePrice,
    costPrice: p.costPrice ? Number(p.costPrice) : undefined,
    stock: Number(p.stock ?? 0),
    status: p.status === 'INACTIVE' || p.status === 'inactive' ? 'inactive' : 'active',
    featured: Boolean(p.featured),
    newArrival: Boolean(p.newArrival ?? true),
    isCombo: /\b(set|combo)\b/i.test(p.name) || catSlug.includes('combo'),
    added: p.createdAt
      ? new Date(p.createdAt).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : '06 Nov 2026',
    shortDescription: p.shortDescription || p.description || `${p.name} — Handcrafted luxury design by Charmika By Lekshmi.`,
    description: p.description || p.shortDescription || `${p.name} — Handcrafted luxury design by Charmika By Lekshmi.`,
    material: p.material || 'Premium Gold Plated Brass',
    jewelleryType: p.jewelleryType || 'Gold Plated',
    weight: p.weight || undefined,
    size: p.size || undefined,
    colour: p.colour || undefined,
    occasion: p.occasion || 'Festive & Bridal',
    collection: p.collection || undefined,
    tags: p.tags || undefined,
    primaryImage: primaryImg,
    images,
  };
}

export async function getUnifiedAdminCategories(): Promise<AdminCatalogCategory[]> {
  const state = getRuntimeCatalog();

  try {
    const dbCategories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { createdAt: 'desc' },
    });

    for (const c of dbCategories) {
      if (state.deletedCategoryIds.has(c.id)) continue;
      state.categoriesMap.set(c.id, {
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description || `Handcrafted ${c.name} collection from Charmika By Lekshmi`,
        image: c.image || state.categoriesMap.get(c.id)?.image || DEFAULT_WP_CATEGORY_IMG,
        status: c.status === 'INACTIVE' ? 'inactive' : 'active',
        products: c._count?.products || state.categoriesMap.get(c.id)?.products || 0,
      });
    }
  } catch {
    // Database not reachable; use runtime catalog initialized from real WordPress categories
  }

  const allProducts = Array.from(state.productsMap.values()).filter(
    (p) => !state.deletedProductIds.has(p.id)
  );

  return Array.from(state.categoriesMap.values())
    .filter((c) => !state.deletedCategoryIds.has(c.id))
    .map((c) => {
      const count = allProducts.filter(
        (p) =>
          p.categoryId === c.id ||
          p.category.toLowerCase() === c.name.toLowerCase() ||
          p.categorySlug?.toLowerCase() === c.slug.toLowerCase() ||
          p.categories?.some(
            (cat) => cat.id === c.id || cat.slug.toLowerCase() === c.slug.toLowerCase()
          )
      ).length;
      return {
        ...c,
        products: count > 0 ? count : c.products,
      };
    });
}

export async function getUnifiedAdminProducts(): Promise<AdminCatalogProduct[]> {
  const state = getRuntimeCatalog();

  try {
    const dbProducts = await prisma.product.findMany({
      include: {
        category: true,
        images: { orderBy: { displayOrder: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });

    for (const dbProd of dbProducts) {
      if (state.deletedProductIds.has(dbProd.id)) continue;
      state.productsMap.set(dbProd.id, mapDbProductToAdminCatalog(dbProd));
    }
  } catch {
    // Database not reachable; use runtime catalog initialized from real WordPress products
  }

  return Array.from(state.productsMap.values())
    .filter((p) => !state.deletedProductIds.has(p.id))
    .sort((a, b) => b.id - a.id);
}

export async function createUnifiedProduct(body: any): Promise<AdminCatalogProduct> {
  const state = getRuntimeCatalog();
  const slug =
    body.slug ||
    body.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  const sku = body.sku || `CH-${Date.now().toString().slice(-6)}`;

  const categories = await getUnifiedAdminCategories();
  const matchedCat =
    categories.find((c) => c.id === Number(body.categoryId)) ||
    categories.find((c) => c.name.toLowerCase() === String(body.category || '').toLowerCase()) ||
    categories[0];

  const rawImages = Array.isArray(body.images) && body.images.length > 0 ? body.images : [];
  const formattedImages =
    rawImages.length > 0
      ? rawImages.map((img: any, idx: number) => ({
          id: idx + 1,
          url: img.url || img.imageUrl || DEFAULT_WP_PRODUCT_IMG,
          isPrimary: Boolean(img.isPrimary ?? idx === 0),
          displayOrder: img.displayOrder ?? idx,
        }))
      : [
          {
            id: 1,
            url: body.primaryImage || DEFAULT_WP_PRODUCT_IMG,
            isPrimary: true,
            displayOrder: 0,
          },
        ];

  const primaryImage =
    formattedImages.find((i: any) => i.isPrimary)?.url ||
    formattedImages[0]?.url ||
    DEFAULT_WP_PRODUCT_IMG;

  let createdId = state.nextProductId++;

  try {
    let dbCat = await prisma.category.findFirst({
      where: {
        OR: [{ id: matchedCat.id }, { slug: matchedCat.slug }, { name: matchedCat.name }],
      },
    });
    if (!dbCat) {
      dbCat = await prisma.category.create({
        data: {
          name: matchedCat.name,
          slug: matchedCat.slug,
          description: matchedCat.description,
          image: matchedCat.image,
          status: 'ACTIVE',
        },
      });
    }

    const dbCreated = await prisma.product.create({
      data: {
        name: body.name,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        sku,
        categoryId: dbCat.id,
        regularPrice: Number(body.regularPrice),
        salePrice: body.salePrice ? Number(body.salePrice) : null,
        costPrice: body.costPrice ? Number(body.costPrice) : null,
        stock: Number(body.stock ?? 1),
        status: body.status === 'inactive' ? 'INACTIVE' : 'ACTIVE',
        featured: Boolean(body.featured ?? true),
        newArrival: Boolean(body.newArrival ?? true),
        shortDescription: body.shortDescription || body.description || null,
        description: body.description || null,
        material: body.material || null,
        jewelleryType: body.jewelleryType || null,
        weight: body.weight || null,
        size: body.size || null,
        colour: body.colour || null,
        occasion: body.occasion || null,
        collection: body.collection || null,
        tags: body.tags || null,
        images: {
          create: formattedImages.map((img: any, idx: number) => ({
            imageUrl: img.url,
            isPrimary: Boolean(img.isPrimary ?? idx === 0),
            displayOrder: img.displayOrder ?? idx,
          })),
        },
      },
      include: { category: true, images: true },
    });
    createdId = dbCreated.id;
  } catch {
    // Fallback to runtime state when DB is read-only or unavailable
  }

  const newProduct: AdminCatalogProduct = {
    id: createdId,
    name: body.name,
    slug,
    sku,
    category: matchedCat.name,
    categoryId: matchedCat.id,
    categorySlug: matchedCat.slug,
    categories: [{ id: matchedCat.id, name: matchedCat.name, slug: matchedCat.slug }],
    regularPrice: Number(body.regularPrice),
    salePrice: body.salePrice ? Number(body.salePrice) : null,
    costPrice: body.costPrice ? Number(body.costPrice) : undefined,
    stock: Number(body.stock ?? 1),
    status: body.status === 'inactive' ? 'inactive' : 'active',
    featured: Boolean(body.featured ?? true),
    newArrival: Boolean(body.newArrival ?? true),
    isCombo: /\b(set|combo)\b/i.test(body.name) || matchedCat.slug.includes('combo'),
    added: new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    shortDescription:
      body.shortDescription ||
      body.description ||
      `${body.name} — Handcrafted luxury design by Charmika By Lekshmi.`,
    description:
      body.description ||
      body.shortDescription ||
      `${body.name} — Handcrafted luxury design by Charmika By Lekshmi.`,
    material: body.material || 'Premium Gold Plated Brass',
    jewelleryType: body.jewelleryType || 'Gold Plated',
    weight: body.weight || undefined,
    size: body.size || undefined,
    colour: body.colour || undefined,
    occasion: body.occasion || 'Festive & Bridal',
    collection: body.collection || undefined,
    tags: body.tags || undefined,
    primaryImage,
    images: formattedImages,
  };

  state.deletedProductIds.delete(createdId);
  state.productsMap.set(createdId, newProduct);
  return newProduct;
}

export async function updateUnifiedProduct(
  id: number,
  body: any
): Promise<AdminCatalogProduct | null> {
  const state = getRuntimeCatalog();
  await getUnifiedAdminProducts();
  const existing = state.productsMap.get(id);
  if (!existing) return null;

  const categories = await getUnifiedAdminCategories();
  const matchedCat =
    categories.find((c) => c.id === Number(body.categoryId)) ||
    categories.find((c) => c.name.toLowerCase() === String(body.category || '').toLowerCase()) ||
    categories.find((c) => c.name.toLowerCase() === existing.category.toLowerCase()) ||
    categories[0];

  const formattedImages =
    Array.isArray(body.images) && body.images.length > 0
      ? body.images.map((img: any, idx: number) => ({
          id: img.id || idx + 1,
          url: img.url || img.imageUrl || DEFAULT_WP_PRODUCT_IMG,
          isPrimary: Boolean(img.isPrimary ?? idx === 0),
          displayOrder: img.displayOrder ?? idx,
        }))
      : existing.images || [
          {
            id: 1,
            url: existing.primaryImage || DEFAULT_WP_PRODUCT_IMG,
            isPrimary: true,
            displayOrder: 0,
          },
        ];

  const primaryImage =
    formattedImages.find((i: any) => i.isPrimary)?.url ||
    formattedImages[0]?.url ||
    existing.primaryImage ||
    DEFAULT_WP_PRODUCT_IMG;

  const updated: AdminCatalogProduct = {
    ...existing,
    name: body.name ?? existing.name,
    slug: body.slug ?? existing.slug,
    sku: body.sku ?? existing.sku,
    category: matchedCat.name,
    categoryId: matchedCat.id,
    categorySlug: matchedCat.slug,
    categories: [{ id: matchedCat.id, name: matchedCat.name, slug: matchedCat.slug }],
    regularPrice:
      body.regularPrice !== undefined ? Number(body.regularPrice) : existing.regularPrice,
    salePrice:
      body.salePrice !== undefined
        ? body.salePrice
          ? Number(body.salePrice)
          : null
        : existing.salePrice,
    stock: body.stock !== undefined ? Number(body.stock) : existing.stock,
    status:
      body.status !== undefined
        ? body.status === 'inactive' || body.status === 'INACTIVE'
          ? 'inactive'
          : 'active'
        : existing.status,
    featured: body.featured !== undefined ? Boolean(body.featured) : existing.featured,
    newArrival: body.newArrival !== undefined ? Boolean(body.newArrival) : existing.newArrival,
    shortDescription:
      body.shortDescription !== undefined
        ? body.shortDescription
        : body.description !== undefined
        ? body.description
        : existing.shortDescription,
    description: body.description !== undefined ? body.description : existing.description,
    material: body.material !== undefined ? body.material : existing.material,
    jewelleryType: body.jewelleryType !== undefined ? body.jewelleryType : existing.jewelleryType,
    occasion: body.occasion !== undefined ? body.occasion : existing.occasion,
    primaryImage,
    images: formattedImages,
  };

  state.productsMap.set(id, updated);

  try {
    await prisma.product.update({
      where: { id },
      data: {
        name: updated.name,
        slug: updated.slug,
        sku: updated.sku,
        regularPrice: updated.regularPrice,
        salePrice: updated.salePrice,
        stock: updated.stock,
        status: updated.status === 'inactive' ? 'INACTIVE' : 'ACTIVE',
        featured: updated.featured,
        newArrival: updated.newArrival,
        shortDescription: updated.shortDescription || null,
        description: updated.description || null,
        material: updated.material || null,
        jewelleryType: updated.jewelleryType || null,
        occasion: updated.occasion || null,
        ...(Array.isArray(body.images)
          ? {
              images: {
                deleteMany: {},
                create: formattedImages.map((img: any, idx: number) => ({
                  imageUrl: img.url,
                  isPrimary: Boolean(img.isPrimary ?? idx === 0),
                  displayOrder: img.displayOrder ?? idx,
                })),
              },
            }
          : {}),
      },
    });
  } catch {
    // Ignore if product only exists in WP catalog / runtime map
  }

  return updated;
}

export async function deleteUnifiedProduct(id: number): Promise<boolean> {
  const state = getRuntimeCatalog();
  state.deletedProductIds.add(id);
  state.productsMap.delete(id);

  try {
    await prisma.product.delete({ where: { id } });
  } catch {
    // Ignore if product was from WP catalog
  }
  return true;
}

export async function createUnifiedCategory(body: any): Promise<AdminCatalogCategory> {
  const state = getRuntimeCatalog();
  const slug =
    body.slug ||
    body.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  let createdId = state.nextCategoryId++;
  try {
    const dbCat = await prisma.category.create({
      data: {
        name: body.name,
        slug,
        description: body.description || null,
        image: body.image || DEFAULT_WP_CATEGORY_IMG,
        status: body.status === 'inactive' ? 'INACTIVE' : 'ACTIVE',
      },
    });
    createdId = dbCat.id;
  } catch {
    // Fallback to runtime state
  }

  const newCat: AdminCatalogCategory = {
    id: createdId,
    name: body.name,
    slug,
    description: body.description || `Handcrafted ${body.name} collection from Charmika By Lekshmi`,
    image: body.image || DEFAULT_WP_CATEGORY_IMG,
    products: 0,
    status: body.status === 'inactive' ? 'inactive' : 'active',
  };

  state.deletedCategoryIds.delete(createdId);
  state.categoriesMap.set(createdId, newCat);
  return newCat;
}

export async function updateUnifiedCategory(
  id: number,
  body: any
): Promise<AdminCatalogCategory | null> {
  const state = getRuntimeCatalog();
  await getUnifiedAdminCategories();
  const existing = state.categoriesMap.get(id);
  if (!existing) return null;

  const updated: AdminCatalogCategory = {
    ...existing,
    name: body.name ?? existing.name,
    slug: body.slug ?? existing.slug,
    description: body.description !== undefined ? body.description : existing.description,
    image: body.image || existing.image || DEFAULT_WP_CATEGORY_IMG,
    status:
      body.status !== undefined
        ? body.status === 'inactive' || body.status === 'INACTIVE'
          ? 'inactive'
          : 'active'
        : existing.status,
  };

  state.categoriesMap.set(id, updated);

  try {
    await prisma.category.update({
      where: { id },
      data: {
        name: updated.name,
        slug: updated.slug,
        description: updated.description,
        image: updated.image,
        status: updated.status === 'inactive' ? 'INACTIVE' : 'ACTIVE',
      },
    });
  } catch {
    // Ignore if category only in runtime map
  }

  return updated;
}

export async function deleteUnifiedCategory(id: number): Promise<boolean> {
  const state = getRuntimeCatalog();
  state.deletedCategoryIds.add(id);
  state.categoriesMap.delete(id);

  try {
    await prisma.category.delete({ where: { id } });
  } catch {
    // Ignore if category only in runtime map
  }
  return true;
}

function mapAdminProductToStorefront(p: AdminCatalogProduct): Product {
  const regularPrice = Number(p.regularPrice) || 0;
  const salePrice = p.salePrice ? Number(p.salePrice) : undefined;
  const price = salePrice && salePrice < regularPrice ? salePrice : regularPrice;
  const onSale = Boolean(salePrice && salePrice < regularPrice);

  const images =
    Array.isArray(p.images) && p.images.length > 0
      ? p.images.map((img, idx) => ({
          id: img.id || idx + 1,
          src: img.url || DEFAULT_WP_PRODUCT_IMG,
          alt: p.name,
        }))
      : [
          {
            id: 1,
            src: p.primaryImage || DEFAULT_WP_PRODUCT_IMG,
            alt: p.name,
          },
        ];

  const categoriesList =
    Array.isArray(p.categories) && p.categories.length > 0
      ? p.categories
      : [
          {
            id: p.categoryId || 16,
            name: p.category || 'Necklace',
            slug:
              p.categorySlug ||
              (p.category || 'necklace').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          },
        ];

  const categorySlug = categoriesList[0].slug;
  const isRental =
    p.jewelleryType?.toLowerCase().includes('rental') ||
    categoriesList.some(
      (c) =>
        c.slug.toLowerCase().includes('rental') ||
        c.name.toLowerCase().includes('rental') ||
        c.slug.toLowerCase() === 'rent'
    );

  const isCombo = Boolean(
    p.isCombo ||
      /\b(set|combo)\b/i.test(p.name) ||
      categoriesList.some((c) => c.slug.toLowerCase().includes('combo'))
  );

  const tagsArray = p.tags
    ? p.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  let jewelleryType: Product['jewelleryType'] = 'Gold Plated';
  if (p.jewelleryType === 'Temple Jewellery' || p.jewelleryType === 'AD Stone' || p.jewelleryType === 'Anti Tarnish' || p.jewelleryType === 'Kundan' || p.jewelleryType === 'Silver Finish') {
    jewelleryType = p.jewelleryType;
  } else if (categoriesList.some((c) => c.slug === 'ad-jewellery' || c.slug === 'diamond-pendant')) {
    jewelleryType = 'AD Stone';
  } else if (categoriesList.some((c) => c.slug === 'anti-tarnish-jewellery')) {
    jewelleryType = 'Anti Tarnish';
  } else if (/temple|lakshmi|lekshmi|palakka|mullamottu|nagapadam|kasu|elakkathali|ilakkathali/i.test(p.name)) {
    jewelleryType = 'Temple Jewellery';
  }

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    price,
    regularPrice,
    salePrice,
    onSale,
    isNew: Boolean(p.newArrival),
    isBestSeller: Boolean(p.featured),
    isRentalAvailable: Boolean(isRental),
    rentalPricePerDay: isRental ? Math.max(299, Math.round(price * 0.15)) : undefined,
    securityDeposit: isRental ? Math.max(1000, Math.round(price * 0.3)) : undefined,
    isCombo,
    comboSaveAmount: onSale ? regularPrice - price : undefined,
    stockStatus: p.stock > 0 ? 'instock' : 'outofstock',
    rating: 4.9,
    reviewCount: 18,
    category: categoriesList[0].name,
    categorySlug,
    categories: categoriesList,
    categorySlugs: categoriesList.map((c) => c.slug),
    tags: tagsArray,
    tagSlugs: tagsArray.map((t) => t.toLowerCase().replace(/\s+/g, '-')),
    jewelleryType,
    shortDescription: p.shortDescription || p.description || p.name,
    description: p.description || p.shortDescription || p.name,
    images,
    specifications: {
      material: p.material || 'Premium Gold Plated Brass',
      plating: '22K Micro Gold Plated',
      stoneType: jewelleryType === 'AD Stone' ? 'AAA+ American Diamond / Kemp' : 'Semi-Precious Kempu & Pearls',
      weight: p.weight || '45g',
      dimensions: p.size || 'Adjustable Free Size',
      careInstructions: 'Keep away from perfume, sprays, and water. Store in a dry jewellery box.',
    },
  };
}

export async function getStoreCategories(): Promise<Category[]> {
  const adminCats = await getUnifiedAdminCategories();
  return adminCats
    .filter((c) => c.status === 'active')
    .map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description || '',
      image: c.image || DEFAULT_WP_CATEGORY_IMG,
      count: c.products || 0,
      featured: (c.products || 0) > 0,
    }));
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
  const adminProducts = await getUnifiedAdminProducts();
  let products = adminProducts
    .filter((p) => p.status === 'active')
    .map(mapAdminProductToStorefront);

  if (params?.category && params.category !== 'all') {
    const cat = params.category.toLowerCase().trim();
    const catClean = cat.replace(/[^a-z0-9]/g, '');

    if (cat === 'new-arrivals' || cat === 'new-arrival' || catClean === 'newarrivals') {
      products = products.filter((p) => p.isNew);
    } else if (cat === 'combos' || cat === 'combo') {
      products = products.filter((p) => p.isCombo);
    } else if (cat === 'rental' || cat === 'rentals' || cat === 'rent') {
      products = products.filter((p) => p.isRentalAvailable);
    } else {
      products = products.filter(
        (p) =>
          p.categorySlug.toLowerCase() === cat ||
          p.category.toLowerCase() === cat ||
          p.categorySlug.toLowerCase().replace(/[^a-z0-9]/g, '') === catClean ||
          p.category.toLowerCase().replace(/[^a-z0-9]/g, '') === catClean ||
          p.categories?.some(
            (c) =>
              c.slug.toLowerCase() === cat ||
              c.name.toLowerCase() === cat ||
              c.slug.toLowerCase().replace(/[^a-z0-9]/g, '') === catClean ||
              c.name.toLowerCase().replace(/[^a-z0-9]/g, '') === catClean
          )
      );
    }
  }

  if (params?.search) {
    const q = params.search.toLowerCase().trim();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  if (params?.type && params.type !== 'all') {
    products = products.filter(
      (p) => p.jewelleryType.toLowerCase() === params.type!.toLowerCase()
    );
  }

  if (params?.rentalOnly) {
    products = products.filter((p) => p.isRentalAvailable);
  }

  if (params?.combosOnly) {
    products = products.filter((p) => p.isCombo);
  }

  if (params?.newArrivalsOnly) {
    products = products.filter((p) => p.isNew);
  }

  if (params?.minPrice !== undefined) {
    products = products.filter((p) => p.price >= params.minPrice!);
  }

  if (params?.maxPrice !== undefined) {
    products = products.filter((p) => p.price <= params.maxPrice!);
  }

  if (params?.sort) {
    if (params.sort === 'price-low') {
      products.sort((a, b) => a.price - b.price);
    } else if (params.sort === 'price-high') {
      products.sort((a, b) => b.price - a.price);
    } else if (params.sort === 'newest') {
      products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0) || b.id - a.id);
    }
  }

  return products;
}

export async function getStoreProductBySlug(slug: string): Promise<Product | null> {
  const all = await getStoreProducts();
  return all.find((p) => p.slug === slug || String(p.id) === slug) || null;
}
