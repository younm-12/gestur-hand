import { useEffect, useRef, useState } from 'react';
import { HandLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision';

export function HandTracking() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [handCount, setHandCount] = useState(0);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const initializeHandTracking = async () => {
      try {
        // Initialize MediaPipe
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );

        const handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'GPU'
          },
          runningMode: 'VIDEO',
          numHands: 2,
          minHandDetectionConfidence: 0.5,
          minHandPresenceConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        handLandmarkerRef.current = handLandmarker;

        // Get camera access
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener('loadeddata', () => {
            setIsLoading(false);
            detectHands();
          });
        }
      } catch (err) {
        setError(`Error: ${err instanceof Error ? err.message : 'Failed to initialize'}`);
        setIsLoading(false);
      }
    };

    const detectHands = () => {
      if (!videoRef.current || !canvasRef.current || !handLandmarkerRef.current) {
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx || video.readyState !== 4) {
        animationFrameRef.current = requestAnimationFrame(detectHands);
        return;
      }

      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Detect hands
      const startTimeMs = performance.now();
      const results = handLandmarkerRef.current.detectForVideo(video, startTimeMs);

      setHandCount(results.landmarks.length);

      // Draw results
      const drawingUtils = new DrawingUtils(ctx);

      for (const landmarks of results.landmarks) {
        // Draw connections
        drawingUtils.drawConnectors(
          landmarks,
          HandLandmarker.HAND_CONNECTIONS,
          { color: '#00FF00', lineWidth: 5 }
        );

        // Draw landmarks
        drawingUtils.drawLandmarks(landmarks, {
          color: '#FF0000',
          lineWidth: 2,
          radius: 5
        });
      }

      animationFrameRef.current = requestAnimationFrame(detectHands);
    };

    initializeHandTracking();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (handLandmarkerRef.current) {
        handLandmarkerRef.current.close();
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-black">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-white text-xl">Loading hand tracking model...</div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-red-500 text-xl">{error}</div>
        </div>
      )}

      <div className="relative w-full max-w-6xl">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-auto"
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>

      <div className="mt-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
        <p className="text-white text-lg font-semibold">
          Hands detected: <span className="text-green-400">{handCount}</span>
        </p>
        <p className="text-white/70 text-sm mt-2">
          Show your hands to the camera for real-time tracking
        </p>
      </div>
    </div>
  );
}
