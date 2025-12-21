// import { FiMoon, FiSun } from 'react-icons/fi';
// import { FiUser, FiLogOut } from 'react-icons/fi';
// import { useTheme } from '../context/ThemeContext';

// export default function Navbar({ 
//   user, 
//   onNavigate, 
//   showThemeToggle = false, 
//   showIconLogout = false,
//   onLogout, 
//   theme, 
//   toggleTheme 
// }) {
//   const { theme: contextTheme, toggleTheme: contextToggleTheme } = useTheme();
//   const activeTheme = theme !== undefined ? theme : contextTheme;
//   const handleToggle = toggleTheme || contextToggleTheme;
  
//   return (
//     <nav className="sticky top-0 z-50 bg-white/95 dark:bg-neutral-900/95 border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-300 supports-[backdrop-filter:blur()]:backdrop-blur-sm">
//       <div className="container-padding">
//         <div className="flex items-center justify-between h-20">
//           <div className="flex-1">
//             <button
//               onClick={() => onNavigate('dashboard')}
//               className="pl-5 text-3xl font-bold text-indigo-600 transition-all duration-200 dark:text-indigo-400 hover:opacity-80 active:scale-95"
//               aria-label="Go to dashboard"
//             >
//               EventHub
//             </button>
//           </div>

//           <div className="flex items-center gap-6">

//               {/* Theme Toggle */}
//               {showThemeToggle && (
//                 <button
//                   onClick={handleToggle}
//                   className="p-2.5 transition-colors duration-200 rounded-full text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
//                   aria-label="Toggle theme"
//                 >
//                   {activeTheme === 'dark' ? <FiSun size={22} /> : <FiMoon size={22} />}
//                 </button>
//               )}

//               {/* Profile Icon with Dropdown */}
//               <button
//                 onClick={() => onNavigate('user-dashboard')}
//                 className="p-5 transition-colors duration-200 rounded-full text-neutral-700 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
//                 aria-label="Go to profile"
//               >
//                 <FiUser size={24} />
//               </button>
              
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }



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

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            {showThemeToggle && (
              <button
                onClick={handleToggle}
                className="p-2.5 transition-colors duration-200 rounded-full text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                aria-label="Toggle theme"
              >
                {activeTheme === 'dark' ? <FiSun size={22} /> : <FiMoon size={22} />}
              </button>
            )}

            {/* Profile Icon */}
            <button
              onClick={() => onNavigate('user-dashboard')}
              className="p-3 transition-colors duration-200 rounded-full text-neutral-700 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Go to profile"
            >
              <FiUser size={22} />
            </button>

            {/* Red Logout Icon - only when requested (UserDashboard) */}
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
