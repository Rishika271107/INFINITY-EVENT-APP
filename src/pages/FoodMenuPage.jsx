import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import foodMenu from "../data/foodMenu";

import "./FoodMenuPage.css";

function FoodMenuPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const hotel = location.state?.hotel;

  const [category, setCategory] = useState("Veg");
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    const existingItem = cart.find(
      (cartItem) => cartItem.id === item.id
    );

    if (existingItem) {
      increaseQuantity(item.id);
    } else {
      setCart([
        ...cart,
        {
          ...item,
          quantity: 1,
        },
      ]);
    }
  };

  const increaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item
    );

    setCart(updatedCart);
  };

  const decreaseQuantity = (id) => {
    const updatedCart = cart
      .map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item
      )
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);
  };

  const getItemQuantity = (id) => {
    const item = cart.find((cartItem) => cartItem.id === id);
    return item ? item.quantity : 0;
  };

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const gst = subtotal * 0.05;

  const finalTotal = subtotal + gst;

  return (
    <div className="menu-page">
      <div className="menu-left">
        <h1 className="menu-title">
          {hotel?.name || "Food Menu"}
        </h1>

        <div className="menu-tabs">
          {Object.keys(foodMenu).map((tab) => (
            <button
              key={tab}
              className={
                category === tab
                  ? "menu-tab active-tab"
                  : "menu-tab"
              }
              onClick={() => setCategory(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="food-grid">
          {foodMenu[category].map((item) => {
            const quantity = getItemQuantity(item.id);

            return (
              <div className="food-card" key={item.id}>
                <div className="food-icon">🍽</div>

                <h3>{item.name}</h3>

                <p>₹{item.price}</p>

                {quantity === 0 ? (
                  <button
                    className="add-cart-btn"
                    onClick={() => addToCart(item)}
                  >
                    Add To Cart
                  </button>
                ) : (
                  <div className="quantity-box">
                    <button
                      onClick={() =>
                        decreaseQuantity(item.id)
                      }
                    >
                      -
                    </button>

                    <span>{quantity}</span>

                    <button
                      onClick={() =>
                        increaseQuantity(item.id)
                      }
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="cart-panel">
        <h2>Cart Summary</h2>

        {cart.length === 0 ? (
          <p className="empty-cart">
            No food items added
          </p>
        ) : (
          <>
            {cart.map((item) => (
              <div
                className="cart-item"
                key={item.id}
              >
                <div>
                  <h4>{item.name}</h4>

                  <p>
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>

                <h4>
                  ₹
                  {(
                    item.price * item.quantity
                  ).toFixed(2)}
                </h4>
              </div>
            ))}

            <hr />

            <div className="cart-total">
              <p>Subtotal</p>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="cart-total">
              <p>GST (5%)</p>
              <span>₹{gst.toFixed(2)}</span>
            </div>

            <div className="cart-total final-total">
              <p>Total</p>
              <span>₹{finalTotal.toFixed(2)}</span>
            </div>

            <button
              className="checkout-btn"
              onClick={() =>
                navigate("/food-supply/checkout", {
                  state: {
                    hotel,
                    cart,
                    subtotal,
                    gst,
                    finalTotal,
                  },
                })
              }
            >
              Proceed
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default FoodMenuPage;