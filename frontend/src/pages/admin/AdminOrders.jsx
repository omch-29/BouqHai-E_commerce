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
                      <td colSpan={6} style={{ background: "var(--paper-deep)" }}>
                        <strong>Items:</strong> {o.items.map((i) => `${i.name} × ${i.quantity}`).join(", ")}
                        <br />
                        <strong>Deliver to:</strong> {o.shippingAddress?.fullName}, {o.shippingAddress?.addressLine},{" "}
                        {o.shippingAddress?.city} - {o.shippingAddress?.pincode} (Ph: {o.shippingAddress?.phone})
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
