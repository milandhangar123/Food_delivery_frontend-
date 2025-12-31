import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = ({isLoggedIn, setIsLoggedIn }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:9000';
      const response = await fetch(`${apiBase}/api/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Handle HTTP error status codes (400, 401, etc.)
        alert(data.message || 'Login Failed');
        return;
      }
      
      if (data.success) {
        localStorage.setItem('token', data.token); // Save token in localStorage
        setIsLoggedIn(true);
        navigate('/');
      } else {
        alert(data.message || 'Login Failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.isNetworkError) {
        alert('Network error. Please check your connection and try again.');
      } else {
        alert('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome Back!</h2>
      <p>Sign in to continue to your account</p>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={credentials.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={credentials.password}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Sign In</button>
      </form>
      <p className="link-text">
        Don't have an account? <span onClick={() => navigate('/signup')}>Sign Up</span>
      </p>
    </div>
  );
};

export default Login;
