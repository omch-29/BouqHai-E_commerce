const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: String, // snapshot in case product is edited/deleted later
  image: String,
  price: Number,
  quantity: { type: Number, default: 1 },
  customization: { type: String, default: "" }, // optional note from customer, e.g. "add a card saying..."
});

const orderSchema = new mongoose.Schema(
  {
    orderCode: { type: String, required: true, unique: true }, // e.g. BQH-10293, shown to customer to reference on WhatsApp
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    shippingAddress: {
      fullName: String,
      phone: String,
      addressLine: String,
      city: String,
      pincode: String,
    },
    status: {
      type: String,
      enum: ["Pending Payment", "Confirmed", "Rejected", "Shipped", "Delivered", "Cancelled"],
      default: "Pending Payment",
    },
    statusHistory: [
      {
        status: String,
        note: String,
        at: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);