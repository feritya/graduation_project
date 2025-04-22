// src/components/Cart.jsx
import React from "react";
import CartItem from "./CartItem";

const Cart = ({ cartItems, onRemove, onSubmit }) => {
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  return (
    <div
      style={{
        backgroundColor: "#1e2e2f",
        padding: "16px",
        borderRadius: "12px",
        marginTop: "20px",
        color: "#fff",
      }}
    >
      <h2 style={{ marginBottom: "16px", fontSize: "20px" }}>Sepet</h2>
      {cartItems.length === 0 ? (
        <p>Sepet boş</p>
      ) : (
        cartItems.map((item, index) => (
          <CartItem
            key={index}
            name={item.name}
            quantity={item.quantity}
            price={item.price}
            onRemove={() => onRemove(index)}
          />
        ))
      )}

      <div
        style={{
          marginTop: "20px",
          fontWeight: "bold",
          fontSize: "18px",
          textAlign: "right",
        }}
      >
        Toplam: {totalPrice} ₺
      </div>

      <button
        onClick={onSubmit}
        style={{
          marginTop: "12px",
          width: "100%",
          padding: "12px",
          backgroundColor: "#20cd8d",
          border: "none",
          color: "#fff",
          borderRadius: "10px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Siparişi Onayla
      </button>
    </div>
  );
};

export default Cart;
