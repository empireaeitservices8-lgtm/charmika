const express = require("express");
const authRoutes = require("./auth.routes");
const dashboardRoutes = require("./dashboard.routes");
const categoryRoutes = require("./category.routes");
const productRoutes = require("./product.routes");
const uploadRoutes = require("./upload.routes");
const orderRoutes = require("./order.routes");
const customerRoutes = require("./customer.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/upload", uploadRoutes);
router.use("/orders", orderRoutes);
router.use("/customers", customerRoutes);

module.exports = router;
