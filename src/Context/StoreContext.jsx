import { createContext, useEffect, useState } from "react";
import api, { API_BASE_URL } from "../utils/api";
import { Dishes } from "../shared/dishes"; // Assuming mock data is still needed

// Create the StoreContext
export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {

  // State variables
  const [food_list, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const currency = "₹";

  // Add item to cart
  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    if (token) {
      try {
        await api.post("/api/cart/add", { itemId });
      } catch (error) {
        console.error("Error adding item to cart:", error);
        // Don't show error to user for cart operations - fail silently
      }
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[itemId] > 1) {
        updatedCart[itemId] -= 1;
      } else {
        delete updatedCart[itemId];
      }
      return updatedCart;
    });

    if (token) {
      try {
        await api.post("/api/cart/remove", { itemId });
      } catch (error) {
        console.error("Error removing item from cart:", error);
        // Don't show error to user for cart operations - fail silently
      }
    }
  };

  // Get total amount in cart
  const getTotalCartAmount = () => {
    return Object.keys(cartItems).reduce((total, itemId) => {
      const item = food_list.find((dish) => dish.id === parseInt(itemId));
      return item ? total + item.price * cartItems[itemId] : total;
    }, 0);
  };

  // Load food list
  useEffect(() => {
    setFoodList(Dishes); // Using mock data
  }, []);

  // Load cart data from the backend
  const loadCartData = async () => {
    if (token) {
      try {
        const response = await api.post("/api/cart/get", {});
        if (response.data.success && response.data.cartData) {
          setCartItems(response.data.cartData);
        }
      } catch (error) {
        console.error("Error loading cart data:", error);
        // If auth error, token might be invalid - clear it
        if (error.isAuthError) {
          setToken(null);
          localStorage.removeItem('token');
        }
      }
    }
  };

  // Reload cart data on token change
  useEffect(() => {
    loadCartData();
  }, [token]);

  // Context value
  const contextValue = {
    food_list,
    cartItems,
    setCartItems, // Expose setCartItems
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    token,
    setToken,
    currency,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;