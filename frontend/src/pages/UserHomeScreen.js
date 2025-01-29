import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaLock, FaUnlock, FaTrashAlt, FaSearch } from "react-icons/fa"; // Small icons

function UserHomeScreen() {
  const [userData, setUserData] = useState([]);
  const [error, setError] = useState("");
  const [filterText, setFilterText] = useState(""); // State to hold the filter text
  const navigate = useNavigate(); // Initialize navigate for redirection

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      console.log("Token:", token);

      if (!token) {
        setError("Please login to access the details of the users.");
        return;
      }

      const response = await axios.get(
        "http://localhost:3000/api/auth/get-all-users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response Data:", response.data);

      if (response.data.success) {
        if (response.data.users.length === 0) {
          setError("No users found.");
        } else {
          const formattedUsers = response.data.users.map((user) => {
            const formattedDate = formatDate(user.lastTimeSeen);
            return {
              ...user,
              lastTimeSeen: formattedDate,
            };
          });

          setUserData(formattedUsers);
        }
      } else {
        setError(response.data.message || "Failed to fetch users");
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError("An error occurred while fetching the users.");
    }
  };

  const formatDate = (date) => {
    const parsedDate = new Date(date);

    if (isNaN(parsedDate)) {
      return "Invalid Date";
    }

    return parsedDate.toLocaleString();
  };

  const handleSearch = (e) => {
    setFilterText(e.target.value);
  };

  const handleBlockUser = (userId) => {
    console.log(`Block user with ID: ${userId}`);
  };

  const handleUnblockUser = (userId) => {
    console.log(`Unblock user with ID: ${userId}`);
  };

  const handleDeleteUser = (userId) => {
    console.log(`Delete user with ID: ${userId}`);
  };

  return (
    <div className="user-home-container">
      <h2 className="header">Welcome to User Home Screen</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name or email"
          value={filterText}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      <div className="table-container">
        <h3>All Users</h3>
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {userData
              .filter(
                (user) =>
                  user.name.toLowerCase().includes(filterText.toLowerCase()) ||
                  user.email.toLowerCase().includes(filterText.toLowerCase())
              )
              .map((user) => (
                <tr
                  key={user.id}
                  className={user.isBlocked ? "blocked-user" : ""}
                >
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.mobile}</td>
                  <td>{user.lastTimeSeen}</td>
                  <td className="actions">
                    <button
                      onClick={() => handleBlockUser(user.id)}
                      className="action-button block"
                    >
                      <FaLock />
                    </button>
                    <button
                      onClick={() => handleUnblockUser(user.id)}
                      className="action-button unblock"
                    >
                      <FaUnlock />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="action-button delete"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            {userData.length === 0 && (
              <tr>
                <td colSpan="6" className="no-data">
                  No users available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserHomeScreen;
