const express = require("express");
const router = express.Router();
const { requireAuth, requireAdmin } = require("../middleware/auth");
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

// Customer
router.post("/", requireAuth, placeOrder);
router.get("/my", requireAuth, getMyOrders);

// Admin
router.get("/", requireAuth, requireAdmin, getAllOrders);
router.put("/:id/status", requireAuth, requireAdmin, updateOrderStatus);

// Shared
router.get("/:id", requireAuth, getOrderById);

module.exports = router;