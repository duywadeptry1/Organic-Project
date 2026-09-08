import { useState, useEffect } from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';

/**
 * Professional Dark/Light Theme Toggle Component
 * - Manages theme state synced with localStorage and html.dark / data-theme
 * - Features celestial micro-animations (rotating sun rays & glowing moon)
 * - Multi-tab synchronization and accessibility support
 */
export function ThemeToggle({ className = '', variant = 'pill' }) {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from document or localStorage
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
    setMounted(true);

    // Sync across browser tabs
    const handleStorageChange = (e) => {
      if (e.key === 'organi_theme' && e.newValue) {
        applyTheme(e.newValue);
      }
    };

    // Listen to system preference changes if no manual preference is saved
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e) => {
      const saved = localStorage.getItem('organi_theme');
      if (!saved) {
        applyTheme(e.matches ? 'dark' : 'light', false);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    mediaQuery.addEventListener('change', handleSystemChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      mediaQuery.removeEventListener('change', handleSystemChange);
    };
  }, []);

  const applyTheme = (newTheme, saveToStorage = true) => {
    const isDark = newTheme === 'dark';
    setTheme(newTheme);

    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }

    if (saveToStorage) {
      try {
        localStorage.setItem('organi_theme', newTheme);
      } catch (e) {
        // Fallback if storage blocked
      }
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme, true);
  };

  if (!mounted) {
    // Render placeholder to avoid layout shift before client hydration
    return (
      <div className={`w-14 h-8 rounded-full bg-stone-200 dark:bg-stone-800 animate-pulse ${className}`} />
    );
  }

  const isDark = theme === 'dark';

  if (variant === 'compact') {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        onClick={toggleTheme}
        className={`group relative p-2 rounded-full border transition-all duration-300 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-green-500 active:scale-90 ${
          isDark
            ? 'bg-stone-900 border-stone-700 text-amber-300 hover:bg-stone-800 hover:border-amber-400/40 shadow-[0_0_15px_rgba(251,191,36,0.15)]'
            : 'bg-white border-stone-200 text-stone-700 hover:text-amber-600 hover:bg-amber-50/60 hover:border-amber-200 shadow-xs'
        } ${className}`}
        title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      >
        <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
          {isDark ? (
            <Moon className="w-4 h-4 transition-transform duration-500 rotate-0 scale-100 text-indigo-300 drop-shadow-[0_0_6px_rgba(165,180,252,0.6)]" />
          ) : (
            <Sun className="w-4 h-4 transition-transform duration-500 rotate-0 scale-100 text-amber-500 group-hover:rotate-45" />
          )}
        </div>
      </button>
    );
  }

  // Default 'pill' variant: Modern sliding switch with animated icons & celestial glows
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      onClick={toggleTheme}
      className={`group relative inline-flex items-center h-8 w-15 rounded-full p-0.5 transition-all duration-300 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 select-none active:scale-95 ${
        isDark
          ? 'bg-stone-800/90 border border-stone-700/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]'
          : 'bg-stone-200/90 border border-stone-300/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]'
      } ${className}`}
      title={`Currently in ${isDark ? 'Dark' : 'Light'} Mode. Click to toggle.`}
    >
      {/* Background celestial indicators */}
      <span className="sr-only">Toggle theme</span>
      
      {/* Left Icon (Sun - Light) */}
      <span
        className={`absolute left-1.5 flex items-center justify-center transition-opacity duration-300 ${
          isDark ? 'opacity-30 text-stone-500' : 'opacity-0 text-amber-500'
        }`}
      >
        <Sun className="w-3.5 h-3.5" />
      </span>

      {/* Right Icon (Moon - Dark) */}
      <span
        className={`absolute right-1.5 flex items-center justify-center transition-opacity duration-300 ${
          isDark ? 'opacity-0 text-indigo-300' : 'opacity-40 text-stone-500'
        }`}
      >
        <Moon className="w-3.5 h-3.5" />
      </span>

      {/* Sliding Thumb Knob */}
      <span
        className={`relative flex items-center justify-center w-6.5 h-6.5 rounded-full shadow-md transform transition-all duration-300 ease-out ${
          isDark
            ? 'translate-x-7 bg-linear-to-tr from-indigo-950 to-stone-900 border border-indigo-400/40 text-indigo-200 shadow-[0_0_12px_rgba(129,140,248,0.35)]'
            : 'translate-x-0.5 bg-linear-to-tr from-amber-400 to-yellow-300 border border-amber-200 text-stone-900 shadow-[0_2px_8px_rgba(245,158,11,0.3)]'
        }`}
      >
        {isDark ? (
          <div className="relative flex items-center justify-center">
            <Moon className="w-3.5 h-3.5 text-indigo-200 transition-transform duration-300 rotate-0" />
            <Sparkles className="w-2 h-2 text-indigo-300 absolute -top-1 -right-1 opacity-75 animate-pulse" />
          </div>
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-900 transition-transform duration-500 group-hover:rotate-45" />
        )}
      </span>
    </button>
  );
}

export default ThemeToggle;
