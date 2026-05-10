import React, { useEffect, useState } from 'react';
import styles from "./PlaceOrder.module.css";
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';

const FIELDS = [
  { name: "firstName", label: "First name", placeholder: "Aryan", half: true },
  { name: "lastName", label: "Last name", placeholder: "Kumar", half: true },
  { name: "email", label: "Email address", placeholder: "aryan@email.com", type: "email" },
  { name: "street", label: "Street", placeholder: "12, MG Road" },
  { name: "city", label: "City", placeholder: "Mumbai", half: true },
  { name: "state", label: "State", placeholder: "Maharashtra", half: true },
  { name: "zip", label: "Zip code", placeholder: "400001", half: true },
  { name: "country", label: "Country", placeholder: "India", half: true },
  { name: "phone", label: "Phone", placeholder: "+91 98765 43210" },
];

const empty = { firstName: "", lastName: "", email: "", street: "", city: "", state: "", zip: "", country: "", phone: "" };

const PlaceOrder = () => {
  const [cart, setCart] = useState({ items: [] });
  const [form, setForm] = useState(empty);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddrId, setSelectedAddrId] = useState(null);
  const [errors, setErrors] = useState({});
  const [orderPopup, setOrderPopup] = useState(null);
  const [deliveryPopup, setDeliveryPopup] = useState(null);

  const token = localStorage.getItem("token");

  // ── fetch cart ──
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(res.data.cart || { items: [] });
      } catch (err) { console.log(err); }
    };
    fetchCart();
  }, []);

  // ── pre-fill saved address from profile ──
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const u = res.data.user;
        if (u) {
          setForm(prev => ({
            ...prev,
            firstName: u.name?.split(" ")[0] || "",
            lastName: u.name?.split(" ")[1] || "",
            email: u.email || "",
            phone: u.phone || "",
          }));
          setSavedAddresses(u.addresses || []);
        }
      } catch (err) { console.log(err); }
    };
    fetchProfile();
  }, []);

  // ── live delivery status ──
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/order/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        (res.data.orders || []).forEach(order => {
          if (order.status === "delivered" && !order._notified) {
            setDeliveryPopup(`Your Order #${order._id.slice(-6)} has been delivered!`);
            order._notified = true;
          }
        });
      } catch (err) { console.log(err); }
    };
    const id = setInterval(fetchOrders, 3000);
    return () => clearInterval(id);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ── validation ──
  const validate = () => {
    const errs = {};
    FIELDS.forEach(({ name, label, type }) => {
      if (!form[name].trim()) {
        errs[name] = `${label} is required`;
      } else if (type === "email" && !/\S+@\S+\.\S+/.test(form[name])) {
        errs[name] = "Enter a valid email";
      } else if (name === "phone" && !/^\+?[\d\s\-]{7,15}$/.test(form[name])) {
        errs[name] = "Enter a valid phone number";
      } else if (name === "zip" && !/^\d{4,10}$/.test(form[name])) {
        errs[name] = "Enter a valid zip code";
      }
    });
    return errs;
  };

  const validItems = cart.items.filter(i => i.food && i.quantity > 0);
  const subtotal = validItems.reduce((s, i) => s + i.food.price * i.quantity, 0);
  const delivery = subtotal > 0 ? 49 : 0;
  const taxes = subtotal > 0 ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal + delivery + taxes;

  // ── place order ──
  const placeOrder = async (e) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const first = document.querySelector(`.${styles.errorMsg}`);
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    try {
      await axios.put("http://localhost:8000/api/user/profile", {
        name: `${form.firstName} ${form.lastName}`,
        phone: form.phone,
        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country,
        },
      }, { headers: { Authorization: `Bearer ${token}` } });

      // 2️⃣ place order
      const res = await axios.post("http://localhost:8000/api/order/create", {
        items: cart.items,
        totalAmount: total,
        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country,
        },
      }, { headers: { Authorization: `Bearer ${token}` } });

      setOrderPopup(res.data.order);
      setCart({ items: [] });
      setCartItems({});

    } catch (err) { console.log(err); }
  };

  // ── render fields ──
  const renderFields = () => {
    const rows = [];
    let i = 0;
    while (i < FIELDS.length) {
      const f = FIELDS[i];
      if (f.half && FIELDS[i + 1]?.half) {
        const f2 = FIELDS[i + 1];
        rows.push(
          <div className={styles.row2} key={f.name}>
            {[f, f2].map(fl => (
              <div className={styles.fieldGroup} key={fl.name}>
                <label>{fl.label}</label>
                <input
                  name={fl.name}
                  type={fl.type || "text"}
                  value={form[fl.name]}
                  onChange={handleChange}
                  placeholder={fl.placeholder}
                  className={errors[fl.name] ? styles.inputError : ""}
                />
                {errors[fl.name] && <span className={styles.errorMsg}>⚠ {errors[fl.name]}</span>}
              </div>
            ))}
          </div>
        );
        i += 2;
      } else {
        rows.push(
          <div className={styles.fieldGroup} key={f.name}>
            <label>{f.label}</label>
            <input
              name={f.name}
              type={f.type || "text"}
              value={form[f.name]}
              onChange={handleChange}
              placeholder={f.placeholder}
              className={errors[f.name] ? styles.inputError : ""}
            />
            {errors[f.name] && <span className={styles.errorMsg}>⚠ {errors[f.name]}</span>}
          </div>
        );
        i++;
      }
    }
    return rows;
  };

  return (
    <>
      <form className={styles.page} onSubmit={placeOrder} noValidate>

        {/* ── LEFT ── */}
        <div className={styles.leftCol}>
          <div className={styles.sectionHeader}>
            <div className={styles.stepBadge}>1</div>
            <p className={styles.sectionTitle}>Delivery information</p>
          </div>
          <div className={styles.card}>
            {renderFields()}
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className={styles.rightCol}>
          <div className={styles.sectionHeader}>
            <div className={styles.stepBadge}>2</div>
            <p className={styles.sectionTitle}>Order summary</p>
          </div>

          {/* items */}
          <div className={styles.card}>
            {validItems.length === 0 ? (
              <p className={styles.emptyMsg}>Your cart is empty.</p>
            ) : validItems.map((item, idx) => (
              <div key={item._id}>
                <div className={styles.itemRow}>
                  <div className={styles.itemImg}>
                    <img src={`http://localhost:8000/uploads/${item.food.image}`} alt={item.food.name} />
                  </div>
                  <div className={styles.itemInfo}>
                    <p className={styles.itemName}>{item.food.name}</p>
                    <p className={styles.itemQty}>× {item.quantity}</p>
                  </div>
                  <p className={styles.itemTotal}>₹{item.food.price * item.quantity}</p>
                </div>
                {idx < validItems.length - 1 && <hr className={styles.itemDivider} />}
              </div>
            ))}
          </div>

          {/* totals */}
          <div className={styles.card}>
            <div className={styles.totalRows}>
              <div className={styles.totalRow}><span>Subtotal</span><span>₹{subtotal}</span></div>
              <div className={styles.totalRow}><span>Delivery fee</span><span>₹{delivery}</span></div>
              <div className={styles.totalRow}><span>Taxes (5%)</span><span>₹{taxes}</span></div>
            </div>
            <hr className={styles.totalDivider} />
            <div className={styles.grandRow}>
              <span>Total</span>
              <span className={styles.grandAmt}>₹{total}</span>
            </div>
          </div>

          <button type="submit" className={styles.placeBtn}>Place order</button>
          <p className={styles.saveNote}>📌 Your address will be saved to your profile</p>
        </div>
      </form>

      {/* ── Order placed popup ── */}
      {orderPopup && (
        <div className={styles.overlay}>
          <div className={styles.popupBox}>
            <div className={styles.popupIcon}>🎉</div>
            <h3 className={styles.popupTitle}>Order placed!</h3>
            <div className={styles.popupDetails}>
              <div className={styles.popupRow}><span>Order ID</span><span>#{orderPopup._id?.slice(-6).toUpperCase()}</span></div>
              <div className={styles.popupRow}><span>Total</span><span>₹{orderPopup.totalAmount}</span></div>
              <div className={styles.popupRow}><span>Payment</span><span>Cash / UPI on delivery</span></div>
              <div className={styles.popupRow}><span>Status</span><span className={styles.statusBadge}>Pending</span></div>
            </div>
            <button className={styles.popupBtn} onClick={() => setOrderPopup(null)}>Done</button>
          </div>
        </div>
      )}

      {/* ── Delivery popup ── */}
      {deliveryPopup && (
        <div className={styles.overlay}>
          <div className={styles.popupBox}>
            <div className={styles.popupIcon}>🚀</div>
            <h3 className={styles.popupTitle}>Delivered!</h3>
            <p className={styles.popupMsg}>{deliveryPopup}</p>
            <button className={styles.popupBtn} onClick={() => setDeliveryPopup(null)}>Great!</button>
          </div>
        </div>
      )}
    </>
  );
};

export default PlaceOrder;