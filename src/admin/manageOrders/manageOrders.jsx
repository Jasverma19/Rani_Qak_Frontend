import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import styles from './manageOrders.module.css';
import { toast } from 'react-toastify';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/order/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data.orders || []);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:8000/api/order/status/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Order status updated");
      fetchOrders();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { text: "Pending", color: styles.pending },
      confirmed: { text: "Confirmed", color: styles.confirmed },
      preparing: { text: "Preparing", color: styles.preparing },
      delivered: { text: "Delivered", color: styles.delivered },
      cancelled: { text: "Cancelled", color: styles.cancelled },
    };
    return statusMap[status] || { text: status, color: "" };
  };

  if (loading) return <div className={styles.loading}>Loading orders...</div>;

  return (
    <div className={styles.manageOrders}>
      <div className={styles.header}>
        <h1>📦 Manage Orders</h1>
      </div>

      <div className={styles.ordersGrid}>
        {orders.map((order) => {
          const statusInfo = getStatusBadge(order.status);
          return (
            <div className={styles.orderCard} key={order._id}>
              <div className={styles.orderHeader}>
                <div>
                  <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
                  <p className={styles.orderDate}>
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className={`${styles.statusBadge} ${statusInfo.color}`}>
                  {statusInfo.text}
                </span>
              </div>

              {/* Progress Stepper */}
              <div className={styles.progress}>
                {['pending', 'confirmed', 'preparing', 'delivered'].map((step, i) => (
                  <div key={i} className={`${styles.step} ${order.status === step ||
                    (order.status === 'delivered' && step !== 'pending') ? styles.active : ''}`}>
                    <div className={styles.stepDot}></div>
                    <span>{step.charAt(0).toUpperCase() + step.slice(1)}</span>
                  </div>
                ))}
              </div>

              {/* Items */}
              <div className={styles.orderItems}>
                {order.items.slice(0, 3).map((item, i) => (
                  <p key={i}>
                    • {item.food?.name} × {item.quantity}
                    <span className={styles.price}> ₹{item.food?.price * item.quantity}</span>
                  </p>
                ))}
                {order.items.length > 3 && (
                  <p className={styles.moreItems}>+{order.items.length - 3} more items</p>
                )}
              </div>

              <div className={styles.orderFooter}>
                <div>
                  <strong>Total Paid:</strong> ₹{order.totalAmount}
                </div>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className={styles.statusSelect}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>

      {orders.length === 0 && <p className={styles.noOrders}>No orders yet</p>}
    </div>
  );
};

export default ManageOrders;