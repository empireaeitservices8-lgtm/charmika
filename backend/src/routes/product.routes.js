const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");
const { authGuard } = require("../middleware/auth.middleware");
const {
  productSchema,
  updateProductSchema,
  validate,
} = require("../validators/product.validator");

const router = express.Router();

router.use(authGuard); // All admin product routes require authentication

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", validate(productSchema), createProduct);
router.put("/:id", validate(updateProductSchema), updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;

