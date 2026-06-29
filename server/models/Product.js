const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true }, // stored path e.g. /uploads/xyz.jpg
    category: {
      type: String,
      enum: ["Birthday", "Anniversary", "Romance", "Congratulations", "Sympathy", "Everyday", "Wedding"],
      default: "Everyday",
    },
    stock: { type: Number, default: 10, min: 0 },
    isNewCollection: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }, 
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);