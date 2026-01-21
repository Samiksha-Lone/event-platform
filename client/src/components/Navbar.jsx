import { FiMoon, FiSun } from 'react-icons/fi';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ 
  user, 
  onNavigate, 
  showThemeToggle = false, 
  showIconLogout = false,
  onLogout,
  theme,
  toggleTheme,
}) {
  const { theme: contextTheme, toggleTheme: contextToggleTheme } = useTheme();
  const activeTheme = theme !== undefined ? theme : contextTheme;
  const handleToggle = toggleTheme || contextToggleTheme;

  return (
    <nav className="sticky top-0 z-50 glass-surface transition-all duration-300">
      <div className="container-padding">
        <div className="flex items-center justify-between h-14">
          <div className="flex-1">
            <button
              onClick={() => onNavigate('dashboard')}
              className="pl-5 text-2xl font-black text-indigo-600 transition-all duration-200 dark:text-indigo-400 hover:opacity-80 active:scale-95 tracking-tight"
              style={{ fontFamily: 'Outfit, sans-serif' }}
              aria-label="Go to dashboard"
            >
              EventHub
            </button>
          </div>

          <div className="flex items-center gap-4">
            {showThemeToggle && (
              <button
                onClick={handleToggle}
                className="p-2.5 transition-colors duration-200 rounded-full text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                aria-label="Toggle theme"
              >
                {activeTheme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>
            )}

            <button
              onClick={() => onNavigate('user-dashboard')}
              className="p-2 transition-colors duration-200 rounded-full text-neutral-700 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Go to profile"
            >
              <FiUser size={20} />
            </button>

            {user && showIconLogout && onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="p-2.5 rounded-full border border-red-200 dark:border-red-700
                           text-red-600 dark:text-red-400
                           hover:bg-red-50 dark:hover:bg-red-900/30
                           transition-colors"
                aria-label="Logout"
                title="Logout"
              >
                <FiLogOut size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
