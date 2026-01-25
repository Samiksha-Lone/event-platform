/* eslint-disable no-undef */
import React from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 transition-colors duration-500 bg-white dark:bg-neutral-950">
          <div className="w-full max-w-md p-8 text-center transition-all duration-500 bg-white border shadow-lofted hover:shadow-premium dark:bg-neutral-900 rounded-2xl border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 text-red-500 rounded-full bg-red-50 dark:bg-red-900/10">
              <AlertTriangle size={32} />
            </div>
            
            <h1 className="mb-2 text-2xl font-bold text-neutral-900 dark:text-white font-display">
              Something went wrong
            </h1>
            <p className="mb-8 text-neutral-600 dark:text-neutral-400">
              An unexpected error occurred. Don't worry, your data is safe. Let's try to get you back on track.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReload}
                className="flex items-center justify-center gap-2 px-6 py-3 font-bold text-white transition-all bg-indigo-600 shadow-lg rounded-xl hover:bg-indigo-700 active:scale-95 shadow-indigo-500/20"
              >
                <RefreshCw size={18} />
                Reload Page
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center gap-2 px-6 py-3 font-bold transition-all border-2 rounded-xl text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 active:scale-95"
              >
                <Home size={18} />
                Go to Dashboard
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <div className="p-4 mt-8 overflow-auto text-left border rounded-lg bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 max-h-40">
                <p className="font-mono text-xs text-red-500">
                  {this.state.error && this.state.error.toString()}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
