import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "../styles/Checkout.css";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "91XXXXXXXXXX";

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", phone: "", addressLine: "", city: "", pincode: "" });
  const [placedOrder, setPlacedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!user) return <Navigate to="/login" replace />;
  if (cart.length === 0 && !placedOrder) return <Navigate to="/" replace />;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const items = cart.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        customization: i.customization || "",
      }));
      const { data } = await api.post("/api/orders", { items, shippingAddress: form });
      setPlacedOrder(data);
      clearCart();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not place order.");
    } finally {
      setLoading(false);
    }
  };

  if (placedOrder) {
    const message = encodeURIComponent(
      `Hi bouqHai! Here's my payment screenshot for order ${placedOrder.orderCode} (₹${placedOrder.totalAmount}).`
    );
    const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    return (
      <div>
        <Navbar />
        <div className="container checkout-success">
          <div className="card success-card">
            <div className="success-icon">✓</div>
            <h2>Order placed — {placedOrder.orderCode}</h2>
            <p>
              One last step: pay <strong>₹{placedOrder.totalAmount}</strong> and send us the payment screenshot
              on 9022033970 @WhatsApp, mentioning order <strong>{placedOrder.orderCode}</strong>. We'll confirm your order
              as soon as we verify it.
            </p>
            <a href={waLink} target="_blank" rel="noreferrer" className="btn btn-primary whatsapp-btn">
              Send Screenshot on WhatsApp
            </a>
            <button className="btn btn-outline" style={{ marginTop: 12 }} onClick={() => navigate("/orders")}>
              View My Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container checkout-page">
        <h2>Checkout</h2>
        <div className="checkout-layout">
          <form className="card checkout-form" onSubmit={handlePlaceOrder}>
            <h3>Delivery Address</h3>
            <div className="field">
              <label>Full name</label>
              <input
                className="input"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Phone number</label>
              <input
                className="input"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Address</label>
              <textarea
                className="textarea"
                rows={3}
                required
                value={form.addressLine}
                onChange={(e) => setForm({ ...form, addressLine: e.target.value })}
              />
            </div>
            <div className="field-row">
              <div className="field">
                <label>City</label>
                <input
                  className="input"
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Pincode</label>
                <input
                  className="input"
                  required
                  value={form.pincode}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                />
              </div>
            </div>
            <button className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
              {loading ? "Placing order…" : `Place Order — ₹${cartTotal}`}
            </button>
            <p className="checkout-note">
              No card needed. You'll pay via UPI/bank transfer and confirm with a WhatsApp screenshot on the
              next screen.
            </p>
          </form>

          <div className="card checkout-summary">
            <h3>Items</h3>
            {cart.map((i) => (
              <div className="summary-row" key={i.productId}>
                <span>
                  {i.name} × {i.quantity}
                </span>
                <span>₹{i.price * i.quantity}</span>
              </div>
            ))}
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>₹{cartTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
