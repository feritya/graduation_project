// src/pages/Adisyon.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Adisyon.css";

const Adisyon = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  


  const token = localStorage.getItem("access");
  const updateTableStatus = (tableId, isOccupied) => {
  const updatedTables = tables.map((table) => {
    if (table.id === tableId) {
      return { ...table, is_occupied: isOccupied };
    }
    return table;
  });

  setTables(updatedTables);
};


  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/categories/").then((res) => {
      setCategories(res.data);
    });

    axios.get("http://127.0.0.1:8000/api/products/").then((res) => {
      setProducts(res.data);
    });

    axios.get("http://127.0.0.1:8000/api/tables/").then((res) => {
      setTables(res.data);
    });

    axios.get("http://127.0.0.1:8000/api/orders/").then((res) => {
      setOrders(res.data);
    });
  }, []);

const handleAddToCart = (product) => {
  const existing = cart.find((item) => item.product.id === product.id);
  const currentQty = existing ? existing.quantity : 0;
  const totalAfterAdd = currentQty + 1;

  if (totalAfterAdd > product.stock) {
    alert(`${product.name} ürününün stoğu tükendi.`);
    return;
  }

  if (existing) {
    const updated = cart.map((item) =>
      item.product.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setCart(updated);
  } else {
    setCart([...cart, { product, quantity: 1 }]);
  }
};


const handleDecreaseQuantity = (productId) => {
  const updatedCart = cart.map((item) => {
    if (item.product.id === productId) {
      return { ...item, quantity: item.quantity - 1 };
    }
    return item;
  }).filter(item => item.quantity > 0);

  setCart(updatedCart);

  if (updatedCart.length === 0 && selectedTable) {
    updateTableStatus(selectedTable.id, false); // boş yap
  }
};

const handleRemoveFromCart = (productId) => {
  const updatedCart = cart.filter((item) => item.product.id !== productId);
  setCart(updatedCart);
};
  

const handleSelectTable = (tableId) => {
  setSelectedTable(tableId);
  setCart([]);

  const existingOrder = orders.find(
    (order) => order.table === tableId && !order.is_paid
  );

  if (existingOrder) {
    const items = existingOrder.items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
    }));
    setCart(items);
  }
};

const sendOrder = async () => {
    if (!selectedTable) {
      alert("Lütfen bir masa seçin.");
      return;
    }

    const existingOrder = orders.find(
      (order) => order.table === selectedTable && !order.is_paid
    );

    const data = {
      table: selectedTable,
      waiter: 1,
      items: cart.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),
    };

    try {
      if (existingOrder) {
        // Güncelleme
        await axios.put(
          `http://127.0.0.1:8000/api/orders/${existingOrder.id}/`,
          data,
          {
            //  headers: {
            //    Authorization: `Bearer ${token}`,
            // },
          }
        );
        alert("Sipariş güncellendi.");

      } else {
        // Yeni sipariş
        await axios.post("http://127.0.0.1:8000/api/orders/", data,
          // {
          //  headers: {
          //    Authorization: `Bearer ${token}`,
          //  },
        // }
      );
        alert("Sipariş gönderildi.");
      }

      // Sipariş ve masa listesini güncelle
      const orderRes = await axios.get("http://127.0.0.1:8000/api/orders/");
      setOrders(orderRes.data);

      const tableRes = await axios.get("http://127.0.0.1:8000/api/tables/");
      setTables(tableRes.data);

      setCart([]);
      setSelectedTable(null);
    } catch (err) {
      console.error("Sipariş gönderme hatası:", err);
      alert("Sipariş gönderilirken bir hata oluştu.");
    }
  };

const handlePayment = async () => {
  if (!selectedTable) {
    alert("Lütfen bir masa seçin.");
    return;
  }

  const existingOrder = orders.find(
    (order) => order.table === selectedTable && !order.is_paid
  );

  if (!existingOrder) {
    alert("Bu masada açık bir sipariş yok.");
    return;
  }

  try {
    await axios.patch(`http://127.0.0.1:8000/api/orders/${existingOrder.id}/mark-paid/`);

    alert("Ödeme tamamlandı.");

    // Sipariş ve masa listesini güncelle
    const orderRes = await axios.get("http://127.0.0.1:8000/api/orders/");
    setOrders(orderRes.data);

    const tableRes = await axios.get("http://127.0.0.1:8000/api/tables/");
    setTables(tableRes.data);

    // Arayüzü sıfırla
    setCart([]);
    setSelectedTable(null);
  } catch (err) {
    console.error("Ödeme işlemi hatası:", err);
    alert("Ödeme tamamlanamadı.");
  }
};

  const getProductsByCategory = () => {
    return products.filter(
      (product) => product.category === selectedCategory
    );
  };

const isTableOccupied = (tableId) => {
// Eğer seçili masa buysa ve sepette ürün varsa, masa dolu gibi görünmeli
if (selectedTable === tableId && cart.length > 0) {
  return true;
}

// Diğer siparişlere göre kontrol et
return orders.some((order) => order.table === tableId && !order.is_paid);
};
const getCartTotal = () => {
  return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
};

  return (
    <div className="adisyon-container">
      {/* Kategoriler ve Ürünler */}
      <div className="section section-products">
        <h2>Kategoriler</h2>
        <div className="category-list">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`category-button ${
                selectedCategory === category.id ? "active" : ""
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <h2>Ürünler</h2>
        <div className="product-list">
          {selectedCategory &&
            getProductsByCategory().map((product) => (
              <div
                key={product.id}
                className="product-card"
                onClick={() => handleAddToCart(product)}
              >
                <p>{product.name}</p>
                <p>{product.price} ₺</p>
              </div>
            ))}
        </div>
      </div>

      {/* Sipariş Sepeti */}
      <div className="section-cart">
        <h2>Sipariş</h2>
        <ul className="cart-list">
          {cart.map((item, index) => (
            <li key={index} className="cart-item">
              <span>{item.product.name} x {item.quantity}</span>
              <div className="cart-buttons">
                <button onClick={() => handleDecreaseQuantity(item.product.id)}>-</button>
                <button onClick={() => handleRemoveFromCart(item.product.id)}>🗑️</button>
              </div>
            </li>
          ))}
        </ul>
        <button onClick={sendOrder} className="send-button">KAYDET</button>
        <button onClick={handlePayment} className="payment-button">ÖDEMEYİ TAMAMLA</button>
        <div className="cart-total">
          Toplam: {getCartTotal().toFixed(2)} ₺
          </div>

      </div>

      {/* Masalar */}
      <div className="section section-tables">
        <h2>Masalar</h2>
        <div className="table-grid">
          {tables.map((table) => {
            const occupied = isTableOccupied(table.id);
            return (
              <div
                key={table.id}
                className={`table-card ${occupied ? "occupied" : ""} ${
                  selectedTable === table.id ? "selected" : ""
                }`}
                onClick={() => handleSelectTable(table.id)}
              >
                <div>{table.name}</div>
                {selectedTable === table.id && (
                  <div className="table-total">{getCartTotal().toFixed(2)} ₺</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Adisyon;
