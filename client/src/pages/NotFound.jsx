import { useNavigate } from 'react-router-dom';
import { Ghost, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAppContext } from '../context/AppProvider';

export default function NotFound() {
  const navigate = useNavigate();
  const { user } = useAppContext();

  return (
    <div className="min-h-screen transition-colors duration-500 bg-white dark:bg-neutral-950">
      <Navbar user={user} onNavigate={(p) => navigate(p === 'dashboard' ? '/dashboard' : `/${p}`)} onLogout={() => navigate('/login')} />
      
      <div className="flex flex-col items-center justify-center min-h-[calc(100-80px)] p-6">
        <div className="relative mb-8 text-indigo-500 dark:text-indigo-400">
          <Ghost size={120} className="animate-bounce" />
          <div className="absolute bottom-0 w-24 h-4 mx-auto bg-neutral-200 dark:bg-neutral-800 rounded-full blur-xl left-1/2 -translate-x-1/2" />
        </div>

        <h1 className="mb-4 text-6xl font-black transition-colors duration-500 text-neutral-900 dark:text-white font-display">
          404
        </h1>
        <h2 className="mb-4 text-2xl font-bold transition-colors duration-500 text-neutral-800 dark:text-neutral-200">
          Page Not Found
        </h2>
        <p className="max-w-md mb-10 text-center transition-colors duration-500 text-neutral-600 dark:text-neutral-400">
          The event you're looking for might have been moved, canceled, or taken by a ghost. Let's get you back.
        </p>

        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-8 py-4 font-bold text-white transition-all bg-indigo-600 rounded-2xl hover:bg-indigo-700 active:scale-95 shadow-xl shadow-indigo-500/20"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
