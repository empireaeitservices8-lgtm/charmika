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


export type UnifiedOrderItem = {
  id: number;
  productId: number;
  productName: string;
  sku: string;
  variant: string;
  jewelleryType: string;
  productImage: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  currentStock: number | null;
};

export type UnifiedOrder = {
  id: number;
  orderNumber: string;
  customerId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerStatus: string;
  subtotal: number;
  deliveryCharge: number;
  tax: number;
  discount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  stockDeducted: boolean;
  shippingAddress: string;
  billingAddress: string;
  customerNotes: string;
  couponCode: string | null;
  transactionId: string | null;
  itemsCount: number;
  items: UnifiedOrderItem[];
  statusHistory: {
    id: number;
    prevStatus: string | null;
    newStatus: string;
    comment: string;
    updatedBy: string;
    date: string;
  }[];
  createdAt: string;
  formattedDate: string;
  updatedAt: string;
  formattedUpdatedAt: string;
};

const globalForOrders = globalThis as unknown as {
  __charmikaOrders?: Map<number, UnifiedOrder>;
  __charmikaNextOrderId?: number;
};

function getRuntimeOrders(): Map<number, UnifiedOrder> {
  if (!globalForOrders.__charmikaOrders) {
    globalForOrders.__charmikaOrders = new Map<number, UnifiedOrder>();
    globalForOrders.__charmikaNextOrderId = 1001;
  }
  return globalForOrders.__charmikaOrders;
}

function formatDateTime(d: Date | string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(d));
}

export async function createUnifiedOrder(body: any): Promise<UnifiedOrder> {
  const ordersMap = getRuntimeOrders();
  const allProducts = await getUnifiedAdminProducts();
  const billing = body.billing || {};
  const shipping = body.shipping || billing;
  const lineItems = Array.isArray(body.line_items) ? body.line_items : [];

  const items: UnifiedOrderItem[] = lineItems.map((li: any, idx: number) => {
    const prod = allProducts.find((p) => p.id === Number(li.productId));
    const unitPrice = prod ? Number(prod.salePrice ?? prod.regularPrice) : Number(li.price || 499);
    const qty = Math.max(1, Number(li.quantity) || 1);
    return {
      id: idx + 1,
      productId: Number(li.productId) || (prod ? prod.id : 1),
      productName: prod?.name || li.name || 'Charmika Jewellery Piece',
      sku: prod?.sku || `CH-${li.productId || idx + 1}`,
      variant: li.isRental ? `Rental (${li.rentalDurationDays || 3} Days)` : 'Standard Size',
      jewelleryType: prod?.jewelleryType || 'Gold Plated',
      productImage: prod?.primaryImage || prod?.images?.[0]?.url || DEFAULT_WP_PRODUCT_IMG,
      quantity: qty,
      unitPrice,
      subtotal: unitPrice * qty,
      currentStock: prod?.stock ?? 10,
    };
  });

  const subtotal = items.reduce((sum, i) => sum + i.subtotal, 0);
  const deliveryCharge = Number(body.shipping_total ?? (subtotal >= 2000 ? 0 : 80));
  const discount = Number(body.discount ?? 0);
  const totalAmount = Math.max(1, subtotal + deliveryCharge - discount);

  let orderId = (globalForOrders.__charmikaNextOrderId = (globalForOrders.__charmikaNextOrderId || 1000) + 1);
  let orderNumber = `ORD-${orderId}`;
  let customerId = orderId;

  const customerName = `${billing.firstName || ''} ${billing.lastName || ''}`.trim() || 'Guest Customer';
  const customerEmail = (billing.email || 'guest@charmika.com').trim();
  const customerPhone = (billing.phone || '').trim();
  const fullShippingAddr = [
    shipping.addressLine1,
    shipping.addressLine2,
    shipping.city,
    shipping.state,
    shipping.pincode,
    shipping.country || 'India',
  ]
    .filter(Boolean)
    .join(', ');

  try {
    let dbCustomer = await prisma.customer.findUnique({ where: { email: customerEmail } });
    if (!dbCustomer) {
      dbCustomer = await prisma.customer.create({
        data: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          status: 'active',
          address: shipping.addressLine1 || '',
          city: shipping.city || '',
          state: shipping.state || '',
          postalCode: shipping.pincode || '',
        },
      });
    }
    customerId = dbCustomer.id;

    const dbOrder = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
        customerId: dbCustomer.id,
        subtotal,
        deliveryCharge,
        tax: 0,
        discount,
        totalAmount,
        paymentMethod: body.payment_method || 'payu',
        paymentStatus: 'pending',
        orderStatus: 'pending',
        shippingAddress: fullShippingAddr,
        billingAddress: fullShippingAddr,
        customerNotes: body.customer_note || '',
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            sku: item.sku,
            variant: item.variant,
            jewelleryType: item.jewelleryType,
            productImage: item.productImage,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.subtotal,
          })),
        },
      },
    });
    orderId = dbOrder.id;
    orderNumber = dbOrder.orderNumber;
  } catch {
    // Fallback to runtime store when DB is not connected
  }

  const nowIso = new Date().toISOString();
  const newOrder: UnifiedOrder = {
    id: orderId,
    orderNumber,
    customerId,
    customerName,
    customerEmail,
    customerPhone,
    customerStatus: 'active',
    subtotal,
    deliveryCharge,
    tax: 0,
    discount,
    totalAmount,
    paymentMethod: body.payment_method || 'payu',
    paymentStatus: 'pending',
    orderStatus: 'pending',
    stockDeducted: false,
    shippingAddress: fullShippingAddr,
    billingAddress: fullShippingAddr,
    customerNotes: body.customer_note || '',
    couponCode: null,
    transactionId: null,
    itemsCount: items.reduce((s, i) => s + i.quantity, 0),
    items,
    statusHistory: [
      {
        id: 1,
        prevStatus: null,
        newStatus: 'pending',
        comment: 'Order created at checkout',
        updatedBy: 'System',
        date: formatDateTime(nowIso),
      },
    ],
    createdAt: nowIso,
    formattedDate: formatDateTime(nowIso),
    updatedAt: nowIso,
    formattedUpdatedAt: formatDateTime(nowIso),
  };

  ordersMap.set(orderId, newOrder);
  return newOrder;
}

