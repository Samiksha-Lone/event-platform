import AppRoutes from './routes/AppRoutes';
import { AppProvider } from './context/AppProvider';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <div className="min-h-screen bg-neutral-100 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50 shadow-premium animate-fade-in">
            <AppProvider>
              <AppRoutes />
            </AppProvider>
          </div>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
