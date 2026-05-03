import React from 'react';
import { BookOpen, Calendar, Moon, Sun } from 'lucide-react';
import { SESSION_DATE } from '../types';

interface Props {
  darkMode: boolean;
  toggleDarkMode: () => void;
  onHomeClick: () => void;
  isAdminMode: boolean;
}

const Header: React.FC<Props> = ({ darkMode, toggleDarkMode, onHomeClick, isAdminMode }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-row items-center justify-between">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={onHomeClick}>
            <div className={`p-2.5 rounded-xl shadow-lg transition-all duration-300 ${isAdminMode ? 'bg-slate-800 shadow-slate-500/20' : 'bg-gradient-to-br from-primary-600 to-blue-700 shadow-primary-600/20 group-hover:scale-105'}`}>
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {isAdminMode ? 'Espace Administrateur' : 'Séance de Révision'}
              </h1>
              <p className="text-primary-600 dark:text-primary-400 text-xs font-medium">
                {isAdminMode ? 'Gestion des inscriptions' : 'Inscription & Validation'}
              </p>
            </div>
          </div>
          
          {/* Right Actions */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* Date Badge (Hide in Admin) */}
            {!isAdminMode && (
              <div className="hidden md:flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 transition-colors">
                <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">{SESSION_DATE}</span>
              </div>
            )}

            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;