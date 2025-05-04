// src/pages/Adisyon.jsx
import React, { useEffect, useState } from 'react';

const Adisyon = () => {
  const [tables, setTables] = useState([]);

  const fetchTables = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://127.0.0.1:8000/api/tables/", {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Token doğru şekilde header'da
        },
      });

      if (!response.ok) {
        console.error("Masa verisi alınamadı. Status:", response.status);
        return;
      }

      const data = await response.json();
      setTables(data);
    } catch (error) {
      console.error("Fetch hatası:", error);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  return (
    <div>
      <h2>Adisyon</h2>
      <ul>
        {tables.map((table) => (
          <li key={table.id}>{table.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Adisyon;
