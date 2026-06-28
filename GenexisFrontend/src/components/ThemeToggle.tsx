import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-cyan-500/30 hover:bg-white/20 dark:hover:bg-black/30 transition-all duration-300 group"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-6 h-6 text-cyan-400 group-hover:rotate-90 transition-transform duration-300" />
      ) : (
        <Moon className="w-6 h-6 text-blue-600 group-hover:-rotate-12 transition-transform duration-300" />
      )}
    </button>
  );
}
