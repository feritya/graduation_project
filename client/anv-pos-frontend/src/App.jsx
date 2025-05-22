import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Adisyon from './pages/Adisyon';
import MasaDuzeni from './pages/MasaDuzeni';
import Rapor from './pages/Rapor';
import Stok from './pages/Stok';
import Yardim from './pages/Yardim';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/adisyon" element={<Adisyon />} />
        <Route path="/masalar" element={<MasaDuzeni />} />
        <Route path="/rapor" element={<Rapor />} />
        <Route path="/stok/" element={<Stok />} />
        <Route path="/yardim" element={<Yardim />} />
      </Routes> 
    </Router>
  );
};

export default App;
  