export type Product = {
  id: number;
  name: string;
  slug: string;
  sku: string;
  category: string;
  categoryId?: number;
  categorySlug?: string;
  categories?: { id: number; name: string; slug: string }[];
  regularPrice: number;
  salePrice: number | null;
  stock: number;
  status: "active" | "inactive";
  featured: boolean;
  newArrival: boolean;
  isCombo?: boolean;
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
  primaryImage?: string;
  images?: { id?: number; url: string; isPrimary: boolean; displayOrder: number }[];
};

export type CategoryItem = {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  products: number;
  status: "active" | "inactive";
};

export const categories: CategoryItem[] = [
  {
    "id": 20,
    "name": "AD jewellery",
    "slug": "ad-jewellery",
    "description": "Elegant AD stone detailing with a brilliant, diamond-like sparkle.” ✨",
    "image": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000665481f6b71bb478dc56d5ad.png",
    "products": 11,
    "status": "active"
  },
  {
    "id": 16,
    "name": "Anti tarnish jewellery",
    "slug": "anti-tarnish-jewellery",
    "description": "Anti-Tarnish Jewellery ✨\r\nDesigned to stay beautiful for longer, our anti-tarnish jewellery offers lasting shine and everyday elegance. Lightweight, stylish, and easy to wear—perfect for adding a timeless touch to any look.",
    "image": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000009b508207870f5091ab15c648.png",
    "products": 21,
    "status": "active"
  },
  {
    "id": 25,
    "name": "Bangles",
    "slug": "bangles",
    "description": "Elegant bangles designed to add a timeless touch to every look. Perfect for everyday wear, festive occasions, and special moments. ✨",
    "image": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000006694820da7b5ec3603d8fe76.png",
    "products": 5,
    "status": "active"
  },
  {
    "id": 111,
    "name": "Diamond Pendant Chains",
    "slug": "diamond-pendant",
    "description": "Elegant diamond pendant with a timeless sparkle, perfect for every occasion. ✨",
    "image": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000029748211b590bb9f6e549353.png",
    "products": 7,
    "status": "active"
  },
  {
    "id": 26,
    "name": "Earrings",
    "slug": "earrings",
    "description": "Elegant earrings designed to add a graceful touch to every look. Perfect for everyday wear, festive occasions, and special moments. ✨",
    "image": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000aeb88230a6116622d5b66a95.png",
    "products": 4,
    "status": "active"
  },
  {
    "id": 19,
    "name": "Long Haram",
    "slug": "traditional-long-haramas",
    "description": "A touch of tradition, a lifetime of elegance. ✨\r\nInspired by timeless Indian jewellery, our pieces bring classic beauty and graceful charm to every occasion.",
    "image": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000009b081fb8d57c0d3d2d5e1d1.png",
    "products": 5,
    "status": "active"
  },
  {
    "id": 21,
    "name": "Luxe",
    "slug": "premium-above-1000",
    "description": "Timeless elegance, elevated. ✨\r\nA premium collection of exquisite pieces blending traditional charm with modern sophistication.",
    "image": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000ded0820e9406a79121a1f42a.png",
    "products": 13,
    "status": "active"
  },
  {
    "id": 126,
    "name": "Minimal Neck Chains",
    "slug": "minimal-neck-chains",
    "description": "Minimal, Neck Chain, Chain, Delicate, Simple, Elegant, Classic, Everyday Wear, Dainty, Timeless, Modern, Lightweight, Gold Look, Gift, Premium, Occasion Wear",
    "image": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000cb088211bc5b0bac2d0c77a8-1.png",
    "products": 5,
    "status": "active"
  },
  {
    "id": 18,
    "name": "Necklace",
    "slug": "necklace",
    "description": "Tradition that shines ✨\r\nClassic Indian-inspired designs with a lasting finish, bringing timeless elegance to every traditional look.",
    "image": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000080f081f491e6f783dc620708.png",
    "products": 82,
    "status": "active"
  },
  {
    "id": 22,
    "name": "Under 500 Collection",
    "slug": "under-500",
    "description": "Under ₹500 ✨\r\n\r\nDiscover beautiful, everyday jewellery at prices you’ll love. Our Under ₹500 collection brings together elegant and trendy pieces perfect for adding a little sparkle to your everyday style, gifting, and festive looks",
    "image": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000044ec820bb1c7d3eef3a158f9.png",
    "products": 43,
    "status": "active"
  }
];

