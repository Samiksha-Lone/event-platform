import AppRoutes from './routes/AppRoutes';
import { AppProvider } from './context/AppProvider';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-neutral-100 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </div>
    </ThemeProvider>
  );
}
