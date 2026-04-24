import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./profile.module.css";

const Profile = () => {

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "" });


  const token = localStorage.getItem("token");


  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setError("No authentication token found. Please login again.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          "http://localhost:8000/api/user/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(res.data.user);

        // fill edit form
        setForm({
          name: res.data.user.name,
          phone: res.data.user.phone || ""
        });

      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, []);

  // ---------------- ORDERS ----------------
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/order/my-orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrders(res.data.orders || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchOrders();
  }, []);

  // ---------------- HANDLE CHANGE ----------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ---------------- UPDATE PROFILE ----------------
  const updateProfile = async () => {
    try {
      const res = await axios.put(
        "http://localhost:8000/api/user/profile",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(res.data.user);
      setEditMode(false);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.profileContainer}>

      {/* Profile Card */}
      <div className={styles.profileCard}>
        <h2>👤 My Profile</h2>

        {user && (
          <div className={styles.userInfo}>
            {!editMode ? (
              <>
                <p><b>Name:</b> {user.name}</p>
                <p><b>Email:</b> {user.email}</p>
                <p><b>Phone:</b> {user.phone || "Not Added"}</p>
                <button onClick={() => setEditMode(true)}>
                  Edit Profile
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Name"
                />
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                />
                <button onClick={updateProfile}>Save Changes</button>
                <button onClick={() => setEditMode(false)}>Cancel</button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Orders Section */}
      <div className={styles.ordersSection}>
        <h2>📦 Order History</h2>

        {orders.length === 0 ? (
          <p>No orders yet ✨ Start exploring our menu!</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className={styles.orderCard}>
              <h4>Order ID: {order._id.slice(-6)}</h4>
              <p><b>Status:</b> {order.status}</p>
              <p><b>Total:</b> ₹{order.totalAmount}</p>

              <div className={styles.itemsBox}>
                <b>Items:</b>
                {order.items.map((item, i) => (
                  <p key={i}>
                    {item.food?.name} × {item.quantity}
                  </p>
                ))}
              </div>

              <div className={styles.addressBox}>
                <b>Delivery Address:</b>
                <p>
                  {order.address?.street}, {order.address?.city}, {order.address?.state} - {order.address?.zip}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;