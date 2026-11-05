export type Product = {
  id: number;
  name: string;
  slug: string;
  sku: string;
  category: string;
  regularPrice: number;
  salePrice: number | null;
  stock: number;
  status: "active" | "inactive";
  featured: boolean;
  newArrival: boolean;
  added: string;
  shortDescription?: string;
  description?: string;
  costPrice?: number;
  material?: string;
  jewelleryType?: string;
  weight?: string;
  size?: string;
  colour?: string;
  occasion?: string;
  collection?: string;
  tags?: string;
};

export const categories = [
  { id: 1, name: "Chokers", slug: "chokers", description: "Statement chokers and short necklaces", products: 6, status: "active" },
  { id: 2, name: "Haarams", slug: "haarams", description: "Long traditional haarams and mala sets", products: 8, status: "active" },
  { id: 3, name: "Nakshi", slug: "nakshi", description: "Nakshi temple jewellery", products: 5, status: "active" },
  { id: 4, name: "Rentals", slug: "rentals", description: "Bridal and occasion rental sets", products: 5, status: "active" },
  { id: 5, name: "Bangles", slug: "bangles", description: "Bangles and kada sets", products: 0, status: "inactive" },
];

export const products: Product[] = [
  {
    id: 1, name: "Antique Gold Haaram", slug: "antique-gold-haaram", sku: "CH-HAR-001", category: "Haarams",
    regularPrice: 12500, salePrice: 10900, stock: 8, status: "active", featured: true, newArrival: true, added: "03 Nov 2026",
    shortDescription: "Traditional antique gold finish haaram.",
    description: "A long temple-style haaram with an antique gold finish, ideal for weddings and festive occasions.",
    costPrice: 6800, material: "Antique gold plated", jewelleryType: "Haaram", weight: "85 g", size: "Free size",
    colour: "Gold", occasion: "Wedding", collection: "Bridal", tags: "haaram, temple, bridal",
  },
  {
    id: 2, name: "Kemp Stone Choker", slug: "kemp-stone-choker", sku: "CH-CHK-014", category: "Chokers",
    regularPrice: 7800, salePrice: null, stock: 0, status: "active", featured: false, newArrival: true, added: "02 Nov 2026",
    shortDescription: "Red kemp stone choker.",
    description: "Handcrafted choker set with red kemp stones and a matching pair of earrings.",
    material: "Brass with kemp stones", jewelleryType: "Choker", weight: "52 g", colour: "Red & Gold", occasion: "Festive", collection: "Women", tags: "choker, kemp",
  },
  {
    id: 3, name: "Nakshi Temple Necklace", slug: "nakshi-temple-necklace", sku: "CH-NAK-007", category: "Nakshi",
    regularPrice: 15200, salePrice: 13500, stock: 4, status: "inactive", featured: true, newArrival: false, added: "30 Oct 2026",
  },
  {
    id: 4, name: "Bridal Rental Set", slug: "bridal-rental-set", sku: "CH-RNT-003", category: "Rentals",
    regularPrice: 4500, salePrice: null, stock: 12, status: "active", featured: false, newArrival: false, added: "28 Oct 2026",
  },
  {
    id: 5, name: "Pearl Layered Choker", slug: "pearl-layered-choker", sku: "CH-CHK-021", category: "Chokers",
    regularPrice: 6200, salePrice: 5400, stock: 3, status: "active", featured: false, newArrival: true, added: "26 Oct 2026",
  },
  {
    id: 6, name: "Long Kasu Mala", slug: "long-kasu-mala", sku: "CH-HAR-009", category: "Haarams",
    regularPrice: 9800, salePrice: null, stock: 15, status: "active", featured: true, newArrival: false, added: "20 Oct 2026",
  },
];