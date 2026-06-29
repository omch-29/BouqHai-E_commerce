const Product = require("../models/Product");

// GET /api/products?search=&category=&newOnly=
const getProducts = async (req, res) => {
  try {
    const { search, category, newOnly } = req.query;
    const query = { isActive: true };
    if (category && category !== "All") query.category = category;
    if (newOnly === "true") query.isNewCollection = true;
    if (search) query.$text = { $search: search };

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch products.", error: err.message });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Bouquet not found." });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch bouquet.", error: err.message });
  }
};

// POST /api/products (admin)
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, isNewCollection } = req.body;
    if (!name || !description || !price || !req.file) {
      return res.status(400).json({ message: "Name, description, price, and image are required." });
    }
    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock: stock || 10,
      isNewCollection: isNewCollection === "true" || isNewCollection === true,
      image: req.file.path, // Cloudinary returns the full secure URL here
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Could not add bouquet.", error: err.message });
  }
};

// PUT /api/products/:id (admin)
const updateProduct = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.isNewCollection !== undefined) {
      updates.isNewCollection = updates.isNewCollection === "true" || updates.isNewCollection === true;
    }
    if (req.file) updates.image = req.file.path; // Cloudinary secure URL

    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!product) return res.status(404).json({ message: "Bouquet not found." });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Could not update bouquet.", error: err.message });
  }
};

// DELETE /api/products/:id (admin) - soft delete so past orders still show the product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!product) return res.status(404).json({ message: "Bouquet not found." });
    res.json({ message: "Bouquet removed from store.", product });
  } catch (err) {
    res.status(500).json({ message: "Could not remove bouquet.", error: err.message });
  }
};

// GET /api/products/admin/all (admin - includes inactive)
const getAllProductsForAdmin = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch bouquets.", error: err.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProductsForAdmin,
};