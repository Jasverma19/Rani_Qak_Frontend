import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import styles from './login.module.css';
import { assets } from "../../assets/assets";

const Login = ({ setToken, setUser }) => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8000/api/auth/login", {
        email: data.email,
        password: data.password
      });

      const token = res.data.token || res.data?.data?.token;
      const user = res.data.user || res.data?.data?.user;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        setToken(token);
        setUser(user);

        toast.success("Login Successful ✅");

        setTimeout(() => {
          navigate(user?.isAdmin ? "/admin" : "/home");
        }, 800);
      } else {
        toast.error("Login Failed ❌");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Login Failed ❌");
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.container}>
        <div className={styles.logo}><img src={assets.logo} alt="" /></div>

        <h2 className={styles.title}>Welcome Back!</h2>
        <p className={styles.subtitle}>Login to continue your sweet journey</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            onChange={handleChange}
            required
            className={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            onChange={handleChange}
            required
            className={styles.input}
          />

          <button type="submit" className={styles.loginBtn}>
            Login ✨
          </button>
        </form>

        <p className={styles.signupText}>
          Don't have an account?{" "}
          <Link to="/signup" className={styles.link}>Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;