# MAVPS - Web Tabanlı Kafe ve Restoran Adisyon Sistemi

MAVPS (Medeniyet Adisyon ve POS Sistemi), kafe ve restoran işletmelerinin dijitalleşmesine yardımcı olmak amacıyla geliştirilen, modern ve kullanıcı dostu bir web tabanlı POS (Point of Sale) ve adisyon sistemidir. React, Django REST Framework ve PostgreSQL kullanılarak MVP modeli geliştirilmiştir.

## 🚀 Projenin Amacı

Günümüzde kafe ve restoranlarda sipariş takibi, stok yönetimi ve masa düzeni gibi işlemler manuel yürütüldüğünde hatalara yol açabilmektedir. MAVPS, bu süreci dijitalleştirerek:

- Sipariş yönetimini kolaylaştırmayı
- Stok ve masa takibini dijital hale getirmeyi
- Raporlamaları anlık olarak sunmayı
- Müşteri memnuniyetini artırmayı
amaçlamaktadır.

## 🧰 Kullanılan Teknolojiler

- **Frontend**: React.js
- **Backend**: Django REST Framework (DRF)
- **Veritabanı**: PostgreSQL (geliştirme sürecinde SQLite kullanılmıştır)
- **API İletişimi**: Axios
- **JWT ile Authentication**
- **Postman** (Test ve API denetimi)

## 📦 Özellikler

- 💬 Sipariş alma ve yönetme
- 📦 Stok takibi ve ürün/kategori yönetimi
- 🪑 Masa düzenleme ve adisyon bağlantısı
- 📊 Günlük, aylık ve özel tarih aralığında rapor oluşturma
- 📱 Çoklu cihaz desteği (mobil, tablet, bilgisayar)
- 📚 Yardım ve kullanıcı rehberi ekranları
- 🧾 Kullanıcı yetkilendirme ve giriş sistemi

## 📸 Ekran Görüntüleri

> Ekran görüntüleri için `ekler/` klasörüne veya `docs/` klasörüne bakınız.

## ⚙️ Kurulum

1. Depoyu klonlayın:
git clone https://github.com/feritya/graduation_project.git
cd graduation_project

2. Backend için sanal ortam oluşturun ve bağımlılıkları kurun:
cd backend
python -m venv venv
source venv/bin/activate  # Windows için: venv\Scripts\activate
pip install -r requirements.txt

3. Veritabanını oluşturun:
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser

4. Backend sunucusunu başlatın:
python manage.py runserver

5. Frontend klasörüne geçip React uygulamasını başlatın:
cd ../frontend
npm install
npm start

📅 Geliştirme Takvimi (Özet)
Gereksinim analizi: 15 gün

Sistem tasarımı: 15 gün

Backend geliştirme: 45 gün

Frontend geliştirme: 60 gün

Test ve hata giderme: 15 gün

MVP sürüm ve testler: 2 ay

💡 Gelecek Geliştirmeler
📱 Mobil uygulama sürümü (React Native)

💳 Kartlı ödeme ve QR menü sistemleri

🌐 Çoklu dil desteği

🧠 Gelişmiş raporlama ve analiz ekranları

🔒 Kullanıcı rol yönetimi (garson, yönetici, kasa vb.)

📬 İletişim
Projeye katkı sağlamak veya sorun bildirmek için lütfen Issues sayfasını kullanın veya iletişim için:

E-posta: yasarferit13@gmail.com

Web: mavps.com.tr //kllanımda değil henüz 

📄 Lisans
Bu proje MIT Lisansı ile lisanslanmıştır. Daha fazla bilgi için LICENSE dosyasına göz atabilirsiniz.