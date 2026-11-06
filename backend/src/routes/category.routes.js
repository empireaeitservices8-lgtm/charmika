const express = require("express");
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");
const { authGuard } = require("../middleware/auth.middleware");
const {
  categorySchema,
  updateCategorySchema,
  validate,
} = require("../validators/category.validator");

const router = express.Router();

router.use(authGuard); // All admin category routes require authentication

router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.post("/", validate(categorySchema), createCategory);
router.put("/:id", validate(updateCategorySchema), updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;

