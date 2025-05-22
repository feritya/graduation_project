// src/pages/Stok.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Stok.css";

const API_URL = "http://127.0.0.1:8000/api";

const Stok = () => {
  const [urunler, setUrunler] = useState([]);
  const [kategoriler, setKategoriler] = useState([]);
  const [yeniUrun, setYeniUrun] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
  });
  const [yeniKategori, setYeniKategori] = useState({ name: "" });

  useEffect(() => {
    fetchUrunler();
    fetchKategoriler();
  }, []);

  const fetchUrunler = async () => {
    try {
      const res = await axios.get(`${API_URL}/products/`);
      setUrunler(res.data);
    } catch (err) {
      console.error("Ürün verileri alınamadı:", err);
    }
  };

  const fetchKategoriler = async () => {
    try {
      const res = await axios.get(`${API_URL}/categories/`);
      setKategoriler(res.data);
    } catch (err) {
      console.error("Kategori verileri alınamadı:", err);
    }
  };

  const urunEkle = async () => {
    try {
      await axios.post(`${API_URL}/products/`, yeniUrun);
      setYeniUrun({ name: "", price: "", stock: "", category: "" });
      fetchUrunler();
    } catch (err) {
      console.error("Ürün eklenemedi:", err);
    }
  };

  const urunSil = async (id) => {
    try {
      await axios.delete(`${API_URL}/products/${id}/`);
      fetchUrunler();
    } catch (err) {
      console.error("Ürün silinemedi:", err);
    }
  };

  const urunGuncelle = async (id, updatedUrun) => {
    try {
      await axios.put(`${API_URL}/products/${id}/`, updatedUrun);
      fetchUrunler();
    } catch (err) {
      console.error("Ürün güncellenemedi:", err);
    }
  };

  const stokGuncelle = async (id, miktarDegisimi) => {
    try {
      const urun = urunler.find((u) => u.id === id);
      const updatedUrun = {
        ...urun,
        stock: urun.stock + miktarDegisimi,
      };
      await urunGuncelle(id, updatedUrun);
    } catch (err) {
      console.error("Stok güncellenemedi:", err);
    }
  };

  const kategoriEkle = async () => {
    try {
      await axios.post(`${API_URL}/categories/`, yeniKategori);
      setYeniKategori({ name: "" });
      fetchKategoriler();
    } catch (err) {
      console.error("Kategori eklenemedi:", err);
    }
  };

  return (
    <div className="stok-container">
      <h2>Stok Yönetimi</h2>

      {/* Ürün Ekleme Formu */}
      <div className="form-section">
        <h3>Yeni Ürün Ekle</h3>
        <input
          type="text"
          placeholder="Ürün Adı"
          value={yeniUrun.name}
          onChange={(e) => setYeniUrun({ ...yeniUrun, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Fiyat"
          value={yeniUrun.price}
          onChange={(e) => setYeniUrun({ ...yeniUrun, price: e.target.value })}
        />
        <input
          type="number"
          placeholder="Stok Miktarı"
          value={yeniUrun.stock}
          onChange={(e) => setYeniUrun({ ...yeniUrun, stock: e.target.value })}
        />
        <select
          value={yeniUrun.category}
          onChange={(e) =>
            setYeniUrun({ ...yeniUrun, category: e.target.value })
          }
        >
          <option value="">Kategori Seçin</option>
          {kategoriler.map((kategori) => (
            <option key={kategori.id} value={kategori.id}>
              {kategori.name}
            </option>
          ))}
        </select>
        <button onClick={urunEkle}>Ürün Ekle</button>
      </div>

      {/* Kategori Ekleme Formu */}
      <div className="form-section">
        <h3>Yeni Kategori Ekle</h3>
        <input
          type="text"
          placeholder="Kategori Adı"
          value={yeniKategori.name}
          onChange={(e) =>
            setYeniKategori({ ...yeniKategori, name: e.target.value })
          }
        />
        <button onClick={kategoriEkle}>Kategori Ekle</button>
      </div>

      {/* Ürün Listesi */}
      <table className="stok-tablosu">
        <thead>
          <tr>
            <th>Ürün Adı</th>
            <th>Kategori</th>
            <th>Fiyat (₺)</th>
            <th>Stok Miktarı</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {urunler.map((urun) => (
            <tr
              key={urun.id}
              className={urun.stock < 5 ? "stok-az" : ""}
            >
              <td>{urun.name}</td>
              <td>
                {
                  kategoriler.find((kategori) => kategori.id === urun.category)
                    ?.name
                }
              </td>
              <td>{parseFloat(urun.price).toFixed(2)}</td>
              <td>{urun.stock}</td>
              <td className="action-buttons">
                <button onClick={() => stokGuncelle(urun.id, 1)}>+</button>
                <button onClick={() => stokGuncelle(urun.id, -1)}>-</button>
                <button onClick={() => urunSil(urun.id)}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Stok;
