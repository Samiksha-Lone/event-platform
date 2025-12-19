import { FiMoon, FiSun } from 'react-icons/fi';
import { useState } from 'react';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import Button from './Button';

export default function Navbar({ user, onNavigate, showThemeToggle = false, onLogout }) {
  const { theme, toggleTheme } = useTheme();
  

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-neutral-900/95 border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-300 supports-[backdrop-filter:blur()]:backdrop-blur-sm">
      <div className="container-padding">
        <div className="flex items-center justify-between h-20">
          <div className="flex-1">
            <button
              onClick={() => onNavigate('dashboard')}
              className="pl-5 text-3xl font-bold text-indigo-600 transition-all duration-200 dark:text-indigo-400 hover:opacity-80 active:scale-95"
              aria-label="Go to dashboard"
            >
              EventHub
            </button>
          </div>

          <div className="flex items-center gap-6">

              {/* Profile Icon with Dropdown */}
              <button
                onClick={() => onNavigate('user-dashboard')}
                className="p-5 transition-colors duration-200 rounded-full text-neutral-700 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                aria-label="Go to profile"
              >
                <FiUser size={24} />
              </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
