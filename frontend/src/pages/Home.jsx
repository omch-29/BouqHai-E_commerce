import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import "../styles/Home.css";

const CATEGORIES = ["All", "Birthday", "Anniversary", "Romance", "Congratulations", "Sympathy", "Everyday", "Wedding", "Chocolates"];

const Home = () => {
  const [params] = useSearchParams();
  const search = params.get("search") || "";
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setLoading(true);
    api
      .get("/api/products", { params: { search, category } })
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [search, category]);

  return (
    <div>
      <Navbar />

      {!search && (
        <section className="hero">
          <div className="container hero-inner">
            <span className="eyebrow">Hand-tied, same-day in your city</span>
            <h1>
              Bouquets that say it <em>before</em> you do.
            </h1>
            <p>
              Every bouqHai arrangement is tied by hand, photographed before it leaves our studio,
              and delivered the way you'd carry it yourself.
            </p>
          </div>
        </section>
      )}

      <div className="knot-divider" aria-hidden="true">
        <svg viewBox="0 0 90 22" fill="none">
          <path
            d="M2 11c10-12 20 12 30 0s20-12 30 0 16 9 26 0"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="container">
        {search && (
          <p className="search-result-label">
            Showing results for "<strong>{search}</strong>"
          </p>
        )}

        <div className="category-row">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`category-chip ${category === c ? "active" : ""}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="empty-state">Gathering fresh stems…</p>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <h3>No bouquets match that yet</h3>
            <p>Try a different search term or browse all categories.</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} onOpen={setSelected} />
            ))}
          </div>
        )}
      </div>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default Home;
