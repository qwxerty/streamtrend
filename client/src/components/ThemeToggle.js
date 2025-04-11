import { useState, useEffect } from 'react';

function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-3 bg-gray-700/50 rounded-full text-gray-200 hover:bg-gray-600/50 transition-colors"
      aria-label="Przełącz motyw"
    >
      {isDark ? '🌞' : '🌙'}
    </button>
  );
}

export default ThemeToggle;