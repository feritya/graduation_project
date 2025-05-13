import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const tiles = [
    { label: 'ADİSYON', icon: '📅', path: '/adisyon' },
    { label: 'MASA DÜZENİ', icon: '🪑', path: '/masalar' },
    { label: 'RAPOR', icon: '📊', path: '/rapor' },
    { label: 'STOK', icon: '📦', path: '/stok' },
    { label: 'YARDIM', icon: '💡', path: '/yardim' }
  ];

  return (
    <div className="dashboard">
      <h2 className="title">
        <span className="bar"></span> Yönetici<br />Ana sayfası
      </h2>
      <div className="tile-container">
        {tiles.map((tile, index) => (
          <div key={index} className="tile" onClick={() => navigate(tile.path)}>
            <div className="tile-icon">{tile.icon}</div>
            <div className="tile-label">{tile.label}</div>
            <div className="tile-plus">＋</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
