import React, { useContext, useState } from "react";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./cart.css";

const Cart = () => {
  const {
    cartItems,
    food_list,
    removeFromCart,
    currency,
    token,
  } = useContext(StoreContext);
  const [selectedItems, setSelectedItems] = useState({});
  const navigate = useNavigate();

  const toggleSelectItem = (itemId) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const buySelectedItems = async () => {
    const selectedFoodItems = Object.keys(selectedItems).filter(
      (itemId) => selectedItems[itemId]
    );

    if (selectedFoodItems.length === 0) {
      alert("Please select items to buy.");
      return;
    }

    // Navigate to PlaceOrder with selected items
    navigate("/placeorder", { state: { selectedFoodItems } });
  };

  const getTotalAmount = () => {
    return Object.keys(cartItems).reduce((total, itemId) => {
      const item = food_list.find((dish) => dish.id === parseInt(itemId));
      if (item) {
        return total + item.price * cartItems[itemId];
      }
      return total;
    }, 0);
  };

  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>
      {Object.keys(cartItems).length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty</p>
          <p style={{ fontSize: '1rem', marginTop: '10px' }}>Add some delicious items to get started!</p>
        </div>
      ) : (
        <>
          <div className="cart-items-list">
            {Object.keys(cartItems).map((itemId) => {
              const item = food_list.find(
                (dish) => dish.id === parseInt(itemId)
              );
              return item ? (
                <div className="cart-item" key={item.id}>
                  <input
                    type="checkbox"
                    checked={!!selectedItems[item.id]}
                    onChange={() => toggleSelectItem(item.id)}
                  />
                  <img src={item.image} alt={item.name} className="cart-image" />
                  <div className="cart-details">
                    <h3>{item.name}</h3>
                    <div className="price-info">
                      {currency}{item.price} × {cartItems[item.id]} = {currency}{item.price * cartItems[item.id]}
                    </div>
                    <div className="quantity-info">Quantity: {cartItems[item.id]}</div>
                  </div>
                  <button
                    className="remove-button"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              ) : null;
            })}
          </div>
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="total-amount">
              <span>Total Amount:</span>
              <span className="amount">{currency}{getTotalAmount()}</span>
            </div>
            <button 
              className="buy-button" 
              onClick={buySelectedItems}
              disabled={Object.keys(selectedItems).filter(id => selectedItems[id]).length === 0}
            >
              {Object.keys(selectedItems).filter(id => selectedItems[id]).length > 0
                ? `Proceed to Checkout (${Object.keys(selectedItems).filter(id => selectedItems[id]).length} items)`
                : 'Select items to checkout'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
