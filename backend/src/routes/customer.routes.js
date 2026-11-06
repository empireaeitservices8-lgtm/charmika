const express = require("express");
const {
  getCustomers,
  getCustomerById,
  updateCustomerStatus,
  deleteCustomer,
} = require("../controllers/customer.controller");
const { authGuard } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authGuard);

router.get("/", getCustomers);
router.get("/:id", getCustomerById);
router.patch("/:id/status", updateCustomerStatus);
router.put("/:id/status", updateCustomerStatus);
router.delete("/:id", deleteCustomer);

module.exports = router;

