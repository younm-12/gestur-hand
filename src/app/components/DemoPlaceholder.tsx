import { Camera, Rocket, AlertCircle } from 'lucide-react';

interface DemoPlaceholderProps {
  title: string;
  type: 'hand' | 'face';
}

export function DemoPlaceholder({ title, type }: DemoPlaceholderProps) {
  const features = type === 'hand'
    ? [
        'Real-time hand detection with MediaPipe',
        '21 landmark points per hand',
        'Track up to 2 hands simultaneously',
        'GPU-accelerated processing',
        'Visual feedback with connections'
      ]
    : [
        '468 facial landmark detection',
        '3D mesh visualization with Three.js',
        'Interactive 3D controls (rotate, zoom, pan)',
        'Real-time face tracking',
        'Split view: camera + 3D model'
      ];

  return (
    <div className="size-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-3xl w-full">
        {/* Demo Banner */}
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-2xl p-6 mb-8 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Preview Mode</h3>
              <p className="text-blue-200 text-sm leading-relaxed">
                The full {title} feature with MediaPipe AI and 3D visualization requires deployment to work properly.
                This is a preview showing what the app will do when deployed.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="inline-block p-6 bg-purple-500/20 rounded-full mb-4">
              <Camera className="w-16 h-16 text-purple-300" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">{title}</h1>
            <p className="text-purple-200 text-lg">
              Powered by MediaPipe AI & Three.js
            </p>
          </div>

          {/* Features List */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Features:</h3>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-green-400 mt-1 flex-shrink-0">✓</span>
                  <span className="text-purple-200">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* How It Works */}
          <div className="bg-black/20 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">How It Works:</h3>
            <ol className="space-y-2 text-purple-200 text-sm">
              <li>1. Requests camera access from your browser</li>
              <li>2. Loads MediaPipe AI models (~10-20MB, cached after first load)</li>
              <li>3. Processes video frames in real-time using GPU acceleration</li>
              <li>4. Displays {type === 'hand' ? 'hand landmarks and connections' : '3D facial mesh visualization'}</li>
              <li>5. All processing happens locally - no data sent to servers</li>
            </ol>
          </div>

          {/* Deploy Instructions */}
          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <Rocket className="w-8 h-8 text-green-400 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-3">Deploy to Use Full Features</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-green-200 font-semibold mb-1">Quick Deploy (2 minutes):</p>
                    <ol className="list-decimal list-inside space-y-1 text-green-100 ml-2">
                      <li>Push this code to GitHub</li>
                      <li>Go to <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">vercel.com</a> and login</li>
                      <li>Click "Add New Project" → Import your repo</li>
                      <li>Click "Deploy" (Vercel auto-detects settings)</li>
                      <li>Your app will be live at: your-app.vercel.app</li>
                    </ol>
                  </div>
                  <div className="pt-2 border-t border-green-500/30">
                    <p className="text-green-200">
                      <strong>Or use Vercel CLI:</strong>
                    </p>
                    <code className="block bg-black/40 rounded px-3 py-2 mt-2 text-green-300 font-mono text-xs">
                      pnpm add -g vercel && vercel --prod
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-6 text-center">
          <p className="text-purple-300 text-sm">
            Built with React • TypeScript • Tailwind CSS • MediaPipe • Three.js • Vite
          </p>
        </div>
      </div>
    </div>
  );
}
