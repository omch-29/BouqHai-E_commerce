const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProductsForAdmin,
} = require("../controllers/productController");

// Public
router.get("/", getProducts);

// Admin only (declared before "/:id" so "admin/all" isn't treated as an id)
router.get("/admin/all", requireAuth, requireAdmin, getAllProductsForAdmin);
router.post("/", requireAuth, requireAdmin, upload.single("image"), createProduct);

router.get("/:id", getProductById);
router.put("/:id", requireAuth, requireAdmin, upload.single("image"), updateProduct);
router.delete("/:id", requireAuth, requireAdmin, deleteProduct);

module.exports = router;