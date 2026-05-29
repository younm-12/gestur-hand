# Dokumentasi Fitur

## Overview

Aplikasi AI Vision Tracking ini menyediakan 2 mode utama:
1. **Hand Tracking** - Deteksi dan tracking tangan real-time
2. **Face Tracking 3D** - Deteksi wajah dengan visualisasi 3D interaktif

## Arsitektur Aplikasi

```
src/
├── app/
│   ├── App.tsx                    # Main app dengan navigation
│   └── components/
│       ├── HandTracking.tsx       # Komponen hand tracking
│       └── FaceTracking.tsx       # Komponen face tracking + 3D
```

## Detail Fitur

### 1. Hand Tracking

**Teknologi**: MediaPipe Hand Landmarker

**Capabilities**:
- Deteksi hingga 2 tangan secara simultan
- 21 landmark points per tangan
- Real-time tracking dengan latency minimal
- Visual feedback dengan lines dan points

**Landmarks yang Dideteksi**:
```
0: WRIST
1-4: THUMB (CMC, MCP, IP, TIP)
5-8: INDEX_FINGER (MCP, PIP, DIP, TIP)
9-12: MIDDLE_FINGER (MCP, PIP, DIP, TIP)
13-16: RING_FINGER (MCP, PIP, DIP, TIP)
17-20: PINKY (MCP, PIP, DIP, TIP)
```

**Konfigurasi**:
```typescript
{
  runningMode: 'VIDEO',
  numHands: 2,
  minHandDetectionConfidence: 0.5,
  minHandPresenceConfidence: 0.5,
  minTrackingConfidence: 0.5
}
```

**Use Cases**:
- Gesture recognition
- Sign language detection
- Hand-based UI controls
- Gaming controls
- Virtual try-on applications

### 2. Face Tracking 3D

**Teknologi**: MediaPipe Face Landmarker + Three.js

**Capabilities**:
- 468 facial landmarks detection
- Real-time 3D mesh reconstruction
- Interactive 3D viewer (rotate, zoom, pan)
- Split-screen view (camera + 3D model)

**Facial Landmarks Coverage**:
- Face outline (17 points)
- Eyes (71 points each)
- Eyebrows (10 points each)
- Nose (28 points)
- Lips outer (40 points)
- Lips inner (20 points)
- Face oval (36 points)

**Konfigurasi**:
```typescript
{
  runningMode: 'VIDEO',
  numFaces: 1,
  minFaceDetectionConfidence: 0.5,
  minFacePresenceConfidence: 0.5,
  minTrackingConfidence: 0.5,
  outputFaceBlendshapes: true,
  outputFacialTransformationMatrixes: true
}
```

**3D Visualization**:
- Interactive orbit controls
- Sphere landmarks dengan emissive glow
- Line connections antar landmarks
- Grid helper untuk referensi spatial
- Wireframe sphere overlay

**Use Cases**:
- Face filters
- AR makeup
- Expression analysis
- Face mesh untuk 3D avatars
- Animation reference

## Komponen React

### HandTracking Component

**Props**: None

**State**:
- `isLoading`: Loading state saat initialize model
- `error`: Error messages
- `handCount`: Jumlah tangan terdeteksi

**Lifecycle**:
1. Mount → Initialize MediaPipe
2. Request camera access
3. Start detection loop
4. Unmount → Cleanup camera & model

**Performance**:
- ~30-60 FPS tergantung device
- GPU acceleration enabled
- Canvas rendering dengan requestAnimationFrame

### FaceTracking Component

**Props**: None

**State**:
- `isLoading`: Loading state
- `error`: Error messages
- `landmarks`: Array 468 facial points
- `faceDetected`: Boolean face presence

**Sub-components**:
- `FaceMesh3D`: Pure 3D visualization component

**Lifecycle**:
1. Mount → Initialize MediaPipe
2. Request camera access
3. Start detection loop
4. Update 3D mesh setiap frame
5. Unmount → Cleanup

**Performance**:
- Split rendering: video + 3D canvas
- Efficient Three.js mesh updates
- OrbitControls untuk interactivity

## Tech Stack Details

### MediaPipe Tasks Vision

**Version**: ^0.10.35

**Why MediaPipe?**:
- ✅ State-of-the-art accuracy
- ✅ Optimized untuk web (WebAssembly)
- ✅ GPU acceleration
- ✅ Pre-trained models
- ✅ Google-maintained
- ✅ No server required (runs in browser)

**Model Files**:
- Hand Landmarker: ~10MB
- Face Landmarker: ~15MB
- Loaded from CDN (cached after first load)

### Three.js + React Three Fiber

**Packages**:
- `three`: Core 3D library
- `@react-three/fiber`: React renderer untuk Three.js
- `@react-three/drei`: Helper components

**Why Three.js?**:
- ✅ Industry standard untuk web 3D
- ✅ Powerful rendering capabilities
- ✅ Large ecosystem
- ✅ React integration available
- ✅ WebGL based (hardware accelerated)

