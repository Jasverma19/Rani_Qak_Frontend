// Navbar

import React, { useContext, useState } from 'react';
import styles from './navbar.module.css';
import { FiSearch, FiMenu } from "react-icons/fi";
import { BsFillBasketFill } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify';


const Navbar = () => {

  const [menu, setMenu] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  const { cartCount } = useContext(StoreContext);
  // const cartCount = Object.values(cartItems || {}).reduce((total, qty) => total + qty, 0);
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("logout button clicked");
    localStorage.removeItem("token");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
    toast.success("user logged out successfully");
  };

  return (
    <div className={styles.navbar}>

      <Link to='/home'><img src={assets.logo} alt="" className={styles.logo} /></Link>

      <ul className={`${styles.navMenu} ${mobileOpen ? styles.open : ""}`}>
        <Link to='/' onClick={() => { setMenu("home"); setMobileOpen(false); }} className={menu === "home" ? styles.active : ""}>Home</Link>
        <a href='#explore-menu' onClick={() => { setMenu("menu"); setMobileOpen(false); }} className={menu === "menu" ? styles.active : ""}>Menu</a>
        <a href='#footer' onClick={() => { setMenu("contact-us"); setMobileOpen(false); }} className={menu === "contact-us" ? styles.active : ""}>Contact us</a>
      </ul>

      <div className={styles.navRight}>
        <div className={styles.iconGroup}>

          <div className={styles.cartIcon}>
            <Link to='/cart'> <BsFillBasketFill /> {cartCount > 0 && <span className={styles.cartDot}></span>} </Link>
          </div>
          <Link to="/profile" className={styles.profileLink}><CgProfile /></Link>
        </div>

        {localStorage.getItem("token") ? (
          <button className={styles.authBtn} onClick={handleLogout}>Logout</button>
        ) : (
          <button className={styles.authBtn} onClick={() => navigate("/")}>Sign in</button>
        )}

        <FiMenu className={styles.menuIcon} onClick={() => setMobileOpen(!mobileOpen)} />
      </div>
    </div>
  );
};

export default Navbar;

