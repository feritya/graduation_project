// src/pages/Yardim.jsx
import React, { useState } from "react";
import "./Yardim.css";

const Yardim = () => {
  const [aktifSekme, setAktifSekme] = useState("genel");

  const sekmeler = [
    { id: "genel", baslik: "Genel Bilgiler" },
    { id: "adisyon", baslik: "Adisyon" },
    { id: "masa", baslik: "Masa Düzeni" },
    { id: "stok", baslik: "Stok Yönetimi" },
    { id: "rapor", baslik: "Raporlama" },
    { id: "iletisim", baslik: "İletişim" },
  ];

  const icerikler = {
    genel: (
      <div>
        <h2>Program Hakkında</h2>
        <p>
          Bu uygulama, restoran ve kafe gibi işletmelerin günlük operasyonlarını
          kolaylaştırmak amacıyla geliştirilmiştir. Adisyon takibi, masa düzeni
          yönetimi, stok kontrolü ve detaylı raporlama gibi özellikler sunar.
        </p>
      </div>
    ),
    adisyon: (
      <div>
        <h2>Adisyon</h2>
        <p>
          Adisyon modülü, siparişlerin alınması ve yönetilmesi için kullanılır.
          Yeni sipariş ekleyebilir, mevcut siparişleri güncelleyebilir ve ödeme
          işlemlerini gerçekleştirebilirsiniz.
        </p>
      </div>
    ),
    masa: (
      <div>
        <h2>Masa Düzeni</h2>
        <p>
          Masa düzeni bölümü, restoranınızdaki masa yerleşimini görsel olarak
          yönetmenizi sağlar. Masaları ekleyebilir, silebilir veya
          konumlandırabilirsiniz.
        </p>
      </div>
    ),
    stok: (
      <div>
        <h2>Stok Yönetimi</h2>
        <p>
          Stok yönetimi modülü ile ürünlerinizi ve kategorilerinizi
          yönetebilirsiniz. Yeni ürün ekleyebilir, mevcut ürünleri
          güncelleyebilir, stok miktarlarını artırabilir veya azaltabilirsiniz.
          Ayrıca, stok seviyesi azalan ürünler şeffaf kırmızı renkle
          vurgulanır.
        </p>
      </div>
    ),
    rapor: (
      <div>
        <h2>Raporlama</h2>
        <p>
          Raporlama bölümü, günlük, aylık veya belirli tarih aralıklarındaki
          satış verilerinizi görüntülemenizi sağlar. Satılan ürünler ve toplam
          gelir gibi bilgiler sunulur.
        </p>
      </div>
    ),
    iletisim: (
      <div>
        <h2>İletişim</h2>
        <p>
          Herhangi bir sorunuz veya öneriniz varsa, lütfen bizimle iletişime
          geçin:
        </p>
        <ul>
          <li>
            <strong>E-posta:</strong>{" "}
            <a href="mailto:ornekmail@example.com">yasarferit13@gmail.com</a>
          </li>
          <li>
            <strong>Telefon:</strong> +90 543 210 0123
          </li>
        </ul>
      </div>
    ),
  };

  return (
    <div className="yardim-container">
      <h1>Yardım Sayfası</h1>
      <div className="sekme-basliklari">
        {sekmeler.map((sekme) => (
          <button
            key={sekme.id}
            className={aktifSekme === sekme.id ? "aktif" : ""}
            onClick={() => setAktifSekme(sekme.id)}
          >
            {sekme.baslik}
          </button>
        ))}
      </div>
      <div className="sekme-icerik">{icerikler[aktifSekme]}</div>
    </div>
  );
};

export default Yardim;
