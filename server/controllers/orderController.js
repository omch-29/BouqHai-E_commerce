const Order = require("../models/Order");
const Product = require("../models/Product");

const generateOrderCode = () => {
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `BQH-${rand}`;
};

// POST /api/orders (customer)
const placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ message: "Your cart is empty." });
    }

    // Re-fetch product details server-side so price/stock can't be tampered with from client
    let totalAmount = 0;
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) {
        return res.status(400).json({ message: `One of the bouquets in your cart is no longer available.` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Only ${product.stock} left of "${product.name}".` });
      }
      totalAmount += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: item.quantity,
      });
    }

    let orderCode = generateOrderCode();
    // ensure uniqueness (extremely unlikely to collide, but be safe)
    while (await Order.findOne({ orderCode })) orderCode = generateOrderCode();

    const order = await Order.create({
      orderCode,
      user: req.auth.id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      status: "Pending Payment",
      statusHistory: [{ status: "Pending Payment", note: "Order placed. Awaiting payment screenshot on WhatsApp." }],
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Could not place order.", error: err.message });
  }
};

// GET /api/orders/my (customer)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.auth.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch your orders.", error: err.message });
  }
};

// GET /api/orders/:id (customer - own order only, or admin)
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found." });
    if (req.auth.role !== "admin" && order.user.toString() !== req.auth.id) {
      return res.status(403).json({ message: "You can't view this order." });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch order.", error: err.message });
  }
};

// GET /api/orders (admin - all orders)
const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== "All") query.status = status;
    const orders = await Order.find(query).populate("user", "name email phone").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch orders.", error: err.message });
  }
};

// PUT /api/orders/:id/status (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ["Pending Payment", "Confirmed", "Rejected", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found." });

    // Reduce stock only the first time an order is confirmed
    if (status === "Confirmed" && order.status !== "Confirmed") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
      }
    }

    order.status = status;
    order.statusHistory.push({ status, note: note || "" });
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Could not update order status.", error: err.message });
  }
};

module.exports = { placeOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };