import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./profile.module.css";

const BLANK_ADDR = { label: "Home", street: "", city: "", state: "", zip: "", country: "" };
const API = "http://localhost:8000/api/user";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "" });

  // ── address state ──
  const [addresses, setAddresses] = useState([]);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [addrForm, setAddrForm] = useState(BLANK_ADDR);
  const [editingAddrId, setEditingAddrId] = useState(null);

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  // ── fetch profile ──
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${API}/profile`, authHeader);
        const u = res.data.user;
        setUser(u);
        setAddresses(u.addresses || []);
        setForm({ name: u.name, phone: u.phone || "" });
      } catch (err) { console.log(err); }
    };
    fetchUser();
  }, []);

  // ── fetch orders ──
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/order/my-orders", authHeader);
        setOrders(res.data.orders || []);
      } catch (err) { console.log(err); }
    };
    fetchOrders();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAddrChange = (e) => setAddrForm({ ...addrForm, [e.target.name]: e.target.value });

  // ── update profile ──
  const updateProfile = async () => {
    try {
      const res = await axios.put(`${API}/profile`, form, authHeader);
      setUser(res.data.user);
      setEditMode(false);
    } catch (err) { console.log(err); }
  };

  // ── add / update address ──
  const saveAddress = async () => {
    try {
      let res;
      if (editingAddrId) {
        res = await axios.put(`${API}/address/${editingAddrId}`, addrForm, authHeader);
      } else {
        res = await axios.post(`${API}/address`, addrForm, authHeader);
      }
      setAddresses(res.data.addresses);
      setAddrForm(BLANK_ADDR);
      setShowAddrForm(false);
      setEditingAddrId(null);
    } catch (err) { console.log(err); }
  };

  // ── delete address ──
  const deleteAddress = async (id) => {
    try {
      const res = await axios.delete(`${API}/address/${id}`, authHeader);
      setAddresses(res.data.addresses);
    } catch (err) { console.log(err); }
  };

  // ── start editing ──
  const startEditAddr = (addr) => {
    setAddrForm({ label: addr.label, street: addr.street, city: addr.city, state: addr.state, zip: addr.zip, country: addr.country });
    setEditingAddrId(addr._id);
    setShowAddrForm(true);
  };

  const getInitials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "?";

  const getStatusColor = (status) => {
    const map = { delivered: styles.statusDelivered, pending: styles.statusPending, cancelled: styles.statusCancelled, processing: styles.statusProcessing };
    return map[status?.toLowerCase()] || styles.statusPending;
  };

  return (
    <div className={styles.profileContainer}>

      {/* ── Profile Card ── */}
      <div className={styles.profileCard}>
        <div className={styles.profileTop}>
          <div className={styles.avatar}>{user ? getInitials(user.name) : "?"}</div>

          <div className={styles.profileMeta}>
            {!editMode ? (
              <>
                <h2 className={styles.userName}>{user?.name || "Loading..."}</h2>
                <p className={styles.userSub}>{user?.phone || "Add phone"}</p>
                <p className={styles.userEmail}>{user?.email}</p>
              </>
            ) : (
              <div className={styles.editFields}>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Full name" className={styles.editInput} />
                <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone number" className={styles.editInput} />
              </div>
            )}
          </div>

          <div className={styles.profileActions}>
            {!editMode ? (
              <button className={styles.editBtn} onClick={() => setEditMode(true)}>Edit</button>
            ) : (
              <>
                <button className={styles.saveBtn} onClick={updateProfile}>Save</button>
                <button className={styles.cancelBtn} onClick={() => setEditMode(false)}>Cancel</button>
              </>
            )}
          </div>
        </div>

        <hr className={styles.divider} />

        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <span className={styles.statNum}>{orders.length}</span>
            <span className={styles.statLbl}>Orders</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNum}>₹{orders.reduce((s, o) => s + (o.totalAmount || 0), 0).toLocaleString()}</span>
            <span className={styles.statLbl}>Total spent</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNum}>{orders.filter(o => o.status?.toLowerCase() === "delivered").length}</span>
            <span className={styles.statLbl}>Delivered</span>
          </div>
        </div>
      </div>

      {/* ── Saved Addresses ── */}
      <div className={styles.addressSection}>
        <div className={styles.sectionRow}>
          <h3 className={styles.sectionTitle}>Saved addresses</h3>
          <button
            className={styles.addAddrBtn}
            onClick={() => { setAddrForm(BLANK_ADDR); setEditingAddrId(null); setShowAddrForm(true); }}
          >
            + Add address
          </button>
        </div>

        {/* Add / Edit form */}
        {showAddrForm && (
          <div className={styles.addrFormCard}>
            {/* Label chips */}
            <div className={styles.addrFormRow}>
              {["Home", "Work", "Other"].map(l => (
                <button
                  key={l}
                  type="button"
                  className={`${styles.labelChip} ${addrForm.label === l ? styles.labelActive : ""}`}
                  onClick={() => setAddrForm({ ...addrForm, label: l })}
                >{l}</button>
              ))}
            </div>

            <div className={styles.addrGrid}>
              <input name="street" value={addrForm.street} onChange={handleAddrChange} placeholder="Street" className={`${styles.editInput} ${styles.spanFull}`} />
              <input name="city" value={addrForm.city} onChange={handleAddrChange} placeholder="City" className={styles.editInput} />
              <input name="state" value={addrForm.state} onChange={handleAddrChange} placeholder="State" className={styles.editInput} />
              <input name="zip" value={addrForm.zip} onChange={handleAddrChange} placeholder="Zip" className={styles.editInput} />
              <input name="country" value={addrForm.country} onChange={handleAddrChange} placeholder="Country" className={styles.editInput} />
            </div>

            <div className={styles.addrFormActions}>
              <button className={styles.saveBtn} onClick={saveAddress}>{editingAddrId ? "Update" : "Save address"}</button>
              <button className={styles.cancelBtn} onClick={() => { setShowAddrForm(false); setEditingAddrId(null); }}>Cancel</button>
            </div>
          </div>
        )}

        {addresses.length === 0 && !showAddrForm ? (
          <div className={styles.emptyState}><p>No saved addresses yet. Add one!</p></div>
        ) : (
          <div className={styles.addrGrid2}>
            {addresses.map((addr) => (
              <div key={addr._id} className={styles.addrCard}>
                <div className={styles.addrCardTop}>
                  <span className={styles.addrLabel}>{addr.label}</span>
                  <div className={styles.addrActions}>
                    <button className={styles.addrEditBtn} onClick={() => startEditAddr(addr)}>Edit</button>
                    <button className={styles.addrDeleteBtn} onClick={() => deleteAddress(addr._id)}>✕</button>
                  </div>
                </div>
                <p className={styles.addrText}>{addr.street}</p>
                <p className={styles.addrText}>{addr.city}, {addr.state} — {addr.zip}</p>
                <p className={styles.addrText}>{addr.country}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Order History ── */}
      <div className={styles.ordersSection}>
        <h3 className={styles.sectionTitle}>Order History</h3>

        {orders.length === 0 ? (
          <div className={styles.emptyState}><p>No orders yet — start exploring our menu!</p></div>
        ) : (
          <div className={styles.ordersGrid}>
            {orders.map((order) => (
              <div key={order._id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <span className={styles.orderId}>#{order._id.slice(-6).toUpperCase()}</span>
                  <span className={`${styles.statusBadge} ${getStatusColor(order.status)}`}>{order.status}</span>
                </div>
                <hr className={styles.divider} />
                <div className={styles.itemsList}>
                  {order.items.map((item, i) => (
                    <div key={i} className={styles.itemRow}>
                      <span className={styles.itemName}>{item.food?.name}</span>
                      <span className={styles.itemQty}>×{item.quantity}</span>
                    </div>
                  ))}
                </div>
                <hr className={styles.divider} />
                <div className={styles.orderFooter}>
                  <div className={styles.addressLine}>📍 {order.address?.street}, {order.address?.city}</div>
                  <span className={styles.orderTotal}>₹{order.totalAmount}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;