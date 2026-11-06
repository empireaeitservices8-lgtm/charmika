const { z } = require("zod");

const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  slug: z.string().optional(),
  sku: z.string().min(2, "SKU is required"),
  categoryId: z.coerce.number().positive("Valid Category ID is required").optional(),
  category: z.string().optional(), // Can pass category name as alternative
  regularPrice: z.coerce.number().min(0, "Regular price must be non-negative"),
  salePrice: z.coerce.number().min(0).optional().nullable(),
  costPrice: z.coerce.number().min(0).optional().nullable(),
  stock: z.coerce.number().int().min(0).default(0),
  status: z
    .enum(["active", "inactive", "ACTIVE", "INACTIVE"])
    .default("ACTIVE")
    .transform((val) => val.toUpperCase()),
  featured: z.coerce.boolean().default(false),
  newArrival: z.coerce.boolean().default(false),
  shortDescription: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  material: z.string().optional().nullable(),
  jewelleryType: z.string().optional().nullable(),
  weight: z.string().optional().nullable(),
  size: z.string().optional().nullable(),
  colour: z.string().optional().nullable(),
  occasion: z.string().optional().nullable(),
  collection: z.string().optional().nullable(),
  tags: z.string().optional().nullable(),
  images: z
    .array(
      z.object({
        url: z.string(),
        isPrimary: z.boolean().default(false),
        displayOrder: z.number().int().default(0),
      })
    )
    .optional()
    .default([]),
});

const updateProductSchema = productSchema.partial();

function validate(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: err.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }
      next(err);
    }
  };
}

module.exports = {
  productSchema,
  updateProductSchema,
  validate,
};

