import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  Calendar,
  Video,
  MapPin,
  Loader2,
  Clock,
} from "lucide-react";
import { SESSION_DATE, UserData } from "../types";
import * as api from "../services/api";

interface Props {
  userData: UserData;
}

const SuccessMessage: React.FC<Props> = ({ userData }) => {
  const [meetLink, setMeetLink] = useState<string>("");
  const [loadingLink, setLoadingLink] = useState(true);

  useEffect(() => {
    const fetchLink = async () => {
      const link = await api.getMeetLink();
      setMeetLink(link);
      setLoadingLink(false);
    };
    fetchLink();
  }, []);

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
        L'accès pour{" "}
        <span className="font-semibold text-slate-900 dark:text-white">
          {userData.email}
        </span>{" "}
        est confirmé.
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
                Dates
              </p>
              <p className="text-slate-800 dark:text-slate-200 font-medium">
                {SESSION_DATE}
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-white dark:bg-slate-700 p-2 rounded-lg mr-3 shadow-sm text-primary-600 dark:text-primary-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Durée & Fréquence
              </p>
              <p className="text-slate-800 dark:text-slate-200 font-medium">
                1h30 par jour
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Programme intensif sur 15 jours
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
                Distanciel / En ligne
              </p>
              <p className="text-xs text-slate-400 mt-1">Via Google Meet</p>
            </div>
          </div>
        </div>
      </div>

      {loadingLink ? (
        <div className="w-full py-4 flex justify-center">
          <Loader2 className="animate-spin text-slate-400" />
        </div>
      ) : (
        <a
          href={meetLink || "#"}
          target={meetLink ? "_blank" : "_self"}
          rel="noopener noreferrer"
          onClick={(e) => !meetLink && e.preventDefault()}
          className={`group inline-flex items-center justify-center w-full px-5 py-3.5 text-sm font-bold text-white transition-all rounded-xl 
            ${
              meetLink
                ? "bg-[#00796B] hover:bg-[#00695C] shadow-lg shadow-[#00796B]/30"
                : "bg-slate-400 cursor-not-allowed opacity-75"
            }`}
        >
          <div className="bg-white rounded p-0.5 mr-2">
            <Video
              className={`w-4 h-4 ${meetLink ? "text-[#00796B]" : "text-slate-400"}`}
            />
          </div>
          {meetLink
            ? "Rejoindre la réunion via Google Meet"
            : "Lien de réunion bientôt disponible"}
        </a>
      )}

      {meetLink && (
        <p className="text-xs text-slate-400 mt-3">
          Assurez-vous d'avoir un compte Google pour vous connecter.
        </p>
      )}
    </div>
  );
};

export default SuccessMessage;
