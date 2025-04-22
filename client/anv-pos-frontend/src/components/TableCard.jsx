import React from 'react';

const TableCard = ({ table, onClick }) => {
  return (
    <button
      onClick={() => onClick(table)}
      style={{
        width: '100px',
        height: '100px',
        backgroundColor: table.is_occupied ? '#ff5e57' : '#20cd8d',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '1rem',
        border: 'none',
        borderRadius: '12px',
        margin: '10px',
        cursor: 'pointer',
      }}
    >
      {table.name}
    </button>
  );
};

export default TableCard;
