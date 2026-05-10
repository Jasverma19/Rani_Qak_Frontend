import React, { useContext } from 'react'
import axios from 'axios';
import styles from './FoodItem.module.css';
import { FiPlus, FiMinus } from "react-icons/fi";
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

const FoodItem = ({ _id, name, price, image, description, setShowLogin }) => {

  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);
  const quantity = cartItems[_id] || 0;

  const token = localStorage.getItem("token");

  // ➕ ADD
  const handleAdd = async () => {
    if (!token) {
      setShowLogin(true);
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/api/cart/add",
        {
          foodId: _id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      addToCart(_id);
    } catch (err) {
      console.log(err);
    }
  };

  // ➖ REMOVE
  const handleRemove = async () => {
    try {
      await axios.delete(
        "http://localhost:8000/api/cart/remove",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { foodId: _id },
        }
      );

      removeFromCart(_id);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.foodItem}>
      <div className={styles.foodItemImgContainer}>
        <img className={styles.foodItemImg} src={image} alt={name} />

        {/* Conditional Add / Counter */}
        {quantity === 0 ? (
          <FiPlus className={styles.addIcon} onClick={handleAdd} />
        ) : (
          <div className={styles.foodItemCounter}>
            <FiMinus className={styles.minus} onClick={handleRemove} />
            <p>{quantity}</p>
            <FiPlus className={styles.add} onClick={handleAdd} />
          </div>
        )}
      </div>

      <div className={styles.foodItemInfo}>
        <div className={styles.foodItemNameRating}>
          <p>{name}</p>
          <img src={assets.star} alt="rating" />
        </div>
        <p className={styles.foodItemDesc}>{description}</p>
        <p className={styles.foodItemPrice}>₹{price}</p>
      </div>
    </div>
  )
}

export default FoodItem;