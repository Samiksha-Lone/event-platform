import AppRoutes from './routes/AppRoutes';
import { AppProvider } from './context/AppProvider';

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}
