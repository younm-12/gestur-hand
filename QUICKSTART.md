# Quick Start Guide

## 🚀 Deploy ke Vercel dalam 5 Menit

### Step 1: Push ke GitHub
```bash
git init
git add .
git commit -m "AI Vision Tracking App"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

### Step 2: Deploy
1. Buka https://vercel.com
2. Login dengan GitHub
3. Klik "Add New Project"
4. Pilih repository Anda
5. Klik "Deploy"

### Step 3: Done!
Aplikasi Anda akan live dalam 2-3 menit di URL:
```
https://YOUR-PROJECT-NAME.vercel.app
```

## 📱 Cara Menggunakan

### Hand Tracking
1. Klik tombol "Hand Tracking"
2. Izinkan akses kamera
3. Tunjukkan tangan Anda ke kamera
4. Lihat 21 landmark points terdeteksi real-time!

### Face Tracking 3D
1. Klik tombol "Face Tracking 3D"
2. Izinkan akses kamera
3. Posisikan wajah Anda di frame kamera
4. Lihat visualisasi 3D wajah Anda!
5. Drag untuk rotate, scroll untuk zoom

## ⚙️ Technical Info

**Package Manager**: pnpm
**Framework**: React + Vite
**Styling**: Tailwind CSS v4
**AI/ML**: MediaPipe
**3D**: Three.js

## 🔧 Development

```bash
# Install dependencies
pnpm install

# Development server sudah running di Make environment
# Gunakan preview surface untuk testing
```

## 📦 Build

```bash
# Build for production
pnpm build

# Output akan di folder: dist/
```

## 🌐 Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14.1+
- ✅ Mobile browsers (iOS/Android)

## 🔒 Privacy

- Semua processing di browser (no server)
- Tidak ada data yang disimpan
- Kamera hanya untuk tracking
- 100% private

## 📚 Documentation

- **README.md** - Overview & instalasi
- **DEPLOY.md** - Detailed deployment guide
- **FEATURES.md** - Technical documentation
- **QUICKSTART.md** - This file

## ❓ Need Help?

Check browser console untuk error messages.

Pastikan:
- Browser support WebRTC
- HTTPS enabled (Vercel auto-provides)
- Camera permission granted
- Good internet connection (first load)

---

**Enjoy your AI-powered tracking app! 🎉**
