import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import styles from "./adminDashboard.module.css";

const AdminDashboard = ({ setToken, setUser }) => {

    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);

        navigate("/login");
    };

    // ---------------- COUNTS ----------------
    const [usercount, setUserCount] = useState(0);
    const [categoryCount, setCategoryCount] = useState(0);
    const [orderCount, setOrderCount] = useState(0);
    const [productCount, setProductCount] = useState(0);

    // ---------------- PENDING ORDERS ----------------
    // const [pendingOrders, setPendingOrders] = useState([]);

    // ---------------- USERS ----------------
    const fetchUserCount = async () => {
        const res = await axios.get("http://localhost:8000/api/user/count");
        setUserCount(res.data.count);
        // try {
        // } catch (err) {
        //     console.log(err);
        // }
    };

    // ---------------- CATEGORY ----------------
    const fetchCategoryCount = async () => {
        const res = await axios.get("http://localhost:8000/api/category/all");
        setCategoryCount(res.data.count);
        // try {
        // } catch (err) {
        //     console.log(err);
        // }
    };

    // ---------------- ORDERS ----------------
    const fetchOrderCount = async () => {
        const res = await axios.get("http://localhost:8000/api/order/all", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        setOrderCount(res.data.count || 0);
        // try {
        // } catch (err) {
        //     console.log(err);
        // }
    };

    // ---------------- PRODUCTS ----------------
    const fetchProductCount = async () => {
        const res = await axios.get("http://localhost:8000/api/food/all");
        setProductCount(res.data.foods?.length || 0);
        // try {
        // } catch (err) {
        //     console.log(err);
        // }
    };

    // ---------------- PENDING ORDERS ONLY ----------------
    // const fetchPendingOrders = async () => {
    //     try {
    //         const res = await axios.get("http://localhost:8000/api/order/all", {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });

    //         const pending = (res.data.orders || []).filter(
    //             (order) => order.status === "pending"
    //         );

    //         // setPendingOrders(pending);
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };

    // ---------------- LOAD ALL DATA ----------------
    useEffect(() => {
        const loadData = async () => {
            await fetchCategoryCount();
            fetchProductCount();
            fetchOrderCount();
            fetchUserCount();
        };

        loadData();
    });
    // useEffect(() => {
    //     fetchCategoryCount();
    //     fetchProductCount();
    //     fetchOrderCount();
    //     fetchUserCount();
    // }, []);

    // fetchPendingOrders();

    // // 🔥 REAL TIME AUTO REFRESH
    // const interval = setInterval(() => {
    //     // fetchPendingOrders();
    //     fetchOrderCount();
    // });

    // return () => clearInterval(interval);



    // update order status 
    // const updateStatus = async (orderId, status) => {
    //     try {
    //         await axios.put(
    //             `http://localhost:8000/api/order/status/${orderId}`,
    //             { status },
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             }
    //         );

    //         // refresh data after update
    //         // fetchPendingOrders();
    //         fetchOrderCount();

    //     } catch (err) {
    //         console.log(err.response?.data || err.message);
    //     }
    // };

    return (
        <div className={styles.adminDashboard}>

            {/* SIDEBAR */}
            <div className={styles.sidebar}>
                <img src={assets.logo} alt="Logo" />

                <ul>
                    <li><Link to="/admin">🏡 Dashboard</Link></li>
                    <li><Link to="/admin/categories">📂 Categories</Link></li>
                    <li><Link to="/admin/products">🍔 Products</Link></li>
                    <li><Link to="/admin/orders">📦 Orders</Link></li>
                    <li><Link to="/admin/users">👤 Users</Link></li>
                </ul>
            </div>

            {/* MAIN */}
            <div className={styles.main}>
                <div className={styles.adminNavbar}>
                    <div className={styles.adminHeader}>
                        <h1>Admin Dashboard</h1>

                        <div className={styles.adminInfo}>
                            Welcome, {user.name || "Admin"} 👩🏼‍💼
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    </div>

                    {/* CARDS */}
                    <div className={styles.cards}>

                        <div className={styles.card}>
                            <h3>Total Users</h3>
                            <p>{usercount}</p>
                        </div>

                        <div className={styles.card}>
                            <h3>Total Orders</h3>
                            <p>{orderCount}</p>
                        </div>

                        <div className={styles.card}>
                            <h3>Categories</h3>
                            <p>{categoryCount}</p>
                        </div>

                        <div className={styles.card}>
                            <h3>Products</h3>
                            <p>{productCount}</p>
                        </div>

                    </div>
                </div>
                <Outlet />
            </div>

        </div >
    );
};

export default AdminDashboard;