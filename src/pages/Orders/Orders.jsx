import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../Context/StoreContext";
import api from "../../utils/api";
import "./orders.css";

const Orders = () => {
  const { token, currency } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setError("Please log in to view your orders.");
        setLoading(false);
        return;
      }
      try {
        const response = await api.post("/api/order/get", { userId: token });

        if (response.data.success) {
          setOrders(response.data.orders || []);
        } else {
          setError(response.data.message || "Failed to fetch orders.");
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        if (err.isAuthError) {
          setError("Session expired. Please log in again.");
        } else if (err.isNetworkError) {
          setError("Network error. Please check your connection.");
        } else {
          setError(err.message || "Error occurred while fetching your orders.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="loading-spinner" style={{ margin: '0 auto 20px' }}></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return <div className="orders-error">{error}</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <p style={{ fontSize: '3rem', marginBottom: '20px' }}>📦</p>
        <p>No past orders found.</p>
        <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>Start ordering to see your order history here!</p>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h2>Your Order History</h2>
      <div className="orders-list">
        {orders.map((order) => (
          <div className="order-card" key={order._id}>
            <div className="order-details">
              <div>
                <strong>Order ID</strong>
                <p>{order._id.slice(-8).toUpperCase()}</p>
              </div>
              <div>
                <strong>Date</strong>
                <p>{new Date(order.date).toLocaleString()}</p>
              </div>
              <div>
                <strong>Status</strong>
                <p>
                  <span className={`order-status ${order.status?.toLowerCase() || 'pending'}`}>
                    {order.status || 'Pending'}
                  </span>
                </p>
              </div>
              <div>
                <strong>Total Amount</strong>
                <p style={{ color: 'var(--primary-color)', fontWeight: '700', fontSize: '1.2rem' }}>
                  {currency}{order.amount}
                </p>
              </div>
            </div>
            <div className="order-items">
              <h4>Ordered Items</h4>
              {order.items?.map((item, index) => (
                <p key={index}>
                  {item.name} - {currency}{item.price} × {item.quantity} = {currency}{item.price * item.quantity}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
