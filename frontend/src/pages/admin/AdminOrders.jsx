import { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import AdminLayout from "./AdminLayout";

const STATUSES = ["Pending Payment", "Confirmed", "Rejected", "Shipped", "Delivered", "Cancelled"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    api
      .get("/api/orders", { params: { status: filter } })
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(fetchOrders, [filter]);

  const handleStatusChange = async (order, status) => {
    try {
      await api.put(`/api/orders/${order._id}/status`, { status });
      toast.success(`Order ${order.orderCode} marked as ${status}`);
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update order.");
    }
  };

  return (
    <AdminLayout>
      <div className="toolbar">
        <h2>Orders</h2>
        <select className="select" style={{ width: 220 }} value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : orders.length === 0 ? (
        <p>No orders here.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Placed</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <Fragment key={o._id}>
                  <tr>
                    <td>
                      <button className="btn-ghost" onClick={() => setExpanded(expanded === o._id ? null : o._id)}>
                        {o.orderCode}
                      </button>
                    </td>
                    <td>
                      {o.user?.name}
                      <br />
                      <span style={{ color: "var(--ink-soft)", fontSize: 12 }}>{o.user?.phone}</span>
                    </td>
                    <td>{o.items.length} item(s)</td>
                    <td>₹{o.totalAmount}</td>
                    <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td>
                      <select
                        className="status-select"
                        value={o.status}
                        onChange={(e) => handleStatusChange(o, e.target.value)}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                {expanded === o._id && (
  <tr>
    <td colSpan={6} style={{ background: "var(--paper-deep)", padding: "16px" }}>
      <strong>Items</strong>

      <div style={{ marginTop: 12 }}>
        {o.items.map((item) => (
          <div
            key={item._id}
            style={{
              padding: "10px 0",
              borderBottom: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <div>
              <strong>{item.name}</strong> × {item.quantity}
            </div>

            <div style={{ color: "var(--ink-soft)", fontSize: 14 }}>
              ₹{item.price} each
            </div>

            {item.customization && (
              <div
                style={{
                  marginTop: 6,
                  padding: "8px 10px",
                  background: "#fff8dc",
                  borderLeft: "4px solid #f59e0b",
                  borderRadius: "6px",
                }}
              >
                <strong>Customization:</strong> {item.customization}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        <strong>Deliver to</strong>
        <br />
        {o.shippingAddress?.fullName}
        <br />
        {o.shippingAddress?.addressLine}
        <br />
        {o.shippingAddress?.city} - {o.shippingAddress?.pincode}
        <br />
        Phone: {o.shippingAddress?.phone}
      </div>
    </td>
  </tr>
)}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
