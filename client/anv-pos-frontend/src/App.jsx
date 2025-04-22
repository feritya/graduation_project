import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './pages/home.jsx';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Adisyon from './pages/Adisyon.jsx';
import Tables from './pages/Tables.jsx';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/adisyon" element={<Adisyon />} />
        <Route path="/masalar" element={<Home />} />
        {/* <Route path="/masalar" element={<Tables />} /> */}



      </Routes>
    </BrowserRouter>
  );
}

export default App;