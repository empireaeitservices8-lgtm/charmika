const { z } = require("zod");

const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters long"),
  slug: z.string().min(2, "Category slug must be at least 2 characters long").optional(),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  status: z
    .enum(["active", "inactive", "ACTIVE", "INACTIVE"])
    .default("ACTIVE")
    .transform((val) => val.toUpperCase()),
});

const updateCategorySchema = categorySchema.partial();

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
  categorySchema,
  updateCategorySchema,
  validate,
};

