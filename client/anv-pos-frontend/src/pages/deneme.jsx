// src/pages/Rapor.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Rapor.css";

const Rapor = () => {
  const [activeTab, setActiveTab] = useState("gunluk");
  const [reportData, setReportData] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [downloadUrl, setDownloadUrl] = useState(null);

  const fetchGunlukRapor = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/reports/daily/");
    setReportData(res.data);
    setDownloadUrl(null);
  };

  const fetchAylikRapor = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/reports/monthly/");
    setReportData(res.data);
    setDownloadUrl("http://127.0.0.1:8000/api/reports/monthly/download/");
  };

  const fetchTarihRapor = async () => {
    if (!startDate || !endDate) {
      alert("Lütfen tarih aralığını girin.");
      return;
    }

    try {
      const res = await axios.get("http://127.0.0.1:8000/api/reports/date-range/", {
        params: { start: startDate, end: endDate },
      });
      setReportData(res.data);
      setDownloadUrl(
        `http://127.0.0.1:8000/api/reports/date-range/download/?start=${startDate}&end=${endDate}`
      );
    } catch (err) {
      alert("Tarih aralığı geçersiz.");
    }
  };

  useEffect(() => {
    if (activeTab === "gunluk") fetchGunlukRapor();
    else if (activeTab === "aylik") fetchAylikRapor();
  }, [activeTab]);

  return (
    <div className="rapor-container">
      <div className="rapor-sidebar">
        <button onClick={() => setActiveTab("gunluk")}>Günlük Rapor</button>
        <button onClick={() => setActiveTab("aylik")}>Aylık Rapor</button>
        <button onClick={() => setActiveTab("tarih")}>Tarihe Göre Rapor</button>
      </div>

      <div className="rapor-content">
        {activeTab === "tarih" && (
          <div className="date-inputs">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <button onClick={fetchTarihRapor}>Raporu Getir</button>
          </div>
        )}

        {reportData && (
          <div>
            <h3>Toplam Gelir: {reportData.total_revenue} TL</h3>
            <h4>Toplam Ürün: {reportData.total_items_sold}</h4>
            <ul>
              {reportData.top_products.map((item, index) => (
                <li key={index}>
                  {item.product__name || item.product} - {item.sold} adet
                </li>
              ))}
            </ul>

          </div>
        )}
      </div>
    </div>
  );
};

export default Rapor;
