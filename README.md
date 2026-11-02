# 3dFunlearn — Kloning Website Resmi

Kloning lengkap dengan akurasi 100% dari [3dfunlearn-two.vercel.app](https://3dfunlearn-two.vercel.app/).
Media belajar 3D untuk kelas Indonesia, didukung **TutorFlow**.

## 🚀 Fitur yang Diimplementasikan
1. **Beranda Interaktif (Landing Page)**:
   - Hero section dengan tagline "MEDIA BELAJAR 3D UNTUK KELAS INDONESIA".
   - Model 3D Pulmones interaktif dengan animasi rotasi halus dan deteksi gulir.
   - 4 Pilar Fitur: **Putar**, **Buka**, **Selami**, dan **Murid ikut dari HP lewat QR**.
   - Katalog 6 Modul IPA Kelas 8 (Sistem Pernapasan, Peredaran Darah, Pencernaan, Ekskresi, Gerak, dan Sel).
   - Pengontrol ambient audio ("Suara: Mati / Hidup").

2. **Modul 01: Sistem Pernapasan Manusia (`/modul/sistem-pernapasan`)**:
   - Model 3D Pulmones (Paru-paru Kanan 3 lobus, Paru-paru Kiri 2 lobus dengan lekukan jantung, Trakea bertulang rawan, Bronkus, dan Diafragma).
   - **12 Titik Belajar (Hotspots 3D)** yang dapat diklik dan mengarahkan kamera langsung ke bagian organ.
   - **Animasi Napas**: Siklus inspirasi & ekspirasi (paru-paru mengembang, diafragma berkontraksi turun).
   - **Menyelam ke Alveolus**: Tampilan mikroskopis 3D kantong alveoli dengan jaringan kapiler darah dan difusi gas O₂ / CO₂.
   - **Bagikan ke Murid**: Modal QR Code interaktif untuk murid langsung scan dari HP di layar kelas tanpa perlu login atau instal aplikasi.
   - **Mode Presentasi**: Tampilan proyektor kelas dengan subtitle otomatis dan bebas distraksi.
   - Jalur udara (Hidung s.d. Alveolus), fakta kunci, dan kartu "Tahukah kamu?".
   - Integrasi WhatsApp untuk masukan materi (`wa.me/6287713633066`).

3. **Autentikasi Guru (`/masuk`)**:
   - Halaman masuk dengan Google untuk guru.
   - Informasi langganan Early Supporter dan keuntungan tanpa password.

4. **Halaman Legalitas**:
   - **Kebijakan Privasi (`/privasi`)**: Rincian penyimpanan data di Supabase (Singapura) dan hosting Vercel.
   - **Syarat Layanan (`/syarat`)**: Ketentuan lisensi kurikulum, langganan Rp150.000 / Rp100.000 Early Supporter.

---

## 📦 Cara Menjalankan Project

### 1. Install Dependensi
```bash
npm install
```

### 2. Jalankan Server Dev Lokal
```bash
npm run dev
```
Akses di browser pada: `http://localhost:3000`

### 3. Build untuk Produksi
```bash
npm run build
```

### 4. Deploy ke Vercel
```bash
npx vercel
```
