import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";

const NotFound = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const token = sessionStorage.getItem("authToken");

      if (!token) {
        console.log("User is not logged in");
        return;
      }

      const response = await axios.get(
        "http://localhost:3000/api/auth/get-userDetails",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setUserData(response.data.user);
        sessionStorage.setItem("userData", JSON.stringify(response.data.user));
      } else {
        console.log(response.data.message || "Failed to fetch user details");
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
      console.log(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="home-screen-container">
      <h2 className="welcome-text">User Details</h2>

      {userData ? (
        <div className="user-details-container">
          <h3 className="user-info">
            Username: <span>{userData.username}</span>
          </h3>
          <h3 className="user-info">
            Name: <span>{userData.name}</span>
          </h3>
          <h3 className="user-info">
            Email: <span>{userData.email}</span>
          </h3>
          <h3 className="user-info">
            Mobile: <span>{userData.mobile}</span>
          </h3>
        </div>
      ) : (
        <p>Loading user details...</p>
      )}
    </div>
  );
};

export default NotFound;
