import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import "../styles/Orders.css";

const STATUS_CLASS = {
  "Pending Payment": "status-pending",
  Confirmed: "status-confirmed",
  Rejected: "status-rejected",
  Shipped: "status-shipped",
  Delivered: "status-delivered",
  Cancelled: "status-rejected",
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/orders/my")
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container orders-page">
        <h2>My Orders</h2>

        {loading ? (
          <p className="empty-state">Loading your orders…</p>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <h3>No orders yet</h3>
            <p>Once you place an order, you'll be able to track it here.</p>
            <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>
              Browse Bouquets
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <Link to={`/orders/${order._id}`} className="order-row card" key={order._id}>
                <div>
                  <h4>{order.orderCode}</h4>
                  <p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <p className="order-items-preview">
                  {order.items.map((i) => i.name).join(", ")}
                </p>
                <p className="order-amount">₹{order.totalAmount}</p>
                <span className={`tag tag-status ${STATUS_CLASS[order.status]}`}>{order.status}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
