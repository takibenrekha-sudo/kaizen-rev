import React from 'react';
import { Send, Clock, AlertTriangle } from 'lucide-react';
import { UserData } from '../types';

interface Props {
  userData: UserData;
}

const ReceiptSentMessage: React.FC<Props> = ({ userData }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl shadow-primary-500/10 dark:shadow-none p-10 max-w-lg w-full mx-auto border border-slate-100 dark:border-slate-800 text-center animate-in fade-in zoom-in duration-500 relative overflow-hidden">
        
       {/* Background Accent */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-orange-500" />

      <div className="flex justify-center mb-6">
        <div className="rounded-full bg-indigo-50 dark:bg-indigo-900/20 p-5 relative">
          <Send className="h-10 w-10 text-indigo-600 dark:text-indigo-400 ml-1 mt-1" />
          <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-800 rounded-full p-1.5 shadow-md border border-slate-100 dark:border-slate-700">
             <Clock className="h-5 w-5 text-amber-500" />
          </div>
        </div>
      </div>
      
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Reçu envoyé !</h2>
      <p className="text-slate-600 dark:text-slate-300 mb-8">
        Merci <span className="font-semibold text-slate-900 dark:text-white">{userData.prenom}</span>, nous traitons votre demande.
      </p>

      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-xl p-6 mb-8 text-left">
        <h3 className="text-amber-800 dark:text-amber-400 font-bold mb-3 flex items-center text-sm uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Statut : En attente
        </h3>
        <p className="text-amber-900/80 dark:text-amber-200/80 text-sm leading-relaxed">
          Votre reçu est en cours de vérification manuelle. Vous recevrez la confirmation finale à l'adresse <span className="font-semibold underline decoration-amber-300 dark:decoration-amber-700 underline-offset-2">{userData.email}</span> sous 24h.
        </p>
      </div>

      <div className="text-xs text-slate-400 dark:text-slate-600">
        <p>Identifiant de transaction: <span className="font-mono">{Math.random().toString(36).substr(2, 9).toUpperCase()}</span></p>
      </div>
    </div>
  );
};

export default ReceiptSentMessage;