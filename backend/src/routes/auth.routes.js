const express = require("express");
const {
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
} = require("../controllers/auth.controller");
const { authGuard } = require("../middleware/auth.middleware");
const {
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  validate,
} = require("../validators/auth.validator");

const router = express.Router();

// Public routes
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);

// Protected routes (requires valid admin cookie or Bearer token)
router.get("/me", authGuard, getMe);
router.put("/profile", authGuard, validate(updateProfileSchema), updateProfile);
router.put("/change-password", authGuard, validate(changePasswordSchema), changePassword);

module.exports = router;

