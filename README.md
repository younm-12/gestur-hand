# AI Vision Tracking - Hand & Face Tracking with 3D Visualization

Aplikasi web real-time untuk tracking tangan dan wajah menggunakan MediaPipe dan visualisasi 3D dengan Three.js.

> **📝 Note**: Jika Anda melihat demo placeholder di preview Figma Make, ini adalah **perilaku normal**. Fitur tracking penuh akan bekerja sempurna ketika di-deploy ke Vercel. Lihat [PREVIEW_NOTE.md](PREVIEW_NOTE.md) untuk penjelasan detail.

## Fitur

### 🖐️ Hand Tracking
- Deteksi hingga 2 tangan secara bersamaan
- 21 landmark points per tangan
- Visualisasi real-time dengan koneksi antar landmark
- Akurasi tinggi untuk gesture recognition

### 👤 Face Tracking 3D
- Deteksi 468 facial landmarks
- Visualisasi 3D mesh real-time
- Kontrol interaktif (rotate, zoom, pan)
- Split view: kamera + model 3D

## Teknologi

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **MediaPipe Tasks Vision** - AI/ML untuk tracking
- **Three.js** - 3D rendering
- **React Three Fiber** - React wrapper untuk Three.js
- **Vite** - Build tool

## Instalasi

```bash
# Install dependencies
pnpm install

# Run development server (gunakan preview surface, bukan localhost)
# Server sudah berjalan otomatis di environment Make
```

## Deploy ke Vercel

### Opsi 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel
```

### Opsi 2: Deploy via Vercel Dashboard

1. Push code ke GitHub repository
2. Buka [Vercel Dashboard](https://vercel.com/dashboard)
3. Klik "Add New Project"
4. Import repository GitHub Anda
5. Vercel akan auto-detect Vite project
6. Klik "Deploy"

### Opsi 3: Deploy via GitHub Integration

1. Connect repository ke Vercel
2. Setiap push ke main branch akan auto-deploy
3. Pull requests akan mendapat preview deployment

## Build Settings untuk Vercel

Vercel akan menggunakan konfigurasi dari `vercel.json`:

- **Build Command**: `pnpm build`
- **Output Directory**: `dist`
- **Install Command**: `pnpm install`
- **Framework**: Vite

## Environment Variables

Tidak ada environment variables yang diperlukan. Semua processing dilakukan di browser.

## Browser Requirements

- Modern browser dengan support untuk:
  - WebRTC (untuk akses kamera)
  - WebGL (untuk rendering 3D)
  - Web Assembly (untuk MediaPipe)
  
Recommended browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14.1+

## Privacy & Security

- ✅ Semua processing dilakukan secara lokal di browser
- ✅ Tidak ada data yang dikirim ke server
- ✅ Akses kamera hanya digunakan untuk tracking
- ✅ Tidak ada penyimpanan data

## Cara Menggunakan

1. Buka aplikasi di browser
2. Pilih mode: Hand Tracking atau Face Tracking 3D
3. Izinkan akses kamera saat diminta
4. Untuk Hand Tracking: tunjukkan tangan Anda ke kamera
5. Untuk Face Tracking: posisikan wajah Anda di depan kamera
6. Nikmati visualisasi real-time!

## Troubleshooting

### Kamera tidak terdeteksi
- Pastikan browser memiliki izin akses kamera
- Check browser console untuk error messages
- Pastikan tidak ada aplikasi lain yang menggunakan kamera

### Model loading lambat
- Koneksi internet diperlukan untuk download model pertama kali
- Model di-cache setelah download pertama
- File model sekitar 10-20MB

### 3D visualization lag
- Pastikan browser support WebGL
- Close aplikasi lain yang menggunakan GPU
- Reduce browser zoom level

## Development

```bash
# Format code (jika ada prettier)
pnpm format

# Type check
pnpm tsc --noEmit

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## License

MIT

## Credits

- MediaPipe by Google
- Three.js
- React Three Fiber & Drei
- Lucide React Icons
