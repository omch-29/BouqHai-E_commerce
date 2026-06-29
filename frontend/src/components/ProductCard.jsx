import "../styles/ProductCard.css";
import { getImageUrl } from "../utils/image";


const ProductCard = ({ product, onOpen }) => {
  return (
    <button className="product-card" onClick={() => onOpen(product)}>
      <div className="product-image-wrap">
        <img src={getImageUrl(product.image)} alt={product.name} />
        {product.isNewCollection && <span className="tag tag-new pc-new">New</span>}
        {product.stock === 0 && <span className="pc-soldout">Sold out</span>}
        <span className="gift-tag">
          ₹{product.price}
          <span className="gift-tag-hole" />
        </span>
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        {product.category1=="Romance" && 
        <span className="eyebrow">{product.category}</span>}
      </div>
    </button>
  );
};

export default ProductCard;
