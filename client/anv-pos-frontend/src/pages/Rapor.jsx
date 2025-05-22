// src/pages/Rapor.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Rapor.css";

const Rapor = () => {
  const [activeTab, setActiveTab] = useState("daily");
  const [reportData, setReportData] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState("");

  const fetchDailyReport = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/reports/daily/");
      setReportData(res.data);
    } catch (err) {
      console.error("Günlük rapor hatası:", err);
    }
  };

  const fetchMonthlyReport = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/reports/monthly/?month=${selectedMonth}`
      );
      setReportData(res.data);
    } catch (err) {
      console.error("Aylık rapor hatası:", err);
    }
  };

  const fetchRangeReport = async () => {
    try {
      const formattedStart = startDate.toISOString().split("T")[0];
      const formattedEnd = endDate.toISOString().split("T")[0];
      const res = await axios.get(
        `http://127.0.0.1:8000/api/reports/custom/?start=${formattedStart}&end=${formattedEnd}`
      );
      setReportData(res.data);
    } catch (err) {
      console.error("Tarih aralığı raporu hatası:", err);
    }
  };

  useEffect(() => {
    if (activeTab === "daily") fetchDailyReport();
  }, [activeTab]);

  const renderReport = () => {
    if (!reportData) return null;
    const products = Array.isArray(reportData.products) ? reportData.products : [];

    return (

      <div className="rapor-output">
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

    );
  };

  return (
    <div className="rapor-container">
      <div className="rapor-sidebar">
        <button
          className={activeTab === "daily" ? "active" : ""}
          onClick={() => setActiveTab("daily")}
        >
          Günlük Rapor
        </button>

        <button
          className={activeTab === "monthly" ? "active" : ""}
          onClick={() => setActiveTab("monthly")}
        >
          Aylık Rapor
        </button>

        <button
          className={activeTab === "range" ? "active" : ""}
          onClick={() => setActiveTab("range")}
        >
          Tarih Seç
        </button>
      </div>

      <div className="rapor-content">
        {activeTab === "daily" && renderReport()}

        {activeTab === "monthly" && (
          <div>
            <select
              onChange={(e) => setSelectedMonth(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                Ay Seçin
              </option>
              <option value="1">Ocak</option>
              <option value="2">Şubat</option>
              <option value="3">Mart</option>
              <option value="4">Nisan</option>
              <option value="5">Mayıs</option>
              <option value="6">Haziran</option>
              <option value="7">Temmuz</option>
              <option value="8">Ağustos</option>
              <option value="9">Eylül</option>
              <option value="10">Ekim</option>
              <option value="11">Kasım</option>
              <option value="12">Aralık</option>
            </select>
            <button onClick={fetchMonthlyReport}>Raporu Getir</button>
            {renderReport()}
          </div>
        )}

        {activeTab === "range" && (
          <div>
            <div className="date-picker-wrapper">
              <label>Başlangıç Tarihi:</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="yyyy-MM-dd"
                portalId="datepicker-portal"
                popperPlacement="bottom-start"
              />
              <label>Bitiş Tarihi:</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="yyyy-MM-dd"
                portalId="datepicker-portal"
                popperPlacement="bottom-start"
              />
              <button onClick={fetchRangeReport}>Raporu Getir</button>
            </div>
            {renderReport()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rapor;
