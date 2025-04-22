// src/components/ProductCard.jsx
import React from "react";

const ProductCard = ({ name, price, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: "#20cd8d",
        color: "#fff",
        padding: "16px",
        borderRadius: "12px",
        textAlign: "center",
        cursor: "pointer",
        minWidth: "100px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        margin: "8px",
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: "16px" }}>{name}</div>
      <div style={{ fontSize: "14px", marginTop: "4px" }}>{price}₺</div>
    </div>
  );
};

export default ProductCard;
