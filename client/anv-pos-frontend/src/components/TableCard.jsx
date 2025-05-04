// src/components/TableCard.jsx

import React from 'react';

const TableCard = ({ table, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: '#20cd8d',
        padding: '1rem',
        borderRadius: '1rem',
        width: '120px',
        height: '100px',
        cursor: 'pointer',
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
      }}
    >
      <div>{table.name}</div>
      <div>{table.status === 'occupied' ? 'Dolu' : 'Boş'}</div>
    </div>
  );
};

export default TableCard;
