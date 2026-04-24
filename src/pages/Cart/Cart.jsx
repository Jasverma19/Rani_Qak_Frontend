import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Cart.module.css";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState({ items: [] });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchCart = async () => {

    // console.log("CART API: ",res.data);

    try {
      const res = await axios.get("http://localhost:8000/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(res.data);

      setCart(res.data.cart || { items: [] });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeItem = async (foodId) => {
    try {
      await axios.delete("http://localhost:8000/api/cart/remove", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { foodId },
      });

      fetchCart(); // refresh
    } catch (err) {
      console.log(err);
    }
  };

  const total = cart.items.reduce((sum, item) => {
    if (!item.food) return sum;

    return sum + item.food.price * item.quantity;
  }, 0) || 0;

  return (
    <div className={styles.cart}>
      < h2 > Your Cart</h2 >

      <table className={styles.cartTable}>
        <thead>
          <tr>
            <th>Item</th>
            <th>Name</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {cart?.items?.filter((item) => item.food && item.quantity > 0).length > 0 ? (
            cart.items
              .filter((item) => item.food)
              .map((item) => (
                <tr key={item._id}>
                  <td>
                    <img
                      src={`http://localhost:8000/uploads/${item.food.image}`}
                      alt=""
                      className={styles.cartImg}
                    />
                  </td>
                  <td>{item.food.name}</td>
                  <td>₹{item.food.price}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.food.price * item.quantity}</td>
                  <td>
                    <span
                      className={styles.removeBtn}
                      onClick={() => removeItem(item.food._id)}
                    >
                      ✖
                    </span>
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "20px", fontSize: "24px" }}>
                Your cart is empty 🛒
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className={styles.cartBottom}>
        <div className={styles.cartTotal}>
          <h2>Cart Total</h2>
          <div>
            <div className={styles.cartTotalDetails}>
              <p>Subtotal</p>
              <p>₹{total}</p>
            </div>
            <hr />
            <div className={styles.cartTotalDetails}>
              <p>Dilivery Fee</p>
              <p>₹{total > 0 ? 49 : 0}</p>
            </div>
            <hr />
            <div className={styles.cartTotalDetails}>
              <p>Total</p>
              <p>₹{total > 0 ? total + 49 : 0}</p>
            </div>
            <hr />
          </div>
          <button onClick={() => navigate("/order")}>
            PROCEED TO CHECKOUT
          </button>
        </div >
        <div className={styles.cartPromocode}>
          <div>
            <p>If you have a promo code, Enter it here</p>
            <div className={styles.cartPromocodeInput}>
              <input type="text" placeholder="Promo code" />
              <button>Submit</button>
            </div>
          </div>
        </div >
      </div >
    </div >
  );

};

export default Cart;