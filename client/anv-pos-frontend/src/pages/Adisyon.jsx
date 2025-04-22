import React, { useEffect, useState } from "react";
import axios from "axios";

function Adisyon() {
  const [products, setProducts] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Ürünleri getir
  useEffect(() => {
    axios.get("http://localhost:8000/api/products/").then((res) => {
      setProducts(res.data);
    });
  }, []);

  // Masaları getir
  useEffect(() => {
    axios.get("http://localhost:8000/api/tables/").then((res) => {
      setTables(res.data);
    });
  }, []);

  // Masa seçildiğinde o masaya ait açık sipariş varsa getir
  const handleTableClick = async (tableId) => {
    setSelectedTable(tableId);
    setSelectedItems([]);
    setQuantities({});
    setIsEditing(false);
    setOrderId(null);

    try {
      const res = await axios.get(`http://localhost:8000/api/orders/?table=${tableId}&is_paid=false`);
      if (res.data.length > 0) {
        const existingOrder = res.data[0];
        setOrderId(existingOrder.id);
        setIsEditing(true);

        const items = existingOrder.items.map(item => ({
          product: item.product,
          quantity: item.quantity,
          product_id: item.product.id
        }));

        setSelectedItems(items.map(i => i.product_id));
        const qty = {};
        items.forEach(i => qty[i.product_id] = i.quantity);
        setQuantities(qty);
      }
    } catch (error) {
      console.error("Masa için sipariş alınırken hata oluştu:", error);
    }
  };

  const handleQuantityChange = (productId, quantity) => {
    setQuantities({ ...quantities, [productId]: quantity });
    if (!selectedItems.includes(productId)) {
      setSelectedItems([...selectedItems, productId]);
    }
  };

  const handleSubmit = async () => {
    const items = selectedItems.map(id => ({
      product_id: id,
      quantity: quantities[id] || 1
    }));

    const data = {
      table: selectedTable,
      waiter: 1,
      items
    };

    try {
      if (isEditing && orderId) {
        await axios.put(`http://localhost:8000/api/orders/${orderId}/`, data);
        alert("Sipariş başarıyla güncellendi.");
      } else {
        await axios.post("http://localhost:8000/api/orders/", data);
        alert("Sipariş başarıyla oluşturuldu.");
      }
      resetForm();
    } catch (error) {
      alert("Sipariş gönderilemedi.");
      console.error(error.response?.data || error.message);
    }
  };

  const resetForm = () => {
    setSelectedTable(null);
    setSelectedItems([]);
    setQuantities({});
    setIsEditing(false);
    setOrderId(null);
  };

  return (
    <div style={{ padding: "1rem", color: "white", backgroundColor: "#172627", minHeight: "100vh" }}>
      <h1 style={{ color: "#20cd8d", marginBottom: "1rem" }}>Adisyon</h1>

      <div style={{ marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Masa Seç</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {tables.map((table) => (
            <button
              key={table.id}
              onClick={() => handleTableClick(table.id)}
              style={{
                backgroundColor: selectedTable === table.id ? "#20cd8d" : "#2d3e44",
                color: "white",
                padding: "0.75rem",
                borderRadius: "10px",
                minWidth: "80px",
                border: "none",
                cursor: "pointer",
              }}
            >
              {table.name}
            </button>
          ))}
        </div>
      </div>

      {selectedTable && (
        <div>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Ürün Seç</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {products.map((product) => (
              <div
                key={product.id}
                style={{
                  backgroundColor: selectedItems.includes(product.id) ? "#20cd8d" : "#2d3e44",
                  padding: "0.75rem",
                  borderRadius: "10px",
                  width: "150px",
                }}
              >
                <div style={{ fontWeight: "bold" }}>{product.name}</div>
                <div>{product.price}₺</div>
                <input
                  type="number"
                  min="1"
                  value={quantities[product.id] || ""}
                  onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 1)}
                  style={{ width: "100%", marginTop: "0.5rem", padding: "0.25rem" }}
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            style={{
              marginTop: "1rem",
              padding: "1rem",
              backgroundColor: "#20cd8d",
              color: "#172627",
              fontWeight: "bold",
              borderRadius: "10px",
              border: "none",
              width: "100%",
            }}
          >
            {isEditing ? "Siparişi Güncelle" : "Siparişi Gönder"}
          </button>
        </div>
      )}
    </div>
  );
}

export default Adisyon;
