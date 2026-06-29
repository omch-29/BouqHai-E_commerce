import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminLayout from "./AdminLayout";

const REVENUE_STATUSES = ["Confirmed", "Shipped", "Delivered"];

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/api/products/admin/all"), api.get("/api/orders")])
      .then(([p, o]) => {
        setProducts(p.data);
        setOrders(o.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const pendingCount = orders.filter((o) => o.status === "Pending Payment").length;
  const revenue = orders
    .filter((o) => REVENUE_STATUSES.includes(o.status))
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <AdminLayout>
      <div className="admin-header">
        <h2>Dashboard</h2>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <>
          <div className="stat-grid">
            <div className="card stat-card">
              <span className="eyebrow">Bouquets Listed</span>
              <span className="stat-value">{products.filter((p) => p.isActive).length}</span>
            </div>
            <div className="card stat-card">
              <span className="eyebrow">Total Orders</span>
              <span className="stat-value">{orders.length}</span>
            </div>
            <div className="card stat-card">
              <span className="eyebrow">Awaiting Payment Check</span>
              <span className="stat-value">{pendingCount}</span>
            </div>
            <div className="card stat-card">
              <span className="eyebrow">Confirmed Revenue</span>
              <span className="stat-value">₹{revenue}</span>
            </div>
          </div>

          <h3 style={{ marginBottom: 14 }}>Recent Orders</h3>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Placed</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 8).map((o) => (
                  <tr key={o._id}>
                    <td>{o.orderCode}</td>
                    <td>{o.user?.name || "—"}</td>
                    <td>₹{o.totalAmount}</td>
                    <td>{o.status}</td>
                    <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
