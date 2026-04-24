import React, { useEffect, useState } from 'react';
import styles from "./PlaceOrder.module.css";
import axios from 'axios';

const PlaceOrder = () => {

  const [cart, setCart] = useState({ items: [] });
  const [orders, setOrders] = useState([]);
  const [orderPopup, setOrderPopup] = useState(null);
  const [deliveryPopup, setDeliveryPopup] = useState(null);

  const token = localStorage.getItem("token");

  // ---------------- FETCH CART ----------------
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCart(res.data.cart || { items: [] });
      } catch (err) {
        console.log(err);
      }
    };

    fetchCart();
  }, []);

  // ---------------- FETCH ORDERS (FOR DELIVERY STATUS) ----------------
  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/order/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newOrders = res.data.orders || [];

      newOrders.forEach((order) => {
        if (order.status === "delivered" && !order._notified) {
          setDeliveryPopup(`🎉 Your Order #${order._id.slice(-6)} is Delivered!`);
          order._notified = true;
        }
      });

      setOrders(newOrders);

    } catch (err) {
      console.log(err);
    }
  };

  // ---------------- LIVE CHECK (REAL-TIME) ----------------
  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrders();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // ---------------- TOTAL ----------------
  const total = cart.items.reduce((sum, item) => {
    if (!item.food) return sum;
    return sum + item.food.price * item.quantity;
  }, 0);

  // ---------------- PLACE ORDER ----------------
  const placeOrder = async (e) => {
    e.preventDefault();

    const orderData = {
      items: cart.items,
      totalAmount: total + (total > 0 ? 49 : 0),
      address: "User Address (replace with form data)"
    };

    try {
      const res = await axios.post(
        "http://localhost:8000/api/order/create",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrderPopup(res.data.order);

      setCart({ items: [] });

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <form className={styles.placeOrder}>

        {/* LEFT */}
        <div className={styles.placeOrderLeft}>
          <p className={styles.title}>Delivery Information</p>

          <div className={styles.multiField}>
            <input type="text" placeholder='First Name' />
            <input type="text" placeholder='Last Name' />
          </div>

          <input type="email" placeholder='Email Address' />
          <input type="text" placeholder='Street' />

          <div className={styles.multiField}>
            <input type="text" placeholder='City' />
            <input type="text" placeholder='State' />
          </div>

          <div className={styles.multiField}>
            <input type="text" placeholder='Zip code' />
            <input type="text" placeholder='Country' />
          </div>

          <input type="text" placeholder='Phone' />
        </div >

        {/* RIGHT */}
        < div className={styles.placeOrderRight} >

          <div className={styles.cartTotal}>
            <h2>Cart Totals</h2>

            <div>
              <div className={styles.cartTotalDetails}>
                <p>Subtotal</p>
                <p>₹{total}</p>
              </div>

              <hr />

              <div className={styles.cartTotalDetails}>
                <p>Delivery Fee</p>
                <p>₹{total > 0 ? 49 : 0}</p>
              </div>

              <hr />

              <div className={styles.cartTotalDetails}>
                <b>Total</b>
                <b>₹{total > 0 ? total + 49 : 0}</b>
              </div>
            </div>

            <button type="submit" onClick={placeOrder}>
              PLACE ORDER
            </button>
          </div >

        </div >
      </form >

      {/* ORDER PLACED POPUP */}
      {
        orderPopup && (
          <div className={styles.orderPopup}>
            <div className={styles.orderPopupBox}>
              <h2>🎉 Order Placed</h2>

              <p><b>Order ID:</b> {orderPopup._id}</p>
              <p><b>Total:</b> ₹{orderPopup.totalAmount}</p>
              <p><b>Payment:</b> Cash / UPI on Delivery</p>
              <p><b>Status:</b> Pending</p>

              <button onClick={() => setOrderPopup(null)}>
                Close
              </button>
            </div >
          </div >
        )
      }

      {/* DELIVERY POPUP */}
      {
        deliveryPopup && (
          <div className={styles.orderPopup}>
            <div className={styles.orderPopupBox}>
              <h2>{deliveryPopup}</h2>

              <button onClick={() => setDeliveryPopup(null)}>
                OK
              </button>
            </div>
          </div>
        )
      }
    </>
  );
};

export default PlaceOrder;