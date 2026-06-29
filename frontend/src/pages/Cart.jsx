import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import "../styles/Cart.css";
import { getImageUrl } from "../utils/image";


const Cart = () => {
  const { cart, updateQuantity, updateCustomization,removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div className="container cart-page">
        <h2>Your Cart</h2>

        {cart.length === 0 ? (
          <div className="empty-state">
            <h3>Your cart is empty</h3>
            <p>Find a bouquet that says what you mean.</p>
            <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>
              Browse Bouquets
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {cart.map((item) => (
                // <div className="cart-item card" key={item.productId}>
                //   <img src={getImageUrl(item.image)} alt={item.name} />
                //   <div className="cart-item-info">
                //     <h4>{item.name}</h4>
                //     <p className="eyebrow" style={{ color: "var(--ink-soft)", letterSpacing: 0 }}>
                //       ₹{item.price} each
                //     </p>
                //     <div className="qty-stepper">
                //       <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>−</button>
                //       <span>{item.quantity}</span>
                //       <button
                //         onClick={() => updateQuantity(item.productId, Math.min(item.stock, item.quantity + 1))}
                //       >
                //         +
                //       </button>
                //     </div>
                //   </div>
                //   <div className="cart-item-right">
                //     <p className="cart-item-price">₹{item.price * item.quantity}</p>
                //     <button className="btn-ghost" onClick={() => removeFromCart(item.productId)}>
                //       Remove
                //     </button>
                //   </div>
                // </div>
                <div className="cart-item card" key={item.productId}>
  <div className="cart-item-row">
    <img src={getImageUrl(item.image)} alt={item.name} />

    <div className="cart-item-info">
      <h4>{item.name}</h4>

      <p
        className="eyebrow"
        style={{ color: "var(--ink-soft)", letterSpacing: 0 }}
      >
        ₹{item.price} each
      </p>

      <div className="qty-stepper">
        <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
          −
        </button>

        <span>{item.quantity}</span>

        <button
          onClick={() =>
            updateQuantity(item.productId, Math.min(item.stock, item.quantity + 1))
          }
        >
          +
        </button>
      </div>
    </div>

    <div className="cart-item-right">
      <p className="cart-item-price">
        ₹{item.price * item.quantity}
      </p>

      <button
        className="btn-ghost"
        onClick={() => removeFromCart(item.productId)}
      >
        Remove
      </button>
    </div>
  </div>

  <textarea
    className="textarea cart-customize-input"
    rows={3}
    placeholder="Customization note (optional)..."
    value={item.customization || ""}
    onChange={(e) =>
      updateCustomization(item.productId, e.target.value)
    }
  />
</div>
              ))}
            </div>

            <div className="cart-summary card">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="summary-row">
                <span>Delivery</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>₹{cartTotal}</span>
              </div>
              <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => navigate("/checkout")}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