### Camera Access

**API Used**: WebRTC `getUserMedia()`

**Configuration**:
```typescript
{
  video: {
    width: 1280,
    height: 720
  }
}
```

**Browser Permissions**:
- Requires HTTPS (atau localhost untuk development)
- User must grant camera permission
- Permission persists per domain

## Performance Optimization

### 1. Lazy Loading
- MediaPipe models loaded from CDN
- Cached after first load
- Loading states untuk UX

### 2. GPU Acceleration
```typescript
delegate: 'GPU'  // MediaPipe config
```

### 3. Frame Rate
- Uses `requestAnimationFrame`
- Adaptive frame rate based on device capability
- No unnecessary re-renders

### 4. Memory Management
- Proper cleanup di useEffect return
- Stop camera streams on unmount
- Close MediaPipe instances

### 5. Bundle Size
- Tree shaking enabled (Vite)
- Modern ES modules
- Code splitting ready

## Browser Compatibility

### Required Features
- ✅ WebRTC (getUserMedia)
- ✅ WebAssembly
- ✅ WebGL 2.0
- ✅ ES6+ JavaScript

### Supported Browsers
| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14.1+ | ✅ Supported* |
| Opera | 76+ | ✅ Supported |

*Safari: May require user interaction for camera access

### Mobile Support
- ✅ Chrome Android 90+
- ✅ Safari iOS 14.5+
- ⚠️ Performance varies by device
- ⚠️ Older devices may have reduced frame rate

## Security & Privacy

### Data Privacy
- ✅ **Zero server communication** untuk tracking
- ✅ All processing happens locally in browser
- ✅ No data storage
- ✅ No analytics tracking user video
- ✅ Camera access only when in use

### Content Security Policy
Headers di `vercel.json`:
```json
{
  "Cross-Origin-Embedder-Policy": "credentialless",
  "Cross-Origin-Opener-Policy": "same-origin"
}
```

Required untuk SharedArrayBuffer (MediaPipe dependency).

### HTTPS Requirement
- Camera access requires HTTPS
- Vercel provides automatic HTTPS
- Local development: localhost works

## Future Enhancements

### Possible Features
- [ ] Export 3D models (GLTF/OBJ)
- [ ] Record gestures/expressions
- [ ] Multi-person tracking
- [ ] Hand gesture commands
- [ ] Face filter effects
- [ ] AR overlays
- [ ] Performance metrics dashboard
- [ ] Custom model training
- [ ] Pose estimation integration
- [ ] Object detection mode

### Performance Improvements
- [ ] Web Workers untuk processing
- [ ] OffscreenCanvas
- [ ] WASM optimization
- [ ] Adaptive quality settings
- [ ] Frame skipping untuk low-end devices

## Troubleshooting

### Common Issues

**1. Camera not working**
- Check browser permissions
- Verify HTTPS connection
- Check console for errors
- Try different browser

**2. Model loading slow**
- First load requires internet
- Models cached after download
- Check network speed
- Try again after cache

**3. Low FPS / Lag**
- Close other GPU-intensive apps
- Reduce browser zoom
- Use Chrome for best performance
- Check device specs

**4. 3D view not rendering**
- Verify WebGL support: visit https://get.webgl.org
- Update graphics drivers
- Enable hardware acceleration in browser
- Check browser console for errors

### Debug Mode

Add to component untuk debugging:
```typescript
console.log('Landmarks:', results.landmarks);
console.log('FPS:', 1000 / deltaTime);
```

## API Reference

### HandTracking Component

```typescript
import { HandTracking } from './components/HandTracking';

<HandTracking />
```

No props required.

### FaceTracking Component

```typescript
import { FaceTracking } from './components/FaceTracking';

<FaceTracking />
```

No props required.

### MediaPipe Results Structure

**Hand Landmarker Result**:
```typescript
{
  landmarks: Array<Array<{x: number, y: number, z: number}>>,
  worldLandmarks: Array<Array<{x: number, y: number, z: number}>>,
  handednesses: Array<{categoryName: string, score: number}>
}
```

**Face Landmarker Result**:
```typescript
{
  faceLandmarks: Array<Array<{x: number, y: number, z: number}>>,
  faceBlendshapes: Array<Array<{categoryName: string, score: number}>>,
  facialTransformationMatrixes: Array<Matrix4x4>
}
```

## Resources

### Documentation
- MediaPipe: https://developers.google.com/mediapipe
- Three.js: https://threejs.org/docs
- React Three Fiber: https://docs.pmnd.rs/react-three-fiber

### Examples
- MediaPipe Examples: https://mediapipe-studio.webapps.google.com
- Three.js Examples: https://threejs.org/examples

### Community
- Three.js Discord: https://discord.gg/56GBJwAnUS
- MediaPipe GitHub: https://github.com/google/mediapipe

---

**Built with ❤️ using cutting-edge web technologies**
