'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    // Check initial state
    if (document.documentElement.classList.contains('light')) {
      setIsLight(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isLight) {
      document.documentElement.classList.remove('light');
      setIsLight(false);
    } else {
      document.documentElement.classList.add('light');
      setIsLight(true);
    }
  };

  return (
    <button 
      onClick={toggleTheme} 
      className="px-3 py-1 rounded bg-black/50 border border-white/10 text-xs font-mono uppercase tracking-widest text-gray-300 hover:border-primary/50 hover:text-primary transition-colors"
    >
      {isLight ? 'Dark Mode' : 'Light Mode'}
    </button>
  );
}
