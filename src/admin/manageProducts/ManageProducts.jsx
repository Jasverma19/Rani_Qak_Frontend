import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from './ManageProducts.module.css';
import { toast } from "react-toastify";

const ManageProducts = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);

  const url = "http://localhost:8000";

  const fetchFoods = async () => {
    try {
      const res = await axios.get(`${url}/api/food/all`);
      setFoods(res.data.foods || []);
    } catch (err) {
      console.error(err)
      toast.error("Failed to load foods");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${url}/api/category/all`);
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchFoods();
      await fetchCategories();
    };

    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isDuplicate = foods.some((food) => food.name.trim().toLowerCase() === name.trim().toLowerCase() && food._id !== editId);

    if (isDuplicate) {
      toast.error("Food already existed! 🍔");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("category", category);
    if (image) formData.append("image", image);

    try {
      if (editId) {
        await axios.put(`${url}/api/food/${editId}`, formData);
        toast.success("Food updated successfully!");
      } else {
        await axios.post(`${url}/api/food/add`, formData);
        toast.success("Food added successfully! 🍔");
      }

      resetForm();
      fetchFoods();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const resetForm = () => {
    setEditId(null);
    setName("");
    setPrice("");
    setDescription("");
    setCategory("");
    setImage(null);
  };

  const editFood = (food) => {
    setEditId(food._id);
    setName(food.name);
    setPrice(food.price);
    setDescription(food.description || "");
    setCategory(food.category?._id || "");
  };

  const deleteFood = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`${url}/api/food/${id}`);
      toast.success("Product deleted");
      fetchFoods();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    }
  };

  return (
    <div className={styles.manageProducts}>
      <h1 className={styles.title}>🍔 Manage Products</h1>

      {/* Add / Edit Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <input
            type="text"
            placeholder="Food Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Price (₹)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
          />

          <button type="submit" className={styles.addBtn}>
            {editId ? "Update Food" : "Add Food"}
          </button>

          {editId && (
            <button type="button" onClick={resetForm} className={styles.cancelBtn}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Products Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((food) => (
              <tr key={food._id}>
                <td>
                  {food.image && (
                    <img
                      src={`http://localhost:8000/uploads/${food.image}`}
                      alt={food.name}
                      className={styles.foodImage}
                    />
                  )}
                </td>
                <td>{food.name}</td>
                <td>₹{food.price}</td>
                <td>{food.category?.name}</td>
                <td className={styles.actions}>
                  <button onClick={() => editFood(food)} className={styles.editBtn}>
                    Edit
                  </button>
                  <button onClick={() => deleteFood(food._id)} className={styles.deleteBtn}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProducts;
