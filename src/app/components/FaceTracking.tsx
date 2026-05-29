import { useEffect, useRef, useState } from 'react';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';

interface FaceMesh3DProps {
  landmarks: Array<{ x: number; y: number; z: number }>;
}

function FaceMesh3D({ landmarks }: FaceMesh3DProps) {
  if (landmarks.length === 0) return null;

  // Convert normalized coordinates to 3D space
  const points = landmarks.map(
    (landmark) =>
      new THREE.Vector3(
        (landmark.x - 0.5) * 2,
        -(landmark.y - 0.5) * 2,
        landmark.z * 2
      )
  );

  // Face mesh connections (simplified version)
  const connections = [
    // Face outline
    ...Array.from({ length: 16 }, (_, i) => [i, i + 1]),
    // Lips outer
    [61, 146], [146, 91], [91, 181], [181, 84], [84, 17],
    [17, 314], [314, 405], [405, 321], [321, 375], [375, 291],
    // Eyes
    [33, 246], [246, 161], [161, 160], [160, 159], [159, 158],
    [158, 157], [157, 173], [173, 133], [133, 155], [155, 154],
    [154, 153], [153, 145], [145, 144], [144, 163], [163, 7],
    [362, 398], [398, 384], [384, 385], [385, 386], [386, 387],
    [387, 388], [388, 466], [466, 263], [263, 249], [249, 390],
    [390, 373], [373, 374], [374, 380], [380, 381], [381, 382],
    // Nose
    [168, 6], [6, 197], [197, 195], [195, 5],
    [4, 1], [1, 19], [19, 94], [94, 2],
  ];

  return (
    <group>
      {/* Draw landmarks as points */}
      {points.map((point, index) => (
        <mesh key={index} position={point}>
          <sphereGeometry args={[0.01, 8, 8]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} />
        </mesh>
      ))}

      {/* Draw connections */}
      {connections.map((connection, index) => {
        const [start, end] = connection;
        if (start >= points.length || end >= points.length) return null;
        return (
          <Line
            key={index}
            points={[points[start], points[end]]}
            color="#00ff00"
            lineWidth={2}
          />
        );
      })}

      {/* Add a semi-transparent face mesh */}
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color="#ff00ff"
          transparent
          opacity={0.1}
          wireframe
        />
      </mesh>
    </group>
  );
}

export function FaceTracking() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [landmarks, setLandmarks] = useState<Array<{ x: number; y: number; z: number }>>([]);
  const [faceDetected, setFaceDetected] = useState(false);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const initializeFaceTracking = async () => {
      try {
        // Initialize MediaPipe
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );

        const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
            delegate: 'GPU'
          },
          runningMode: 'VIDEO',
          numFaces: 1,
          minFaceDetectionConfidence: 0.5,
          minFacePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
          outputFaceBlendshapes: true,
          outputFacialTransformationMatrixes: true
        });

        faceLandmarkerRef.current = faceLandmarker;

        // Get camera access
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener('loadeddata', () => {
            setIsLoading(false);
            detectFace();
          });
        }
      } catch (err) {
        setError(`Error: ${err instanceof Error ? err.message : 'Failed to initialize'}`);
        setIsLoading(false);
      }
    };

    const detectFace = () => {
      if (!videoRef.current || !faceLandmarkerRef.current) {
        return;
      }

      const video = videoRef.current;

      if (video.readyState !== 4) {
        animationFrameRef.current = requestAnimationFrame(detectFace);
        return;
      }

      // Detect face
      const startTimeMs = performance.now();
      const results = faceLandmarkerRef.current.detectForVideo(video, startTimeMs);

      if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        setLandmarks(results.faceLandmarks[0]);
        setFaceDetected(true);
      } else {
        setFaceDetected(false);
      }

      animationFrameRef.current = requestAnimationFrame(detectFace);
    };

    initializeFaceTracking();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (faceLandmarkerRef.current) {
        faceLandmarkerRef.current.close();
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full flex bg-black">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-white text-xl">Loading face tracking model...</div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-red-500 text-xl">{error}</div>
        </div>
      )}

      {/* Camera feed */}
      <div className="w-1/2 relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 p-3 bg-black/50 rounded-lg backdrop-blur-sm">
          <p className="text-white text-sm font-semibold">
            Face: <span className={faceDetected ? 'text-green-400' : 'text-red-400'}>
              {faceDetected ? 'Detected' : 'Not Detected'}
            </span>
          </p>
          {faceDetected && (
            <p className="text-white/70 text-xs mt-1">
              Landmarks: {landmarks.length}
            </p>
          )}
        </div>
      </div>

      {/* 3D visualization */}
      <div className="w-1/2 relative">
        <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          <FaceMesh3D landmarks={landmarks} />

          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
          />

          {/* Grid helper */}
          <gridHelper args={[10, 10, '#444444', '#222222']} />
        </Canvas>

        <div className="absolute bottom-4 left-4 p-3 bg-black/50 rounded-lg backdrop-blur-sm">
          <p className="text-white text-xs">
            Drag to rotate • Scroll to zoom • Right-click to pan
          </p>
        </div>

        {!faceDetected && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white/50 text-center">
              <p className="text-xl font-semibold">No face detected</p>
              <p className="text-sm mt-2">Position your face in front of the camera</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
