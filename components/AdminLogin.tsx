import React, { useState } from 'react';
import { Lock, ArrowRight, X } from 'lucide-react';

interface Props {
  onLogin: () => void;
  onCancel: () => void;
}

const AdminLogin: React.FC<Props> = ({ onLogin, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // HARDCODED PASSWORD FOR DEMO
    if (password === 'admin123') {
      onLogin();
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-auto border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in duration-300 relative">
      <button 
        onClick={onCancel}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex justify-center mb-6">
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
            <Lock className="w-8 h-8 text-slate-700 dark:text-slate-300" />
        </div>
      </div>

      <h2 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-2">Accès Administrateur</h2>
      <p className="text-sm text-center text-slate-500 dark:text-slate-400 mb-6">
        Veuillez saisir le code de sécurité pour accéder au tableau de bord.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            placeholder="Code d'accès"
            autoFocus
            className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500'} bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all text-center tracking-widest font-mono text-lg`}
          />
          {error && <p className="text-red-500 text-xs text-center mt-2 font-medium">Code incorrect. Essayez "admin123"</p>}
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center py-3 px-4 rounded-xl font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-all transform active:scale-[0.98]"
        >
          Connexion <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;