import { useState } from "react";
import { useCart } from "../context/CartContext";
import "../styles/ProductModal.css";
import { getImageUrl } from "../utils/image";


const ProductModal = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, quantity);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="modal-image">
          <img src={getImageUrl(product.image)} alt={product.name} />
          {product.isNewCollection && <span className="tag tag-new modal-new">New Collection</span>}
        </div>
        <div className="modal-body">
          <span className="eyebrow">{product.category}</span>
          <h2>{product.name}</h2>
          <p className="modal-price">₹{product.price}</p>
          <p className="modal-desc">{product.description}</p>
          <p className="modal-stock">
            {product.stock > 0 ? `${product.stock} ready to make` : "Currently sold out"}
          </p>

          {product.stock > 0 && (
            <>
              <div className="qty-row">
                <label>Quantity</label>
                <div className="qty-stepper">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}>+</button>
                </div>
              </div>
              <button className="btn btn-primary modal-add-btn" onClick={handleAdd}>
                Add to Cart — ₹{product.price * quantity}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
