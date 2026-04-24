import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import styles from './manageCategories.module.css';

const ManageCategories = ({ refreshCount }) => {

  const [categories, setCategories] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    name: "",
    image: null
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/category/all");
      setCategories(res.data.categories);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("image", form.image);

    try {
      await axios.post("http://localhost:8000/api/category/add", formData);
      toast.success("Category added ✅");

      setForm({ name: "", image: null });
      fetchCategories();
      refreshCount && refreshCount();
    } catch (err) {
      toast.error("Failed to add category ❌");
    }
  };

  const openEdit = (cat) => {
    setSelectedId(cat._id);
    setForm({ name: cat.name, image: null });
    setPreview(`http://localhost:8000/uploads/${cat.image}`);
    setEditModal(true);
  };

  const closeModal = () => {
    setEditModal(false);
    setPreview(null);
    setForm({ name: "", image: null });
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("name", form.name);
    if (form.image) formData.append("image", form.image);

    try {
      await axios.put(`http://localhost:8000/api/category/update/${selectedId}`, formData);
      toast.success("Category updated ✏️");
      fetchCategories();
      refreshCount && refreshCount();
      closeModal();
    } catch (err) {
      toast.error("Update failed ❌");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/category/delete/${id}`);
      toast.success("Category deleted 🗑️");
      fetchCategories();
      refreshCount && refreshCount();
    } catch (err) {
      toast.error("Failed to delete ❌");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Manage Categories</h2>

      {/* Add Category Form */}
      <form className={styles.formCategory} onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Category name"
          value={form.name}
          onChange={handleChange}
          className={styles.inputText}
        />

        <input
          type="file"
          name="image"
          onChange={handleChange}
          className={styles.inputFile}
        />

        <button type="submit" className={styles.addButton}>Add Category</button>
      </form>

      {/* Category List */}
      <div className={styles.categoryContainer}>
        {categories.map((cat) => (
          <div key={cat._id} className={styles.categoryCard}>
            <img
              src={`http://localhost:8000/uploads/${cat.image}`}
              alt={cat.name}
              className={styles.categoryImage}
            />
            <h3 className={styles.categoryTitle}>{cat.name}</h3>

            <div className={styles.actions}>
              <button className={styles.editBtn} onClick={() => openEdit(cat)}>
                ✏️ Edit
              </button>
              <button className={styles.deleteBtn} onClick={() => handleDelete(cat._id)}>
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>Edit Category</h2>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={styles.inputText}
            />

            <input
              type="file"
              name="image"
              onChange={handleChange}
              className={styles.inputFile}
            />

            {preview && <img src={preview} alt="Preview" className={styles.previewImg} />}

            <div className={styles.modalActions}>
              <button onClick={handleUpdate} className={styles.saveBtn}>💾 Save</button>
              <button onClick={closeModal} className={styles.cancelBtn}>❌ Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;