export const products: Product[] = [
  {
    "id": 641,
    "name": "Blue Single Stone Pendant",
    "slug": "blue-single-stone-pendant",
    "sku": "CH-WP-641",
    "category": "Minimal Neck Chains",
    "categoryId": 126,
    "categorySlug": "minimal-neck-chains",
    "categories": [
      {
        "id": 126,
        "name": "Minimal Neck Chains",
        "slug": "minimal-neck-chains"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 990,
    "salePrice": 499,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Blue Single Stone Pendant — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Blue Single Stone Pendant — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000cb088211bc5b0bac2d0c77a8-1.png",
    "images": [
      {
        "id": 648,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000cb088211bc5b0bac2d0c77a8-1.png",
        "isPrimary": true,
        "displayOrder": 0
      },
      {
        "id": 648,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000cb088211bc5b0bac2d0c77a8-1.png",
        "isPrimary": false,
        "displayOrder": 1
      }
    ]
  },
  {
    "id": 637,
    "name": "Bridal Antique Jhumka",
    "slug": "bridal-antique-jhumka",
    "sku": "CH-WP-637",
    "category": "Earrings",
    "categoryId": 26,
    "categorySlug": "earrings",
    "categories": [
      {
        "id": 26,
        "name": "Earrings",
        "slug": "earrings"
      }
    ],
    "regularPrice": 955,
    "salePrice": 499,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Bridal Antique Jhumka — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Bridal Antique Jhumka — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000aeb88230a6116622d5b66a95.png",
    "images": [
      {
        "id": 638,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000aeb88230a6116622d5b66a95.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 635,
    "name": "Matte Golden Stone Bangle Pair",
    "slug": "matte-golden-stone-bangle-pair",
    "sku": "CH-WP-635",
    "category": "Necklace",
    "categoryId": 16,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 16,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 877,
    "salePrice": 489,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Matte Golden Stone Bangle Pair — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Matte Golden Stone Bangle Pair — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "bridal, classic, elegant, ethnic, festive, gold-look, occasion-wear, premium, timeless, traditional, traditional-bangle, wedding-wear",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000078a881f9b6ed5318993ac044.png",
    "images": [
      {
        "id": 452,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000078a881f9b6ed5318993ac044.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 634,
    "name": "Golden Lekshmi Bangle(R&G)",
    "slug": "golden-lekshmi-banglerg",
    "sku": "CH-WP-634",
    "category": "Necklace",
    "categoryId": 16,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 16,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 988,
    "salePrice": 499,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Golden Lekshmi Bangle(R&G) — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Golden Lekshmi Bangle(R&G) — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Temple Jewellery",
    "occasion": "Festive & Daily Wear",
    "tags": "bridal, classic, elegant, ethnic, festive, gold-look, kuppivala, occasion-wear, premium, timeless, traditional, traditional-bangle, wedding-wear",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000073f481fa8eeff376ba50863f-1.png",
    "images": [
      {
        "id": 459,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000073f481fa8eeff376ba50863f-1.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 632,
    "name": "Palakka Green Bangle Pair",
    "slug": "palakka-green-bangle",
    "sku": "CH-WP-632",
    "category": "Necklace",
    "categoryId": 16,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 16,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 489,
    "salePrice": null,
    "stock": 0,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Palakka Green Bangle Pair — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Palakka Green Bangle Pair — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Temple Jewellery",
    "occasion": "Festive & Daily Wear",
    "tags": "bridal, classic, elegant, festive-wear, gold-look, minimal, occasion-wear, premium, single-bangle, timeless, traditional",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000e5dc820cb78e6c5f64b7f785.png",
    "images": [
      {
        "id": 453,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000e5dc820cb78e6c5f64b7f785.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 630,
    "name": "Illakathali Jhumka Earring",
    "slug": "illakathali-jhumka-earring",
    "sku": "CH-WP-630",
    "category": "Earrings",
    "categoryId": 26,
    "categorySlug": "earrings",
    "categories": [
      {
        "id": 26,
        "name": "Earrings",
        "slug": "earrings"
      }
    ],
    "regularPrice": 899,
    "salePrice": 450,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": true,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Illakathali Jhumka Earring — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Illakathali Jhumka Earring — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "classic, daily-wear, earrings, elegant, festive-wear, lightweight, minimal, modern, new-arrival, party-wear, premium, statement, stylish, traditional",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000ab4481fa9a568092bc5cd9fc-1.png",
    "images": [
      {
        "id": 460,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000ab4481fa9a568092bc5cd9fc-1.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 629,
    "name": "Kemp temple Earring",
    "slug": "kemp-temple-earring",
    "sku": "CH-WP-629",
    "category": "Earrings",
    "categoryId": 26,
    "categorySlug": "earrings",
    "categories": [
      {
        "id": 26,
        "name": "Earrings",
        "slug": "earrings"
      }
    ],
    "regularPrice": 999,
    "salePrice": 499,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": true,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Kemp temple Earring — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Kemp temple Earring — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Temple Jewellery",
    "occasion": "Festive & Daily Wear",
    "tags": "classic, daily-wear, earrings, elegant, festive-wear, lightweight, minimal, modern, new-arrival, party-wear, premium, statement, stylish, traditional",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000002a3481fa9185f8e13536639a-1.png",
    "images": [
      {
        "id": 454,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000002a3481fa9185f8e13536639a-1.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 451,
    "name": "Dancing 5 Thattu Earrings",
    "slug": "dancing-5-thattu-earrings",
    "sku": "CH-WP-451",
    "category": "Earrings",
    "categoryId": 26,
    "categorySlug": "earrings",
    "categories": [
      {
        "id": 26,
        "name": "Earrings",
        "slug": "earrings"
      }
    ],
    "regularPrice": 799,
    "salePrice": 479,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": true,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Dancing 5 Thattu Earrings — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Dancing 5 Thattu Earrings — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "classic, daily-wear, earrings, elegant, festive-wear, lightweight, minimal, modern, new-arrival, party-wear, premium, statement, stylish, traditional",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000909481fa8ce9efb66af38d75.png",
    "images": [
      {
        "id": 457,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000909481fa8ce9efb66af38d75.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 350,
    "name": "Glass Rain stone Bangles Rani Pink(1 dozen)",
    "slug": "glass-rain-stone-bangles-rani-pink1-dozen",
    "sku": "CH-WP-350",
    "category": "Necklace",
    "categoryId": 16,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 16,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 299,
    "salePrice": 129,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "A timeless traditional bangle with a graceful, classic charm. ✨",
    "description": "A timeless traditional bangle with a graceful, classic charm. ✨",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "bridal, classic, elegant, ethnic, festive-wear, gold-look, kuppivala, occasion-wear, premium-collection, statement, timeless, traditional-bangle, traditional-collection, traditional-jewellery, wedding-wear",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000006694820da7b5ec3603d8fe76.png",
    "images": [
      {
        "id": 351,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000006694820da7b5ec3603d8fe76.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 348,
    "name": "Green Modern Choker",
    "slug": "green-modern-choker",
    "sku": "CH-WP-348",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 788,
    "salePrice": 499,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Green Modern Choker — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Green Modern Choker — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000080f081f491e6f783dc620708.png",
    "images": [
      {
        "id": 349,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000080f081f491e6f783dc620708.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 344,
    "name": "Lakshmi Kashu Model Necklace(R&G)",
    "slug": "lakshmi-kashu-model-necklacerg",
    "sku": "CH-WP-344",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 999,
    "salePrice": 499,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Lakshmi Kashu Model Necklace(R&G) — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Lakshmi Kashu Model Necklace(R&G) — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Temple Jewellery",
    "occasion": "Festive & Daily Wear",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000c19081f5bdd0f662c89103f6.png",
    "images": [
      {
        "id": 345,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000c19081f5bdd0f662c89103f6.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 341,
    "name": "Lakshmi Kashu Model Necklace(Red)",
    "slug": "lakshmi-kashu-model-necklace",
    "sku": "CH-WP-341",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 999,
    "salePrice": 499,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Lakshmi Kashu Model Necklace(Red) — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Lakshmi Kashu Model Necklace(Red) — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Temple Jewellery",
    "occasion": "Festive & Daily Wear",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000c75881fdb8f774fff0bf7685.png",
    "images": [
      {
        "id": 342,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000c75881fdb8f774fff0bf7685.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 339,
    "name": "Double Layer Peacock Necklace",
    "slug": "double-layer-peacock-necklace",
    "sku": "CH-WP-339",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 21,
        "name": "Luxe",
        "slug": "premium-above-1000"
      },
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 1999,
    "salePrice": 1309,
    "stock": 10,
    "status": "active",
    "featured": true,
    "newArrival": true,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Double Layer Peacock Necklace — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Double Layer Peacock Necklace — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Bridal & Festive",
    "tags": "ad-stone, anti-tarnish, best-seller, bridal, bridesmaid, classic, elegant, festive, limited-edition, modern-traditional, new-arrival, party-wear, premium-collection, statement, traditional",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000b7e8820ea53df952c070f009.png",
    "images": [
      {
        "id": 340,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000b7e8820ea53df952c070f009.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 337,
    "name": "Matte Finish Golden Necklace Green",
    "slug": "matte-finish-golden-necklace-green",
    "sku": "CH-WP-337",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 21,
        "name": "Luxe",
        "slug": "premium-above-1000"
      },
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 1770,
    "salePrice": 1010,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Matte Finish Golden Necklace Green — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Matte Finish Golden Necklace Green — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Bridal & Festive",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/IMG_20261013_141011-scaled.jpeg",
    "images": [
      {
        "id": 338,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/IMG_20261013_141011-scaled.jpeg",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 335,
    "name": "Matte Finish Golden Necklace Pink",
    "slug": "matte-finish-golden-necklace-pink",
    "sku": "CH-WP-335",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 21,
        "name": "Luxe",
        "slug": "premium-above-1000"
      },
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 1770,
    "salePrice": 1010,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Matte Finish Golden Necklace Pink — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Matte Finish Golden Necklace Pink — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Bridal & Festive",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000ded0820e9406a79121a1f42a.png",
    "images": [
      {
        "id": 336,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000ded0820e9406a79121a1f42a.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 333,
    "name": "Christian Bridal Necklace (G&R)",
    "slug": "christian-bridal-necklace-gr",
    "sku": "CH-WP-333",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 599,
    "salePrice": null,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Christian Bridal Necklace (G&R) — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Christian Bridal Necklace (G&R) — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "classic, elegant, everyday-wear, festive-wear, hook-earrings, lightweight, minimal, party-wear, premium, statement, stylish, traditional",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000573c820cab55138d3eb0937c.png",
    "images": [
      {
        "id": 334,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000573c820cab55138d3eb0937c.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 327,
    "name": "Christian Bridal Necklace (Green)",
    "slug": "christian-bridal-necklace-green",
    "sku": "CH-WP-327",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 599,
    "salePrice": null,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Christian Bridal Necklace (Green) — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Christian Bridal Necklace (Green) — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "classic, elegant, everyday-wear, festive-wear, hook-earrings, lightweight, minimal, party-wear, premium, statement, stylish, traditional",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000082d88210ae49f960829993b7.png",
    "images": [
      {
        "id": 328,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000082d88210ae49f960829993b7.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 292,
    "name": "Round Palakka Pendant Chain Red",
    "slug": "round-palakka-pendant-chain-red",
    "sku": "CH-WP-292",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 899,
    "salePrice": 399,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Round Palakka Pendant Chain Red — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Round Palakka Pendant Chain Red — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Temple Jewellery",
    "occasion": "Festive & Daily Wear",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000e874820da582bdba3edbdf11.png",
    "images": [
      {
        "id": 319,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000e874820da582bdba3edbdf11.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 310,
    "name": "Geometric Link necklace violet",
    "slug": "geometric-link-necklace-violet",
    "sku": "CH-WP-310",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 899,
    "salePrice": 550,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Geometric Link necklace violet — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Timeless traditional jewellery for a graceful bridesmaid look. 🌸",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000006df081fa936142f41477d144.png",
    "images": [
      {
        "id": 311,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000006df081fa936142f41477d144.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 309,
    "name": "SwarnaLekshmi Double layer -Ruby",
    "slug": "swarnalekshmi-double-layer-ruby-2",
    "sku": "CH-WP-309",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 1200,
    "salePrice": 899,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "SwarnaLekshmi Double layer -Ruby — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "For the bride’s favourite girls. ✨\nTraditional elegance designed to make every bridesmaid look effortlessly beautiful.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Temple Jewellery",
    "occasion": "Bridal & Festive",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000bb3881fa92cf09dd0d51590c.png",
    "images": [
      {
        "id": 307,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000bb3881fa92cf09dd0d51590c.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 297,
    "name": "Flower Squared Choker Red",
    "slug": "flower-squared-choker-red",
    "sku": "CH-WP-297",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 800,
    "salePrice": 420,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": true,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Flower Squared Choker Red — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Grace in every detail.\nA modern take on tradition",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "bridal, bridesmaid, chic, classic, delicate, elegant, everyday-wear, festive, graceful, minimal, modern, new-arrival, occasion-wear, party-wear, premium, simple, sparkle, statement, timeless, traditional",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000001264820ba03c37fe6cdfcf92.png",
    "images": [
      {
        "id": 92,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000001264820ba03c37fe6cdfcf92.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 296,
    "name": "Flower Squared Choker Green",
    "slug": "flower-squared-choker-green",
    "sku": "CH-WP-296",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 800,
    "salePrice": 420,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": true,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Flower Squared Choker Green — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Grace in every detail.A modern take on tradition.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "bridal, bridesmaid, chic, classic, delicate, elegant, everyday-wear, festive, graceful, minimal, modern, new-arrival, occasion-wear, party-wear, premium, simple, sparkle, statement, timeless, traditional",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000044ec820bb1c7d3eef3a158f9.png",
    "images": [
      {
        "id": 75,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000044ec820bb1c7d3eef3a158f9.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 295,
    "name": "Round Palakka Pendant Chain Pink",
    "slug": "round-palakka-pendant-chain-pink",
    "sku": "CH-WP-295",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 899,
    "salePrice": 399,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Round Palakka Pendant Chain Pink — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Simple, elegant, and traditional.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Temple Jewellery",
    "occasion": "Festive & Daily Wear",
    "tags": "bridal-edit, bridesmaid-edit, chic, classic-collection, contemporary, dainty, delicate, ethnic, everyday-luxury, feminine, festive-edit, glamorous, occasion-ready, regal, royal, signature-collection, sophisticated, traditional, vintage",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000000db481f691e750b8a1025e72.png",
    "images": [
      {
        "id": 317,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000000db481f691e750b8a1025e72.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 293,
    "name": "Round Palakka Pendant Chain Green",
    "slug": "round-palakka-pendant-chain-green",
    "sku": "CH-WP-293",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 899,
    "salePrice": 399,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Round Palakka Pendant Chain Green — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Round Palakka Pendant Chain Green — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Temple Jewellery",
    "occasion": "Festive & Daily Wear",
    "tags": "bridal-edit, bridesmaid-edit, chic, classic-collection, contemporary, dainty, delicate, ethnic, everyday-luxury, exclusive-collection, feminine, festive-edit, glamorous, occasion-ready, regal, royal, signature-collection, sophisticated, traditional, vintage, wedding-guest",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000665481f6b71bb478dc56d5ad.png",
    "images": [
      {
        "id": 320,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000665481f6b71bb478dc56d5ad.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 291,
    "name": "AD simple Flower Necklace",
    "slug": "ad-simple-flower-necklace",
    "sku": "CH-WP-291",
    "category": "AD jewellery",
    "categoryId": 20,
    "categorySlug": "ad-jewellery",
    "categories": [
      {
        "id": 20,
        "name": "AD jewellery",
        "slug": "ad-jewellery"
      },
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 999,
    "salePrice": 499,
    "stock": 10,
    "status": "active",
    "featured": true,
    "newArrival": true,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "AD simple Flower Necklace — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "AD simple Flower Necklace — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "AD Stone",
    "occasion": "Festive & Daily Wear",
    "tags": "ad-stone, anti-tarnish, best-seller, bridal, bridesmaid, classic, elegant, festive, limited-edition, modern-traditional, new-arrival, party-wear, premium-collection, statement, traditional",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000051f0820baba8bc3a437458b7.png",
    "images": [
      {
        "id": 76,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000051f0820baba8bc3a437458b7.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 290,
    "name": "Green Hexagon Chain",
    "slug": "green-hexagon-chain",
    "sku": "CH-WP-290",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 756,
    "salePrice": 399,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Green Hexagon Chain — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Tradition, reimagined. ✨\nClassic charm with a modern touch, made for today’s elegant woman.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000571881f8a6bfb59b78a0a772.png",
    "images": [
      {
        "id": 88,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000571881f8a6bfb59b78a0a772.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 289,
    "name": "Aura Diamond Set",
    "slug": "aura-diamond-set",
    "sku": "CH-WP-289",
    "category": "Diamond Pendant Chains",
    "categoryId": 111,
    "categorySlug": "diamond-pendant",
    "categories": [
      {
        "id": 111,
        "name": "Diamond Pendant Chains",
        "slug": "diamond-pendant"
      }
    ],
    "regularPrice": 1899,
    "salePrice": 899,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": true,
    "isCombo": true,
    "added": "01 Nov 2026",
    "shortDescription": "Aura Diamond Set — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Timeless beauty in every detail.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "AD Stone",
    "occasion": "Bridal & Festive",
    "tags": "classic, dainty, diamond, diamond-pendant, elegant, everyday-wear, gift, minimal, new-arrival, occasion-wear, party-wear, pendant, premium, sparkle, timeless",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000029748211b590bb9f6e549353.png",
    "images": [
      {
        "id": 102,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000029748211b590bb9f6e549353.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 288,
    "name": "Flower Diamond Pendant set",
    "slug": "flower-diamond-pendant-set",
    "sku": "CH-WP-288",
    "category": "Diamond Pendant Chains",
    "categoryId": 111,
    "categorySlug": "diamond-pendant",
    "categories": [
      {
        "id": 111,
        "name": "Diamond Pendant Chains",
        "slug": "diamond-pendant"
      }
    ],
    "regularPrice": 1799,
    "salePrice": 749,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": true,
    "isCombo": true,
    "added": "01 Nov 2026",
    "shortDescription": "Flower Diamond Pendant set — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Delicate sparkle, timeless elegance. ✨",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "AD Stone",
    "occasion": "Bridal & Festive",
    "tags": "classic, dainty, diamond, diamond-pendant, elegant, everyday-wear, gift, minimal, new-arrival, occasion-wear, party-wear, pendant, premium, sparkle, timeless",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000a3648211b08439dc7997a7ee.png",
    "images": [
      {
        "id": 37,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000a3648211b08439dc7997a7ee.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 287,
    "name": "Bloom Diamond Pendant Set",
    "slug": "bloom-diamond-pendant-set",
    "sku": "CH-WP-287",
    "category": "Diamond Pendant Chains",
    "categoryId": 111,
    "categorySlug": "diamond-pendant",
    "categories": [
      {
        "id": 111,
        "name": "Diamond Pendant Chains",
        "slug": "diamond-pendant"
      }
    ],
    "regularPrice": 1670,
    "salePrice": 749,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": true,
    "isCombo": true,
    "added": "01 Nov 2026",
    "shortDescription": "Delicate sparkle, timeless elegance. ✨",
    "description": "Delicate sparkle, timeless elegance. ✨",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "AD Stone",
    "occasion": "Bridal & Festive",
    "tags": "classic, dainty, diamond, diamond-pendant, elegant, everyday-wear, gift, minimal, new-arrival, occasion-wear, party-wear, pendant, premium, sparkle, timeless",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000020788211b0780a175cad3204.png",
    "images": [
      {
        "id": 100,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000020788211b0780a175cad3204.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 286,
    "name": "Half bloomed Diamond Pendant Set",
    "slug": "half-bloomed-diamond-pendant-set",
    "sku": "CH-WP-286",
    "category": "Diamond Pendant Chains",
    "categoryId": 111,
    "categorySlug": "diamond-pendant",
    "categories": [
      {
        "id": 111,
        "name": "Diamond Pendant Chains",
        "slug": "diamond-pendant"
      }
    ],
    "regularPrice": 1450,
    "salePrice": 799,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": true,
    "isCombo": true,
    "added": "01 Nov 2026",
    "shortDescription": "Half bloomed Diamond Pendant Set — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Elegant shine, effortlessly beautiful.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "AD Stone",
    "occasion": "Bridal & Festive",
    "tags": "classic, dainty, diamond, diamond-pendant, elegant, everyday-wear, gift, minimal, new-arrival, occasion-wear, party-wear, pendant, premium, sparkle, timeless",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000c700820781e9a4ffe6373c72.png",
    "images": [
      {
        "id": 48,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000c700820781e9a4ffe6373c72.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 285,
    "name": "Oval Flower Diamond Set",
    "slug": "oval-flower-diamond-set",
    "sku": "CH-WP-285",
    "category": "Diamond Pendant Chains",
    "categoryId": 111,
    "categorySlug": "diamond-pendant",
    "categories": [
      {
        "id": 111,
        "name": "Diamond Pendant Chains",
        "slug": "diamond-pendant"
      }
    ],
    "regularPrice": 1466,
    "salePrice": 699,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": true,
    "added": "01 Nov 2026",
    "shortDescription": "Oval Flower Diamond Set — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Oval Flower Diamond Set — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "AD Stone",
    "occasion": "Bridal & Festive",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000030b88211bb0b831031a7661a.png",
    "images": [
      {
        "id": 314,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000030b88211bb0b831031a7661a.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 284,
    "name": "Flower Bouquet Diamond Set",
    "slug": "flower-bouquet-diamond-set",
    "sku": "CH-WP-284",
    "category": "Diamond Pendant Chains",
    "categoryId": 111,
    "categorySlug": "diamond-pendant",
    "categories": [
      {
        "id": 111,
        "name": "Diamond Pendant Chains",
        "slug": "diamond-pendant"
      }
    ],
    "regularPrice": 1799,
    "salePrice": 829,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": true,
    "added": "01 Nov 2026",
    "shortDescription": "Flower Bouquet Diamond Set — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Flower Bouquet Diamond Set — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "AD Stone",
    "occasion": "Bridal & Festive",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000a224820aa92231537e4d71c5.png",
    "images": [
      {
        "id": 298,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000a224820aa92231537e4d71c5.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 283,
    "name": "Petal Diamond Pendant Set",
    "slug": "petal-diamond-pendant-set",
    "sku": "CH-WP-283",
    "category": "Diamond Pendant Chains",
    "categoryId": 111,
    "categorySlug": "diamond-pendant",
    "categories": [
      {
        "id": 111,
        "name": "Diamond Pendant Chains",
        "slug": "diamond-pendant"
      }
    ],
    "regularPrice": 1544,
    "salePrice": 849,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": true,
    "isCombo": true,
    "added": "01 Nov 2026",
    "shortDescription": "Petal Diamond Pendant Set — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Classic elegance with a brilliant touch.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "AD Stone",
    "occasion": "Bridal & Festive",
    "tags": "classic, dainty, diamond, diamond-pendant, elegant, everyday-wear, gift, minimal, new-arrival, occasion-wear, party-wear, pendant, premium, sparkle, timeless",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000043988211b5063bb51b3cdf39-e1791574001524.png",
    "images": [
      {
        "id": 103,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000043988211b5063bb51b3cdf39-e1791574001524.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 279,
    "name": "Mango Arathi Necklace",
    "slug": "mango-arathi-necklace",
    "sku": "CH-WP-279",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 21,
        "name": "Luxe",
        "slug": "premium-above-1000"
      },
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 2520,
    "salePrice": 1020,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Mango Arathi Necklace — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Timeless charm, beautifully adorned. 🤍\nClassic traditional pieces with an elegant, contemporary feel.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Bridal & Festive",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000007e9081f8a7ef1001cc1fe778.png",
    "images": [
      {
        "id": 280,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000007e9081f8a7ef1001cc1fe778.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 277,
    "name": "Arathi necklace",
    "slug": "arathi-necklace",
    "sku": "CH-WP-277",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 21,
        "name": "Luxe",
        "slug": "premium-above-1000"
      },
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 2520,
    "salePrice": 1020,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Arathi necklace — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Tradition, crafted with elegance. ✨\nPremium pieces designed to add a refined and graceful touch to every special occasion.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Bridal & Festive",
    "tags": "classic-gold-look, contemporary, elegant, ethnic, exclusive, festive-edit, festive-wear, graceful, handcrafted, heritage, luxury, occasion-wear, premium-finish, sparkling, special-occasion, statement-jewellery, temple-inspired, timeless, wedding-edit, wedding-wear",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000297081f5979110b9aca56830.png",
    "images": [
      {
        "id": 278,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000297081f5979110b9aca56830.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 276,
    "name": "Nagapadam Red Choker",
    "slug": "nagapadam-red-choker",
    "sku": "CH-WP-276",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 799,
    "salePrice": 399,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Nagapadam Red Choker — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Tradition, crafted with elegance. ✨\nPremium pieces designed to add a refined and graceful touch to every special occasion.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Temple Jewellery",
    "occasion": "Festive & Daily Wear",
    "tags": "classic-gold-look, contemporary, elegant, ethnic, exclusive, festive-edit, festive-wear, graceful, handcrafted, heritage, luxury, occasion-wear, premium-finish, sparkling, special-occasion, statement-jewellery, temple-inspired, timeless, wedding-edit, wedding-wear",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000fb7c8230bdf0b6c00fe665e8.png",
    "images": [
      {
        "id": 239,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000fb7c8230bdf0b6c00fe665e8.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 274,
    "name": "Nagapadam Green Choker",
    "slug": "nagapadam-green-choker",
    "sku": "CH-WP-274",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 799,
    "salePrice": 399,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Nagapadam Green Choker — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Nagapadam Green Choker — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Temple Jewellery",
    "occasion": "Festive & Daily Wear",
    "tags": "classic-gold-look, contemporary, elegant, ethnic, exclusive, festive-edit, festive-wear, graceful, handcrafted, heritage, luxury, occasion-wear, premium-finish, sparkling, special-occasion, statement-jewellery, temple-inspired, timeless, wedding-edit, wedding-wear",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000dea081f58177f023064b94e5.png",
    "images": [
      {
        "id": 243,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000dea081f58177f023064b94e5.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 272,
    "name": "MahaLekshmi Green bead Necklace",
    "slug": "mahalekshmi-necklace",
    "sku": "CH-WP-272",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 955,
    "salePrice": 480,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "MahaLekshmi Green bead Necklace — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "A celebration of timeless tradition. ✨\nElegant pieces inspired by classic designs, beautifully suited for modern occasions.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Temple Jewellery",
    "occasion": "Festive & Daily Wear",
    "tags": "bridal-edit, bridesmaid-edit, chic, classic-collection, contemporary, delicate, ethnic, exclusive-collection, festive-edit, glamorous, occasion-ready, regal, royal, sophisticated, traditional, vintage, wedding-guest",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000d8d48211a6d0a5f30817b0a7-1.png",
    "images": [
      {
        "id": 273,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000d8d48211a6d0a5f30817b0a7-1.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 271,
    "name": "10 Mani  Pookal Necklace",
    "slug": "10-mani-pookal-necklace",
    "sku": "CH-WP-271",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 899,
    "salePrice": 480,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": true,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "10 Mani  Pookal Necklace — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Made for traditions that never go out of style. ✨\nElegant, timeless pieces to complement every special moment.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "bridal, bridesmaid, chic, classic, delicate, elegant, everyday-wear, festive, graceful, minimal, modern, new-arrival, occasion-wear, party-wear, premium, simple, sparkle, statement, timeless, traditional",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000012fc81fb8efb7db85fbc2473.png",
    "images": [
      {
        "id": 246,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000012fc81fb8efb7db85fbc2473.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 269,
    "name": "Palakka Nagapadam Pendant Necklace",
    "slug": "palakka-nagapadam-pendant-necklace",
    "sku": "CH-WP-269",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 970,
    "salePrice": 450,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": true,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Palakka Nagapadam Pendant Necklace — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Simple Kerala tradition, timelessly elegant. ✨",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Temple Jewellery",
    "occasion": "Festive & Daily Wear",
    "tags": "bridal, bridesmaid, chic, classic, delicate, elegant, everyday-wear, festive, graceful, minimal, modern, new-arrival, occasion-wear, party-wear, premium, simple, sparkle, statement, timeless, traditional",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/IMG_20260610_162609-scaled.jpg",
    "images": [
      {
        "id": 270,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/IMG_20260610_162609-scaled.jpg",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 268,
    "name": "Palakka Flower Pendant",
    "slug": "palakka-flower-pendant",
    "sku": "CH-WP-268",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 799,
    "salePrice": 650,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Palakka Flower Pendant — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Palakka Flower Pendant — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Temple Jewellery",
    "occasion": "Festive & Daily Wear",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000de4481f58888a404e9ca7519.png",
    "images": [
      {
        "id": 244,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000de4481f58888a404e9ca7519.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 267,
    "name": "Palakka Nettipattam Red",
    "slug": "palakkad-nettipattam-red",
    "sku": "CH-WP-267",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 21,
        "name": "Luxe",
        "slug": "premium-above-1000"
      },
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 1770,
    "salePrice": 1050,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Palakka Nettipattam Red — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "A touch of Kerala tradition for every special moment. 🤍",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Temple Jewellery",
    "occasion": "Bridal & Festive",
    "tags": "bridal-edit, bridesmaid-edit, chic, classic-collection, contemporary, dainty, delicate, ethnic, everyday-luxury, exclusive-collection, feminine, festive-edit, glamorous, occasion-ready, regal, royal, signature-collection, sophisticated, traditional, vintage, wedding-guest",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000003a1881f5aeabd7bffb9d773f.png",
    "images": [
      {
        "id": 238,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000003a1881f5aeabd7bffb9d773f.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 266,
    "name": "Palakka Nettipattam Neclace",
    "slug": "palakkad-nettipattam-neclace",
    "sku": "CH-WP-266",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 21,
        "name": "Luxe",
        "slug": "premium-above-1000"
      },
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 1770,
    "salePrice": 1050,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Palakka Nettipattam Neclace — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "A touch of Kerala tradition for every special moment. 🤍",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Temple Jewellery",
    "occasion": "Bridal & Festive",
    "tags": "bridal-edit, bridesmaid-edit, chic, classic-collection, contemporary, dainty, delicate, ethnic, everyday-luxury, exclusive-collection, feminine, festive-edit, glamorous, occasion-ready, regal, royal, signature-collection, sophisticated, traditional, vintage, wedding-guest",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000b2b081f8b7df0652901345a6.png",
    "images": [
      {
        "id": 247,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000b2b081f8b7df0652901345a6.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 265,
    "name": "Meenakshi Ruby Necklace",
    "slug": "meenakshi-ruby-necklace",
    "sku": "CH-WP-265",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 970,
    "salePrice": 710,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Meenakshi Ruby Necklace — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Traditional pieces made for modern celebrations.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "classic-gold-look, contemporary, elegant, ethnic, exclusive, festive-edit, festive-wear, graceful, handcrafted, heritage, luxury, occasion-wear, premium-finish, sparkling, special-occasion, statement-jewellery, temple-inspired, timeless, wedding-edit, wedding-wear",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000f66881fb95d2c7d8de9bebdb.png",
    "images": [
      {
        "id": 65,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000f66881fb95d2c7d8de9bebdb.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 264,
    "name": "Povu Modern Necklace",
    "slug": "povu-modern-necklace",
    "sku": "CH-WP-264",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 1290,
    "salePrice": 850,
    "stock": 10,
    "status": "active",
    "featured": true,
    "newArrival": true,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Povu Modern Necklace — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Classic beauty. Modern sophistication. ✨\nDiscover our premium collection, created for those who appreciate timeless elegance.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Bridal & Festive",
    "tags": "ad-stone, anti-tarnish, best-seller, bridal, bridesmaid, classic, elegant, festive, limited-edition, modern-traditional, new-arrival, party-wear, premium-collection, statement, traditional",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000af2c81f58c3f40d9fd319f50-1.png",
    "images": [
      {
        "id": 262,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000af2c81f58c3f40d9fd319f50-1.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 261,
    "name": "Poovu Modern Necklace(R&G)",
    "slug": "poovu-modern-necklacerg",
    "sku": "CH-WP-261",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 1199,
    "salePrice": 799,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": true,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Poovu Modern Necklace(R&G) — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Tradition. Elegance. Timeless beauty. ✨\nJewellery inspired by classic Indian designs, made to make every occasion a little more beautiful.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Bridal & Festive",
    "tags": "bridal, bridesmaid, chic, classic, delicate, elegant, everyday-wear, festive, graceful, minimal, modern, new-arrival, occasion-wear, party-wear, premium, simple, sparkle, statement, timeless, traditional",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000b3a481fdb3ea8ebbebedf259-1.png",
    "images": [
      {
        "id": 263,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000b3a481fdb3ea8ebbebedf259-1.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 259,
    "name": "Sharanya AD Necklace Green",
    "slug": "sharanya-ad-necklace-green",
    "sku": "CH-WP-259",
    "category": "AD jewellery",
    "categoryId": 20,
    "categorySlug": "ad-jewellery",
    "categories": [
      {
        "id": 20,
        "name": "AD jewellery",
        "slug": "ad-jewellery"
      },
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 1050,
    "salePrice": 799,
    "stock": 10,
    "status": "active",
    "featured": true,
    "newArrival": true,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Sharanya AD Necklace Green — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Elegant AD stone detailing",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "AD Stone",
    "occasion": "Bridal & Festive",
    "tags": "ad-stone, anti-tarnish, best-seller, bridal, bridesmaid, classic, elegant, festive, limited-edition, modern-traditional, new-arrival, party-wear, premium-collection, statement, traditional",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000515081f8a3b1a1168263bd64.png",
    "images": [
      {
        "id": 260,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000515081f8a3b1a1168263bd64.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 258,
    "name": "Simple Gaddha Necklace",
    "slug": "simple-gaddha-necklace",
    "sku": "CH-WP-258",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 659,
    "salePrice": 299,
    "stock": 10,
    "status": "active",
    "featured": true,
    "newArrival": true,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Traditional pieces made for modern celebrations.",
    "description": "Traditional pieces made for modern celebrations.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "ad-stone, anti-tarnish, best-seller, bridal, bridesmaid, classic, elegant, festive, limited-edition, modern-traditional, new-arrival, party-wear, premium-collection, statement, traditional",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000bec88211adf58adfc289aec8.png",
    "images": [
      {
        "id": 46,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000bec88211adf58adfc289aec8.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 257,
    "name": "Kovai Palakka Green",
    "slug": "kovai-palakka-green",
    "sku": "CH-WP-257",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 788,
    "salePrice": 450,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Kovai Palakka Green — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Timeless luxury, beautifully crafted",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Temple Jewellery",
    "occasion": "Festive & Daily Wear",
    "tags": "classic-gold-look, contemporary, elegant, ethnic, exclusive, festive-edit, festive-wear, graceful, handcrafted, heritage, luxury, occasion-wear, premium-finish, sparkling, special-occasion, statement-jewellery, temple-inspired, timeless, wedding-edit, wedding-wear",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000f36c81f5a884b7998ca94d6d.png",
    "images": [
      {
        "id": 248,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000f36c81f5a884b7998ca94d6d.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 255,
    "name": "Coin Loop Choker",
    "slug": "coin-loop-choker",
    "sku": "CH-WP-255",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 799,
    "salePrice": 499,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": true,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Classic beauty. Modern sophistication. ✨\nDiscover our premium collection, created for those who appreciate timeless elegance.",
    "description": "Classic beauty. Modern sophistication. ✨\nDiscover our premium collection, created for those who appreciate timeless elegance.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "bridal, bridesmaid, chic, classic, delicate, elegant, everyday-wear, festive, graceful, minimal, modern, new-arrival, occasion-wear, party-wear, premium, simple, sparkle, statement, timeless, traditional",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000478481f790857128a4af2f95.png",
    "images": [
      {
        "id": 256,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000478481f790857128a4af2f95.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 253,
    "name": "Temple Palakka Long haram",
    "slug": "temple-palakka-long-haram",
    "sku": "CH-WP-253",
    "category": "Long Haram",
    "categoryId": 19,
    "categorySlug": "traditional-long-haramas",
    "categories": [
      {
        "id": 19,
        "name": "Long Haram",
        "slug": "traditional-long-haramas"
      },
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 599,
    "salePrice": null,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": true,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Temple Palakka Long haram — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Temple Palakka Long haram — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Temple Jewellery",
    "occasion": "Festive & Daily Wear",
    "tags": "bridal, bridesmaid, chic, classic, delicate, elegant, everyday-wear, festive, graceful, minimal, modern, new-arrival, occasion-wear, party-wear, premium, simple, sparkle, statement, timeless, traditional",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000009b081fb8d57c0d3d2d5e1d1.png",
    "images": [
      {
        "id": 254,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000009b081fb8d57c0d3d2d5e1d1.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 251,
    "name": "Arya inspired Necklace",
    "slug": "arya-inspired-necklace",
    "sku": "CH-WP-251",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 499,
    "salePrice": 0,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": true,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Arya inspired Necklace — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Arya inspired Necklace — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "bridal, bridesmaid, chic, classic, delicate, elegant, everyday-wear, festive, graceful, minimal, modern, new-arrival, occasion-wear, party-wear, premium, simple, sparkle, statement, timeless, traditional",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000084081f5a9cd642566e96a5e.png",
    "images": [
      {
        "id": 252,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000084081f5a9cd642566e96a5e.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 250,
    "name": "Temple Locket Long Haram",
    "slug": "temple-locket-long-haram",
    "sku": "CH-WP-250",
    "category": "Long Haram",
    "categoryId": 19,
    "categorySlug": "traditional-long-haramas",
    "categories": [
      {
        "id": 19,
        "name": "Long Haram",
        "slug": "traditional-long-haramas"
      },
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 899,
    "salePrice": 399,
    "stock": 10,
    "status": "active",
    "featured": true,
    "newArrival": true,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Temple Locket Long Haram — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Temple Locket Long Haram — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Temple Jewellery",
    "occasion": "Festive & Daily Wear",
    "tags": "ad-stone, anti-tarnish, best-seller, bridal, bridesmaid, classic, elegant, festive, limited-edition, modern-traditional, new-arrival, party-wear, premium-collection, statement, traditional",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000b56c81fba9473c0dd31fe255.png",
    "images": [
      {
        "id": 242,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000b56c81fba9473c0dd31fe255.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 236,
    "name": "Manju inspired Lotus Necklace",
    "slug": "manju-inspired-lotus-necklace",
    "sku": "CH-WP-236",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 499,
    "salePrice": 250,
    "stock": 10,
    "status": "active",
    "featured": true,
    "newArrival": true,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Manju inspired Lotus Necklace — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Manju inspired Lotus Necklace — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "ad-stone, anti-tarnish, best-seller, bridal, bridesmaid, classic, elegant, festive, limited-edition, modern-traditional, new-arrival, party-wear, premium-collection, statement, traditional",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000521c81f59ea3e623535a9dd7.png",
    "images": [
      {
        "id": 241,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000521c81f59ea3e623535a9dd7.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 233,
    "name": "Lekshmi Bridal Temple Necklace",
    "slug": "lekshmi-bridal-temple-necklace",
    "sku": "CH-WP-233",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 21,
        "name": "Luxe",
        "slug": "premium-above-1000"
      },
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 3570,
    "salePrice": 2499,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Lekshmi Bridal Temple Necklace — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Lekshmi Bridal Temple Necklace — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Temple Jewellery",
    "occasion": "Bridal & Festive",
    "tags": "indian-jewellery-kerala-jewellery-temple-jewellery-bridal-jewellery-festive-jewellery-ethnic-jewellery-statement-jewellery-elegant-jewellery-womens-jewellery-handcrafted-jewellery",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000006f2881fa8cba9678dcefb291.png",
    "images": [
      {
        "id": 235,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000006f2881fa8cba9678dcefb291.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 232,
    "name": "RUBY Red Necklace",
    "slug": "ruby-red-necklace",
    "sku": "CH-WP-232",
    "category": "AD jewellery",
    "categoryId": 20,
    "categorySlug": "ad-jewellery",
    "categories": [
      {
        "id": 20,
        "name": "AD jewellery",
        "slug": "ad-jewellery"
      },
      {
        "id": 21,
        "name": "Luxe",
        "slug": "premium-above-1000"
      }
    ],
    "regularPrice": 3500,
    "salePrice": 2200,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "RUBY Red Necklace — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "RUBY Red Necklace — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "AD Stone",
    "occasion": "Bridal & Festive",
    "tags": "party-wear-jewellery-bridal-jewellery-festive-jewellery-statement-jewellery-imitation-jewellery",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000d19881fa9dbe39361906f9e5.png",
    "images": [
      {
        "id": 51,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000d19881fa9dbe39361906f9e5.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 132,
    "name": "Zig -zag antitarnish bangle",
    "slug": "zig-zag-antitarnish-bangle",
    "sku": "CH-WP-132",
    "category": "Anti tarnish jewellery",
    "categoryId": 16,
    "categorySlug": "anti-tarnish-jewellery",
    "categories": [
      {
        "id": 16,
        "name": "Anti tarnish jewellery",
        "slug": "anti-tarnish-jewellery"
      }
    ],
    "regularPrice": 265,
    "salePrice": 199,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Zig -zag antitarnish bangle — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Zig -zag antitarnish bangle — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Anti-Tarnish Stainless Steel / Gold Plated",
    "jewelleryType": "Anti Tarnish",
    "occasion": "Festive & Daily Wear",
    "tags": "anti-tarnish-gold-plated-jewellery-everyday-jewellery-water-resistant-jewellery-long-lasting-jewellery-minimal-jewellery",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000f8d881fb90759501c8895583.png",
    "images": [
      {
        "id": 321,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000f8d881fb90759501c8895583.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 227,
    "name": "Crystal Drops (Pink& Green)",
    "slug": "crystal-drops-pink-green",
    "sku": "CH-WP-227",
    "category": "Minimal Neck Chains",
    "categoryId": 126,
    "categorySlug": "minimal-neck-chains",
    "categories": [
      {
        "id": 126,
        "name": "Minimal Neck Chains",
        "slug": "minimal-neck-chains"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 499,
    "salePrice": 349,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Crystal Drops (Pink& Green) — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Crystal Drops (Pink& Green) — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "charmika-jewellery-gold-plated-jewellery-traditional-jewellery",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000006aa4821181075a25dc6e15e5.png",
    "images": [
      {
        "id": 74,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000006aa4821181075a25dc6e15e5.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 184,
    "name": "Petal AD Dual stone Necklace (Red coral &Green)",
    "slug": "ad-dual-stone-necklace-red-coral-green",
    "sku": "CH-WP-184",
    "category": "AD jewellery",
    "categoryId": 20,
    "categorySlug": "ad-jewellery",
    "categories": [
      {
        "id": 20,
        "name": "AD jewellery",
        "slug": "ad-jewellery"
      }
    ],
    "regularPrice": 1140,
    "salePrice": 849,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Petal AD Dual stone Necklace (Red coral &Green) — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Petal AD Dual stone Necklace (Red coral &Green) — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "AD Stone",
    "occasion": "Bridal & Festive",
    "tags": "ad-jewellery-american-diamond-ad-earrings-party-wear-jewellery-bridal-jewellery-festive-jewellery-statement-jewellery-imitation-jewellery-charmika-jewellery",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000004da481fa93faf109306e96db.png",
    "images": [
      {
        "id": 306,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000004da481fa93faf109306e96db.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 169,
    "name": "Onam Illakathali",
    "slug": "onam-illakathali",
    "sku": "CH-WP-169",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 1320,
    "salePrice": 899,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Onam Illakathali — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "A touch of Kerala tradition for every special moment. 🤍",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Bridal & Festive",
    "tags": "oduct-tags-charmika-jewellery-gold-plated-jewellery-traditional-jewellery-indian-jewellery",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000001828820ba5b788e2acaa367d.png",
    "images": [
      {
        "id": 89,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000001828820ba5b788e2acaa367d.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 168,
    "name": "Mini Necklace",
    "slug": "mini-necklace",
    "sku": "CH-WP-168",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 677,
    "salePrice": 399,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Mini Necklace — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Mini Necklace — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000d64081fa961e12f8cc1d3f04.png",
    "images": [
      {
        "id": 315,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000d64081fa961e12f8cc1d3f04.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 177,
    "name": "Aana Kasu Necklace",
    "slug": "aana-kasu-necklace",
    "sku": "CH-WP-177",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 550,
    "salePrice": 369,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Aana Kasu Necklace — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Simple, elegant, and traditional.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Temple Jewellery",
    "occasion": "Festive & Daily Wear",
    "tags": "festive-jewellery-ethnic-jewellery-statement-jewellery-elegant-jewellery-womens-jewellery",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000467c82119ef1f106e78141a8.png",
    "images": [
      {
        "id": 81,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000467c82119ef1f106e78141a8.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 230,
    "name": "Rajalakshmi Temple Haram (Red)",
    "slug": "rajalakshmi-temple-haram-red",
    "sku": "CH-WP-230",
    "category": "Long Haram",
    "categoryId": 19,
    "categorySlug": "traditional-long-haramas",
    "categories": [
      {
        "id": 19,
        "name": "Long Haram",
        "slug": "traditional-long-haramas"
      }
    ],
    "regularPrice": 1599,
    "salePrice": 1099,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Rajalakshmi Temple Haram (Red) — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Classic roots, modern elegance. ✨\nTraditional beauty designed with a contemporary feel.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Temple Jewellery",
    "occasion": "Bridal & Festive",
    "tags": "charmika-jewellery-gold-plated-jewellery-traditional-jewellery-indian-jewellery-kerala-jewellery-temple-jewellery-bridal-jewellery-festive-jewellery-ethnic-jewellery",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000047ec81faa0bc74e75021f52c.png",
    "images": [
      {
        "id": 301,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000047ec81faa0bc74e75021f52c.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 179,
    "name": "Vanki simple Necklace Red",
    "slug": "vanki-simple-necklace-red",
    "sku": "CH-WP-179",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 790,
    "salePrice": 479,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Vanki simple Necklace Red — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Simple, elegant, and traditional.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "festive-jewellery-ethnic-jewellery-statement-jewellery-elegant-jewellery-womens-jewellery",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000002a9481fa9202d5224694859f.png",
    "images": [
      {
        "id": 62,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000002a9481fa9202d5224694859f.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 180,
    "name": "Vanki simple Necklace Green",
    "slug": "vanki-simple-necklace-green",
    "sku": "CH-WP-180",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 790,
    "salePrice": 479,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Vanki simple Necklace Green — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Simple, elegant, and traditional.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "charmika-jewellery-gold-plated-jewellery-traditional-jewellery-indian-jewellery-kerala-jewellery-temple-jewellery",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000a10c820b8d9ae6fdea8ff1d5.png",
    "images": [
      {
        "id": 42,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000a10c820b8d9ae6fdea8ff1d5.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 181,
    "name": "Double layered Attigai -White stoned",
    "slug": "double-layered-attigai-white-stoned",
    "sku": "CH-WP-181",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 999,
    "salePrice": 799,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Double layered Attigai -White stoned — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Double layered Attigai -White stoned — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000065c081f8a19f02bdf67cf155-1.png",
    "images": [
      {
        "id": 229,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000065c081f8a19f02bdf67cf155-1.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 182,
    "name": "Lakshmi Pendant Palakka Green",
    "slug": "lakshmi-pendant-palakka-green",
    "sku": "CH-WP-182",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 1199,
    "salePrice": 699,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Lakshmi Pendant Palakka Green — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Rooted in tradition, crafted for elegance. 🌸\nInspired by the beauty of traditional Kerala and Indian jewellery, designed to complement your most cherished moments.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Temple Jewellery",
    "occasion": "Bridal & Festive",
    "tags": "bridal-jewellery-festive-jewellery-ethnic-jewellery-statement-jewellery-elegant-jewellery-womens-jewellery-handcrafted-jewellery-gift-for-her",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000006a488207aee3ea051d52e362.png",
    "images": [
      {
        "id": 70,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000006a488207aee3ea051d52e362.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 183,
    "name": "Lakshmi Pendant Palakka(Ruby)",
    "slug": "lakshmi-pendant-palakkaruby",
    "sku": "CH-WP-183",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 950,
    "salePrice": 699,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Lakshmi Pendant Palakka(Ruby) — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Lakshmi Pendant Palakka(Ruby) — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Temple Jewellery",
    "occasion": "Festive & Daily Wear",
    "tags": "ad-jewellery-american-diamond-ad-earrings-party-wear-jewellery-bridal-jewellery-festive-jewellery-statement-jewellery",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000001cc082078bc73ebb182cd32d.png",
    "images": [
      {
        "id": 59,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000001cc082078bc73ebb182cd32d.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 187,
    "name": "Two Headed Eagle pendant",
    "slug": "two-headed-eagle-pendant",
    "sku": "CH-WP-187",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 1240,
    "salePrice": 799,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Two Headed Eagle pendant — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Simple, elegant, and rooted in tradition. ✨\nPerfectly crafted to complement your traditional bridesmaid look.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Bridal & Festive",
    "tags": "ad-jewellery-american-diamond-ad-earrings-party-wear-jewellery-bridal-jewellery-festive-jewellery-statement-jewellery",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000005128820dae4ff3240ca096b2.png",
    "images": [
      {
        "id": 322,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000005128820dae4ff3240ca096b2.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 188,
    "name": "Thanka Kashu Chain",
    "slug": "thanka-kashu-chain",
    "sku": "CH-WP-188",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 750,
    "salePrice": 429,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Simple, elegant, and rooted in tradition. ✨\nPerfectly crafted to complement your traditional bridesmaid look.",
    "description": "Simple, elegant, and rooted in tradition. ✨\nPerfectly crafted to complement your traditional bridesmaid look.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000003508230aaebf6572bc81574.png",
    "images": [
      {
        "id": 95,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000003508230aaebf6572bc81574.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 189,
    "name": "AD Leaf & Flower Necklace",
    "slug": "ad-leaf-flower-necklace",
    "sku": "CH-WP-189",
    "category": "AD jewellery",
    "categoryId": 20,
    "categorySlug": "ad-jewellery",
    "categories": [
      {
        "id": 20,
        "name": "AD jewellery",
        "slug": "ad-jewellery"
      },
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 799,
    "salePrice": 399,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "AD Leaf & Flower Necklace — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Brilliant shine, graceful design",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "AD Stone",
    "occasion": "Festive & Daily Wear",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000007d80820e9ae621e35c2631b8.png",
    "images": [
      {
        "id": 323,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000007d80820e9ae621e35c2631b8.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 190,
    "name": "Petal AD Necklace Green",
    "slug": "petal-ad-necklace-green",
    "sku": "CH-WP-190",
    "category": "AD jewellery",
    "categoryId": 20,
    "categorySlug": "ad-jewellery",
    "categories": [
      {
        "id": 20,
        "name": "AD jewellery",
        "slug": "ad-jewellery"
      }
    ],
    "regularPrice": 1110,
    "salePrice": 679,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Petal AD Necklace Green — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Beautifully set with sparkling AD stones",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "AD Stone",
    "occasion": "Bridal & Festive",
    "tags": "ad-jewellery-american-diamond-ad-earrings-party-wear-jewellery-bridal-jewellery-festive-jewellery-statement-jewellery",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000a17c81f597d9b46df953d5be.png",
    "images": [
      {
        "id": 324,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000a17c81f597d9b46df953d5be.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 192,
    "name": "Rajalakshmi Temple Haram(Green)",
    "slug": "rajalakshmi-temple-haram",
    "sku": "CH-WP-192",
    "category": "Long Haram",
    "categoryId": 19,
    "categorySlug": "traditional-long-haramas",
    "categories": [
      {
        "id": 19,
        "name": "Long Haram",
        "slug": "traditional-long-haramas"
      }
    ],
    "regularPrice": 1599,
    "salePrice": 1099,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Rajalakshmi Temple Haram(Green) — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Classic roots, modern elegance. ✨\nTraditional beauty designed with a contemporary feel.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Temple Jewellery",
    "occasion": "Bridal & Festive",
    "tags": "charmika-jewellery-gold-plated-jewellery-traditional-jewellery-indian-jewellery-kerala-jewellery-temple-jewellery-bridal-jewellery-festive-jewellery-ethnic-jewellery",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000025ac81fa8e6a8182f51abaa3.png",
    "images": [
      {
        "id": 302,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000025ac81fa8e6a8182f51abaa3.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 193,
    "name": "Palakka Leaf Pendant Chain",
    "slug": "palakka-leaf-pendant-chain",
    "sku": "CH-WP-193",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 899,
    "salePrice": 519,
    "stock": 0,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Palakka Leaf Pendant Chain — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Classic roots, modern elegance. ✨\nTraditional beauty designed with a contemporary feel.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Temple Jewellery",
    "occasion": "Festive & Daily Wear",
    "tags": "https-paleturquoise-weasel-278625-hostingersite-com-wp-content-uploads-2026-10-file_000000008094820883781a12e43e7cf6-png",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000bfa48211817b94d34552d31b.png",
    "images": [
      {
        "id": 41,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000bfa48211817b94d34552d31b.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 194,
    "name": "Temple Bloom Pendant Chain",
    "slug": "temple-bloom-pendant-chain",
    "sku": "CH-WP-194",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 1011,
    "salePrice": 619,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Temple Bloom Pendant Chain — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Timeless traditional jewellery for a graceful bridesmaid look. 🌸",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Temple Jewellery",
    "occasion": "Bridal & Festive",
    "tags": "ethnic-jewellery-statement-jewellery-elegant-jewellery-womens-jewellery-handcrafted-jewellery-gift-for-her",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000008094820883781a12e43e7cf6.png",
    "images": [
      {
        "id": 228,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000008094820883781a12e43e7cf6.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 196,
    "name": "Palakka Mala Necklace(Green)",
    "slug": "palakka-mala-necklacegreen",
    "sku": "CH-WP-196",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 899,
    "salePrice": 499,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Palakka Mala Necklace(Green) — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "A touch of tradition for your special moments. ✨",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Temple Jewellery",
    "occasion": "Festive & Daily Wear",
    "tags": "ethnic-jewellery-statement-jewellery-elegant-jewellery-womens-jewellery-handcrafted-jewellery-gift-for-her",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000032b4820bb0de10f8e54b87a6.png",
    "images": [
      {
        "id": 71,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000032b4820bb0de10f8e54b87a6.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 199,
    "name": "Mullamuttu R&G Stone",
    "slug": "mullamuttu-rg-stone",
    "sku": "CH-WP-199",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 950,
    "salePrice": 699,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Mullamuttu R&G Stone — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "A little tradition, a lot of elegance. 🌸\nPerfectly chosen pieces to complete your bridesmaid look with timeless Indian charm.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "ethnic-jewellery-statement-jewellery-elegant-jewellery-womens-jewellery-handcrafted-jewellery-gift-for-her",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000000758820b944e62d613b52cdb.png",
    "images": [
      {
        "id": 91,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000000758820b944e62d613b52cdb.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 200,
    "name": "White Muthu Single Layer chain",
    "slug": "white-muthu-single-layer-chain",
    "sku": "CH-WP-200",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 899,
    "salePrice": 399,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "White Muthu Single Layer chain — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Simple, elegant, and traditional.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "ethnic-jewellery-statement-jewellery-elegant-jewellery-womens-jewellery-handcrafted-jewellery-gift-for-her",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000fe608211b2ff54794836148f.png",
    "images": [
      {
        "id": 66,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000fe608211b2ff54794836148f.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 203,
    "name": "Radha Krishna Locket Chain",
    "slug": "radha-krishna-locket-chain",
    "sku": "CH-WP-203",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 700,
    "salePrice": 300,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Radha Krishna Locket Chain — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Radha Krishna Locket Chain — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "bridal-jewellery, charmika-jewellery, festive-jewellery, gold-plated-jewellery, kerala-jewellery, temple-jewellery, traditional-jewellery",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000006e8481f8bc512a3ffe427ae3.png",
    "images": [
      {
        "id": 205,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000006e8481f8bc512a3ffe427ae3.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 201,
    "name": "Ilakkathali Choker",
    "slug": "ilakkathali-choker",
    "sku": "CH-WP-201",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 899,
    "salePrice": 420,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Ilakkathali Choker — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "A touch of Kerala tradition. ✨\nTimeless jewellery inspired by the elegance and beauty of Kerala’s traditional style.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Temple Jewellery",
    "occasion": "Festive & Daily Wear",
    "tags": "charmika-jewellery, festive-jewellery, gold-plated-jewellery, kerala-jewellery, temple-jewellery, traditional-jewellery, traditional-jewellery-indian-jewellery-kerala-jewellery-temple-jewellery-bridal-jewellery-festive-jewellery-ethnic-jewellery",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000001828820ba5b788e2acaa367d.png",
    "images": [
      {
        "id": 1,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000001828820ba5b788e2acaa367d.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 206,
    "name": "Kathakali Chain",
    "slug": "kathakali-chain",
    "sku": "CH-WP-206",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 899,
    "salePrice": 619,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Kathakali Chain — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Timeless charm, beautifully adorned. 🤍\nClassic traditional pieces with an elegant, contemporary feel.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000527c81faa8bb1b2102c01630.png",
    "images": [
      {
        "id": 85,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000527c81faa8bb1b2102c01630.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 207,
    "name": "Attigai Double Layer Blue nd White Stone",
    "slug": "attigai-double-layer-blue-nd-white-stone",
    "sku": "CH-WP-207",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 21,
        "name": "Luxe",
        "slug": "premium-above-1000"
      },
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 1600,
    "salePrice": 1099,
    "stock": 0,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Attigai Double Layer Blue nd White Stone — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Timeless traditional charm. ✨",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Bridal & Festive",
    "tags": "bridal-jewellery, charmika-jewellery, festive-jewellery, gold-plated-jewellery, kerala-jewellery, temple-jewellery, traditional-jewellery",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000717c81fab95425fb6f2bcdac.png",
    "images": [
      {
        "id": 86,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000717c81fab95425fb6f2bcdac.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 208,
    "name": "Illakathali Modern Choker",
    "slug": "illakathali-modern-choker",
    "sku": "CH-WP-208",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 899,
    "salePrice": 710,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Illakathali Modern Choker — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "A beautiful blend of tradition and contemporary style. ✨",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "bridal-jewellery, charmika-jewellery, festive-jewellery, gold-plated-jewellery, kerala-jewellery, temple-jewellery, traditional-jewellery",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000000afc820a99e4193ee65da817.png",
    "images": [
      {
        "id": 209,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000000afc820a99e4193ee65da817.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 219,
    "name": "AD Crystal flower Necklace (Green)",
    "slug": "ad-crystal-flower-necklace-green",
    "sku": "CH-WP-219",
    "category": "AD jewellery",
    "categoryId": 20,
    "categorySlug": "ad-jewellery",
    "categories": [
      {
        "id": 20,
        "name": "AD jewellery",
        "slug": "ad-jewellery"
      },
      {
        "id": 21,
        "name": "Luxe",
        "slug": "premium-above-1000"
      },
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 2450,
    "salePrice": 1079,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "AD Crystal flower Necklace (Green) — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Delicate design, dazzling finish",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "AD Stone",
    "occasion": "Bridal & Festive",
    "tags": "statement-jewellery-elegant-jewellery-womens-jewellery-handcrafted-jewellery-gift-for-her",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000c1a481fa8f4e610ffe98f48a.png",
    "images": [
      {
        "id": 303,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000c1a481fa8f4e610ffe98f48a.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 217,
    "name": "Pearl Lotus Grace (Green)",
    "slug": "pearl-lotus-grace-green",
    "sku": "CH-WP-217",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 499,
    "salePrice": 389,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Pearl Lotus Grace (Green) — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Pearl Lotus Grace (Green) — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "traditional-jewellery-indian-jewellery-kerala-jewellery-temple-jewellery-bridal-jewellery-festive-jewellery-ethnic-jewellery",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000c07881f5b7733aaa4f69b1be.png",
    "images": [
      {
        "id": 50,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000c07881f5b7733aaa4f69b1be.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 214,
    "name": "Lakshmi Green bead Necklace",
    "slug": "lakshmi-green-bead-necklace",
    "sku": "CH-WP-214",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 899,
    "salePrice": 629,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Lakshmi Green bead Necklace — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Classic pieces for timeless beauty.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Temple Jewellery",
    "occasion": "Festive & Daily Wear",
    "tags": "traditional-jewellery-indian-jewellery-kerala-jewellery-temple-jewellery-bridal-jewellery-festive-jewellery-ethnic-jewellery",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000100c820b85a4b300f1daba63.png",
    "images": [
      {
        "id": 215,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000100c820b85a4b300f1daba63.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 216,
    "name": "Hasli Bestseller",
    "slug": "hasli-bestseller",
    "sku": "CH-WP-216",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 599,
    "salePrice": 469,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "For the bride’s favourite girls. ✨\nTraditional elegance designed to make every bridesmaid look effortlessly beautiful.",
    "description": "For the bride’s favourite girls. ✨\nTraditional elegance designed to make every bridesmaid look effortlessly beautiful.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "traditional-jewellery-indian-jewellery-kerala-jewellery-temple-jewellery-bridal-jewellery-festive-jewellery-ethnic-jewellery",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000006bbc81fabd229c5a8e70cfe5.png",
    "images": [
      {
        "id": 69,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000006bbc81fabd229c5a8e70cfe5.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 222,
    "name": "Crystal Drops (Blue)",
    "slug": "crystal-drops-blue",
    "sku": "CH-WP-222",
    "category": "Minimal Neck Chains",
    "categoryId": 126,
    "categorySlug": "minimal-neck-chains",
    "categories": [
      {
        "id": 126,
        "name": "Minimal Neck Chains",
        "slug": "minimal-neck-chains"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 499,
    "salePrice": 349,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Crystal Drops (Blue) — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Crystal Drops (Blue) — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "charmika-jewellery-gold-plated-jewellery-traditional-jewellery",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000ef4081f4a16654d61ad4c1bb.png",
    "images": [
      {
        "id": 49,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000ef4081f4a16654d61ad4c1bb.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 223,
    "name": "Crystal Drop (Pink)",
    "slug": "crystal-drop-pink",
    "sku": "CH-WP-223",
    "category": "Minimal Neck Chains",
    "categoryId": 126,
    "categorySlug": "minimal-neck-chains",
    "categories": [
      {
        "id": 126,
        "name": "Minimal Neck Chains",
        "slug": "minimal-neck-chains"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 499,
    "salePrice": 349,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Crystal Drop (Pink) — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Crystal Drop (Pink) — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000073e481f585e2cf880157d908-1.png",
    "images": [
      {
        "id": 224,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000073e481f585e2cf880157d908-1.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 225,
    "name": "Crystal Drops (Blue &White)",
    "slug": "crystal-drops-blue-white",
    "sku": "CH-WP-225",
    "category": "Minimal Neck Chains",
    "categoryId": 126,
    "categorySlug": "minimal-neck-chains",
    "categories": [
      {
        "id": 126,
        "name": "Minimal Neck Chains",
        "slug": "minimal-neck-chains"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 499,
    "salePrice": 349,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Crystal Drops (Blue &White) — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Crystal Drops (Blue &White) — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "charmika-jewellery-gold-plated-jewellery-traditional-jewellery",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000a8c881f490b8173902227add-1.png",
    "images": [
      {
        "id": 226,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000a8c881f490b8173902227add-1.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 221,
    "name": "AD Crystal flower Necklace (White)",
    "slug": "ad-crystal-flower-necklace-white",
    "sku": "CH-WP-221",
    "category": "AD jewellery",
    "categoryId": 20,
    "categorySlug": "ad-jewellery",
    "categories": [
      {
        "id": 20,
        "name": "AD jewellery",
        "slug": "ad-jewellery"
      },
      {
        "id": 21,
        "name": "Luxe",
        "slug": "premium-above-1000"
      },
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 2450,
    "salePrice": 1079,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "AD Crystal flower Necklace (White) — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Delicate design, dazzling finish",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "AD Stone",
    "occasion": "Bridal & Festive",
    "tags": "bridal-jewellery, charmika-jewellery, festive-jewellery, gold-plated-jewellery, kerala-jewellery, temple-jewellery, traditional-jewellery",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000006fe481faa8ef00cc15fb13b5.png",
    "images": [
      {
        "id": 313,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000006fe481faa8ef00cc15fb13b5.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 220,
    "name": "AD Crystal flower Necklace (Red)",
    "slug": "ad-crystal-flower-necklace-red",
    "sku": "CH-WP-220",
    "category": "AD jewellery",
    "categoryId": 20,
    "categorySlug": "ad-jewellery",
    "categories": [
      {
        "id": 20,
        "name": "AD jewellery",
        "slug": "ad-jewellery"
      },
      {
        "id": 21,
        "name": "Luxe",
        "slug": "premium-above-1000"
      },
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 2450,
    "salePrice": 1079,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "AD Crystal flower Necklace (Red) — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Delicate design, dazzling finish",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "AD Stone",
    "occasion": "Bridal & Festive",
    "tags": "statement-jewellery-elegant-jewellery-womens-jewellery-handcrafted-jewellery-gift-for-her",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000fd4881fa95d05c85d5c9ac03.png",
    "images": [
      {
        "id": 300,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000fd4881fa95d05c85d5c9ac03.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 218,
    "name": "Pearl Lotus Grace (Pink)",
    "slug": "pearl-lotus-grace-pink",
    "sku": "CH-WP-218",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 499,
    "salePrice": 389,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Pearl Lotus Grace (Pink) — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Pearl Lotus Grace (Pink) — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "traditional-jewellery-indian-jewellery-kerala-jewellery-temple-jewellery-bridal-jewellery-festive-jewellery-ethnic-jewellery",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000032a081fab931d94c88c53b48.png",
    "images": [
      {
        "id": 312,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000032a081fab931d94c88c53b48.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 198,
    "name": "Palakka Mala Necklace(Vadamalli)",
    "slug": "palakka-mala-necklacevadamalli",
    "sku": "CH-WP-198",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 899,
    "salePrice": 499,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Palakka Mala Necklace(Vadamalli) — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "A touch of tradition for your special moments. ✨",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Temple Jewellery",
    "occasion": "Festive & Daily Wear",
    "tags": "ethnic-jewellery-statement-jewellery-elegant-jewellery-womens-jewellery-handcrafted-jewellery-gift-for-her",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000be6081faa8d18ffe3807e0c8.png",
    "images": [
      {
        "id": 40,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000be6081faa8d18ffe3807e0c8.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 191,
    "name": "Petal AD Necklace Red",
    "slug": "petal-ad-necklace-red",
    "sku": "CH-WP-191",
    "category": "AD jewellery",
    "categoryId": 20,
    "categorySlug": "ad-jewellery",
    "categories": [
      {
        "id": 20,
        "name": "AD jewellery",
        "slug": "ad-jewellery"
      }
    ],
    "regularPrice": 1100,
    "salePrice": 679,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Petal AD Necklace Red — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Beautifully set with sparkling AD stones",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "AD Stone",
    "occasion": "Bridal & Festive",
    "tags": "ad-jewellery-american-diamond-ad-earrings-party-wear-jewellery-bridal-jewellery-festive-jewellery-statement-jewellery",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000193481f494a387469075a160.png",
    "images": [
      {
        "id": 325,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000193481f494a387469075a160.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 186,
    "name": "Petal AD Dual stone Necklace (Ruby and Green)",
    "slug": "ad-dual-stone-necklace-ruby-and-pink",
    "sku": "CH-WP-186",
    "category": "AD jewellery",
    "categoryId": 20,
    "categorySlug": "ad-jewellery",
    "categories": [
      {
        "id": 20,
        "name": "AD jewellery",
        "slug": "ad-jewellery"
      },
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 1140,
    "salePrice": 849,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Petal AD Dual stone Necklace (Ruby and Green) — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Delicate design, dazzling finish",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "AD Stone",
    "occasion": "Bridal & Festive",
    "tags": "ad-jewellery-american-diamond-ad-earrings-party-wear-jewellery-bridal-jewellery-festive-jewellery-statement-jewellery-imitation-jewellery-charmika-jewellery",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000004da481fa93faf109306e96db.png",
    "images": [
      {
        "id": 306,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000004da481fa93faf109306e96db.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 176,
    "name": "Geometric Link necklace Pink",
    "slug": "geometric-link-necklace-pink",
    "sku": "CH-WP-176",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 899,
    "salePrice": 550,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Geometric Link necklace Pink — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Timeless traditional jewellery for a graceful bridesmaid look. 🌸",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000f99081fa9893a62422260d47.png",
    "images": [
      {
        "id": 299,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000f99081fa9893a62422260d47.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 175,
    "name": "Geometric Link necklace Green",
    "slug": "geometric-link-necklace-green",
    "sku": "CH-WP-175",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 899,
    "salePrice": 550,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Geometric Link necklace Green — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Timeless traditional jewellery for a graceful bridesmaid look. 🌸",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000065d081fa87aaa81eb27991dd.png",
    "images": [
      {
        "id": 304,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000065d081fa87aaa81eb27991dd.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 173,
    "name": "SwarnaLekshmi Double layer -Ruby & green",
    "slug": "swarnalekshmi-double-layer-ruby-green",
    "sku": "CH-WP-173",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 1200,
    "salePrice": 899,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "SwarnaLekshmi Double layer -Ruby & green — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "For the bride’s favourite girls. ✨\nTraditional elegance designed to make every bridesmaid look effortlessly beautiful.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Temple Jewellery",
    "occasion": "Bridal & Festive",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000ba7c8208ad1c42e421b48610.png",
    "images": [
      {
        "id": 171,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000ba7c8208ad1c42e421b48610.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 167,
    "name": "Dual Lekshmi Kasu Choker set",
    "slug": "dual-lekshmi-kasu-choker-set",
    "sku": "CH-WP-167",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 970,
    "salePrice": 499,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": true,
    "added": "01 Nov 2026",
    "shortDescription": "Dual Lekshmi Kasu Choker set — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Classic roots, modern elegance. ✨\nTraditional beauty designed with a contemporary feel.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Temple Jewellery",
    "occasion": "Festive & Daily Wear",
    "tags": "oduct-tags-charmika-jewellery-gold-plated-jewellery-traditional-jewellery-indian-jewellery",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000003ed08230b4082e3e4f31e673.png",
    "images": [
      {
        "id": 58,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000003ed08230b4082e3e4f31e673.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 166,
    "name": "Gaja Flower locket",
    "slug": "gaja-flower-locket",
    "sku": "CH-WP-166",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 780,
    "salePrice": 520,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Gaja Flower locket — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Gaja Flower locket — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "charmika-jewellery-gold-plated-jewellery-traditional-jewellery-indian-jewellery-kerala-jewellery-temple-jewellery-bridal-jewellery-festive-jewellery",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000004634822f936505edacbdb407-1.png",
    "images": [
      {
        "id": 231,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000004634822f936505edacbdb407-1.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 164,
    "name": "Illakathali Ruby Stone choker",
    "slug": "illakathali-ruby-stone-choker",
    "sku": "CH-WP-164",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 1270,
    "salePrice": 799,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Illakathali Ruby Stone choker — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Classic Kerala elegance, kept simple. 🌿",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Bridal & Festive",
    "tags": "charmika-jewellery-gold-plated-jewellery-traditional-jewellery-indian-jewellery-kerala-jewellery-temple-jewellery-bridal-jewellery-festive-jewellery",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000132482088482089c3bb100f1.png",
    "images": [
      {
        "id": 165,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000132482088482089c3bb100f1.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 163,
    "name": "Simple Chandrika Necklace",
    "slug": "simple-chandrika-necklace",
    "sku": "CH-WP-163",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 899,
    "salePrice": 480,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Simple Chandrika Necklace — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Tradition with a touch of grace🌙",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "charmika-jewellery-gold-plated-jewellery-traditional-jewellery-indian-jewellery-kerala-jewellery-temple-jewellery-bridal-jewellery-festive-jewellery",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000933482079d30749bc6783e33.png",
    "images": [
      {
        "id": 101,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000933482079d30749bc6783e33.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 161,
    "name": "Kashu Illakathali choker",
    "slug": "kashi-illakathali-choker",
    "sku": "CH-WP-161",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 890,
    "salePrice": 699,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Kashu Illakathali choker — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "A touch of Kerala tradition. ✨\nTimeless jewellery inspired by the elegance and beauty of Kerala’s traditional style.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "charmika-jewellery-gold-plated-jewellery-traditional-jewellery-indian-jewellery-kerala-jewellery-temple-jewellery-bridal-jewellery-festive-jewellery",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000002f68820884ecf70b52d38e90.png",
    "images": [
      {
        "id": 162,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000002f68820884ecf70b52d38e90.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 159,
    "name": "Palakka Green Long Haram with Round Pendant",
    "slug": "palakka-green-long-haram-with-round-pendant",
    "sku": "CH-WP-159",
    "category": "Long Haram",
    "categoryId": 19,
    "categorySlug": "traditional-long-haramas",
    "categories": [
      {
        "id": 19,
        "name": "Long Haram",
        "slug": "traditional-long-haramas"
      }
    ],
    "regularPrice": 1139,
    "salePrice": 649,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Palakka Green Long Haram with Round Pendant — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "A touch of Kerala tradition. ✨\nTimeless jewellery inspired by the elegance and beauty of Kerala’s traditional style.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Temple Jewellery",
    "occasion": "Bridal & Festive",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000003b38820b801ac394b2cc08c7.png",
    "images": [
      {
        "id": 61,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000003b38820b801ac394b2cc08c7.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 154,
    "name": "Ruby stone flower Necklace",
    "slug": "ruby-stone-flower-necklace",
    "sku": "CH-WP-154",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 599,
    "salePrice": 319,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Ruby stone flower Necklace — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "A touch of tradition for your special moments. ✨",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000002e90821181782d1974881d98.png",
    "images": [
      {
        "id": 63,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000002e90821181782d1974881d98.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 153,
    "name": "Palakka Necklace Blue",
    "slug": "palakkad-necklace-blue",
    "sku": "CH-WP-153",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 890,
    "salePrice": 499,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Palakka Necklace Blue — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "A little tradition, a lot of elegance. 🌸\nPerfectly chosen pieces to complete your bridesmaid look with timeless Indian charm.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Temple Jewellery",
    "occasion": "Festive & Daily Wear",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000947481fa818dd90ed8ddb9b5.png",
    "images": [
      {
        "id": 94,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000947481fa818dd90ed8ddb9b5.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 151,
    "name": "Lakshmi Coin Necklace",
    "slug": "lakshmi-coin-necklace",
    "sku": "CH-WP-151",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 899,
    "salePrice": 499,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Lakshmi Coin Necklace — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "A little tradition, a lot of elegance. 🌸\nPerfectly chosen pieces to complete your bridesmaid look with timeless Indian charm.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Temple Jewellery",
    "occasion": "Festive & Daily Wear",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000bbc4820b81dc80bc3ea790d1.png",
    "images": [
      {
        "id": 39,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000bbc4820b81dc80bc3ea790d1.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 150,
    "name": "Mayuri Wheel Necklace",
    "slug": "mayuri-wheel-necklace",
    "sku": "CH-WP-150",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 699,
    "salePrice": 499,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Mayuri Wheel Necklace — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Mayuri Wheel Necklace — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Gold Plated",
    "occasion": "Festive & Daily Wear",
    "tags": "festive-jewellery-ethnic-jewellery-statement-jewellery-elegant-jewellery-womens-jewellery",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000061ec820ba75a511f8a887c8d.png",
    "images": [
      {
        "id": 82,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000061ec820ba75a511f8a887c8d.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 148,
    "name": "Lakshmi Peacock Necklace",
    "slug": "lakshmi-peacock-necklace",
    "sku": "CH-WP-148",
    "category": "Necklace",
    "categoryId": 18,
    "categorySlug": "necklace",
    "categories": [
      {
        "id": 18,
        "name": "Necklace",
        "slug": "necklace"
      }
    ],
    "regularPrice": 899,
    "salePrice": 549,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Lakshmi Peacock Necklace — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Lakshmi Peacock Necklace — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Premium Gold Plated Brass",
    "jewelleryType": "Temple Jewellery",
    "occasion": "Festive & Daily Wear",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000825c82089e4e07437d8b15ca.png",
    "images": [
      {
        "id": 149,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000825c82089e4e07437d8b15ca.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 146,
    "name": "Stone 2 Leaf bangle",
    "slug": "stone-2-leaf-bangle",
    "sku": "CH-WP-146",
    "category": "Anti tarnish jewellery",
    "categoryId": 16,
    "categorySlug": "anti-tarnish-jewellery",
    "categories": [
      {
        "id": 16,
        "name": "Anti tarnish jewellery",
        "slug": "anti-tarnish-jewellery"
      }
    ],
    "regularPrice": 499,
    "salePrice": 280,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Stone 2 Leaf bangle — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Stone 2 Leaf bangle — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Anti-Tarnish Stainless Steel / Gold Plated",
    "jewelleryType": "Anti Tarnish",
    "occasion": "Festive & Daily Wear",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000009b508207870f5091ab15c648.png",
    "images": [
      {
        "id": 120,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000009b508207870f5091ab15c648.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 145,
    "name": "Green Chained anti tarnish Bangle",
    "slug": "green-chained-anti-tarnish-bangle",
    "sku": "CH-WP-145",
    "category": "Anti tarnish jewellery",
    "categoryId": 16,
    "categorySlug": "anti-tarnish-jewellery",
    "categories": [
      {
        "id": 16,
        "name": "Anti tarnish jewellery",
        "slug": "anti-tarnish-jewellery"
      }
    ],
    "regularPrice": 499,
    "salePrice": 225,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Green Chained anti tarnish Bangle — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Anti-Tarnish Jewellery ✨\nDesigned to stay beautiful for longer, our anti-tarnish jewellery offers lasting shine and everyday elegance. Lightweight, stylish, and easy to wear—perfect for adding a timeless touch to any look.",
    "material": "Anti-Tarnish Stainless Steel / Gold Plated",
    "jewelleryType": "Anti Tarnish",
    "occasion": "Festive & Daily Wear",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000050888211a82cb9d5389df5db.png",
    "images": [
      {
        "id": 124,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000050888211a82cb9d5389df5db.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 144,
    "name": "Red  chained  bangle",
    "slug": "red-chained-bangle",
    "sku": "CH-WP-144",
    "category": "Anti tarnish jewellery",
    "categoryId": 16,
    "categorySlug": "anti-tarnish-jewellery",
    "categories": [
      {
        "id": 16,
        "name": "Anti tarnish jewellery",
        "slug": "anti-tarnish-jewellery"
      }
    ],
    "regularPrice": 499,
    "salePrice": 225,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Red  chained  bangle — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Timeless pieces crafted to retain their shine and beauty. Our anti-tarnish jewellery is perfect for everyday wear, effortlessly adding elegance to every outfit.",
    "material": "Anti-Tarnish Stainless Steel / Gold Plated",
    "jewelleryType": "Anti Tarnish",
    "occasion": "Festive & Daily Wear",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000009ee082118946c538a8bd1742.png",
    "images": [
      {
        "id": 118,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000009ee082118946c538a8bd1742.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 143,
    "name": "Flower bangle anti tarnish & free ring",
    "slug": "flower-bangle-anti-tarnish-free-ring",
    "sku": "CH-WP-143",
    "category": "Anti tarnish jewellery",
    "categoryId": 16,
    "categorySlug": "anti-tarnish-jewellery",
    "categories": [
      {
        "id": 16,
        "name": "Anti tarnish jewellery",
        "slug": "anti-tarnish-jewellery"
      }
    ],
    "regularPrice": 699,
    "salePrice": 399,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Flower bangle anti tarnish & free ring — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Made for your everyday moments. Our anti-tarnish jewellery is designed to maintain its beautiful finish while bringing effortless elegance to your style.",
    "material": "Anti-Tarnish Stainless Steel / Gold Plated",
    "jewelleryType": "Anti Tarnish",
    "occasion": "Festive & Daily Wear",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000ee748207a2485029dce91b2e.png",
    "images": [
      {
        "id": 119,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000ee748207a2485029dce91b2e.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 139,
    "name": "Clover white stone bangle",
    "slug": "clover-white-stone-bangle",
    "sku": "CH-WP-139",
    "category": "Anti tarnish jewellery",
    "categoryId": 16,
    "categorySlug": "anti-tarnish-jewellery",
    "categories": [
      {
        "id": 16,
        "name": "Anti tarnish jewellery",
        "slug": "anti-tarnish-jewellery"
      }
    ],
    "regularPrice": 499,
    "salePrice": 350,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Elevate your everyday style with jewellery designed to stay radiant. Thoughtfully crafted with a beautiful anti-tarnish finish for lasting elegance.",
    "description": "Elevate your everyday style with jewellery designed to stay radiant. Thoughtfully crafted with a beautiful anti-tarnish finish for lasting elegance.",
    "material": "Anti-Tarnish Stainless Steel / Gold Plated",
    "jewelleryType": "Anti Tarnish",
    "occasion": "Festive & Daily Wear",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000d31082118471bd670eb86748.png",
    "images": [
      {
        "id": 128,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000d31082118471bd670eb86748.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 135,
    "name": "Circle anti tarnish bangle and Free Ring",
    "slug": "bubble-anti-tarnish-bangle-and-free-ring",
    "sku": "CH-WP-135",
    "category": "Anti tarnish jewellery",
    "categoryId": 16,
    "categorySlug": "anti-tarnish-jewellery",
    "categories": [
      {
        "id": 16,
        "name": "Anti tarnish jewellery",
        "slug": "anti-tarnish-jewellery"
      }
    ],
    "regularPrice": 599,
    "salePrice": 450,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Circle anti tarnish bangle and Free Ring — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Elevate your everyday style with jewellery designed to stay radiant. Thoughtfully crafted with a beautiful anti-tarnish finish for lasting elegance.",
    "material": "Anti-Tarnish Stainless Steel / Gold Plated",
    "jewelleryType": "Anti Tarnish",
    "occasion": "Festive & Daily Wear",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000bc808211a4a2c0680d6cc93d.png",
    "images": [
      {
        "id": 116,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000bc808211a4a2c0680d6cc93d.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 134,
    "name": "Bamboo gold plated Bangle  & free ring",
    "slug": "bamboo-gold-plated-bangle-free-ring",
    "sku": "CH-WP-134",
    "category": "Anti tarnish jewellery",
    "categoryId": 16,
    "categorySlug": "anti-tarnish-jewellery",
    "categories": [
      {
        "id": 16,
        "name": "Anti tarnish jewellery",
        "slug": "anti-tarnish-jewellery"
      }
    ],
    "regularPrice": 499,
    "salePrice": 350,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Bamboo gold plated Bangle  & free ring — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Anti-Tarnish Jewellery ✨\nDesigned to stay beautiful for longer, our anti-tarnish jewellery offers lasting shine and everyday elegance. Lightweight, stylish, and easy to wear—perfect for adding a timeless touch to any look.",
    "material": "Anti-Tarnish Stainless Steel / Gold Plated",
    "jewelleryType": "Anti Tarnish",
    "occasion": "Festive & Daily Wear",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000e5dc8207b59971a2d2ffeee9.png",
    "images": [
      {
        "id": 122,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000e5dc8207b59971a2d2ffeee9.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 133,
    "name": "Butterfly bead bangle & free ring",
    "slug": "butterfly-bead-bangle-free-ring",
    "sku": "CH-WP-133",
    "category": "Anti tarnish jewellery",
    "categoryId": 16,
    "categorySlug": "anti-tarnish-jewellery",
    "categories": [
      {
        "id": 16,
        "name": "Anti tarnish jewellery",
        "slug": "anti-tarnish-jewellery"
      }
    ],
    "regularPrice": 499,
    "salePrice": 450,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Butterfly bead bangle & free ring — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Everyday Protection\nHelp keep your items looking clean and polished with anti-tarnish protection.\nMade for Care\nA practical choice for protecting items from the effects of tarnishing.\nEasy to Add\nUse as part of your regular care routine to help maintain their appearance.",
    "material": "Anti-Tarnish Stainless Steel / Gold Plated",
    "jewelleryType": "Anti Tarnish",
    "occasion": "Festive & Daily Wear",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000001b00821180c4a75445c27082.png",
    "images": [
      {
        "id": 126,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000001b00821180c4a75445c27082.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 131,
    "name": "Clover Black Bracelet and Free ring",
    "slug": "clover-black-bracelet-and-free-ring",
    "sku": "CH-WP-131",
    "category": "Anti tarnish jewellery",
    "categoryId": 16,
    "categorySlug": "anti-tarnish-jewellery",
    "categories": [
      {
        "id": 16,
        "name": "Anti tarnish jewellery",
        "slug": "anti-tarnish-jewellery"
      }
    ],
    "regularPrice": 399,
    "salePrice": 299,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Clover Black Bracelet and Free ring — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Everyday Style\nAdd a subtle touch to your look with the Clover Black Bracelet, featuring a classic black design.\nEasy to Pair\nIts versatile style works well with a range of outfits and occasions.\nComplimentary Ring\nThe bracelet comes with a ring, making this set a thoughtful addition to your accessories.",
    "material": "Anti-Tarnish Stainless Steel / Gold Plated",
    "jewelleryType": "Anti Tarnish",
    "occasion": "Festive & Daily Wear",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000e5008211aebb7689dba7ebb9.png",
    "images": [
      {
        "id": 125,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000e5008211aebb7689dba7ebb9.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 130,
    "name": "Clover Bracelet Red & Free Ring",
    "slug": "clover-bracelet-red-free-ring",
    "sku": "CH-WP-130",
    "category": "Anti tarnish jewellery",
    "categoryId": 16,
    "categorySlug": "anti-tarnish-jewellery",
    "categories": [
      {
        "id": 16,
        "name": "Anti tarnish jewellery",
        "slug": "anti-tarnish-jewellery"
      }
    ],
    "regularPrice": 399,
    "salePrice": 299,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Clover Bracelet Red & Free Ring — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Clover Bracelet Red & Free Ring — Handcrafted luxury design by Charmika By Lekshmi.",
    "material": "Anti-Tarnish Stainless Steel / Gold Plated",
    "jewelleryType": "Anti Tarnish",
    "occasion": "Festive & Daily Wear",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000e04482118a1b455b1c48282a.png",
    "images": [
      {
        "id": 117,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000e04482118a1b455b1c48282a.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 115,
    "name": "Clover bracelet White & Free ring",
    "slug": "clover-bracelet-white-free-ring",
    "sku": "CH-WP-115",
    "category": "Anti tarnish jewellery",
    "categoryId": 16,
    "categorySlug": "anti-tarnish-jewellery",
    "categories": [
      {
        "id": 16,
        "name": "Anti tarnish jewellery",
        "slug": "anti-tarnish-jewellery"
      }
    ],
    "regularPrice": 599,
    "salePrice": 299,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Clover bracelet White & Free ring — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Design\nThe Clover Bracelet adds a subtle decorative touch to everyday outfits, featuring a design inspired by the familiar clover shape.\nEasy to Style\nWear it on its own for a simple look or pair it with other accessories to suit your style.\nEveryday Accessory\nA versatile choice for casual wear or as a thoughtful gift.",
    "material": "Anti-Tarnish Stainless Steel / Gold Plated",
    "jewelleryType": "Anti Tarnish",
    "occasion": "Festive & Daily Wear",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000ab2882118578cd720d545c1e.png",
    "images": [
      {
        "id": 129,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000ab2882118578cd720d545c1e.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 114,
    "name": "Galaxy stainless chain",
    "slug": "galaxy-stainless-chain",
    "sku": "CH-WP-114",
    "category": "Anti tarnish jewellery",
    "categoryId": 16,
    "categorySlug": "anti-tarnish-jewellery",
    "categories": [
      {
        "id": 16,
        "name": "Anti tarnish jewellery",
        "slug": "anti-tarnish-jewellery"
      }
    ],
    "regularPrice": 399,
    "salePrice": 289,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Galaxy stainless chain — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Clean, Versatile Style\nThe Galaxy long pendant chain offers a simple way to wear and display a pendant, adding a graceful finishing touch to everyday outfits.\nEasy to Pair\nIts long-chain style works well layered with shorter necklaces or worn on its own for a minimal look.\nA Thoughtful Accessory\nPair it with a pendant you love to create a personal accessory for casual occasions or everyday wear.",
    "material": "Anti-Tarnish Stainless Steel / Gold Plated",
    "jewelleryType": "Anti Tarnish",
    "occasion": "Festive & Daily Wear",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000005be8820b936ab23370f90b75.png",
    "images": [
      {
        "id": 57,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000005be8820b936ab23370f90b75.png",
        "isPrimary": true,
        "displayOrder": 0
      },
      {
        "id": 57,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000005be8820b936ab23370f90b75.png",
        "isPrimary": false,
        "displayOrder": 1
      }
    ]
  },
  {
    "id": 112,
    "name": "Compass imprint pendant Chain",
    "slug": "compass-imprint-pendant-chain",
    "sku": "1",
    "category": "Anti tarnish jewellery",
    "categoryId": 16,
    "categorySlug": "anti-tarnish-jewellery",
    "categories": [
      {
        "id": 16,
        "name": "Anti tarnish jewellery",
        "slug": "anti-tarnish-jewellery"
      }
    ],
    "regularPrice": 299,
    "salePrice": 189,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Compass imprint pendant Chain — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Durable by Design\nStainless steel offers a strong, practical material choice for a wide range of products.\nClean, Modern Finish\nIts smooth metallic appearance suits both contemporary and classic styles.\nSimple Care\nWipe with a soft cloth and mild cleaner to help keep the surface looking its best.",
    "material": "Anti-Tarnish Stainless Steel / Gold Plated",
    "jewelleryType": "Anti Tarnish",
    "occasion": "Festive & Daily Wear",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000436c81fa85400c198deee221.png",
    "images": [
      {
        "id": 90,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000436c81fa85400c198deee221.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 111,
    "name": "Rose imprint Pendant Chain",
    "slug": "rose-imprint-pendant-chain",
    "sku": "CH-WP-111",
    "category": "Anti tarnish jewellery",
    "categoryId": 16,
    "categorySlug": "anti-tarnish-jewellery",
    "categories": [
      {
        "id": 16,
        "name": "Anti tarnish jewellery",
        "slug": "anti-tarnish-jewellery"
      }
    ],
    "regularPrice": 399,
    "salePrice": 219,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Rose imprint Pendant Chain — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Simple, Versatile Design\nThis stainless steel chain offers a clean look that suits a range of uses and styles.\nDurable Material\nMade from stainless steel, it provides a sturdy option for everyday wear or practical projects.\nEasy to Pair\nUse it on its own or combine it with compatible accessories for a coordinated finish.",
    "material": "Anti-Tarnish Stainless Steel / Gold Plated",
    "jewelleryType": "Anti Tarnish",
    "occasion": "Festive & Daily Wear",
    "tags": "anti-tarnish-jewellery-anti-tarnish-gold-plated-jewellery-everyday-jewellery",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000f3c082308d5eb634690eb9d8.png",
    "images": [
      {
        "id": 56,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000f3c082308d5eb634690eb9d8.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 36,
    "name": "11:11 Stone Chain",
    "slug": "1111-stone-chain",
    "sku": "2",
    "category": "Anti tarnish jewellery",
    "categoryId": 16,
    "categorySlug": "anti-tarnish-jewellery",
    "categories": [
      {
        "id": 16,
        "name": "Anti tarnish jewellery",
        "slug": "anti-tarnish-jewellery"
      }
    ],
    "regularPrice": 399,
    "salePrice": 219,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "11:11 Stone Chain — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Everyday Style\nThe 11:11 Stone gold-plated chain adds a subtle accent to everyday outfits.\nDesign\nIts gold-plated finish and stone detail create a clean, understated look.\nEasy to Pair\nWear it on its own or pair it with other accessories for a layered style.",
    "material": "Anti-Tarnish Stainless Steel / Gold Plated",
    "jewelleryType": "Anti Tarnish",
    "occasion": "Festive & Daily Wear",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000009318820bbd16fe386c4de1fb-1.png",
    "images": [
      {
        "id": 110,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000009318820bbd16fe386c4de1fb-1.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 34,
    "name": "11:11 Gold-Plated Chain",
    "slug": "1111-gold-plated-chain",
    "sku": "3",
    "category": "Anti tarnish jewellery",
    "categoryId": 16,
    "categorySlug": "anti-tarnish-jewellery",
    "categories": [
      {
        "id": 16,
        "name": "Anti tarnish jewellery",
        "slug": "anti-tarnish-jewellery"
      }
    ],
    "regularPrice": 310,
    "salePrice": 189,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "11:11 Gold-Plated Chain — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Everyday Style\nAdd a subtle golden accent to your look with the 11:11 gold-plated stainless steel chain. Its clean design pairs easily with casual and dressier outfits.\nDurable Material\nMade from stainless steel with gold plating, this chain offers a polished finish for regular wear.\nEasy to Pair\nWear it on its own for a minimalist touch or layer it with other necklaces to create your own style.",
    "material": "Anti-Tarnish Stainless Steel / Gold Plated",
    "jewelleryType": "Anti Tarnish",
    "occasion": "Festive & Daily Wear",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000dc3081fa8c836be270769ad1.png",
    "images": [
      {
        "id": 35,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000dc3081fa8c836be270769ad1.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 33,
    "name": "Cross stone Pendant Stainless Steel",
    "slug": "stainless-steel",
    "sku": "3 piece",
    "category": "Anti tarnish jewellery",
    "categoryId": 16,
    "categorySlug": "anti-tarnish-jewellery",
    "categories": [
      {
        "id": 16,
        "name": "Anti tarnish jewellery",
        "slug": "anti-tarnish-jewellery"
      }
    ],
    "regularPrice": 299,
    "salePrice": 179,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "&nbsp;",
    "description": "Simple, Versatile Style\nThe CrossStone Pendant pairs a distinctive pendant design with a stainless-steel chain for an easy-to-wear accessory.\nStainless-Steel Chain\nThe chain offers a clean, straightforward finish that complements the pendant and works with a range of everyday outfits.\nEasy to Wear\nChoose the CrossStone Pendant to add a simple accent to your personal style or give as a thoughtful gift.",
    "material": "Anti-Tarnish Stainless Steel / Gold Plated",
    "jewelleryType": "Anti Tarnish",
    "occasion": "Festive & Daily Wear",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000067fc82118328ccd646b1be79.png",
    "images": [
      {
        "id": 32,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000067fc82118328ccd646b1be79.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 25,
    "name": "Green Single pendant Clover chqin",
    "slug": "clover-neckchain",
    "sku": "4",
    "category": "Anti tarnish jewellery",
    "categoryId": 16,
    "categorySlug": "anti-tarnish-jewellery",
    "categories": [
      {
        "id": 16,
        "name": "Anti tarnish jewellery",
        "slug": "anti-tarnish-jewellery"
      }
    ],
    "regularPrice": 299,
    "salePrice": 160,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "&nbsp;\n&nbsp;\n&nbsp;",
    "description": "Add a subtle accent to your look with this green single pendant clover chain.\nThe clover-shaped pendant brings a recognizable touch of nature-inspired style.\nWear it on its own for a clean, understated look or pair it with other accessories.",
    "material": "Anti-Tarnish Stainless Steel / Gold Plated",
    "jewelleryType": "Anti Tarnish",
    "occasion": "Festive & Daily Wear",
    "tags": "",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000c9c88211a44579e379da632c.png",
    "images": [
      {
        "id": 27,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_00000000c9c88211a44579e379da632c.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 23,
    "name": "Love Drops ❤️ Anti tarnish chain",
    "slug": "love-drops-%e2%9d%a4%ef%b8%8f-anti-tarnish-chain",
    "sku": "5",
    "category": "Anti tarnish jewellery",
    "categoryId": 16,
    "categorySlug": "anti-tarnish-jewellery",
    "categories": [
      {
        "id": 16,
        "name": "Anti tarnish jewellery",
        "slug": "anti-tarnish-jewellery"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 349,
    "salePrice": 199,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Love Drops ❤️ Anti tarnish chain — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "The Antitarnish Chain offers a clean, versatile look for everyday wear.\nIts finish is designed to help resist tarnishing and maintain its appearance.\nWear it on its own or pair it with other accessories.",
    "material": "Anti-Tarnish Stainless Steel / Gold Plated",
    "jewelleryType": "Anti Tarnish",
    "occasion": "Festive & Daily Wear",
    "tags": "anti-tarnish-jewellery-anti-tarnish-gold-plated-jewellery",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000009d98820b80152b5db38b0e49.png",
    "images": [
      {
        "id": 24,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_000000009d98820b80152b5db38b0e49.png",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  },
  {
    "id": 17,
    "name": "Cherry Diamond Anti tarnish Chain",
    "slug": "cherry-diamond-anti-tarnish-chain",
    "sku": "CH-WP-17",
    "category": "Anti tarnish jewellery",
    "categoryId": 16,
    "categorySlug": "anti-tarnish-jewellery",
    "categories": [
      {
        "id": 16,
        "name": "Anti tarnish jewellery",
        "slug": "anti-tarnish-jewellery"
      },
      {
        "id": 22,
        "name": "Under 500 Collection",
        "slug": "under-500"
      }
    ],
    "regularPrice": 399,
    "salePrice": 269,
    "stock": 10,
    "status": "active",
    "featured": false,
    "newArrival": false,
    "isCombo": false,
    "added": "01 Nov 2026",
    "shortDescription": "Cherry Diamond Anti tarnish Chain — Handcrafted luxury design by Charmika By Lekshmi.",
    "description": "Stainless steel offers a clean, modern look for a wide range of products.\n\nIts smooth finish and versatile style suit many settings and design preferences.\n\nFollow the care guidance provided with your product to help maintain its appearance.",
    "material": "Anti-Tarnish Stainless Steel / Gold Plated",
    "jewelleryType": "Anti Tarnish",
    "occasion": "Festive & Daily Wear",
    "tags": "anti-tarnish-jewellery-anti-tarnish-gold-plated-jewellery-everyday-jewellery-water-resistant-jewellery-long-lasting-jewellery-minimal-jewellery",
    "primaryImage": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000049dc81faa41fb75420b3228a.png",
    "images": [
      {
        "id": 18,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000049dc81faa41fb75420b3228a.png",
        "isPrimary": true,
        "displayOrder": 0
      },
      {
        "id": 18,
        "url": "https://paleturquoise-weasel-278625.hostingersite.com/wp-content/uploads/2026/10/file_0000000049dc81faa41fb75420b3228a.png",
        "isPrimary": false,
        "displayOrder": 1
      }
    ]
  }
];
