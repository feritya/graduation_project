// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Adisyon from "./pages/Adisyon";

// Geçici boş bileşenler (ileride sayfalar oluşturulacak)
const MasaDuzeni = () => <h2>Masa Düzeni Sayfası</h2>;
const Rapor = () => <h2>Rapor Sayfası</h2>;
const Stok = () => <h2>Stok Sayfası</h2>;
const Yardim = () => <h2>Yardım Sayfası</h2>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/adisyon" element={<Adisyon />} />
      <Route path="/masalar" element={<MasaDuzeni />} />
      <Route path="/rapor" element={<Rapor />} />
      <Route path="/stok" element={<Stok />} />
      <Route path="/yardim" element={<Yardim />} />
    </Routes>
  );
}

export default App;
