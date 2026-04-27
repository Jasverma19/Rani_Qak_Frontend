import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from './ManageUsers.module.css';
import { toast } from "react-toastify";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/user/all");
      setUsers(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete User
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/user/delete/${id}`);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    }
  };

  // Block / Unblock User
  const toggleBlock = async (id, isCurrentlyBlocked) => {
    try {
      await axios.put(`http://localhost:8000/api/user/block/${id}`);
      toast.success(isCurrentlyBlocked ? "User Unblocked" : "User Blocked");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div className={styles.loading}>Loading users...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.manageUsers}>
      <div className={styles.header}>
        <h2>👥 Manage Users</h2>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Date Joined</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>👤 {user.name}</td>
                <td>{user.email}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className={user.isBlocked ? styles.blocked : styles.active}>
                  {user.isBlocked ? "🚫 Blocked" : "✅ Active"}
                </td>
                <td className={styles.actions}>
                  <button
                    onClick={() => toggleBlock(user._id, user.isBlocked)}
                    className={styles.blockBtn}
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                  <button
                    onClick={() => deleteUser(user._id)}
                    className={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && !loading && (
        <p className={styles.noUsers}>No users found</p>
      )}
    </div>
  );
};

export default ManageUsers;
