import Button from './Button';
import { FiMoon, FiSun } from 'react-icons/fi';

export default function Navbar({ user, onNavigate, onThemeToggle, theme, onLogout }) {
  return (
    <nav className="sticky top-0 z-50 transition-colors duration-300 bg-white border-b dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
      <div className="w-full px-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-20">
          <div className="flex-1">
            <button onClick={() => onNavigate('dashboard')} className="text-3xl font-bold text-indigo-600 transition-opacity dark:text-indigo-500 hover:opacity-80">
              EventHub
            </button>
          </div>

          <div className="flex items-center gap-6">

            <button
              onClick={onThemeToggle}
              className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              style={{ pointerEvents: 'auto' }}
              type="button"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <FiMoon size={24} className="text-neutral-700 dark:text-neutral-300" />
              ) : (
                <FiSun size={24} className="text-yellow-500 dark:text-yellow-400" />
              )}
            </button>

            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate('user-dashboard')}
                className="px-4 py-2 text-lg font-semibold transition-colors text-neutral-700 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                {user?.name}
              </button>
              <Button onClick={onLogout} variant="secondary" className="text-base px-6 py-2.5">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
