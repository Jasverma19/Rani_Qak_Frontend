import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';

import Login from './pages/Login/login';
import Signup from './pages/Signup/signup';

import Navbar from './Components/Navbar/navbar';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Footer from './Components/Footer/Footer';
import ProtectedRoute from './Components/ProtectedRoutes/ProtectedRoutes';
import Profile from './Components/Profile/profile';

import AdminDashboard from './admin/adminDashboard/adminDashboard';
import ManageCategories from './admin/manageCategories/manageCategories';
import ManageProducts from "./admin/manageProducts/ManageProducts";
import ManageOrders from "./admin/manageOrders/manageOrders";
import ManageUsers from "./admin/manageUsers/ManageUsers";


const App = () => {

  const [token, setToken] = useState(localStorage.getItem("token"));
  const location = useLocation();

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "{}")
  );

  const [categoryCount, setCategoryCount] = useState(0);

  // ✅ ADD THIS FUNCTION
  const fetchCategoryCount = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/category/all");
      setCategoryCount(res.data.count);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchCategoryCount();
  }, []);

  return (
    <div className="App">

      {/* Navbar only when logged in */}
      {token && location.pathname !== "/login" && !location.pathname.startsWith("/admin") && <Navbar />}

      <div className='app'>
        <Routes>

          {/* ✅ Default route */}
          <Route
            path="/"
            element={
              token ? (
                user?.isAdmin
                  ? (<Navigate to="/admin" />)
                  : <Navigate to="/home" />
              )
                : (<Navigate to="/login" />)
            }
          />

          {/* Login route */}
          <Route
            path="/login"
            element={<Login setToken={setToken} setUser={setUser} />}
          />

          {/* Signup route */}
          <Route
            path="/signup"
            element={<Signup />}
          />

          {/* ✅ Admin route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                {user?.isAdmin ? (<AdminDashboard setToken={setToken} setUser={setUser} />) : (<Navigate to="/" />)}
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin" />} />
            <Route path="categories" element={<ManageCategories refreshCount={fetchCategoryCount} />} />
            <Route path="products" element={<ManageProducts />} />
            <Route path="orders" element={<ManageOrders />} />
            <Route path="users" element={<ManageUsers />} />
          </Route>

          {/* ✅ Protected routes */}
          <Route
            path="/home"
            element={token ? <Home /> : <Navigate to="/" />}
          />

          <Route
            path="/cart"
            element={token ? <Cart /> : <Navigate to="/" />}
          />

          <Route
            path="/order"
            element={token ? <PlaceOrder /> : <Navigate to="/" />}
          />

          <Route path="/profile" element={<Profile />} />

        </Routes>
      </div>

      {/* Footer only when logged in */}
      {token && !location.pathname.startsWith("/admin") && <Footer />}

      <ToastContainer />

    </div>
  );
};

export default App;

