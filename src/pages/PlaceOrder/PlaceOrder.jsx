import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import api from "../../utils/api";
import "./placeorder.css";

const PlaceOrder = () => {
  const { token, cartItems, food_list, currency } = useContext(StoreContext);
  const [address, setAddress] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const selectedItems = location.state?.selectedFoodItems || [];

  const handlePayment = async () => {
    setIsProcessing(true);
    const itemsDetails = selectedItems.map((itemId) => ({
      id: itemId,
      quantity: cartItems[itemId],
    }));

    const totalAmount = itemsDetails.reduce((total, item) => {
      const foodItem = food_list.find((dish) => dish.id === parseInt(item.id));
      return total + foodItem.price * item.quantity;
    }, 0);

    try {
      const response = await api.post("/api/order/place", {
        userId: token,
        selectedItems,
        address,
        totalAmount,
        quantity: cartItems,
      });

      if (response.data.success) {
        alert("Order placed successfully!");
        navigate("/orders");
      } else {
        alert(response.data.message || "Order placement failed. Please try again.");
      }
    } catch (err) {
      console.error("Error placing order:", err);
      if (err.isAuthError) {
        alert("Session expired. Please log in again.");
        navigate("/login");
      } else if (err.isNetworkError) {
        alert("Network error. Please check your connection and try again.");
      } else {
        alert(err.message || "Error occurred while processing your order.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const totalAmount = selectedItems.reduce((total, itemId) => {
    const item = food_list.find((dish) => dish.id === parseInt(itemId));
    return total + (item ? item.price * cartItems[itemId] : 0);
  }, 0);

  return (
    <div className="placeorder-container">
      <h2>Complete Your Order</h2>
      <div>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: 'var(--text-dark)' }}>
          Delivery Address
        </label>
        <textarea
          placeholder="Enter your complete delivery address..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows="4"
          required
        />
      </div>
      <div className="order-summary">
        <h3>Order Summary</h3>
        {selectedItems.map((itemId) => {
          const item = food_list.find((dish) => dish.id === parseInt(itemId));
          if (!item) return null;
          return (
            <div key={item.id} className="order-item">
              <p>
                <strong>{item.name}</strong>
              </p>
              <p>
                {currency}{item.price} × {cartItems[itemId]} = {currency}{item.price * cartItems[itemId]}
              </p>
            </div>
          );
        })}
        <div className="order-item" style={{ 
          marginTop: '20px', 
          paddingTop: '20px', 
          borderTop: '2px solid var(--border-color)',
          fontWeight: '700',
          fontSize: '1.2rem'
        }}>
          <p>Total Amount:</p>
          <p style={{ color: 'var(--primary-color)', fontSize: '1.5rem' }}>
            {currency}{totalAmount}
          </p>
        </div>
      </div>
      <button
        className="payment-button"
        onClick={handlePayment}
        disabled={isProcessing || !address.trim()}
      >
        {isProcessing ? "Processing Your Order..." : `Pay ${currency}${totalAmount} & Place Order`}
      </button>
    </div>
  );
};

export default PlaceOrder;
