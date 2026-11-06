const express = require("express");
const {
  getOrders,
  getOrderById,
  updateOrderStatus,
  createOrder,
} = require("../controllers/order.controller");
const { authGuard } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authGuard);

router.get("/", getOrders);
router.get("/:id", getOrderById);
router.put("/:id/status", updateOrderStatus);
router.post("/", createOrder);

module.exports = router;

