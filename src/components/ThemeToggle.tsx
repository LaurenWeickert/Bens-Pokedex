import React from 'react';
import { Switch } from '@headlessui/react';
import { usePokemonStore } from '../store/pokemonStore';
import { FaSun, FaMoon } from 'react-icons/fa';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = usePokemonStore();
  const isDark = theme === 'dark';

  return (
    <div className="flex items-center gap-2">
      <div className={`${isDark ? 'opacity-50' : 'opacity-100'} transition-opacity`}>
        <FaSun className="w-6 h-6 text-yellow-500 animate-pulse" />
      </div>
      <Switch
        checked={isDark}
        onChange={toggleTheme}
        className={`${
          isDark ? 'bg-indigo-700' : 'bg-blue-400'
        } relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg`}
      >
        <span className="sr-only">Toggle day and night mode</span>
        <span
          className={`${
            isDark ? 'translate-x-9 bg-indigo-900' : 'translate-x-1 bg-yellow-100'
          } inline-block h-6 w-6 transform rounded-full transition-transform duration-300 shadow-md flex items-center justify-center text-xs`}
        >
          {isDark ? '🌙' : '☀️'}
        </span>
      </Switch>
      <div className={`${isDark ? 'opacity-100' : 'opacity-50'} transition-opacity`}>
        <FaMoon className="w-6 h-6 text-blue-300" />
      </div>
    </div>
  );
};
