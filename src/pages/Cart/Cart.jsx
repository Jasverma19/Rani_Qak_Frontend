import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Cart.module.css";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [showPopup, setShowPopup] = useState(false);
  const [promo, setPromo] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.cart || { items: [] });
    } catch (err) { console.log(err); }
  };

  useEffect(() => { fetchCart(); }, []);

  const removeItem = async (foodId) => {
    try {
      await axios.delete("http://localhost:8000/api/cart/remove", {
        headers: { Authorization: `Bearer ${token}` },
        data: { foodId },
      });
      fetchCart();
    } catch (err) { console.log(err); }
  };

  const updateQty = async (foodId, delta, currentQty) => {
    if (currentQty + delta <= 0) { removeItem(foodId); return; }
    try {
      await axios.post("http://localhost:8000/api/cart/add",
        { foodId, quantity: delta },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (err) { console.log(err); }
  };

  const validItems = cart.items.filter((i) => i.food && i.quantity > 0);
  const subtotal = validItems.reduce((sum, i) => sum + i.food.price * i.quantity, 0);
  const delivery = subtotal > 0 ? 49 : 0;
  const taxes = subtotal > 0 ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal + delivery + taxes;

  const handleCheckout = () => {
    if (validItems.length === 0) {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      return;
    }
    navigate("/order");
  };

  return (
    <div className={styles.page}>

      {/* Popup */}
      {showPopup && (
        <div className={styles.popup}>
          <span>🛒 Your cart is empty. Add some items first!</span>
          <button className={styles.popupClose} onClick={() => setShowPopup(false)}>✕</button>
        </div>
      )}

      <div className={styles.layout}>

        {/* LEFT — Items */}
        <div className={styles.itemsCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Your cart</span>
            <span className={styles.itemCount}>{validItems.length} items</span>
          </div>

          {validItems.length === 0 ? (
            <div className={styles.emptyState}>
              No items yet — go explore the menu!
            </div>
          ) : (
            <div className={styles.itemsList}>
              {validItems.map((item, idx) => (
                <div key={item._id}>
                  <div className={styles.itemRow}>
                    <div className={styles.itemImg}>
                      <img
                        src={`http://localhost:8000/uploads/${item.food.image}`}
                        alt={item.food.name}
                      />
                    </div>
                    <div className={styles.itemInfo}>
                      <p className={styles.itemName}>{item.food.name}</p>
                      <p className={styles.itemPrice}>₹{item.food.price}</p>
                    </div>
                    <div className={styles.qtyCtrl}>
                      <button onClick={() => updateQty(item.food._id, -1, item.quantity)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQty(item.food._id, 1, item.quantity)}>+</button>
                    </div>
                    <button className={styles.removeBtn} onClick={() => removeItem(item.food._id)}>✕</button>
                  </div>
                  {idx < validItems.length - 1 && <hr className={styles.itemDivider} />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — Summary + Promo + Checkout */}
        <div className={styles.rightCol}>

          {/* Order Summary */}
          <div className={styles.summaryCard}>
            <p className={styles.cardTitle}>Order summary</p>
            <div className={styles.summaryRows}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span><span>₹{subtotal}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Delivery</span><span>₹{delivery}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Taxes</span><span>₹{taxes}</span>
              </div>
            </div>
            <hr className={styles.summaryDivider} />
            <div className={styles.totalRow}>
              <span>Total</span>
              <span className={styles.totalAmount}>₹{total}</span>
            </div>
          </div>

          {/* Promo */}
          <div className={styles.promoCard}>
            <p className={styles.promoLabel}>Promo code</p>
            <div className={styles.promoInput}>
              <input
                type="text"
                placeholder="Enter code"
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
              />
              <button>Apply</button>
            </div>
          </div>

          {/* Checkout */}
          <button className={styles.checkoutBtn} onClick={handleCheckout}>
            Proceed to checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;