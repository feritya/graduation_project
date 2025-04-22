import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import Cart from "../components/Cart";
import TableCard from "../components/TableCard";
import "./Home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/products/")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        console.log("Ürünler alındı:", data);
      })
      .catch((err) => console.error("Ürün verileri alınamadı:", err));

    fetch("http://localhost:8000/api/tables/")
      .then((res) => res.json())
      .then((data) => setTables(data))
      .catch((err) => console.error("Masa verileri alınamadı:", err));
  }, []);

  const handleAddToCart = (product) => {
    const index = cartItems.findIndex((item) => item.id === product.id);
    if (index !== -1) {
      const newCart = [...cartItems];
      newCart[index].quantity += 1;
      setCartItems(newCart);
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (index) => {
    const newCart = [...cartItems];
    newCart.splice(index, 1);
    setCartItems(newCart);
  };

  const handleSubmitOrder = () => {
    if (!selectedTable) {
      alert("Lütfen önce bir masa seçin!");
      return;
    }

    const orderPayload = {
      items: cartItems.map((item) => ({
        product: item.id,
        quantity: item.quantity,
      })),
      table: selectedTable.id,
    };

    console.log("Gönderilecek sipariş:", orderPayload);

    fetch("http://localhost:8000/api/orders/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderPayload),
    })
      .then((res) => {
        if (res.ok) {
          alert("Sipariş başarıyla gönderildi!");
          setCartItems([]);
        } else {
          alert("Sipariş gönderilirken hata oluştu.");
        }
      })
      .catch((err) => {
        console.error("Sipariş gönderme hatası:", err);
      });
  };

  const handleSelectTable = (table) => {
    setSelectedTable(table);
  };

  return (
    <Layout>
      <h2 style={{ fontSize: "18px", marginBottom: "8px" }}>
        Masa Seçimi:{" "}
        {selectedTable ? (
          <span style={{ color: "#20cd8d" }}>{selectedTable.name}</span>
        ) : (
          <span style={{ color: "#f5a623" }}>Henüz masa seçilmedi</span>
        )}
      </h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        {tables.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            onClick={handleSelectTable}
          />
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            price={product.price}
            onClick={() => handleAddToCart(product)}
          />
        ))}
      </div>

      <Cart
        cartItems={cartItems}
        onRemove={handleRemoveFromCart}
        onSubmit={handleSubmitOrder}
      />
    </Layout>
  );
};

export default Home;
