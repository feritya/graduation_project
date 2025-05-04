import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Cart = () => {
  const { id } = useParams(); // masa id'si
  const [table, setTable] = useState(null);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchTableAndOrder = async () => {
      try {
        // Masa bilgisi
        const tableRes = await fetch(`http://127.0.0.1:8000/api/tables/${id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        // Sipariş bilgisi (mevcut sipariş varsa getir)
        const orderRes = await fetch(`http://127.0.0.1:8000/api/orders/by_table/${id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (tableRes.ok) {
          const tableData = await tableRes.json();
          setTable(tableData);
        }

        if (orderRes.ok) {
          const orderData = await orderRes.json();
          setOrder(orderData);
        }
      } catch (error) {
        console.error('Veri çekme hatası:', error);
      }
    };

    fetchTableAndOrder();
  }, [id]);

  return (
    <div style={{ padding: '1rem', color: '#fff' }}>
      <h2>{table ? `${table.name} Masası` : 'Masa yükleniyor...'}</h2>
      <h3>{order ? 'Mevcut Sipariş' : 'Henüz sipariş yok'}</h3>

      {order && (
        <ul>
          {order.items.map((item) => (
            <li key={item.id}>
              {item.product.name} x {item.quantity}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cart;
