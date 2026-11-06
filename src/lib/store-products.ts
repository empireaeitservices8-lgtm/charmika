import { Product, Category } from '@/types';
import prisma from '@/lib/prisma';
import {
  products as wpProducts,
  categories as wpCategories,
  type Product as AdminCatalogProduct,
  type CategoryItem as AdminCatalogCategory,
} from '@/lib/mockData';
import { readCloudDelta, writeCloudDelta } from '@/lib/cloud-store';

const DEFAULT_WP_PRODUCT_IMG =
  'https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000080f081f491e6f783dc620708.png';
const DEFAULT_WP_CATEGORY_IMG =
  'https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000aeb88230a6116622d5b66a95.png';

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
  shippingDetails?: {
    firstName?: string;
    lastName?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
    phone?: string;
    email?: string;
  };
  shiprocketOrderId?: number | string | null;
  shiprocketShipmentId?: number | string | null;
  awbCode?: string | null;
  courierName?: string | null;
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

function formatDateTime(d: Date | string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(d));
}

export async function getUnifiedAdminCategories(): Promise<AdminCatalogCategory[]> {
  const delta = await readCloudDelta();
  const deletedCatSet = new Set(delta.deletedCategoryIds || []);
  const deletedProdSet = new Set(delta.deletedProductIds || []);

  const categoriesMap = new Map<number, AdminCatalogCategory>();
  for (const c of wpCategories) {
    if (!deletedCatSet.has(c.id)) {
      categoriesMap.set(c.id, { ...c });
    }
  }

  for (const [idStr, cat] of Object.entries(delta.upsertedCategories || {})) {
    const id = Number(idStr);
    if (!deletedCatSet.has(id) && cat) {
      categoriesMap.set(id, cat as AdminCatalogCategory);
    }
  }

  const productsMap = new Map<number, AdminCatalogProduct>();
  for (const p of wpProducts) {
    if (!deletedProdSet.has(p.id)) {
      productsMap.set(p.id, p);
    }
  }
  for (const [idStr, prod] of Object.entries(delta.upsertedProducts || {})) {
    const id = Number(idStr);
    if (!deletedProdSet.has(id) && prod) {
      productsMap.set(id, prod as AdminCatalogProduct);
    }
  }

  const allProducts = Array.from(productsMap.values());

  return Array.from(categoriesMap.values()).map((c) => {
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
      products: count,
    };
  });
}

export async function getUnifiedAdminProducts(): Promise<AdminCatalogProduct[]> {
  const delta = await readCloudDelta();
  const deletedSet = new Set(delta.deletedProductIds || []);

  const productsMap = new Map<number, AdminCatalogProduct>();
  for (const p of wpProducts) {
    if (!deletedSet.has(p.id)) {
      productsMap.set(p.id, { ...p });
    }
  }

  for (const [idStr, prod] of Object.entries(delta.upsertedProducts || {})) {
    const id = Number(idStr);
    if (!deletedSet.has(id) && prod) {
      productsMap.set(id, prod as AdminCatalogProduct);
    }
  }

  return Array.from(productsMap.values()).sort((a, b) => b.id - a.id);
}

export async function createUnifiedProduct(body: any): Promise<AdminCatalogProduct> {
  const delta = await readCloudDelta();
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

  const createdId = delta.nextProductId || 2000;
  delta.nextProductId = createdId + 1;

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

  delta.deletedProductIds = (delta.deletedProductIds || []).filter((id) => id !== createdId);
  delta.upsertedProducts = {
    ...(delta.upsertedProducts || {}),
    [createdId]: newProduct,
  };

  await writeCloudDelta(delta);

  try {
    await prisma.product.create({
      data: {
        name: newProduct.name,
        slug: `${newProduct.slug}-${createdId}`,
        sku: newProduct.sku,
        categoryId: matchedCat.id,
        regularPrice: newProduct.regularPrice,
        salePrice: newProduct.salePrice,
        stock: newProduct.stock,
        status: newProduct.status === 'inactive' ? 'INACTIVE' : 'ACTIVE',
        featured: newProduct.featured,
        newArrival: newProduct.newArrival,
        shortDescription: newProduct.shortDescription || null,
        description: newProduct.description || null,
        material: newProduct.material || null,
        jewelleryType: newProduct.jewelleryType || null,
        occasion: newProduct.occasion || null,
      },
    });
  } catch {
    // Ignore when local MySQL is not running
  }

  return newProduct;
}

