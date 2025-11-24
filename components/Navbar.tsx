import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { language, setLanguage, theme, setTheme, t } = useApp();

  const isActive = (path: string) => location.pathname === path;

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center transform rotate-45 shadow-[0_0_15px_rgba(37,99,235,0.5)]">
            <div className="w-4 h-4 bg-white transform -rotate-45 rounded-sm"></div>
          </div>
          <span className="text-xl font-bold tracking-wider text-slate-900 dark:text-white">
            CESIUM<span className="text-blue-500">X</span>
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-8">
        <Link 
          to="/" 
          className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
        >
          {t.nav.home}
        </Link>
        <Link 
          to="/showcase" 
          className={`text-sm font-medium transition-colors ${isActive('/showcase') ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
        >
          {t.nav.showcase}
        </Link>
        <a 
          href="https://cesium.com/docs/" 
          target="_blank" 
          rel="noreferrer"
          className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          {t.nav.docs}
        </a>
      </div>
      
      <div className="flex items-center gap-4">
         {/* Theme Toggle */}
         <button 
           onClick={toggleTheme}
           className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
           title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
         >
           {theme === 'dark' ? (
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
           ) : (
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
           )}
         </button>

         {/* Language Toggle */}
         <button 
           onClick={toggleLanguage}
           className="px-2 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-bold transition-colors"
         >
           {language === 'en' ? '中' : 'EN'}
         </button>

         <button className="hidden md:block px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-all shadow-[0_0_10px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]">
           {t.nav.getStarted}
         </button>
      </div>
    </nav>
  );
};