import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from './signup.module.css';
import { assets } from "../../assets/assets";

const Signup = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8000/api/auth/register", data);
      toast.success("Signup Successful ✅");
      navigate("/login");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Signup Failed ❌");
    }
  };

  return (
    <div className={styles.signupPage}>
      <div className={styles.container}>
        <div className={styles.logo}><img src={assets.logo} alt="" /></div>

        <h2 className={styles.title}>Create Account</h2>
        <p className={styles.subtitle}>Join the sweetest community!</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            onChange={handleChange}
            required
            className={styles.input}
          />

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
            placeholder="Create a password"
            onChange={handleChange}
            required
            className={styles.input}
          />

          <button type="submit" className={styles.signupBtn}>
            Create Account ✨
          </button>
        </form>

        <p className={styles.loginText}>
          Already have an account?{" "}
          <Link to="/login" className={styles.link}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;