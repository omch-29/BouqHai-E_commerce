import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "../styles/Navbar.css";

const Navbar = ({ search, setSearch }) => {
  const { user, logoutAs } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [query, setQuery] = useState(search || "");

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(query)}`);
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          bouq<span>Hai</span>
        </Link>

        <form className="search-form" onSubmit={submitSearch}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search bouquets — birthday, roses, anniversary..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        <nav className="nav-links">
          <Link to="/cart" className="cart-link">
            Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          {user ? (
            <>
              <Link to="/orders">My Orders</Link>
              <button className="btn-ghost" onClick={() => { logoutAs("user"); navigate("/"); }}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-outline" style={{ padding: "8px 18px" }}>
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
