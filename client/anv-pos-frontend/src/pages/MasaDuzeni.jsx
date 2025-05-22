import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MasaDuzeni.css";

const MasaDuzeni = () => {
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newTableName, setNewTableName] = useState("");
  const [editingTableId, setEditingTableId] = useState(null);
  const [editedTableName, setEditedTableName] = useState("");

  const fetchData = async () => {
    const tablesRes = await axios.get("http://127.0.0.1:8000/api/tables/");
    const ordersRes = await axios.get("http://127.0.0.1:8000/api/orders/");
    setTables(tablesRes.data);
    setOrders(ordersRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const isTableOccupied = (tableId) => {
    return orders.some((order) => order.table === tableId && !order.is_paid);
  };

  const handleAddTable = async () => {
    if (!newTableName.trim()) {
      alert("Masa adı boş olamaz.");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/tables/", {
        name: newTableName,
      });
      setNewTableName("");
      fetchData();
    } catch (err) {
      console.error("Masa eklenemedi:", err);
      alert("Masa eklenirken bir hata oluştu.");
    }
  };

  const handleDeleteTable = async (id) => {
    if (isTableOccupied(id)) {
      alert("Bu masa aktif bir sipariş içeriyor ve silinemez.");
      return;
    }

    if (window.confirm("Bu masayı silmek istediğinize emin misiniz?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/tables/${id}/`);
        setTables((prev) => prev.filter((table) => table.id !== id));
      } catch (err) {
        console.error("Masa silinirken hata oluştu:", err);
        alert("Masa silinirken bir hata oluştu.");
      }
    }
  };

  const handleEditClick = (table) => {
    setEditingTableId(table.id);
    setEditedTableName(table.name);
  };

  const handleSaveEdit = async (id) => {
    if (!editedTableName.trim()) {
      alert("Masa adı boş olamaz.");
      return;
    }

    try {
      await axios.put(`http://127.0.0.1:8000/api/tables/${id}/`, {
        name: editedTableName,
      });
      setEditingTableId(null);
      setEditedTableName("");
      fetchData();
    } catch (err) {
      console.error("Masa güncellenemedi:", err);
      alert("Masa güncellenirken hata oluştu.");
    }
  };

  return (
    <div className="masa-container">
      <h2>Masa Düzeni</h2>

      <div className="add-table-form">
        <input
          type="text"
          placeholder="Yeni masa adı"
          value={newTableName}
          onChange={(e) => setNewTableName(e.target.value)}
        />
        <button onClick={handleAddTable}>Ekle</button>
      </div>

      <div className="table-grid">
        {tables.map((table) => {
          const occupied = isTableOccupied(table.id);
          return (
            <div
              key={table.id}
              className={`table-card ${occupied ? "occupied" : ""}`}
            >
              {editingTableId === table.id ? (
                <>
                  <input
                    type="text"
                    value={editedTableName}
                    onChange={(e) => setEditedTableName(e.target.value)}
                  />
                  <button onClick={() => handleSaveEdit(table.id)}>💾</button>
                  <button onClick={() => setEditingTableId(null)}>❌</button>
                </>
              ) : (
                <>
                  <p>{table.name}</p>
                  <div className="button-row">
                    <button onClick={() => handleEditClick(table)}>✏️</button>
                    <button onClick={() => handleDeleteTable(table.id)}>🗑️</button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MasaDuzeni;
