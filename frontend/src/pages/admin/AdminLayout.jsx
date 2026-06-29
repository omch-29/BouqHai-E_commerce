import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Admin.css";

const AdminLayout = ({ children }) => {
  const { logoutAs } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="brand admin-brand">
          bouq<span>Hai</span>
        </div>
        <span className="eyebrow" style={{ marginBottom: 20, display: "block" }}>
          Studio Admin
        </span>
        <nav>
          <NavLink to="/admin" end className={({ isActive }) => (isActive ? "active" : "")}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => (isActive ? "active" : "")}>
            Bouquets
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => (isActive ? "active" : "")}>
            Orders
          </NavLink>
        </nav>
        <button
          className="btn btn-outline"
          style={{ marginTop: "auto", width: "100%" }}
          onClick={() => {
            logoutAs("admin");
            navigate("/admin/login");
          }}
        >
          Log Out
        </button>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
};

export default AdminLayout;
