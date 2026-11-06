const express = require("express");
const {
  getStats,
  getRecentOrders,
  getRecentCustomers,
  getTopProducts,
  getOutOfStockProducts,
  getRecentProducts,
} = require("../controllers/dashboard.controller");
const { authGuard } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authGuard);

router.get("/stats", getStats);
router.get("/recent-orders", getRecentOrders);
router.get("/recent-customers", getRecentCustomers);
router.get("/top-products", getTopProducts);
router.get("/out-of-stock", getOutOfStockProducts);
router.get("/recent-products", getRecentProducts);

module.exports = router;
