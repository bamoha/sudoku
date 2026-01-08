import { useEffect, useState, useCallback } from 'react';
import { loadThemePreference, saveTheme, getEffectiveTheme } from '../utils/persistence';

/**
 * Theme toggle - shows current effective theme (light/dark)
 * System preference is applied automatically but UI just shows sun/moon
 */
export default function ThemeToggle() {
  const [preference, setPreference] = useState(() => loadThemePreference());
  const [effectiveTheme, setEffectiveTheme] = useState(() => getEffectiveTheme(preference));

  // Apply theme to document
  const applyTheme = useCallback((theme) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setEffectiveTheme(theme);
  }, []);

  // Handle system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (preference === 'system') {
        applyTheme(mediaQuery.matches ? 'dark' : 'light');
      }
    };

    // Apply initial theme
    applyTheme(getEffectiveTheme(preference));

    // Listen for system changes
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [preference, applyTheme]);

  // Toggle between light and dark (or set explicit preference if on system)
  const toggleTheme = () => {
    const nextTheme = effectiveTheme === 'dark' ? 'light' : 'dark';
    setPreference(nextTheme);
    saveTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-1.5 rounded-lg text-amber-500 dark:text-sky-300
                 bg-white dark:bg-slate-700
                 hover:bg-slate-100 dark:hover:bg-slate-600
                 active:scale-95
                 focus:outline-none focus:ring-2 focus:ring-teal-500
                 transition-all duration-150"
      aria-label={effectiveTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={effectiveTheme === 'dark' ? 'Light mode' : 'Dark mode'}
    >
      {effectiveTheme === 'dark' ? (
        // Sun icon for dark mode (click to go light)
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
        </svg>
      ) : (
        // Moon icon for light mode (click to go dark)
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
}
