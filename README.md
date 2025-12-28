# Aplikasi Mobile Laboratorium IoT ITB (TuBes PAWM)

[![Status Proyek](https://img.shields.io/badge/Status-Development-blue.svg)](https://github.com/GhazyUrbayani/PAWM-IoTLabITB)
[![Tech Stack](https://img.shields.io/badge/Stack-Expo_React_Native-black?logo=expo)](https://expo.dev/)
[![Database](https://img.shields.io/badge/Database-Supabase-green?logo=supabase)](https://supabase.io/)

Aplikasi mobile untuk Laboratorium Riset IoT ITB, dikembangkan sebagai Tugas Besar mata kuliah Pengembangan Aplikasi Web dan Mobile (PAWM).

## ✨ Fitur Utama

- **Panel Admin:** Dashboard admin untuk mengelola member, proyek, publikasi
- **Autentikasi:** Login dengan Supabase Auth
- **CRUD:** Fungsionalitas Create, Read, Update, Delete untuk:
  - Proyek & Riset
  - Anggota Lab (Member)
  - Publikasi

## 🛠️ Tumpukan Teknologi (Tech Stack)

- **Framework**: Expo SDK 54 (React Native)
- **Bahasa**: TypeScript
- **Database (BaaS)**: Supabase (PostgreSQL)
- **Autentikasi**: Supabase Auth
- **Navigation**: Expo Router (file-based routing)

## ⚙️ Pengaturan Lokal

### 1. Setup Environment Variables

Buat file `.env` di root proyek dengan kredensial Supabase:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://<id-proyek-kamu>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<kunci_anon_publik_kamu>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Jalankan Aplikasi

```bash
npx expo start
```

Setelah itu, Anda dapat membuka aplikasi di:

- [Android Emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go) di device fisik

## 📁 Struktur Proyek

```
├── app/                  # Halaman aplikasi (file-based routing)
│   ├── (tabs)/          # Tab navigation screens
│   └── admin/           # Admin screens
├── assets/              # Gambar dan aset statis
├── components/          # Komponen React Native
├── constants/           # Konstanta (theme, colors)
├── hooks/               # Custom hooks
├── lib/                 # Library utilities (Supabase client)
└── scripts/             # Scripts helper
```

## 📜 License

MIT License - lihat file [LICENSE](LICENSE) untuk detail.
