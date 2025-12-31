import './App.css'
import { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Home from "../src/pages/Home/Home";
import Cart from '../src/pages/Cart/Cart';
import Login from '../src/pages/Login/login'
import PlaceOrder from '../src/pages/PlaceOrder/PlaceOrder'
import SignUp from '../src/pages/SignUp/SignUp'
import About from '../src/pages/About/About'
import Orders from '../src/pages/Orders/Orders'
import Profile from '../src/pages/Profile/Profile'
import Contact from '../src/pages/Contact/Contact'
import Navbar from './components/Navbar/Navbar';


function App() {
  
  // Check if user is logged in by checking localStorage token on mount
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('token');
  });
  
  // Sync auth state with token changes (e.g., from other tabs)
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };
    
    // Check on mount
    checkAuth();
    
    // Listen for storage changes (e.g., login from another tab)
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token'); // Clear token from localStorage
  };
  return (
    <>
    {
      isLoggedIn ? 
    (<>
      <Navbar handleLogout={handleLogout}/>
      <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/placeorder" element={<PlaceOrder/>} />
            <Route path="/about" element={<About />} />
            <Route path="/menu" element={<div>Menu Page</div>} />
            <Route path="/contact" element={<Contact/>} />
            <Route path="/orders" element={<Orders/>} />
            <Route path="/profile" element={<Profile/>} />
      </Routes>
     </>) : 

     (<>
        <Routes>
          <Route path="/" element={<Navigate to="/signup" />} />
          <Route path="/signup" element={<SignUp setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="*" element={<Navigate to="/signup" />} />
        </Routes>

     </>)
     
}
</>       
  )
}

export default App