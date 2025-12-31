import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signup.css';

const Signup = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState({
    username: '',
    number: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    console.log(e.target.name);
    
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:9000';
      const response = await fetch(`${apiBase}/api/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Handle HTTP error status codes (400, 409, etc.)
        alert(data.message || 'Registration Failed');
        return;
      }
      
      if (data.success) {
        localStorage.setItem('token', data.token); // Save token in localStorage
        setIsLoggedIn(true);
        navigate('/');
      } else {
        alert(data.message || 'Registration Failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      if (err.isNetworkError) {
        alert('Network error. Please check your connection and try again.');
      } else {
        alert('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="signup-container">
      <h2>Create Account</h2>
      <p>Join us and start ordering delicious food</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Full Name"
          value={formData.username}
          onChange={handleInputChange}
          required
        />
        <input
          type="tel"
          name="number"
          placeholder="Phone Number"
          value={formData.number}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password (min. 8 characters)"
          value={formData.password}
          onChange={handleInputChange}
          required
          minLength={8}
        />
        <button type="submit">Create Account</button>
      </form>
      <p className="link-text">
        Already have an account? <span onClick={() => navigate('/login')}>Sign In</span>
      </p>
    </div>
  );
};

export default Signup;