export async function updateUnifiedProduct(
  id: number,
  body: any
): Promise<AdminCatalogProduct | null> {
  const allProducts = await getUnifiedAdminProducts();
  const existing = allProducts.find((p) => p.id === id);
  if (!existing) return null;

  const delta = await readCloudDelta();
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

  delta.upsertedProducts = {
    ...(delta.upsertedProducts || {}),
    [id]: updated,
  };
  await writeCloudDelta(delta);

  return updated;
}

export async function deleteUnifiedProduct(id: number): Promise<boolean> {
  const delta = await readCloudDelta();
  const deletedSet = new Set(delta.deletedProductIds || []);
  deletedSet.add(id);
  delta.deletedProductIds = Array.from(deletedSet);

  if (delta.upsertedProducts && delta.upsertedProducts[id]) {
    delete delta.upsertedProducts[id];
  }

  await writeCloudDelta(delta);
  return true;
}

export async function createUnifiedCategory(body: any): Promise<AdminCatalogCategory> {
  const delta = await readCloudDelta();
  const slug =
    body.slug ||
    body.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const createdId = delta.nextCategoryId || 200;
  delta.nextCategoryId = createdId + 1;

  const newCat: AdminCatalogCategory = {
    id: createdId,
    name: body.name,
    slug,
    description: body.description || `Handcrafted ${body.name} collection from Charmika By Lekshmi`,
    image: body.image || DEFAULT_WP_CATEGORY_IMG,
    products: 0,
    status: body.status === 'inactive' ? 'inactive' : 'active',
  };

  delta.deletedCategoryIds = (delta.deletedCategoryIds || []).filter((id) => id !== createdId);
  delta.upsertedCategories = {
    ...(delta.upsertedCategories || {}),
    [createdId]: newCat,
  };

  await writeCloudDelta(delta);
  return newCat;
}

export async function updateUnifiedCategory(
  id: number,
  body: any
): Promise<AdminCatalogCategory | null> {
  const allCats = await getUnifiedAdminCategories();
  const existing = allCats.find((c) => c.id === id);
  if (!existing) return null;

  const delta = await readCloudDelta();
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

  delta.upsertedCategories = {
    ...(delta.upsertedCategories || {}),
    [id]: updated,
  };
  await writeCloudDelta(delta);
  return updated;
}

