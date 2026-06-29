import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import "../styles/Orders.css";
import { getImageUrl } from "../utils/image";

const ALL_STAGES = ["Pending Payment", "Confirmed", "Shipped", "Delivered"];

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/api/orders/${id}`)
      .then((res) => setOrder(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div><Navbar /><p className="empty-state container">Loading…</p></div>;
  if (!order) return <div><Navbar /><p className="empty-state container">Order not found.</p></div>;

  const isRejectedOrCancelled = order.status === "Rejected" || order.status === "Cancelled";
  const currentStageIndex = ALL_STAGES.indexOf(order.status);

  return (
    <div>
      <Navbar />
      <div className="container order-detail-page">
        <Link to="/orders" className="back-link">← Back to orders</Link>
        <h2>{order.orderCode}</h2>
        <p className="order-date">Placed on {new Date(order.createdAt).toLocaleString()}</p>

        {isRejectedOrCancelled ? (
          <div className="card status-banner status-banner-bad">
            This order was <strong>{order.status.toLowerCase()}</strong>.
            {order.statusHistory[order.statusHistory.length - 1]?.note && (
              <> Note: {order.statusHistory[order.statusHistory.length - 1].note}</>
            )}
          </div>
        ) : (
          <div className="card timeline">
            {ALL_STAGES.map((stage, idx) => (
              <div className={`timeline-step ${idx <= currentStageIndex ? "done" : ""}`} key={stage}>
                <span className="timeline-dot" />
                <span>{stage}</span>
              </div>
            ))}
          </div>
        )}

        <div className="card order-detail-items">
          <h3>Items</h3>
          {order.items.map((item, idx) => (
            <div className="detail-item-row" key={idx}>
              <img src={getImageUrl(item.image)} alt={item.name} />
              <div>
                <p className="detail-item-name">{item.name}</p>
                <p className="order-date">Qty {item.quantity} × ₹{item.price}</p>
              </div>
              <p className="order-amount">₹{item.price * item.quantity}</p>
            </div>
          ))}
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>₹{order.totalAmount}</span>
          </div>
        </div>

        <div className="card order-address">
          <h3>Delivery Address</h3>
          <p>{order.shippingAddress?.fullName} · {order.shippingAddress?.phone}</p>
          <p>{order.shippingAddress?.addressLine}</p>
          <p>{order.shippingAddress?.city} — {order.shippingAddress?.pincode}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
