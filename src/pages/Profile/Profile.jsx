import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import "./profile.css";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await api.get("/api/user/profile");
        
        if (response.data.success) {
          setUserData(response.data.user);
        } else {
          setError(response.data.message || "Failed to fetch profile information.");
        }
      } catch (err) {
        if (err.isAuthError) {
          setError("Session expired. Please log in again.");
        } else if (err.isNetworkError) {
          setError("Network error. Please check your connection.");
        } else {
          setError(err.message || "Something went wrong. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="profile-container loading">
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return <div className="profile-container error">{error}</div>;
  }

  return (
    <div className="profile-container">
      <h1>My Profile</h1>
      <div className="profile-card">
        <div className="profile-info-item">
          <strong>👤 Username</strong>
          <span>{userData.username}</span>
        </div>
        <div className="profile-info-item">
          <strong>📧 Email</strong>
          <span>{userData.email}</span>
        </div>
        <div className="profile-info-item">
          <strong>📱 Phone Number</strong>
          <span>{userData.number}</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