export async function deleteUnifiedCategory(id: number): Promise<boolean> {
  const delta = await readCloudDelta();
  const deletedSet = new Set(delta.deletedCategoryIds || []);
  deletedSet.add(id);
  delta.deletedCategoryIds = Array.from(deletedSet);

  if (delta.upsertedCategories && delta.upsertedCategories[id]) {
    delete delta.upsertedCategories[id];
  }

  await writeCloudDelta(delta);
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
  if (
    p.jewelleryType === 'Temple Jewellery' ||
    p.jewelleryType === 'AD Stone' ||
    p.jewelleryType === 'Anti Tarnish' ||
    p.jewelleryType === 'Kundan' ||
    p.jewelleryType === 'Silver Finish'
  ) {
    jewelleryType = p.jewelleryType;
  } else if (
    categoriesList.some((c) => c.slug === 'ad-jewellery' || c.slug === 'diamond-pendant')
  ) {
    jewelleryType = 'AD Stone';
  } else if (categoriesList.some((c) => c.slug === 'anti-tarnish-jewellery')) {
    jewelleryType = 'Anti Tarnish';
  } else if (
    /temple|lakshmi|lekshmi|palakka|mullamottu|nagapadam|kasu|elakkathali|ilakkathali/i.test(
      p.name
    )
  ) {
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
      stoneType:
        jewelleryType === 'AD Stone'
          ? 'AAA+ American Diamond / Kemp'
          : 'Semi-Precious Kempu & Pearls',
      weight: p.weight || '45g',
      dimensions: p.size || 'Adjustable Free Size',
      careInstructions:
        'Keep away from perfume, sprays, and water. Store in a dry jewellery box.',
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

export async function createUnifiedOrder(body: any): Promise<UnifiedOrder> {
  const delta = await readCloudDelta();
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

  const orderId = delta.nextOrderId || 1001;
  delta.nextOrderId = orderId + 1;
  const orderNumber = `ORD-${orderId}`;

  const customerName =
    `${billing.firstName || ''} ${billing.lastName || ''}`.trim() || 'Guest Customer';
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

  const nowIso = new Date().toISOString();
  const newOrder: UnifiedOrder = {
    id: orderId,
    orderNumber,
    customerId: orderId,
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
    shippingDetails: {
      firstName: shipping.firstName || billing.firstName || '',
      lastName: shipping.lastName || billing.lastName || '',
      addressLine1: shipping.addressLine1 || billing.addressLine1 || '',
      addressLine2: shipping.addressLine2 || billing.addressLine2 || '',
      city: shipping.city || billing.city || '',
      state: shipping.state || billing.state || '',
      pincode: shipping.pincode || billing.pincode || '',
      country: shipping.country || 'India',
      phone: shipping.phone || billing.phone || '',
      email: billing.email || '',
    },
    shiprocketOrderId: null,
    shiprocketShipmentId: null,
    awbCode: null,
    courierName: null,
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

  delta.upsertedOrders = {
    ...(delta.upsertedOrders || {}),
    [orderId]: newOrder,
  };
  await writeCloudDelta(delta);

  return newOrder;
}

export async function updateUnifiedOrderStatus(
  id: number,
  updates: {
    orderStatus?: string;
    paymentStatus?: string;
    transactionId?: string;
    comment?: string;
    shiprocketOrderId?: number | string | null;
    shipmentId?: number | string | null;
    awbCode?: string | null;
    courierName?: string | null;
  }
): Promise<UnifiedOrder | null> {
  const delta = await readCloudDelta();
  const existing = (delta.upsertedOrders || {})[id] as UnifiedOrder | undefined;
  if (!existing) return null;

  const prevStatus = existing.orderStatus;
  const newStatus = updates.orderStatus || existing.orderStatus;
  const nowIso = new Date().toISOString();
  const updated: UnifiedOrder = {
    ...existing,
    orderStatus: newStatus,
    paymentStatus: updates.paymentStatus || existing.paymentStatus,
    transactionId: updates.transactionId || existing.transactionId,
    shiprocketOrderId: updates.shiprocketOrderId !== undefined ? updates.shiprocketOrderId : existing.shiprocketOrderId,
    shiprocketShipmentId: updates.shipmentId !== undefined ? updates.shipmentId : existing.shiprocketShipmentId,
    awbCode: updates.awbCode !== undefined ? updates.awbCode : existing.awbCode,
    courierName: updates.courierName !== undefined ? updates.courierName : existing.courierName,
    updatedAt: nowIso,
    formattedUpdatedAt: formatDateTime(nowIso),
    statusHistory: [
      {
        id: (existing.statusHistory?.length || 0) + 1,
        prevStatus,
        newStatus,
        comment: updates.comment || `Order status updated to ${newStatus}`,
        updatedBy: 'Admin',
        date: formatDateTime(nowIso),
      },
      ...(existing.statusHistory || []),
    ],
  };

  delta.upsertedOrders = {
    ...(delta.upsertedOrders || {}),
    [id]: updated,
  };
  await writeCloudDelta(delta);

  return updated;
}

export async function getUnifiedOrderById(id: number): Promise<UnifiedOrder | null> {
  const delta = await readCloudDelta();
  const existing = (delta.upsertedOrders || {})[id] as UnifiedOrder | undefined;
  return existing || null;
}

export async function getUnifiedOrders(): Promise<UnifiedOrder[]> {
  const delta = await readCloudDelta();
  const orders = Object.values(delta.upsertedOrders || {}) as UnifiedOrder[];
  return orders.sort((a, b) => b.id - a.id);
}
