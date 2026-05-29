# Panduan Deploy ke Vercel

## ⚠️ PENTING: Enable Full Features Sebelum Deploy

Saat ini, `src/app/App.tsx` dikonfigurasi untuk preview mode (menampilkan DemoPlaceholder). Untuk mengaktifkan fitur tracking penuh di production:

### Opsi 1: Gunakan Production Version (Recommended)

```bash
# Backup current App.tsx
cp src/app/App.tsx src/app/App.preview.tsx

# Enable production version with full features
cp src/app/App.production.tsx.example src/app/App.tsx
```

### Opsi 2: Manual Edit

Edit `src/app/App.tsx` dan tambahkan lazy loading:

```typescript
import { lazy, Suspense } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';

const HandTracking = lazy(() => 
  import('./components/HandTracking').then(m => ({ default: m.HandTracking }))
);

const FaceTracking = lazy(() => 
  import('./components/FaceTracking').then(m => ({ default: m.FaceTracking }))
);

// Replace DemoPlaceholder with:
<ErrorBoundary>
  <Suspense fallback={<LoadingSpinner />}>
    <HandTracking />
  </Suspense>
</ErrorBoundary>
```

**Setelah enable full features, lanjutkan dengan langkah deployment di bawah.**

---

## Persiapan

1. **Install pnpm** (jika belum)
   ```bash
   npm install -g pnpm
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Test build lokal**
   ```bash
   pnpm build
   ```

## Deploy ke Vercel - Cara Termudah

### Metode 1: Via Vercel Dashboard (Recommended)

1. **Push code ke GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Hand & Face Tracking App"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPO-NAME.git
   git push -u origin main
   ```

2. **Deploy via Vercel**
   - Buka https://vercel.com
   - Login dengan GitHub
   - Klik "Add New Project"
   - Pilih repository Anda
   - Vercel akan auto-detect settings:
     - Framework Preset: Vite
     - Build Command: `pnpm build`
     - Output Directory: `dist`
   - Klik "Deploy"
   - Tunggu 2-3 menit
   - ✅ Done! Aplikasi Anda live

### Metode 2: Via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   pnpm add -g vercel
   ```

2. **Login ke Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
   Ikuti prompt:
   - Set up and deploy? Y
   - Which scope? [pilih account Anda]
   - Link to existing project? N
   - Project name? [enter atau custom name]
   - In which directory? ./
   - Override settings? N

4. **Deploy production**
   ```bash
   vercel --prod
   ```

## Setelah Deploy

### URL yang Didapat

Anda akan mendapat 2 jenis URL:
- **Preview URL**: `https://project-name-xxx.vercel.app` (untuk testing)
- **Production URL**: `https://project-name.vercel.app` (URL utama)

### Custom Domain (Opsional)

1. Buka Vercel Dashboard
2. Pilih project Anda
3. Go to "Settings" > "Domains"
4. Add your custom domain
5. Update DNS settings sesuai instruksi Vercel

## Continuous Deployment

Setelah setup awal, setiap kali Anda push ke GitHub:
- Push ke `main` branch → auto deploy ke production
- Push ke branch lain → auto deploy preview

```bash
# Workflow normal
git add .
git commit -m "Add new feature"
git push

# Vercel akan auto-build dan deploy
```

## Environment Variables (Jika Diperlukan)

Jika di masa depan Anda perlu menambahkan API keys:

1. Buka Vercel Dashboard
2. Pilih project
3. Go to "Settings" > "Environment Variables"
4. Add variable name dan value
5. Pilih environment (Production, Preview, Development)
6. Redeploy untuk apply changes

## Monitoring & Analytics

### Check Build Logs
1. Buka Vercel Dashboard
2. Pilih deployment
3. Klik "View Build Logs"

### Check Performance
1. Go to "Analytics" tab di dashboard
2. Monitor:
   - Page load times
   - Unique visitors
   - Top pages

### Error Tracking
1. Go to "Logs" tab
2. Filter by error level
3. Real-time error monitoring

## Troubleshooting

### Build Failed

**Error: "Command failed: pnpm build"**
```bash
# Test build lokal dulu
pnpm install
pnpm build

# Check error messages
# Fix errors
# Push lagi
```

### Missing Dependencies

**Error: "Cannot find module..."**
```bash
# Pastikan semua dependencies ada di package.json
pnpm install
git add package.json pnpm-lock.yaml
git commit -m "Update dependencies"
git push
```

### Large Bundle Size

Jika bundle terlalu besar:
1. Check build output: `pnpm build`
2. Consider code splitting
3. Remove unused dependencies
4. Use dynamic imports

### CORS atau Headers Issues

File `vercel.json` sudah include headers yang diperlukan untuk:
- Cross-Origin-Embedder-Policy
- Cross-Origin-Opener-Policy

Ini diperlukan untuk SharedArrayBuffer (digunakan MediaPipe).

## Performance Tips

### 1. Enable Compression
Vercel otomatis enable gzip/brotli compression.

### 2. Caching
Static assets otomatis di-cache dengan optimal headers.

### 3. Edge Network
Aplikasi Anda akan di-serve dari Vercel Edge Network (CDN global).

### 4. Optimize Images
Jika menambahkan images:
```bash
pnpm add sharp
# Vercel akan auto-optimize images
```

## Update Production

```bash
# Make changes
git add .
git commit -m "Your update message"
git push

# Vercel auto-deploy dalam 2-3 menit
```

## Rollback

Jika ada masalah dengan deployment terbaru:

1. Buka Vercel Dashboard
2. Go to "Deployments"
3. Cari deployment sebelumnya yang working
4. Klik "..." menu
5. Klik "Promote to Production"

## Costs

### Free Tier Includes:
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Preview deployments
- ✅ Edge Network
- ✅ Analytics (basic)

Untuk hobby projects, free tier sudah sangat cukup!

## Checklist Sebelum Deploy

- [ ] `pnpm install` berhasil
- [ ] `pnpm build` berhasil
- [ ] Test di local preview
- [ ] Camera permission works
- [ ] Hand tracking works
- [ ] Face tracking works
- [ ] 3D visualization smooth
- [ ] Responsive di mobile
- [ ] README.md updated
- [ ] .gitignore configured
- [ ] Code di-push ke GitHub

## Link Resources

- Vercel Docs: https://vercel.com/docs
- Vite Deployment Guide: https://vitejs.dev/guide/static-deploy.html
- Vercel CLI Docs: https://vercel.com/docs/cli

## Support

Jika ada masalah:
1. Check Vercel build logs
2. Check browser console
3. Check Vercel status page: https://vercel-status.com
4. Vercel Discord: https://vercel.com/discord

---

**Happy Deploying! 🚀**
