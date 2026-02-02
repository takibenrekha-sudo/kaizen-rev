import React from "react";
import { CheckCircle, Calendar, Facebook, MapPin } from "lucide-react";
import { SESSION_DATE, FACEBOOK_LINK, UserData } from "../types";

interface Props {
  userData: UserData;
}

const SuccessMessage: React.FC<Props> = ({ userData }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl shadow-emerald-500/10 dark:shadow-none p-10 max-w-lg w-full mx-auto border border-slate-100 dark:border-slate-800 text-center animate-in fade-in zoom-in duration-500 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500" />

      <div className="flex justify-center mb-6 relative">
        <div className="absolute inset-0 bg-emerald-400/20 blur-xl rounded-full"></div>
        <div className="rounded-full bg-emerald-50 dark:bg-emerald-900/20 p-4 relative z-10 ring-8 ring-emerald-50 dark:ring-emerald-900/10">
          <CheckCircle className="h-16 w-16 text-emerald-500 dark:text-emerald-400" />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
        Inscription Validée
      </h2>
      <p className="text-slate-600 dark:text-slate-300 mb-8">
        Bienvenue{" "}
        <span className="font-semibold text-slate-900 dark:text-white">
          {userData.prenom}
        </span>
        . Votre place est confirmée gratuitement.
      </p>

      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 mb-8 text-left border border-slate-200 dark:border-slate-700">
        <h3 className="text-slate-900 dark:text-white font-semibold mb-4 text-sm uppercase tracking-wider">
          Détails de la séance
        </h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-white dark:bg-slate-700 p-2 rounded-lg mr-3 shadow-sm text-primary-600 dark:text-primary-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Date & Heure
              </p>
              <p className="text-slate-800 dark:text-slate-200 font-medium">
                {SESSION_DATE}
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-white dark:bg-slate-700 p-2 rounded-lg mr-3 shadow-sm text-primary-600 dark:text-primary-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Lieu</p>
              <p className="text-slate-800 dark:text-slate-200 font-medium">
                Salle de conférence principale
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Lien Zoom envoyé par mail si distanciel
              </p>
            </div>
          </div>
        </div>
      </div>

      <a
        href={FACEBOOK_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-full px-5 py-3.5 text-sm font-bold text-white transition-all bg-[#1877F2] rounded-xl hover:bg-[#166fe5] hover:shadow-lg hover:shadow-[#1877F2]/30 focus:ring-4 focus:ring-[#1877F2]/50"
      >
        <Facebook className="w-5 h-5 mr-2" />
        Rejoindre notre page Facebook
      </a>
    </div>
  );
};

export default SuccessMessage;
