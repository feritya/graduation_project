// src/components/CartItem.jsx
import React from "react";

const CartItem = ({ name, quantity, price, onRemove }) => {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        color: "#172627",
        padding: "12px",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <div>
        <div style={{ fontWeight: "bold" }}>{name}</div>
        <div style={{ fontSize: "14px" }}>
          {quantity} x {price}₺ = {quantity * price}₺
        </div>
      </div>
      <button
        onClick={onRemove}
        style={{
          backgroundColor: "#20cd8d",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          padding: "8px 12px",
          cursor: "pointer",
        }}
      >
        Sil
      </button>
    </div>
  );
};

export default CartItem;
