# 🔬 Aplikasi Mobile Laboratorium IoT ITB

[![Status Proyek](https://img.shields.io/badge/Status-Development-blue.svg)](https://github.com/KevinAzrazz/IoTLabITB-Mobile)
[![Tech Stack](https://img.shields.io/badge/Stack-Expo_React_Native-black?logo=expo)](https://expo.dev/)
[![Database](https://img.shields.io/badge/Database-Supabase-green?logo=supabase)](https://supabase.io/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/Node-%3E%3D18.0-green.svg)](https://nodejs.org/)

Aplikasi mobile untuk **Laboratorium Riset IoT ITB** yang menyediakan platform informasi komprehensif dan dashboard administratif untuk mengelola data laboratorium. Dikembangkan dengan **Expo React Native** dan **Supabase** sebagai backend, aplikasi ini memungkinkan user umum untuk menjelajahi informasi lab serta memberikan admin panel untuk manajemen konten.

---

## ✨ Fitur Utama

### 🌐 Public Features
- **Home:** Halaman utama dengan hero section, about lab, history, member showcase, dan project showcase
- **Explore (Kontak):** Halaman kontak dengan form message, contact information, dan direct linking (email, phone, maps)
- **Login:** Halaman autentikasi khusus admin dengan email & password validation
- **Responsive Design:** Dukungan light/dark mode dan responsive di semua ukuran layar

### 🔐 Admin Features
- **Dashboard:** Overview statistik lab (total projects, members, publications, partners)
- **Activity Logs:** Riwayat aktivitas admin dengan timestamp
- **Manajemen Member:** Create, Read, Update, Delete member lab dengan profile picture
- **Manajemen Proyek:** CRUD projects dengan kategori (S1, S2, S3), image cover, dan deskripsi
- **Manajemen Publikasi:** CRUD publikasi ilmiah dengan authors, year, dan URL reference
- **Manajemen Partner:** CRUD mitra kerjasama dengan logo upload
- **Pengaturan Konten:** Edit hero title/subtitle, about section, history, dan contact information

---

## 🛠️ Teknologi

| Kategori | Teknologi |
|----------|-----------|
| **Framework** | Expo SDK 54 (React Native) |
| **Bahasa** | TypeScript |
| **State Management** | React Hooks |
| **Navigation** | Expo Router (file-based routing) |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth |
| **Storage** | Supabase Storage |
| **Styling** | React Native StyleSheet |
| **UI Icons** | Expo Vector Icons |
| **Linting** | ESLint |

---

## 📦 Prasyarat

Sebelum memulai, pastikan Anda memiliki:

- **Node.js** >= 18.0 ([Download](https://nodejs.org/))
- **npm** atau **yarn** (biasanya sudah include dengan Node.js)
- **Git** untuk version control
- **Supabase Account** ([Buat gratis](https://supabase.com/))
- **Code Editor** (VS Code recommended)

**Optional tapi disarankan:**
- Expo Go app di smartphone untuk testing (iOS: App Store, Android: Google Play)
- Android Studio atau Xcode untuk emulator testing

---

## ⚙️ Setup Lokal

### Step 1: Clone Repository

```bash
git clone https://github.com/KevinAzrazz/IoTLabITB-Mobile.git
cd IoTLabITB-Mobile
```

### Step 2: Setup Environment Variables

Buat file `.env` di root project:

```bash
# Di root folder, buat file .env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Cara mendapatkan credentials:**

1. Login ke [Supabase Dashboard](https://app.supabase.com/)
2. Pilih project Anda
3. Pergi ke **Settings > API**
4. Copy **Project URL** dan **Anon Key**
5. Paste ke file `.env`

### Step 3: Install Dependencies

```bash
npm install
```

Atau jika menggunakan yarn:

```bash
yarn install
```

### Step 4: Verifikasi Setup

Cek apakah semua terinstall dengan benar:

```bash
npm list react react-native expo
```

---

## 🚀 Menjalankan Aplikasi

### Opsi 1: Expo Go (Recommended untuk Pemula)

Paling mudah, tidak perlu emulator:

```bash
npm start
```

Kemudian:
- **iOS:** Buka Camera app → scan QR code
- **Android:** Buka Expo Go app → scan QR code

### Opsi 2: Web Browser

```bash
npm run web
```

Aplikasi akan otomatis membuka di `http://localhost:8081`

### Opsi 3: Android Emulator

Perlu Android Studio terinstall:

```bash
npm run android
```

### Opsi 4: iOS Simulator

Hanya untuk macOS dengan Xcode:

```bash
npm run ios
```

### Menjalankan dengan Expo CLI Directly

```bash
# Start dan tampikin menu
npx expo start

# Press 'w' untuk web
# Press 'a' untuk Android
# Press 'i' untuk iOS
```

---

## 📁 Struktur Proyek

```
IoTLabITB-Mobile/
├── app/                              
│   ├── (tabs)/                       
│   │   ├── _layout.tsx              
│   │   ├── index.tsx                
│   │   ├── explore.tsx              
│   │   └── login.tsx                
│   ├── admin/                       
│   │   ├── _layout.tsx         
│   │   ├── index.tsx                
│   │   ├── members.tsx             
│   │   ├── projects.tsx             
│   │   ├── publications.tsx         
│   │   ├── partners.tsx             
│   │   └── settings.tsx             
│   ├── modal.tsx                   
│   └── _layout.tsx                  
│
├── assets/                           
│   └── images/                       
│       ├── icon.png
│       ├── splash-icon.png
│       ├── android-icon-*.png
│       └── favicon.png
│
├── components/                      
│   ├── external-link.tsx
│   ├── haptic-tab.tsx
│   ├── hello-wave.tsx
│   ├── parallax-scroll-view.tsx
│   ├── themed-text.tsx
│   ├── themed-view.tsx
│   └── ui/                         
│       ├── collapsible.tsx
│       └── icon-symbol.tsx
│
├── constants/                        
│   └── theme.ts                    
│
├── hooks/                            
│   ├── use-color-scheme.ts          
│   ├── use-color-scheme.web.ts      
│   └── use-theme-color.ts           
│
├── lib/                              
│   └── supabase.ts                   
│
├── scripts/                        
│   └── reset-project.js            
│
├── app.json                          
├── package.json                      
├── tsconfig.json                     
├── eslint.config.js                  
├── .env                            
├── .gitignore                       
├── README.md                       
└── LICENSE                           
```

---

## 📱 Fitur Halaman

### **1. Home Screen** (`app/(tabs)/index.tsx`)
- Hero section dengan background image dan gradient overlay
- About section dengan deskripsi lab
- History section dengan informasi sejarah lab
- Member carousel dengan profile cards
- Project grid dengan filter kategori (S1, S2, S3)
- Publication list dengan year badges
- Partner showcase section

### **2. Contact Screen** (`app/(tabs)/explore.tsx`)
- Hero title "Hubungi Kami" dengan subtitle
- Contact form (Name, Email, Subject, Message)
- Success alert notification setelah submit
- Contact information cards (Address, Email, Phone)
- Direct linking: email client, phone dialer, Google Maps
- Map placeholder dengan button buka Google Maps

### **3. Login Screen** (`app/(tabs)/login.tsx`)
- Logo header dengan branding
- Email & password input fields
- Show/hide password toggle
- Error alert dengan pesan spesifik
- Loading state saat proses authentication
- Success notification redirect ke admin panel

### **4. Admin Dashboard** (`app/admin/index.tsx`)
- Welcome message untuk logged-in admin
- Statistics cards (Projects, Members, Publications, Partners)
- Recent activity logs dengan timestamp
- Tips section untuk best practices
- Logout button

### **5. Members Management** (`app/admin/members.tsx`)
- List members dalam card format
- Search functionality
- Profile picture display / fallback
- Edit dan Delete buttons (UI ready)
- Add button untuk member baru (UI ready)
- Refresh control untuk pull-to-refresh

### **6. Projects Management** (`app/admin/projects.tsx`)
- List projects dalam card format
- Filter by category (S1, S2, S3)
- Project image, title, description, category badge
- Edit dan Delete buttons (UI ready)
- Add button untuk project baru (UI ready)
- Search functionality

### **7. Publications Management** (`app/admin/publications.tsx`)
- List publikasi dalam card format
- Publication title, authors, year
- URL link button (direct linking)
- Edit dan Delete buttons (UI ready)
- Add button untuk publikasi baru (UI ready)
- Search dan filter by year

### **8. Partners Management** (`app/admin/partners.tsx`)
- List partner dengan logo display
- Partner name dan branding
- Edit dan Delete buttons (UI ready)
- Add button untuk partner baru (UI ready)

### **9. Content Settings** (`app/admin/settings.tsx`)
- Edit hero title & subtitle
- Edit about title & content
- Edit about image URL
- Edit history content & image
- Edit contact email, phone, address
- Save changes functionality

---

## 🗄️ Database Schema

### Tables di Supabase:

#### **1. members**
```sql
CREATE TABLE members (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  role VARCHAR NOT NULL,
  image_url VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **2. projects**
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  category VARCHAR NOT NULL, -- S1, S2, S3
  image_url VARCHAR,
  slug VARCHAR UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **3. publications**
```sql
CREATE TABLE publications (
  id UUID PRIMARY KEY,
  title VARCHAR NOT NULL,
  authors VARCHAR NOT NULL,
  year INTEGER,
  url VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **4. partners**
```sql
CREATE TABLE partners (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  logo_url VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **5. page_content**
```sql
CREATE TABLE page_content (
  id UUID PRIMARY KEY,
  key VARCHAR UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Pre-fill dengan keys:
-- hero_title, hero_subtitle, hero_image
-- about_title, about_content, about_image
-- history_content, history_image
-- contact_email, contact_phone, contact_address
```

#### **6. activity_logs** (optional)
```sql
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  action VARCHAR NOT NULL, -- CREATE, UPDATE, DELETE
  entity_type VARCHAR NOT NULL, -- member, project, etc
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 👥 Panduan Penggunaan

### Untuk User Umum

1. **Buka Aplikasi**
   - Jalankan aplikasi melalui salah satu metode di atas
   
2. **Jelajahi Home Screen**
   - Scroll melihat informasi lengkap tentang lab
   - Lihat featured projects dengan filter kategori
   - Lihat member tim dan publikasi

3. **Hubungi Lab**
   - Pergi ke tab "Kontak"
   - Isi form pesan dengan detail Anda
   - Atau gunakan direct links (email/phone/maps)

### Untuk Admin

1. **Login**
   - Pergi ke tab "Login"
   - Input email dan password admin
   - Akan redirect ke admin dashboard jika berhasil

2. **Dashboard Admin**
   - View statistik lab
   - Lihat recent activities
   - Akses menu management (members, projects, dll)

3. **Mengelola Data**
   - **Members:** Edit member info, hapus member
   - **Projects:** Edit project details, manage images
   - **Publications:** Update publikasi, add links
   - **Partners:** Manage kerjasama partner

4. **Edit Konten**
   - Buka tab "Settings"
   - Edit hero section, about, history
   - Update contact information
   - Click save untuk simpan perubahan

5. **Logout**
   - Klik button "Keluar dari Admin"
   - Akan kembali ke home screen

---

## 🆘 Troubleshooting

### Masalah: "Module not found" error

**Solusi:**
```bash
# Clear cache dan reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Masalah: Expo server tidak start

**Solusi:**
```bash
# Restart Expo
npm start -- --reset-cache

# Atau kill dan restart port
npx expo start -c
```

### Masalah: Supabase connection error

**Solusi:**
1. Pastikan `.env` file sudah dibuat dengan benar
2. Verifikasi Supabase URL dan API key valid
3. Check network connection
4. Pastikan Supabase project aktif

### Masalah: Dark mode tidak bekerja

**Solusi:**
- Restart aplikasi
- Cek device system color scheme
- Clear app cache

### Masalah: Image tidak load di Supabase

**Solusi:**
1. Verifikasi image URL valid dan accessible
2. Check Supabase Storage permissions
3. Ensure CORS enabled di Supabase
4. Try upload ulang image

### Masalah: Form tidak bisa submit

**Solusi:**
1. Pastikan semua field terisi
2. Check network connection
3. Verify Supabase credentials
4. Check browser/app permissions

---

## 👨‍💼 Author

**Kevin Azra (18223029)**
**Muhammad Ghazy Urbayani (18223093)**


---