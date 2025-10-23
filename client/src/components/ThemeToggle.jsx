import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { themeManager } from '../services/userAPI';

const ThemeToggle = () => {
  const currentTheme = themeManager.getCurrentTheme();

  const handleThemeToggle = () => {
    const newTheme = themeManager.toggleTheme();
    // Optionally save to backend
    // userAPI.updateUserPreferences({ theme: newTheme });
  };

  return (
    <button
      onClick={handleThemeToggle}
      style={{
        background: 'rgba(255, 255, 255, 0.9)',
        border: '2px solid rgba(5, 150, 105, 0.6)',
        borderRadius: '0.75rem',
        padding: '0.75rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 8px rgba(5, 150, 105, 0.2)'
      }}
      onMouseEnter={(e) => {
        e.target.style.background = 'rgba(5, 150, 105, 0.1)';
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 4px 15px rgba(5, 150, 105, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.target.style.background = 'rgba(255, 255, 255, 0.9)';
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 2px 8px rgba(5, 150, 105, 0.2)';
      }}
      title={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} theme`}
    >
      {currentTheme === 'light' ? (
        <Moon size={20} style={{ color: '#059669' }} />
      ) : (
        <Sun size={20} style={{ color: '#f59e0b' }} />
      )}
    </button>
  );
};

export default ThemeToggle;