export async function updateUnifiedOrderStatus(
  id: number,
  updates: { orderStatus?: string; paymentStatus?: string; transactionId?: string; comment?: string }
): Promise<UnifiedOrder | null> {
  const ordersMap = getRuntimeOrders();
  const existing = ordersMap.get(id);

  if (existing) {
    const prevStatus = existing.orderStatus;
    const newStatus = updates.orderStatus || existing.orderStatus;
    const nowIso = new Date().toISOString();
    const updated: UnifiedOrder = {
      ...existing,
      orderStatus: newStatus,
      paymentStatus: updates.paymentStatus || existing.paymentStatus,
      transactionId: updates.transactionId || existing.transactionId,
      updatedAt: nowIso,
      formattedUpdatedAt: formatDateTime(nowIso),
      statusHistory: [
        {
          id: existing.statusHistory.length + 1,
          prevStatus,
          newStatus,
          comment: updates.comment || `Order status updated to ${newStatus}`,
          updatedBy: 'Admin',
          date: formatDateTime(nowIso),
        },
        ...existing.statusHistory,
      ],
    };
    ordersMap.set(id, updated);
  }

  try {
    await prisma.order.update({
      where: { id },
      data: {
        ...(updates.orderStatus ? { orderStatus: updates.orderStatus } : {}),
        ...(updates.paymentStatus ? { paymentStatus: updates.paymentStatus } : {}),
        ...(updates.transactionId ? { transactionId: updates.transactionId } : {}),
      },
    });
  } catch {
    // Ignore when DB is not connected
  }

  return ordersMap.get(id) || null;
}

export async function getUnifiedOrders(): Promise<UnifiedOrder[]> {
  const ordersMap = getRuntimeOrders();

  try {
    const dbOrders = await prisma.order.findMany({
      include: {
        customer: true,
        items: true,
        statusHistory: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    });

    for (const o of dbOrders) {
      ordersMap.set(o.id, {
        id: o.id,
        orderNumber: o.orderNumber,
        customerId: o.customerId,
        customerName: o.customer?.name || 'Customer',
        customerEmail: o.customer?.email || '',
        customerPhone: o.customer?.phone || '',
        customerStatus: o.customer?.status || 'active',
        subtotal: Number(o.subtotal),
        deliveryCharge: Number(o.deliveryCharge),
        tax: Number(o.tax),
        discount: Number(o.discount),
        totalAmount: Number(o.totalAmount),
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        orderStatus: o.orderStatus,
        stockDeducted: o.stockDeducted,
        shippingAddress: o.shippingAddress || '',
        billingAddress: o.billingAddress || o.shippingAddress || '',
        customerNotes: o.customerNotes || '',
        couponCode: o.couponCode || null,
        transactionId: o.transactionId || null,
        itemsCount: o.items ? o.items.reduce((acc, i) => acc + i.quantity, 0) : 0,
        items: (o.items || []).map((i) => ({
          id: i.id,
          productId: i.productId,
          productName: i.productName || 'Product',
          sku: i.sku || '',
          variant: i.variant || 'Standard Size',
          jewelleryType: i.jewelleryType || 'Jewellery',
          productImage: i.productImage || DEFAULT_WP_PRODUCT_IMG,
          quantity: i.quantity,
          unitPrice: Number(i.unitPrice),
          subtotal: Number(i.subtotal),
          currentStock: 10,
        })),
        statusHistory: (o.statusHistory || []).map((h) => ({
          id: h.id,
          prevStatus: h.prevStatus,
          newStatus: h.newStatus,
          comment: h.comment || '',
          updatedBy: h.updatedBy || 'Admin',
          date: formatDateTime(h.createdAt),
        })),
        createdAt: o.createdAt.toISOString(),
        formattedDate: formatDateTime(o.createdAt),
        updatedAt: o.updatedAt.toISOString(),
        formattedUpdatedAt: formatDateTime(o.updatedAt),
      });
    }
  } catch {
    // Database not connected; use runtime orders map
  }

  return Array.from(ordersMap.values()).sort((a, b) => b.id - a.id);
}
