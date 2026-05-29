import { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="size-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-8">
          <div className="max-w-2xl w-full bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Module Loading Error
            </h2>
            <p className="text-red-200 mb-6">
              This feature requires additional modules that may not load in the preview environment.
            </p>
            <div className="bg-black/30 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-300 font-mono">
                {this.state.error?.message || 'Unknown error'}
              </p>
            </div>
            <div className="space-y-2 text-left text-white/80 text-sm">
              <p className="font-semibold text-white mb-2">To use this feature:</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Deploy this app to Vercel (see DEPLOY.md)</li>
                <li>Or run locally with: <code className="bg-black/30 px-2 py-1 rounded">pnpm install && pnpm dev</code></li>
                <li>Make sure you have a stable internet connection (for MediaPipe models)</li>
              </ol>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
